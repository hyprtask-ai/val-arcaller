import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

export function MarketingBackground({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("marketing-page relative min-h-screen overflow-x-hidden bg-background text-foreground", className)}>
      <div aria-hidden className="marketing-mesh pointer-events-none absolute inset-0" />
      <div aria-hidden className="marketing-orb marketing-orb-a pointer-events-none absolute -left-32 top-20 size-[28rem] rounded-full opacity-30 blur-3xl" />
      <div aria-hidden className="marketing-orb marketing-orb-b pointer-events-none absolute -right-24 bottom-32 size-[24rem] rounded-full opacity-25 blur-3xl" />
      <div className="relative z-10">{children}</div>
    </div>
  );
}
