import { useMemo, useState } from "react";
import {
  Activity,
  Play,
  RotateCcw,
  Download,
  FlaskConical,
  Shield,
  Target,
} from "lucide-react";
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { STRATEGIES } from "../../engine/strategies";
import { simulateMatch } from "../../engine/simulation";
import { DEFAULT_PAYOFF } from "../../engine/payoff";
import type { MatchResult, StrategyId } from "../../engine/types";

const initialA: StrategyId = "tit-for-tat";
const initialB: StrategyId = "always-defect";

export default function ExperimentLab() {
  const [strategyA, setStrategyA] = useState<StrategyId>(initialA);
  const [strategyB, setStrategyB] = useState<StrategyId>(initialB);
  const [rounds, setRounds] = useState(100);
  const [noise, setNoise] = useState(0);
  const [seed, setSeed] = useState(48271);
  const [result, setResult] = useState<MatchResult | null>(null);
  const [error, setError] = useState("");

  const strategyNames = useMemo(
    () =>
      Object.fromEntries(
        STRATEGIES.map((strategy) => [strategy.id, strategy.name])
      ) as Record<StrategyId, string>,
    []
  );

  const chartData = useMemo(
    () =>
      result?.rounds.map((round) => ({
        round: round.round,
        [strategyNames[result.strategyA]]: round.cumulativeA,
        [strategyNames[result.strategyB]]: round.cumulativeB,
      })) ?? [],
    [result, strategyNames]
  );

  function runExperiment() {
    setError("");

    try {
      if (!Number.isInteger(rounds) || rounds < 1 || rounds > 5000) {
        throw new Error("Rounds must be between 1 and 5,000.");
      }

      if (!Number.isSafeInteger(seed)) {
        throw new Error("Enter a valid integer seed.");
      }

      const nextResult = simulateMatch({
        strategyA,
        strategyB,
        rounds,
        payoff: DEFAULT_PAYOFF,
        noise: noise / 100,
        seed,
      });

      setResult(nextResult);
    } catch (err) {
      setResult(null);
      setError(
        err instanceof Error ? err.message : "The experiment could not run."
      );
    }
  }

  function reset() {
    setStrategyA(initialA);
    setStrategyB(initialB);
    setRounds(100);
    setNoise(0);
    setSeed(48271);
    setResult(null);
    setError("");
  }

  function exportCSV() {
    if (!result) return;

    const rows = [
      ["Round", "Action A", "Action B", "Score A", "Score B", "Total A", "Total B"],
      ...result.rounds.map((round) => [
        round.round,
        round.actionA === "C" ? "Cooperate" : "Defect",
        round.actionB === "C" ? "Cooperate" : "Defect",
        round.scoreA,
        round.scoreB,
        round.cumulativeA,
        round.cumulativeB,
      ]),
    ];

    const csv = rows.map((row) => row.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = "game-theory-experiment.csv";
    link.click();

    URL.revokeObjectURL(url);
  }

  const winner =
    result === null
      ? null
      : result.winner === "draw"
        ? "Draw"
        : strategyNames[result.winner];

  const cooperationA = result
    ? result.cooperationA / result.rounds.length
    : 0;

  const cooperationB = result
    ? result.cooperationB / result.rounds.length
    : 0;

  return (
    <div className="space-y-8">
      <div>
        <div className="mono mb-3 text-[10px] tracking-[0.2em] text-[var(--lime)]">
          SIMULATION ENVIRONMENT / 001
        </div>
        <h1 className="text-3xl font-semibold tracking-tight md:text-4xl">
          Experiment lab
        </h1>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-muted">
          Configure a strategic interaction, run the simulation, and inspect
          how decisions shape the outcome over time.
        </p>
      </div>

      <div className="grid gap-5 xl:grid-cols-[0.8fr_1.2fr]">
        <section className="panel space-y-6 p-5 md:p-6">
          <div>
            <div className="mono text-[10px] tracking-widest text-muted">
              01 / PARTICIPANTS
            </div>
            <h2 className="mt-2 text-lg font-semibold">Choose strategies</h2>
          </div>

          <div>
            <label
              htmlFor="strategy-a"
              className="mb-2 block text-xs text-muted"
            >
              Player A
            </label>
            <select
              id="strategy-a"
              value={strategyA}
              onChange={(event) => {
                setStrategyA(event.target.value as StrategyId);
                setResult(null);
              }}
              className="w-full rounded-lg border border-[var(--border)] bg-[#101310] px-3 py-3 text-sm text-white outline-none focus:border-[var(--lime)]"
            >
              {STRATEGIES.map((strategy) => (
                <option key={strategy.id} value={strategy.id}>
                  {strategy.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label
              htmlFor="strategy-b"
              className="mb-2 block text-xs text-muted"
            >
              Player B
            </label>
            <select
              id="strategy-b"
              value={strategyB}
              onChange={(event) => {
                setStrategyB(event.target.value as StrategyId);
                setResult(null);
              }}
              className="w-full rounded-lg border border-[var(--border)] bg-[#101310] px-3 py-3 text-sm text-white outline-none focus:border-[var(--lime)]"
            >
              {STRATEGIES.map((strategy) => (
                <option key={strategy.id} value={strategy.id}>
                  {strategy.name}
                </option>
              ))}
            </select>
          </div>

          <div className="border-t border-[var(--border)] pt-5">
            <div className="mono text-[10px] tracking-widest text-muted">
              02 / PARAMETERS
            </div>
            <h2 className="mt-2 text-lg font-semibold">Simulation settings</h2>
          </div>

          <div>
            <div className="flex justify-between text-sm">
              <label htmlFor="experiment-rounds">Rounds</label>
              <span className="mono text-[var(--lime)]">{rounds}</span>
            </div>
            <input
              id="experiment-rounds"
              type="range"
              min="10"
              max="500"
              step="10"
              value={rounds}
              onChange={(event) => {
                setRounds(Number(event.target.value));
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
              <label htmlFor="experiment-noise">Action noise</label>
              <span className="mono text-[var(--lime)]">{noise}%</span>
            </div>
            <input
              id="experiment-noise"
              type="range"
              min="0"
              max="50"
              value={noise}
              onChange={(event) => {
                setNoise(Number(event.target.value));
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
            <label
              htmlFor="experiment-seed"
              className="block text-sm"
            >
              Random seed
            </label>
            <input
              id="experiment-seed"
              type="number"
              value={seed}
              onChange={(event) => {
                setSeed(Number(event.target.value));
                setResult(null);
              }}
              className="mt-2 w-full rounded-lg border border-[var(--border)] bg-[#101310] px-3 py-3 text-sm text-white outline-none focus:border-[var(--lime)]"
            />
            <p className="mt-2 text-[10px] text-muted">
              Use the same seed and settings to reproduce a run.
            </p>
          </div>

          <div className="flex flex-wrap gap-3 border-t border-[var(--border)] pt-5">
            <button
              onClick={runExperiment}
              className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-[var(--lime)] px-4 py-3 text-sm font-bold text-[#101310] hover:bg-[#d0ff91]"
            >
              <Play size={15} fill="currentColor" />
              Run experiment
            </button>
            <button
              onClick={reset}
              className="flex items-center gap-2 rounded-lg border border-[var(--border)] px-4 py-3 text-sm text-muted hover:text-white"
            >
              <RotateCcw size={15} />
              Reset
            </button>
          </div>

          {error && (
            <div className="rounded-lg border border-red-500/30 bg-red-500/5 p-3 text-sm text-red-300">
              {error}
            </div>
          )}
        </section>

        <section className="space-y-5">
          <div className="panel grid-bg flex min-h-[260px] flex-col items-center justify-center p-8 text-center">
            <div className="mb-5 flex items-center gap-5">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-[#b6f36a]/30 bg-[#b6f36a]/10 text-[var(--lime)]">
                <Shield size={24} />
              </div>
              <div className="mono text-xs text-muted">VS</div>
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-[#79b9e9]/30 bg-[#79b9e9]/10 text-[#79b9e9]">
                <Target size={24} />
              </div>
            </div>
            <div className="text-lg font-semibold">
              {strategyNames[strategyA]} <span className="text-muted">vs</span>{" "}
              {strategyNames[strategyB]}
            </div>
            <p className="mt-2 max-w-sm text-xs leading-5 text-muted">
              {rounds} rounds · {noise}% action noise · Seed {seed}
            </p>
            {!result && (
              <p className="mt-5 mono text-[9px] tracking-widest text-muted">
                CONFIGURE YOUR EXPERIMENT TO BEGIN
              </p>
            )}
          </div>

          {result ? (
            <>
              <div className="grid gap-3 sm:grid-cols-3">
                <div className="panel p-4">
                  <div className="mono text-[9px] tracking-widest text-muted">
                    WINNER
                  </div>
                  <div className="mt-3 text-base font-semibold text-[var(--lime)]">
                    {winner}
                  </div>
                </div>
                <div className="panel p-4">
                  <div className="mono text-[9px] tracking-widest text-muted">
                    PLAYER A SCORE
                  </div>
                  <div className="mono mt-3 text-2xl">
                    {result.totalScoreA.toLocaleString()}
                  </div>
                </div>
                <div className="panel p-4">
                  <div className="mono text-[9px] tracking-widest text-muted">
                    PLAYER B SCORE
                  </div>
                  <div className="mono mt-3 text-2xl">
                    {result.totalScoreB.toLocaleString()}
                  </div>
                </div>
              </div>

              <div className="panel p-5">
                <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <div className="mono text-[9px] tracking-widest text-muted">
                      PERFORMANCE / CUMULATIVE
                    </div>
                    <h3 className="mt-2 font-semibold">
                      Score progression
                    </h3>
                  </div>
                  <button
                    onClick={exportCSV}
                    className="flex items-center gap-2 rounded-lg border border-[var(--border)] px-3 py-2 text-xs text-muted hover:text-white"
                  >
                    <Download size={14} />
                    Export CSV
                  </button>
                </div>

                <div className="h-[280px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={chartData}>
                      <CartesianGrid
                        stroke="#293029"
                        strokeDasharray="3 3"
                      />
                      <XAxis
                        dataKey="round"
                        stroke="#879186"
                        tick={{ fontSize: 10 }}
                      />
                      <YAxis
                        stroke="#879186"
                        tick={{ fontSize: 10 }}
                      />
                      <Tooltip
                        contentStyle={{
                          background: "#171b17",
                          border: "1px solid #293029",
                          borderRadius: 8,
                          color: "#eef2e9",
                          fontSize: 12,
                        }}
                      />
                      <Legend wrapperStyle={{ fontSize: 11 }} />
                      <Line
                        type="monotone"
                        dataKey={strategyNames[strategyA]}
                        stroke="#b6f36a"
                        strokeWidth={2}
                        dot={false}
                      />
                      <Line
                        type="monotone"
                        dataKey={strategyNames[strategyB]}
                        stroke="#79b9e9"
                        strokeWidth={2}
                        dot={false}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="panel p-5">
                <div className="mb-4 flex items-center gap-2">
                  <Activity size={17} className="text-[var(--lime)]" />
                  <h3 className="font-semibold">Behaviour analysis</h3>
                </div>
                <div className="space-y-4">
                  {[
                    {
                      name: strategyNames[strategyA],
                      rate: cooperationA,
                      color: "bg-[var(--lime)]",
                    },
                    {
                      name: strategyNames[strategyB],
                      rate: cooperationB,
                      color: "bg-[#79b9e9]",
                    },
                  ].map((item) => (
                    <div key={item.name}>
                      <div className="mb-2 flex justify-between text-xs">
                        <span>{item.name}</span>
                        <span className="mono text-muted">
                          {(item.rate * 100).toFixed(1)}% cooperation
                        </span>
                      </div>
                      <div className="h-2 overflow-hidden rounded-full bg-[#293029]">
                        <div
                          className={`h-full ${item.color}`}
                          style={{ width: `${item.rate * 100}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
                <p className="mt-5 text-xs leading-5 text-muted">
                  Cooperation rate measures the proportion of rounds in which
                  each player chose to cooperate. Action noise can cause the
                  executed action to differ from the strategy's intended choice.
                </p>
              </div>
            </>
          ) : (
            <div className="panel flex min-h-[180px] flex-col items-center justify-center p-8 text-center">
              <FlaskConical size={24} className="text-muted" />
              <h3 className="mt-4 text-sm font-semibold">
                Your results will appear here
              </h3>
              <p className="mt-2 max-w-sm text-xs leading-5 text-muted">
                Run the experiment to see cumulative scores, cooperation rates,
                and how the strategies perform against each other.
              </p>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
