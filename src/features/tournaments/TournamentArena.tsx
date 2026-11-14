
import { useMemo, useState } from "react";
import {
  Play,
  Trophy,
  Users,
  Swords,
  RotateCcw,
  ChevronDown,
  ChevronUp,
  Medal,
  Target,
  Activity,
} from "lucide-react";

import { STRATEGIES } from "../../engine/strategies";
import { runTournament } from "../../engine/tournament";
import { DEFAULT_PAYOFF } from "../../engine/payoff";

import type {
  StrategyId,
  TournamentResult,
} from "../../engine/types";

type Mode = "round-robin" | "custom";

const initialStrategies: StrategyId[] = [
  "cooperate",
  "defect",
  "tit-for-tat",
  "grim-trigger",
  "pavlov",
];

const names = Object.fromEntries(
  STRATEGIES.map((s) => [s.id, s.name])
) as Record<StrategyId, string>;

export default function TournamentArena() {
  const [mode, setMode] = useState<Mode>("round-robin");
  const [selected, setSelected] =
    useState<StrategyId[]>(initialStrategies);
  const [matchups, setMatchups] =
    useState<[StrategyId, StrategyId][]>([]);
  const [selfPlay, setSelfPlay] = useState(false);
  const [rounds, setRounds] = useState(100);
  const [repetitions, setRepetitions] = useState(5);
  const [noise, setNoise] = useState(0);
  const [seed, setSeed] = useState(48271);
  const [result, setResult] = useState<TournamentResult | null>(null);
  const [error, setError] = useState("");
  const [expandedMatch, setExpandedMatch] = useState<string | null>(null);

  const possiblePairs = useMemo(() => {
    const pairs: [StrategyId, StrategyId][] = [];

    for (let i = 0; i < selected.length; i++) {
      for (let j = i + 1; j < selected.length; j++) {
        pairs.push([selected[i], selected[j]]);
      }

      if (selfPlay) {
        pairs.push([selected[i], selected[i]]);
      }
    }

    return pairs;
  }, [selected, selfPlay]);

  const activeMatchups = mode === "round-robin"
    ? possiblePairs
    : matchups.filter(
        ([a, b]) => selected.includes(a) && selected.includes(b)
      );

  const toggleStrategy = (id: StrategyId) => {
    setSelected((previous) =>
      previous.includes(id)
        ? previous.filter((item) => item !== id)
        : [...previous, id]
    );
    setResult(null);
  };

  const toggleMatchup = (a: StrategyId, b: StrategyId) => {
    const exists = matchups.some(
      ([x, y]) =>
        (x === a && y === b) || (x === b && y === a)
    );

    setMatchups((previous) =>
      exists
        ? previous.filter(
            ([x, y]) =>
              !((x === a && y === b) || (x === b && y === a))
          )
        : [...previous, [a, b]]
    );

    setResult(null);
  };

  const executeTournament = () => {
    setError("");
    setResult(null);

    try {
      const tournament = runTournament({
        strategies: selected,
        roundsPerMatch: rounds,
        repetitions,
        payoff: DEFAULT_PAYOFF,
        noise,
        seed,
        includeSelfPlay: selfPlay,
        ...(mode === "custom"
          ? { matchups: activeMatchups }
          : {}),
      });

      setResult(tournament);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to run tournament."
      );
    }
  };

  const reset = () => {
    setResult(null);
    setError("");
    setSelected(initialStrategies);
    setMode("round-robin");
    setMatchups([]);
    setSelfPlay(false);
    setRounds(100);
    setRepetitions(5);
    setNoise(0);
    setSeed(48271);
    setExpandedMatch(null);
  };

  return (
    <div className="space-y-8">
      <div>
        <div className="mono mb-3 text-[10px] tracking-[0.2em] text-[var(--lime)]">
          COMPETITIVE SIMULATION / 001
        </div>

        <h1 className="text-3xl font-semibold tracking-tight md:text-4xl">
          Tournament arena
        </h1>

        <p className="mt-3 max-w-xl text-sm leading-6 text-muted">
          Configure strategic matchups, run competitions and
          analyse how different decision-making strategies perform.
        </p>
      </div>

      {/* Tournament mode */}
      <section className="panel p-5 md:p-6">
        <div className="mb-5 flex items-center justify-between">
          <div>
            <div className="mono text-[10px] tracking-widest text-muted">
              01 / FORMAT
            </div>
            <h2 className="mt-2 text-lg font-semibold">
              Competition format
            </h2>
          </div>
          <Swords className="text-[var(--lime)]" size={22} />
        </div>

        <div className="grid gap-3 md:grid-cols-2">
          <button
            onClick={() => {
              setMode("round-robin");
              setResult(null);
            }}
            className={`rounded-xl border p-5 text-left transition ${
              mode === "round-robin"
                ? "border-[#b6f36a]/50 bg-[#b6f36a]/5"
                : "border-[var(--border)] hover:bg-white/[0.02]"
            }`}
          >
            <div className="flex items-center justify-between">
              <Users
                size={20}
                className={mode === "round-robin" ? "text-[var(--lime)]" : "text-muted"}
              />
              <span className="mono text-[9px] text-muted">MODE 01</span>
            </div>
            <div className="mt-4 font-semibold">Round Robin</div>
            <p className="mt-2 text-xs leading-5 text-muted">
              Every selected strategy competes against every
              other selected strategy.
            </p>
          </button>

          <button
            onClick={() => {
              setMode("custom");
              setResult(null);
            }}
            className={`rounded-xl border p-5 text-left transition ${
              mode === "custom"
                ? "border-[#b6f36a]/50 bg-[#b6f36a]/5"
                : "border-[var(--border)] hover:bg-white/[0.02]"
            }`}
          >
            <div className="flex items-center justify-between">
              <Target
                size={20}
                className={mode === "custom" ? "text-[var(--lime)]" : "text-muted"}
              />
              <span className="mono text-[9px] text-muted">MODE 02</span>
            </div>
            <div className="mt-4 font-semibold">Custom matchups</div>
            <p className="mt-2 text-xs leading-5 text-muted">
              Hand-pick individual pairings and run only the
              competitions you want.
            </p>
          </button>
        </div>
      </section>

      {/* Strategy selection */}
      <section className="panel p-5 md:p-6">
        <div className="mb-5 flex items-center justify-between">
          <div>
            <div className="mono text-[10px] tracking-widest text-muted">
              02 / PARTICIPANTS
            </div>
            <h2 className="mt-2 text-lg font-semibold">
              Select strategies
            </h2>
          </div>
          <span className="mono text-xs text-[var(--lime)]">
            {selected.length} SELECTED
          </span>
        </div>

        <div className="grid gap-2 md:grid-cols-2">
          {STRATEGIES.map((strategy) => {
            const checked = selected.includes(strategy.id);

            return (
              <button
                key={strategy.id}
                onClick={() => toggleStrategy(strategy.id)}
                className={`flex items-center gap-3 rounded-lg border p-4 text-left transition ${
                  checked
                    ? "border-[#b6f36a]/30 bg-[#b6f36a]/5"
                    : "border-[var(--border)] hover:bg-white/[0.02]"
                }`}
              >
                <div
                  className={`flex h-5 w-5 items-center justify-center rounded border text-xs ${
                    checked
                      ? "border-[var(--lime)] bg-[var(--lime)] text-black"
                      : "border-[#586154]"
                  }`}
                >
                  {checked ? "✓" : ""}
                </div>

                <div className="min-w-0 flex-1">
                  <div className="text-sm font-medium">
                    {strategy.name}
                  </div>
                  <div className="mt-1 text-xs text-muted">
                    {strategy.description}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </section>

      {/* Custom matchups */}
      {mode === "custom" && (
        <section className="panel p-5 md:p-6">
          <div className="mb-5">
            <div className="mono text-[10px] tracking-widest text-muted">
              03 / MATCHUPS
            </div>
            <h2 className="mt-2 text-lg font-semibold">
              Choose your pairings
            </h2>
            <p className="mt-2 text-xs text-muted">
              Select each pairing you want to run. Unselected
              combinations will be excluded.
            </p>
          </div>

          {possiblePairs.length === 0 ? (
            <p className="text-sm text-muted">
              Select at least two strategies to create matchups.
            </p>
          ) : (
            <div className="space-y-2">
              {possiblePairs.map(([a, b]) => {
                const checked = activeMatchups.some(
                  ([x, y]) =>
                    (x === a && y === b) ||
                    (x === b && y === a)
                );

                return (
                  <button
                    key={`${a}-${b}`}
                    onClick={() => toggleMatchup(a, b)}
                    className={`flex w-full items-center gap-3 rounded-lg border p-3 text-left transition ${
                      checked
                        ? "border-[#b6f36a]/30 bg-[#b6f36a]/5"
                        : "border-[var(--border)]"
                    }`}
                  >
                    <div className="flex-1 text-sm font-medium">
                      {names[a]}
                    </div>
                    <span className="mono text-xs text-muted">VS</span>
                    <div className="flex-1 text-right text-sm font-medium">
                      {names[b]}
                    </div>
                    <span
                      className={`ml-2 h-2 w-2 rounded-full ${
                        checked ? "bg-[var(--lime)]" : "bg-[#465044]"
                      }`}
                    />
                  </button>
                );
              })}
            </div>
          )}

          <div className="mt-4 flex flex-wrap gap-3">
            <button
              onClick={() => setMatchups(possiblePairs)}
              className="text-xs font-semibold text-[var(--lime)]"
            >
              Select all
            </button>
            <button
              onClick={() => setMatchups([])}
              className="text-xs text-muted hover:text-white"
            >
              Clear selection
            </button>
          </div>

          <div className="mt-4 text-xs text-muted">
            {activeMatchups.length} matchups selected
          </div>
        </section>
      )}

      {/* Settings */}
      <section className="panel p-5 md:p-6">
        <div className="mb-6">
          <div className="mono text-[10px] tracking-widest text-muted">
            {mode === "custom" ? "04" : "03"} / PARAMETERS
          </div>
          <h2 className="mt-2 text-lg font-semibold">
            Tournament settings
          </h2>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <div>
            <div className="flex justify-between text-sm">
              <label htmlFor="rounds">Rounds per match</label>
              <span className="mono text-[var(--lime)]">
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
              onChange={(e) => {
                setRounds(Number(e.target.value));
                setResult(null);
              }}
              className="mt-4 w-full accent-[#b6f36a]"
            />
            <div className="mono mt-2 flex justify-between text-[9px] text-muted">
              <span>10</span>
              <span>500</span>
            </div>
          </div>

          <div>
            <div className="flex justify-between text-sm">
              <label htmlFor="repetitions">Match repetitions</label>
              <span className="mono text-[var(--lime)]">
                {repetitions}
              </span>
            </div>
            <input
              id="repetitions"
              type="range"
              min="1"
              max="20"
              value={repetitions}
              onChange={(e) => {
                setRepetitions(Number(e.target.value));
                setResult(null);
              }}
              className="mt-4 w-full accent-[#b6f36a]"
            />
            <div className="mono mt-2 flex justify-between text-[9px] text-muted">
              <span>1</span>
              <span>20</span>
            </div>
          </div>

          <div>
            <div className="flex justify-between text-sm">
              <label htmlFor="noise">Action noise</label>
              <span className="mono text-[var(--lime)]">
                {noise}%
              </span>
            </div>
            <input
              id="noise"
              type="range"
              min="0"
              max="50"
              value={noise}
              onChange={(e) => {
                setNoise(Number(e.target.value));
                setResult(null);
              }}
              className="mt-4 w-full accent-[#b6f36a]"
            />
            <div className="mono mt-2 flex justify-between text-[9px] text-muted">
              <span>0%</span>
              <span>50%</span>
            </div>
          </div>

          <div>
            <label htmlFor="seed" className="text-sm">
              Random seed
            </label>
            <input
              id="seed"
              type="number"
              value={seed}
              onChange={(e) => {
                setSeed(Number(e.target.value));
                setResult(null);
              }}
              className="mt-3 w-full rounded-lg border border-[var(--border)] bg-[#101310] px-3 py-2.5 text-sm text-white outline-none focus:border-[#b6f36a]"
            />
            <p className="mt-2 text-[10px] text-muted">
              Reuse a seed to reproduce an experiment.
            </p>
          </div>
        </div>

        <label className="mt-7 flex cursor-pointer items-center gap-3 border-t border-[var(--border)] pt-5">
          <input
            type="checkbox"
            checked={selfPlay}
            onChange={(e) => {
              setSelfPlay(e.target.checked);
              setResult(null);
            }}
            className="accent-[#b6f36a]"
          />
          <div>
            <div className="text-sm font-medium">Enable self-play</div>
            <div className="mt-1 text-xs text-muted">
              Allow a strategy to compete against another instance of itself.
            </div>
          </div>
        </label>
      </section>

      {/* Run */}
      <div className="flex flex-wrap items-center gap-3">
        <button
          onClick={executeTournament}
          disabled={
            selected.length < 2 ||
            (mode === "custom" && activeMatchups.length === 0)
          }
          className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-[var(--lime)] px-5 py-3.5 text-sm font-bold text-[#101310] transition hover:bg-[#d0ff91] disabled:cursor-not-allowed disabled:opacity-40 sm:flex-none"
        >
          <Play size={16} fill="currentColor" />
          Run tournament
        </button>

        <button
          onClick={reset}
          className="flex items-center gap-2 rounded-lg border border-[var(--border)] px-4 py-3.5 text-sm text-muted hover:text-white"
        >
          <RotateCcw size={15} />
          Reset
        </button>

        <div className="ml-auto mono text-[10px] text-muted">
          {activeMatchups.length * repetitions} MATCHES
        </div>
      </div>

      {error && (
        <div className="rounded-lg border border-red-500/30 bg-red-500/5 p-4 text-sm text-red-300">
          {error}
        </div>
      )}

      {/* Results */}
      {result && (
        <section className="space-y-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <div className="mono text-[10px] tracking-widest text-[var(--lime)]">
                RESULTS / COMPLETE
              </div>
              <h2 className="mt-2 text-2xl font-semibold">
                Tournament results
              </h2>
            </div>
            <div className="rounded-full border border-[#b6f36a]/20 px-3 py-2 mono text-[9px] text-[var(--lime)]">
              {result.matches.length} MATCHES COMPLETED
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-3">
            <div className="panel p-4">
              <Trophy size={18} className="text-[var(--lime)]" />
              <div className="mt-4 mono text-[9px] text-muted">
                WINNING STRATEGY
              </div>
              <div className="mt-2 text-sm font-semibold">
                {names[result.standings[0].strategyId]}
              </div>
            </div>

            <div className="panel p-4">
              <Activity size={18} className="text-[var(--lime)]" />
              <div className="mt-4 mono text-[9px] text-muted">
                TOTAL ROUNDS
              </div>
              <div className="mono mt-2 text-xl">
                {result.totalRounds.toLocaleString()}
              </div>
            </div>

            <div className="panel p-4">
              <Users size={18} className="text-[var(--lime)]" />
              <div className="mt-4 mono text-[9px] text-muted">
                PARTICIPANTS
              </div>
              <div className="mono mt-2 text-xl">
                {result.standings.length}
              </div>
            </div>
          </div>

          {/* Leaderboard */}
          <div className="panel overflow-hidden">
            <div className="border-b border-[var(--border)] p-5">
              <h3 className="font-semibold">Leaderboard</h3>
              <p className="mt-1 text-xs text-muted">
                Ranked by cumulative score across all matchups.
              </p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full min-w-[600px] text-left text-sm">
                <thead className="bg-white/[0.02] mono text-[9px] tracking-wider text-muted">
                  <tr>
                    <th className="p-4">RANK</th>
                    <th className="p-4">STRATEGY</th>
                    <th className="p-4">SCORE</th>
                    <th className="p-4">W / D / L</th>
                    <th className="p-4">COOPERATION</th>
                  </tr>
                </thead>

                <tbody>
                  {result.standings.map((standing, index) => (
                    <tr
                      key={standing.strategyId}
                      className="border-t border-[var(--border)]"
                    >
                      <td className="p-4">
                        <span className="mono text-[var(--lime)]">
                          {String(index + 1).padStart(2, "0")}
                        </span>
                      </td>
                      <td className="p-4 font-medium">
                        {names[standing.strategyId]}
                      </td>
                      <td className="p-4 mono">
                        {standing.totalScore.toLocaleString()}
                      </td>
                      <td className="p-4 mono text-xs text-muted">
                        {standing.wins} / {standing.draws} / {standing.losses}
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <div className="h-1.5 w-16 overflow-hidden rounded-full bg-[#293029]">
                            <div
                              className="h-full bg-[var(--lime)]"
                              style={{
                                width: `${standing.cooperationRate * 100}%`,
                              }}
                            />
                          </div>
                          <span className="mono text-xs">
                            {(standing.cooperationRate * 100).toFixed(1)}%
                          </span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Match history */}
          <div className="panel overflow-hidden">
            <div className="border-b border-[var(--border)] p-5">
              <h3 className="font-semibold">Match explorer</h3>
              <p className="mt-1 text-xs text-muted">
                Expand a match to inspect every decision and its payoff.
              </p>
            </div>

            <div className="divide-y divide-[var(--border)]">
              {result.matches.map((match, index) => {
                const expanded = expandedMatch === match.id;

                return (
                  <div key={match.id}>
                    <button
                      onClick={() =>
                        setExpandedMatch(expanded ? null : match.id)
                      }
                      className="flex w-full items-center gap-3 p-4 text-left hover:bg-white/[0.02]"
                    >
                      <span className="mono text-[10px] text-muted">
                        #{String(index + 1).padStart(3, "0")}
                      </span>

                      <div className="min-w-0 flex-1">
                        <div className="text-xs font-medium">
                          {names[match.strategyA]}{" "}
                          <span className="text-muted">vs</span>{" "}
                          {names[match.strategyB]}
                        </div>
                        <div className="mt-1 mono text-[9px] text-muted">
                          {match.rounds.length} ROUNDS
                        </div>
                      </div>

                      <div className="mono text-xs text-[var(--lime)]">
                        {match.totalScoreA} : {match.totalScoreB}
                      </div>

                      {expanded ? (
                        <ChevronUp size={15} className="text-muted" />
                      ) : (
                        <ChevronDown size={15} className="text-muted" />
                      )}
                    </button>

                    {expanded && (
                      <div className="overflow-x-auto border-t border-[var(--border)] bg-black/10 p-4">
                        <table className="w-full min-w-[460px] text-xs">
                          <thead className="mono text-[9px] text-muted">
                            <tr>
                              <th className="p-2 text-left">ROUND</th>
                              <th className="p-2 text-left">PLAYER A</th>
                              <th className="p-2 text-left">PLAYER B</th>
                              <th className="p-2 text-right">PAYOFF A</th>
                              <th className="p-2 text-right">PAYOFF B</th>
                            </tr>
                          </thead>
                          <tbody>
                            {match.rounds.map((round) => (
                              <tr
                                key={round.round}
                                className="border-t border-[var(--border)]"
                              >
                                <td className="p-2 mono text-muted">
                                  {round.round}
                                </td>
                                <td className="p-2">
                                  <span
                                    className={
                                      round.actionA === "C"
                                        ? "text-[var(--lime)]"
                                        : "text-red-300"
                                    }
                                  >
                                    {round.actionA === "C"
                                      ? "Cooperate"
                                      : "Defect"}
                                  </span>
                                </td>
                                <td className="p-2">
                                  <span
                                    className={
                                      round.actionB === "C"
                                        ? "text-[var(--lime)]"
                                        : "text-red-300"
                                    }
                                  >
                                    {round.actionB === "C"
                                      ? "Cooperate"
                                      : "Defect"}
                                  </span>
                                </td>
                                <td className="p-2 text-right mono">
                                  {round.scoreA}
                                </td>
                                <td className="p-2 text-right mono">
                                  {round.scoreB}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
