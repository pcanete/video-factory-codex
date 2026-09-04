import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { pathToFileURL } from "node:url";

const INTENTS = new Set([
  "motion_transfer", "element_swap", "cinematic_sequence", "marketing_video",
  "viral_effect", "video_edit", "ad_variants", "virality_analysis", "youtube_clips"
]);

const ROUTES = {
  motion_transfer: {
    id: "genjutsu_motion_transfer",
    label: "Genjutsu Motion Transfer",
    channel: "web",
    job_type: null,
    reason: "Preserva movimiento, camara y timing del video fuente mientras sustituye identidad o entorno.",
    required: ["reference_video", "identity_reference"],
    followUp: ["continuity_qa"]
  },
  element_swap: {
    id: "genjutsu_object_swap",
    label: "Genjutsu Object Swap",
    channel: "web",
    job_type: null,
    reason: "Cambia un elemento localizado y evita regenerar el resto de un plano ya util.",
    required: ["reference_video", "swap_target", "replacement_ref"],
    followUp: ["continuity_qa"]
  },
  cinematic_sequence: {
    id: "cinema_studio_4_0",
    label: "Cinema Studio 4.0",
    channel: "web",
    job_type: null,
    reason: "Ofrece direccion por plano y Elements persistentes para una secuencia cinematografica consistente.",
    required: ["shot_plan_ref", "sequence_continuity_ref", "identity_reference"],
    followUp: ["video_vendor_compiler", "continuity_qa"]
  },
  marketing_video: {
    id: "marketing_studio_video",
    label: "Marketing Studio Video",
    channel: "cli",
    job_type: "marketing_studio_video",
    reason: "Compila avatares, productos, hooks, settings o storyboard dentro de un flujo publicitario especializado.",
    required: ["marketing_subject_reference"],
    followUp: ["video_vendor_compiler", "continuity_qa", "virality_analysis"]
  },
  viral_effect: {
    id: "viral_presets",
    label: "Viral Presets",
    channel: "web",
    job_type: null,
    reason: "El preset resuelve la mecanica visual cuando el efecto constituye la idea central.",
    required: ["preset_name", "visual_reference"],
    followUp: ["continuity_qa"]
  },
  video_edit: {
    id: "seedance_2_5_video_edit",
    label: "Seedance 2.5 Video Edit",
    channel: "cli",
    job_type: "seedance_2_5",
    reason: "Aplica una edicion multimodal directa sin reclamar equivalencia con los controles de Genjutsu.",
    required: ["reference_video"],
    followUp: ["video_vendor_compiler", "continuity_qa"]
  },
  ad_variants: {
    id: "ad_multiplier",
    label: "Ad Multiplier",
    channel: "cli",
    job_type: "ad_multiplier",
    reason: "Produce variantes controladas de una pieza publicitaria existente.",
    required: ["reference_video"],
    followUp: ["video_vendor_compiler", "virality_analysis"]
  },
  virality_analysis: {
    id: "brain_activity",
    label: "Virality Predictor",
    channel: "cli",
    job_type: "brain_activity",
    reason: "Analiza una pieza terminada sin generar una nueva.",
    required: ["reference_video"],
    followUp: []
  },
  youtube_clips: {
    id: "clipify",
    label: "Clipify",
    channel: "cli",
    job_type: "clipify",
    reason: "Extrae clips desde una URL de YouTube con un trabajo especializado.",
    required: ["youtube_url"],
    followUp: ["continuity_qa"]
  }
};

function hasIdentity(inputs) {
  return Boolean(inputs.character_pack_ref || inputs.product_pack_ref || inputs.avatar_ids?.length || inputs.reference_images?.length);
}

function hasMarketingSubject(inputs) {
  return Boolean(inputs.product_pack_ref || inputs.product_ids?.length || inputs.avatar_ids?.length || inputs.reference_images?.length || inputs.character_pack_ref);
}

function hasVisualReference(inputs) {
  return Boolean(inputs.product_pack_ref || inputs.approved_keyframe || inputs.reference_images?.length || inputs.character_pack_ref);
}

export function validateRoutingRequest(request) {
  const errors = [];
  if (request?.contract !== "HIGGSFIELD_ROUTING_REQUEST") errors.push("contract debe ser HIGGSFIELD_ROUTING_REQUEST");
  if (request?.version !== "0.1.0") errors.push("version debe ser 0.1.0");
  if (!request?.request_id?.match(/^[a-z0-9][a-z0-9-]*$/)) errors.push("request_id invalido");
  if (!INTENTS.has(request?.intent)) errors.push("intent no soportado");
  if (!request?.brief?.trim()) errors.push("brief es obligatorio");
  if (!request?.inputs || typeof request.inputs !== "object" || Array.isArray(request.inputs)) errors.push("inputs es obligatorio");
  if (!request?.delivery?.aspect_ratio) errors.push("delivery.aspect_ratio es obligatorio");
  if (!request?.delivery?.resolution) errors.push("delivery.resolution es obligatorio");
  if (!Array.isArray(request?.priorities) || request.priorities.length < 1) errors.push("priorities requiere al menos un valor");
  return errors;
}

