import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
import { pathToFileURL } from "node:url";

const text = (v) => typeof v === "string" && v.trim().length > 0;
const list = (v) => Array.isArray(v) ? v : [];
const record = (v) => v !== null && typeof v === "object" && !Array.isArray(v);
function canonical(v) {
  if (Array.isArray(v)) return v.map(canonical);
  if (record(v)) return Object.fromEntries(Object.keys(v).sort().map((k) => [k, canonical(v[k])]));
  return v;
}
function contextErrors(c) {
  const errors = [];
  for (const k of ["provider", "model", "channel", "recipe_revision", "scope_revision"]) if (!text(c?.[k])) errors.push("context." + k + " requerido");
  if (!record(c?.entity_revisions) || !Object.keys(c.entity_revisions).length || Object.entries(c.entity_revisions).some(([id, rev]) => !text(id) || !text(rev))) errors.push("context.entity_revisions requerido");
  return errors;
}
export function validateConsistencyTest(test, currentContext) {
  const errors = [];
  if (test?.contract !== "CONSISTENCY_TEST" || test?.version !== "0.1.0") errors.push("CONSISTENCY_TEST version 0.1.0 requerido");
  if (!text(test?.test_id)) errors.push("test_id requerido");
  errors.push(...contextErrors(test?.context));
  if (!["planned", "candidate", "approved", "rejected"].includes(test?.status)) errors.push("status invalido");
  if (!Array.isArray(test?.limitations) || test.limitations.some((v) => !text(v))) errors.push("limitations requerido");
  const cases = list(test?.cases);
  if (!cases.length) errors.push("cases no puede estar vacio");
  if (new Set(cases.map((c) => c?.id)).size !== cases.length) errors.push("IDs de casos duplicados");
  const entities = record(test?.context?.entity_revisions) ? Object.keys(test.context.entity_revisions) : [];
  const covered = new Set();
  for (const c of cases) {
    if (!text(c?.id) || !text(c?.condition)) errors.push("caso incompleto");
    const subjects = list(c?.entity_ids);
    if (!subjects.length || new Set(subjects).size !== subjects.length || subjects.some((s) => !entities.includes(s))) errors.push("entidades del caso no resueltas");
    subjects.forEach((s) => covered.add(s));
    if (!["image", "video"].includes(c?.media_kind)) errors.push("media_kind invalido");
    if (!["not_applicable", "not_reviewed", "sampled", "full"].includes(c?.temporal_review)) errors.push("temporal_review invalido");
    if (c?.media_kind === "image" && c.temporal_review !== "not_applicable") errors.push("una imagen no tiene revision temporal");
    const checks = list(c?.checks);
    if (!checks.length || !checks.some((x) => x?.critical === true)) errors.push("cada caso requiere un check critico");
    if (new Set(checks.map((x) => x?.dimension)).size !== checks.length) errors.push("dimensiones duplicadas en caso");
    for (const check of checks) {
      if (!text(check?.dimension) || !text(check?.note) || typeof check?.critical !== "boolean") errors.push("check incompleto");
      if (!["pass", "fail", "review", "not_applicable"].includes(check?.status)) errors.push("estado de check invalido");
      if (check?.status === "pass" && (!text(check.evidence_ref) || !text(c?.output_ref))) errors.push("pass requiere salida y evidencia");
      if (["motion", "contact", "continuity"].includes(check?.dimension) && check.status === "pass" && (c?.media_kind !== "video" || c.temporal_review !== "full")) errors.push("movimiento/contacto/continuidad no se prueban con imagen o muestreo parcial");
      if (test?.status === "approved" && check?.critical && check.status !== "pass") errors.push("aprobacion bloqueada por check critico no resuelto");
    }
    if (test?.status === "approved") {
      if (!text(c?.output_ref)) errors.push("caso aprobado sin salida");
      if (c?.media_kind === "video" && c.temporal_review !== "full") errors.push("video aprobado requiere revision temporal full");
      if (checks.some((x) => !x?.critical && ["fail", "review"].includes(x?.status)) && !list(test?.limitations).length) errors.push("pendientes no criticos requieren limitaciones declaradas");
    }
  }
  if (entities.some((s) => !covered.has(s))) errors.push("entidad sin caso de prueba");
  if (test?.status === "approved" && !text(test?.approval_ref)) errors.push("approved requiere approval_ref");
  if (currentContext !== undefined) {
    errors.push(...contextErrors(currentContext).map((e) => "current " + e));
    if (JSON.stringify(canonical(test?.context)) !== JSON.stringify(canonical(currentContext))) errors.push("contexto cambiado: reevaluar vigencia, no reutilizar aprobacion");
  }
  return errors;
}
export function canReuseConsistencyTest(test, currentContext) {
  return currentContext !== undefined && test?.status === "approved" && validateConsistencyTest(test, currentContext).length === 0;
}
async function main() {
  const [file, current] = process.argv.slice(2);
  if (!file) throw Error("Uso: node validate.mjs CONSISTENCY_TEST.json [CURRENT_CONTEXT.json]");
  const test = JSON.parse(await readFile(resolve(file), "utf8"));
  const context = current ? JSON.parse(await readFile(resolve(current), "utf8")) : undefined;
  const errors = validateConsistencyTest(test, context);
  if (errors.length) throw Error(errors.join("\n"));
  console.log("OK: CONSISTENCY_TEST " + test.test_id + " (" + test.status + ")");
}
if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) main().catch((e) => { console.error(e.message); process.exitCode = 1; });
