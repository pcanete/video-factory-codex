#!/usr/bin/env node

import { readFileSync } from "node:fs";

export function validateShotPlan(plan, characterPacks = []) {
  const errors = [];
  if (plan?.contract !== "SHOT_PLAN") errors.push("contract debe ser SHOT_PLAN");
  if (plan?.version !== "0.1.0") errors.push("version debe ser 0.1.0");
  if (!/^[a-z0-9][a-z0-9-]*$/.test(plan?.piece_id || "")) errors.push("piece_id invalido");
  if (!(plan?.duration_target_s > 0)) errors.push("duration_target_s debe ser positiva");
  if (!["horizontal", "vertical", "square"].includes(plan?.orientation)) errors.push("orientation invalida");
  if (!Array.isArray(plan?.shots) || plan.shots.length === 0) errors.push("shots no puede estar vacio");
  const characterIds = Array.isArray(plan?.character_pack_refs) ? plan.character_pack_refs : [];
  const productIds = Array.isArray(plan?.product_pack_refs) ? plan.product_pack_refs : [];
  if (!Array.isArray(plan?.character_pack_refs) || (plan?.product_pack_refs !== undefined && !Array.isArray(plan.product_pack_refs))) errors.push("listas de packs invalidas");
  if (!characterIds.length && !productIds.length) errors.push("se requiere pack de personaje o producto");

  const shots = Array.isArray(plan?.shots) ? plan.shots : [];
  const duration = shots.reduce((sum, shot) => sum + Number(shot.duration_s || 0), 0);
  if (Math.abs(duration - Number(plan?.duration_target_s || 0)) > 0.01) errors.push(`las duraciones suman ${duration}, no ${plan?.duration_target_s}`);
  shots.forEach((shot, position) => {
    if (shot.index !== position + 1) errors.push(`shot ${position + 1}: index fuera de secuencia`);
    for (const field of ["narrative_function", "subject", "action", "framing", "camera", "light", "environment", "style", "keyframe_brief", "transition_out", "audio_role", "risk", "success_criteria"]) {
      if (!shot[field]) errors.push(`shot ${shot.index || position + 1}: falta ${field}`);
    }
    if (!Array.isArray(shot.identity_refs) || (shot.product_refs !== undefined && !Array.isArray(shot.product_refs))) errors.push("listas de referencias invalidas");
    if (!(shot.identity_refs?.length || shot.product_refs?.length)) errors.push(`shot ${shot.index || position + 1}: falta identity_refs o product_refs`);
    if (shot.product_refs?.length && !productIds.length) errors.push("product_refs requiere product_pack_refs");
    if (shot.identity_refs?.length && !characterIds.length) errors.push("identity_refs requiere character_pack_refs");
  });

  const gates = new Set(plan?.human_gates || []);
  for (const gate of ["concept_approval", "keyframe_approval", "clip_approval"]) {
    if (!gates.has(gate)) errors.push(`falta human gate ${gate}`);
  }
  if (!Array.isArray(plan?.reference_grammar?.do_not_copy) || plan.reference_grammar.do_not_copy.length === 0) errors.push("reference_grammar.do_not_copy no puede estar vacio");

  if (characterPacks.length) {
    const packsById = new Map(characterPacks.map((pack) => [pack.character_id, pack]));
    for (const packId of plan?.character_pack_refs || []) {
      if (!packsById.has(packId)) errors.push(`character pack no encontrado: ${packId}`);
    }
    const selected = characterPacks.filter((pack) => characterIds.includes(pack.character_id));
    const referenceIds = new Set(selected.flatMap((pack) =>
      ["canonical", "provisional", "stress_test"].flatMap((group) => pack?.reference_groups?.[group] || []).map((reference) => reference.id)
    ));
    for (const shot of shots) {
      for (const referenceId of shot.identity_refs || []) {
        if (!referenceIds.has(referenceId)) errors.push(`shot ${shot.index}: identity_ref no existe en los packs: ${referenceId}`);
      }
    }
    const productsById = new Map(characterPacks.filter((p) => p.contract === "PRODUCT_PACK").map((p) => [p.product_id, p]));
    for (const id of productIds) if (!productsById.has(id)) errors.push("product pack no encontrado: " + id);
    const productRefs = new Set(productIds.flatMap((id) => productsById.get(id)?.references ?? []).map((r) => r.id));
    for (const shot of shots) for (const id of shot.product_refs ?? []) if (!productRefs.has(id)) errors.push("product_ref no existe en los packs: " + id);
  }
  return errors;
}

if (process.argv[1]?.endsWith("validate.mjs")) {
  const file = process.argv[2];
  if (!file) {
    console.error("uso: node validate.mjs <SHOT_PLAN.json>");
    process.exit(2);
  }
  const characterPackFiles = process.argv.slice(3);
  const plan = JSON.parse(readFileSync(file, "utf8"));
  const characterPacks = characterPackFiles.map((characterPackFile) => JSON.parse(readFileSync(characterPackFile, "utf8")));
  const errors = validateShotPlan(plan, characterPacks);
  if (errors.length) {
    console.error(errors.join("\n"));
    process.exit(1);
  }
  console.log(`OK: SHOT_PLAN ${plan.piece_id} (${plan.shots.length} planos, ${plan.duration_target_s}s)`);
}
