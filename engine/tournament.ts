
import type {
  StrategyId,
  StrategyStanding,
  TournamentConfig,
  TournamentResult,
} from "./types";

import { simulateMatch } from "./simulation";
import { validatePayoff } from "./payoff";
import { createId } from "./random";

export function runTournament(
  config: TournamentConfig
): TournamentResult {
  const {
    strategies,
    roundsPerMatch,
    repetitions,
    payoff,
    noise,
    seed,
    includeSelfPlay,
  } = config;

  if (strategies.length < 2) {
    throw new Error("Select at least two strategies.");
  }

  if (new Set(strategies).size !== strategies.length) {
    throw new Error("Strategies must be unique.");
  }

  if (
    !Number.isInteger(repetitions) ||
    repetitions < 1 ||
    repetitions > 1000
  ) {
    throw new Error("Repetitions must be between 1 and 1000.");
  }

  if (!Number.isInteger(roundsPerMatch) || roundsPerMatch < 1) {
    throw new Error("Rounds per match must be positive.");
  }

  if (!Number.isFinite(noise) || noise < 0 || noise > 1) {
    throw new Error("Noise must be between 0 and 1.");
  }

  const validation = validatePayoff(payoff);

  if (!validation.valid) {
    throw new Error(validation.errors.join(" "));
  }

  const standings = new Map<StrategyId, StrategyStanding>();

  for (const id of strategies) {
    standings.set(id, {
      strategyId: id,
      totalScore: 0,
      matchesPlayed: 0,
      wins: 0,
      draws: 0,
      losses: 0,
      cooperations: 0,
      defections: 0,
      averageScore: 0,
      cooperationRate: 0,
      winRate: 0,
    });
  }

  const matches = [];
  let matchNumber = 0;

  for (let i = 0; i < strategies.length; i++) {
    const start = includeSelfPlay ? i : i + 1;

    for (let j = start; j < strategies.length; j++) {
      for (let repetition = 0; repetition < repetitions; repetition++) {
        const strategyA = strategies[i];
        const strategyB = strategies[j];

        const match = simulateMatch({
          strategyA,
          strategyB,
          rounds: roundsPerMatch,
          payoff,
          noise,
          seed: seed + matchNumber * 7919,
        });

        matches.push(match);
        matchNumber++;

        const a = standings.get(strategyA)!;
        const b = standings.get(strategyB)!;

        a.totalScore += match.totalScoreA;
        b.totalScore += match.totalScoreB;

        a.matchesPlayed++;
        b.matchesPlayed++;

        a.cooperations += match.cooperationA;
        b.cooperations += match.cooperationB;

        a.defections += roundsPerMatch - match.cooperationA;
        b.defections += roundsPerMatch - match.cooperationB;

        if (match.winner === strategyA) {
          a.wins++;
          b.losses++;
        } else if (match.winner === strategyB) {
          b.wins++;
          a.losses++;
        } else {
          a.draws++;
          b.draws++;
        }
      }
    }
  }

  const finalStandings = Array.from(standings.values())
    .map((standing) => ({
      ...standing,
      averageScore:
        standing.matchesPlayed > 0
          ? standing.totalScore /
            (standing.matchesPlayed * roundsPerMatch)
          : 0,
      cooperationRate:
        standing.cooperations + standing.defections > 0
          ? standing.cooperations /
            (standing.cooperations + standing.defections)
          : 0,
      winRate:
        standing.matchesPlayed > 0
          ? standing.wins / standing.matchesPlayed
          : 0,
    }))
    .sort((a, b) => {
      if (b.totalScore !== a.totalScore) {
        return b.totalScore - a.totalScore;
      }

      return b.winRate - a.winRate;
    });

  return {
    id: createId("tournament"),
    config: { ...config, strategies: [...strategies] },
    matches,
    standings: finalStandings,
    totalRounds: matches.length * roundsPerMatch,
    completedAt: new Date().toISOString(),
  };
}
