import {
  BRAND_LOGO_INVERSE_SRC,
  BRAND_LOGO_SRC,
  BRAND_MARK_SRC,
  productFullName,
  productName,
} from "@/lib/brand";
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
  /** Sidebar header: mark + product name + "by hyprtask" stack */
  showByline?: boolean;
}) {
  const alt = productFullName();

  if (showByline) {
    return (
      <div className={cn("flex min-w-0 items-center gap-2", className)}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={BRAND_MARK_SRC}
          alt={alt}
          className="h-6 w-auto shrink-0 select-none"
        />
        <div className="flex min-w-0 items-baseline gap-1 leading-none">
          <span className="truncate text-sm font-semibold">{productName()}</span>
          <span className="truncate text-[10px] text-muted-foreground">by hyprtask</span>
        </div>
      </div>
    );
  }

  if (mark) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img src={BRAND_MARK_SRC} alt={alt} className={cn("w-auto select-none", className)} />
    );
  }

  if (inverse) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={BRAND_LOGO_INVERSE_SRC}
        alt={alt}
        className={cn("w-auto select-none", className)}
      />
    );
  }

  return (
    <>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={BRAND_LOGO_SRC}
        alt={alt}
        className={cn("block w-auto select-none dark:hidden", className)}
      />
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={BRAND_LOGO_INVERSE_SRC}
        alt={alt}
        className={cn("hidden w-auto select-none dark:block", className)}
      />
    </>
  );
}
