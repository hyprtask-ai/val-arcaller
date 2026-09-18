"use client";

import Link from "next/link";

import { useAppConfig } from "@/context/AppConfigContext";
import {
  BRAND_DOMAIN,
  PRIVACY_URL,
  productFullName,
  TERMS_URL,
} from "@/lib/brand";

export function AppFooter() {
  const { config } = useAppConfig();
  const version =
    config?.uiVersion && config.uiVersion !== "dev" && config.uiVersion !== "unknown"
      ? config.uiVersion
      : null;

  return (
    <footer className="mt-auto border-t border-border bg-background py-2 text-slate-600 dark:text-muted-foreground">
      <div className="container mx-auto px-4">
        <div className="flex flex-col items-center justify-center gap-1 text-center">
          <p className="text-xs">
            &copy; {new Date().getFullYear()}{" "}
            <Link
              href={`https://${BRAND_DOMAIN}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#007AFF] transition-opacity hover:opacity-80"
            >
              {productFullName()}
            </Link>{" "}
            | All Rights Reserved
          </p>
          <p className="text-xs">
            {version ? <>v{version} | </> : null}
            Powered by{" "}
            <Link
              href="https://hyprtask.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#007AFF] transition-opacity hover:opacity-80"
            >
              hyprtask
            </Link>
          </p>
          <p className="text-xs">
            <Link
              href={PRIVACY_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="transition-opacity hover:opacity-80"
            >
              Privacy Policy
            </Link>
            <span className="mx-2 text-border">|</span>
            <Link
              href={TERMS_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="transition-opacity hover:opacity-80"
            >
              Terms of Service
            </Link>
          </p>
        </div>
      </div>
    </footer>
  );
}
