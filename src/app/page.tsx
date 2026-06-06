import Link from "next/link";

/* ────────────────────────────────────────────────────────────────────
   QUILL — THE LITERARY JOURNAL
   Dublin · Vol. I — an editorial magazine spread, not a SaaS landing.
   Warm paper (#f5f1e8), dark ink (#1c1814), amber accent (#f0a050).
   Serif display, mono captions, multi-column prose, drop cap, plates.
──────────────────────────────────────────────────────────────────── */

const PAPER = "#f5f1e8";
const INK = "#1c1814";
const AMBER = "#f0a050";
const SERIF =
  "'Iowan Old Style', 'Hoefler Text', 'Apple Garamond', Georgia, 'Times New Roman', serif";
const MONO = "'SF Mono', 'JetBrains Mono', 'IBM Plex Mono', Menlo, monospace";

const plates = [
  {
    no: "i.",
    task: "On debugging",
    intent: "debug a memory leak",
    becomes: "a heap viewer",
    lines: ["Heap — 1.8 GB", "Retained — worker.queue#7", "Last GC — 382ms"],
  },
  {
    no: "ii.",
    task: "On composition",
    intent: "write a React component",
    becomes: "a prop inspector",
    lines: ["Props — tier, price, cta", "Variants — 5", "Storybook — synced"],
  },
  {
    no: "iii.",
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

export default function LandingPage() {
  return (
    <div
      className="min-h-screen"
      style={{ backgroundColor: PAPER, color: INK, fontFamily: SERIF }}
    >
      <div className="mx-auto max-w-[78rem] px-6 sm:px-10 lg:px-16">
        {/* ───────────────────────── MASTHEAD ───────────────────────── */}
        <header className="pt-8">
          <div
            className="flex items-baseline justify-between text-[10px] uppercase tracking-[0.35em]"
            style={{ fontFamily: MONO, color: "#6b6258" }}
          >
            <span>Dublin · Vol. I</span>
            <span className="hidden sm:inline">No. 01 — The Morphing Editor</span>
            <span>MMXXVI</span>
          </div>

          <div
            className="mt-3 border-y-2 py-5 text-center"
            style={{ borderColor: INK }}
          >
            <h1
              className="text-6xl sm:text-7xl lg:text-8xl leading-none"
              style={{ fontWeight: 700, letterSpacing: "0.04em" }}
            >
              QUILL
            </h1>
            <p
              className="mt-3 text-sm italic tracking-wide"
              style={{ color: "#564d43" }}
            >
              an editor that writes its own margins
            </p>
          </div>

          {/* Understated text links sit under the rule like a contents bar */}
          <nav
            className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 py-3 text-[11px] uppercase tracking-[0.3em]"
            style={{ fontFamily: MONO }}
          >
            <span style={{ color: "#8a8175" }}>Contents</span>
            <span style={{ color: "#c9bfae" }}>·</span>
            <span style={{ color: "#564d43" }}>The Lead</span>
            <span style={{ color: "#c9bfae" }}>·</span>
            <span style={{ color: "#564d43" }}>Plates</span>
            <span style={{ color: "#c9bfae" }}>·</span>
            <span style={{ color: "#564d43" }}>The Process</span>
            <span style={{ color: "#c9bfae" }}>·</span>
            <Link
              href="/login"
              className="underline decoration-1 underline-offset-4 transition-colors hover:opacity-70"
              style={{ color: INK }}
            >
              Sign in
            </Link>
            <Link
              href="/signup"
              className="underline decoration-1 underline-offset-4 transition-colors hover:opacity-70"
              style={{ color: AMBER, textDecorationColor: AMBER }}
            >
              Get started
            </Link>
          </nav>
        </header>

        {/* ───────────────────── LEAD ARTICLE OPENING ───────────────────── */}
        <article className="mt-10 border-t pt-10" style={{ borderColor: "#d8cfbe" }}>
          {/* Kicker + headline spanning the spread */}
          <p
            className="text-[11px] uppercase tracking-[0.4em]"
            style={{ fontFamily: MONO, color: AMBER }}
          >
            The Lead — A Feature
          </p>
          <h2
            className="mt-4 max-w-5xl text-5xl leading-[1.02] sm:text-6xl lg:text-7xl"
            style={{ fontWeight: 600, letterSpacing: "-0.01em" }}
          >
            The page should know what you&rsquo;re writing.
          </h2>
          <p
            className="mt-5 max-w-2xl text-lg italic"
            style={{ color: "#564d43" }}
          >
            On development environments that stop pretending every task is the
            same task — and learn, at last, to morph.
          </p>

          {/* Body: drop cap flowing into columns, with a margin pull-quote */}
          <div className="mt-9 grid gap-10 lg:grid-cols-12">
            {/* Main prose, set in columns like a magazine */}
            <div
              className="lg:col-span-8 text-[1.0625rem] leading-[1.72] sm:columns-2 sm:gap-10"
              style={{ color: "#2a241d" }}
            >
              <p className="mb-5">
                <span
                  className="float-left mr-3 mt-1 leading-[0.72]"
                  style={{
                    fontSize: "4.6rem",
                    fontWeight: 700,
                    color: AMBER,
                  }}
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
                surgeon&rsquo;s tray, the printer&rsquo;s case, the
                chef&rsquo;s mise en place — each is composed for one task and
                cleared for the next. Software, curiously, never learned this
                courtesy. It hands you every instrument at once and asks you to
                hunt.
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
                the task is done, it is set aside — like a galley pulled after
                the page has gone to press.
              </p>
            </div>

            {/* Margin: pull-quote in amber */}
            <aside className="lg:col-span-4">
              <figure
                className="border-l-2 pl-5"
                style={{ borderColor: AMBER }}
              >
                <blockquote
                  className="text-3xl leading-tight sm:text-4xl"
                  style={{ color: AMBER, fontWeight: 600 }}
                >
                  &ldquo;Static toolbars are a relic.&rdquo;
                </blockquote>
                <figcaption
                  className="mt-4 text-[11px] uppercase tracking-[0.3em]"
                  style={{ fontFamily: MONO, color: "#8a8175" }}
                >
                  — from the margins
                </figcaption>
              </figure>

              <p
                className="mt-8 text-[0.95rem] leading-relaxed"
                style={{ color: "#564d43" }}
              >
                Dublin has always been a city that rewrote itself on the page —
                from Joyce&rsquo;s wandering Bloom to Beckett&rsquo;s pared-down
                rooms. Quill keeps the habit, and turns it on the editor.
              </p>
            </aside>
          </div>
        </article>

        {/* ───────────── THE MORPH — EDITORIAL FIGURE / PLATES ───────────── */}
        <section className="mt-16 border-t pt-10" style={{ borderColor: "#d8cfbe" }}>
          <div className="flex flex-wrap items-baseline justify-between gap-3">
            <h3
              className="text-2xl sm:text-3xl"
              style={{ fontWeight: 600 }}
            >
              One editor, observed in three states.
            </h3>
            <span
              className="text-[11px] uppercase tracking-[0.3em]"
              style={{ fontFamily: MONO, color: AMBER }}
            >
              Plates i–iii
            </span>
          </div>

          {/* Three framed plates in a row, with a single shared caption beneath */}
          <figure className="mt-8">
            <div className="grid gap-6 sm:grid-cols-3">
              {plates.map((p) => (
                <div key={p.no} className="flex flex-col">
                  {/* The plate: a thin double frame, like a printed figure */}
                  <div
                    className="relative aspect-[4/5] p-1"
                    style={{ border: `1px solid ${INK}` }}
                  >
                    <div
                      className="flex h-full flex-col p-4"
                      style={{ border: "1px solid #c9bfae" }}
                    >
                      <div
                        className="text-[10px] uppercase tracking-[0.3em]"
                        style={{ fontFamily: MONO, color: "#8a8175" }}
                      >
                        Plate {p.no}
                      </div>
                      <p
                        className="mt-3 text-xl italic leading-snug"
                        style={{ color: INK }}
                      >
                        {p.task}
                      </p>

                      <div
                        className="mt-4 text-[0.9rem] leading-relaxed"
                        style={{ color: "#564d43" }}
                      >
                        You ask to{" "}
                        <span style={{ color: INK }}>{p.intent}</span>. The page
                        becomes{" "}
                        <span style={{ color: AMBER, fontWeight: 600 }}>
                          {p.becomes}
                        </span>
                        .
                      </div>

                      <div
                        className="mt-auto space-y-1.5 pt-5"
                        style={{ fontFamily: MONO }}
                      >
                        {p.lines.map((l) => (
                          <div
                            key={l}
                            className="flex items-center gap-2 text-[11px]"
                            style={{ color: "#6b6258" }}
                          >
                            <span style={{ color: AMBER }}>·</span>
                            {l}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <figcaption
              className="mt-5 border-t pt-4 text-sm leading-relaxed"
              style={{ borderColor: "#d8cfbe", color: "#564d43" }}
            >
              <span
                className="uppercase tracking-[0.25em]"
                style={{ fontFamily: MONO, fontSize: "0.7rem", color: INK }}
              >
                Fig. 1
              </span>{" "}
              — The same environment under three intents. Debugging summons a
              heap viewer; a component summons a prop inspector; a migration
              summons a schema diff. No menu is hunted; the interface simply
              arrives composed for the work.
            </figcaption>
          </figure>
        </section>

        {/* ────────────── THE PROCESS — NUMBERED SIDEBAR PROSE ────────────── */}
        <section className="mt-16 border-t pt-10" style={{ borderColor: "#d8cfbe" }}>
          <div className="grid gap-10 lg:grid-cols-12">
            <div className="lg:col-span-4">
              <p
                className="text-[11px] uppercase tracking-[0.4em]"
                style={{ fontFamily: MONO, color: AMBER }}
              >
                A Sidebar
              </p>
              <h3
                className="mt-4 text-3xl leading-tight sm:text-4xl"
                style={{ fontWeight: 600 }}
              >
                How a sentence becomes an editor.
              </h3>
              <p
                className="mt-5 text-[1rem] italic leading-relaxed"
                style={{ color: "#564d43" }}
              >
                Four movements, from intent to rendered page, set below with
                hanging numerals.
              </p>
            </div>

            {/* Numbered, hanging-numeral editorial list */}
            <ol className="lg:col-span-8">
              {process.map((s, i) => (
                <li
                  key={s.n}
                  className={`grid grid-cols-[3.5rem_1fr] gap-x-5 py-6 ${
                    i === 0 ? "" : "border-t"
                  }`}
                  style={{ borderColor: "#e0d8c8" }}
                >
                  <span
                    className="text-4xl leading-none sm:text-5xl"
                    style={{ color: AMBER, fontWeight: 600 }}
                  >
                    {s.n}
                  </span>
                  <div>
                    <h4 className="text-xl sm:text-2xl" style={{ fontWeight: 600 }}>
                      {s.head}
                    </h4>
                    <p
                      className="mt-2 text-[1.0625rem] leading-relaxed"
                      style={{ color: "#2a241d" }}
                    >
                      {s.body}
                    </p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* ───────────────────── CLOSING COLOPHON ───────────────────── */}
        <section className="mt-16">
          <div
            className="border-y-2 py-12 text-center"
            style={{ borderColor: INK }}
          >
            <p
              className="text-xs uppercase tracking-[0.45em]"
              style={{ fontFamily: MONO, color: "#8a8175" }}
            >
              Colophon
            </p>
            <p
              className="mx-auto mt-5 max-w-2xl text-3xl leading-snug sm:text-4xl"
              style={{ fontWeight: 600 }}
            >
              Set in Dublin. Built to listen.
            </p>
            <p
              className="mx-auto mt-4 max-w-xl text-[1.05rem] italic"
              style={{ color: "#564d43" }}
            >
              An environment composed afresh for every task — and cleared the
              moment the work moves on.
            </p>
            <Link
              href="/signup"
              className="mt-8 inline-block text-2xl underline decoration-2 underline-offset-[6px] transition-opacity hover:opacity-70"
              style={{ color: AMBER, textDecorationColor: AMBER, fontWeight: 600 }}
            >
              Begin &rarr;
            </Link>
            <p
              className="mt-3 text-[11px] uppercase tracking-[0.3em]"
              style={{ fontFamily: MONO, color: "#8a8175" }}
            >
              or{" "}
              <Link
                href="/login"
                className="underline underline-offset-2 hover:opacity-70"
                style={{ color: "#564d43" }}
              >
                sign in to continue reading
              </Link>
            </p>
          </div>
        </section>

        {/* ───────────────────────── FOOTER ───────────────────────── */}
        <footer className="mt-10 pb-12">
          <div
            className="h-px w-full"
            style={{ backgroundColor: "#c9bfae" }}
          />
          <div className="mt-5 flex flex-col items-center justify-between gap-3 sm:flex-row">
            <p
              className="text-[11px] uppercase tracking-[0.35em]"
              style={{ fontFamily: MONO, color: "#6b6258" }}
            >
              Quill · Dublin · quill.ie
            </p>
            <a
              href="https://abduljaleel.xyz/aletheia/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[11px] uppercase tracking-[0.35em] underline decoration-1 underline-offset-4 transition-opacity hover:opacity-70"
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
