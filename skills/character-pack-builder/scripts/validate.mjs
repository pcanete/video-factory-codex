#!/usr/bin/env node

import { readFileSync } from "node:fs";

export function validateCharacterPack(pack) {
  const errors = [];
  if (pack?.contract !== "CHARACTER_PACK") errors.push("contract debe ser CHARACTER_PACK");
  if (pack?.version !== "0.1.0") errors.push("version debe ser 0.1.0");
  if (!/^[a-z0-9][a-z0-9-]*$/.test(pack?.character_id || "")) errors.push("character_id invalido");
  if (!pack?.display_name) errors.push("falta display_name");
  if (!["synthetic_character", "real_person", "mixed", "unknown"].includes(pack?.nature)) errors.push("nature invalido");
  if (!pack?.ownership?.status || !pack?.ownership?.evidence_note) errors.push("ownership incompleto");

  const groups = pack?.reference_groups || {};
  if (!Array.isArray(groups.canonical) || groups.canonical.length === 0) errors.push("falta al menos una referencia canonical");
  for (const name of ["canonical", "provisional", "stress_test"]) {
    if (!Array.isArray(groups[name])) errors.push(`reference_groups.${name} debe ser array`);
  }

  const references = ["canonical", "provisional", "stress_test"].flatMap((name) => Array.isArray(groups[name]) ? groups[name] : []);
  const ids = references.map((reference) => reference.id);
  if (new Set(ids).size !== ids.length) errors.push("los ids de referencia deben ser unicos");
  for (const reference of references) {
    if (!reference.id || !reference.path || !reference.role || !reference.provenance) errors.push(`referencia incompleta: ${reference.id || "sin-id"}`);
  }

  for (const lock of ["face", "hair", "body", "wardrobe", "hands"]) {
    if (!pack?.identity_locks?.[lock]) errors.push(`falta identity_locks.${lock}`);
  }
  if (!Array.isArray(pack?.forbidden_drift) || pack.forbidden_drift.length === 0) errors.push("forbidden_drift no puede estar vacio");
  if (pack?.publication?.assets !== "private_only") errors.push("publication.assets debe ser private_only");
  return errors;
}
if (process.argv[1]?.endsWith("validate.mjs")) {
  const file = process.argv[2];
  if (!file) {
    console.error("uso: node validate.mjs <CHARACTER_PACK.json>");
    process.exit(2);
  }
  const pack = JSON.parse(readFileSync(file, "utf8"));
  const errors = validateCharacterPack(pack);
  if (errors.length) {
    console.error(errors.join("\n"));
    process.exit(1);
  }
  console.log(`OK: CHARACTER_PACK ${pack.character_id} (${pack.reference_groups.canonical.length} referencias canonicas)`);
}
