import { motion } from "motion/react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowUpRight, Users, DollarSign, ShoppingBag, TrendingUp, Bell, Search, Menu, LayoutDashboard, UtensilsCrossed, Settings, MapPin, ChefHat, Smartphone, Store, Loader2 } from "lucide-react";
import type { ReactNode } from "react";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/lib/AuthContext";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { getErrorMessage } from "@/lib/utils";

export function OwnerDashboard() {
  const { user, loading, restaurantId, logOut } = useAuth();

  const handleLogOut = async () => {
    try {
      await logOut();
    } catch (e) {
      alert(getErrorMessage(e, "Could not sign out. Please try again."));
    }
  };

  if (loading || !user || !restaurantId) {
    return <div className="min-h-screen bg-[#050505] flex items-center justify-center"><Loader2 className="w-8 h-8 text-amber-500 animate-spin" /></div>;
  }

  return (
    <div className="min-h-screen bg-[#050505] text-slate-300 flex font-sans selection:bg-amber-500/20">
      {/* Sidebar */}
      <aside className="w-64 border-r border-slate-800 bg-[#080808]/80 backdrop-blur-xl flex flex-col hidden md:flex shrink-0">
        <div className="h-16 flex items-center px-6 border-b border-slate-800 shrink-0">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded bg-amber-500 text-black flex items-center justify-center font-bold text-xs">T</div>
            <span className="font-semibold tracking-tight text-sm text-white">TUVY OS</span>
          </div>
        </div>
        <div className="p-4 flex-1 space-y-1 overflow-y-auto">
          <NavItem icon={<LayoutDashboard size={18} />} label="Overview" active />
          <NavItem icon={<MapPin size={18} />} label="Live Map" to="/map" />
          <NavItem icon={<ShoppingBag size={18} />} label="POS System" to="/pos" />
          <NavItem icon={<ChefHat size={18} />} label="Kitchen Display" to="/kitchen" />
          <NavItem icon={<Smartphone size={18} />} label="Waitstaff App" to="/waitstaff" />
          <NavItem icon={<UtensilsCrossed size={18} />} label="Menu Management" to="/menu-management" />
          <NavItem icon={<Users size={18} />} label="Staff & Waiters" />
          <NavItem icon={<Settings size={18} />} label="Settings" />
        </div>
        <div className="p-4 border-t border-slate-800 shrink-0">
          <div className="flex items-center gap-3 px-2 py-2">
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-orange-400 to-amber-600 shrink-0" />
            <div className="flex flex-col min-w-0">
              <span className="text-sm font-medium text-white truncate">{user.displayName || 'Owner'}</span>
              <button onClick={handleLogOut} className="text-xs text-slate-400 hover:text-white text-left truncate">Sign out</button>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden min-w-0">
        {/* Header */}
        <header className="h-16 border-b border-slate-800 flex items-center justify-between px-8 bg-[#080808]/80 backdrop-blur-xl z-10 shrink-0">
          <div className="flex items-center gap-4 flex-1 min-w-0">
            <div className="relative w-64 hidden sm:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <input 
                type="text" 
                placeholder="Search orders, items..." 
                className="w-full bg-slate-900/30 border border-slate-800 rounded-full pl-10 pr-4 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-amber-500/50 transition-all"
              />
            </div>
          </div>
          <div className="flex items-center gap-4 shrink-0">
            <button className="relative p-2 text-slate-400 hover:text-white transition-colors">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-red-500" />
            </button>
            <Link to="/pos" className="text-sm font-bold bg-amber-500 text-black px-4 py-1.5 rounded-full hover:bg-amber-400 transition-colors">
              Launch POS
            </Link>
          </div>
        </header>

        {/* Dashboard Scroll Area */}
        <div className="flex-1 overflow-y-auto p-8">
          <div className="max-w-6xl mx-auto space-y-8">
            <div className="flex items-end justify-between">
              <div>
                <h1 className="text-2xl font-bold tracking-tight mb-1 text-white">Today's Overview</h1>
                <p className="text-slate-400 text-sm">Real-time performance for your restaurant</p>
              </div>
              <div className="flex items-center gap-2 text-sm text-slate-400">
                <span>Last updated: Just now</span>
              </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <StatCard title="Total Revenue" value="$4,289.50" trend="+12.5%" isPositive icon={<DollarSign className="text-green-500" />} />
              <StatCard title="Active Orders" value="24" trend="Live" icon={<ShoppingBag className="text-blue-500" />} />
              <StatCard title="Customers" value="142" trend="+5.2%" isPositive icon={<Users className="text-purple-500" />} />
              <StatCard title="Avg. Prep Time" value="12m" trend="-2.4m" isPositive icon={<TrendingUp className="text-amber-500" />} />
            </div>

            <div className="grid lg:grid-cols-3 gap-6">
              {/* Chart Placeholder */}
              <div className="lg:col-span-2 rounded-2xl border border-slate-800 bg-[#080808] p-6">
                <h3 className="text-sm font-medium text-slate-400 mb-6">Revenue Overview</h3>
                <div className="h-64 flex items-end gap-2">
                  {[40, 30, 60, 45, 80, 55, 90, 75, 100, 60, 85, 70].map((h, i) => (
                    <motion.div 
                      key={i}
                      initial={{ height: 0 }}
                      animate={{ height: `${h}%` }}
                      transition={{ duration: 1, delay: i * 0.05, ease: "easeOut" }}
                      className="flex-1 bg-gradient-to-t from-slate-800/50 to-slate-700/80 rounded-t-sm hover:from-amber-500/50 hover:to-amber-400/80 transition-colors cursor-pointer relative group"
                    >
                      <div className="absolute -top-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-slate-800 text-xs px-2 py-1 rounded text-white whitespace-nowrap pointer-events-none">
                        ${h * 10}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Live Activity */}
              <div className="rounded-2xl border border-slate-800 bg-[#080808] p-6 flex flex-col">
                <h3 className="text-sm font-medium text-slate-400 mb-6">Live Activity</h3>
                <div className="flex-1 space-y-4">
                  <ActivityItem time="2m ago" text="Table 4 requested the bill" type="alert" />
                  <ActivityItem time="5m ago" text="Order #1042 served by Alex" type="success" />
                  <ActivityItem time="12m ago" text="New delivery order received" type="info" />
                  <ActivityItem time="15m ago" text="Table 12 seated (4 guests)" type="info" />
                  <ActivityItem time="22m ago" text="Kitchen delay on Order #1039" type="warning" />
                </div>
                <button className="w-full mt-4 py-2 text-xs font-bold text-slate-400 hover:text-white border border-slate-800 rounded-lg hover:bg-slate-800 transition-colors">
                  View All Activity
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}


function NavItem({ icon, label, active, to }: { icon: ReactNode, label: string, active?: boolean, to?: string }) {
  const content = (
    <div className={cn(
      "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer",
      active ? "bg-amber-500/10 text-amber-500" : "text-slate-400 hover:text-white hover:bg-slate-800"
    )}>
      {icon}
      {label}
    </div>
  );
  return to ? <Link to={to}>{content}</Link> : content;
}

function StatCard({ title, value, trend, isPositive, icon }: { title: string, value: string, trend: string, isPositive?: boolean, icon: ReactNode }) {
  return (
    <div className="rounded-2xl border border-slate-800 bg-[#080808] p-5 flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <span className="text-sm font-medium text-slate-400">{title}</span>
        <div className="p-2 rounded-lg bg-slate-900/50 border border-slate-800">
          {icon}
        </div>
      </div>
      <div className="flex items-baseline gap-2">
        <span className="text-2xl font-bold tracking-tight text-white">{value}</span>
        <span className={cn("text-xs font-bold", isPositive ? "text-green-500" : "text-slate-500")}>
          {trend}
        </span>
      </div>
    </div>
  )
}

function ActivityItem({ time, text, type }: { time: string, text: string, type: 'alert' | 'success' | 'info' | 'warning' }) {
  const colors = {
    alert: "bg-red-500/10 text-red-500",
    success: "bg-green-500/10 text-green-500",
    info: "bg-blue-500/10 text-blue-500",
    warning: "bg-amber-500/10 text-amber-500",
  }
  return (
    <div className="flex gap-3">
      <div className={cn("w-2 h-2 mt-1.5 rounded-full shrink-0", colors[type].split(' ')[1].replace('text-', 'bg-'))} />
      <div>
        <p className="text-sm text-slate-300">{text}</p>
        <span className="text-xs text-slate-500">{time}</span>
      </div>
    </div>
  )
}
