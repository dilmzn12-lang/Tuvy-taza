import { useState, type FormEvent } from 'react';
import { motion } from 'motion/react';
import { Link, Navigate } from 'react-router-dom';
import { ArrowRight, Loader2, Mail } from 'lucide-react';
import { useAuth } from '@/lib/AuthContext';
import { homeRouteForRole } from '@/lib/roles';

export function ForgotPassword() {
  const { user, loading, role, resetPassword } = useAuth();
  const [email, setEmail] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  if (loading) {
    return (
      <div className="flex min-h-[100dvh] items-center justify-center bg-[#050505]">
        <Loader2 className="h-8 w-8 animate-spin text-amber-500" />
      </div>
    );
  }

  if (user) {
    return <Navigate to={homeRouteForRole(role)} replace />;
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      await resetPassword(email);
      setSuccess(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to send password reset email.');
    } finally {
      setSubmitting(false);
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
        <h1 className="mb-2 text-center text-3xl font-bold text-white">Reset your password</h1>
        <p className="mb-8 text-center text-slate-400">We&apos;ll send a password reset link to your inbox.</p>

        {success ? (
          <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/10 p-4 text-sm text-emerald-100">
            Check your inbox for the reset link.
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-slate-300">Email</label>
              <input
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                className="w-full rounded-xl border border-slate-800 bg-slate-900/50 px-4 py-3 text-white outline-none transition-colors placeholder:text-slate-600 focus:border-amber-500"
                placeholder="you@restaurant.com"
              />
            </div>

            {error ? <p className="rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-200">{error}</p> : null}

            <button
              type="submit"
              disabled={submitting}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-amber-500 py-3 font-bold text-black transition-all hover:bg-amber-400 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {submitting ? <Loader2 className="h-5 w-5 animate-spin" /> : null}
              Send reset email
            </button>
          </form>
        )}

        <div className="mt-6 flex flex-col items-center justify-center gap-3 text-sm text-slate-500 sm:flex-row">
          <Link to="/login" className="transition-colors hover:text-white">Back to login</Link>
          <span className="hidden sm:block">•</span>
          <Link to="/register" className="transition-colors hover:text-white">Create account</Link>
          <span className="hidden sm:block">•</span>
          <Link to="/" className="inline-flex items-center gap-1 transition-colors hover:text-white">
            Home <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
