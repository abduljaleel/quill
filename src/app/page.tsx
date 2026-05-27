import Link from "next/link";
import { appConfig } from "@/lib/config";

const ACCENT = "#f0a050";

const morphs = [
  {
    intent: "I need to debug a memory leak in the worker pool.",
    task: "Debugging a memory leak",
    tools: [
      { name: "heap viewer", icon: "heap" },
      { name: "allocation graph", icon: "graph" },
      { name: "GC trace", icon: "trace" },
    ],
    panels: [
      { label: "Heap", value: "1.8 GB", trend: "+312 MB" },
      { label: "Retained", value: "worker.queue#7" },
      { label: "Last GC", value: "382ms" },
    ],
  },
  {
    intent: "Building the new pricing table component.",
    task: "Writing a React component",
    tools: [
      { name: "prop inspector", icon: "props" },
      { name: "style preview", icon: "style" },
      { name: "component tree", icon: "tree" },
    ],
    panels: [
      { label: "Props", value: "tier, price, cta" },
      { label: "Variants", value: "5" },
      { label: "Storybook", value: "synced" },
    ],
  },
  {
    intent: "Moving billing schema to Postgres 16.",
    task: "Migrating a database",
    tools: [
      { name: "schema diff", icon: "diff" },
      { name: "rollback", icon: "rollback" },
      { name: "migration runner", icon: "runner" },
    ],
    panels: [
      { label: "Changes", value: "3 tables, 1 index" },
      { label: "Reversible", value: "yes" },
      { label: "Dry-run", value: "green" },
    ],
  },
];

const loop = [
  { step: "USER TYPES", detail: "intent expressed in natural language" },
  { step: "CONTEXT COMPRESSED", detail: "repo, history, files, errors" },
  { step: "COMPONENTS SYNTHESIZED", detail: "panels, tools, shortcuts" },
  { step: "UI RENDERED", detail: "in under 400ms" },
];

function ToolIcon({ kind }: { kind: string }) {
  // Lightweight inline svgs so we don't add deps.
  const common = "h-3.5 w-3.5";
  switch (kind) {
    case "heap":
      return (
        <svg viewBox="0 0 16 16" className={common} fill="none" stroke="currentColor" strokeWidth={1.4}>
          <rect x="2" y="9" width="3" height="5" />
          <rect x="6.5" y="6" width="3" height="8" />
          <rect x="11" y="3" width="3" height="11" />
        </svg>
      );
    case "graph":
      return (
        <svg viewBox="0 0 16 16" className={common} fill="none" stroke="currentColor" strokeWidth={1.4}>
          <path d="M2 12 L6 7 L9 9 L14 3" />
          <circle cx="2" cy="12" r="1" />
          <circle cx="14" cy="3" r="1" />
        </svg>
      );
    case "trace":
      return (
        <svg viewBox="0 0 16 16" className={common} fill="none" stroke="currentColor" strokeWidth={1.4}>
          <path d="M2 8 L4 8 L5 4 L7 12 L9 6 L11 9 L14 8" />
        </svg>
      );
    case "props":
      return (
        <svg viewBox="0 0 16 16" className={common} fill="none" stroke="currentColor" strokeWidth={1.4}>
          <rect x="2" y="3" width="12" height="2.5" />
          <rect x="2" y="6.5" width="9" height="2.5" />
          <rect x="2" y="10" width="11" height="2.5" />
        </svg>
      );
    case "style":
      return (
        <svg viewBox="0 0 16 16" className={common} fill="none" stroke="currentColor" strokeWidth={1.4}>
          <circle cx="5" cy="5" r="3" />
          <rect x="8" y="8" width="6" height="6" />
        </svg>
      );
    case "tree":
      return (
        <svg viewBox="0 0 16 16" className={common} fill="none" stroke="currentColor" strokeWidth={1.4}>
          <circle cx="8" cy="3" r="1.2" />
          <circle cx="4" cy="13" r="1.2" />
          <circle cx="12" cy="13" r="1.2" />
          <path d="M8 4 L4 12 M8 4 L12 12" />
        </svg>
      );
    case "diff":
      return (
        <svg viewBox="0 0 16 16" className={common} fill="none" stroke="currentColor" strokeWidth={1.4}>
          <path d="M3 3 H8 V13 H3 Z M8 6 H13 V13 H8 Z" />
        </svg>
      );
    case "rollback":
      return (
        <svg viewBox="0 0 16 16" className={common} fill="none" stroke="currentColor" strokeWidth={1.4}>
          <path d="M3 8 A5 5 0 1 1 8 13" />
          <path d="M3 8 L5 6 M3 8 L5 10" />
        </svg>
      );
    case "runner":
      return (
        <svg viewBox="0 0 16 16" className={common} fill="currentColor">
          <path d="M3 3 L13 8 L3 13 Z" />
        </svg>
      );
    default:
      return null;
  }
}

