
import type {
  Action,
  StrategyContext,
  StrategyDefinition,
  StrategyId,
} from "./types";

const cooperate = (): Action => "C";
const defect = (): Action => "D";

function titForTat(context: StrategyContext): Action {
  if (context.opponentHistory.length === 0) {
    return "C";
  }

  return context.opponentHistory.at(-1)!;
}

function grimTrigger(context: StrategyContext): Action {
  return context.opponentHistory.includes("D") ? "D" : "C";
}

function pavlov(context: StrategyContext): Action {
  if (context.round === 0) {
    return "C";
  }

  const previousAction = context.ownHistory.at(-1)!;
  const previousScore = context.ownLastScore!;

  // Win-stay, lose-shift.
  return previousScore >= 3
    ? previousAction
    : previousAction === "C"
      ? "D"
      : "C";
}

function randomStrategy(context: StrategyContext): Action {
  return context.random() < 0.5 ? "C" : "D";
}

function generousTitForTat(context: StrategyContext): Action {
  if (context.opponentHistory.length === 0) {
    return "C";
  }

  const lastOpponentAction = context.opponentHistory.at(-1)!;

  if (lastOpponentAction === "C") {
    return "C";
  }

  // 10% chance of forgiving the opponent.
  return context.random() < 0.1 ? "C" : "D";
}

export const STRATEGIES: StrategyDefinition[] = [
  {
    id: "cooperate",
    name: "Always Cooperate",
    description: "Always chooses cooperation, regardless of the opponent.",
    category: "Baseline",
    chooseAction: cooperate,
  },
  {
    id: "defect",
    name: "Always Defect",
    description: "Always defects, attempting to exploit cooperation.",
    category: "Baseline",
    chooseAction: defect,
  },
  {
    id: "tit-for-tat",
    name: "Tit for Tat",
    description: "Starts cooperatively and copies the opponent's last move.",
    category: "Reciprocal",
    chooseAction: titForTat,
  },
  {
    id: "grim-trigger",
    name: "Grim Trigger",
    description: "Cooperates until the opponent defects once.",
    category: "Retaliatory",
    chooseAction: grimTrigger,
  },
  {
    id: "pavlov",
    name: "Pavlov",
    description: "Repeats successful actions and switches after failure.",
    category: "Adaptive",
    chooseAction: pavlov,
  },
  {
    id: "random",
    name: "Random",
    description: "Chooses between cooperation and defection randomly.",
    category: "Unpredictable",
    chooseAction: randomStrategy,
  },
  {
    id: "generous-tit-for-tat",
    name: "Generous Tit for Tat",
    description: "Copies the opponent but occasionally forgives defection.",
    category: "Reciprocal",
    chooseAction: generousTitForTat,
  },
];

export function getStrategy(
  id: StrategyId
): StrategyDefinition {
  const strategy = STRATEGIES.find((item) => item.id === id);

  if (!strategy) {
    throw new Error(`Unknown strategy: ${id}`);
  }

  return strategy;
}
