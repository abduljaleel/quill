"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import {
  storyTypeLabels,
  storyStatusColors,
  getStoryProgress,
  getCompletedSections,
} from "@/lib/data/stories";
import type { Story } from "@/lib/data/stories";
import { listStories } from "@/lib/data/api";
import { Plus, Film, Loader2 } from "lucide-react";

export default function StoriesPage() {
  const [stories, setStories] = useState<Story[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  useEffect(() => {
    listStories()
      .then(setStories)
      .catch((e) =>
        setError(e instanceof Error ? e.message : "Failed to load stories")
      )
      .finally(() => setLoading(false));
  }, []);

  const filtered = stories.filter((s) => {
    if (typeFilter !== "all" && s.type !== typeFilter) return false;
    if (statusFilter !== "all" && s.status !== statusFilter) return false;
    return true;
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Stories</h1>
          <p className="text-muted-foreground">
            All your narratives in one place. Filter, review, and keep writing.
          </p>
        </div>
        <Link href="/stories/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Create Story
          </Button>
        </Link>
      </div>

      {error && (
        <p className="rounded-md border border-destructive/30 bg-destructive/10 px-4 py-2 text-sm text-destructive">
          {error}
        </p>
      )}

      {/* Filters */}
      <div className="flex items-center gap-3">
        <Select value={typeFilter} onValueChange={(v) => setTypeFilter(v ?? "all")}>
          <SelectTrigger>
            <SelectValue placeholder="All types" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All types</SelectItem>
            <SelectItem value="origin">Origin Story</SelectItem>
            <SelectItem value="launch">Launch Narrative</SelectItem>
            <SelectItem value="pitch">Investor Pitch</SelectItem>
            <SelectItem value="case_study">Case Study</SelectItem>
            <SelectItem value="brand_manifesto">Brand Manifesto</SelectItem>
            <SelectItem value="explainer">Product Explainer</SelectItem>
          </SelectContent>
        </Select>

        <Select value={statusFilter} onValueChange={(v) => setStatusFilter(v ?? "all")}>
          <SelectTrigger>
            <SelectValue placeholder="All statuses" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All statuses</SelectItem>
            <SelectItem value="draft">Draft</SelectItem>
            <SelectItem value="review">In Review</SelectItem>
            <SelectItem value="published">Published</SelectItem>
          </SelectContent>
        </Select>

        {(typeFilter !== "all" || statusFilter !== "all") && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setTypeFilter("all");
              setStatusFilter("all");
            }}
          >
            Clear filters
          </Button>
        )}
      </div>

      {/* Table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Progress</TableHead>
                <TableHead>Created</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading && (
                <TableRow>
                  <TableCell colSpan={5} className="py-12 text-center">
                    <Loader2 className="mx-auto h-6 w-6 animate-spin text-muted-foreground/50" />
                    <p className="mt-2 text-sm text-muted-foreground">
                      Loading stories...
                    </p>
                  </TableCell>
                </TableRow>
              )}
              {!loading &&
                filtered.map((story) => {
                  const progress = getStoryProgress(story);
                  const completed = getCompletedSections(story);
                  return (
                    <TableRow key={story.id}>
                      <TableCell>
                        <Link
                          href={`/stories/${story.id}`}
                          className="font-medium hover:underline"
                        >
                          {story.title}
                        </Link>
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary">
                          {storyTypeLabels[story.type]}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <span
                          className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${storyStatusColors[story.status]}`}
                        >
                          {story.status}
                        </span>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Progress value={progress} className="h-1.5 w-20" />
                          <span className="text-xs text-muted-foreground">
                            {completed}/{story.sections.length}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {new Date(story.createdAt).toLocaleDateString("en-IE", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </TableCell>
                    </TableRow>
                  );
                })}
              {!loading && filtered.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} className="py-12 text-center">
                    <Film className="mx-auto h-8 w-8 text-muted-foreground/50" />
                    <p className="mt-2 text-sm text-muted-foreground">
                      {stories.length === 0
                        ? "No stories yet. Create your first story to get started."
                        : "No stories match your filters."}
                    </p>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
