
import type {
  Action,
  MatchResult,
  PayoffMatrix,
  StrategyId,
} from "./types";

import { calculatePayoff } from "./payoff";
import { getStrategy } from "./strategies";
import { createId, createRandom } from "./random";

export interface SimulationOptions {
  strategyA: StrategyId;
  strategyB: StrategyId;
  rounds: number;
  payoff: PayoffMatrix;
  noise?: number;
  seed: number;
}

function applyNoise(
  action: Action,
  noise: number,
  random: () => number
): Action {
  if (random() >= noise) {
    return action;
  }

  return action === "C" ? "D" : "C";
}

export function simulateMatch(
  options: SimulationOptions
): MatchResult {
  const {
    strategyA,
    strategyB,
    rounds,
    payoff,
    noise = 0,
    seed,
  } = options;

  if (!Number.isInteger(rounds) || rounds < 1) {
    throw new Error("Rounds must be a positive integer.");
  }

  if (!Number.isFinite(noise) || noise < 0 || noise > 1) {
    throw new Error("Noise must be between 0 and 1.");
  }

  const playerA = getStrategy(strategyA);
  const playerB = getStrategy(strategyB);
  const random = createRandom(seed);

  const historyA: Action[] = [];
  const historyB: Action[] = [];

  const roundsHistory = [];

  let totalScoreA = 0;
  let totalScoreB = 0;
  let cooperationA = 0;
  let cooperationB = 0;

  for (let round = 0; round < rounds; round++) {
    const contextA = {
      ownHistory: [...historyA],
      opponentHistory: [...historyB],
      ownLastScore:
        roundsHistory.length > 0
          ? roundsHistory[round - 1].scoreA
          : null,
      opponentLastScore:
        roundsHistory.length > 0
          ? roundsHistory[round - 1].scoreB
          : null,
      round,
      random,
    };

    const contextB = {
      ownHistory: [...historyB],
      opponentHistory: [...historyA],
      ownLastScore:
        roundsHistory.length > 0
          ? roundsHistory[round - 1].scoreB
          : null,
      opponentLastScore:
        roundsHistory.length > 0
          ? roundsHistory[round - 1].scoreA
          : null,
      round,
      random,
    };

    // Decide simultaneously using the previous round's history.
    const intendedA = playerA.chooseAction(contextA);
    const intendedB = playerB.chooseAction(contextB);

    const actionA = applyNoise(intendedA, noise, random);
    const actionB = applyNoise(intendedB, noise, random);

    const [scoreA, scoreB] = calculatePayoff(
      actionA,
      actionB,
      payoff
    );

    totalScoreA += scoreA;
    totalScoreB += scoreB;

    if (actionA === "C") cooperationA++;
    if (actionB === "C") cooperationB++;

    historyA.push(actionA);
    historyB.push(actionB);

    roundsHistory.push({
      round: round + 1,
      actionA,
      actionB,
      scoreA,
      scoreB,
      cumulativeA: totalScoreA,
      cumulativeB: totalScoreB,
    });
  }

  return {
    id: createId("match"),
    strategyA,
    strategyB,
    rounds: roundsHistory,
    totalScoreA,
    totalScoreB,
    cooperationA,
    cooperationB,
    winner:
      totalScoreA > totalScoreB
        ? strategyA
        : totalScoreB > totalScoreA
          ? strategyB
          : "draw",
  };
}
