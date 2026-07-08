import { motion } from "motion/react";
import { Link, Navigate } from "react-router-dom";
import { Store, Loader2 } from "lucide-react";
import { useState } from "react";
import { useAuth } from "@/lib/AuthContext";
import { getErrorMessage } from "@/lib/utils";
import { ErrorBanner } from "@/components/ErrorBanner";

export function Login() {
  const { user, loading, signInWithGoogle, restaurantId } = useAuth();
  const [signingIn, setSigningIn] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSignIn = async () => {
    setError(null);
    setSigningIn(true);
    try {
      await signInWithGoogle();
    } catch (e) {
      setError(getErrorMessage(e, "Could not sign in with Google. Please try again."));
    } finally {
      setSigningIn(false);
    }
  };

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

        {error && <ErrorBanner message={error} className="mb-6 text-left" />}

        <button 
          onClick={handleSignIn}
          disabled={signingIn}
          className="w-full bg-white text-black font-bold py-3 rounded-xl hover:bg-slate-200 transition-all active:scale-[0.98] flex items-center justify-center gap-3 disabled:opacity-50"
        >
          {signingIn ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <img src="https://www.google.com/favicon.ico" alt="Google" className="w-5 h-5" />
          )}
          {signingIn ? "Signing in..." : "Continue with Google"}
        </button>
        
        <div className="mt-8 flex items-center gap-4 text-sm text-slate-500 justify-center">
          <Link to="/" className="hover:text-white transition-colors">Back to Home</Link>
        </div>
      </motion.div>
    </div>
  );
}
