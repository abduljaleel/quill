"use client";

import { useCallback, useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";
import {
  storyTypeLabels,
  storyStatusColors,
  getStoryProgress,
  getCompletedSections,
} from "@/lib/data/stories";
import type { Story, BrandVoice } from "@/lib/data/stories";
import {
  getCurrentUser,
  listStories,
  listBrandVoices,
  seedDemoData,
} from "@/lib/data/api";
import { Film, PenLine, Globe, Palette, Plus, Loader2, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function DashboardPage() {
  const [stories, setStories] = useState<Story[]>([]);
  const [brandVoices, setBrandVoices] = useState<BrandVoice[]>([]);
  const [userLabel, setUserLabel] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [seeding, setSeeding] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    try {
      setError(null);
      const [user, fetchedStories, fetchedVoices] = await Promise.all([
        getCurrentUser(),
        listStories(),
        listBrandVoices(),
      ]);
      setUserLabel(user.fullName || user.email);
      setStories(fetchedStories);
      setBrandVoices(fetchedVoices);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load dashboard");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  async function handleSeed() {
    setSeeding(true);
    setError(null);
    try {
      await seedDemoData();
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load demo data");
    } finally {
      setSeeding(false);
    }
  }

  const totalStories = stories.length;
  const inProgress = stories.filter((s) => s.status === "draft" || s.status === "review").length;
  const published = stories.filter((s) => s.status === "published").length;
  const brandVoiceCount = brandVoices.length;

  const recentStories = [...stories].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  if (loading) {
    return (
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">Loading your storytelling overview...</p>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[0, 1, 2, 3].map((i) => (
            <Card key={i}>
              <CardHeader className="pb-2">
                <Skeleton className="h-4 w-24" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-8 w-12" />
                <Skeleton className="mt-2 h-3 w-32" />
              </CardContent>
            </Card>
          ))}
        </div>
        <div className="grid gap-6 lg:grid-cols-2">
          {[0, 1].map((i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-5 w-32" />
                <Skeleton className="h-4 w-48" />
              </CardHeader>
              <CardContent className="space-y-4">
                <Skeleton className="h-20 w-full" />
                <Skeleton className="h-20 w-full" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome back, {userLabel}. Here is your storytelling overview.
        </p>
      </div>

      {error && (
        <p className="rounded-md border border-destructive/30 bg-destructive/10 px-4 py-2 text-sm text-destructive">
          {error}
        </p>
      )}

      <div className="flex justify-end">
        <Link href="/stories/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Create Story
          </Button>
        </Link>
      </div>

      {/* Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          title="Total Stories"
          value={String(totalStories)}
          description="Stories in your library"
          icon={<Film className="h-4 w-4 text-muted-foreground" />}
        />
        <MetricCard
          title="In Progress"
          value={String(inProgress)}
          description="Drafts and stories in review"
          icon={<PenLine className="h-4 w-4 text-muted-foreground" />}
        />
        <MetricCard
          title="Published"
          value={String(published)}
          description="Live and ready to share"
          icon={<Globe className="h-4 w-4 text-muted-foreground" />}
        />
        <MetricCard
          title="Brand Voices"
          value={String(brandVoiceCount)}
          description="Voice configurations active"
          icon={<Palette className="h-4 w-4 text-muted-foreground" />}
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Active Stories */}
        <Card>
          <CardHeader>
            <CardTitle>Active Stories</CardTitle>
            <CardDescription>Stories currently being crafted</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {recentStories
              .filter((s) => s.status !== "published")
              .slice(0, 3)
              .map((story) => {
                const progress = getStoryProgress(story);
                const completed = getCompletedSections(story);
                return (
                  <Link
                    key={story.id}
                    href={`/stories/${story.id}`}
                    className="block rounded-lg border p-4 transition-colors hover:bg-muted/50"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="space-y-1 min-w-0">
                        <p className="font-medium leading-snug truncate">{story.title}</p>
                        <div className="flex items-center gap-2">
                          <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${storyStatusColors[story.status]}`}>
                            {story.status}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            {storyTypeLabels[story.type]}
                          </span>
                        </div>
                      </div>
                      <span className="text-sm font-medium text-muted-foreground whitespace-nowrap">
                        {completed}/{story.sections.length}
                      </span>
                    </div>
                    <div className="mt-3">
                      <Progress value={progress} className="h-1.5" />
                    </div>
                  </Link>
                );
              })}
            {stories.filter((s) => s.status !== "published").length === 0 && (
              <div className="py-4 text-center">
                <p className="text-sm text-muted-foreground">
                  No active stories. Start writing your first narrative.
                </p>
                {totalStories === 0 && (
                  <Button
                    variant="outline"
                    className="mt-4"
                    onClick={handleSeed}
                    disabled={seeding}
                  >
                    {seeding ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      <Sparkles className="mr-2 h-4 w-4" />
                    )}
                    {seeding ? "Loading demo data..." : "Load demo data"}
                  </Button>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent Edits */}
        <Card>
          <CardHeader>
            <CardTitle>Recently Created</CardTitle>
            <CardDescription>Your newest stories first</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {recentStories.slice(0, 4).map((story) => (
              <Link
                key={story.id}
                href={`/stories/${story.id}`}
                className="flex items-center justify-between rounded-lg border p-4 transition-colors hover:bg-muted/50"
              >
                <div className="space-y-1 min-w-0">
                  <p className="font-medium leading-snug truncate">{story.title}</p>
                  <p className="text-xs text-muted-foreground">
                    Created {new Date(story.createdAt).toLocaleDateString("en-IE", { month: "short", day: "numeric", year: "numeric" })}
                  </p>
                </div>
                <Badge variant="secondary">{storyTypeLabels[story.type]}</Badge>
              </Link>
            ))}
            {recentStories.length === 0 && (
              <p className="py-4 text-center text-sm text-muted-foreground">
                No stories yet. Your edits will appear here.
              </p>
            )}
          </CardContent>
        </Card>

        {/* Brand Voice Summary */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Brand Voice Overview</CardTitle>
            <CardDescription>Your configured narrative voices</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2">
              {brandVoices.map((voice) => (
                <Link
                  key={voice.id}
                  href={`/brand?voice=${voice.id}`}
                  className="rounded-lg border p-4 transition-colors hover:bg-muted/50"
                >
                  <p className="font-medium">{voice.name}</p>
                  <p className="mt-1 text-sm text-muted-foreground">{voice.targetAudience}</p>
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {voice.toneDescriptors.map((tone) => (
                      <span
                        key={tone}
                        className="inline-flex items-center rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary"
                      >
                        {tone}
                      </span>
                    ))}
                  </div>
                </Link>
              ))}
            </div>
            {brandVoices.length === 0 && (
              <p className="py-4 text-center text-sm text-muted-foreground">
                No brand voices configured yet. Define one on the Brand Voice page.
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function MetricCard({
  title,
  value,
  description,
  icon,
}: {
  title: string;
  value: string;
  description: string;
  icon: React.ReactNode;
}) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <p className="text-xs text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  );
}
