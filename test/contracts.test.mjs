import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

import { validateCharacterPack } from "../skills/character-pack-builder/scripts/validate.mjs";
import { validateShotPlan } from "../skills/shot-plan-builder/scripts/validate.mjs";

const characterFixture = JSON.parse(readFileSync(new URL("../skills/character-pack-builder/fixtures/character-pack.synthetic.json", import.meta.url), "utf8"));
const shotFixture = JSON.parse(readFileSync(new URL("../skills/shot-plan-builder/fixtures/shot-plan.synthetic.json", import.meta.url), "utf8"));

test("el character pack sintetico cumple los invariantes publicos", () => {
  assert.deepEqual(validateCharacterPack(characterFixture), []);
});

test("rechaza referencias duplicadas entre grupos", () => {
  const invalid = structuredClone(characterFixture);
  invalid.reference_groups.provisional.push(structuredClone(invalid.reference_groups.canonical[0]));
  assert.ok(validateCharacterPack(invalid).some((error) => error.includes("unicos")));
});

test("el shot plan sintetico cumple los invariantes publicos", () => {
  assert.deepEqual(validateShotPlan(shotFixture, [characterFixture]), []);
});

test("rechaza una duracion contractual que no coincide con los planos", () => {
  const invalid = structuredClone(shotFixture);
  invalid.duration_target_s = 99;
  assert.ok(validateShotPlan(invalid).some((error) => error.includes("duraciones")));
});

test("rechaza referencias de plano ausentes del character pack", () => {
  const invalid = structuredClone(shotFixture);
  invalid.shots[0].identity_refs = ["missing-angle"];
  assert.ok(validateShotPlan(invalid, [characterFixture]).some((error) => error.includes("no existe")));
});
