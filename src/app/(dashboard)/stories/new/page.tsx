"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { StoryType, StoryTemplate, BrandVoice } from "@/lib/data/stories";
import { listTemplates, listBrandVoices, createStory } from "@/lib/data/api";
import { ArrowLeft, ArrowRight, Check, Loader2 } from "lucide-react";

export default function NewStoryPage() {
  return (
    <Suspense fallback={null}>
      <NewStoryForm />
    </Suspense>
  );
}

function NewStoryForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const presetTemplateId = searchParams.get("template");
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [selectedType, setSelectedType] = useState<StoryType | null>(null);
  const [selectedTemplateId, setSelectedTemplateId] = useState<string | null>(null);
  const [selectedVoiceId, setSelectedVoiceId] = useState<string>("none");
  const [title, setTitle] = useState("");
  const [storyTemplates, setStoryTemplates] = useState<StoryTemplate[]>([]);
  const [brandVoices, setBrandVoices] = useState<BrandVoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    Promise.all([listTemplates(), listBrandVoices()])
      .then(([templates, voices]) => {
        setStoryTemplates(templates);
        setBrandVoices(voices);
        if (voices.length > 0) setSelectedVoiceId(voices[0].id);
        // Deep-link from the Templates page: pre-select the chosen template and
        // jump straight to naming the story.
        if (presetTemplateId) {
          const preset = templates.find((t) => t.id === presetTemplateId);
          if (preset) {
            setSelectedType(preset.type);
            setSelectedTemplateId(preset.id);
            setStep(3);
          }
        }
      })
      .catch((e) =>
        setError(e instanceof Error ? e.message : "Failed to load templates")
      )
      .finally(() => setLoading(false));
  }, []);

  const selectedTemplate = storyTemplates.find((t) => t.id === selectedTemplateId);

  async function handleCreate() {
    if (!selectedTemplateId || !title.trim()) return;
    setCreating(true);
    setError(null);
    try {
      const storyId = await createStory({
        title: title.trim(),
        templateId: selectedTemplateId,
        brandVoiceId: selectedVoiceId !== "none" ? selectedVoiceId : null,
      });
      router.push(`/stories/${storyId}`);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to create story");
      setCreating(false);
    }
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/stories">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Stories
          </Button>
        </Link>
      </div>

      <div>
        <h1 className="text-3xl font-bold tracking-tight">Create a New Story</h1>
        <p className="text-muted-foreground">
          Choose your narrative type, pick a template, and give it a title.
        </p>
      </div>

      {error && (
        <p className="rounded-md border border-destructive/30 bg-destructive/10 px-4 py-2 text-sm text-destructive">
          {error}
        </p>
      )}

      {/* Step indicator */}
      <div className="flex items-center gap-2">
        {[1, 2, 3].map((s) => (
          <div key={s} className="flex items-center gap-2">
            <div
              className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-medium ${
                step >= s
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground"
              }`}
            >
              {step > s ? <Check className="h-4 w-4" /> : s}
            </div>
            <span className={`text-sm ${step >= s ? "text-foreground" : "text-muted-foreground"}`}>
              {s === 1 ? "Choose Type" : s === 2 ? "Pick Template" : "Name It"}
            </span>
            {s < 3 && <div className="mx-2 h-px w-8 bg-border" />}
          </div>
        ))}
      </div>

      {loading && (
        <div className="flex flex-col items-center justify-center py-16">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground/50" />
          <p className="mt-3 text-sm text-muted-foreground">Loading templates...</p>
        </div>
      )}

      {/* Step 1: Choose Type */}
      {!loading && step === 1 && (
        <div className="grid gap-3 md:grid-cols-2">
          {(["origin", "launch", "pitch", "case_study", "brand_manifesto", "explainer"] as StoryType[]).map(
            (type) => {
              const template = storyTemplates.find((t) => t.type === type);
              if (!template) return null;
              return (
                <Card
                  key={type}
                  className={`cursor-pointer transition-all hover:border-primary/50 ${
                    selectedType === type ? "border-primary ring-2 ring-primary/20" : ""
                  }`}
                  onClick={() => setSelectedType(type)}
                >
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">{template.name}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">{template.description}</p>
                    <p className="mt-2 text-xs text-muted-foreground">
                      {template.sections.length} sections
                    </p>
                  </CardContent>
                </Card>
              );
            }
          )}
        </div>
      )}

      {/* Step 2: Pick Template */}
      {!loading && step === 2 && selectedType && (
        <div className="space-y-4">
          {storyTemplates
            .filter((t) => t.type === selectedType)
            .map((template) => (
              <Card
                key={template.id}
                className={`cursor-pointer transition-all hover:border-primary/50 ${
                  selectedTemplateId === template.id
                    ? "border-primary ring-2 ring-primary/20"
                    : ""
                }`}
                onClick={() => setSelectedTemplateId(template.id)}
              >
                <CardHeader>
                  <CardTitle className="text-base">{template.name}</CardTitle>
                  <CardDescription>{template.description}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex flex-wrap gap-1.5">
                    {template.sections.map((section) => (
                      <Badge key={section.name} variant="secondary">
                        {section.name}
                      </Badge>
                    ))}
                  </div>
                  <p className="text-sm italic text-muted-foreground">
                    &ldquo;{template.examplePreview}&rdquo;
                  </p>
                </CardContent>
              </Card>
            ))}
        </div>
      )}

      {/* Step 3: Name It */}
      {!loading && step === 3 && selectedTemplate && (
        <Card>
          <CardHeader>
            <CardTitle>Name Your Story</CardTitle>
            <CardDescription>
              Using the <span className="font-medium">{selectedTemplate.name}</span> template
              with {selectedTemplate.sections.length} sections.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Story Title</Label>
              <Input
                id="title"
                placeholder="e.g. How We Built the Future of Storytelling"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="text-base"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="brand-voice">Brand Voice</Label>
              <Select
                value={selectedVoiceId}
                onValueChange={(v) => setSelectedVoiceId(v ?? "none")}
              >
                <SelectTrigger id="brand-voice" className="w-full">
                  <SelectValue placeholder="Choose a brand voice" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">No brand voice</SelectItem>
                  {brandVoices.map((voice) => (
                    <SelectItem key={voice.id} value={voice.id}>
                      {voice.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="rounded-lg bg-muted/50 p-4">
              <p className="text-sm font-medium">Sections you will write:</p>
              <ol className="mt-2 space-y-1">
                {selectedTemplate.sections.map((section, i) => (
                  <li key={section.name} className="text-sm text-muted-foreground">
                    {i + 1}. {section.name}{" "}
                    <span className="text-xs">({section.wordCountTarget} words target)</span>
                  </li>
                ))}
              </ol>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Navigation */}
      <div className="flex items-center justify-between">
        <Button
          variant="outline"
          onClick={() => setStep((s) => Math.max(1, s - 1) as 1 | 2 | 3)}
          disabled={step === 1 || creating}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>

        {step < 3 ? (
          <Button
            onClick={() => {
              if (step === 1 && selectedType) {
                // Auto-select the template for that type
                const tpl = storyTemplates.find((t) => t.type === selectedType);
                if (tpl) setSelectedTemplateId(tpl.id);
                setStep(2);
              } else if (step === 2 && selectedTemplateId) {
                setStep(3);
              }
            }}
            disabled={
              loading ||
              (step === 1 && !selectedType) ||
              (step === 2 && !selectedTemplateId)
            }
          >
            Continue
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        ) : (
          <Button onClick={handleCreate} disabled={!title.trim() || creating}>
            {creating ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Check className="mr-2 h-4 w-4" />
            )}
            {creating ? "Creating..." : "Create Story"}
          </Button>
        )}
      </div>
    </div>
  );
}
