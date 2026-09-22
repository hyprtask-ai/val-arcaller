import { BRAND_MARK_SRC, productFullName, productName } from "@/lib/brand";
import { cn } from "@/lib/utils";

export function BrandLogo({
  className,
  inverse = false,
  mark = false,
  showByline = false,
}: {
  className?: string;
  inverse?: boolean;
  mark?: boolean;
  /** Header / sidebar: Val mark + product name */
  showByline?: boolean;
}) {
  const alt = productFullName();
  const name = productName();

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
    return (
      <div
        className={cn(
          "flex min-w-0 items-center gap-3",
          inverse && "text-white",
          className,
        )}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={BRAND_MARK_SRC}
          alt=""
          aria-hidden
          className={cn(
            "size-10 shrink-0 select-none object-contain md:size-11",
            inverse && "drop-shadow-sm",
          )}
        />
        <span
          className={cn(
            "truncate text-lg font-bold tracking-tight md:text-xl",
            !inverse && "text-foreground",
          )}
        >
          {name}
        </span>
      </div>
    );
  }

  return (
    <div className={cn("flex min-w-0 items-center gap-3", className)}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={BRAND_MARK_SRC}
        alt={alt}
        className="size-9 shrink-0 select-none object-contain md:size-10"
      />
      <span className="truncate text-lg font-bold tracking-tight text-foreground md:text-xl">
        {name}
      </span>
    </div>
  );
}
