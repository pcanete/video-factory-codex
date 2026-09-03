const round = (value, digits = 3) => Number(value.toFixed(digits));

export function buildShots(cuts, duration, minShot = 0.5) {
  if (!(duration > 0)) throw new Error("duration debe ser positiva");
  if (!(minShot >= 0)) throw new Error("minShot no puede ser negativo");

  const valid = [...new Set(cuts.filter((time) => Number.isFinite(time) && time > 0 && time < duration))]
    .sort((a, b) => a - b);
  const boundaries = [0];
  const grouped = [];

  for (const cut of valid) {
    const previous = boundaries.at(-1);
    if (cut - previous < minShot) {
      grouped.push({ kept_at_s: round(previous), discarded_s: round(cut) });
      continue;
    }
    boundaries.push(cut);
  }
  boundaries.push(duration);

  const shots = [];
  for (let index = 0; index < boundaries.length - 1; index++) {
    const start = boundaries[index];
    const end = boundaries[index + 1];
    shots.push({
      index: index + 1,
      start_s: round(start),
      end_s: round(end),
      duration_s: round(end - start),
    });
  }
  return { shots, grouped };
}

export function suggestThreshold(scores, duration) {
  if (!scores.length || !(duration > 0)) return null;
  const desiredCuts = Math.max(1, Math.round(duration / 4) - 1);
  const sorted = [...scores].sort((a, b) => b.score - a.score);
  return round(sorted[Math.min(desiredCuts - 1, sorted.length - 1)].score, 4);
}
