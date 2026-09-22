"use client";

import { CheckCircle2 } from "lucide-react";

import { cn } from "@/lib/utils";

const WAVE_BARS = [0.45, 0.72, 0.55, 0.9, 0.62, 1, 0.78, 0.58, 0.85, 0.5, 0.68, 0.42] as const;

function LiveWaveform({ inverse }: { inverse: boolean }) {
  return (
    <div className="flex h-12 items-end justify-center gap-1 px-1 md:h-14 md:gap-1.5">
      {WAVE_BARS.map((peak, index) => (
        <span
          key={index}
          className={cn(
            "marketing-wave-bar w-1 rounded-full md:w-1.5",
            inverse ? "bg-white/85" : "bg-cta",
          )}
          style={{
            height: `${Math.round(peak * 100)}%`,
            animationDelay: `${index * 0.07}s`,
          }}
        />
      ))}
    </div>
  );
}

export function MarketingHeroVisual({
  variant = "light",
  className,
}: {
  variant?: "light" | "inverse";
  className?: string;
}) {
  const inverse = variant === "inverse";

  const card = inverse
    ? "border-white/20 bg-white/10 text-white shadow-[0_24px_60px_-20px_rgba(0,0,0,0.45)] backdrop-blur-xl"
    : "border-border/50 bg-card/85 text-foreground shadow-[0_28px_70px_-24px_rgba(99,102,241,0.35)] backdrop-blur-xl";

  const chip = inverse
    ? "border-white/25 bg-white/15 text-white"
    : "border-cta/25 bg-cta/10 text-cta";

  const muted = inverse ? "text-white/70" : "text-muted-foreground";
  const line = inverse ? "bg-white/20" : "bg-border/60";
  const userBubble = inverse ? "bg-white/15" : "bg-muted/80";
  const agentBubble = inverse ? "bg-white/25" : "bg-cta/12";

  return (
    <div
      className={cn(
        "marketing-animate-in marketing-delay-3 relative mx-auto w-full max-w-[min(100%,20rem)] pt-6 md:max-w-[22rem]",
        className,
      )}
      aria-hidden
    >
      <div className="pointer-events-none absolute left-1/2 top-[38%] size-56 -translate-x-1/2 -translate-y-1/2 md:size-64">
        <div
          className={cn(
            "marketing-call-ring absolute inset-0 rounded-full",
            inverse ? "border-white/25" : "border-cta/20",
          )}
        />
        <div
          className={cn(
            "marketing-call-ring marketing-call-ring-delay-1 absolute inset-3 rounded-full",
            inverse ? "border-white/20" : "border-cta/15",
          )}
        />
        <div
          className={cn(
            "marketing-call-ring marketing-call-ring-delay-2 absolute inset-6 rounded-full",
            inverse ? "border-white/15" : "border-cta/10",
          )}
        />
      </div>

      <div
        className={cn(
          "relative rotate-[-2deg] rounded-2xl border p-5 transition-transform duration-500 motion-reduce:transition-none md:p-6",
          "hover:rotate-0",
          card,
        )}
      >
        <div className="flex items-center justify-between gap-3">
          <div className="flex min-w-0 items-center gap-2">
            <span className="relative flex size-2.5 shrink-0">
              <span className="absolute inline-flex size-full animate-ping rounded-full bg-emerald-400/70 opacity-75 motion-reduce:animate-none" />
              <span className="relative inline-flex size-2.5 rounded-full bg-emerald-400" />
            </span>
            <span className="truncate text-xs font-semibold tracking-wide md:text-sm">
              Live · Payer line
            </span>
          </div>
          <span className={cn("shrink-0 font-mono text-[10px] md:text-xs", muted)}>08:42</span>
        </div>

        <div className="my-4 md:my-5">
          <LiveWaveform inverse={inverse} />
        </div>

        <div className="space-y-2.5">
          <div className={cn("h-px w-full", line)} />
          <div className="flex justify-end">
            <div
              className={cn(
                "max-w-[88%] rounded-2xl rounded-tr-md px-3 py-2 text-[11px] leading-snug md:text-xs",
                userBubble,
              )}
            >
              I need the claim status for DOS March 12 — reference CLM-8842.
            </div>
          </div>
          <div className="flex justify-start">
            <div
              className={cn(
                "max-w-[88%] rounded-2xl rounded-tl-md px-3 py-2 text-[11px] leading-snug md:text-xs",
                agentBubble,
              )}
            >
              Pulling that up now. I show paid to member — I can fax the EOB summary.
            </div>
          </div>
        </div>
      </div>

      <div
        className={cn(
          "marketing-float absolute -bottom-1 right-0 flex max-w-[14rem] items-start gap-2 rounded-xl border px-3 py-2.5 shadow-lg md:-right-2",
          chip,
        )}
      >
        <CheckCircle2 className="mt-0.5 size-4 shrink-0 opacity-90" strokeWidth={2} />
        <div className="min-w-0">
          <p className="text-[10px] font-semibold uppercase tracking-wide opacity-80">
            Extracted
          </p>
          <p className="text-xs font-medium leading-snug">claim_status · payment_date</p>
        </div>
      </div>
    </div>
  );
}
