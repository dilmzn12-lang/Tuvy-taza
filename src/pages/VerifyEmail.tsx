import { useState } from 'react';
import { motion } from 'motion/react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { ArrowRight, CheckCircle2, Loader2, Mail } from 'lucide-react';
import { auth } from '@/lib/firebase';
import { useAuth } from '@/lib/AuthContext';
import { homeRouteForRole } from '@/lib/roles';

export function VerifyEmail() {
  const { user, loading, role, emailVerified, sendVerificationEmail, reloadUser } = useAuth();
  const navigate = useNavigate();
  const [message, setMessage] = useState<string | null>(null);
  const [sending, setSending] = useState(false);
  const [checking, setChecking] = useState(false);

  if (loading) {
    return (
      <div className="flex min-h-[100dvh] items-center justify-center bg-[#050505]">
        <Loader2 className="h-8 w-8 animate-spin text-amber-500" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (emailVerified) {
    return <Navigate to={homeRouteForRole(role)} replace />;
  }

  const handleResend = async () => {
    setSending(true);
    setMessage(null);

    try {
      await sendVerificationEmail();
      setMessage('Verification email sent.');
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Unable to send verification email.');
    } finally {
      setSending(false);
    }
  };

  const handleContinue = async () => {
    setChecking(true);
    setMessage(null);

    try {
      await reloadUser();
      if (auth.currentUser?.emailVerified) {
        navigate(homeRouteForRole(role), { replace: true });
      } else {
        setMessage('Your email is still not verified. Please open the latest verification email and try again.');
      }
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Unable to refresh verification status.');
    } finally {
      setChecking(false);
    }
  };

  return (
    <div className="flex min-h-[100dvh] items-center justify-center bg-[#050505] p-4 font-sans text-slate-300 selection:bg-amber-500/20">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md rounded-2xl border border-slate-800 bg-[#080808] p-8 shadow-2xl"
      >
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-amber-500/10 text-amber-500">
          <Mail className="h-8 w-8" />
        </div>
        <h1 className="mb-2 text-center text-3xl font-bold text-white">Verify your email</h1>
        <p className="mb-8 text-center text-slate-400">We sent a verification link to <span className="text-white">{user.email}</span>.</p>

        <div className="space-y-3">
          {message ? <p className="rounded-xl border border-slate-800 bg-slate-900/50 px-4 py-3 text-sm text-slate-200">{message}</p> : null}
          <button
            type="button"
            onClick={handleResend}
            disabled={sending}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-white py-3 font-bold text-black transition-all hover:bg-slate-200 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {sending ? <Loader2 className="h-5 w-5 animate-spin" /> : null}
            Resend email
          </button>
          <button
            type="button"
            onClick={handleContinue}
            disabled={checking}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-amber-500 py-3 font-bold text-black transition-all hover:bg-amber-400 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {checking ? <Loader2 className="h-5 w-5 animate-spin" /> : <CheckCircle2 className="h-5 w-5" />}
            I&apos;ve verified, continue
          </button>
        </div>

        <div className="mt-6 flex flex-col items-center justify-center gap-3 text-sm text-slate-500 sm:flex-row">
          <Link to="/login" className="transition-colors hover:text-white">Back to login</Link>
          <span className="hidden sm:block">•</span>
          <Link to="/" className="inline-flex items-center gap-1 transition-colors hover:text-white">
            Home <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
