/**
 * Val / Hyprtask white-label tokens. NEXT_PUBLIC_* values are baked in at
 * build time for Docker production images (see ui/Dockerfile).
 */

const truthy = (value: string | undefined): boolean =>
  value === "1" || value === "true";

export const PRODUCT_NAME = process.env.NEXT_PUBLIC_PRODUCT_NAME ?? "Val";

export const PRODUCT_FULL_NAME =
  process.env.NEXT_PUBLIC_PRODUCT_FULL_NAME ?? "Val by hyprtask";

export const PRODUCT_TAGLINE =
  process.env.NEXT_PUBLIC_PRODUCT_TAGLINE ??
  "Voice agents for AR Caller";

export const BRAND_DOMAIN =
  process.env.NEXT_PUBLIC_BRAND_DOMAIN ?? "hyprtask.ai";

export const DOCS_URL = process.env.NEXT_PUBLIC_DOCS_URL ?? "";

export const PRIVACY_URL =
  process.env.NEXT_PUBLIC_PRIVACY_URL ?? `https://${BRAND_DOMAIN}/privacy`;

export const TERMS_URL =
  process.env.NEXT_PUBLIC_TERMS_URL ?? `https://${BRAND_DOMAIN}/terms`;

/** Hide Dograh upstream marketing (GitHub star, hire expert, update nudge). */
export const HIDE_UPSTREAM_CHROME = (() => {
  const raw = process.env.NEXT_PUBLIC_HIDE_UPSTREAM_CHROME?.trim();
  if (!raw) return true;
  return truthy(raw);
})();

export const BRAND_MARK_SRC = "/hyprtask-mark.png";
export const BRAND_LOGO_SRC = "/hyprtask-logo.png";
export const BRAND_LOGO_INVERSE_SRC = "/hyprtask-logo-inverse.png";

let runtimeProductName: string | null = null;
let runtimeProductFullName: string | null = null;

/** Apply brand strings from GET /api/v1/health (via /api/config/version). */
export function setRuntimeBrand(config: {
  productName?: string | null;
  productFullName?: string | null;
}): void {
  runtimeProductName =
    typeof config.productName === "string" && config.productName.length > 0
      ? config.productName
      : null;
  runtimeProductFullName =
    typeof config.productFullName === "string" &&
    config.productFullName.length > 0
      ? config.productFullName
      : null;
}

function resolvedProductName(): string {
  return runtimeProductName ?? PRODUCT_NAME;
}

function resolvedProductFullName(): string {
  return runtimeProductFullName ?? PRODUCT_FULL_NAME;
}

export function productName(): string {
  return resolvedProductName();
}

export function productFullName(): string {
  return resolvedProductFullName();
}

/** Possessive form for UI copy, e.g. "Val's". */
export function productPossessive(): string {
  const name = resolvedProductName();
  return name.endsWith("s") ? `${name}'` : `${name}'s`;
}

/** User-facing label for managed-model mode (wire format stays `dograh`). */
export function managedModelsLabel(): string {
  return resolvedProductName();
}

export function usageTokenLabel(): string {
  return `${resolvedProductName()} tokens`;
}

export function serviceUnavailableMessage(): string {
  return `${resolvedProductName()} is temporarily unavailable. Please try again later.`;
}

export function docsUrl(path = ""): string {
  if (!DOCS_URL) return "#";
  const base = DOCS_URL.replace(/\/$/, "");
  if (!path) return base;
  return `${base}/${path.replace(/^\//, "")}`;
}
