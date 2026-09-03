import test from "node:test";
import assert from "node:assert/strict";
import { buildShots, suggestThreshold, suggestThresholdCandidates } from "../skills/video-reference-scanner/scripts/lib/timeline.mjs";

test("preserva un ultimo plano corto en vez de borrar el corte anterior", () => {
  const { shots } = buildShots([5, 9.8], 10, 0.5);
  assert.deepEqual(shots.map((shot) => [shot.start_s, shot.end_s]), [[0, 5], [5, 9.8], [9.8, 10]]);
});

test("agrupa detecciones cercanas sin mezclar corridas", () => {
  const { shots, grouped } = buildShots([3, 3.1, 7], 10, 0.5);
  assert.equal(shots.length, 3);
  assert.deepEqual(grouped, [{ kept_at_s: 3, discarded_s: 3.1 }]);
});

test("filtra cortes invalidos y duplicados", () => {
  const { shots } = buildShots([-1, 0, 4, 4, 12, Number.NaN], 8, 0.5);
  assert.deepEqual(shots.map((shot) => shot.duration_s), [4, 4]);
});

test("sugiere un umbral desde los picos mas fuertes", () => {
  const scores = [
    { time_s: 2, score: 0.9 },
    { time_s: 5, score: 0.7 },
    { time_s: 8, score: 0.4 },
    { time_s: 10, score: 0.1 },
  ];
  assert.equal(suggestThreshold(scores, 12), 0.7);
});

test("las sugerencias adaptativas consideran la agrupacion temporal", () => {
  const scores = [
    { time_s: 1, score: 0.3 },
    { time_s: 1.1, score: 0.29 },
    { time_s: 3, score: 0.08 },
    { time_s: 5, score: 0.06 },
    { time_s: 7, score: 0.04 },
    { time_s: 9, score: 0.02 },
    { time_s: 11, score: 0.01 },
  ];
  const candidates = suggestThresholdCandidates(scores, 12, 0.5);
  assert.deepEqual(candidates.map((candidate) => candidate.mode), ["conservative", "balanced", "sensitive"]);
  assert.ok(candidates[0].threshold >= candidates[1].threshold);
  assert.ok(candidates[1].threshold >= candidates[2].threshold);
});
