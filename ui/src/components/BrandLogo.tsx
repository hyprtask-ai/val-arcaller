import { BRAND_MARK_SRC, productFullName, productName } from "@/lib/brand";
import { cn } from "@/lib/utils";

function LogoWordmark({
  inverse = false,
  className,
  markClassName,
  nameClassName,
  bylineClassName,
}: {
  inverse?: boolean;
  className?: string;
  markClassName?: string;
  nameClassName?: string;
  bylineClassName?: string;
}) {
  const name = productName();

  return (
    <div className={cn("flex min-w-0 items-center gap-2.5", className)}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={BRAND_MARK_SRC}
        alt=""
        aria-hidden
        className={cn(
          "size-10 shrink-0 select-none object-contain md:size-11",
          inverse && "drop-shadow-sm",
          markClassName,
        )}
      />
      <div className="flex min-w-0 flex-wrap items-baseline gap-x-1.5 gap-y-0 leading-none">
        <span
          className={cn(
            "truncate text-lg font-bold tracking-tight md:text-xl",
            inverse ? "text-white" : "text-foreground",
            nameClassName,
          )}
        >
          {name}
        </span>
        <span
          className={cn(
            "truncate text-[10px] font-medium md:text-[11px]",
            inverse ? "text-white/65" : "text-muted-foreground",
            bylineClassName,
          )}
        >
          by hyprtask
        </span>
      </div>
    </div>
  );
}

export function BrandLogo({
  className,
  inverse = false,
  mark = false,
  showByline = false,
}: {
  className?: string;
  inverse?: boolean;
  mark?: boolean;
  /** Header / sidebar: Val mark + product name + byline */
  showByline?: boolean;
}) {
  const alt = productFullName();

  if (mark) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={BRAND_MARK_SRC}
        alt={alt}
        className={cn("size-auto shrink-0 select-none object-contain", className)}
      />
    );
  }

  if (showByline || inverse) {
    return <LogoWordmark inverse={inverse} className={className} />;
  }

  return <LogoWordmark className={className} />;
}
