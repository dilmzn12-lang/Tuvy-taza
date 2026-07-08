import { useState } from 'react';
import { AlertTriangle, Loader2 } from 'lucide-react';
import { useAuth } from '@/lib/AuthContext';

export function VerifyEmailBanner() {
  const { emailVerified, sendVerificationEmail, reloadUser, user } = useAuth();
  const [sending, setSending] = useState(false);
  const [checking, setChecking] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  if (!user || emailVerified) {
    return null;
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

  const handleChecked = async () => {
    setChecking(true);
    setMessage(null);

    try {
      await reloadUser();
      setMessage('Email status refreshed.');
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Unable to refresh verification status.');
    } finally {
      setChecking(false);
    }
  };

  return (
    <div className="border-b border-amber-500/20 bg-amber-500/10 px-4 py-3 text-amber-50">
      <div className="mx-auto flex max-w-7xl flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-start gap-3">
          <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-amber-400" />
          <div>
            <p className="text-sm font-semibold text-white">Verify your email to keep your workspace secure.</p>
            <p className="text-xs text-amber-100/80">You can continue working while verification is pending.</p>
            {message ? <p className="mt-1 text-xs text-amber-100/90">{message}</p> : null}
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={handleResend}
            disabled={sending}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-amber-400/30 bg-amber-500/15 px-3 py-2 text-xs font-semibold text-amber-50 transition-colors hover:bg-amber-500/25 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {sending ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : null}
            Resend verification
          </button>
          <button
            type="button"
            onClick={handleChecked}
            disabled={checking}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-amber-500 px-3 py-2 text-xs font-semibold text-black transition-colors hover:bg-amber-400 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {checking ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : null}
            I&apos;ve verified
          </button>
        </div>
      </div>
    </div>
  );
}
