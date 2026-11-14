
import type { Action, PayoffMatrix } from "./types";

export const DEFAULT_PAYOFF: PayoffMatrix = {
  temptation: 5,
  reward: 3,
  punishment: 1,
  sucker: 0,
};

export function calculatePayoff(
  actionA: Action,
  actionB: Action,
  matrix: PayoffMatrix
): [number, number] {
  if (actionA === "C" && actionB === "C") {
    return [matrix.reward, matrix.reward];
  }

  if (actionA === "D" && actionB === "C") {
    return [matrix.temptation, matrix.sucker];
  }

  if (actionA === "C" && actionB === "D") {
    return [matrix.sucker, matrix.temptation];
  }

  return [matrix.punishment, matrix.punishment];
}

export function validatePayoff(
  matrix: PayoffMatrix
): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  const values = Object.values(matrix);

  if (!values.every(Number.isFinite)) {
    errors.push("All payoff values must be finite numbers.");
  }

  if (!values.every((value) => value >= 0)) {
    errors.push("Payoff values cannot be negative.");
  }

  const { temptation: T, reward: R, punishment: P, sucker: S } = matrix;

  if (!(T > R && R > P && P > S)) {
    errors.push(
      "Classic Prisoner's Dilemma requires T > R > P > S."
    );
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}
