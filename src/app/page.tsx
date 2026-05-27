import Link from "next/link";
import { appConfig } from "@/lib/config";

const ACCENT = "#f0a050";

const morphs = [
  {
    intent: "Debugging a memory leak",
    task: "debug:memory",
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
    intent: "Writing a React component",
    task: "build:component",
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
    intent: "Migrating a database",
    task: "migrate:db",
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
  const common = "h-3 w-3";
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

export default function LandingPage() {
  return (
    <div
      className="flex min-h-screen flex-col bg-[#08090d] text-[#d4d4d8]"
      style={{ fontFamily: "ui-sans-serif, system-ui, -apple-system, 'Segoe UI', sans-serif" }}
    >
      {/* ──────────────────────────────────────────────────────────────
          NAV
      ────────────────────────────────────────────────────────────── */}
      <header className="border-b border-[#16181d]">
        <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-6">
          <div className="flex items-center gap-3">
            <div
              className="h-2 w-2 rounded-full animate-pulse"
              style={{ backgroundColor: ACCENT, boxShadow: `0 0 8px ${ACCENT}` }}
            />
            <span
              className="text-base tracking-wide text-[#fafafa]"
              style={{ fontFamily: "'Cormorant Garamond', 'Iowan Old Style', Georgia, serif", fontWeight: 600 }}
            >
              Quill
            </span>
            <span
              className="text-[10px] uppercase tracking-[0.25em] text-[#52525b] hidden sm:inline"
              style={{ fontFamily: "'JetBrains Mono', 'SF Mono', Menlo, monospace" }}
            >
              · Dublin
            </span>
          </div>
          <div className="flex items-center gap-4">
            <Link
              href="/login"
              className="text-xs text-[#71717a] hover:text-[#fafafa] transition-colors"
              style={{ fontFamily: "'JetBrains Mono', 'SF Mono', Menlo, monospace" }}
            >
              sign in
            </Link>
            <Link
              href="/signup"
              className="text-xs border px-4 py-1.5 transition-colors"
              style={{
                fontFamily: "'JetBrains Mono', 'SF Mono', Menlo, monospace",
                borderColor: `${ACCENT}66`,
                color: ACCENT,
              }}
            >
              get started
            </Link>
          </div>
        </div>
      </header>

      {/* ──────────────────────────────────────────────────────────────
          HERO
      ────────────────────────────────────────────────────────────── */}
      <section className="mx-auto flex w-full max-w-6xl flex-col items-center px-6 pt-28 pb-16 text-center">
        <div className="flex items-center gap-2 mb-10">
          <span
            className="inline-block h-2 w-2 rounded-full animate-pulse"
            style={{ backgroundColor: ACCENT, boxShadow: `0 0 10px ${ACCENT}` }}
          />
          <span
            className="text-[10px] tracking-[0.3em] uppercase"
            style={{ color: ACCENT, fontFamily: "'JetBrains Mono', 'SF Mono', Menlo, monospace" }}
          >
            Quill · Dublin · Optimization Layer
          </span>
        </div>

        <h1
          className="text-5xl sm:text-6xl lg:text-7xl tracking-tight text-white leading-[1.05] max-w-4xl"
          style={{ fontFamily: "'Cormorant Garamond', 'Iowan Old Style', Georgia, serif", fontWeight: 500 }}
        >
          Development environment that builds itself for your current task.
        </h1>

        <p className="mt-8 max-w-2xl text-base sm:text-lg text-[#d4d4d8] leading-snug">
          Quill listens to intent, compresses context, and renders the panels you actually need —
          a new editor for every task, synthesized in real time.
        </p>
        <p
          className="mt-6 text-sm text-[#71717a]"
          style={{ fontFamily: "'JetBrains Mono', 'SF Mono', Menlo, monospace" }}
        >
          From Dublin — city of Yeats, Joyce, and Beckett, where the page rewrites itself.
        </p>

        <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
          <Link
            href="/signup"
            className="inline-block border px-6 py-2.5 text-xs transition-all duration-200"
            style={{
              fontFamily: "'JetBrains Mono', 'SF Mono', Menlo, monospace",
              borderColor: ACCENT,
              color: ACCENT,
              boxShadow: `0 0 20px ${ACCENT}30`,
            }}
          >
            $ quill start →
          </Link>
          <Link
            href="/login"
            className="inline-block text-xs text-[#71717a] hover:text-[#fafafa] transition-colors px-4 py-2.5"
            style={{ fontFamily: "'JetBrains Mono', 'SF Mono', Menlo, monospace" }}
          >
            or sign in
          </Link>
        </div>

        <div
          className="mt-10 inline-block border-l-2 pl-4 py-1 text-left text-sm text-[#a1a1aa] max-w-md"
          style={{ borderColor: `${ACCENT}80` }}
        >
          &ldquo;Why does my IDE show the same toolbar for debugging a memory leak
          and writing a button?&rdquo;
        </div>
      </section>

      {/* ──────────────────────────────────────────────────────────────
          MORPHING IDE — 3 mockups
      ────────────────────────────────────────────────────────────── */}
      <section className="border-t border-[#16181d]">
        <div className="mx-auto max-w-6xl px-6 py-20">
          <div className="flex items-center justify-between mb-10">
            <div className="flex items-center gap-2">
              <span
                className="inline-block h-1.5 w-1.5 rounded-full animate-pulse"
                style={{ backgroundColor: ACCENT }}
              />
              <span
                className="text-[10px] uppercase tracking-[0.25em] text-[#71717a]"
                style={{ fontFamily: "'JetBrains Mono', 'SF Mono', Menlo, monospace" }}
              >
                /morph — three intents, three editors
              </span>
            </div>
            <span
              className="text-[10px] uppercase tracking-[0.25em] text-[#52525b]"
              style={{ fontFamily: "'JetBrains Mono', 'SF Mono', Menlo, monospace" }}
            >
              re-rendered in 380ms
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {morphs.map((m, idx) => (
              <div
                key={m.task}
                className="rounded-md border border-[#16181d] bg-[#0a0c11] overflow-hidden"
                style={
                  idx === 1
                    ? { borderColor: `${ACCENT}66`, boxShadow: `0 0 24px ${ACCENT}22` }
                    : undefined
                }
              >
                {/* Intent line at top */}
                <div className="flex items-center gap-2 border-b border-[#16181d] px-3 py-2 bg-[#0e1118]">
                  <span
                    className="text-[9px] uppercase tracking-[0.2em] text-[#52525b]"
                    style={{ fontFamily: "'JetBrains Mono', 'SF Mono', Menlo, monospace" }}
                  >
                    intent
                  </span>
                  <span
                    className="text-[11px] text-white truncate"
                    style={{ fontFamily: "'JetBrains Mono', 'SF Mono', Menlo, monospace" }}
                  >
                    &ldquo;{m.intent}&rdquo;
                  </span>
                </div>

                {/* Toolbar */}
                <div className="flex flex-wrap items-center gap-1.5 border-b border-[#16181d] px-3 py-2">
                  {m.tools.map((t) => (
                    <div
                      key={t.name}
                      className="flex items-center gap-1.5 rounded-sm border px-2 py-1"
                      style={{ borderColor: `${ACCENT}40`, color: ACCENT }}
                    >
                      <ToolIcon kind={t.icon} />
                      <span
                        className="text-[10px] tracking-wide"
                        style={{ fontFamily: "'JetBrains Mono', 'SF Mono', Menlo, monospace" }}
                      >
                        {t.name}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Sample readouts */}
                <div className="p-3 space-y-2">
                  {m.panels.map((p) => (
                    <div
                      key={p.label}
                      className="border border-[#16181d] rounded-sm p-2 bg-[#0e1118]"
                    >
                      <div
                        className="text-[9px] uppercase tracking-[0.2em] text-[#52525b]"
                        style={{ fontFamily: "'JetBrains Mono', 'SF Mono', Menlo, monospace" }}
                      >
                        {p.label}
                      </div>
                      <div
                        className="text-xs text-white mt-1 truncate"
                        style={{ fontFamily: "'JetBrains Mono', 'SF Mono', Menlo, monospace" }}
                      >
                        {p.value}
                      </div>
                      {"trend" in p && p.trend ? (
                        <div
                          className="text-[10px] mt-0.5"
                          style={{
                            color: ACCENT,
                            fontFamily: "'JetBrains Mono', 'SF Mono', Menlo, monospace",
                          }}
                        >
                          {p.trend}
                        </div>
                      ) : null}
                    </div>
                  ))}
                </div>

                {/* Task footer */}
                <div className="border-t border-[#16181d] px-3 py-2 bg-[#06070a]">
                  <span
                    className="text-[9px] uppercase tracking-[0.25em] text-[#52525b]"
                    style={{ fontFamily: "'JetBrains Mono', 'SF Mono', Menlo, monospace" }}
                  >
                    task ·{" "}
                  </span>
                  <span
                    className="text-[10px]"
                    style={{
                      color: ACCENT,
                      fontFamily: "'JetBrains Mono', 'SF Mono', Menlo, monospace",
                    }}
                  >
                    {m.task}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ──────────────────────────────────────────────────────────────
          THE LOOP — 4 horizontal steps
      ────────────────────────────────────────────────────────────── */}
      <section className="border-t border-[#16181d]">
        <div className="mx-auto max-w-6xl px-6 py-20">
          <p
            className="text-[10px] uppercase tracking-[0.3em] text-[#71717a] mb-3 text-center"
            style={{ fontFamily: "'JetBrains Mono', 'SF Mono', Menlo, monospace" }}
          >
            The loop
          </p>
          <h2
            className="text-3xl sm:text-4xl tracking-tight text-white text-center mb-12"
            style={{ fontFamily: "'Cormorant Garamond', 'Iowan Old Style', Georgia, serif", fontWeight: 500 }}
          >
            From a sentence to a usable editor in one breath.
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
            {loop.map((s, i) => (
              <div key={s.step} className="relative flex flex-col">
                <div className="border border-[#16181d] bg-[#0a0c11] p-5 flex-1">
                  <div className="flex items-center justify-between mb-3">
                    <span
                      className="text-[10px] tracking-[0.2em]"
                      style={{
                        color: ACCENT,
                        fontFamily: "'JetBrains Mono', 'SF Mono', Menlo, monospace",
                      }}
                    >
                      0{i + 1}
                    </span>
                    {i < loop.length - 1 ? (
                      <span
                        className="hidden md:inline text-base"
                        style={{ color: `${ACCENT}99` }}
                        aria-hidden
                      >
                        →
                      </span>
                    ) : null}
                  </div>
                  <p
                    className="text-xs text-white tracking-wider mb-2"
                    style={{ fontFamily: "'JetBrains Mono', 'SF Mono', Menlo, monospace" }}
                  >
                    {s.step}
                  </p>
                  <p className="text-[11px] text-[#71717a] leading-relaxed">
                    {s.detail}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ──────────────────────────────────────────────────────────────
          FEATURES — 4 cards
      ────────────────────────────────────────────────────────────── */}
      <section className="border-t border-[#16181d]">
        <div className="mx-auto max-w-6xl px-6 py-20">
          <p
            className="text-[10px] uppercase tracking-[0.3em] text-[#71717a] mb-10 text-center"
            style={{ fontFamily: "'JetBrains Mono', 'SF Mono', Menlo, monospace" }}
          >
            Four primitives
          </p>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {[
              {
                cmd: "quill.intent()",
                label: "Intent inference",
                desc: "Quill parses what you mean — debug, build, migrate — not what you click.",
              },
              {
                cmd: "quill.compress()",
                label: "Context compression",
                desc: "Repo, history, errors, open files — distilled into a working set the model can hold.",
              },
              {
                cmd: "quill.synthesize()",
                label: "Real-time synthesis",
                desc: "Panels, toolbars, and shortcuts assembled per-task. No two sessions look alike.",
              },
              {
                cmd: "quill.render()",
                label: "Task-relevant tools",
                desc: "Only what the current task needs. Nothing else competes for attention.",
              },
            ].map((f) => (
              <div
                key={f.cmd}
                className="border border-[#16181d] bg-[#0a0c11] p-5 hover:border-[#f0a050]/40 transition-colors group"
              >
                <div className="flex items-center gap-2 mb-3">
                  <span
                    className="text-[#52525b]"
                    style={{ fontFamily: "'JetBrains Mono', 'SF Mono', Menlo, monospace" }}
                  >
                    &gt;
                  </span>
                  <span
                    className="text-sm group-hover:text-white transition-colors"
                    style={{ color: ACCENT, fontFamily: "'JetBrains Mono', 'SF Mono', Menlo, monospace" }}
                  >
                    {f.cmd}
                  </span>
                </div>
                <div className="text-white text-sm font-medium mb-2">{f.label}</div>
                <div className="text-xs text-[#71717a] leading-relaxed">{f.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ──────────────────────────────────────────────────────────────
          STATS
      ────────────────────────────────────────────────────────────── */}
      <section className="border-t border-[#16181d]" style={{ background: "#06070a" }}>
        <div className="mx-auto max-w-5xl px-6 py-20">
          <div className="grid gap-12 md:grid-cols-3 text-center">
            <div>
              <div
                className="text-5xl sm:text-6xl text-white tracking-tight"
                style={{ fontFamily: "'Cormorant Garamond', 'Iowan Old Style', Georgia, serif", fontWeight: 500 }}
              >
                <span style={{ color: ACCENT }}>0</span>
              </div>
              <div
                className="mt-3 text-xs uppercase tracking-[0.25em] text-[#71717a]"
                style={{ fontFamily: "'JetBrains Mono', 'SF Mono', Menlo, monospace" }}
              >
                menu hunting
              </div>
            </div>
            <div>
              <div
                className="text-5xl sm:text-6xl text-white tracking-tight"
                style={{ fontFamily: "'Cormorant Garamond', 'Iowan Old Style', Georgia, serif", fontWeight: 500 }}
              >
                100<span style={{ color: ACCENT }}>%</span>
              </div>
              <div
                className="mt-3 text-xs uppercase tracking-[0.25em] text-[#71717a]"
                style={{ fontFamily: "'JetBrains Mono', 'SF Mono', Menlo, monospace" }}
              >
                task-relevant UI
              </div>
            </div>
            <div>
              <div
                className="text-5xl sm:text-6xl text-white tracking-tight"
                style={{ fontFamily: "'Cormorant Garamond', 'Iowan Old Style', Georgia, serif", fontWeight: 500 }}
              >
                <span style={{ color: ACCENT }}>instant</span>
              </div>
              <div
                className="mt-3 text-xs uppercase tracking-[0.25em] text-[#71717a]"
                style={{ fontFamily: "'JetBrains Mono', 'SF Mono', Menlo, monospace" }}
              >
                time-to-action
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ──────────────────────────────────────────────────────────────
          CTA
      ────────────────────────────────────────────────────────────── */}
      <section className="border-t border-[#16181d]">
        <div className="mx-auto max-w-6xl px-6 py-24 text-center">
          <p
            className="text-[10px] uppercase tracking-[0.3em] text-[#71717a] mb-6"
            style={{ fontFamily: "'JetBrains Mono', 'SF Mono', Menlo, monospace" }}
          >
            Open the editor that matches your task
          </p>
          <Link
            href="/signup"
            className="inline-block border px-8 py-3 text-sm transition-all duration-200 hover:bg-opacity-10"
            style={{
              fontFamily: "'JetBrains Mono', 'SF Mono', Menlo, monospace",
              borderColor: ACCENT,
              color: ACCENT,
              boxShadow: `0 0 20px ${ACCENT}30`,
            }}
          >
            $ quill init →
          </Link>
        </div>
      </section>

      {/* ──────────────────────────────────────────────────────────────
          FOOTER
      ────────────────────────────────────────────────────────────── */}
      <footer className="border-t border-[#16181d]">
        <div className="mx-auto flex max-w-6xl flex-col gap-4 px-6 py-8 sm:flex-row sm:items-center sm:justify-between">
          <div
            className="text-xs text-[#52525b]"
            style={{ fontFamily: "'JetBrains Mono', 'SF Mono', Menlo, monospace" }}
          >
            <span
              className="text-[#a1a1aa]"
              style={{ fontFamily: "'Cormorant Garamond', 'Iowan Old Style', Georgia, serif", fontWeight: 600, fontSize: "0.9rem" }}
            >
              {appConfig.name}
            </span>
            <span className="mx-2">·</span>
            <span>Dublin</span>
            <span className="mx-2">·</span>
            <span>quill.ie</span>
          </div>
          <a
            href="https://abduljaleel.xyz/aletheia/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-[10px] uppercase tracking-[0.25em] px-3 py-1.5 border transition-colors hover:bg-opacity-10"
            style={{
              fontFamily: "'JetBrains Mono', 'SF Mono', Menlo, monospace",
              borderColor: `${ACCENT}40`,
              color: ACCENT,
            }}
          >
            Part of the Aletheia stack ↗
          </a>
        </div>
      </footer>
    </div>
  );
}
