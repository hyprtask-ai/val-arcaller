import type { ReactNode } from "react";

import { MarketingBackground } from "@/components/marketing/MarketingBackground";
import { marketingFormCard } from "@/components/marketing/marketingClasses";
import { MarketingHeroVisual } from "@/components/marketing/MarketingHeroVisual";
import { MarketingHomeLink } from "@/components/marketing/MarketingHomeLink";
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
          <div className="flex flex-1 items-center justify-center pb-8 pt-4 lg:pt-0">
            <div
              className={cn(
                marketingFormCard,
                "marketing-animate-in marketing-delay-2 w-full max-w-md space-y-6",
              )}
            >
              <div className="flex justify-center lg:hidden">
                <MarketingHomeLink
                  showByline
                  className="mb-1 [&_img]:size-11 [&_span:first-of-type]:text-xl"
                />
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

          <div className="relative marketing-animate-in">
            <MarketingHomeLink
              inverse
              className="[&_img]:size-12 xl:[&_img]:size-14 [&_span:first-of-type]:text-2xl xl:[&_span:first-of-type]:text-3xl"
            />
          </div>

          <div className="relative mx-auto flex w-full max-w-md flex-col gap-8 py-6">
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

            <MarketingHeroVisual variant="inverse" className="max-w-[17rem] xl:max-w-[19rem]" />
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
