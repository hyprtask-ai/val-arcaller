/** Routes reachable without an OSS session (must stay in sync with middleware). */
export const PUBLIC_MARKETING_PATHS = ["/", "/auth/login", "/auth/signup", "/embed"] as const;

export function isPublicMarketingPath(pathname: string): boolean {
  return PUBLIC_MARKETING_PATHS.some(
    (path) => pathname === path || pathname.startsWith(`${path}/`),
  );
}
