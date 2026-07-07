import { motion } from "motion/react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowRight, ChefHat, LayoutGrid, Smartphone, Map, CreditCard, Sparkles, LogOut } from "lucide-react";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/lib/AuthContext";

export function LandingPage() {
  const { user, signInWithGoogle, logOut } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#050505] text-slate-300 selection:bg-amber-500/20 font-sans">
      {/* Navigation */}
      <nav className="fixed top-0 inset-x-0 z-50 flex items-center justify-between px-8 py-4 bg-[#080808]/80 backdrop-blur-xl border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-amber-500 flex items-center justify-center text-black font-bold text-lg">
            T
          </div>
          <span className="font-semibold tracking-tight text-lg text-white">TUVY OS</span>
        </div>
        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-400">
          <a href="#features" className="hover:text-white transition-colors">Features</a>
          <a href="#pricing" className="hover:text-white transition-colors">Pricing</a>
          <a href="#customers" className="hover:text-white transition-colors">Customers</a>
        </div>
        <div className="flex items-center gap-4">
          <Link to="/menu/demo" className="text-sm font-medium text-slate-400 hover:text-white transition-colors">View Demo Menu</Link>
          {user ? (
            <div className="flex items-center gap-3">
              <Link to="/dashboard" className="text-sm font-bold bg-white text-black px-4 py-2 rounded-full hover:bg-slate-200 transition-colors flex items-center gap-2">
                Dashboard <ArrowRight className="w-4 h-4" />
              </Link>
              <button onClick={logOut} className="p-2 text-slate-400 hover:text-white transition-colors">
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          ) : (
            <button onClick={signInWithGoogle} className="text-sm font-bold bg-white text-black px-4 py-2 rounded-full hover:bg-slate-200 transition-colors flex items-center gap-2">
              Sign In
            </button>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <main className="relative pt-32 pb-20 px-8 flex flex-col items-center justify-center text-center overflow-hidden">
        {/* Abstract Background Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[600px] bg-gradient-to-b from-zinc-500/20 to-transparent blur-3xl rounded-full pointer-events-none" />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="relative z-10 max-w-4xl mx-auto"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-800/50 border border-slate-700 text-xs font-bold uppercase tracking-widest text-slate-400 mb-8 backdrop-blur-sm">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>The New Standard in Hospitality</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-bold tracking-tighter mb-8 leading-[1.1] text-white">
            The ultimate operating system for restaurants.
          </h1>
          <p className="text-lg md:text-xl text-slate-400 mb-12 max-w-2xl mx-auto leading-relaxed">
            Not just another QR menu. TUVY OS is a complete, multi-tenant SaaS platform that unifies your POS, orders, staff, and analytics into one premium experience.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            {user ? (
              <Link to="/dashboard" className="px-8 py-4 rounded-full bg-white text-black font-bold text-base hover:bg-slate-200 transition-all active:scale-95 flex items-center gap-2">
                Open Dashboard <ArrowRight className="w-4 h-4" />
              </Link>
            ) : (
              <Link to="/login" className="px-8 py-4 rounded-full bg-white text-black font-bold text-base hover:bg-slate-200 transition-all active:scale-95 flex items-center gap-2">
                Start Free Trial <ArrowRight className="w-4 h-4" />
              </Link>
            )}
            <Link to="/pos" className="px-8 py-4 rounded-full bg-slate-800 text-white font-bold text-base border border-slate-700 hover:bg-slate-700 transition-all active:scale-95">
              Explore POS
            </Link>
          </div>
        </motion.div>

        {/* Hero Image Mockup (Glassmorphic) */}
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="relative w-full max-w-5xl mx-auto mt-24 aspect-[16/9] rounded-2xl overflow-hidden border border-slate-800 bg-[#050505] shadow-2xl"
        >
          {/* Mock UI Header */}
          <div className="absolute top-0 inset-x-0 h-12 border-b border-slate-800 flex items-center px-4 gap-2 bg-[#080808]">
            <div className="flex gap-1.5">
              <div className="w-3 h-3 rounded-full bg-red-500/80" />
              <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
              <div className="w-3 h-3 rounded-full bg-green-500/80" />
            </div>
            <div className="ml-4 flex items-center gap-4 text-xs font-medium text-neutral-500">
              <span>Overview</span>
              <span className="text-white">Orders</span>
              <span>Tables</span>
              <span>Menu</span>
            </div>
          </div>
          
          {/* Mock UI Content */}
          <div className="pt-16 p-8 grid grid-cols-3 gap-6 h-full">
             <div className="col-span-2 space-y-6">
                <div className="h-48 rounded-xl bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/5 p-6">
                  <div className="w-32 h-4 bg-white/10 rounded-full mb-8" />
                  <div className="w-full h-24 flex items-end gap-2">
                    {[40, 60, 30, 80, 50, 90, 40].map((h, i) => (
                      <div key={i} className="flex-1 bg-white/20 rounded-t-sm" style={{ height: `${h}%` }} />
                    ))}
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-6">
                   <div className="h-32 rounded-xl bg-white/5 border border-white/5 p-6">
                     <div className="w-20 h-4 bg-white/10 rounded-full mb-4" />
                     <div className="w-16 h-8 bg-white/20 rounded-full" />
                   </div>
                   <div className="h-32 rounded-xl bg-white/5 border border-white/5 p-6">
                     <div className="w-20 h-4 bg-white/10 rounded-full mb-4" />
                     <div className="w-16 h-8 bg-white/20 rounded-full" />
                   </div>
                </div>
             </div>
             <div className="col-span-1 space-y-4">
               {[1, 2, 3, 4].map(i => (
                 <div key={i} className="h-16 rounded-lg bg-white/5 border border-white/5 flex items-center px-4 gap-4">
                   <div className="w-10 h-10 rounded-full bg-white/10" />
                   <div className="flex-1">
                     <div className="w-24 h-3 bg-white/20 rounded-full mb-2" />
                     <div className="w-16 h-2 bg-white/10 rounded-full" />
                   </div>
                 </div>
               ))}
             </div>
          </div>
        </motion.div>
      </main>

      {/* Features Grid */}
      <section id="features" className="py-24 px-8 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold tracking-tight mb-4 text-white">Everything you need. Nothing you don't.</h2>
          <p className="text-slate-400">A unified platform to manage every aspect of your restaurant.</p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <FeatureCard 
            icon={<Map />}
            title="Live Restaurant Map"
            description="See every table's status in real-time. Orange for ordering, blue for served. One tap to manage."
            link="/map"
          />
          <FeatureCard 
            icon={<LayoutGrid />}
            title="Smart POS System"
            description="Split bills, merge tables, process refunds, and print kitchen tickets seamlessly."
            link="/pos"
          />
          <FeatureCard 
            icon={<Smartphone />}
            title="Premium Digital Menu"
            description="Beautiful customer-facing menus with 3D images, variants, allergens, and AI recommendations."
            link="/menu/demo"
          />
          <FeatureCard 
            icon={<ChefHat />}
            title="Kitchen Display System"
            description="Keep your back-of-house in sync with real-time order routing, prep timers, and completion tracking."
            link="/kitchen"
          />
          <FeatureCard 
            icon={<Smartphone />}
            title="Waitstaff Mobile App"
            description="Empower servers to take orders tableside, fire to the kitchen instantly, and manage their tables."
            link="/waitstaff"
          />
          <FeatureCard 
            icon={<LayoutGrid />}
            title="Owner Dashboard"
            description="Monitor live revenue, active orders, and staff performance from anywhere with complete visibility."
            link="/dashboard"
          />
        </div>
      </section>
    </div>
  );
}

function FeatureCard({ icon, title, description, link }: { icon: ReactNode, title: string, description: string, link: string }) {
  return (
    <Link to={link} className="block group">
      <div className="h-full p-6 rounded-2xl bg-slate-900/30 border border-slate-800 hover:border-amber-500/50 transition-all">
        <div className="w-12 h-12 rounded-xl bg-slate-800 flex items-center justify-center text-amber-500 mb-6 group-hover:scale-110 transition-transform">
          {icon}
        </div>
        <h3 className="text-lg font-semibold mb-2 text-white">{title}</h3>
        <p className="text-sm text-slate-400 leading-relaxed">{description}</p>
      </div>
    </Link>
  )
}
