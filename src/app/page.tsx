import Link from "next/link";
import { Newsreader, IBM_Plex_Mono } from "next/font/google";

/* ────────────────────────────────────────────────────────────────────
   QUILL — THE LITERARY JOURNAL
   Dublin · Vol. I — an editorial magazine spread, not a SaaS landing.
   Server-rendered, zero client JS. The morph is pure CSS, gated behind
   prefers-reduced-motion. Two inks + two accent values, two typefaces.
──────────────────────────────────────────────────────────────────── */

// Newsreader is a variable font — omitting `weight` fetches one variable file
// per style (all weights) instead of several static cuts, trimming payload.
const serif = Newsreader({
  subsets: ["latin"],
  style: ["normal", "italic"],
  variable: "--font-quill-serif",
  display: "swap",
});

const mono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-quill-mono",
  display: "swap",
});

// Palette — ~10 named tokens so a re-ink is a one-line change, not a hunt.
const PAPER = "#f5f1e8";
const INK = "#1c1814";
const INK_BODY = "#2a241d";
const INK_MUTED = "#564d43"; // 7.0:1 on paper — deck, standfirsts, prose
const LABEL = "#6b6258"; // 5.3:1 — small mono labels (lifted from #8a8175)
const RULE = "#d8cfbe";
const RULE_SOFT = "#e0d8c8";
const FRAME = "#c9bfae";
const ACCENT_INK = "#8f4a0d"; // burnt sienna, 5.9:1 — every text-sized accent
const ACCENT_WASH = "#f0a050"; // apricot — large decorative ink only

const SERIF = "var(--font-quill-serif), 'Iowan Old Style', 'Hoefler Text', Georgia, serif";
const MONO = "var(--font-quill-mono), 'SF Mono', 'JetBrains Mono', Menlo, monospace";
const ONUM = { fontFeatureSettings: '"onum" 1' } as const;

const plates = [
  {
    key: "i" as const,
    label: "Plate i.",
    task: "On debugging",
    intent: "debug a memory leak",
    becomes: "a heap viewer",
    lines: ["Heap — 1.8 GB", "Retained — worker.queue#7", "Last GC — 382ms"],
  },
  {
    key: "ii" as const,
    label: "Plate ii.",
    task: "On composition",
    intent: "write a React component",
    becomes: "a prop inspector",
    lines: ["Props — tier, price, cta", "Variants — 5", "Storybook — synced"],
  },
  {
    key: "iii" as const,
    label: "Plate iii.",
    task: "On migration",
    intent: "migrate a database",
    becomes: "a schema diff",
    lines: ["Changes — 3 tables, 1 index", "Reversible — yes", "Dry-run — green"],
  },
];

const process = [
  {
    n: "I.",
    head: "You type an intent.",
    body: "Plain language, the way you would describe the work to a colleague leaning over your shoulder.",
  },
  {
    n: "II.",
    head: "Context is compressed.",
    body: "The repository, its history, the open files, the last error — all distilled to a working set.",
  },
  {
    n: "III.",
    head: "The interface is composed.",
    body: "Panels, tools, and shortcuts are set like type, arranged for this task and no other.",
  },
  {
    n: "IV.",
    head: "It renders in 400ms.",
    body: "A fresh editor, printed to the screen, gone again the moment the work moves on.",
  },
];

/* The morph, as evidence. A subtle staggered settle (~400ms into a 6s
   loop) makes each plate's engraving "set like type" in turn. Fully
   disabled under reduced motion, where the page is static at every frame. */
