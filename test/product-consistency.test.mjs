import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { validateProductPack } from "../skills/product-pack-builder/scripts/validate.mjs";
import { validateConsistencyTest, canReuseConsistencyTest } from "../skills/consistency-test-builder/scripts/validate.mjs";
import { validateShotPlan } from "../skills/shot-plan-builder/scripts/validate.mjs";
import { validateKeyframeTest } from "../skills/keyframe-test-builder/scripts/validate.mjs";
import { routeHiggsfield } from "../skills/higgsfield-router/scripts/route.mjs";

const fixture = async (path) => JSON.parse(await readFile(new URL("../skills/" + path, import.meta.url), "utf8"));
const product = () => fixture("product-pack-builder/fixtures/product-pack.synthetic.json");
const consistency = () => fixture("consistency-test-builder/fixtures/consistency-test.synthetic.json");
async function approvedTest() {
  const t = await consistency();
  t.status = "approved";
  t.approval_ref = "synthetic-review-receipt";
  t.limitations = [];
  for (const c of t.cases) {
    c.output_ref = "https://example.invalid/" + c.id;
    if (c.media_kind === "video") c.temporal_review = "full";
    for (const check of c.checks) {
      check.status = "pass";
      check.evidence_ref = "synthetic-evidence/" + c.id;
    }
  }
  return t;
}

test("producto sintetico declara variante, marca, estados y privacidad", async () => {
  assert.deepEqual(validateProductPack(await product()), []);
});
test("no se promociona un derivado generado a canonico sin decision", async () => {
  const p = await product();
  p.references[0].origin = "generated";
  assert.ok(validateProductPack(p).length > 0);
  p.references[0].promotion_approval = "synthetic-explicit-approval";
  assert.deepEqual(validateProductPack(p), []);
});
test("producto rechaza referencias ambiguas, estados inexistentes y locks sin fuente", async () => {
  for (const mutate of [
    (p) => p.references.push(structuredClone(p.references[0])),
    (p) => p.references[0].state = "unknown-state",
    (p) => p.locks[0].reference_ids = ["missing"],
    (p) => p.references[1].canonical = false,
    (p) => p.variant = "",
    (p) => p.publication.assets = "public"
  ]) {
    const p = await product(); mutate(p);
    assert.ok(validateProductPack(p).length > 0);
  }
});
test("pack aprobado requiere evidencia de decision y derechos resueltos", async () => {
  const p = await product();
  p.approval.status = "approved";
  assert.ok(validateProductPack(p).length > 0);
  p.approval.evidence_ref = "synthetic-user-decision";
  assert.deepEqual(validateProductPack(p), []);
  p.ownership.status = "unknown";
  assert.ok(validateProductPack(p).length > 0);
});
test("plan de consistencia no concede reutilizacion", async () => {
  const t = await consistency();
  assert.deepEqual(validateConsistencyTest(t), []);
  assert.equal(canReuseConsistencyTest(t, t.context), false);
});
test("prueba aprobada solo se reutiliza con contexto actual completo", async () => {
  const t = await approvedTest();
  assert.deepEqual(validateConsistencyTest(t, t.context), []);
  assert.equal(canReuseConsistencyTest(t, t.context), true);
  assert.equal(canReuseConsistencyTest(t), false);
  const reordered = Object.fromEntries(Object.entries(t.context).reverse());
  assert.equal(canReuseConsistencyTest(t, reordered), true);
  for (const field of ["provider", "model", "channel", "recipe_revision", "scope_revision"]) {
    const ctx = structuredClone(t.context); ctx[field] += "-changed";
    assert.equal(canReuseConsistencyTest(t, ctx), false, field);
  }
  const ctx = structuredClone(t.context); ctx.entity_revisions["sample-flask"] = "r2";
  assert.equal(canReuseConsistencyTest(t, ctx), false);
});
test("aprobacion no borra fallo, pendiente, no aplicable critico ni evidencia ausente", async () => {
  for (const mutate of [
    (t) => t.cases[0].checks[0].status = "fail",
    (t) => t.cases[0].checks[0].status = "review",
    (t) => t.cases[0].checks[0].status = "not_applicable",
    (t) => delete t.cases[0].checks[0].evidence_ref,
    (t) => delete t.cases[0].output_ref,
    (t) => delete t.approval_ref
  ]) {
    const t = await approvedTest(); mutate(t);
    assert.equal(canReuseConsistencyTest(t, t.context), false);
  }
});
test("fotograma o muestreo parcial no certifica movimiento completo", async () => {
  const t = await approvedTest();
  t.cases[1].temporal_review = "sampled";
  assert.ok(validateConsistencyTest(t).length > 0);
  t.cases[1].media_kind = "image";
  t.cases[1].temporal_review = "not_applicable";
  assert.ok(validateConsistencyTest(t).length > 0);
});
test("todas las entidades necesitan caso y las referencias de sujeto deben existir", async () => {
  const t = await consistency();
  t.context.entity_revisions["uncovered-person"] = "r1";
  assert.ok(validateConsistencyTest(t).length > 0);
  delete t.context.entity_revisions["uncovered-person"];
  t.cases[0].entity_ids = ["not-in-context"];
  assert.ok(validateConsistencyTest(t).length > 0);
});
test("una limitacion secundaria no queda escondida al aprobar", async () => {
  const t = await approvedTest();
  t.cases[0].checks.push({ dimension: "background", critical: false, status: "review", note: "Background outside identity scope" });
  assert.ok(validateConsistencyTest(t).length > 0);
  t.limitations = ["Background not approved; this test only covers flask identity."];
  assert.deepEqual(validateConsistencyTest(t), []);
});
test("validadores nuevos reportan entradas incompletas sin lanzar excepciones", () => {
  for (const value of [null, {}, [], { references: [null], locks: [null] }, { cases: [null] }]) {
    assert.ok(validateProductPack(value).length > 0);
    assert.ok(validateConsistencyTest(value).length > 0);
  }
});

