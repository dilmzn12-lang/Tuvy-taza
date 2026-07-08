import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Search, Plus, Minus, CreditCard, Banknote, Printer, ChefHat, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/lib/AuthContext";
import { db } from "@/lib/firebase";
import { getErrorMessage } from "@/lib/utils";
import { ErrorBanner } from "@/components/ErrorBanner";
import { collection, query, where, getDocs, addDoc, serverTimestamp } from "firebase/firestore";

interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  imageUrl?: string;
  available: boolean;
}

export function POSDashboard() {
  const { restaurantId } = useAuth();
  const [items, setItems] = useState<MenuItem[]>([]);
  const [categories, setCategories] = useState<string[]>(["All"]);
  const [activeCategory, setActiveCategory] = useState("All");
  const [cart, setCart] = useState<{item: MenuItem, quantity: number}[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sending, setSending] = useState(false);

  useEffect(() => {
    if (restaurantId) {
      loadMenu();
    }
  }, [restaurantId]);

  const loadMenu = async () => {
    if (!restaurantId) return;
    setError(null);
    setLoading(true);
    try {
      const q = query(collection(db, 'menuItems'), where('restaurantId', '==', restaurantId));
      const snapshot = await getDocs(q);
      const fetchedItems = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as MenuItem));
      setItems(fetchedItems);
      
      const cats = new Set(fetchedItems.map(i => i.category));
      setCategories(["All", ...Array.from(cats)]);
    } catch (e) {
      console.error("Error loading menu", e);
      setError(getErrorMessage(e, "Could not load the menu. Please try again."));
    } finally {
      setLoading(false);
    }
  };

  const addToCart = (item: MenuItem) => {
    setCart(prev => {
      const existing = prev.find(i => i.item.id === item.id);
      if (existing) {
        return prev.map(i => i.item.id === item.id ? { ...i, quantity: i.quantity + 1 } : i);
      }
      return [...prev, { item, quantity: 1 }];
    });
  };

  const removeFromCart = (id: string) => {
    setCart(prev => {
      const existing = prev.find(i => i.item.id === id);
      if (existing && existing.quantity > 1) {
        return prev.map(i => i.item.id === id ? { ...i, quantity: i.quantity - 1 } : i);
      }
      return prev.filter(i => i.item.id !== id);
    });
  };

  const handleSendToKitchen = async () => {
    if (cart.length === 0 || !restaurantId || sending) return;
    setSending(true);
    try {
      const orderData = {
        restaurantId,
        items: cart.map(c => ({
          id: c.item.id,
          name: c.item.name,
          quantity: c.quantity,
          price: c.item.price,
          status: 'pending'
        })),
        total,
        status: 'pending',
        type: 'walk-in',
        tableInfo: 'Walk-in',
        createdAt: serverTimestamp()
      };
      await addDoc(collection(db, 'orders'), orderData);
      setCart([]);
      alert("Order sent to kitchen!");
    } catch (e) {
      console.error("Error sending order", e);
      alert(getErrorMessage(e, "Could not send the order to the kitchen. Please try again."));
    } finally {
      setSending(false);
    }
  };

  const filteredItems = items.filter(item => activeCategory === "All" || item.category === activeCategory);
  
  const subtotal = cart.reduce((sum, {item, quantity}) => sum + (item.price * quantity), 0);
  const tax = subtotal * 0.08;
  const total = subtotal + tax;

  if (loading) {
    return <div className="min-h-screen bg-[#050505] flex items-center justify-center"><Loader2 className="w-8 h-8 text-amber-500 animate-spin" /></div>;
  }

  return (
    <div className="h-screen bg-[#050505] text-slate-300 flex overflow-hidden font-sans selection:bg-amber-500/20">
      {/* Menu Area */}
      <div className="flex-1 flex flex-col h-full border-r border-slate-800">
        <header className="h-16 border-b border-slate-800 flex items-center px-6 shrink-0 bg-[#080808]/80 backdrop-blur-md">
          <Link to="/dashboard" className="p-2 -ml-2 text-slate-400 hover:text-white transition-colors mr-4">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <h1 className="font-bold text-white text-lg">Point of Sale</h1>
          
          <div className="ml-auto relative w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input 
              type="text" 
              placeholder="Search items..." 
              className="w-full bg-slate-900/30 border border-slate-800 rounded-full pl-10 pr-4 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-amber-500/50"
            />
          </div>
        </header>

        {/* Categories */}
        <div className="p-4 flex gap-2 overflow-x-auto no-scrollbar border-b border-slate-800 shrink-0">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={cn(
                "px-5 py-2 rounded-full text-sm font-bold whitespace-nowrap transition-colors",
                activeCategory === cat ? "bg-amber-500 text-black" : "bg-slate-900/50 text-slate-400 hover:bg-slate-800 hover:text-white border border-slate-800"
              )}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Items Grid */}
        <div className="flex-1 overflow-y-auto p-6 bg-transparent">
          {error && <ErrorBanner message={error} onRetry={loadMenu} className="mb-4" />}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {filteredItems.map(item => (
              <button
                key={item.id}
                onClick={() => addToCart(item)}
                className="flex flex-col text-left p-4 rounded-2xl bg-[#080808] border border-slate-800 hover:border-amber-500/30 hover:bg-slate-900/50 transition-all active:scale-95"
              >
                <div className="flex-1">
                  <h3 className="font-bold text-white mb-1">{item.name}</h3>
                  <span className="text-xs text-slate-500">{item.category}</span>
                </div>
                <div className="mt-4 font-bold text-amber-500">
                  ${item.price.toFixed(2)}
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Cart/Ticket Area */}
      <div className="w-96 flex flex-col h-full bg-[#080808] border-l border-slate-800">
        <div className="p-6 border-b border-slate-800 flex items-center justify-between shrink-0">
          <div>
            <h2 className="font-bold text-white text-lg">Current Order</h2>
            <p className="text-xs text-slate-400">Order #1045 • Walk-in</p>
          </div>
          <button className="px-3 py-1.5 rounded-lg bg-slate-800 text-white text-xs font-bold hover:bg-slate-700 transition-colors">
            Assign Table
          </button>
        </div>

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {cart.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-slate-500 gap-4">
              <ChefHat className="w-12 h-12 opacity-20" />
              <p className="text-sm">No items in order</p>
            </div>
          ) : (
            cart.map(({item, quantity}) => (
              <div key={item.id} className="flex items-center gap-4 group">
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between mb-1">
                    <h4 className="font-bold text-white text-sm truncate">{item.name}</h4>
                    <span className="font-bold text-white text-sm ml-4">${(item.price * quantity).toFixed(2)}</span>
                  </div>
                  <p className="text-xs text-slate-500">${item.price.toFixed(2)} each</p>
                </div>
                <div className="flex items-center gap-3 bg-slate-800 rounded-lg p-1 border border-slate-700 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => removeFromCart(item.id)} className="p-1 hover:bg-slate-700 text-white rounded-md transition-colors"><Minus className="w-3 h-3" /></button>
                  <span className="text-sm font-medium w-4 text-center text-white">{quantity}</span>
                  <button onClick={() => addToCart(item)} className="p-1 hover:bg-slate-700 text-white rounded-md transition-colors"><Plus className="w-3 h-3" /></button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Totals & Payment */}
        <div className="p-6 border-t border-slate-800 bg-[#080808] shrink-0">
          <div className="space-y-2 text-sm text-slate-400 mb-6">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Tax (8%)</span>
              <span>${tax.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-lg font-bold text-white pt-2 border-t border-slate-800 mt-2">
              <span>Total</span>
              <span>${total.toFixed(2)}</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 mb-3">
            <button className="flex items-center justify-center gap-2 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 font-bold text-white transition-colors">
              <Banknote className="w-4 h-4" /> Cash
            </button>
            <button className="flex items-center justify-center gap-2 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-bold transition-colors">
              <CreditCard className="w-4 h-4" /> Card
            </button>
          </div>
          <button onClick={handleSendToKitchen} disabled={sending || cart.length === 0} className="w-full flex items-center justify-center gap-2 py-3 rounded-xl border border-slate-800 hover:bg-slate-800 text-slate-300 transition-colors font-bold text-sm disabled:opacity-50">
            {sending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Printer className="w-4 h-4" />}
            {sending ? "Sending..." : "Send to Kitchen"}
          </button>
        </div>
      </div>
    </div>
  );
}