const KEYFRAMES = `
@keyframes quillSettle {
  0%   { opacity: 0.35; transform: translateY(3px); }
  7%   { opacity: 1;    transform: translateY(0); }
  90%  { opacity: 1;    transform: translateY(0); }
  100% { opacity: 0.35; transform: translateY(3px); }
}
@keyframes quillBlink { 0%, 55% { opacity: 1; } 56%, 100% { opacity: 0; } }
.quill-engraving { animation: quillSettle 6s ease-in-out infinite; }
.quill-engraving.p2 { animation-delay: 2s; }
.quill-engraving.p3 { animation-delay: 4s; }
.quill-caret { animation: quillBlink 1.1s step-end infinite; }
@media (prefers-reduced-motion: reduce) {
  .quill-engraving, .quill-caret {
    animation: none !important;
    opacity: 1 !important;
    transform: none !important;
  }
}
`;

function Engraving({ variant }: { variant: "i" | "ii" | "iii" }) {
  const common = {
    viewBox: "0 0 260 150",
    className: "h-auto max-h-full w-full",
    "aria-hidden": true,
    preserveAspectRatio: "xMidYMid meet",
  } as const;

  if (variant === "i") {
    // Heap flame-graph beside a retained-objects list.
    return (
      <svg {...common}>
        <g fill="none" stroke={INK} strokeWidth="1">
          <rect x="10" y="118" width="120" height="12" />
          <rect x="10" y="102" width="92" height="12" />
          <rect x="10" y="70" width="42" height="12" />
          <rect x="10" y="54" width="22" height="12" />
        </g>
        <rect x="10" y="86" width="66" height="12" fill="none" stroke={ACCENT_INK} strokeWidth="1.3" />
        <g stroke={ACCENT_INK} strokeWidth="0.6">
          <line x1="18" y1="98" x2="26" y2="86" />
          <line x1="30" y1="98" x2="38" y2="86" />
          <line x1="42" y1="98" x2="50" y2="86" />
          <line x1="54" y1="98" x2="62" y2="86" />
          <line x1="66" y1="98" x2="74" y2="86" />
        </g>
        <line x1="150" y1="24" x2="150" y2="132" stroke={FRAME} strokeWidth="1" />
        <g fill="none" stroke={INK} strokeWidth="1">
          <rect x="168" y="44" width="7" height="7" />
          <line x1="183" y1="47.5" x2="248" y2="47.5" />
          <rect x="168" y="66" width="7" height="7" />
          <line x1="183" y1="69.5" x2="248" y2="69.5" />
          <rect x="168" y="88" width="7" height="7" stroke={ACCENT_INK} />
          <line x1="183" y1="91.5" x2="236" y2="91.5" stroke={ACCENT_INK} />
          <rect x="168" y="110" width="7" height="7" />
          <line x1="183" y1="113.5" x2="248" y2="113.5" />
        </g>
      </svg>
    );
  }

  if (variant === "ii") {
    // Component canvas with selection handles + a props table.
    return (
      <svg {...common}>
        <rect x="10" y="20" width="120" height="112" fill="none" stroke={FRAME} strokeWidth="1" />
        <rect x="32" y="48" width="76" height="52" fill="none" stroke={INK} strokeWidth="1.3" />
        <g fill={ACCENT_INK}>
          <rect x="29" y="45" width="6" height="6" />
          <rect x="105" y="45" width="6" height="6" />
          <rect x="29" y="97" width="6" height="6" />
          <rect x="105" y="97" width="6" height="6" />
        </g>
        <g stroke={INK} strokeWidth="0.8">
          <line x1="42" y1="64" x2="98" y2="64" />
          <line x1="42" y1="76" x2="86" y2="76" />
          <line x1="42" y1="88" x2="74" y2="88" />
        </g>
        <line x1="150" y1="24" x2="150" y2="132" stroke={FRAME} strokeWidth="1" />
        <line x1="164" y1="40" x2="250" y2="40" stroke={ACCENT_INK} strokeWidth="1" />
        <line x1="206" y1="28" x2="206" y2="126" stroke={FRAME} strokeWidth="1" />
        <g stroke={INK} strokeWidth="0.85">
          <line x1="164" y1="58" x2="198" y2="58" />
          <line x1="214" y1="58" x2="244" y2="58" />
          <line x1="164" y1="76" x2="198" y2="76" />
          <line x1="214" y1="76" x2="238" y2="76" />
          <line x1="164" y1="94" x2="198" y2="94" />
          <line x1="214" y1="94" x2="246" y2="94" />
          <line x1="164" y1="112" x2="192" y2="112" />
          <line x1="214" y1="112" x2="240" y2="112" />
        </g>
      </svg>
    );
  }

  // Two-column schema diff with struck (removed) and added rows.
  return (
    <svg {...common}>
      <g fill="none" stroke={INK} strokeWidth="0.9">
        <line x1="16" y1="34" x2="106" y2="34" />
        <line x1="16" y1="70" x2="106" y2="70" />
        <line x1="16" y1="106" x2="106" y2="106" />
      </g>
      <g stroke={ACCENT_INK} strokeWidth="1">
        <line x1="6" y1="52" x2="12" y2="52" />
        <line x1="16" y1="52" x2="106" y2="52" />
        <line x1="6" y1="88" x2="12" y2="88" />
        <line x1="16" y1="88" x2="106" y2="88" />
      </g>
      <line x1="120" y1="70" x2="138" y2="70" stroke={INK} strokeWidth="1" />
      <path d="M133 65 L139 70 L133 75" fill="none" stroke={INK} strokeWidth="1" />
      <g fill="none" stroke={INK} strokeWidth="0.9">
        <line x1="164" y1="34" x2="252" y2="34" />
        <line x1="164" y1="52" x2="252" y2="52" />
        <line x1="164" y1="88" x2="252" y2="88" />
      </g>
      <g stroke={ACCENT_INK} strokeWidth="1">
        <line x1="164" y1="70" x2="252" y2="70" />
        <line x1="154" y1="70" x2="160" y2="70" />
        <line x1="157" y1="67" x2="157" y2="73" />
        <line x1="164" y1="106" x2="252" y2="106" />
        <line x1="154" y1="106" x2="160" y2="106" />
        <line x1="157" y1="103" x2="157" y2="109" />
      </g>
    </svg>
  );
}

