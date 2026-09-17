import type { ReactNode } from "react";

import { BrandLogo } from "@/components/BrandLogo";
import {
  HIDE_UPSTREAM_CHROME,
  PRODUCT_FULL_NAME,
  PRODUCT_TAGLINE,
} from "@/lib/brand";

const HIGHLIGHTS = [
  "Outbound & inbound calls",
  "Campaign dialing",
  "Bring your own models",
];

export function AuthShell({
  children,
  enterpriseSlot,
}: {
  children: ReactNode;
  enterpriseSlot?: ReactNode;
}) {
  return (
    <div className="grid min-h-screen w-full bg-background lg:grid-cols-[55%_45%]">
      <main className="auth-imprint flex min-h-screen flex-col overflow-y-auto">
        <div className="flex min-h-full items-center justify-center p-6 sm:p-10">
          <div className="w-full max-w-md space-y-6 rounded-2xl border border-border/60 bg-card p-6 shadow-lg sm:p-8">
            <div className="lg:hidden">
              <BrandLogo className="h-8" />
            </div>
            {children}
          </div>
        </div>
      </main>

      <aside className="relative hidden flex-col justify-between overflow-hidden border-l border-border/60 bg-zinc-950 p-10 lg:flex xl:p-14">
        <div
          aria-hidden
          className="pointer-events-none absolute -right-24 top-1/3 size-[28rem] rounded-full opacity-20 blur-3xl"
          style={{ background: "radial-gradient(circle, var(--cta), transparent 70%)" }}
        />

        <div className="relative">
          <BrandLogo inverse className="h-9" />
        </div>

        <div className="relative max-w-md space-y-5">
          <h1 className="text-3xl font-semibold leading-tight tracking-tight text-zinc-50 xl:text-4xl">
            {PRODUCT_FULL_NAME}
          </h1>
          <p className="text-sm text-zinc-400">{PRODUCT_TAGLINE}</p>
          <ul className="flex flex-wrap gap-2">
            {HIGHLIGHTS.map((point) => (
              <li
                key={point}
                className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-xs font-medium text-zinc-300"
              >
                {point}
              </li>
            ))}
          </ul>
        </div>

        {!HIDE_UPSTREAM_CHROME && enterpriseSlot ? (
          <div className="relative mb-12 max-w-md space-y-3 rounded-xl border border-white/10 bg-white/[0.03] p-5 xl:mb-16">
            <h2 className="text-sm font-semibold text-zinc-100">
              Need on-prem, data residency &amp; a data perimeter?
            </h2>
            <p className="text-sm text-zinc-400">
              Contact us for regulated and high-scale deployments.
            </p>
            {enterpriseSlot}
          </div>
        ) : (
          <div aria-hidden className="mb-12 xl:mb-16" />
        )}
      </aside>
    </div>
  );
}
