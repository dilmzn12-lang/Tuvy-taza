import React from "react";
import { motion } from "motion/react";
import { useState, useEffect } from "react";
import { useNavigate, Navigate } from "react-router-dom";
import { Store, Loader2 } from "lucide-react";
import { useAuth } from "@/lib/AuthContext";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { getErrorMessage } from "@/lib/utils";
import { ErrorBanner } from "@/components/ErrorBanner";

export function Onboarding() {
  const { user, loading, restaurantId, setRestaurantId, logOut } = useAuth();
  const navigate = useNavigate();
  const [restaurantName, setRestaurantName] = useState("");
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogOut = async () => {
    try {
      await logOut();
    } catch (err) {
      setError(getErrorMessage(err, "Could not sign out. Please try again."));
    }
  };

  if (loading) {
    return <div className="min-h-[100dvh] bg-[#050505] flex items-center justify-center"><Loader2 className="w-8 h-8 text-amber-500 animate-spin" /></div>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (restaurantId) {
    return <Navigate to="/dashboard" replace />;
  }

  const handleCreateRestaurant = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!restaurantName.trim()) return;

    setError(null);
    setCreating(true);
    try {
      const newRestaurantId = `rest_${Date.now()}`;
      await setDoc(doc(db, 'restaurants', newRestaurantId), {
        name: restaurantName,
        ownerId: user.uid,
        createdAt: serverTimestamp()
      });
      
      await setDoc(doc(db, 'users', user.uid), {
        restaurantId: newRestaurantId,
        role: 'owner',
        name: user.displayName || 'Owner',
        email: user.email,
        createdAt: serverTimestamp()
      });
      
      setRestaurantId(newRestaurantId);
      navigate("/dashboard");
    } catch (err) {
      console.error("Error creating restaurant", err);
      setError(getErrorMessage(err, "Could not create your restaurant. Please try again."));
    } finally {
      setCreating(false);
    }
  };

  return (
    <div className="min-h-[100dvh] bg-[#050505] text-slate-300 flex items-center justify-center font-sans p-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full bg-[#080808] border border-slate-800 p-8 rounded-2xl shadow-2xl"
      >
        <div className="w-12 h-12 bg-amber-500/10 text-amber-500 rounded-xl flex items-center justify-center mb-6">
          <Store className="w-6 h-6" />
        </div>
        <h1 className="text-2xl font-bold text-white mb-2">Create your restaurant</h1>
        <p className="text-slate-400 text-sm mb-6">Set up your TUVY OS workspace to get started.</p>
        
        <form onSubmit={handleCreateRestaurant} className="space-y-4">
          {error && <ErrorBanner message={error} />}
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1">Restaurant Name</label>
            <input 
              type="text" 
              required
              value={restaurantName}
              onChange={(e) => setRestaurantName(e.target.value)}
              className="w-full bg-slate-900/50 border border-slate-800 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-amber-500 transition-colors"
              placeholder="e.g. Cafe Milano"
            />
          </div>
          <button 
            disabled={creating}
            type="submit" 
            className="w-full bg-amber-500 text-black font-bold py-3 rounded-lg hover:bg-amber-400 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {creating ? <Loader2 className="w-5 h-5 animate-spin" /> : "Complete Setup"}
          </button>
        </form>
        <button onClick={handleLogOut} className="w-full text-center text-sm text-slate-500 mt-6 hover:text-white transition-colors">
          Sign out
        </button>
      </motion.div>
    </div>
  );
}
