"use client";

import Link from "next/link";

import { useAppConfig } from "@/context/AppConfigContext";
import {
  PRIVACY_URL,
  productName,
  TERMS_URL,
} from "@/lib/brand";

const HYPRTASK_URL = "https://hyprtask.com";

export function SiteFooter({ className = "" }: { className?: string }) {
  const { config } = useAppConfig();
  const version =
    config?.uiVersion && config.uiVersion !== "dev" && config.uiVersion !== "unknown"
      ? config.uiVersion
      : null;

  return (
    <footer
      className={`border-t border-border/60 bg-background py-2 text-center text-xs text-muted-foreground ${className}`}
    >
      <p>
        &copy; {new Date().getFullYear()} {productName()} by{" "}
        <Link
          href={HYPRTASK_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="text-[#007AFF] transition-opacity hover:opacity-80"
        >
          hyprtask
        </Link>{" "}
        | All Rights Reserved
        {version ? ` | v${version}` : null}
      </p>
      <p className="mt-0.5">
        <Link
          href={PRIVACY_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="transition-opacity hover:text-foreground"
        >
          Privacy Policy
        </Link>
        <span className="mx-2 text-border">|</span>
        <Link
          href={TERMS_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="transition-opacity hover:text-foreground"
        >
          Terms of Service
        </Link>
      </p>
    </footer>
  );
}
