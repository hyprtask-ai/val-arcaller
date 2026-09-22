"use client";

import { CheckCircle2 } from "lucide-react";

import { cn } from "@/lib/utils";

const WAVE_BARS = [0.45, 0.72, 0.55, 0.9, 0.62, 1, 0.78, 0.58, 0.85, 0.5, 0.68, 0.42] as const;

function LiveWaveform({ inverse }: { inverse: boolean }) {
  return (
    <div className="flex h-11 w-full items-end justify-center gap-1 md:h-12 md:gap-1.5">
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
    ? "border-white/20 bg-white/10 text-white shadow-[0_20px_50px_-24px_rgba(0,0,0,0.5)] backdrop-blur-xl"
    : "border-border/50 bg-card/90 text-foreground shadow-[0_24px_60px_-28px_rgba(99,102,241,0.28)] backdrop-blur-xl";

  const muted = inverse ? "text-white/70" : "text-muted-foreground";
  const line = inverse ? "bg-white/20" : "bg-border/60";
  const userBubble = inverse ? "bg-white/15" : "bg-muted/80";
  const agentBubble = inverse ? "bg-white/25" : "bg-cta/12";
  const extractedRow = inverse
    ? "border-white/20 bg-white/10"
    : "border-cta/20 bg-cta/8";

  return (
    <div
      className={cn(
        "marketing-animate-in marketing-delay-3 relative w-full",
        className,
      )}
      aria-hidden
    >
      <div className="relative isolate w-full">
        <div
          className={cn(
            "pointer-events-none absolute left-1/2 top-1/2 z-0 size-[min(100%,14rem)] -translate-x-1/2 -translate-y-1/2 md:size-60",
          )}
        >
          <div
            className={cn(
              "marketing-call-ring absolute inset-0 rounded-full",
              inverse ? "border-white/20" : "border-cta/15",
            )}
          />
          <div
            className={cn(
              "marketing-call-ring marketing-call-ring-delay-1 absolute inset-4 rounded-full",
              inverse ? "border-white/15" : "border-cta/10",
            )}
          />
        </div>

        <div className={cn("relative z-10 w-full rounded-2xl border p-4 md:p-5", card)}>
          <div className="flex items-center justify-between gap-3">
            <div className="flex min-w-0 items-center gap-2">
              <span className="relative flex size-2 shrink-0">
                <span className="absolute inline-flex size-full animate-ping rounded-full bg-emerald-400/70 opacity-75 motion-reduce:animate-none" />
                <span className="relative inline-flex size-2 rounded-full bg-emerald-400" />
              </span>
              <span className="truncate text-xs font-semibold md:text-sm">Live · Payer line</span>
            </div>
            <span className={cn("shrink-0 font-mono text-[10px] tabular-nums md:text-xs", muted)}>
              08:42
            </span>
          </div>

          <div className="my-3 md:my-4">
            <LiveWaveform inverse={inverse} />
          </div>

          <div className={cn("mb-3 h-px w-full md:mb-4", line)} />

          <div className="space-y-2">
            <div className="flex justify-end">
              <div
                className={cn(
                  "max-w-[92%] rounded-xl rounded-tr-sm px-2.5 py-2 text-[11px] leading-snug md:text-xs",
                  userBubble,
                )}
              >
                Claim status for DOS 03/12 — ref CLM-8842.
              </div>
            </div>
            <div className="flex justify-start">
              <div
                className={cn(
                  "max-w-[92%] rounded-xl rounded-tl-sm px-2.5 py-2 text-[11px] leading-snug md:text-xs",
                  agentBubble,
                )}
              >
                Paid to member — I can fax the EOB summary to your line.
              </div>
            </div>
          </div>

          <div
            className={cn(
              "mt-3 flex items-center gap-2 rounded-lg border px-2.5 py-2 md:mt-4",
              extractedRow,
            )}
          >
            <CheckCircle2
              className={cn("size-4 shrink-0", inverse ? "text-emerald-300" : "text-cta")}
              strokeWidth={2}
            />
            <div className="min-w-0 text-[11px] leading-snug md:text-xs">
              <span className={cn("font-semibold uppercase tracking-wide", muted)}>Extracted </span>
              <span className="font-medium">claim_status · payment_date</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