function isMissing(requirement, inputs) {
  if (requirement === "identity_reference") return !hasIdentity(inputs);
  if (requirement === "marketing_subject_reference") return !hasMarketingSubject(inputs);
  if (requirement === "visual_reference") return !hasVisualReference(inputs);
  return !inputs[requirement];
}

function artifactBindings(inputs) {
  return {
    character: inputs.character_pack_ref ?? inputs.avatar_ids ?? inputs.reference_images ?? null,
    continuity: inputs.sequence_continuity_ref ?? null,
    shots: inputs.shot_plan_ref ?? inputs.storyboard_id ?? null,
    composition: inputs.approved_keyframe ?? null,
    source_video: inputs.reference_video ?? null,
    products: inputs.product_pack_ref ?? inputs.product_ids ?? null
  };
}

function webHandoff(route, request) {
  const uploads = [];
  const inputs = request.inputs;
  if (inputs.reference_video) uploads.push({ role: "source_video", ref: inputs.reference_video });
  if (inputs.character_pack_ref) uploads.push({ role: "character_identity", ref: inputs.character_pack_ref });
  if (inputs.product_pack_ref) uploads.push({ role: "product_identity", ref: inputs.product_pack_ref });
  for (const ref of inputs.reference_images ?? []) uploads.push({ role: "visual_reference", ref });
  if (inputs.approved_keyframe) uploads.push({ role: "approved_composition", ref: inputs.approved_keyframe });
  if (inputs.replacement_ref) uploads.push({ role: "replacement", ref: inputs.replacement_ref });
  return {
    product: route.label,
    uploads,
    configuration: {
      aspect_ratio: request.delivery.aspect_ratio,
      resolution: request.delivery.resolution,
      duration_s: request.delivery.duration_s ?? null,
      preset_name: inputs.preset_name ?? null,
      swap_target: inputs.swap_target ?? null
    },
    prompt_brief: request.brief,
    qa_priorities: request.priorities
  };
}

export function routeHiggsfield(request) {
  const errors = validateRoutingRequest(request);
  if (errors.length) throw new Error(errors.join("\n"));
  const route = ROUTES[request.intent];
  const missing = route.required.filter((item) => isMissing(item, request.inputs));
  const analysisOnly = request.intent === "virality_analysis";
  const status = missing.length
    ? "blocked_missing_inputs"
    : analysisOnly
      ? "ready_for_analysis"
      : route.channel === "web"
        ? "ready_for_web_handoff"
        : "ready_for_provider_compilation";

  return {
    contract: "HIGGSFIELD_ROUTE",
    version: "0.1.0",
    request_id: request.request_id,
    workflow: {
      id: route.id,
      label: route.label,
      channel: route.channel,
      job_type: route.job_type
    },
    reason: route.reason,
    required_inputs: route.required,
    missing_inputs: missing,
    artifact_bindings: artifactBindings(request.inputs),
    execution: {
      model_get_args: route.job_type ? ["model", "get", route.job_type] : null,
      cost_args: null,
      create_args: null,
      handoff: route.channel === "web" ? webHandoff(route, request) : null,
      catalog_verification_required: true
    },
    follow_up_routes: route.followUp,
    authorization: {
      required_before_generation: true,
      approved: false
    },
    status
  };
}

async function main() {
  const args = process.argv.slice(2);
  const requestIndex = args.indexOf("--request");
  const outIndex = args.indexOf("--out");
  if (requestIndex < 0 || !args[requestIndex + 1] || outIndex < 0 || !args[outIndex + 1]) {
    throw new Error("Uso: node route.mjs --request HIGGSFIELD_ROUTING_REQUEST.json --out HIGGSFIELD_ROUTE.json");
  }
  const requestPath = resolve(args[requestIndex + 1]);
  const outPath = resolve(args[outIndex + 1]);
  const request = JSON.parse(await readFile(requestPath, "utf8"));
  const result = routeHiggsfield(request);
  await mkdir(dirname(outPath), { recursive: true });
  await writeFile(outPath, `${JSON.stringify(result, null, 2)}\n`, "utf8");
  console.log(`OK: ${result.request_id} -> ${result.workflow.id} (${result.status})`);
}

if (import.meta.url === pathToFileURL(process.argv[1]).href) main().catch((error) => {
  console.error(error.message);
  process.exitCode = 1;
});
