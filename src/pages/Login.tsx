import { motion } from "motion/react";
import { Link, useNavigate, Navigate } from "react-router-dom";
import { Store, Loader2, ArrowRight } from "lucide-react";
import { useAuth } from "@/lib/AuthContext";

export function Login() {
  const { user, loading, signInWithGoogle, restaurantId } = useAuth();
  const navigate = useNavigate();

  if (loading) {
    return <div className="min-h-[100dvh] bg-[#050505] flex items-center justify-center"><Loader2 className="w-8 h-8 text-amber-500 animate-spin" /></div>;
  }

  if (user) {
    if (restaurantId) {
      return <Navigate to="/dashboard" replace />;
    } else {
      return <Navigate to="/onboarding" replace />;
    }
  }

  return (
    <div className="min-h-[100dvh] bg-[#050505] text-slate-300 flex flex-col font-sans selection:bg-amber-500/20 items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full bg-[#080808] border border-slate-800 p-8 rounded-2xl shadow-2xl text-center"
      >
        <div className="w-16 h-16 bg-amber-500/10 text-amber-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
          <Store className="w-8 h-8" />
        </div>
        <h1 className="text-3xl font-bold text-white mb-2">Welcome to TUVY OS</h1>
        <p className="text-slate-400 mb-8">Sign in to manage your restaurant, access the POS, and view live orders.</p>
        
        <button 
          onClick={signInWithGoogle}
          className="w-full bg-white text-black font-bold py-3 rounded-xl hover:bg-slate-200 transition-all active:scale-[0.98] flex items-center justify-center gap-3"
        >
          <img src="https://www.google.com/favicon.ico" alt="Google" className="w-5 h-5" />
          Continue with Google
        </button>
        
        <div className="mt-8 flex items-center gap-4 text-sm text-slate-500 justify-center">
          <Link to="/" className="hover:text-white transition-colors">Back to Home</Link>
        </div>
      </motion.div>
    </div>
  );
}
