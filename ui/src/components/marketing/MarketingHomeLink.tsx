import Link from "next/link";

import { BrandLogo } from "@/components/BrandLogo";
import { productFullName } from "@/lib/brand";
import { cn } from "@/lib/utils";

export function MarketingHomeLink({
  className,
  showByline = false,
  inverse = false,
  mark = false,
  logoClassName,
}: {
  className?: string;
  showByline?: boolean;
  inverse?: boolean;
  mark?: boolean;
  logoClassName?: string;
}) {
  return (
    <Link
      href="/"
      aria-label={`${productFullName()} home`}
      className={cn(
        "inline-flex rounded-lg transition-opacity hover:opacity-90",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cta/50 focus-visible:ring-offset-2 focus-visible:ring-offset-background",
        className,
      )}
    >
      <BrandLogo
        showByline={showByline}
        inverse={inverse}
        mark={mark}
        className={logoClassName}
      />
    </Link>
  );
}