function QuillIcon({ size = 28 }: { size?: number }) {
  // Quill pen — handwritten feel.
  return (
    <svg viewBox="0 0 64 64" width={size} height={size} fill="none" stroke="currentColor" strokeWidth={1.2} strokeLinecap="round" strokeLinejoin="round">
      <path d="M48 8 C 38 18, 24 30, 14 46 L 18 52 C 34 42, 46 28, 56 16 Z" fill="currentColor" fillOpacity="0.08" />
      <path d="M48 8 C 38 18, 24 30, 14 46" />
      <path d="M56 16 C 46 28, 34 42, 18 52" />
      <path d="M18 52 L 14 56" />
      <path d="M28 30 L 36 38" opacity="0.5" />
      <path d="M22 38 L 30 46" opacity="0.4" />
    </svg>
  );
}

function MorphMockup({
  morph,
  active,
}: {
  morph: (typeof morphs)[number];
  active: boolean;
}) {
  return (
    <div
      className="relative rounded-md border bg-[#0d0d0d] overflow-hidden transition-all"
      style={{
        borderColor: active ? `${ACCENT}66` : "rgba(255,255,255,0.06)",
        boxShadow: active ? `0 0 0 1px ${ACCENT}22, 0 12px 40px -10px ${ACCENT}30` : undefined,
      }}
    >
      {/* Window chrome */}
      <div className="flex items-center justify-between border-b border-white/5 px-3 py-2">
        <div className="flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full bg-white/15" />
          <span className="h-2 w-2 rounded-full bg-white/15" />
          <span className="h-2 w-2 rounded-full bg-white/15" />
        </div>
        <span className="font-mono text-[10px] tracking-wider text-white/30 uppercase">
          quill — {morph.task}
        </span>
        <span className="h-2 w-8" />
      </div>

      {/* Morphing toolbar */}
      <div className="flex items-center gap-1 border-b border-white/5 px-3 py-2 bg-black/40">
        {morph.tools.map((t) => (
          <div
            key={t.name}
            className="flex items-center gap-1.5 rounded-sm border px-2 py-1"
            style={{ borderColor: `${ACCENT}33`, color: ACCENT }}
          >
            <ToolIcon kind={t.icon} />
            <span className="font-mono text-[10px] tracking-wide">{t.name}</span>
          </div>
        ))}
        <div className="ml-auto font-mono text-[10px] text-white/20">synthesized</div>
      </div>

      {/* Body — left rail of panels, right "code" placeholder */}
      <div className="grid grid-cols-3 gap-px bg-white/5 min-h-[180px]">
        <div className="col-span-1 bg-[#0d0d0d] p-3 flex flex-col gap-2">
          {morph.panels.map((p) => (
            <div key={p.label} className="border border-white/5 rounded-sm p-2">
              <div className="font-mono text-[9px] uppercase tracking-wider text-white/30">
                {p.label}
              </div>
              <div className="font-mono text-xs text-white/80 mt-0.5 truncate">
                {p.value}
              </div>
              {"trend" in p && p.trend ? (
                <div className="font-mono text-[10px] mt-0.5" style={{ color: ACCENT }}>
                  {p.trend}
                </div>
              ) : null}
            </div>
          ))}
        </div>
        <div className="col-span-2 bg-[#080808] p-3">
          <div className="space-y-1.5">
            {[68, 84, 52, 76, 90, 60, 48].map((w, i) => (
              <div
                key={i}
                className="h-1.5 rounded-full"
                style={{
                  width: `${w}%`,
                  background:
                    i === 2 || i === 5 ? `${ACCENT}55` : "rgba(255,255,255,0.06)",
                }}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Intent caption */}
      <div className="border-t border-white/5 bg-black/60 px-3 py-2 flex items-center gap-2">
        <span className="font-mono text-[10px] tracking-wider uppercase text-white/30">
          intent
        </span>
        <span className="font-mono text-[11px] text-white/70 italic">
          &ldquo;{morph.intent}&rdquo;
        </span>
      </div>
    </div>
  );
}

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white selection:bg-[#f0a050]/30">
      {/* Nav */}
      <header className="border-b border-white/5">
        <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-6">
          <div className="flex items-center gap-3" style={{ color: ACCENT }}>
            <QuillIcon size={22} />
            <div className="flex flex-col leading-tight">
              <span
                className="font-serif text-base"
                style={{ fontFamily: "ui-serif, Georgia, serif" }}
              >
                {appConfig.name}
              </span>
              <span className="font-mono text-[9px] uppercase tracking-[0.25em] text-white/35">
                quill.ie &middot; Dublin
              </span>
            </div>
          </div>
          <div className="flex items-center gap-6">
            <span className="hidden sm:inline font-mono text-[10px] uppercase tracking-[0.25em] text-white/35">
              Optimization layer
            </span>
            <Link
              href="/login"
              className="text-sm text-white/50 hover:text-white transition-colors"
            >
              Sign in
            </Link>
            <Link
              href="/signup"
              className="text-sm border rounded px-3 py-1.5 transition-colors hover:bg-white/5"
              style={{ color: ACCENT, borderColor: `${ACCENT}55` }}
            >
              Get started
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="mx-auto max-w-6xl px-6 pt-24 pb-16 sm:pt-32">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-7">
            <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-white/40">
              From Dublin &mdash; city of Yeats, Joyce, and Beckett,
              <br className="hidden sm:block" /> where the page rewrites itself.
            </p>
            <h1
              className="mt-8 text-[5rem] sm:text-[7rem] lg:text-[8.5rem] leading-[0.95] tracking-tight"
              style={{ fontFamily: "ui-serif, Georgia, 'Times New Roman', serif" }}
            >
              Quill
            </h1>
            <p
              className="mt-6 text-xl sm:text-2xl text-white/70 max-w-xl"
              style={{ fontFamily: "ui-serif, Georgia, serif" }}
            >
              Development environment that builds itself for your current task.
            </p>
            <p className="mt-6 max-w-xl text-base text-white/45 leading-relaxed">
              <span className="font-mono text-xs uppercase tracking-wider" style={{ color: ACCENT }}>
                The problem &mdash;
              </span>{" "}
              your IDE shows the same toolbar regardless of task. Quill listens
              to intent, compresses context, and renders the panels you
              actually need.
            </p>
            <div className="mt-10 flex items-center gap-4">
              <Link
                href="/signup"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded text-sm font-medium transition-colors"
                style={{ backgroundColor: ACCENT, color: "#0a0a0a" }}
              >
                Try Quill
                <span aria-hidden>&rarr;</span>
              </Link>
              <Link
                href="/login"
                className="text-sm text-white/50 hover:text-white transition-colors"
              >
                or sign in
              </Link>
            </div>
          </div>

          {/* Large quill illustration */}
          <div className="lg:col-span-5 flex justify-center">
            <div style={{ color: ACCENT }} className="opacity-90">
              <svg
                viewBox="0 0 240 320"
                className="w-56 sm:w-72"
                fill="none"
                stroke="currentColor"
                strokeWidth={1}
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                {/* Feather body */}
                <path
                  d="M180 30 C 150 60, 110 100, 80 150 C 55 190, 40 230, 30 270 L 50 290 C 95 270, 140 235, 175 195 C 205 160, 220 110, 215 60 Z"
                  fill="currentColor"
                  fillOpacity="0.08"
                />
                <path d="M180 30 C 150 60, 110 100, 80 150 C 55 190, 40 230, 30 270" />
                <path d="M215 60 C 220 110, 205 160, 175 195 C 140 235, 95 270, 50 290" />
                {/* Spine */}
                <path d="M180 30 L 50 290" strokeWidth={1.3} />
                {/* Barbs — left side */}
                {[0, 1, 2, 3, 4, 5, 6, 7, 8].map((i) => {
                  const t = i / 8;
                  const x1 = 180 - t * 130;
                  const y1 = 30 + t * 260;
                  return (
                    <path
                      key={`l${i}`}
                      d={`M ${x1} ${y1} Q ${x1 - 20 - i * 3} ${y1 + 10}, ${x1 - 35 - i * 4} ${y1 + 28}`}
                      opacity={0.5}
                    />
                  );
                })}
                {/* Barbs — right side */}
                {[0, 1, 2, 3, 4, 5, 6, 7, 8].map((i) => {
                  const t = i / 8;
                  const x1 = 180 - t * 130;
                  const y1 = 30 + t * 260;
                  return (
                    <path
                      key={`r${i}`}
                      d={`M ${x1} ${y1} Q ${x1 + 20 + i * 2} ${y1 - 5}, ${x1 + 38 + i * 2.5} ${y1 - 20}`}
                      opacity={0.4}
                    />
                  );
                })}
                {/* Tip + ink drop */}
                <path d="M 50 290 L 38 304" strokeWidth={1.4} />
                <circle cx="34" cy="310" r="3" fill="currentColor" />
              </svg>
            </div>
          </div>
        </div>
      </section>

      {/* The morphing IDE — three views */}
      <section className="mx-auto max-w-6xl px-6 py-20 border-t border-white/5">
        <div className="flex items-end justify-between mb-10">
          <div>
            <p
              className="font-mono text-[11px] uppercase tracking-[0.3em]"
              style={{ color: ACCENT }}
            >
              The morphing IDE
            </p>
            <h2
              className="mt-3 text-3xl sm:text-4xl tracking-tight"
              style={{ fontFamily: "ui-serif, Georgia, serif" }}
            >
              One environment. A different shape for every task.
            </h2>
          </div>
          <span className="hidden sm:block font-mono text-[10px] uppercase tracking-wider text-white/30">
            three intents, three editors
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {morphs.map((m, i) => (
            <MorphMockup key={m.task} morph={m} active={i === 1} />
          ))}
        </div>

        <div className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
          {morphs.map((m) => (
            <div key={`${m.task}-caption`} className="px-1">
              <p className="font-mono text-[10px] uppercase tracking-wider text-white/30">
                Task
              </p>
              <p className="mt-1 text-sm text-white/70">{m.task}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Intent inference loop */}
      <section className="mx-auto max-w-6xl px-6 py-20 border-t border-white/5">
        <p
          className="font-mono text-[11px] uppercase tracking-[0.3em]"
          style={{ color: ACCENT }}
        >
          Intent inference loop
        </p>
        <h2
          className="mt-3 text-3xl sm:text-4xl tracking-tight"
          style={{ fontFamily: "ui-serif, Georgia, serif" }}
        >
          From a sentence to a usable editor in one breath.
        </h2>

        <div className="mt-12 grid grid-cols-1 md:grid-cols-4 gap-px bg-white/5 rounded-lg overflow-hidden">
          {loop.map((s, i) => (
            <div
              key={s.step}
              className="bg-[#0d0d0d] p-6 flex flex-col gap-3 relative"
            >
              <div className="flex items-center justify-between">
                <span
                  className="font-mono text-[10px] tracking-wider"
                  style={{ color: ACCENT }}
                >
                  0{i + 1}
                </span>
                {i < loop.length - 1 ? (
                  <span
                    className="hidden md:inline font-mono text-xs"
                    style={{ color: `${ACCENT}88` }}
                    aria-hidden
                  >
                    &rarr;
                  </span>
                ) : null}
              </div>
              <p className="font-mono text-sm tracking-wider text-white/90">
                {s.step}
              </p>
              <p className="text-xs text-white/45 leading-relaxed">
                {s.detail}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Stats */}
      <section className="border-t border-white/5">
        <div className="mx-auto max-w-6xl px-6 py-20">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-px bg-white/5 rounded-lg overflow-hidden">
            {[
              { value: "0", label: "menu hunting" },
              { value: "100%", label: "task-relevant UI" },
              { value: "instant", label: "time-to-action" },
            ].map((s) => (
              <div
                key={s.label}
                className="bg-[#0d0d0d] p-10 text-center"
              >
                <div
                  className="text-5xl sm:text-6xl tracking-tight"
                  style={{ fontFamily: "ui-serif, Georgia, serif", color: ACCENT }}
                >
                  {s.value}
                </div>
                <div className="mt-3 font-mono text-[10px] uppercase tracking-[0.25em] text-white/40">
                  {s.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-white/5">
        <div className="mx-auto max-w-3xl px-6 py-24 text-center">
          <h2
            className="text-3xl sm:text-4xl tracking-tight"
            style={{ fontFamily: "ui-serif, Georgia, serif" }}
          >
            Stop hunting through menus. Start writing.
          </h2>
          <p className="mt-4 text-white/50">
            Quill watches what you&rsquo;re doing and shapes itself around it.
          </p>
          <div className="mt-8">
            <Link
              href="/signup"
              className="inline-flex items-center gap-2 px-6 py-3 rounded text-sm font-medium transition-colors"
              style={{ backgroundColor: ACCENT, color: "#0a0a0a" }}
            >
              Open Quill
              <span aria-hidden>&rarr;</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/5">
        <div className="mx-auto flex max-w-6xl flex-col gap-4 sm:flex-row items-center justify-between px-6 py-8">
          <div className="flex items-center gap-3" style={{ color: ACCENT }}>
            <QuillIcon size={18} />
            <span
              className="font-mono text-[10px] uppercase tracking-[0.3em] text-white/60"
            >
              {appConfig.name} &middot; Dublin &middot; quill.ie
            </span>
          </div>
          <a
            href="https://abduljaleel.xyz/aletheia/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 border rounded px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.25em] transition-colors hover:bg-white/5"
            style={{ borderColor: `${ACCENT}55`, color: ACCENT }}
          >
            Part of the Aletheia stack
            <span aria-hidden>&#8599;</span>
          </a>
        </div>
        <div className="mx-auto max-w-6xl px-6 pb-6 text-center font-mono text-[10px] uppercase tracking-[0.3em] text-white/20">
          Optimization layer &middot; from Dublin, the page rewrites itself
        </div>
      </footer>
    </div>
  );
}
