import { ArrowRight, MessageCircle, Mic, Phone, Workflow } from "lucide-react";
import Link from "next/link";

import { BrandLogo } from "@/components/BrandLogo";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { Button } from "@/components/ui/button";
import {
  PRODUCT_TAGLINE,
  productFullName,
} from "@/lib/brand";

const FEATURES = [
  {
    icon: Workflow,
    title: "Visual agent builder",
    description:
      "Design call flows with a drag-and-drop workflow editor — prompts, tools, and routing in one place.",
  },
  {
    icon: Phone,
    title: "Telephony ready",
    description:
      "Connect carriers, run outbound campaigns, and handle inbound calls with WebRTC or PSTN.",
  },
  {
    icon: Mic,
    title: "Live voice agents",
    description:
      "Low-latency speech-to-speech and cascade pipelines tuned for real phone conversations.",
  },
  {
    icon: MessageCircle,
    title: "Website embeds",
    description:
      "Drop voice or chat widgets onto any site, or drive calls from your own UI with the embed API.",
  },
];

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
    <div className="min-h-screen bg-background text-foreground">
      <header className="border-b border-border/60 bg-background/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-6 py-4">
          <BrandLogo showByline className="h-9" />
          <div className="flex items-center gap-2">
            {!authenticated && signupEnabled ? (
              <Button variant="ghost" asChild>
                <Link href="/auth/signup">Sign up</Link>
              </Button>
            ) : null}
            <Button asChild className="bg-cta text-cta-foreground hover:bg-cta/90">
              <Link href={primaryHref}>{authenticated ? "View agents" : "Sign in"}</Link>
            </Button>
          </div>
        </div>
      </header>

      <main>
        <section className="relative overflow-hidden border-b border-border/60">
          <div
            aria-hidden
            className="pointer-events-none absolute -right-32 top-0 size-[32rem] rounded-full opacity-20 blur-3xl"
            style={{
              background:
                "radial-gradient(circle, var(--cta), transparent 70%)",
            }}
          />
          <div className="relative mx-auto grid max-w-6xl gap-10 px-6 py-16 md:py-24 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
            <div className="space-y-6">
              <p className="text-sm font-medium uppercase tracking-wider text-muted-foreground">
                Voice AI platform
              </p>
              <h1 className="text-4xl font-semibold tracking-tight md:text-5xl lg:text-6xl">
                {productFullName()}
              </h1>
              <p className="max-w-xl text-lg text-muted-foreground">
                {PRODUCT_TAGLINE}. Build, deploy, and operate conversational
                agents for outbound calling, inbound support, and web embeds.
              </p>
              <div className="flex flex-wrap gap-3">
                <Button
                  size="lg"
                  asChild
                  className="bg-cta text-cta-foreground hover:bg-cta/90"
                >
                  <Link href={primaryHref}>
                    {primaryLabel}
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                {!authenticated && signupEnabled ? (
                  <Button size="lg" variant="outline" asChild>
                    <Link href="/auth/signup">Create account</Link>
                  </Button>
                ) : null}
              </div>
            </div>

            <div className="rounded-2xl border border-border/60 bg-card p-6 shadow-xl md:p-8">
              <p className="mb-4 text-sm font-medium text-muted-foreground">
                Built for operators who need
              </p>
              <ul className="space-y-3 text-sm">
                {[
                  "Campaign dialing with disposition tracking",
                  "Bring-your-own-model configuration",
                  "Self-hosted deployment on your infrastructure",
                  "MCP integration for agent authoring in Cursor",
                ].map((item) => (
                  <li key={item} className="flex gap-2">
                    <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-cta" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-6 py-16 md:py-20">
          <div className="mb-10 max-w-2xl">
            <h2 className="text-2xl font-semibold tracking-tight md:text-3xl">
              Everything you need to run voice agents
            </h2>
            <p className="mt-2 text-muted-foreground">
              From first prototype to production campaigns — one workspace for
              design, telephony, and monitoring.
            </p>
          </div>
          <div className="grid gap-6 sm:grid-cols-2">
            {FEATURES.map(({ icon: Icon, title, description }) => (
              <article
                key={title}
                className="rounded-xl border border-border/60 bg-card/50 p-6"
              >
                <div className="mb-4 inline-flex rounded-lg bg-cta/10 p-2 text-cta">
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="font-semibold">{title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  {description}
                </p>
              </article>
            ))}
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
