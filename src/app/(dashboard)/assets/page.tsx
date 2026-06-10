"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Asset, AssetType } from "@/lib/data/stories";
import { listAssets, listStoryRefs, createAsset } from "@/lib/data/api";
import {
  Upload,
  Image,
  Film,
  Music,
  FileText,
  Link2,
  FolderOpen,
  Loader2,
} from "lucide-react";

const assetIcons: Record<AssetType, React.ElementType> = {
  image: Image,
  video: Film,
  audio: Music,
  document: FileText,
};

const assetColors: Record<AssetType, string> = {
  image: "bg-blue-100 text-blue-700 dark:bg-blue-950/40 dark:text-blue-300",
  video: "bg-purple-100 text-purple-700 dark:bg-purple-950/40 dark:text-purple-300",
  audio: "bg-amber-100 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300",
  document: "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300",
};

export default function AssetsPage() {
  const [assets, setAssets] = useState<Asset[]>([]);
  const [storyRefs, setStoryRefs] = useState<{ id: string; title: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [typeFilter, setTypeFilter] = useState<string>("all");

  const [dialogOpen, setDialogOpen] = useState(false);
  const [newFilename, setNewFilename] = useState("");
  const [newType, setNewType] = useState<AssetType>("image");
  const [newStoryId, setNewStoryId] = useState<string>("none");
  const [adding, setAdding] = useState(false);
  const [addError, setAddError] = useState<string | null>(null);

  useEffect(() => {
    Promise.all([listAssets(), listStoryRefs()])
      .then(([fetchedAssets, refs]) => {
        setAssets(fetchedAssets);
        setStoryRefs(refs);
      })
      .catch((e) =>
        setError(e instanceof Error ? e.message : "Failed to load assets")
      )
      .finally(() => setLoading(false));
  }, []);

  async function handleAdd() {
    if (!newFilename.trim()) return;
    setAdding(true);
    setAddError(null);
    try {
      const asset = await createAsset({
        filename: newFilename.trim(),
        assetType: newType,
        storyId: newStoryId !== "none" ? newStoryId : null,
      });
      setAssets((prev) => [asset, ...prev]);
      setDialogOpen(false);
      setNewFilename("");
      setNewType("image");
      setNewStoryId("none");
    } catch (e) {
      setAddError(e instanceof Error ? e.message : "Failed to add asset");
    } finally {
      setAdding(false);
    }
  }

  const filtered = assets.filter((a) => {
    if (typeFilter !== "all" && a.type !== typeFilter) return false;
    return true;
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Media Assets</h1>
          <p className="text-muted-foreground">
            Images, video, audio, and documents for your narratives.
          </p>
        </div>
        <Button onClick={() => setDialogOpen(true)}>
          <Upload className="mr-2 h-4 w-4" />
          Upload Asset
        </Button>
      </div>

      {error && (
        <p className="rounded-md border border-destructive/30 bg-destructive/10 px-4 py-2 text-sm text-destructive">
          {error}
        </p>
      )}

      {/* Upload Area */}
      <div
        className="cursor-pointer rounded-lg border-2 border-dashed border-muted-foreground/25 p-12 text-center transition-colors hover:border-muted-foreground/40"
        onClick={() => setDialogOpen(true)}
      >
        <Upload className="mx-auto h-10 w-10 text-muted-foreground/50" />
        <p className="mt-4 text-sm font-medium">
          Drag and drop files here, or click to browse
        </p>
        <p className="mt-1 text-xs text-muted-foreground">
          Supports images, video, audio, and documents up to 100MB
        </p>
      </div>

      {/* Filter */}
      <div className="flex items-center gap-3">
        <Select value={typeFilter} onValueChange={(v) => setTypeFilter(v ?? "all")}>
          <SelectTrigger>
            <SelectValue placeholder="All types" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All types</SelectItem>
            <SelectItem value="image">Images</SelectItem>
            <SelectItem value="video">Video</SelectItem>
            <SelectItem value="audio">Audio</SelectItem>
            <SelectItem value="document">Documents</SelectItem>
          </SelectContent>
        </Select>
        {typeFilter !== "all" && (
          <Button variant="ghost" size="sm" onClick={() => setTypeFilter("all")}>
            Clear filter
          </Button>
        )}
        <span className="text-sm text-muted-foreground">
          {filtered.length} asset{filtered.length !== 1 ? "s" : ""}
        </span>
      </div>

      {loading && (
        <div className="py-12 text-center">
          <Loader2 className="mx-auto h-6 w-6 animate-spin text-muted-foreground/50" />
          <p className="mt-2 text-sm text-muted-foreground">Loading assets...</p>
        </div>
      )}

      {/* Asset Grid */}
      <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {!loading &&
          filtered.map((asset) => {
            const Icon = assetIcons[asset.type];
            return (
              <Card key={asset.id} className="overflow-hidden">
                {/* Thumbnail placeholder */}
                <div
                  className={`flex h-32 items-center justify-center ${assetColors[asset.type]}`}
                >
                  <Icon className="h-10 w-10 opacity-60" />
                </div>
                <CardContent className="p-3 space-y-2">
                  <p
                    className="text-sm font-medium truncate"
                    title={asset.filename}
                  >
                    {asset.filename}
                  </p>
                  <div className="flex items-center justify-between">
                    <Badge variant="secondary" className="text-xs">
                      {asset.type}
                    </Badge>
                    <span className="text-xs text-muted-foreground">
                      {asset.size}
                    </span>
                  </div>
                  {asset.linkedStoryTitle ? (
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Link2 className="h-3 w-3" />
                      <span className="truncate">{asset.linkedStoryTitle}</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <FolderOpen className="h-3 w-3" />
                      <span>Unlinked</span>
                    </div>
                  )}
                  <p className="text-xs text-muted-foreground">
                    {new Date(asset.uploadDate).toLocaleDateString("en-IE", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </p>
                </CardContent>
              </Card>
            );
          })}
      </div>

      {!loading && filtered.length === 0 && (
        <div className="py-12 text-center">
          <FolderOpen className="mx-auto h-10 w-10 text-muted-foreground/50" />
          <p className="mt-4 text-sm text-muted-foreground">
            {assets.length === 0
              ? "No assets yet. Upload your first asset to get started."
              : "No assets match your filter."}
          </p>
        </div>
      )}

      {/* Upload Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Upload Asset</DialogTitle>
            <DialogDescription>
              Register a media asset and optionally link it to a story.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            {addError && (
              <p className="rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2 text-xs text-destructive">
                {addError}
              </p>
            )}
            <div className="space-y-2">
              <Label htmlFor="asset-filename">Filename</Label>
              <Input
                id="asset-filename"
                placeholder="e.g. launch-hero-shot.jpg"
                value={newFilename}
                onChange={(e) => setNewFilename(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="asset-type">Type</Label>
              <Select
                value={newType}
                onValueChange={(v) => setNewType((v as AssetType) ?? "image")}
              >
                <SelectTrigger id="asset-type" className="w-full">
                  <SelectValue placeholder="Asset type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="image">Image</SelectItem>
                  <SelectItem value="video">Video</SelectItem>
                  <SelectItem value="audio">Audio</SelectItem>
                  <SelectItem value="document">Document</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="asset-story">Linked Story</Label>
              <Select
                value={newStoryId}
                onValueChange={(v) => setNewStoryId(v ?? "none")}
              >
                <SelectTrigger id="asset-story" className="w-full">
                  <SelectValue placeholder="Link to a story (optional)" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">Unlinked</SelectItem>
                  {storyRefs.map((story) => (
                    <SelectItem key={story.id} value={story.id}>
                      {story.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Button
              className="w-full"
              onClick={handleAdd}
              disabled={adding || !newFilename.trim()}
            >
              {adding ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Upload className="mr-2 h-4 w-4" />
              )}
              {adding ? "Adding..." : "Add Asset"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
