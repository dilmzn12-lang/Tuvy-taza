import { motion } from "motion/react";
import { Link } from "react-router-dom";
import { ArrowLeft, Users, Clock, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";
import { useAuth } from "@/lib/AuthContext";
import { db } from "@/lib/firebase";
import { getErrorMessage } from "@/lib/utils";
import { ErrorBanner } from "@/components/ErrorBanner";
import { collection, query, where, onSnapshot } from "firebase/firestore";

type TableData = {
  id: number;
  x: number;
  y: number;
  w: number;
  h: number;
  shape: 'round' | 'rect';
  seats: number;
};

const TABLES: TableData[] = [
  { id: 1, x: 20, y: 20, w: 15, h: 15, shape: 'round', seats: 4 },
  { id: 2, x: 45, y: 20, w: 15, h: 15, shape: 'round', seats: 4 },
  { id: 3, x: 70, y: 20, w: 15, h: 15, shape: 'round', seats: 4 },
  
  { id: 4, x: 20, y: 50, w: 25, h: 15, shape: 'rect', seats: 6 },
  { id: 5, x: 55, y: 50, w: 25, h: 15, shape: 'rect', seats: 6 },
  
  { id: 6, x: 20, y: 80, w: 10, h: 10, shape: 'round', seats: 2 },
  { id: 7, x: 40, y: 80, w: 10, h: 10, shape: 'round', seats: 2 },
  { id: 8, x: 60, y: 80, w: 10, h: 10, shape: 'round', seats: 2 },
  { id: 9, x: 80, y: 80, w: 10, h: 10, shape: 'round', seats: 2 },
  { id: 12, x: 85, y: 50, w: 10, h: 10, shape: 'round', seats: 2 },
];

const STATUS_COLORS = {
  available: "border-slate-700 bg-slate-800/50 text-slate-400",
  occupied: "border-amber-500/50 bg-amber-500/10 text-amber-500", // Ordering
  preparing: "border-orange-500/50 bg-orange-500/10 text-orange-500",
  served: "border-blue-500/50 bg-blue-500/10 text-blue-500",
  needs_help: "border-red-500/50 bg-red-500/10 text-red-500 animate-pulse",
};

export function LiveMap() {
  const { restaurantId } = useAuth();
  const [activeOrders, setActiveOrders] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!restaurantId) return;

    const q = query(
      collection(db, 'orders'),
      where('restaurantId', '==', restaurantId),
      where('status', 'in', ['pending', 'preparing', 'ready', 'completed'])
    );

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const fetchedOrders = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setError(null);
        setActiveOrders(fetchedOrders);
      },
      (err) => {
        console.error("Error subscribing to live orders", err);
        setError(getErrorMessage(err, "Lost connection to the live floor plan. Check your connection and refresh."));
      }
    );

    return () => unsubscribe();
  }, [restaurantId]);

  const getTableStatus = (tableId: number) => {
    const tableStr = `T${tableId}`;
    const order = activeOrders.find(o => o.tableInfo === tableStr);
    
    if (!order) return { status: 'available', time: null };

    let status = 'occupied';
    if (order.status === 'pending') status = 'occupied';
    else if (order.status === 'preparing') status = 'preparing';
    else if (order.status === 'ready') status = 'served';
    else if (order.status === 'completed') status = 'served';

    const createdAt = order.createdAt?.toMillis() || Date.now();
    const elapsedMins = Math.floor((Date.now() - createdAt) / 60000);
    const time = elapsedMins > 60 ? `${Math.floor(elapsedMins/60)}h ${elapsedMins%60}m` : `${elapsedMins}m`;

    return { status, time };
  };

  return (
    <div className="min-h-screen bg-[#050505] text-slate-300 flex flex-col font-sans selection:bg-amber-500/20">
      <header className="h-16 border-b border-slate-800 flex items-center px-6 shrink-0 bg-[#080808]/80 backdrop-blur-xl z-10">
        <Link to="/dashboard" className="p-2 -ml-2 text-slate-400 hover:text-white transition-colors mr-4">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="font-semibold text-lg leading-none mb-1 text-white">Live Floor Plan</h1>
          <p className="text-xs text-slate-400">Main Dining Room</p>
        </div>
        
        <div className="ml-auto flex items-center gap-4 text-xs font-medium">
          <LegendItem color="bg-slate-600" label="Available" />
          <LegendItem color="bg-amber-500" label="Ordering" />
          <LegendItem color="bg-orange-500" label="Preparing" />
          <LegendItem color="bg-blue-500" label="Served" />
          <LegendItem color="bg-red-500" label="Needs Help" />
        </div>
      </header>

      <main className="flex-1 relative overflow-hidden bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#080808] to-[#050505] p-8">
        {error && <ErrorBanner message={error} className="relative z-10 mb-4 max-w-5xl mx-auto" />}
        <div className="absolute inset-0 opacity-[0.03] bg-[linear-gradient(to_right,#cbd5e1_1px,transparent_1px),linear-gradient(to_bottom,#cbd5e1_1px,transparent_1px)] bg-[size:4rem_4rem]" />
        
        <div className="relative w-full max-w-5xl mx-auto aspect-video border border-slate-800 rounded-3xl bg-[#080808]/50 backdrop-blur-sm shadow-2xl overflow-hidden mt-8">
          {/* Mock walls/doors */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-2 bg-slate-800 rounded-b-lg" />
          <div className="absolute bottom-0 right-10 w-24 h-2 bg-slate-800 rounded-t-lg" />
          
          {TABLES.map((table) => {
            const { status, time } = getTableStatus(table.id);
            return (
            <motion.button
              key={table.id}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={cn(
                "absolute flex flex-col items-center justify-center border-2 transition-colors cursor-pointer group",
                table.shape === 'round' ? 'rounded-full' : 'rounded-xl',
                STATUS_COLORS[status as keyof typeof STATUS_COLORS]
              )}
              style={{
                left: `${table.x}%`,
                top: `${table.y}%`,
                width: `${table.w}%`,
                height: `${table.h}%`,
              }}
            >
              <span className="text-lg font-bold">T{table.id}</span>
              {status !== 'available' && (
                <div className="flex items-center gap-2 mt-1 opacity-80 group-hover:opacity-100">
                  <div className="flex items-center gap-1 text-xs">
                    <Users className="w-3 h-3" /> 2
                  </div>
                  {time && (
                    <div className="flex items-center gap-1 text-xs">
                      <Clock className="w-3 h-3" /> {time}
                    </div>
                  )}
                </div>
              )}
              {status === 'needs_help' && (
                <AlertCircle className="absolute -top-2 -right-2 w-6 h-6 text-red-500 fill-[#050505]" />
              )}
            </motion.button>
            );
          })}
        </div>
      </main>
    </div>
  );
}

function LegendItem({ color, label }: { color: string, label: string }) {
  return (
    <div className="flex items-center gap-2">
      <div className={cn("w-3 h-3 rounded-full", color)} />
      <span className="text-slate-400">{label}</span>
    </div>
  )
}
