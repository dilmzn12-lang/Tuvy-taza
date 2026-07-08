import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Full-screen centered loading spinner used across pages while data loads.
 * `dvh` uses the dynamic viewport height (better on mobile), matching the
 * original mobile-first screens.
 */
export function LoadingScreen({ dvh = false }: { dvh?: boolean }) {
  return (
    <div
      className={cn(
        "bg-[#050505] flex items-center justify-center",
        dvh ? "min-h-[100dvh]" : "min-h-screen",
      )}
    >
      <Loader2 className="w-8 h-8 text-amber-500 animate-spin" />
    </div>
  );
}
