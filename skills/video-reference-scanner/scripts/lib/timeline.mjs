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

export function suggestThreshold(scores, duration, minShot = 0.5, targetShotSeconds = 4) {
  if (!scores.length || !(duration > 0) || !(targetShotSeconds > 0)) return null;
  const candidates = [...new Set(scores.map((item) => item.score).filter((score) => Number.isFinite(score) && score > 0))]
    .sort((a, b) => b - a);
  if (!candidates.length) return null;

  const desiredShots = Math.max(2, Math.round(duration / targetShotSeconds));
  let best = null;
  for (const threshold of candidates) {
    const cuts = scores.filter((item) => item.score >= threshold).map((item) => item.time_s);
    const shotCount = buildShots(cuts, duration, minShot).shots.length;
    const distance = Math.abs(shotCount - desiredShots);
    if (!best || distance < best.distance || (distance === best.distance && threshold > best.threshold)) {
      best = { threshold, distance };
    }
  }
  return round(best.threshold, 4);
}

export function suggestThresholdCandidates(scores, duration, minShot = 0.5) {
  return [
    { mode: "conservative", target_shot_s: 4 },
    { mode: "balanced", target_shot_s: 2.5 },
    { mode: "sensitive", target_shot_s: 1.5 },
  ].map((candidate) => ({
    ...candidate,
    threshold: suggestThreshold(scores, duration, minShot, candidate.target_shot_s),
  }));
}
