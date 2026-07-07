import { motion, AnimatePresence } from "motion/react";
import { Link } from "react-router-dom";
import { Clock, CheckCircle2, AlertCircle, ChefHat } from "lucide-react";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/lib/AuthContext";
import { db } from "@/lib/firebase";
import { collection, query, where, onSnapshot, updateDoc, doc, deleteDoc, Timestamp } from "firebase/firestore";

type OrderItem = {
  id: string;
  name: string;
  quantity: number;
  notes?: string;
  status: 'pending' | 'preparing' | 'ready';
  price: number;
};

type Order = {
  id: string;
  tableInfo: string;
  createdAt: Timestamp | null;
  status: 'pending' | 'preparing' | 'ready' | 'completed';
  items: OrderItem[];
};

export function KitchenDisplay() {
  const { restaurantId } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [currentTime, setCurrentTime] = useState(new Date());

  // Subscribe to live orders
  useEffect(() => {
    if (!restaurantId) return;

    const q = query(
      collection(db, 'orders'),
      where('restaurantId', '==', restaurantId),
      where('status', 'in', ['pending', 'preparing', 'ready'])
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const fetchedOrders = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Order[];
      
      // Sort by creation time manually as we can't always sort easily without an index
      fetchedOrders.sort((a, b) => {
        const timeA = a.createdAt?.toMillis() || Date.now();
        const timeB = b.createdAt?.toMillis() || Date.now();
        return timeA - timeB;
      });

      setOrders(fetchedOrders);
    });

    return () => unsubscribe();
  }, [restaurantId]);

  // Update timer tick
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const getElapsedSeconds = (createdAt: Timestamp | null) => {
    if (!createdAt) return 0;
    return Math.floor((currentTime.getTime() - createdAt.toMillis()) / 1000);
  };

  const formatElapsed = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  const getTimerColor = (seconds: number) => {
    if (seconds > 900) return "text-red-500 bg-red-500/10"; // > 15 mins
    if (seconds > 600) return "text-amber-500 bg-amber-500/10"; // > 10 mins
    return "text-green-500 bg-green-500/10";
  };

  const toggleItemStatus = async (orderId: string, itemId: string) => {
    const order = orders.find(o => o.id === orderId);
    if (!order) return;

    const newItems = order.items.map(item => {
      if (item.id !== itemId) return item;
      const nextStatus = item.status === 'pending' ? 'preparing' : item.status === 'preparing' ? 'ready' : 'pending';
      return { ...item, status: nextStatus };
    });

    const allReady = newItems.every(i => i.status === 'ready');
    const anyPreparing = newItems.some(i => i.status === 'preparing' || i.status === 'ready');
    const orderStatus = allReady ? 'ready' : anyPreparing ? 'preparing' : 'pending';

    try {
      await updateDoc(doc(db, 'orders', orderId), {
        items: newItems,
        status: orderStatus
      });
    } catch (e) {
      console.error("Error updating order status:", e);
    }
  };

  const markOrderReady = async (orderId: string) => {
    try {
      await updateDoc(doc(db, 'orders', orderId), {
        status: 'completed'
      });
    } catch (e) {
      console.error("Error completing order:", e);
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] text-slate-300 flex flex-col font-sans selection:bg-amber-500/20">
      <header className="h-16 border-b border-slate-800 flex items-center justify-between px-6 shrink-0 bg-[#080808]/80 backdrop-blur-xl z-10">
        <div className="flex items-center gap-4">
          <Link to="/dashboard" className="w-8 h-8 rounded-lg bg-amber-500 flex items-center justify-center text-black font-bold text-lg hover:bg-amber-400 transition-colors">
            T
          </Link>
          <div>
            <h1 className="font-semibold text-lg leading-none mb-1 text-white">Kitchen Display System</h1>
            <p className="text-xs text-slate-400">Station: Hot Line</p>
          </div>
        </div>
        
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
            </span>
            <span className="text-sm font-medium text-slate-300">Live</span>
          </div>
          <div className="text-xl font-mono text-white tracking-widest">
            {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
          </div>
        </div>
      </header>

      <main className="flex-1 overflow-x-auto overflow-y-hidden p-6">
        <div className="flex gap-6 h-full items-start">
          <AnimatePresence>
            {orders.map((order) => {
              const elapsed = getElapsedSeconds(order.createdAt);
              
              return (
              <motion.div
                key={order.id}
                layout
                initial={{ opacity: 0, scale: 0.9, x: -20 }}
                animate={{ opacity: 1, scale: 1, x: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                className={cn(
                  "flex-shrink-0 w-80 h-full max-h-[800px] flex flex-col rounded-2xl border bg-[#080808] overflow-hidden transition-colors",
                  order.status === 'ready' ? "border-green-500/50" : "border-slate-800",
                  elapsed > 900 ? "shadow-[0_0_15px_rgba(239,68,68,0.1)]" : ""
                )}
              >
                {/* Order Header */}
                <div className={cn(
                  "p-4 border-b transition-colors",
                  order.status === 'ready' ? "bg-green-500/10 border-green-500/20" : "border-slate-800"
                )}>
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h2 className="text-2xl font-bold text-white mb-1">#{order.id.slice(-4).toUpperCase()}</h2>
                      <span className="inline-block px-2 py-1 rounded bg-slate-800 text-xs font-semibold text-slate-300 uppercase tracking-wider">
                        {order.tableInfo || 'Walk-in'}
                      </span>
                    </div>
                    <div className={cn(
                      "px-3 py-1.5 rounded-lg text-lg font-mono font-bold flex items-center gap-2",
                      getTimerColor(elapsed)
                    )}>
                      <Clock className="w-4 h-4" />
                      {formatElapsed(elapsed)}
                    </div>
                  </div>
                </div>

                {/* Order Items */}
                <div className="flex-1 overflow-y-auto p-4 space-y-3">
                  {order.items.map((item) => (
                    <div 
                      key={item.id}
                      onClick={() => toggleItemStatus(order.id, item.id)}
                      className={cn(
                        "p-3 rounded-xl border cursor-pointer transition-all active:scale-[0.98]",
                        item.status === 'ready' ? "bg-green-500/10 border-green-500/30 text-green-500" :
                        item.status === 'preparing' ? "bg-amber-500/10 border-amber-500/30 text-white" :
                        "bg-slate-900/50 border-slate-700 hover:border-slate-600 text-slate-300"
                      )}
                    >
                      <div className="flex gap-3">
                        <div className={cn(
                          "w-8 h-8 rounded-lg flex items-center justify-center font-bold shrink-0",
                          item.status === 'ready' ? "bg-green-500 text-black" :
                          item.status === 'preparing' ? "bg-amber-500 text-black" :
                          "bg-slate-800 text-white"
                        )}>
                          {item.quantity}x
                        </div>
                        <div className="flex-1 pt-1">
                          <p className={cn(
                            "font-semibold leading-tight",
                            item.status === 'ready' ? "line-through opacity-80" : ""
                          )}>
                            {item.name}
                          </p>
                          {item.notes && (
                            <p className="text-sm mt-2 text-red-400 font-medium bg-red-400/10 px-2 py-1 rounded border border-red-400/20">
                              {item.notes}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Order Footer */}
                <div className="p-4 border-t border-slate-800 bg-[#050505] shrink-0">
                  <button
                    onClick={() => markOrderReady(order.id)}
                    disabled={order.status !== 'ready'}
                    className={cn(
                      "w-full py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all",
                      order.status === 'ready' 
                        ? "bg-green-500 text-black hover:bg-green-400 hover:scale-[1.02] active:scale-95 shadow-[0_0_20px_rgba(34,197,94,0.3)]" 
                        : "bg-slate-800 text-slate-500 cursor-not-allowed"
                    )}
                  >
                    <CheckCircle2 className="w-5 h-5" />
                    Complete Order
                  </button>
                </div>
              </motion.div>
              );
            })}
          </AnimatePresence>

          {orders.length === 0 && (
            <div className="w-full h-full flex flex-col items-center justify-center text-slate-500">
              <ChefHat className="w-16 h-16 mb-4 opacity-20" />
              <p className="text-xl font-medium text-slate-400">No active orders</p>
              <p className="text-sm mt-2">Kitchen is clear</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
