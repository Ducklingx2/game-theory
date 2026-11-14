
export function createRandom(seed: number): () => number {
  let state = Math.abs(Math.floor(seed)) % 2147483647;

  if (state === 0) {
    state = 1;
  }

  return () => {
    state = (state * 16807) % 2147483647;
    return (state - 1) / 2147483646;
  };
}

export function createId(prefix = "sim"): string {
  return `${prefix}-${Date.now()}-${Math.random()
    .toString(36)
    .slice(2, 9)}`;
}
