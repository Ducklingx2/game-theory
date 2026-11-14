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
          value="05"
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

function ExperimentLab() {
  const [rounds, setRounds] = useState(100);
  const [selected, setSelected] = useState<string[]>([
    "Always Cooperate",
    "Always Defect",
    "Tit for Tat",
    "Grim Trigger",
    "Pavlov",
  ]);
  const [results, setResults] = useState<
    { name: string; score: number; cooperation: number }[] | null
  >(null);

  function runSimulation() {
    const stats = new Map(
      strategies.map((name) => [
        name,
        { score: 0, cooperation: 0, matches: 0 },
      ])
    );

    const seed = 12345;
    let randomSeed = seed;

    const random = () => {
      randomSeed = (randomSeed * 16807) % 2147483647;
      return (randomSeed - 1) / 2147483646;
    };

    const getAction = (
      strategy: string,
      own: string[],
      opponent: string[],
      previousReward: number,
      triggered: boolean
    ) => {
      switch (strategy) {
        case "Always Cooperate":
          return "C";
        case "Always Defect":
          return "D";
        case "Tit for Tat":
          return opponent.length ? opponent[opponent.length - 1] : "C";
        case "Grim Trigger":
          return triggered ? "D" : "C";
        case "Pavlov":
          if (!own.length) return "C";
          return previousReward >= 3 ? own[own.length - 1] : own[own.length - 1] === "C" ? "D" : "C";
        default:
          return random() > 0.5 ? "C" : "D";
      }
    };

    for (let i = 0; i < selected.length; i++) {
      for (let j = i + 1; j < selected.length; j++) {
        const aName = selected[i];
        const bName = selected[j];

        const a = stats.get(aName)!;
        const b = stats.get(bName)!;

        let aHistory: string[] = [];
        let bHistory: string[] = [];
        let aReward = 0;
        let bReward = 0;
        let aTriggered = false;
        let bTriggered = false;

        for (let round = 0; round < rounds; round++) {
          const actionA = getAction(
            aName,
            aHistory,
            bHistory,
            aReward,
            aTriggered
          );
          const actionB = getAction(
            bName,
            bHistory,
            aReward,
            bTriggered ? bHistory : bHistory,
            bReward,
            bTriggered
          );

          const payoffA =
            actionA === "C"
              ? actionB === "C" ? 3 : 0
              : actionB === "C" ? 5 : 1;

          const payoffB =
            actionB === "C"
              ? actionA === "C" ? 3 : 0
              : actionA === "C" ? 5 : 1;

          aReward = payoffA;
          bReward = payoffB;
          a.score += payoffA;
          b.score += payoffB;

          if (actionA === "C") a.cooperation++;
          if (actionB === "C") b.cooperation++;

          if (actionA === "D") aTriggered = true;
          if (actionB === "D") bTriggered = true;

          aHistory.push(actionA);
          bHistory.push(actionB);
        }

        a.matches += rounds;
        b.matches += rounds;
      }
    }

    const output = selected
      .map((name) => {
        const stat = stats.get(name)!;
        return {
          name,
          score: stat.score,
          cooperation: stat.matches
            ? Math.round((stat.cooperation / stat.matches) * 100)
            : 0,
        };
      })
      .sort((a, b) => b.score - a.score);

    setResults(output);
  }

  return (
    <>
      <SectionHeading
        eyebrow="SIMULATION ENGINE / 001"
        title="Experiment lab"
        description="Configure strategic interactions, choose your participants and observe how different strategies perform over repeated encounters."
      />

      <div className="grid gap-6 xl:grid-cols-[1fr_320px]">
        <div className="space-y-6">
          <section className="panel p-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="mono text-[10px] tracking-widest text-muted">
                  MODEL SELECTED
                </div>
                <h2 className="mt-2 text-xl font-semibold">
                  Prisoner's Dilemma
                </h2>
              </div>
              <div className="rounded-lg bg-[#b6f36a]/10 p-3 text-[var(--lime)]">
                <Gamepad2 size={21} />
              </div>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-3 md:grid-cols-4">
              {[
                ["TEMPTATION", "5"],
                ["REWARD", "3"],
                ["PUNISHMENT", "1"],
                ["SUCKER", "0"],
              ].map(([label, value]) => (
                <div
                  key={label}
                  className="rounded-lg border border-[var(--border)] bg-[#101310] p-3"
                >
                  <div className="mono text-[9px] tracking-wider text-muted">
                    {label}
                  </div>
                  <div className="mono mt-2 text-2xl text-[var(--lime)]">
                    {value}
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-4 text-xs leading-5 text-muted">
              Standard payoff structure: T = 5, R = 3, P = 1, S = 0.
              The classic Prisoner's Dilemma satisfies T &gt; R &gt; P &gt; S.
            </div>
          </section>

          <section className="panel p-6">
            <div className="mb-5 flex items-center justify-between">
              <h2 className="font-semibold">Strategy selection</h2>
              <span className="mono text-[10px] text-muted">
                {selected.length} SELECTED
              </span>
            </div>

            <div className="space-y-2">
              {strategies.map((strategy, index) => {
                const checked = selected.includes(strategy);

                return (
                  <label
                    key={strategy}
                    className={`flex cursor-pointer items-center gap-3 rounded-lg border p-4 transition ${
                      checked
                        ? "border-[#b6f36a]/30 bg-[#b6f36a]/5"
                        : "border-[var(--border)] hover:bg-white/[0.02]"
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() =>
                        setSelected((previous) =>
                          checked
                            ? previous.filter((item) => item !== strategy)
                            : [...previous, strategy]
                        )
                      }
                      className="accent-[#b6f36a]"
                    />
                    <div className="min-w-0 flex-1">
                      <div className="text-sm font-medium">{strategy}</div>
                      <div className="mono mt-1 text-[9px] text-muted">
                        STRATEGY {String(index + 1).padStart(2, "0")}
                      </div>
                    </div>
                    <div
                      className={`h-2 w-2 rounded-full ${
                        checked ? "bg-[var(--lime)]" : "bg-[#424a40]"
                      }`}
                    />
                  </label>
                );
              })}
            </div>
          </section>

          {results && (
            <section className="panel p-6">
              <div className="mb-5 flex items-center justify-between">
                <h2 className="font-semibold">Simulation results</h2>
                <span className="mono text-[9px] text-[var(--lime)]">
                  COMPLETED
                </span>
              </div>

              <div className="space-y-4">
                {results.map((result, index) => (
                  <div key={result.name}>
                    <div className="mb-2 flex items-center justify-between gap-2">
                      <span className="text-sm">{result.name}</span>
                      <span className="mono text-xs text-[var(--lime)]">
                        {result.score.toLocaleString()} PTS
                      </span>
                    </div>
                    <div className="h-2 overflow-hidden rounded-full bg-[#293029]">
                      <div
                        className="h-full rounded-full bg-[var(--lime)]"
                        style={{
                          width: `${
                            results[0].score
                              ? (result.score / results[0].score) * 100
                              : 0
                          }%`,
                        }}
                      />
                    </div>
                    <div className="mt-1 text-[10px] text-muted">
                      Cooperation: {result.cooperation}%
                      {index === 0 ? " · Highest score" : ""}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>

        <div className="space-y-6">
          <section className="panel p-5">
            <div className="mono text-[10px] tracking-widest text-muted">
              CONFIGURATION
            </div>
            <h2 className="mt-2 text-lg font-semibold">
              Simulation settings
            </h2>

            <div className="mt-7">
              <div className="flex items-center justify-between">
                <label htmlFor="rounds" className="text-sm">
                  Rounds per matchup
                </label>
                <span className="mono text-sm text-[var(--lime)]">
                  {rounds}
                </span>
              </div>
              <input
                id="rounds"
                type="range"
                min="10"
                max="500"
                step="10"
                value={rounds}
                onChange={(event) => setRounds(Number(event.target.value))}
                className="mt-4 w-full accent-[#b6f36a]"
              />
              <div className="mt-2 flex justify-between mono text-[9px] text-muted">
                <span>10</span>
                <span>500</span>
              </div>
            </div>

            <div className="mt-7 border-t border-[var(--border)] pt-5">
              <div className="flex items-center gap-2 text-sm">
                <Settings2 size={16} className="text-muted" />
                Fixed payoff matrix
              </div>
              <p className="mt-2 text-xs leading-5 text-muted">
                All strategies use the standard Prisoner's Dilemma payoff
                matrix.
              </p>
            </div>

            <button
              disabled={selected.length < 2}
              onClick={runSimulation}
              className="mt-7 flex w-full items-center justify-center gap-2 rounded-lg bg-[var(--lime)] px-4 py-3 text-sm font-bold text-[#101310] transition hover:bg-[#d0ff91] disabled:cursor-not-allowed disabled:opacity-40"
            >
              <Play size={15} fill="currentColor" />
              Run simulation
            </button>

            <p className="mt-3 text-center text-[10px] text-muted">
              Requires at least two strategies
            </p>
          </section>

          <section className="rounded-xl border border-[#b6f36a]/20 bg-[#b6f36a]/[0.04] p-5">
            <div className="flex items-center gap-2 text-[var(--lime)]">
              <CircleHelp size={16} />
              <span className="mono text-[10px] tracking-wider">
                HOW IT WORKS
              </span>
            </div>
            <p className="mt-3 text-xs leading-6 text-muted">
              Every selected strategy plays every other selected strategy.
              Each encounter repeats for the configured number of rounds.
              Scores are calculated using the payoff matrix.
            </p>
          </section>
        </div>
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
          {["Tournaments", "Analytics", "Theory"].includes(page) && (
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
