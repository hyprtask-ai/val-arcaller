import {
  ArrowRight,
  ClipboardList,
  FileWarning,
  Phone,
  Scale,
} from "lucide-react";
import Link from "next/link";

import { SiteFooter } from "@/components/layout/SiteFooter";
import { Button } from "@/components/ui/button";
import {
  AR_VOICE_CAPABILITIES,
  AR_VOICE_CARD_BULLETS,
  AR_VOICE_CARD_INTRO,
  AR_VOICE_CARD_LEDE,
  AR_VOICE_EYEBROW,
  AR_VOICE_HERO_LEDE,
  AR_VOICE_HERO_TITLE,
  AR_VOICE_PILLS,
} from "@/lib/marketing/arVoiceAgents";

import { MarketingBackground } from "./MarketingBackground";
import { MarketingHeroVisual } from "./MarketingHeroVisual";
import { MarketingHomeLink } from "./MarketingHomeLink";
import { marketingCard, marketingGhostButton, marketingPrimaryButton } from "./marketingClasses";

const CAPABILITY_ICONS = [Phone, FileWarning, Scale, ClipboardList] as const;

export function LandingPage({
  signupEnabled,
  authenticated,
  appHref = "/workflow",
}: {
  signupEnabled: boolean;
  authenticated: boolean;
  appHref?: string;
}) {
  const primaryHref = authenticated ? appHref : "/auth/login";
  const primaryLabel = authenticated ? "View agents" : "Sign in to workspace";

  return (
    <MarketingBackground>
      <header className="sticky top-0 z-20 border-b border-border/40 bg-background/70 backdrop-blur-xl">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-6 py-4">
          <MarketingHomeLink showByline className="scale-105 origin-left md:scale-110" />
          <div className="flex items-center gap-2">
            {!authenticated && signupEnabled ? (
              <Button variant="ghost" asChild className={marketingGhostButton}>
                <Link href="/auth/signup">Sign up</Link>
              </Button>
            ) : null}
            <Button asChild className={marketingPrimaryButton}>
              <Link href={primaryHref}>{authenticated ? "View agents" : "Sign in"}</Link>
            </Button>
          </div>
        </div>
      </header>

      <main>
        <section className="border-b border-border/40">
          <div className="mx-auto grid max-w-6xl items-center gap-12 px-6 py-16 md:py-24 lg:grid-cols-2 lg:gap-16 lg:py-28">
            <div className="space-y-8 text-center lg:text-left">
              <p className="marketing-animate-in marketing-delay-1 text-xs font-semibold uppercase tracking-[0.2em] text-cta">
                {AR_VOICE_EYEBROW}
              </p>
              <h1 className="marketing-animate-in marketing-delay-2 text-4xl font-bold leading-[1.08] tracking-tight md:text-5xl lg:text-6xl">
                {AR_VOICE_HERO_TITLE}
              </h1>
              <p className="marketing-animate-in marketing-delay-3 mx-auto max-w-xl text-lg leading-relaxed text-muted-foreground lg:mx-0">
                {AR_VOICE_HERO_LEDE}
              </p>
              <ul className="marketing-animate-in marketing-delay-4 flex flex-wrap justify-center gap-2 lg:justify-start">
                {AR_VOICE_PILLS.map((pill) => (
                  <li
                    key={pill}
                    className="rounded-full border border-border/50 bg-card/50 px-4 py-1.5 text-sm font-medium text-muted-foreground backdrop-blur-sm"
                  >
                    {pill}
                  </li>
                ))}
              </ul>
              <div className="marketing-animate-in marketing-delay-4 flex flex-wrap justify-center gap-3 lg:justify-start">
                <Button size="lg" asChild className={`group ${marketingPrimaryButton}`}>
                  <Link href={primaryHref}>
                    {primaryLabel}
                    <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5 motion-reduce:transition-none" />
                  </Link>
                </Button>
                {!authenticated && signupEnabled ? (
                  <Button size="lg" variant="outline" asChild className="border-border/60 bg-card/30 backdrop-blur-sm">
                    <Link href="/auth/signup">Create account</Link>
                  </Button>
                ) : null}
              </div>
            </div>

            <div className="mx-auto w-full max-w-md pb-8 lg:pb-0">
              <MarketingHeroVisual />
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-6 py-16 md:py-24">
          <div className={`${marketingCard} marketing-animate-in p-8 md:p-10`}>
            <div className="grid gap-8 lg:grid-cols-[1fr_1.1fr] lg:items-start">
              <div>
                <h2 className="text-2xl font-bold tracking-tight md:text-3xl">
                  {AR_VOICE_CARD_INTRO}
                </h2>
                <p className="mt-3 text-muted-foreground">{AR_VOICE_CARD_LEDE}</p>
              </div>
              <ul className="grid gap-3 sm:grid-cols-2">
                {AR_VOICE_CARD_BULLETS.map((item) => (
                  <li
                    key={item}
                    className="flex gap-3 rounded-xl border border-border/40 bg-background/40 p-4 text-sm transition-colors duration-200 hover:border-cta/30 motion-reduce:transition-none"
                  >
                    <span className="mt-1.5 size-2 shrink-0 rounded-full bg-cta" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-6 pb-20 md:pb-28">
          <div className="marketing-animate-in mb-12 max-w-2xl">
            <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
              What the agents handle on the phone
            </h2>
            <p className="mt-3 text-lg text-muted-foreground">
              Built for the call volume clinical, toxicology, molecular, and pathology
              billing teams cannot fully staff in-house.
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-2">
            {AR_VOICE_CAPABILITIES.map(({ title, description }, index) => {
              const Icon = CAPABILITY_ICONS[index] ?? Phone;
              return (
                <article
                  key={title}
                  className={`${marketingCard} marketing-animate-in group p-8`}
                  style={{ animationDelay: `${0.08 * index}s` }}
                >
                  <div className="mb-6 flex size-16 items-center justify-center rounded-2xl bg-cta/10 text-cta ring-1 ring-cta/15 transition-transform duration-300 group-hover:scale-105 motion-reduce:transition-none">
                    <Icon className="size-8 stroke-[1.25]" />
                  </div>
                  <h3 className="text-xl font-semibold">{title}</h3>
                  <p className="mt-3 leading-relaxed text-muted-foreground">{description}</p>
                </article>
              );
            })}
          </div>
        </section>
      </main>

      <SiteFooter />
    </MarketingBackground>
  );
}
