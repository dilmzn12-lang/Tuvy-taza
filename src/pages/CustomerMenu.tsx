import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Search, Flame, Star, ShoppingBag, X, Check } from "lucide-react";
import { cn } from "@/lib/utils";

const MENU = [
  { 
    id: 1, 
    name: "Truffle Mushroom Burger", 
    description: "Wagyu beef patty, wild mushrooms, truffle mayo, aged cheddar, brioche bun.",
    price: 24.00, 
    category: "Mains",
    tags: ["Chef's Choice", "Best Seller"],
    calories: 850,
    image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=800&q=80"
  },
  { 
    id: 2, 
    name: "Spicy Tuna Tartare", 
    description: "Yellowfin tuna, avocado, chili oil, sesame crackers.",
    price: 18.00, 
    category: "Starters",
    tags: ["Spicy", "New"],
    calories: 320,
    image: "https://images.unsplash.com/photo-1541544741938-0af808871cc0?auto=format&fit=crop&w=800&q=80"
  },
  { 
    id: 3, 
    name: "Matcha Lava Cake", 
    description: "Warm green tea cake, liquid white chocolate center, vanilla bean ice cream.",
    price: 14.00, 
    category: "Desserts",
    tags: ["Vegetarian"],
    calories: 640,
    image: "https://images.unsplash.com/photo-1515037021665-38b4d82f704e?auto=format&fit=crop&w=800&q=80"
  },
  { 
    id: 4, 
    name: "Artisan Burrata", 
    description: "Fresh burrata, heirloom tomatoes, basil pesto, balsamic glaze, grilled sourdough.",
    price: 16.00, 
    category: "Starters",
    tags: ["Vegetarian"],
    calories: 450,
    image: "https://images.unsplash.com/photo-1608897013039-887f214b985c?auto=format&fit=crop&w=800&q=80"
  }
];

