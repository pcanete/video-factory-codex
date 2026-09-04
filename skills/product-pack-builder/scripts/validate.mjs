import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
import { pathToFileURL } from "node:url";

const text = (v) => typeof v === "string" && v.trim().length > 0;
const list = (v) => Array.isArray(v) ? v : [];
export function validateProductPack(pack) {
  const errors = [];
  if (pack?.contract !== "PRODUCT_PACK" || pack?.version !== "0.1.0") errors.push("PRODUCT_PACK version 0.1.0 requerido");
  if (!/^[a-z0-9][a-z0-9-]*$/.test(pack?.product_id ?? "")) errors.push("product_id invalido");
  if (!Number.isInteger(pack?.revision) || pack.revision < 1) errors.push("revision debe ser entero positivo");
  for (const k of ["display_name", "variant"]) if (!text(pack?.[k])) errors.push(k + " requerido");
  if (!["user_owned", "licensed", "pending", "unknown"].includes(pack?.ownership?.status) || !text(pack?.ownership?.evidence_note)) errors.push("ownership y evidencia requeridos");
  const states = list(pack?.states);
  if (!states.length || states.some((s) => !text(s)) || new Set(states).size !== states.length) errors.push("states debe contener estados unicos");
  const refs = list(pack?.references);
  if (!refs.length || !refs.some((r) => r?.canonical === true)) errors.push("se requiere referencia canonica");
  const refIds = new Set(refs.map((r) => r?.id));
  if (refIds.size !== refs.length) errors.push("IDs de referencia duplicados");
  for (const r of refs) {
    if (!r || ["id", "path", "role"].some((k) => !text(r[k]))) errors.push("referencia incompleta");
    if (!states.includes(r?.state)) errors.push("estado de referencia no declarado");
    if (!["supplied", "generated"].includes(r?.origin) || typeof r?.canonical !== "boolean") errors.push("origen y canonical invalidos");
    if (r?.origin === "generated" && r.canonical === true && !text(r.promotion_approval)) errors.push("referencia generada canonica requiere promotion_approval");
  }
  const locks = list(pack?.locks);
  if (!locks.length) errors.push("locks requerido");
  if (new Set(locks.map((l) => l?.id)).size !== locks.length) errors.push("IDs de locks duplicados");
  const canonical = new Set(refs.filter((r) => r?.canonical).map((r) => r.id));
  for (const lock of locks) {
    if (!text(lock?.id) || !text(lock?.requirement)) errors.push("lock incompleto");
    if (!["geometry", "color", "material", "brand", "text", "mechanism"].includes(lock?.dimension)) errors.push("dimension invalida");
    if (!["exact", "perceptual"].includes(lock?.fidelity)) errors.push("fidelity invalida");
    const ids = list(lock?.reference_ids);
    if (!ids.length || ids.some((id) => !refIds.has(id)) || new Set(ids).size !== ids.length) errors.push("lock sin referencias validas");
    if (lock?.fidelity === "exact" && !ids.some((id) => canonical.has(id))) errors.push("lock exacto requiere referencia canonica");
  }
  if (!Array.isArray(pack?.known_gaps) || pack.known_gaps.some((g) => !text(g))) errors.push("known_gaps invalido");
  if (!["draft", "approved"].includes(pack?.approval?.status)) errors.push("approval invalida");
  if (pack?.approval?.status === "approved" && (!text(pack.approval.evidence_ref) || !["user_owned", "licensed"].includes(pack?.ownership?.status))) errors.push("pack aprobado requiere evidencia y titularidad resuelta");
  if (pack?.publication?.manifest !== "private" || pack?.publication?.assets !== "private_only") errors.push("el pack real y sus activos deben ser privados");
  return errors;
}

async function main() {
  if (!process.argv[2]) throw Error("Uso: node validate.mjs PRODUCT_PACK.json");
  const pack = JSON.parse(await readFile(resolve(process.argv[2]), "utf8"));
  const errors = validateProductPack(pack);
  if (errors.length) throw Error(errors.join("\n"));
  console.log("OK: PRODUCT_PACK " + pack.product_id + " r" + pack.revision);
}
if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) main().catch((e) => { console.error(e.message); process.exitCode = 1; });
