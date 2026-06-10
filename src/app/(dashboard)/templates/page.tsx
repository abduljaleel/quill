"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { storyTypeLabels } from "@/lib/data/stories";
import type { StoryTemplate } from "@/lib/data/stories";
import { listTemplates } from "@/lib/data/api";
import { BookOpen, ArrowRight } from "lucide-react";

export default function TemplatesPage() {
  const [storyTemplates, setStoryTemplates] = useState<StoryTemplate[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    listTemplates()
      .then(setStoryTemplates)
      .catch((e) =>
        setError(e instanceof Error ? e.message : "Failed to load templates")
      )
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Story Templates</h1>
        <p className="text-muted-foreground">
          Proven narrative structures to guide your writing. Pick a template and start crafting.
        </p>
      </div>

      {error && (
        <p className="rounded-md border border-destructive/30 bg-destructive/10 px-4 py-2 text-sm text-destructive">
          {error}
        </p>
      )}

      {loading && (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[0, 1, 2, 3, 4, 5].map((i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-5 w-24" />
                <Skeleton className="mt-2 h-6 w-40" />
                <Skeleton className="h-4 w-full" />
              </CardHeader>
              <CardContent className="space-y-3">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-20 w-full" />
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {!loading && !error && storyTemplates.length === 0 && (
        <div className="py-12 text-center">
          <BookOpen className="mx-auto h-10 w-10 text-muted-foreground/50" />
          <p className="mt-4 text-sm text-muted-foreground">
            No templates available yet.
          </p>
        </div>
      )}

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {!loading &&
          storyTemplates.map((template) => (
            <Card key={template.id} className="flex flex-col">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5 text-primary" />
                  <Badge variant="secondary">
                    {storyTypeLabels[template.type]}
                  </Badge>
                </div>
                <CardTitle className="mt-2">{template.name}</CardTitle>
                <CardDescription>{template.description}</CardDescription>
              </CardHeader>
              <CardContent className="flex flex-1 flex-col justify-between space-y-4">
                <div>
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-2">
                    Sections ({template.sections.length})
                  </p>
                  <ol className="space-y-1">
                    {template.sections.map((section, i) => (
                      <li
                        key={section.name}
                        className="flex items-center justify-between text-sm"
                      >
                        <span className="text-muted-foreground">
                          {i + 1}. {section.name}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {section.wordCountTarget}w
                        </span>
                      </li>
                    ))}
                  </ol>
                </div>

                <div className="rounded-md bg-muted/50 p-3">
                  <p className="text-xs font-medium text-muted-foreground mb-1">
                    Preview
                  </p>
                  <p className="text-sm italic text-muted-foreground leading-relaxed">
                    &ldquo;{template.examplePreview}&rdquo;
                  </p>
                </div>

                <Link href="/stories/new">
                  <Button variant="outline" className="w-full">
                    Use Template
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
      </div>
    </div>
  );
}