export function CustomerMenu() {
  const [selectedItem, setSelectedItem] = useState<any>(null);

  return (
    <div className="min-h-screen bg-[#050505] text-slate-300 font-sans selection:bg-amber-500/20">
      {/* Restaurant Header */}
      <header className="relative h-[40vh] min-h-[300px] flex items-end pb-8 px-6 overflow-hidden">
        <div className="absolute inset-0">
          <img 
            src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=2000&q=80" 
            alt="Restaurant Interior"
            className="w-full h-full object-cover opacity-40"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/50 to-transparent" />
        </div>
        <div className="relative z-10 w-full max-w-3xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-2 text-white">Cafe Milano</h1>
            <p className="text-slate-400 flex items-center gap-4 text-sm md:text-base">
              <span>Italian Contemporary</span>
              <span className="w-1 h-1 rounded-full bg-slate-600" />
              <span>Table 12</span>
            </p>
          </motion.div>
        </div>
      </header>

      {/* Main Menu Content */}
      <main className="max-w-3xl mx-auto px-6 py-8 pb-32">
        <div className="sticky top-4 z-20 mb-8">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
            <input 
              type="text" 
              placeholder="Search the menu..." 
              className="w-full bg-[#080808]/80 backdrop-blur-xl border border-slate-800 rounded-2xl pl-12 pr-4 py-4 focus:outline-none focus:ring-2 focus:ring-amber-500/50 shadow-2xl transition-all"
            />
          </div>
        </div>

        <div className="space-y-12">
          {["Starters", "Mains", "Desserts"].map(category => (
            <section key={category}>
              <h2 className="text-2xl font-bold mb-6 tracking-tight text-white">{category}</h2>
              <div className="grid gap-6">
                {MENU.filter(item => item.category === category).map(item => (
                  <motion.div 
                    key={item.id}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setSelectedItem(item)}
                    className="flex gap-4 p-4 rounded-3xl bg-slate-900/30 border border-slate-800 cursor-pointer hover:border-amber-500/50 transition-colors"
                  >
                    <div className="w-28 h-28 shrink-0 rounded-2xl overflow-hidden bg-[#080808] relative">
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 py-1">
                      <div className="flex justify-between items-start mb-1">
                        <h3 className="font-semibold text-lg leading-tight pr-4 text-white">{item.name}</h3>
                        <span className="font-medium whitespace-nowrap text-amber-500">${item.price.toFixed(2)}</span>
                      </div>
                      <p className="text-sm text-slate-400 line-clamp-2 mb-3">{item.description}</p>
                      <div className="flex flex-wrap gap-2">
                        {item.tags.map(tag => (
                          <span key={tag} className={cn(
                            "text-[10px] uppercase tracking-wider font-bold px-2 py-0.5 rounded-full",
                            tag === 'Chef\'s Choice' || tag === 'Best Seller' ? 'bg-amber-500/20 text-amber-500' :
                            tag === 'Spicy' ? 'bg-red-500/20 text-red-500' :
                            'bg-slate-800 text-slate-300'
                          )}>
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </section>
          ))}
        </div>
      </main>

      {/* Floating Action Button */}
      <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-30">
        <button className="flex items-center gap-3 bg-amber-500 text-black px-6 py-4 rounded-full font-bold shadow-[0_0_40px_rgba(245,158,11,0.3)] hover:scale-105 active:scale-95 transition-all">
          <ShoppingBag className="w-5 h-5" />
          View Order (0)
        </button>
      </div>

      {/* Item Detail Modal */}
      <AnimatePresence>
        {selectedItem && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedItem(null)}
              className="fixed inset-0 bg-[#050505]/80 backdrop-blur-sm z-40"
            />
            <motion.div 
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed bottom-0 inset-x-0 md:inset-x-auto md:left-1/2 md:-translate-x-1/2 md:w-full md:max-w-xl md:bottom-8 h-[85vh] md:h-[80vh] bg-[#080808] md:border border-slate-800 md:rounded-3xl rounded-t-3xl overflow-hidden z-50 flex flex-col"
            >
              <div className="relative h-64 shrink-0">
                <img src={selectedItem.image} alt={selectedItem.name} className="w-full h-full object-cover" />
                <button 
                  onClick={() => setSelectedItem(null)}
                  className="absolute top-4 right-4 w-10 h-10 bg-[#050505]/50 backdrop-blur-md rounded-full flex items-center justify-center text-white hover:bg-[#050505]/80 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
                <div className="absolute inset-0 bg-gradient-to-t from-[#080808] to-transparent" />
              </div>
              
              <div className="flex-1 overflow-y-auto p-6 md:p-8 -mt-6 relative z-10">
                <div className="flex justify-between items-start mb-2">
                  <h2 className="text-3xl font-bold tracking-tight text-white">{selectedItem.name}</h2>
                  <span className="text-2xl font-light text-amber-500">${selectedItem.price.toFixed(2)}</span>
                </div>
                <p className="text-slate-400 mb-6 text-lg leading-relaxed">{selectedItem.description}</p>
                
                <div className="flex items-center gap-4 pb-6 border-b border-slate-800">
                  <div className="flex items-center gap-2 text-sm font-medium text-slate-300">
                    <Flame className="w-4 h-4 text-amber-500" /> {selectedItem.calories} kcal
                  </div>
                </div>

                <div className="py-6 space-y-6">
                  <div>
                    <h3 className="font-semibold mb-4 text-lg text-white">Add Extras</h3>
                    <div className="space-y-3">
                      <label className="flex items-center justify-between p-4 rounded-2xl bg-slate-900/30 border border-slate-800 cursor-pointer hover:border-amber-500/50 transition-colors">
                        <div className="flex items-center gap-3">
                          <div className="w-6 h-6 rounded-full border border-slate-700 flex items-center justify-center">
                             {/* Check would go here if selected */}
                          </div>
                          <span className="text-slate-300">Extra Truffle Mayo</span>
                        </div>
                        <span className="text-slate-400">+$2.00</span>
                      </label>
                      <label className="flex items-center justify-between p-4 rounded-2xl bg-slate-900/30 border border-slate-800 cursor-pointer hover:border-amber-500/50 transition-colors">
                        <div className="flex items-center gap-3">
                          <div className="w-6 h-6 rounded-full border border-slate-700 flex items-center justify-center"></div>
                          <span className="text-slate-300">Double Patty</span>
                        </div>
                        <span className="text-slate-400">+$8.00</span>
                      </label>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-6 bg-[#080808] border-t border-slate-800 shrink-0">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-4 bg-slate-800 rounded-full px-4 py-3">
                    <button className="text-xl font-medium w-8 h-8 flex items-center justify-center text-slate-300 hover:bg-slate-700 rounded-full transition-colors">-</button>
                    <span className="font-semibold text-lg w-4 text-center text-white">1</span>
                    <button className="text-xl font-medium w-8 h-8 flex items-center justify-center text-slate-300 hover:bg-slate-700 rounded-full transition-colors">+</button>
                  </div>
                  <button className="flex-1 bg-amber-500 text-black py-4 rounded-full font-bold text-lg hover:bg-amber-400 transition-colors">
                    Add to Order • ${selectedItem.price.toFixed(2)}
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
