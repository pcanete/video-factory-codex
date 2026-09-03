import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

import { validateSequenceContinuity } from "../skills/sequence-continuity-builder/scripts/validate.mjs";

const fixture = JSON.parse(readFileSync(new URL("../skills/sequence-continuity-builder/fixtures/sequence-continuity.synthetic.json", import.meta.url), "utf8"));

test("la continuidad sintetica cumple el contrato", () => {
  assert.deepEqual(validateSequenceContinuity(fixture), []);
});

test("rechaza una discontinuidad no declarada entre beats", () => {
  const invalid = structuredClone(fixture);
  invalid.beats[1].state_before.notebook.closure = "open";
  assert.ok(validateSequenceContinuity(invalid).some((error) => error.includes("discontinuidad no declarada")));
});

test("acepta una elipsis declarada explicitamente", () => {
  const valid = structuredClone(fixture);
  valid.beats[1].state_before.notebook.closure = "open";
  valid.beats[1].state_after.notebook.closure = "open";
  valid.beats[2].state_before.notebook.closure = "open";
  valid.beats[2].state_after.notebook.closure = "open";
  valid.beats[1].continuity_breaks = [{ entity_id: "notebook", attribute: "closure", reason: "authored time jump" }];
  assert.ok(!validateSequenceContinuity(valid).some((error) => error.includes("discontinuidad no declarada")));
});

test("rechaza entidades visibles que no existen", () => {
  const invalid = structuredClone(fixture);
  invalid.beats[0].visible_entities.push("missing-prop");
  assert.ok(validateSequenceContinuity(invalid).some((error) => error.includes("entidad visible no declarada")));
});

test("rechaza acciones cuyo from no coincide con el estado inicial", () => {
  const invalid = structuredClone(fixture);
  invalid.beats[0].actions[0].changes[0].from = "off-camera";
  assert.ok(validateSequenceContinuity(invalid).some((error) => error.includes("parte de")));
});

test("rechaza un cambio de estado sin accion declarada", () => {
  const invalid = structuredClone(fixture);
  invalid.beats[0].state_after.notebook.closure = "open";
  assert.ok(validateSequenceContinuity(invalid).some((error) => error.includes("cambio sin accion")));
});
