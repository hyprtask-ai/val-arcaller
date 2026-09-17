"use client";

import Link from "next/link";

import { GitHubStarBadge } from "@/components/layout/GitHubStarBadge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  docsUrl,
  HIDE_UPSTREAM_CHROME,
  productFullName,
  PRODUCT_TAGLINE,
} from "@/lib/brand";
import { useAuth } from "@/lib/auth";

export default function OverviewPage() {
  const { user, provider } = useAuth();
  const isOSSMode = provider !== "stack";

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mx-auto max-w-4xl">
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-3xl">
              {isOSSMode
                ? `Welcome to ${productFullName()}`
                : `Welcome${user?.displayName ? `, ${user.displayName.split(" ")[0]}` : ""}!`}
            </CardTitle>
            <CardDescription className="mt-2 text-lg">
              {isOSSMode ? PRODUCT_TAGLINE : "Get started with building voice AI workflows"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isOSSMode && !HIDE_UPSTREAM_CHROME && (
              <div className="mb-6">
                <GitHubStarBadge label="Star us on GitHub" showCount source="overview_page" />
              </div>
            )}
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Create and Manage your Voice Agents</CardTitle>
              <CardDescription>
                Build powerful AI Voice Agents with our visual editor
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild>
                <Link href="/workflow">Go to Agents</Link>
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Configure Services</CardTitle>
              <CardDescription>
                Set up your AI services like LLM, TTS, and STT providers
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild variant="outline">
                <Link href="/model-configurations">Configure Models</Link>
              </Button>
            </CardContent>
          </Card>
        </div>

        {!HIDE_UPSTREAM_CHROME && (
          <Card className="mt-8">
            <CardHeader>
              <CardTitle>Resources</CardTitle>
              <CardDescription>Get help and learn more about the platform</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-4">
                <Button asChild variant="outline">
                  <a href={docsUrl()} target="_blank" rel="noopener noreferrer">
                    Documentation
                  </a>
                </Button>
                <Button asChild variant="outline">
                  <a
                    href="https://github.com/dograh-hq/dograh/issues"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Report an Issue
                  </a>
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
