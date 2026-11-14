import ExperimentLab from "./features/experiments/ExperimentLab";
import TournamentArena from "./features/tournaments/TournamentArena";
import { useState } from "react";
import {
  Activity,
  ArrowDownRight,
  ArrowUpRight,
  BarChart3,
  Binary,
  BookOpen,
  ChevronRight,
  CircleHelp,
  FlaskConical,
  Gamepad2,
  Github,
  Layers3,
  Menu,
  Play,
  Plus,
  Settings2,
  Shield,
  Sparkles,
  Trophy,
  X,
  Zap,
} from "lucide-react";

type Page =
  | "Overview"
  | "Game Library"
  | "Experiment Lab"
  | "Tournaments"
  | "Analytics"
  | "Theory";

const navItems = [
  { name: "Overview", icon: Layers3 },
  { name: "Game Library", icon: Gamepad2 },
  { name: "Experiment Lab", icon: FlaskConical },
  { name: "Tournaments", icon: Trophy },
  { name: "Analytics", icon: BarChart3 },
  { name: "Theory", icon: BookOpen },
] as const;

const games = [
  {
    name: "Prisoner's Dilemma",
    category: "SOCIAL DILEMMA",
    description:
      "Explore the tension between individual incentives and collective outcomes.",
    players: "2 players",
    difficulty: "Beginner",
    status: "AVAILABLE",
    symbol: "01",
  },
  {
    name: "Chicken Game",
    category: "CONFLICT",
    description:
      "Study strategic brinkmanship, risk, and the cost of backing down.",
    players: "2 players",
    difficulty: "Intermediate",
    status: "COMING SOON",
    symbol: "02",
  },
  {
    name: "Stag Hunt",
    category: "COORDINATION",
    description:
      "Investigate trust, cooperation, and the challenge of coordinating decisions.",
    players: "2 players",
    difficulty: "Beginner",
    status: "COMING SOON",
    symbol: "03",
  },
  {
    name: "Matching Pennies",
    category: "ZERO-SUM",
    description:
      "Understand mixed strategies and competitive decision-making.",
    players: "2 players",
    difficulty: "Intermediate",
    status: "COMING SOON",
    symbol: "04",
  },
];

const strategies = [
  "Always Cooperate",
  "Always Defect",
  "Tit for Tat",
  "Grim Trigger",
  "Pavlov",
];

