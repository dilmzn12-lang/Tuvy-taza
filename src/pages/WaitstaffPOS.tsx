import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Search, Plus, Minus, Send, Receipt, ChevronRight, User, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/lib/AuthContext";
import { db } from "@/lib/firebase";
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

export function WaitstaffPOS() {
  const { restaurantId } = useAuth();
  const [activeTab, setActiveTab] = useState("menu"); // menu, cart
  const [activeCategory, setActiveCategory] = useState("All");
  const [categories, setCategories] = useState<string[]>(["All"]);
  const [items, setItems] = useState<MenuItem[]>([]);
  const [cart, setCart] = useState<Array<{id: string, name: string, price: number, quantity: number}>>([]);
  const [table, setTable] = useState("T12");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (restaurantId) {
      loadMenu();
    }
  }, [restaurantId]);

  const loadMenu = async () => {
    if (!restaurantId) return;
    try {
      const q = query(collection(db, 'menuItems'), where('restaurantId', '==', restaurantId));
      const snapshot = await getDocs(q);
      const fetchedItems = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as MenuItem));
      setItems(fetchedItems);
      
      const cats = new Set(fetchedItems.map(i => i.category));
      setCategories(["All", ...Array.from(cats)]);
    } catch (e) {
      console.error("Error loading menu", e);
    } finally {
      setLoading(false);
    }
  };

  const addToCart = (item: MenuItem) => {
    setCart(prev => {
      const existing = prev.find(i => i.id === item.id);
      if (existing) {
        return prev.map(i => i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i);
      }
      return [...prev, { id: item.id, name: item.name, price: item.price, quantity: 1 }];
    });
  };

  const updateQuantity = (id: string, delta: number) => {
    setCart(prev => prev.map(item => {
      if (item.id === id) {
        const newQ = item.quantity + delta;
        return newQ > 0 ? { ...item, quantity: newQ } : item;
      }
      return item;
    }).filter(item => item.quantity > 0));
  };

  const cartTotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const handleSendToKitchen = async () => {
    if (cart.length === 0 || !restaurantId || submitting) return;
    setSubmitting(true);
    try {
      const orderData = {
        restaurantId,
        items: cart.map(c => ({
          id: c.id,
          name: c.name,
          quantity: c.quantity,
          price: c.price,
          status: 'pending'
        })),
        total: cartTotal,
        status: 'pending',
        type: 'dine-in',
        tableInfo: table,
        createdAt: serverTimestamp()
      };
      await addDoc(collection(db, 'orders'), orderData);
      setCart([]);
      setActiveTab('menu');
      alert("Order sent to kitchen!");
    } catch (e) {
      console.error("Error sending order", e);
    } finally {
      setSubmitting(false);
    }
  };

  const filteredItems = items.filter(item => activeCategory === "All" || item.category === activeCategory);

  if (loading) {
    return <div className="min-h-[100dvh] bg-[#050505] flex items-center justify-center"><Loader2 className="w-8 h-8 text-amber-500 animate-spin" /></div>;
  }

  return (
    <div className="min-h-[100dvh] bg-[#050505] text-slate-300 flex flex-col font-sans selection:bg-amber-500/20">
      {/* Header */}
      <header className="h-16 border-b border-slate-800 flex items-center px-4 shrink-0 bg-[#080808]/90 backdrop-blur-xl sticky top-0 z-20">
        <Link to="/dashboard" className="p-2 -ml-2 text-slate-400 hover:text-white transition-colors">
          <ArrowLeft className="w-6 h-6" />
        </Link>
        <div className="flex-1 text-center">
          <button className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-800/50 border border-slate-700 text-white font-semibold mx-auto">
            <User className="w-4 h-4 text-amber-500" />
            Table {table}
          </button>
        </div>
        <div className="w-10"></div> {/* Spacer */}
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col pb-24">
        {activeTab === "menu" ? (
          <>
            {/* Search */}
            <div className="p-4 sticky top-16 bg-[#050505]/95 backdrop-blur z-10">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                <input 
                  type="text" 
                  placeholder="Search menu..." 
                  className="w-full h-12 pl-10 pr-4 bg-[#080808] border border-slate-800 rounded-xl text-white placeholder:text-slate-600 focus:outline-none focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/50"
                />
              </div>
            </div>

            {/* Categories */}
            <div className="flex overflow-x-auto hide-scrollbar px-4 pb-2 gap-2">
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={cn(
                    "px-4 py-2 rounded-full whitespace-nowrap text-sm font-semibold transition-colors",
                    activeCategory === cat 
                      ? "bg-amber-500 text-black" 
                      : "bg-slate-800 text-slate-300 border border-slate-700"
                  )}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Menu Items */}
            <div className="p-4 grid gap-3">
              {filteredItems.map(item => (
                <div key={item.id} className="bg-[#080808] border border-slate-800 p-4 rounded-2xl flex justify-between items-center active:scale-[0.98] transition-transform">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-white font-medium">{item.name}</h3>
                    </div>
                    <p className="text-amber-500 font-semibold">${item.price}</p>
                  </div>
                  <button 
                    onClick={() => addToCart(item)}
                    className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-white border border-slate-700 hover:bg-slate-700 active:bg-slate-600"
                  >
                    <Plus className="w-5 h-5" />
                  </button>
                </div>
              ))}
            </div>
          </>
        ) : (
          <div className="p-4 flex flex-col h-full">
            <h2 className="text-xl font-bold text-white mb-6">Current Order</h2>
            
            {cart.length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center text-slate-500">
                <Receipt className="w-12 h-12 mb-4 opacity-20" />
                <p>Order is empty</p>
              </div>
            ) : (
              <div className="flex-1 flex flex-col gap-4">
                {cart.map(item => (
                  <div key={item.id} className="flex items-center justify-between bg-[#080808] border border-slate-800 p-4 rounded-2xl">
                    <div className="flex-1">
                      <h3 className="text-white font-medium mb-1">{item.name}</h3>
                      <p className="text-amber-500">${item.price * item.quantity}</p>
                    </div>
                    <div className="flex items-center gap-4 bg-slate-900 rounded-full p-1 border border-slate-800">
                      <button 
                        onClick={() => updateQuantity(item.id, -1)}
                        className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center hover:bg-slate-700"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="font-bold text-white min-w-[1ch] text-center">{item.quantity}</span>
                      <button 
                        onClick={() => updateQuantity(item.id, 1)}
                        className="w-8 h-8 rounded-full bg-amber-500 flex items-center justify-center text-black hover:bg-amber-400"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}

                <div className="mt-auto pt-6 border-t border-slate-800">
                  <div className="flex justify-between items-center mb-6 text-lg font-bold">
                    <span className="text-white">Total</span>
                    <span className="text-amber-500">${cartTotal.toFixed(2)}</span>
                  </div>
                  <button 
                    onClick={handleSendToKitchen}
                    disabled={submitting}
                    className="w-full py-4 rounded-xl font-bold flex items-center justify-center gap-2 bg-amber-500 text-black hover:bg-amber-400 transition-colors disabled:opacity-50"
                  >
                    {submitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
                    {submitting ? "Sending..." : "Fire to Kitchen"}
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </main>

      {/* Bottom Nav / Cart Bar */}
      <div className="fixed bottom-0 inset-x-0 p-4 bg-[#080808]/90 backdrop-blur-xl border-t border-slate-800 pb-safe">
        <div className="flex bg-slate-900 rounded-2xl p-1 border border-slate-800">
          <button 
            onClick={() => setActiveTab("menu")}
            className={cn(
              "flex-1 py-3 rounded-xl text-sm font-bold transition-all",
              activeTab === "menu" ? "bg-slate-800 text-white shadow-sm" : "text-slate-500"
            )}
          >
            Menu
          </button>
          <button 
            onClick={() => setActiveTab("cart")}
            className={cn(
              "flex-1 py-3 rounded-xl text-sm font-bold transition-all flex items-center justify-center gap-2",
              activeTab === "cart" ? "bg-slate-800 text-white shadow-sm" : "text-slate-500"
            )}
          >
            Order
            {cartCount > 0 && (
              <span className="bg-amber-500 text-black text-[10px] px-2 py-0.5 rounded-full font-bold">
                {cartCount}
              </span>
            )}
          </button>
        </div>
      </div>

    </div>
  );
}
