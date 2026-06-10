import { createClient } from "@/lib/supabase/client";
import {
  storyTemplates as seedTemplates,
  brandVoices as seedBrandVoices,
  stories as seedStories,
  assets as seedAssets,
} from "./stories";
import type {
  Asset,
  AssetType,
  BrandVoice,
  SectionStatus,
  Story,
  StorySection,
  StoryStatus,
  StoryTemplate,
  StoryType,
} from "./stories";

type Supabase = ReturnType<typeof createClient>;

export interface Ctx {
  supabase: Supabase;
  userId: string;
  orgId: string;
}

export async function getCtx(): Promise<Ctx> {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");
  const { data: profile, error } = await supabase
    .from("profiles")
    .select("org_id")
    .eq("id", user.id)
    .single();
  if (error) throw new Error(error.message);
  if (!profile?.org_id) throw new Error("No organization found for user");
  return { supabase, userId: user.id, orgId: profile.org_id as string };
}

export async function getCurrentUser(): Promise<{
  email: string;
  fullName: string | null;
}> {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return {
    email: user?.email ?? "",
    fullName: (user?.user_metadata?.full_name as string | undefined) ?? null,
  };
}

// ---------- DB row shapes (live schema) ----------

interface TemplateSectionDef {
  name: string;
  placeholder: string;
  guidance: string;
  wordCountTarget: number;
}

interface TemplateRow {
  id: string;
  name: string;
  story_type: string | null;
  sections: TemplateSectionDef[] | null;
  guidance: { description?: string } | null;
  example_content: string | null;
  is_public: boolean | null;
  created_at: string | null;
}

interface VoiceRow {
  id: string;
  org_id: string | null;
  name: string;
  tone_descriptors: string[] | null;
  example_phrases: string[] | null;
  avoid_phrases: string[] | null;
  target_audience: string | null;
  created_at: string | null;
}

interface SectionRow {
  id: string;
  story_id: string | null;
  section_type: string | null;
  content: string | null;
  order_index: number | null;
  guidance_notes: string | null;
  status: string | null;
  created_at: string | null;
}

interface StoryRow {
  id: string;
  org_id: string | null;
  title: string;
  story_type: string | null;
  status: string | null;
  template_id: string | null;
  owner_id: string | null;
  brand_voice_id: string | null;
  created_at: string | null;
  story_sections?: SectionRow[];
  brand_voice?: { target_audience: string | null } | null;
  template?: { sections: TemplateSectionDef[] | null } | null;
}

interface AssetRow {
  id: string;
  org_id: string | null;
  story_id: string | null;
  asset_type: string | null;
  storage_path: string | null;
  filename: string | null;
  metadata: { size?: string } | null;
  uploaded_by: string | null;
  created_at: string | null;
  story?: { title: string | null } | null;
}

const STORY_SELECT =
  "*, story_sections(*), brand_voice:brand_voices(target_audience), template:story_templates(sections)";

// ---------- Mappers (DB snake_case -> UI camelCase) ----------

const STORY_TYPES: StoryType[] = [
  "origin",
  "launch",
  "pitch",
  "case_study",
  "brand_manifesto",
  "explainer",
];

function asStoryType(value: string | null): StoryType {
  return STORY_TYPES.includes(value as StoryType)
    ? (value as StoryType)
    : "explainer";
}

function asStoryStatus(value: string | null): StoryStatus {
  return value === "review" || value === "published" ? value : "draft";
}

function asSectionStatus(value: string | null): SectionStatus {
  return value === "approved" ? "approved" : "draft";
}

function asAssetType(value: string | null): AssetType {
  return value === "image" || value === "video" || value === "audio"
    ? value
    : "document";
}

function mapTemplate(row: TemplateRow): StoryTemplate {
  return {
    id: row.id,
    name: row.name,
    type: asStoryType(row.story_type),
    description: row.guidance?.description ?? "",
    sections: Array.isArray(row.sections) ? row.sections : [],
    examplePreview: row.example_content ?? "",
  };
}

function mapVoice(row: VoiceRow): BrandVoice {
  return {
    id: row.id,
    name: row.name,
    toneDescriptors: Array.isArray(row.tone_descriptors)
      ? row.tone_descriptors
      : [],
    examplePhrases: Array.isArray(row.example_phrases)
      ? row.example_phrases
      : [],
    avoidPhrases: Array.isArray(row.avoid_phrases) ? row.avoid_phrases : [],
    targetAudience: row.target_audience ?? "",
    createdAt: row.created_at ?? new Date().toISOString(),
  };
}

