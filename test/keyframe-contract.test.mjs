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

const candidate = () => readFixture("../skills/keyframe-test-builder/fixtures/keyframe-test.synthetic.json");

test("aprobacion humana no borra una marca fallida ni una identidad pendiente", async () => {
  for (const status of ["fail", "review", "unknown"]) {
    const keyframe = await candidate();
    keyframe.gate = { candidate_status: "approved", human_decision: "approved", next_action: "Animate" };
    keyframe.evaluation = [
      { dimension: "composition", status: "pass", note: "Compared to shot plan" },
      { dimension: "brand", status, note: "Lettering does not match the reference" }
    ];
    assert.ok(validateKeyframeTest(keyframe).length > 0, status);
  }
});

test("aprobar requiere evidencia aplicable, no solo checks no aplicables", async () => {
  const keyframe = await candidate();
  keyframe.gate = { candidate_status: "approved", human_decision: "approved", next_action: "Animate" };
  keyframe.evaluation = [{ dimension: "brand", status: "not_applicable", note: "No brand in the brief" }];
  assert.ok(validateKeyframeTest(keyframe).length > 0);
  keyframe.evaluation.push({ dimension: "identity", status: "pass", note: " " });
  assert.ok(validateKeyframeTest(keyframe).length > 0);
  keyframe.evaluation[1].note = "Compared to the approved front reference";
  assert.deepEqual(validateKeyframeTest(keyframe), []);
});

test("ancla final con checks aprobados conserva rol sin sustituir el inicial", async () => {
  const keyframe = await candidate();
  keyframe.frame_role = "end";
  keyframe.gate = { candidate_status: "approved", human_decision: "approved", next_action: "Validate pair" };
  keyframe.evaluation = [{ dimension: "identity", status: "pass", note: "Compared with canonical reference" }];
  assert.deepEqual(validateKeyframeTest(keyframe), []);
  assert.equal(keyframe.frame_role, "end");
  keyframe.frame_role = "middle";
  assert.ok(validateKeyframeTest(keyframe).length > 0);
});

test("un candidato pendiente puede conservar defectos documentados para revision", async () => {
  const keyframe = await candidate();
  keyframe.evaluation = [{ dimension: "brand", status: "fail", note: "Needs correction before approval" }];
  assert.deepEqual(validateKeyframeTest(keyframe), []);
});
