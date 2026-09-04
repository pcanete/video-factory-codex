import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { routeHiggsfield, validateRoutingRequest } from "../skills/higgsfield-router/scripts/route.mjs";

const fixture = async () => JSON.parse(await readFile(new URL("../skills/higgsfield-router/fixtures/higgsfield-routing-request.synthetic.json", import.meta.url), "utf8"));

test("marketing video usa el job_type vivo y conserva la puerta de gasto", async () => {
  const request = await fixture();
  assert.deepEqual(validateRoutingRequest(request), []);
  const route = routeHiggsfield(request);
  assert.equal(route.workflow.id, "marketing_studio_video");
  assert.equal(route.workflow.channel, "cli");
  assert.deepEqual(route.execution.model_get_args, ["model", "get", "marketing_studio_video"]);
  assert.equal(route.execution.cost_args, null);
  assert.equal(route.execution.create_args, null);
  assert.equal(route.authorization.approved, false);
  assert.equal(route.status, "ready_for_provider_compilation");
});

test("motion transfer prepara Genjutsu web y exige video mas identidad", async () => {
  const request = await fixture();
  request.intent = "motion_transfer";
  request.inputs.reference_video = "private-assets/reference.mp4";
  const route = routeHiggsfield(request);
  assert.equal(route.workflow.id, "genjutsu_motion_transfer");
  assert.equal(route.workflow.channel, "web");
  assert.equal(route.workflow.job_type, null);
  assert.equal(route.missing_inputs.length, 0);
  assert.equal(route.execution.handoff.uploads[0].role, "source_video");
  assert.equal(route.status, "ready_for_web_handoff");
});

test("Cinema Studio se bloquea si faltan contratos de planos y continuidad", async () => {
  const request = await fixture();
  request.intent = "cinematic_sequence";
  delete request.inputs.shot_plan_ref;
  delete request.inputs.sequence_continuity_ref;
  const route = routeHiggsfield(request);
  assert.deepEqual(route.missing_inputs, ["shot_plan_ref", "sequence_continuity_ref"]);
  assert.equal(route.status, "blocked_missing_inputs");
});

test("un preset viral requiere nombre y referencia visual", async () => {
  const request = await fixture();
  request.intent = "viral_effect";
  request.inputs.preset_name = "Orbit 360";
  const route = routeHiggsfield(request);
  assert.equal(route.workflow.id, "viral_presets");
  assert.deepEqual(route.missing_inputs, []);
  assert.equal(route.execution.handoff.configuration.preset_name, "Orbit 360");
});

test("rechaza intents fuera del contrato", async () => {
  const request = await fixture();
  request.intent = "magic_button";
  assert.match(validateRoutingRequest(request).join("\n"), /intent no soportado/);
  assert.throws(() => routeHiggsfield(request), /intent no soportado/);
});

test("las nueve intenciones tienen una ruta explícita y nunca generan", async () => {
  const expected = {
    motion_transfer: ["genjutsu_motion_transfer", "web"],
    element_swap: ["genjutsu_object_swap", "web"],
    cinematic_sequence: ["cinema_studio_4_0", "web"],
    marketing_video: ["marketing_studio_video", "cli"],
    viral_effect: ["viral_presets", "web"],
    video_edit: ["seedance_2_5_video_edit", "cli"],
    ad_variants: ["ad_multiplier", "cli"],
    virality_analysis: ["brain_activity", "cli"],
    youtube_clips: ["clipify", "cli"]
  };
  for (const [intent, [workflow, channel]] of Object.entries(expected)) {
    const request = await fixture();
    request.intent = intent;
    const route = routeHiggsfield(request);
    assert.equal(route.workflow.id, workflow);
    assert.equal(route.workflow.channel, channel);
    assert.equal(route.execution.create_args, null);
    assert.equal(route.authorization.approved, false);
  }
});
