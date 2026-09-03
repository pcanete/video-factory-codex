import test from "node:test";
import assert from "node:assert/strict";
import { buildShots, suggestThreshold } from "../skills/video-reference-scanner/scripts/lib/timeline.mjs";

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
  const scores = [{ score: 0.9 }, { score: 0.7 }, { score: 0.4 }, { score: 0.1 }];
  assert.equal(suggestThreshold(scores, 12), 0.7);
});
