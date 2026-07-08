import { useState, type FormEvent } from 'react';
import { motion } from 'motion/react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { Loader2, Store } from 'lucide-react';
import { useAuth } from '@/lib/AuthContext';
import { homeRouteForRole } from '@/lib/roles';

export function Register() {
  const { user, loading, signUpWithEmail, signInWithGoogle, role } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
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
    setError(null);

    if (password.length < 8) {
      setError('Password must be at least 8 characters.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setSubmitting(true);
    try {
      await signUpWithEmail(email, password, name);
      navigate('/onboarding', { replace: true });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to create your account.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleGoogle = async () => {
    setError(null);
    try {
      await signInWithGoogle();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to sign up with Google.');
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
          <Store className="h-8 w-8" />
        </div>
        <h1 className="mb-2 text-center text-3xl font-bold text-white">Create your TUVY OS account</h1>
        <p className="mb-8 text-center text-slate-400">Start with a secure customer account. You can create or join a restaurant after sign-up.</p>

        <button
          type="button"
          onClick={handleGoogle}
          className="mb-6 flex w-full items-center justify-center gap-3 rounded-xl bg-white py-3 font-bold text-black transition-all hover:bg-slate-200 active:scale-[0.98]"
        >
          <img src="https://www.google.com/favicon.ico" alt="Google" className="h-5 w-5" />
          Continue with Google
        </button>

        <div className="mb-6 flex items-center gap-4 text-xs uppercase tracking-[0.2em] text-slate-600">
          <div className="h-px flex-1 bg-slate-800" />
          <span>or register with email</span>
          <div className="h-px flex-1 bg-slate-800" />
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-slate-300">Name</label>
            <input
              type="text"
              required
              value={name}
              onChange={(event) => setName(event.target.value)}
              className="w-full rounded-xl border border-slate-800 bg-slate-900/50 px-4 py-3 text-white outline-none transition-colors placeholder:text-slate-600 focus:border-amber-500"
              placeholder="Avery Johnson"
            />
          </div>
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
          <div className="space-y-2">
            <label className="block text-sm font-medium text-slate-300">Password</label>
            <input
              type="password"
              autoComplete="new-password"
              required
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="w-full rounded-xl border border-slate-800 bg-slate-900/50 px-4 py-3 text-white outline-none transition-colors placeholder:text-slate-600 focus:border-amber-500"
              placeholder="At least 8 characters"
            />
          </div>
          <div className="space-y-2">
            <label className="block text-sm font-medium text-slate-300">Confirm password</label>
            <input
              type="password"
              autoComplete="new-password"
              required
              value={confirmPassword}
              onChange={(event) => setConfirmPassword(event.target.value)}
              className="w-full rounded-xl border border-slate-800 bg-slate-900/50 px-4 py-3 text-white outline-none transition-colors placeholder:text-slate-600 focus:border-amber-500"
              placeholder="Repeat your password"
            />
          </div>

          {error ? <p className="rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-200">{error}</p> : null}

          <button
            type="submit"
            disabled={submitting}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-amber-500 py-3 font-bold text-black transition-all hover:bg-amber-400 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {submitting ? <Loader2 className="h-5 w-5 animate-spin" /> : null}
            Create account
          </button>
        </form>

        <div className="mt-6 flex flex-col items-center justify-center gap-3 text-sm text-slate-500 sm:flex-row">
          <Link to="/login" className="transition-colors hover:text-white">Already have an account?</Link>
          <span className="hidden sm:block">•</span>
          <Link to="/" className="transition-colors hover:text-white">Back to home</Link>
        </div>
      </motion.div>
    </div>
  );
}
