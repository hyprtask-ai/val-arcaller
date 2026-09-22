"use client";

import { ClipboardList, FileWarning, Phone, Scale } from "lucide-react";

import { cn } from "@/lib/utils";

function OrbitTile({
  Icon,
  className,
}: {
  Icon: typeof Phone;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex size-14 items-center justify-center rounded-2xl shadow-lg backdrop-blur-md transition-transform duration-300 motion-reduce:transition-none md:size-16",
        className,
      )}
    >
      <Icon className="size-7 stroke-[1.5] md:size-8" />
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

  const glow = inverse
    ? "bg-[radial-gradient(circle,rgba(255,255,255,0.14)_0%,transparent_70%)]"
    : "bg-[radial-gradient(circle,rgba(99,102,241,0.18)_0%,transparent_70%)]";

  const satellite = inverse
    ? "bg-white/12 text-white shadow-white/5 ring-1 ring-white/15"
    : "bg-card/90 text-cta shadow-cta/10 ring-1 ring-border/30";

  const hub = inverse
    ? "bg-white/18 text-white ring-1 ring-white/25"
    : "bg-cta/15 text-cta ring-1 ring-cta/25";

  return (
    <div
      className={cn(
        "marketing-animate-in marketing-delay-3 relative mx-auto aspect-square w-full max-w-[min(100%,22rem)]",
        className,
      )}
      aria-hidden
    >
      <div className={cn("absolute inset-[8%] rounded-full", glow)} />

      <div className="absolute inset-[6%] grid grid-cols-3 grid-rows-3 place-items-center">
        <div className="col-start-2 row-start-1 marketing-float">
          <OrbitTile Icon={Phone} className={satellite} />
        </div>
        <div className="col-start-1 row-start-2 marketing-float marketing-delay-1">
          <OrbitTile Icon={FileWarning} className={satellite} />
        </div>
        <div
          className={cn(
            "col-start-2 row-start-2 marketing-float flex size-[5.5rem] items-center justify-center rounded-[1.75rem] shadow-xl backdrop-blur-sm md:size-24 md:rounded-[2rem]",
            hub,
          )}
        >
          <Phone className="size-10 stroke-[1.35] md:size-12" />
        </div>
        <div className="col-start-3 row-start-2 marketing-float marketing-delay-2">
          <OrbitTile Icon={ClipboardList} className={satellite} />
        </div>
        <div className="col-start-2 row-start-3 marketing-float marketing-delay-3">
          <OrbitTile Icon={Scale} className={satellite} />
        </div>
      </div>
    </div>
  );
}