function NavAnchor({
  href,
  children,
  className = "",
}: {
  href: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <Link
      href={href}
      className={`whitespace-nowrap px-2 py-3 text-[12px] uppercase tracking-[0.25em] underline-offset-4 transition-colors hover:underline sm:text-[11px] sm:tracking-[0.3em] ${className}`}
      style={{ fontFamily: MONO, color: INK_MUTED }}
    >
      {children}
    </Link>
  );
}

function NavDot() {
  return (
    <span aria-hidden className="hidden select-none px-1 sm:inline" style={{ color: FRAME }}>
      ·
    </span>
  );
}

export default function LandingPage() {
  return (
    <div
      className={`${serif.variable} ${mono.variable} min-h-screen`}
      style={{ backgroundColor: PAPER, color: INK, fontFamily: SERIF }}
    >
      <style>{KEYFRAMES}</style>

      <div className="mx-auto max-w-[78rem] px-6 sm:px-10 lg:px-16">
        {/* ───────────────────────── MASTHEAD ───────────────────────── */}
        <header className="pt-8">
          <div
            className="flex items-baseline justify-between text-[12px] uppercase tracking-[0.3em] sm:text-[10px] sm:tracking-[0.35em]"
            style={{ fontFamily: MONO, color: LABEL, ...ONUM }}
          >
            <span>Dublin · Vol. I</span>
            <span className="hidden sm:inline">No. 01 — The Morphing Editor</span>
            <span>MMXXVI</span>
          </div>

          <div className="mt-3 border-y-2 py-5 text-center" style={{ borderColor: INK }}>
            <h1
              className="text-6xl leading-none sm:text-7xl lg:text-8xl"
              style={{ fontWeight: 700, letterSpacing: "0.04em" }}
            >
              QUILL
            </h1>
            <p className="mt-3 text-sm italic tracking-wide" style={{ color: INK_MUTED }}>
              an editor that writes its own margins
            </p>
            {/* Mobile-only restoration of the issue theme (hidden in the dateline). */}
            <p
              className="mt-3 text-[12px] uppercase tracking-[0.28em] sm:hidden"
              style={{ fontFamily: MONO, color: LABEL, ...ONUM }}
            >
              No. 01 — The Morphing Editor
            </p>
          </div>

          {/* A real contents bar: anchors to the issue's sections. */}
          <nav
            aria-label="Contents"
            className="flex flex-col items-center gap-y-1 py-1 sm:flex-row sm:justify-center sm:gap-x-1"
          >
            <div className="flex flex-wrap items-center justify-center">
              <NavAnchor href="#lead" className="hidden sm:inline-flex">
                Contents
              </NavAnchor>
              <NavDot />
              <NavAnchor href="#lead">The Lead</NavAnchor>
              <NavDot />
              <NavAnchor href="#plates">Plates</NavAnchor>
              <NavDot />
              <NavAnchor href="#process">The Process</NavAnchor>
            </div>

            <div className="flex items-center justify-center gap-x-2">
              <span aria-hidden className="hidden select-none sm:inline" style={{ color: FRAME }}>
                ·
              </span>
              <Link
                href="/login"
                className="whitespace-nowrap px-2 py-3 text-[12px] uppercase tracking-[0.25em] underline decoration-1 underline-offset-4 transition-opacity hover:opacity-70 sm:text-[11px] sm:tracking-[0.3em]"
                style={{ fontFamily: MONO, color: INK }}
              >
                Sign in
              </Link>
              <Link
                href="/signup"
                className="group inline-flex items-center whitespace-nowrap py-2 transition-colors"
              >
                <span
                  className="border px-3 py-2 text-[12px] uppercase tracking-[0.25em] transition-colors group-hover:bg-[#efe9db] sm:text-[11px] sm:tracking-[0.3em]"
                  style={{ fontFamily: MONO, color: ACCENT_INK, borderColor: FRAME }}
                >
                  Get started
                </span>
              </Link>
            </div>
          </nav>
        </header>

        <main>
          {/* ───────────────────── LEAD ARTICLE OPENING ───────────────────── */}
          <article
            id="lead"
            className="mt-10 scroll-mt-6 border-t pt-10"
            style={{ borderColor: RULE }}
          >
            <p
              className="text-[12px] uppercase tracking-[0.35em] sm:text-[11px] sm:tracking-[0.4em]"
              style={{ fontFamily: MONO, color: ACCENT_INK }}
            >
              The Lead — A Feature
            </p>
            <h2
              className="mt-4 max-w-5xl text-5xl leading-[1.02] sm:text-6xl lg:text-7xl"
              style={{ fontWeight: 600, letterSpacing: "-0.01em" }}
            >
              The page should know what you&rsquo;re writing.
            </h2>
            <p className="mt-5 max-w-2xl text-lg italic" style={{ color: INK_MUTED }}>
              On development environments that stop pretending every task is the
              same task — and learn, at last, to morph.
            </p>

            <div className="mt-9 grid gap-10 lg:grid-cols-12">
              <div
                className="text-[1.0625rem] leading-[1.72] lg:col-span-8 lg:columns-2 lg:gap-10"
                style={{ color: INK_BODY }}
              >
                <p className="mb-5">
                  <span
                    className="float-left mr-3 mt-1 leading-[0.72]"
                    style={{ fontSize: "4.6rem", fontWeight: 700, color: ACCENT_WASH }}
                  >
                    C
                  </span>
                  onsider the toolbar. It greets you the same way each morning,
                  whether you have come to chase a memory leak through a heap, to
                  shape a small component, or to move a database from one schema to
                  the next. It offers the identical row of icons for all three, as
                  if the work were interchangeable. It is not.
                </p>
                <p className="mb-5">
                  A craftsman&rsquo;s bench is arranged for the job at hand. The
                  surgeon&rsquo;s tray, the printer&rsquo;s case, the chef&rsquo;s
                  mise en place — each is composed for one task and cleared for the
                  next. Software, curiously, never learned this courtesy. It hands
                  you every instrument at once and asks you to hunt.
                </p>
                <p className="mb-5">
                  Quill begins from the opposite premise. You tell it, in plain
                  words, what you mean to do. It reads the room — the repository,
                  the open files, the last error still warm in the log — and it
                  composes an editor for that, and only that. The panels you need
                  arrive; the rest never appear.
                </p>
                <p className="mb-0">
                  What remains is quiet. An interface with nothing to prove and
                  nothing extra to show. It is built fresh for the task, and when
                  the task is done, it is set aside — like a galley pulled after the
                  page has gone to press.
                </p>
              </div>

              <aside className="lg:col-span-4">
                <figure className="border-l-2 pl-5" style={{ borderColor: ACCENT_WASH }}>
                  <blockquote
                    className="text-3xl leading-tight sm:text-4xl"
                    style={{ color: ACCENT_INK, fontWeight: 600 }}
                  >
                    &ldquo;Static toolbars are a relic.&rdquo;
                  </blockquote>
                  <figcaption
                    className="mt-4 text-[12px] uppercase tracking-[0.28em] sm:text-[11px] sm:tracking-[0.3em]"
                    style={{ fontFamily: MONO, color: LABEL }}
                  >
                    — from the margins
                  </figcaption>
                </figure>

                <p className="mt-8 text-[0.95rem] leading-relaxed" style={{ color: INK_MUTED }}>
                  Dublin has always been a city that rewrote itself on the page —
                  from Joyce&rsquo;s wandering Bloom to Beckett&rsquo;s pared-down
                  rooms. Quill keeps the habit, and turns it on the editor.
                </p>
              </aside>
            </div>
          </article>

          {/* ────────── seam: double rule before the plates ────────── */}
          <div className="mt-16" aria-hidden>
            <div className="border-t-2" style={{ borderColor: INK }} />
            <div className="mt-[3px] border-t" style={{ borderColor: FRAME }} />
          </div>

          {/* ───────────── THE MORPH — EDITORIAL FIGURE / PLATES ───────────── */}
          <section id="plates" className="scroll-mt-6 pt-10">
            <div className="flex flex-wrap items-baseline justify-between gap-3">
              <h3 className="text-2xl sm:text-3xl" style={{ fontWeight: 600 }}>
                One editor, observed in three states.
              </h3>
              <span
                className="text-[12px] uppercase tracking-[0.28em] sm:text-[11px] sm:tracking-[0.3em]"
                style={{ fontFamily: MONO, color: ACCENT_INK }}
              >
                Plates i–iii
              </span>
            </div>

            {/* The typed intent that summons the figures. */}
            <p
              className="mt-4 text-[13px] tracking-[0.14em] sm:text-[12px]"
              style={{ fontFamily: MONO, color: INK_MUTED }}
            >
              <span style={{ color: ACCENT_INK }}>&gt;</span> debug a memory leak
              <span className="quill-caret ml-1" style={{ color: INK }}>
                ▍
              </span>
            </p>

            <figure className="mt-6">
              <ul className="grid gap-6 sm:grid-cols-3">
                {plates.map((p, i) => (
                  <li key={p.key} className="flex flex-col">
                    <div
                      className="relative min-h-[20rem] p-1 sm:aspect-[4/5] sm:min-h-0"
                      style={{ border: `1px solid ${INK}` }}
                    >
                      <div
                        className="flex h-full flex-col p-4"
                        style={{ border: `1px solid ${FRAME}` }}
                      >
                        <div
                          className="text-[12px] uppercase tracking-[0.28em] sm:text-[10px] sm:tracking-[0.3em]"
                          style={{ fontFamily: MONO, color: LABEL }}
                        >
                          {p.label}
                        </div>
                        <p className="mt-3 text-xl italic leading-snug" style={{ color: INK }}>
                          {p.task}
                        </p>
                        <div className="mt-4 text-[0.9rem] leading-relaxed" style={{ color: INK_MUTED }}>
                          You ask to <span style={{ color: INK }}>{p.intent}</span>. The
                          page becomes{" "}
                          <span style={{ color: ACCENT_INK, fontWeight: 600 }}>{p.becomes}</span>.
                        </div>

                        <div
                          className={`quill-engraving p${i + 1} my-4 flex flex-1 items-center justify-center overflow-hidden`}
                        >
                          <Engraving variant={p.key} />
                        </div>

                        <div
                          className="space-y-1.5 border-t pt-3"
                          style={{ fontFamily: MONO, borderColor: FRAME }}
                        >
                          {p.lines.map((l) => (
                            <div
                              key={l}
                              className="flex items-center gap-2 text-[12px] sm:text-[11px]"
                              style={{ color: LABEL }}
                            >
                              <span style={{ color: ACCENT_INK }}>·</span>
                              {l}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>

              <figcaption
                className="mt-5 border-t pt-4 text-sm leading-relaxed"
                style={{ borderColor: RULE, color: INK_MUTED }}
              >
                <span
                  className="text-[12px] uppercase tracking-[0.25em] sm:text-[0.72rem]"
                  style={{ fontFamily: MONO, color: INK }}
                >
                  Fig. 1
                </span>{" "}
                — The same environment under three intents. Debugging summons a heap
                viewer; a component summons a prop inspector; a migration summons a
                schema diff. No menu is hunted; the interface simply arrives composed
                for the work.
              </figcaption>
            </figure>
          </section>

          {/* ────────── seam: single hairline before the sidebar ────────── */}
          <div className="mt-16 border-t" style={{ borderColor: RULE }} aria-hidden />

          {/* ────────────── THE PROCESS — NUMBERED SIDEBAR PROSE ────────────── */}
          <section id="process" className="scroll-mt-6 pt-10">
            <div className="grid gap-10 lg:grid-cols-12">
              <div className="lg:col-span-4">
                <p
                  className="text-[12px] uppercase tracking-[0.35em] sm:text-[11px] sm:tracking-[0.4em]"
                  style={{ fontFamily: MONO, color: ACCENT_INK }}
                >
                  A Sidebar
                </p>
                <h3
                  className="mt-4 text-3xl leading-tight sm:text-4xl"
                  style={{ fontWeight: 600 }}
                >
                  How a sentence becomes an editor.
                </h3>
                <p className="mt-5 text-[1rem] italic leading-relaxed" style={{ color: INK_MUTED }}>
                  Four movements, from intent to rendered page, set below with hanging
                  numerals.
                </p>

                {/* Margin furniture: a printer's proof mark filling the dead column. */}
                <div className="mt-8 hidden lg:block">
                  <div className="border p-4" style={{ borderColor: INK }}>
                    <p
                      className="text-[10px] uppercase tracking-[0.3em]"
                      style={{ fontFamily: MONO, color: LABEL }}
                    >
                      Specimen — proof
                    </p>
                    <div className="mt-3 space-y-1.5 text-[12px]" style={{ fontFamily: MONO, color: INK_MUTED }}>
                      <div>
                        intent&nbsp;&nbsp;<span style={{ color: ACCENT_INK }}>→</span>&nbsp;&nbsp;context
                      </div>
                      <div>
                        context&nbsp;<span style={{ color: ACCENT_INK }}>→</span>&nbsp;&nbsp;layout
                      </div>
                      <div>
                        layout&nbsp;&nbsp;<span style={{ color: ACCENT_INK }}>→</span>&nbsp;&nbsp;400ms
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <ol className="lg:col-span-8">
                {process.map((s, i) => (
                  <li
                    key={s.n}
                    className={`py-6 ${i === 0 ? "" : "border-t"}`}
                    style={{ borderColor: RULE_SOFT }}
                  >
                    <div className="flex items-baseline gap-x-4 sm:gap-x-5">
                      <span
                        className="w-[3.5rem] shrink-0 text-right text-4xl leading-none sm:w-[4.5rem] sm:text-5xl"
                        style={{ color: ACCENT_INK, fontWeight: 600 }}
                      >
                        {s.n}
                      </span>
                      <h4 className="text-xl sm:text-2xl" style={{ fontWeight: 600 }}>
                        {s.head}
                      </h4>
                    </div>
                    <p
                      className="mt-2 pl-[calc(3.5rem+1rem)] text-[1.0625rem] leading-relaxed sm:pl-[calc(4.5rem+1.25rem)]"
                      style={{ color: INK_BODY }}
                    >
                      {s.body}
                    </p>
                  </li>
                ))}
              </ol>
            </div>
          </section>

          {/* ───────────────────── CLOSING COLOPHON ───────────────────── */}
          <section className="mt-16">
            <div className="border-y-2 py-12 text-center" style={{ borderColor: INK }}>
              <p className="text-lg leading-none" aria-hidden style={{ color: INK }}>
                ⁂
              </p>
              <p
                className="mt-5 text-xs uppercase tracking-[0.4em] sm:tracking-[0.45em]"
                style={{ fontFamily: MONO, color: LABEL }}
              >
                Colophon
              </p>
              <p
                className="mx-auto mt-5 max-w-2xl text-3xl leading-snug sm:text-4xl"
                style={{ fontWeight: 600 }}
              >
                Set in Dublin. Built to listen.
              </p>
              <p className="mx-auto mt-4 max-w-xl text-[1.05rem] italic" style={{ color: INK_MUTED }}>
                An environment composed afresh for every task — and cleared the moment
                the work moves on.
              </p>

              {/* The CTA as a subscription coupon — button-weight, journal idiom. */}
              <Link href="/signup" className="group mx-auto mt-8 block w-full max-w-[360px]">
                <div className="border p-1 transition-colors group-hover:border-[#8f4a0d]" style={{ borderColor: INK }}>
                  <div className="border px-6 py-6 transition-colors group-hover:border-[#8f4a0d] group-hover:bg-[#efe9db]" style={{ borderColor: FRAME }}>
                    <span className="block text-2xl" style={{ color: INK, fontWeight: 600 }}>
                      Begin — No. 01
                    </span>
                    <span
                      className="mt-2 block text-[12px] uppercase tracking-[0.3em] sm:text-[11px]"
                      style={{ fontFamily: MONO, color: ACCENT_INK }}
                    >
                      free while the issue is in proof
                    </span>
                  </div>
                </div>
              </Link>

              <p
                className="mt-4 text-[12px] uppercase tracking-[0.28em] sm:text-[11px] sm:tracking-[0.3em]"
                style={{ fontFamily: MONO, color: LABEL }}
              >
                or{" "}
                <Link
                  href="/login"
                  className="underline underline-offset-2 hover:opacity-70"
                  style={{ color: INK_MUTED }}
                >
                  sign in to continue reading
                </Link>
              </p>
            </div>
          </section>
        </main>

        {/* ───────────────────────── FOOTER ───────────────────────── */}
        <footer className="mt-8 pb-12">
          <div className="flex flex-col items-center justify-between gap-3 sm:flex-row">
            <p
              className="text-[12px] uppercase tracking-[0.3em] sm:text-[11px] sm:tracking-[0.35em]"
              style={{ fontFamily: MONO, color: LABEL, ...ONUM }}
            >
              Quill · Dublin · quill.ie
            </p>
            <a
              href="https://abduljaleel.xyz/aletheia/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[12px] uppercase tracking-[0.3em] underline decoration-1 underline-offset-4 transition-opacity hover:opacity-70 sm:text-[11px] sm:tracking-[0.35em]"
              style={{ fontFamily: MONO, color: INK }}
            >
              Part of the Aletheia stack &#8599;
            </a>
          </div>
        </footer>
      </div>
    </div>
  );
}
