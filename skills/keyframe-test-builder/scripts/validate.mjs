import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
import { pathToFileURL } from "node:url";

export function validateKeyframeTest(test, shotPlan, characterPacks = []) {
  const errors = [];
  if (test?.contract !== "KEYFRAME_TEST") errors.push("contract debe ser KEYFRAME_TEST");
  if (!Number.isInteger(test?.shot_index) || test.shot_index < 1) errors.push("shot_index debe ser un entero positivo");
  if (!Array.isArray(test?.character_pack_refs) || test.character_pack_refs.length === 0) errors.push("character_pack_refs no puede estar vacio");
  if (!Array.isArray(test?.reference_ids) || test.reference_ids.length === 0) errors.push("reference_ids no puede estar vacio");
  if (new Set(test?.reference_ids ?? []).size !== (test?.reference_ids ?? []).length) errors.push("reference_ids contiene duplicados");
  if (!test?.generation?.prompt?.trim()) errors.push("generation.prompt es obligatorio");
  if (!test?.generation?.negative_prompt?.trim()) errors.push("generation.negative_prompt es obligatorio");
  if (!Array.isArray(test?.evaluation) || test.evaluation.length === 0) errors.push("evaluation no puede estar vacio");
  if (test?.gate?.candidate_status === "approved" && test?.gate?.human_decision !== "approved") errors.push("un candidato aprobado requiere human_decision approved");

  if (shotPlan) {
    if (shotPlan.contract !== "SHOT_PLAN") errors.push("el archivo de planos no es SHOT_PLAN");
    if (test.shot_plan_ref !== shotPlan.piece_id) errors.push(`shot_plan_ref no coincide con ${shotPlan.piece_id}`);
    const shot = shotPlan.shots?.find((item) => item.index === test.shot_index);
    if (!shot) errors.push(`shot_index ${test.shot_index} no existe en el shot plan`);
    else {
      const shotRefs = new Set(shot.identity_refs ?? []);
      for (const id of test.reference_ids ?? []) if (!shotRefs.has(id)) errors.push(`reference_id ${id} no fue declarado por el plano ${test.shot_index}`);
    }
  }

  const packsById = new Map(characterPacks.map((pack) => [pack.character_id, pack]));
  for (const packId of test?.character_pack_refs ?? []) {
    const pack = packsById.get(packId);
    if (!pack) {
      if (characterPacks.length) errors.push(`character pack no resuelto: ${packId}`);
      continue;
    }
    const available = new Set(Object.values(pack.reference_groups ?? {}).flat().map((item) => item.id));
    for (const id of test.reference_ids ?? []) if (!available.has(id)) errors.push(`reference_id ausente del character pack ${packId}: ${id}`);
  }
  return errors;
}

async function readJson(path) {
  return JSON.parse(await readFile(resolve(path), "utf8"));
}

async function main() {
  const [testPath, shotPlanPath, ...packPaths] = process.argv.slice(2);
  if (!testPath) throw new Error("Uso: node validate.mjs KEYFRAME_TEST.json [SHOT_PLAN.json] [CHARACTER_PACK.json ...]");
  const test = await readJson(testPath);
  const shotPlan = shotPlanPath ? await readJson(shotPlanPath) : null;
  const packs = await Promise.all(packPaths.map(readJson));
  const errors = validateKeyframeTest(test, shotPlan, packs);
  if (errors.length) {
    console.error(errors.join("\n"));
    process.exitCode = 1;
    return;
  }
  console.log(`OK: KEYFRAME_TEST ${test.test_id} (${test.gate.human_decision})`);
}

if (import.meta.url === pathToFileURL(process.argv[1]).href) main().catch((error) => {
  console.error(error.message);
  process.exitCode = 1;
});