function mapSection(
  row: SectionRow,
  templateDef: TemplateSectionDef | undefined
): StorySection {
  return {
    id: row.id,
    name: row.section_type ?? templateDef?.name ?? "Section",
    content: row.content ?? "",
    placeholder: templateDef?.placeholder ?? "Write this section...",
    guidance: row.guidance_notes ?? templateDef?.guidance ?? "",
    wordCountTarget: templateDef?.wordCountTarget ?? 200,
    status: asSectionStatus(row.status),
  };
}

function mapStory(row: StoryRow): Story {
  const templateSections = Array.isArray(row.template?.sections)
    ? row.template.sections
    : [];
  const sections = [...(row.story_sections ?? [])]
    .sort((a, b) => (a.order_index ?? 0) - (b.order_index ?? 0))
    .map((s, i) => mapSection(s, templateSections[i]));
  const createdAt = row.created_at ?? new Date().toISOString();
  return {
    id: row.id,
    title: row.title,
    type: asStoryType(row.story_type),
    status: asStoryStatus(row.status),
    sections,
    brandVoiceId: row.brand_voice_id ?? "",
    targetAudience: row.brand_voice?.target_audience ?? "",
    createdAt,
    updatedAt: createdAt,
  };
}

function mapAsset(row: AssetRow): Asset {
  return {
    id: row.id,
    filename: row.filename ?? row.storage_path ?? "untitled",
    type: asAssetType(row.asset_type),
    uploadDate: row.created_at ?? new Date().toISOString(),
    linkedStoryId: row.story_id,
    linkedStoryTitle: row.story?.title ?? null,
    size: row.metadata?.size ?? "—",
  };
}

// ---------- Story templates (global catalog, self-seeding) ----------

async function fetchTemplateRows(supabase: Supabase): Promise<TemplateRow[]> {
  const { data, error } = await supabase
    .from("story_templates")
    .select("*")
    .order("created_at", { ascending: true });
  if (error) throw new Error(error.message);
  return (data ?? []) as TemplateRow[];
}

async function ensureTemplateRows(supabase: Supabase): Promise<TemplateRow[]> {
  const existing = await fetchTemplateRows(supabase);
  if (existing.length > 0) return existing;
  const { error } = await supabase.from("story_templates").insert(
    seedTemplates.map((t) => ({
      name: t.name,
      story_type: t.type,
      sections: t.sections,
      guidance: { description: t.description },
      example_content: t.examplePreview,
      is_public: true,
    }))
  );
  if (error) throw new Error(error.message);
  return fetchTemplateRows(supabase);
}

export async function listTemplates(): Promise<StoryTemplate[]> {
  const { supabase } = await getCtx();
  const rows = await ensureTemplateRows(supabase);
  return rows.map(mapTemplate);
}

// ---------- Brand voices (org-scoped) ----------

export async function listBrandVoices(): Promise<BrandVoice[]> {
  const { supabase, orgId } = await getCtx();
  const { data, error } = await supabase
    .from("brand_voices")
    .select("*")
    .eq("org_id", orgId)
    .order("created_at", { ascending: true });
  if (error) throw new Error(error.message);
  return ((data ?? []) as VoiceRow[]).map(mapVoice);
}

export interface BrandVoiceInput {
  name: string;
  toneDescriptors: string[];
  examplePhrases: string[];
  avoidPhrases: string[];
  targetAudience: string;
}

export async function createBrandVoice(
  input: BrandVoiceInput
): Promise<BrandVoice> {
  const { supabase, orgId } = await getCtx();
  const { data, error } = await supabase
    .from("brand_voices")
    .insert({
      org_id: orgId,
      name: input.name,
      tone_descriptors: input.toneDescriptors,
      example_phrases: input.examplePhrases,
      avoid_phrases: input.avoidPhrases,
      target_audience: input.targetAudience,
    })
    .select("*")
    .single();
  if (error) throw new Error(error.message);
  return mapVoice(data as VoiceRow);
}