function Sidebar({
  page,
  setPage,
  mobileOpen,
  setMobileOpen,
}: {
  page: Page;
  setPage: (page: Page) => void;
  mobileOpen: boolean;
  setMobileOpen: (value: boolean) => void;
}) {
  return (
    <>
      {mobileOpen && (
        <button
          className="fixed inset-0 z-40 bg-black/70 lg:hidden"
          onClick={() => setMobileOpen(false)}
          aria-label="Close navigation"
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-[var(--border)] bg-[var(--bg)] transition-transform lg:translate-x-0 ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex h-[76px] items-center justify-between border-b border-[var(--border)] px-6">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[var(--lime)] text-black">
              <Binary size={22} />
            </div>
            <div>
              <div className="text-sm font-bold tracking-[0.12em]">
                GAME THEORY
              </div>
              <div className="mono text-[9px] tracking-[0.15em] text-muted">
                RESEARCH LAB
              </div>
            </div>
          </div>

          <button
            className="text-muted lg:hidden"
            onClick={() => setMobileOpen(false)}
            aria-label="Close menu"
          >
            <X size={19} />
          </button>
        </div>

        <div className="px-4 pt-7">
          <div className="mono mb-3 px-3 text-[10px] tracking-[0.16em] text-muted">
            WORKSPACE
          </div>

          <nav className="space-y-1">
            {navItems.map(({ name, icon: Icon }) => (
              <button
                key={name}
                onClick={() => {
                  setPage(name);
                  setMobileOpen(false);
                }}
                className={`flex w-full items-center gap-3 rounded-lg px-3 py-3 text-left text-sm transition ${
                  page === name
                    ? "bg-[#b6f36a]/10 text-[var(--lime)]"
                    : "text-muted hover:bg-white/5 hover:text-white"
                }`}
              >
                <Icon size={17} />
                <span>{name}</span>
                {page === name && (
                  <span className="ml-auto h-1.5 w-1.5 rounded-full bg-[var(--lime)]" />
                )}
              </button>
            ))}
          </nav>
        </div>

        <div className="mt-auto p-4">
          <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4">
            <div className="mb-2 flex items-center gap-2 text-[var(--lime)]">
              <Sparkles size={15} />
              <span className="mono text-[10px] tracking-wider">
                THE LAB NOTE
              </span>
            </div>
            <p className="text-xs leading-5 text-muted">
              Every decision has a consequence. Every strategy has a weakness.
            </p>
            <button
              onClick={() => setPage("Theory")}
              className="mt-3 flex items-center gap-2 text-xs font-semibold text-white hover:text-[var(--lime)]"
            >
              Explore theory <ChevronRight size={13} />
            </button>
          </div>

          <div className="mt-4 flex items-center justify-between px-2 text-muted">
            <span className="mono text-[10px]">VERSION 1.0.0</span>
            <a
              href="https://github.com"
              target="_blank"
              rel="noreferrer"
              aria-label="GitHub"
              className="hover:text-white"
            >
              <Github size={16} />
            </a>
          </div>
        </div>
      </aside>
    </>
  );
}

function SectionHeading({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description: string;
}) {
  return (
    <div className="mb-8">
      <div className="mono mb-3 text-[10px] tracking-[0.2em] text-[var(--lime)]">
        {eyebrow}
      </div>
      <h1 className="text-3xl font-semibold tracking-tight md:text-4xl">
        {title}
      </h1>
      <p className="mt-3 max-w-xl text-sm leading-6 text-muted">
        {description}
      </p>
    </div>
  );
}

function StatCard({
  label,
  value,
  detail,
  icon: Icon,
}: {
  label: string;
  value: string;
  detail: string;
  icon: typeof Activity;
}) {
  return (
    <div className="panel p-5">
      <div className="flex items-center justify-between">
        <span className="mono text-[10px] tracking-wider text-muted">
          {label}
        </span>
        <Icon size={17} className="text-muted" />
      </div>
      <div className="mt-5 text-3xl font-semibold tracking-tight">
        {value}
      </div>
      <div className="mt-2 text-xs text-muted">{detail}</div>
    </div>
  );
}

function Overview({ setPage }: { setPage: (page: Page) => void }) {
  return (
    <>
      <div className="relative overflow-hidden rounded-2xl border border-[var(--border)] bg-[#171d16] p-7 md:p-11">
        <div className="grid-bg absolute inset-0 opacity-30" />
        <div className="absolute -right-24 -top-32 h-80 w-80 rounded-full bg-[#b6f36a]/[0.07] blur-3xl" />

        <div className="relative max-w-2xl">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#b6f36a]/20 bg-[#b6f36a]/5 px-3 py-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-[var(--lime)]" />
            <span className="mono text-[9px] tracking-widest text-[var(--lime)]">
              STRATEGIC THINKING, QUANTIFIED
            </span>
          </div>

          <h1 className="text-4xl font-semibold leading-[1.12] tracking-tight md:text-6xl">
            Understand the
            <br />
            <span className="text-[var(--lime)]">rules of strategy.</span>
          </h1>

          <p className="mt-6 max-w-lg text-sm leading-7 text-[#a5afa1] md:text-base">
            An interactive laboratory for exploring strategic decisions,
            mathematical models, and the fascinating logic behind human
            behaviour.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <button
              onClick={() => setPage("Experiment Lab")}
              className="flex items-center gap-2 rounded-lg bg-[var(--lime)] px-5 py-3 text-sm font-bold text-[#101310] hover:bg-[#d0ff91]"
            >
              <Play size={15} fill="currentColor" />
              Start experimenting
            </button>
            <button
              onClick={() => setPage("Game Library")}
              className="flex items-center gap-2 rounded-lg border border-[#455044] px-5 py-3 text-sm font-semibold text-white hover:bg-white/5"
            >
              Explore games <ChevronRight size={15} />
            </button>
          </div>
        </div>

        <div className="relative mt-12 grid grid-cols-3 gap-4 border-t border-white/10 pt-6 md:max-w-lg">
          {[
            ["01", "MODEL"],
            ["02", "STRATEGY"],
            ["03", "OUTCOME"],
          ].map(([number, label]) => (
            <div key={number}>
              <div className="mono text-lg text-[var(--lime)]">{number}</div>
              <div className="mono mt-1 text-[9px] tracking-widest text-muted">
                {label}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="GAME MODELS"
          value="04"
          detail="1 currently playable"
          icon={Gamepad2}
        />
        <StatCard
          label="BUILT-IN STRATEGIES"
          value="07"
          detail="Ready for simulation"
          icon={Shield}
        />
        <StatCard
          label="EXPERIMENTS"
          value="00"
          detail="Run your first experiment"
          icon={FlaskConical}
        />
        <StatCard
          label="RESEARCH STATUS"
          value="LIVE"
          detail="Local simulation engine"
          icon={Activity}
        />
      </div>

      <div className="mt-12 grid gap-8 xl:grid-cols-[1.3fr_0.7fr]">
        <section>
          <div className="mb-5 flex items-center justify-between">
            <div>
              <div className="mono text-[10px] tracking-widest text-muted">
                DISCOVER
              </div>
              <h2 className="mt-2 text-xl font-semibold">
                Featured game
              </h2>
            </div>
            <button
              onClick={() => setPage("Game Library")}
              className="text-xs text-[var(--lime)] hover:underline"
            >
              View library →
            </button>
          </div>

          <div className="panel overflow-hidden">
            <div className="grid-bg flex min-h-48 items-center justify-center border-b border-[var(--border)] bg-[#192019]">
              <div className="flex items-center gap-8 md:gap-16">
                <div className="flex flex-col items-center gap-2">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-[#b6f36a]/30 bg-[#b6f36a]/10 text-[var(--lime)]">
                    <Shield size={24} />
                  </div>
                  <span className="mono text-[9px] text-muted">PLAYER A</span>
                </div>
                <div className="text-center">
                  <div className="mono text-xs text-[var(--lime)]">VS</div>
                  <div className="my-2 h-px w-12 bg-[#53604d]" />
                  <div className="mono text-[9px] text-muted">CHOICE</div>
                </div>
                <div className="flex flex-col items-center gap-2">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-[#79b9e9]/30 bg-[#79b9e9]/10 text-[#79b9e9]">
                    <Shield size={24} />
                  </div>
                  <span className="mono text-[9px] text-muted">PLAYER B</span>
                </div>
              </div>
            </div>
            <div className="p-6">
              <div className="mono text-[9px] tracking-widest text-[var(--lime)]">
                SOCIAL DILEMMA · TWO PLAYERS
              </div>
              <h3 className="mt-2 text-xl font-semibold">
                The Prisoner's Dilemma
              </h3>
              <p className="mt-2 max-w-lg text-sm leading-6 text-muted">
                Should you cooperate or defect? Discover why rational
                individual decisions can produce irrational collective
                outcomes.
              </p>
              <button
                onClick={() => setPage("Experiment Lab")}
                className="mt-5 flex items-center gap-2 text-sm font-semibold text-[var(--lime)]"
              >
                Open experiment <ArrowUpRight size={15} />
              </button>
            </div>
          </div>
        </section>

        <section>
          <div className="mono mb-5 text-[10px] tracking-widest text-muted">
            QUICK ACCESS
          </div>
          <div className="space-y-3">
            {[
              {
                name: "Game Library",
                desc: "Explore strategic models",
                icon: Gamepad2,
                page: "Game Library" as Page,
              },
              {
                name: "Experiment Lab",
                desc: "Configure your own simulations",
                icon: FlaskConical,
                page: "Experiment Lab" as Page,
              },
              {
                name: "Theory",
                desc: "Learn the mathematics",
                icon: BookOpen,
                page: "Theory" as Page,
              },
            ].map(({ name, desc, icon: Icon, page }) => (
              <button
                key={name}
                onClick={() => setPage(page)}
                className="panel flex w-full items-center gap-4 p-4 text-left hover:border-[#b6f36a]/40"
              >
                <div className="rounded-lg bg-white/5 p-3 text-[var(--lime)]">
                  <Icon size={19} />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-sm font-semibold">{name}</div>
                  <div className="mt-1 text-xs text-muted">{desc}</div>
                </div>
                <ChevronRight size={16} className="text-muted" />
              </button>
            ))}
          </div>

          <div className="mt-6 rounded-xl border border-[var(--border)] p-5">
            <div className="flex items-center gap-2 text-[var(--lime)]">
              <Zap size={16} />
              <span className="mono text-[10px] tracking-wider">
                DID YOU KNOW?
              </span>
            </div>
            <p className="mt-3 text-sm leading-6 text-muted">
              In a one-shot Prisoner's Dilemma, defection is the dominant
              strategy for both players, even though mutual cooperation
              produces a better collective outcome.
            </p>
          </div>
        </section>
      </div>
    </>
  );
}

function GameLibrary({ setPage }: { setPage: (page: Page) => void }) {
  return (
    <>
      <SectionHeading
        eyebrow="MODEL DIRECTORY / 001"
        title="Game library"
        description="A collection of mathematical models that explain strategic interactions, competition, cooperation and conflict."
      />

      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <span className="mono text-[10px] tracking-widest text-muted">
          04 MODELS IN DIRECTORY
        </span>
        <span className="rounded-full border border-[var(--border)] px-3 py-1.5 text-xs text-muted">
          All categories
        </span>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {games.map((game) => {
          const available = game.status === "AVAILABLE";

          return (
            <article
              key={game.name}
              className="panel group flex flex-col p-6 transition hover:border-[#b6f36a]/40"
            >
              <div className="flex items-start justify-between">
                <span className="mono text-2xl text-[#56604f]">
                  {game.symbol}
                </span>
                <span
                  className={`mono rounded-full px-2.5 py-1 text-[9px] tracking-wider ${
                    available
                      ? "bg-[#b6f36a]/10 text-[var(--lime)]"
                      : "bg-white/5 text-muted"
                  }`}
                >
                  {game.status}
                </span>
              </div>

              <div className="mt-7">
                <div className="mono text-[9px] tracking-widest text-[var(--lime)]">
                  {game.category}
                </div>
                <h2 className="mt-2 text-xl font-semibold">{game.name}</h2>
                <p className="mt-3 min-h-12 text-sm leading-6 text-muted">
                  {game.description}
                </p>
              </div>

              <div className="mt-6 flex items-center justify-between border-t border-[var(--border)] pt-4">
                <div className="flex gap-4 text-[11px] text-muted">
                  <span>{game.players}</span>
                  <span>{game.difficulty}</span>
                </div>
                <button
                  disabled={!available}
                  onClick={() => setPage("Experiment Lab")}
                  className="flex items-center gap-1.5 text-xs font-semibold text-[var(--lime)] disabled:cursor-not-allowed disabled:text-[#626b60]"
                >
                  {available ? "Explore model" : "In development"}
                  {available && <ArrowUpRight size={14} />}
                </button>
              </div>
            </article>
          );
        })}
      </div>
    </>
  );
}

function Placeholder({ page }: { page: Page }) {
  const content: Record<string, { title: string; description: string }> = {
    Tournaments: {
      title: "Tournament arena",
      description:
        "Pit strategies against each other in round-robin competitions. Compare cumulative scores and discover which strategies thrive.",
    },
    Analytics: {
      title: "Research analytics",
      description:
        "Explore cooperation rates, performance comparisons, score distributions and strategic behaviour.",
    },
    Theory: {
      title: "Theoretical foundations",
      description:
        "Explore Nash equilibrium, dominant strategies, Pareto efficiency, repeated games and the mathematics of strategic interaction.",
    },
  };

  const data = content[page];

  return (
    <div className="flex min-h-[55vh] flex-col items-center justify-center text-center">
      <div className="mb-6 rounded-2xl border border-[#b6f36a]/20 bg-[#b6f36a]/5 p-5 text-[var(--lime)]">
        <Binary size={34} />
      </div>
      <div className="mono text-[10px] tracking-[0.2em] text-[var(--lime)]">
        RESEARCH MODULE
      </div>
      <h1 className="mt-4 text-3xl font-semibold">{data.title}</h1>
      <p className="mt-4 max-w-md text-sm leading-7 text-muted">
        {data.description}
      </p>
      <div className="mt-8 rounded-full border border-[var(--border)] px-4 py-2 mono text-[9px] tracking-widest text-muted">
        MODULE UNDER DEVELOPMENT
      </div>
    </div>
  );
}

export default function App() {
  const [page, setPage] = useState<Page>("Overview");
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[var(--bg)] text-[#eef2e9]">
      <Sidebar
        page={page}
        setPage={setPage}
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
      />

      <main className="min-h-screen lg:pl-64">
        <header className="sticky top-0 z-30 flex h-[76px] items-center justify-between border-b border-[var(--border)] bg-[#101310]/90 px-5 backdrop-blur-xl md:px-9">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setMobileOpen(true)}
              className="text-muted lg:hidden"
              aria-label="Open navigation"
            >
              <Menu size={21} />
            </button>
            <div className="mono text-[10px] tracking-widest text-muted">
              RESEARCH /{" "}
              <span className="text-white">{page.toUpperCase()}</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden items-center gap-2 rounded-full border border-[var(--border)] px-3 py-2 sm:flex">
              <span className="h-1.5 w-1.5 rounded-full bg-[var(--lime)]" />
              <span className="mono text-[9px] tracking-wider text-muted">
                ENGINE READY
              </span>
            </div>
            <div className="flex h-9 w-9 items-center justify-center rounded-full border border-[var(--border)] bg-[var(--surface)]">
              <Activity size={16} className="text-[var(--lime)]" />
            </div>
          </div>
        </header>

        <div className="mx-auto max-w-[1440px] px-5 py-8 md:px-9 md:py-10">
          {page === "Overview" && <Overview setPage={setPage} />}
          {page === "Game Library" && <GameLibrary setPage={setPage} />}
          {page === "Experiment Lab" && <ExperimentLab />}
          {page === "Tournaments" && <TournamentArena />}

          {["Analytics", "Theory"].includes(page) && (
          <Placeholder page={page} />
          )}
        </div>

        <footer className="border-t border-[var(--border)] px-5 py-6 md:px-9">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <span className="mono text-[9px] tracking-widest text-muted">
              GAME THEORY LABORATORY © 2026
            </span>
            <span className="mono text-[9px] tracking-widest text-muted">
              BUILT FOR STRATEGIC THINKERS
            </span>
          </div>
        </footer>
      </main>
    </div>
  );
}
