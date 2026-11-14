
export type Action = "C" | "D";

export type StrategyId =
  | "cooperate"
  | "defect"
  | "tit-for-tat"
  | "grim-trigger"
  | "pavlov"
  | "random"
  | "generous-tit-for-tat";

export interface PayoffMatrix {
  temptation: number;
  reward: number;
  punishment: number;
  sucker: number;
}

export interface MatchRound {
  round: number;
  actionA: Action;
  actionB: Action;
  scoreA: number;
  scoreB: number;
  cumulativeA: number;
  cumulativeB: number;
}

export interface StrategyContext {
  ownHistory: Action[];
  opponentHistory: Action[];
  ownLastScore: number | null;
  opponentLastScore: number | null;
  round: number;
  random: () => number;
}

export interface StrategyDefinition {
  id: StrategyId;
  name: string;
  description: string;
  category: string;
  chooseAction: (context: StrategyContext) => Action;
}

export interface MatchResult {
  id: string;
  strategyA: StrategyId;
  strategyB: StrategyId;
  rounds: MatchRound[];
  totalScoreA: number;
  totalScoreB: number;
  cooperationA: number;
  cooperationB: number;
  winner: StrategyId | "draw";
}

export interface TournamentConfig {
  strategies: StrategyId[];
  roundsPerMatch: number;
  repetitions: number;
  payoff: PayoffMatrix;
  noise: number;
  seed: number;
  includeSelfPlay: boolean;

  // If supplied, only these matchups are executed.
  // Otherwise, the engine generates a round robin.
  matchups?: [StrategyId, StrategyId][];
}

export interface StrategyStanding {
  strategyId: StrategyId;
  totalScore: number;
  matchesPlayed: number;
  wins: number;
  draws: number;
  losses: number;
  cooperations: number;
  defections: number;
  averageScore: number;
  cooperationRate: number;
  winRate: number;
}

export interface TournamentResult {
  id: string;
  config: TournamentConfig;
  matches: MatchResult[];
  standings: StrategyStanding[];
  totalRounds: number;
  completedAt: string;
}
