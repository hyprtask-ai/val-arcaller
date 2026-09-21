import type { ReactNode } from "react";

import { Headphones, Phone, Sparkles } from "lucide-react";

import { MarketingBackground } from "@/components/marketing/MarketingBackground";
import { MarketingHomeLink } from "@/components/marketing/MarketingHomeLink";
import { marketingFormCard } from "@/components/marketing/marketingClasses";
import { HIDE_UPSTREAM_CHROME } from "@/lib/brand";
import {
  AR_VOICE_EYEBROW,
  AR_VOICE_HERO_LEDE,
  AR_VOICE_HERO_TITLE,
  AR_VOICE_PILLS,
} from "@/lib/marketing/arVoiceAgents";
import { cn } from "@/lib/utils";

export function AuthShell({
  children,
  enterpriseSlot,
}: {
  children: ReactNode;
  enterpriseSlot?: ReactNode;
}) {
  return (
    <MarketingBackground className="min-h-screen">
      <div className="grid min-h-screen w-full lg:grid-cols-[minmax(0,1fr)_minmax(0,0.95fr)]">
        <main className="flex min-h-screen flex-col px-6 py-8 sm:px-10 lg:py-12">
          <div className="marketing-animate-in mb-8 lg:mb-10">
            <MarketingHomeLink showByline className="h-9" />
          </div>

          <div className="flex flex-1 items-center justify-center pb-8">
            <div
              className={cn(
                marketingFormCard,
                "marketing-animate-in marketing-delay-2 w-full max-w-md space-y-6",
              )}
            >
              <div className="flex justify-center lg:hidden">
                <MarketingHomeLink mark logoClassName="h-12" />
              </div>
              {children}
            </div>
          </div>
        </main>

        <aside className="relative hidden flex-col justify-between overflow-hidden border-l border-white/10 bg-[var(--brand-hyprtask)] p-10 text-white lg:flex xl:p-14">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.12),transparent_50%)]"
          />
          <div
            aria-hidden
            className="marketing-orb marketing-orb-a pointer-events-none absolute -right-20 top-1/4 size-72 rounded-full opacity-40 blur-3xl"
          />

          <div className="relative">
            <MarketingHomeLink inverse logoClassName="h-10" />
          </div>

          <div className="relative mx-auto w-full max-w-md space-y-8 py-8">
            <div className="marketing-animate-in marketing-delay-1 space-y-4">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/70">
                {AR_VOICE_EYEBROW}
              </p>
              <h1 className="text-2xl font-bold leading-tight tracking-tight xl:text-3xl">
                {AR_VOICE_HERO_TITLE}
              </h1>
              <p className="text-sm leading-relaxed text-white/85">{AR_VOICE_HERO_LEDE}</p>
            </div>

            <ul className="marketing-animate-in marketing-delay-2 flex flex-wrap gap-2">
              {AR_VOICE_PILLS.map((point) => (
                <li
                  key={point}
                  className="rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-medium text-white/95 backdrop-blur-sm"
                >
                  {point}
                </li>
              ))}
            </ul>

            <div className="marketing-animate-in marketing-delay-3 relative flex h-48 items-center justify-center" aria-hidden>
              <div className="marketing-float flex size-24 items-center justify-center rounded-3xl bg-white/15 text-white ring-1 ring-white/20">
                <Phone className="size-12 stroke-[1.25]" />
              </div>
              <div className="marketing-hero-icon-b absolute bottom-2 left-0 flex size-14 items-center justify-center rounded-2xl bg-white/10 text-white/90 ring-1 ring-white/15">
                <Headphones className="size-7" />
              </div>
              <div className="marketing-hero-icon-d absolute right-0 top-2 flex size-14 items-center justify-center rounded-2xl bg-white/10 text-white/90 ring-1 ring-white/15">
                <Sparkles className="size-7" />
              </div>
            </div>
          </div>

          {!HIDE_UPSTREAM_CHROME && enterpriseSlot ? (
            <div className="relative mb-8 max-w-md space-y-3 rounded-2xl border border-white/15 bg-white/5 p-5 backdrop-blur-sm xl:mb-12">
              <h2 className="text-sm font-semibold text-white">
                Need on-prem, data residency &amp; a data perimeter?
              </h2>
              <p className="text-sm text-white/75">
                Contact us for regulated and high-scale deployments.
              </p>
              {enterpriseSlot}
            </div>
          ) : (
            <div aria-hidden className="mb-8 xl:mb-12" />
          )}
        </aside>
      </div>
    </MarketingBackground>
  );
}