export async function updateBrandVoice(
  id: string,
  input: BrandVoiceInput
): Promise<BrandVoice> {
  const { supabase } = await getCtx();
  const { data, error } = await supabase
    .from("brand_voices")
    .update({
      name: input.name,
      tone_descriptors: input.toneDescriptors,
      example_phrases: input.examplePhrases,
      avoid_phrases: input.avoidPhrases,
      target_audience: input.targetAudience,
    })
    .eq("id", id)
    .select("*")
    .single();
  if (error) throw new Error(error.message);
  return mapVoice(data as VoiceRow);
}

export async function deleteBrandVoice(id: string): Promise<void> {
  const { supabase, orgId } = await getCtx();
  // Detach any stories referencing this voice first (FK is not cascading).
  const { error: detachError } = await supabase
    .from("stories")
    .update({ brand_voice_id: null })
    .eq("org_id", orgId)
    .eq("brand_voice_id", id);
  if (detachError) throw new Error(detachError.message);
  const { error } = await supabase.from("brand_voices").delete().eq("id", id);
  if (error) throw new Error(error.message);
}

// ---------- Stories + sections ----------

export async function listStories(): Promise<Story[]> {
  const { supabase, orgId } = await getCtx();
  const { data, error } = await supabase
    .from("stories")
    .select(STORY_SELECT)
    .eq("org_id", orgId)
    .order("created_at", { ascending: false });
  if (error) throw new Error(error.message);
  return ((data ?? []) as unknown as StoryRow[]).map(mapStory);
}

export async function getStory(id: string): Promise<Story | null> {
  const { supabase, orgId } = await getCtx();
  const { data, error } = await supabase
    .from("stories")
    .select(STORY_SELECT)
    .eq("org_id", orgId)
    .eq("id", id)
    .maybeSingle();
  if (error) throw new Error(error.message);
  return data ? mapStory(data as unknown as StoryRow) : null;
}

export interface CreateStoryInput {
  title: string;
  templateId: string;
  brandVoiceId: string | null;
}

export async function createStory(input: CreateStoryInput): Promise<string> {
  const { supabase, orgId, userId } = await getCtx();
  const { data: template, error: templateError } = await supabase
    .from("story_templates")
    .select("*")
    .eq("id", input.templateId)
    .single();
  if (templateError) throw new Error(templateError.message);
  const templateRow = template as TemplateRow;

  const { data: story, error: storyError } = await supabase
    .from("stories")
    .insert({
      org_id: orgId,
      title: input.title,
      story_type: templateRow.story_type,
      status: "draft",
      template_id: templateRow.id,
      owner_id: userId,
      brand_voice_id: input.brandVoiceId,
    })
    .select("id")
    .single();
  if (storyError) throw new Error(storyError.message);
  const storyId = (story as { id: string }).id;

  const sectionDefs = Array.isArray(templateRow.sections)
    ? templateRow.sections
    : [];
  if (sectionDefs.length > 0) {
    const { error: sectionsError } = await supabase
      .from("story_sections")
      .insert(
        sectionDefs.map((def, i) => ({
          story_id: storyId,
          section_type: def.name,
          content: "",
          order_index: i,
          guidance_notes: def.guidance,
          status: "draft",
        }))
      );
    if (sectionsError) throw new Error(sectionsError.message);
  }
  return storyId;
}

export async function updateStoryStatus(
  id: string,
  status: StoryStatus
): Promise<void> {
  const { supabase } = await getCtx();
  const { error } = await supabase
    .from("stories")
    .update({ status })
    .eq("id", id);
  if (error) throw new Error(error.message);
}

export async function updateSectionContent(
  sectionId: string,
  content: string
): Promise<void> {
  const { supabase } = await getCtx();
  const { error } = await supabase
    .from("story_sections")
    .update({ content })
    .eq("id", sectionId);
  if (error) throw new Error(error.message);
}

// ---------- Media assets (org-scoped, metadata records only) ----------

export async function listAssets(): Promise<Asset[]> {
  const { supabase, orgId } = await getCtx();
  const { data, error } = await supabase
    .from("media_assets")
    .select("*, story:stories(title)")
    .eq("org_id", orgId)
    .order("created_at", { ascending: false });
  if (error) throw new Error(error.message);
  return ((data ?? []) as unknown as AssetRow[]).map(mapAsset);
}

export async function listStoryRefs(): Promise<
  { id: string; title: string }[]
> {
  const { supabase, orgId } = await getCtx();
  const { data, error } = await supabase
    .from("stories")
    .select("id, title")
    .eq("org_id", orgId)
    .order("created_at", { ascending: false });
  if (error) throw new Error(error.message);
  return (data ?? []) as { id: string; title: string }[];
}

