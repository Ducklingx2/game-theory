
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
    matchups,
  } = config;

  if (strategies.length < 2) {
    throw new Error("Select at least two strategies.");
  }

  if (new Set(strategies).size !== strategies.length) {
    throw new Error("Strategies must be unique.");
  }

  if (!Number.isInteger(roundsPerMatch) || roundsPerMatch < 1) {
    throw new Error("Rounds per matchup must be positive.");
  }

  if (
    !Number.isInteger(repetitions) ||
    repetitions < 1 ||
    repetitions > 1000
  ) {
    throw new Error("Repetitions must be between 1 and 1000.");
  }

  if (!Number.isFinite(noise) || noise < 0 || noise > 1) {
    throw new Error("Noise must be between 0 and 1.");
  }

  const validation = validatePayoff(payoff);

  if (!validation.valid) {
    throw new Error(validation.errors.join(" "));
  }

  const pairings: [StrategyId, StrategyId][] =
    matchups ?? strategies.flatMap((a, i) =>
      strategies.slice(includeSelfPlay ? i : i + 1).map(
        (b) => [a, b] as [StrategyId, StrategyId]
      )
    );

  if (pairings.length === 0) {
    throw new Error("Select at least one matchup.");
  }

  const seen = new Set<string>();

  for (const [a, b] of pairings) {
    if (!strategies.includes(a) || !strategies.includes(b)) {
      throw new Error("A matchup contains an unselected strategy.");
    }

    if (a === b && !includeSelfPlay) {
      throw new Error("Enable self-play to include self-matchups.");
    }

    const key = [a, b].sort().join(":");

    if (seen.has(key)) {
      throw new Error("Duplicate matchup detected.");
    }

    seen.add(key);
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

  for (const [strategyA, strategyB] of pairings) {
    for (let repetition = 0; repetition < repetitions; repetition++) {
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
      a.cooperations += match.cooperationA;
      a.defections += roundsPerMatch - match.cooperationA;

      if (strategyA === strategyB) {
        // A self-play encounter is one match, not two.
        a.totalScore += match.totalScoreB;
        a.cooperations += match.cooperationB;
        a.defections += roundsPerMatch - match.cooperationB;
        a.matchesPlayed++;
        continue;
      }

      b.totalScore += match.totalScoreB;
      b.cooperations += match.cooperationB;
      b.defections += roundsPerMatch - match.cooperationB;

      a.matchesPlayed++;
      b.matchesPlayed++;

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

  const finalStandings = Array.from(standings.values())
    .map((standing) => {
      const totalActions =
        standing.cooperations + standing.defections;

      return {
        ...standing,
        averageScore:
          standing.matchesPlayed > 0
            ? standing.totalScore /
              (standing.matchesPlayed * roundsPerMatch)
            : 0,
        cooperationRate:
          totalActions > 0
            ? standing.cooperations / totalActions
            : 0,
        winRate:
          standing.matchesPlayed > 0
            ? standing.wins / standing.matchesPlayed
            : 0,
      };
    })
    .sort((a, b) => b.totalScore - a.totalScore);

  return {
    id: createId("tournament"),
    config: {
      ...config,
      strategies: [...strategies],
      matchups: pairings.map(([a, b]) => [a, b]),
    },
    matches,
    standings: finalStandings,
    totalRounds: matches.length * roundsPerMatch,
    completedAt: new Date().toISOString(),
  };
}