async function productPlan() {
  const p = await fixture("shot-plan-builder/fixtures/shot-plan.synthetic.json");
  p.character_pack_refs = [];
  p.product_pack_refs = ["sample-flask"];
  for (const shot of p.shots) {
    shot.subject = "Fictional sample flask";
    shot.identity_refs = [];
    shot.product_refs = ["flask-front", "flask-label"];
  }
  return p;
}
test("plan y keyframe de producto no requieren inventar un personaje", async () => {
  const pack = await product(), plan = await productPlan();
  assert.deepEqual(validateShotPlan(plan, [pack]), []);
  const k = await fixture("keyframe-test-builder/fixtures/keyframe-test.synthetic.json");
  k.character_pack_refs = [];
  k.product_pack_refs = [pack.product_id];
  k.reference_ids = ["flask-front"];
  assert.deepEqual(validateKeyframeTest(k, plan, [pack]), []);
  k.reference_ids = ["missing-angle"];
  assert.ok(validateKeyframeTest(k, plan, [pack]).length > 0);
  plan.shots[0].product_refs = ["missing"];
  assert.ok(validateShotPlan(plan, [pack]).length > 0);
});
test("persona con producto resuelve referencias de ambos packs sin exigirlas en cada uno", async () => {
  const pack = await product();
  const person = await fixture("character-pack-builder/fixtures/character-pack.synthetic.json");
  const plan = await fixture("shot-plan-builder/fixtures/shot-plan.synthetic.json");
  plan.product_pack_refs = [pack.product_id];
  plan.shots[0].product_refs = ["flask-front"];
  const k = await fixture("keyframe-test-builder/fixtures/keyframe-test.synthetic.json");
  k.product_pack_refs = [pack.product_id];
  k.reference_ids.push("flask-front");
  assert.deepEqual(validateShotPlan(plan, [person, pack]), []);
  assert.deepEqual(validateKeyframeTest(k, plan, [person, pack]), []);
  k.product_pack_refs = [];
  assert.ok(validateKeyframeTest(k, plan, [person, pack]).length > 0);
});
test("Cinema con solo producto conserva binding y no autoriza generacion", async () => {
  const r = await fixture("higgsfield-router/fixtures/higgsfield-routing-request.synthetic.json");
  r.intent = "cinematic_sequence";
  r.inputs = { product_pack_ref: "private-assets/flask.json", shot_plan_ref: "plan.json", sequence_continuity_ref: "continuity.json" };
  const route = routeHiggsfield(r);
  assert.deepEqual(route.missing_inputs, []);
  assert.equal(route.artifact_bindings.products, r.inputs.product_pack_ref);
  assert.equal(route.artifact_bindings.character, null);
  assert.ok(route.execution.handoff.uploads.some((u) => u.role === "product_identity"));
  assert.equal(route.execution.create_args, null);
  assert.equal(route.authorization.approved, false);
});
