import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { validateCharacterPack } from "../skills/character-pack-builder/scripts/validate.mjs";
import { validateShotPlan } from "../skills/shot-plan-builder/scripts/validate.mjs";
import { validateKeyframeTest } from "../skills/keyframe-test-builder/scripts/validate.mjs";

const readFixture = async (path) => JSON.parse(await readFile(new URL(path, import.meta.url), "utf8"));

test("el keyframe sintetico resuelve plano, personaje y referencias", async () => {
  const pack = await readFixture("../skills/character-pack-builder/fixtures/character-pack.synthetic.json");
  const plan = await readFixture("../skills/shot-plan-builder/fixtures/shot-plan.synthetic.json");
  const keyframe = await readFixture("../skills/keyframe-test-builder/fixtures/keyframe-test.synthetic.json");
  assert.deepEqual(validateCharacterPack(pack), []);
  assert.deepEqual(validateShotPlan(plan, [pack]), []);
  assert.deepEqual(validateKeyframeTest(keyframe, plan, [pack]), []);
});

test("rechaza aprobar automaticamente un keyframe", async () => {
  const keyframe = await readFixture("../skills/keyframe-test-builder/fixtures/keyframe-test.synthetic.json");
  keyframe.gate.candidate_status = "approved";
  assert.match(validateKeyframeTest(keyframe, null, []).join("\n"), /human_decision approved/);
});