export interface CreateAssetInput {
  filename: string;
  assetType: AssetType;
  storyId: string | null;
}

export async function createAsset(input: CreateAssetInput): Promise<Asset> {
  const { supabase, orgId, userId } = await getCtx();
  const { data, error } = await supabase
    .from("media_assets")
    .insert({
      org_id: orgId,
      story_id: input.storyId,
      asset_type: input.assetType,
      storage_path: input.filename,
      filename: input.filename,
      metadata: {},
      uploaded_by: userId,
    })
    .select("*, story:stories(title)")
    .single();
  if (error) throw new Error(error.message);
  return mapAsset(data as unknown as AssetRow);
}

export async function deleteAsset(id: string): Promise<void> {
  const { supabase } = await getCtx();
  const { error } = await supabase.from("media_assets").delete().eq("id", id);
  if (error) throw new Error(error.message);
}

// ---------- Demo seeding ----------

function daysAgo(days: number): string {
  return new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString();
}

const STORY_DAY_OFFSETS: Record<string, number> = {
  "story-1": 54,
  "story-2": 30,
  "story-3": 12,
  "story-4": 4,
};

const ASSET_DAY_OFFSETS: Record<string, number> = {
  "asset-1": 52,
  "asset-2": 28,
  "asset-3": 50,
  "asset-4": 11,
  "asset-5": 20,
  "asset-6": 47,
  "asset-7": 9,
  "asset-8": 16,
};

export async function seedDemoData(): Promise<void> {
  const { supabase, orgId, userId } = await getCtx();

  // 1. Global template catalog (parents for stories.template_id).
  const templateRows = await ensureTemplateRows(supabase);
  const templateByType = new Map<string, TemplateRow>();
  for (const row of templateRows) {
    if (row.story_type && !templateByType.has(row.story_type)) {
      templateByType.set(row.story_type, row);
    }
  }

  // 2. Brand voices (parents for stories.brand_voice_id).
  const voiceIdMap = new Map<string, string>();
  for (const voice of seedBrandVoices) {
    const { data, error } = await supabase
      .from("brand_voices")
      .insert({
        org_id: orgId,
        name: voice.name,
        tone_descriptors: voice.toneDescriptors,
        example_phrases: voice.examplePhrases,
        avoid_phrases: voice.avoidPhrases,
        target_audience: voice.targetAudience,
      })
      .select("id")
      .single();
    if (error) throw new Error(error.message);
    voiceIdMap.set(voice.id, (data as { id: string }).id);
  }

  // 3. Stories, then their sections (children).
  const storyIdMap = new Map<string, string>();
  for (const story of seedStories) {
    const template = templateByType.get(story.type);
    const { data, error } = await supabase
      .from("stories")
      .insert({
        org_id: orgId,
        title: story.title,
        story_type: story.type,
        status: story.status,
        template_id: template?.id ?? null,
        owner_id: userId,
        brand_voice_id: voiceIdMap.get(story.brandVoiceId) ?? null,
        created_at: daysAgo(STORY_DAY_OFFSETS[story.id] ?? 7),
      })
      .select("id")
      .single();
    if (error) throw new Error(error.message);
    const storyId = (data as { id: string }).id;
    storyIdMap.set(story.id, storyId);

    const { error: sectionsError } = await supabase
      .from("story_sections")
      .insert(
        story.sections.map((section, i) => ({
          story_id: storyId,
          section_type: section.name,
          content: section.content,
          order_index: i,
          guidance_notes: section.guidance,
          status: section.status,
        }))
      );
    if (sectionsError) throw new Error(sectionsError.message);
  }

  // 4. Media assets (reference stories where linked).
  const { error: assetsError } = await supabase.from("media_assets").insert(
    seedAssets.map((asset) => ({
      org_id: orgId,
      story_id: asset.linkedStoryId
        ? storyIdMap.get(asset.linkedStoryId) ?? null
        : null,
      asset_type: asset.type,
      storage_path: asset.filename,
      filename: asset.filename,
      metadata: { size: asset.size },
      uploaded_by: userId,
      created_at: daysAgo(ASSET_DAY_OFFSETS[asset.id] ?? 10),
    }))
  );
  if (assetsError) throw new Error(assetsError.message);
}
