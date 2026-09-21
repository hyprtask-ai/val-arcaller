"use client";

import { ClipboardList, FileWarning, Phone, Scale } from "lucide-react";

const ICONS = [
  { Icon: Phone, className: "marketing-hero-icon-a top-8 left-1/2 -translate-x-1/2" },
  { Icon: FileWarning, className: "marketing-hero-icon-b bottom-12 left-4 md:left-8" },
  { Icon: Scale, className: "marketing-hero-icon-c bottom-16 right-4 md:right-8" },
  { Icon: ClipboardList, className: "marketing-hero-icon-d top-1/3 right-6 md:right-12" },
] as const;

export function MarketingHeroVisual() {
  return (
    <div
      className="marketing-animate-in marketing-delay-3 relative mx-auto aspect-square w-full max-w-md"
      aria-hidden
    >
      <div className="absolute inset-8 rounded-[2rem] border border-border/40 bg-card/40 shadow-2xl backdrop-blur-sm" />
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="flex size-28 items-center justify-center rounded-3xl bg-cta/15 text-cta shadow-lg ring-1 ring-cta/20 transition-transform duration-300 hover:scale-105 motion-reduce:transition-none">
          <Phone className="size-14 stroke-[1.25]" />
        </div>
      </div>
      {ICONS.map(({ Icon, className }, index) => (
        <div
          key={index}
          className={`marketing-float absolute flex size-16 items-center justify-center rounded-2xl border border-border/50 bg-card/80 text-cta shadow-md backdrop-blur-md transition-transform duration-300 hover:scale-105 motion-reduce:transition-none md:size-20 ${className}`}
        >
          <Icon className="size-8 md:size-9 stroke-[1.25]" />
        </div>
      ))}
    </div>
  );
}
