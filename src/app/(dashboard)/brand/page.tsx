"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";
import type { BrandVoice } from "@/lib/data/stories";
import {
  listBrandVoices,
  createBrandVoice,
  updateBrandVoice,
  deleteBrandVoice,
} from "@/lib/data/api";
import {
  Palette,
  Plus,
  X,
  MessageSquare,
  AlertTriangle,
  Users,
  Eye,
  Loader2,
  Trash2,
} from "lucide-react";

export default function BrandVoicePage() {
  const [brandVoices, setBrandVoices] = useState<BrandVoice[]>([]);
  const [selectedVoice, setSelectedVoice] = useState<BrandVoice | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [creating, setCreating] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [savedFlash, setSavedFlash] = useState(false);

  const [editName, setEditName] = useState("");
  const [editTone, setEditTone] = useState("");
  const [editExamples, setEditExamples] = useState("");
  const [editAvoid, setEditAvoid] = useState("");
  const [editAudience, setEditAudience] = useState("");

  function selectVoice(voice: BrandVoice) {
    setSelectedVoice(voice);
    setEditName(voice.name);
    setEditTone(voice.toneDescriptors.join(", "));
    setEditExamples(voice.examplePhrases.join("\n"));
    setEditAvoid(voice.avoidPhrases.join("\n"));
    setEditAudience(voice.targetAudience);
  }

  useEffect(() => {
    listBrandVoices()
      .then((voices) => {
        setBrandVoices(voices);
        if (voices.length > 0) {
          const first = voices[0];
          setSelectedVoice(first);
          setEditName(first.name);
          setEditTone(first.toneDescriptors.join(", "));
          setEditExamples(first.examplePhrases.join("\n"));
          setEditAvoid(first.avoidPhrases.join("\n"));
          setEditAudience(first.targetAudience);
        }
      })
      .catch((e) =>
        setError(e instanceof Error ? e.message : "Failed to load brand voices")
      )
      .finally(() => setLoading(false));
  }, []);

  const toneList = editTone
    .split(",")
    .map((t) => t.trim())
    .filter(Boolean);
  const exampleList = editExamples
    .split("\n")
    .map((t) => t.trim())
    .filter(Boolean);
  const avoidList = editAvoid
    .split("\n")
    .map((t) => t.trim())
    .filter(Boolean);

  async function handleNewVoice() {
    setCreating(true);
    setError(null);
    try {
      const voice = await createBrandVoice({
        name: "Untitled Voice",
        toneDescriptors: [],
        examplePhrases: [],
        avoidPhrases: [],
        targetAudience: "",
      });
      setBrandVoices((prev) => [...prev, voice]);
      selectVoice(voice);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to create voice");
    } finally {
      setCreating(false);
    }
  }

  async function handleSave() {
    if (!selectedVoice) return;
    setSaving(true);
    setError(null);
    try {
      const updated = await updateBrandVoice(selectedVoice.id, {
        name: editName.trim() || "Untitled Voice",
        toneDescriptors: toneList,
        examplePhrases: exampleList,
        avoidPhrases: avoidList,
        targetAudience: editAudience.trim(),
      });
      setBrandVoices((prev) =>
        prev.map((v) => (v.id === updated.id ? updated : v))
      );
      setSelectedVoice(updated);
      setSavedFlash(true);
      setTimeout(() => setSavedFlash(false), 2000);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to save changes");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!selectedVoice) return;
    if (!window.confirm(`Delete "${selectedVoice.name}"? Stories using it will be detached.`)) {
      return;
    }
    setDeleting(true);
    setError(null);
    try {
      await deleteBrandVoice(selectedVoice.id);
      const remaining = brandVoices.filter((v) => v.id !== selectedVoice.id);
      setBrandVoices(remaining);
      if (remaining.length > 0) {
        selectVoice(remaining[0]);
      } else {
        setSelectedVoice(null);
        setEditName("");
        setEditTone("");
        setEditExamples("");
        setEditAvoid("");
        setEditAudience("");
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to delete voice");
    } finally {
      setDeleting(false);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Brand Voice</h1>
          <p className="text-muted-foreground">
            Define how your stories sound. Consistent voice builds trust.
          </p>
        </div>
        <Button onClick={handleNewVoice} disabled={creating || loading}>
          {creating ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Plus className="mr-2 h-4 w-4" />
          )}
          New Voice
        </Button>
      </div>

      {error && (
        <p className="rounded-md border border-destructive/30 bg-destructive/10 px-4 py-2 text-sm text-destructive">
          {error}
        </p>
      )}

      {loading ? (
        <div className="grid gap-6 lg:grid-cols-3">
          {[0, 1, 2].map((i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-5 w-32" />
                <Skeleton className="h-4 w-48" />
              </CardHeader>
              <CardContent className="space-y-3">
                <Skeleton className="h-8 w-full" />
                <Skeleton className="h-8 w-full" />
                <Skeleton className="h-20 w-full" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : brandVoices.length === 0 ? (
        <div className="py-12 text-center">
          <Palette className="mx-auto h-10 w-10 text-muted-foreground/50" />
          <p className="mt-4 text-sm text-muted-foreground">
            No brand voices yet. Create your first voice to keep every story on tone.
          </p>
          <Button className="mt-4" onClick={handleNewVoice} disabled={creating}>
            {creating ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Plus className="mr-2 h-4 w-4" />
            )}
            New Voice
          </Button>
        </div>
      ) : (
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Voice List */}
          <div className="space-y-3">
            {brandVoices.map((voice) => (
              <Card
                key={voice.id}
                className={`cursor-pointer transition-all hover:border-primary/50 ${
                  selectedVoice?.id === voice.id
                    ? "border-primary ring-2 ring-primary/20"
                    : ""
                }`}
                onClick={() => selectVoice(voice)}
              >
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">{voice.name}</CardTitle>
                  <CardDescription className="text-xs">
                    {voice.targetAudience}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-1">
                    {voice.toneDescriptors.map((tone) => (
                      <span
                        key={tone}
                        className="inline-flex items-center rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary"
                      >
                        {tone}
                      </span>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Editor */}
          <div className="space-y-4 lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Palette className="h-5 w-5" />
                  Edit Voice
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="voice-name">Voice Name</Label>
                  <Input
                    id="voice-name"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="voice-tone">Tone Tags (comma-separated)</Label>
                  <Input
                    id="voice-tone"
                    value={editTone}
                    onChange={(e) => setEditTone(e.target.value)}
                    placeholder="Warm, Confident, Direct"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="voice-audience">
                    <Users className="mr-1 inline h-3.5 w-3.5" />
                    Target Audience
                  </Label>
                  <Input
                    id="voice-audience"
                    value={editAudience}
                    onChange={(e) => setEditAudience(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="voice-examples">
                    <MessageSquare className="mr-1 inline h-3.5 w-3.5" />
                    Example Phrases (one per line)
                  </Label>
                  <Textarea
                    id="voice-examples"
                    value={editExamples}
                    onChange={(e) => setEditExamples(e.target.value)}
                    className="min-h-24"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="voice-avoid">
                    <AlertTriangle className="mr-1 inline h-3.5 w-3.5" />
                    Phrases to Avoid (one per line)
                  </Label>
                  <Textarea
                    id="voice-avoid"
                    value={editAvoid}
                    onChange={(e) => setEditAvoid(e.target.value)}
                    className="min-h-24"
                  />
                </div>

                <Button className="w-full" onClick={handleSave} disabled={saving || !selectedVoice}>
                  {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  {saving ? "Saving..." : savedFlash ? "Saved" : "Save Changes"}
                </Button>
                <Button
                  variant="outline"
                  className="w-full text-destructive hover:text-destructive"
                  onClick={handleDelete}
                  disabled={deleting || !selectedVoice}
                >
                  {deleting ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <Trash2 className="mr-2 h-4 w-4" />
                  )}
                  Delete Voice
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Preview */}
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Eye className="h-5 w-5" />
                  Voice Preview
                </CardTitle>
                <CardDescription>
                  How this voice looks when applied to a story
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm font-semibold">{editName || "Untitled Voice"}</p>
                  <p className="mt-1 text-sm text-muted-foreground">{editAudience || "No audience specified"}</p>
                </div>

                {/* Tone */}
                <div>
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-2">
                    Tone
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {toneList.length > 0 ? (
                      toneList.map((tone) => (
                        <span
                          key={tone}
                          className="inline-flex items-center rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary"
                        >
                          {tone}
                        </span>
                      ))
                    ) : (
                      <span className="text-xs text-muted-foreground italic">
                        Add tone descriptors above
                      </span>
                    )}
                  </div>
                </div>

                {/* Examples */}
                <div>
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-2">
                    Sounds like
                  </p>
                  {exampleList.length > 0 ? (
                    <ul className="space-y-1.5">
                      {exampleList.map((phrase) => (
                        <li
                          key={phrase}
                          className="rounded-md bg-emerald-50 px-3 py-1.5 text-sm text-emerald-800 dark:bg-emerald-950/30 dark:text-emerald-300"
                        >
                          &ldquo;{phrase}&rdquo;
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <span className="text-xs text-muted-foreground italic">
                      Add example phrases above
                    </span>
                  )}
                </div>

                {/* Avoid */}
                <div>
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-2">
                    Never say
                  </p>
                  {avoidList.length > 0 ? (
                    <div className="flex flex-wrap gap-1.5">
                      {avoidList.map((phrase) => (
                        <span
                          key={phrase}
                          className="inline-flex items-center gap-1 rounded-full bg-destructive/10 px-2.5 py-0.5 text-xs font-medium text-destructive"
                        >
                          <X className="h-3 w-3" />
                          {phrase}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <span className="text-xs text-muted-foreground italic">
                      Add phrases to avoid above
                    </span>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}
