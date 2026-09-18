import { withSentryConfig } from "@sentry/nextjs";
import type { NextConfig } from "next";

// Set in ui/Dockerfile for OSS installs on memory-constrained hosts (8 GB).
// Skips the heaviest build-time checks and Sentry webpack hooks so `npm run
// build` stays under the droplet RAM budget during `docker compose build ui`.
const isDockerOssBuild = process.env.DOCKER_OSS_BUILD === "1";

const nextConfig: NextConfig = {
  output: "standalone",
  eslint: {
    ignoreDuringBuilds: isDockerOssBuild,
  },
  typescript: {
    ignoreBuildErrors: isDockerOssBuild,
  },
  experimental: {
    serverSourceMaps: !isDockerOssBuild,
  },
  async rewrites() {
    return [
      // Val white-label alias; dograh-widget.js remains for backward compatibility.
      {
        source: "/embed/val-widget.js",
        destination: "/embed/dograh-widget.js",
      },
      {
        source: "/ingest/static/:path*",
        destination: "https://us-assets.i.posthog.com/static/:path*",
      },
      {
        source: "/ingest/:path*",
        destination: "https://us.i.posthog.com/:path*",
      },
      {
        source: "/ingest/decide",
        destination: "https://us.i.posthog.com/decide",
      },
    ];
  },
  // This is required to support PostHog trailing slash API requests
  skipTrailingSlashRedirect: true,
};

const sentryConfig = {
  // For all available options, see:
  // https://www.npmjs.com/package/@sentry/webpack-plugin#options

  org: "dograh",
  project: "javascript-nextjs",

  // Only print logs for uploading source maps in CI
  silent: !process.env.CI,

  // For all available options, see:
  // https://docs.sentry.io/platforms/javascript/guides/nextjs/manual-setup/

  // Upload a larger set of source maps for prettier stack traces (increases build time)
  widenClientFileUpload: true,

  // Route browser requests to Sentry through a Next.js rewrite to circumvent ad-blockers.
  // This can increase your server load as well as your hosting bill.
  // Note: Check that the configured route will not match with your Next.js middleware, otherwise reporting of client-
  // side errors will fail.
  tunnelRoute: "/monitoring",

  webpack: {
    // Automatically tree-shake Sentry logger statements to reduce bundle size
    treeshake: {
      removeDebugLogging: true,
    },

    // Enables automatic instrumentation of Vercel Cron Monitors. (Does not yet work with App Router route handlers.)
    // See the following for more information:
    // https://docs.sentry.io/product/crons/
    // https://vercel.com/docs/cron-jobs
    automaticVercelMonitors: true,
  },
};

export default isDockerOssBuild
  ? nextConfig
  : withSentryConfig(nextConfig, sentryConfig);
