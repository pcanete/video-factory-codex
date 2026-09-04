import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, isAbsolute, resolve } from "node:path";
import { pathToFileURL } from "node:url";

export function validateVendorPacket(packet) {
  const errors = [];
  if (packet?.contract !== "VIDEO_VENDOR_PACKET") errors.push("contract debe ser VIDEO_VENDOR_PACKET");
  if (packet?.vendor !== "Higgsfield") errors.push("este adaptador requiere vendor Higgsfield");
  if (packet?.source?.keyframe_status !== "approved") errors.push("el keyframe debe estar aprobado");
  if (!packet?.source?.approved_keyframe) errors.push("approved_keyframe es obligatorio");
  if (packet?.source?.frame_role !== undefined && packet.source.frame_role !== "start") errors.push("este compilador solo acepta frame_role start; no usar un frame final como inicial");
  if (!packet?.settings?.job_type) errors.push("settings.job_type es obligatorio");
  if (!Number.isInteger(packet?.settings?.target_duration_s) || packet.settings.target_duration_s < 1) errors.push("target_duration_s debe ser entero positivo");
  if (!packet?.motion_prompt?.trim()) errors.push("motion_prompt es obligatorio");
  if (!packet?.negative_motion?.trim()) errors.push("negative_motion es obligatorio");
  if (!Number.isInteger(packet?.authorization?.generation_limit) || packet.authorization.generation_limit < 1) errors.push("generation_limit debe ser entero positivo");
  if (packet?.authorization?.approved) {
    if (!packet.authorization.approved_at) errors.push("una autorización aprobada requiere approved_at");
    if (typeof packet.authorization.estimated_credits !== "number") errors.push("una autorización aprobada requiere estimated_credits");
    if (typeof packet.authorization.max_credits !== "number") errors.push("una autorización aprobada requiere max_credits");
    if (packet.authorization.estimated_credits > packet.authorization.max_credits) errors.push("estimated_credits supera max_credits");
  }
  return errors;
}

export function compileHiggsfield(packet, packetPath = ".") {
  const errors = validateVendorPacket(packet);
  if (errors.length) throw new Error(errors.join("\n"));
  const source = packet.source.approved_keyframe;
  const startImage = /^https?:\/\//i.test(source) || isAbsolute(source) ? source : resolve(dirname(resolve(packetPath)), source);
  const prompt = `${packet.motion_prompt} Avoid: ${packet.negative_motion}`;
  const common = [
    packet.settings.job_type,
    "--prompt", prompt,
    "--start-image", startImage,
    "--aspect-ratio", packet.settings.aspect_ratio,
    "--duration", String(packet.settings.target_duration_s),
    "--sound", packet.settings.sound,
    "--mode", packet.settings.mode
  ];
  const job = {
    contract: "HIGGSFIELD_JOB",
    version: "0.1.0",
    source_packet: packet.packet_id,
    model_get_args: ["model", "get", packet.settings.job_type],
    cost_args: ["generate", "cost", ...common],
    create_args: null,
    gate: "cost_and_authorization_required"
  };
  if (packet.authorization.approved) {
    job.create_args = ["generate", "create", ...common, "--wait"];
    job.generation_limit = packet.authorization.generation_limit;
    job.max_credits = packet.authorization.max_credits;
    job.gate = "authorized";
  }
  return job;
}

async function main() {
  const args = process.argv.slice(2);
  const packetIndex = args.indexOf("--packet");
  const outIndex = args.indexOf("--out");
  if (packetIndex < 0 || !args[packetIndex + 1] || outIndex < 0 || !args[outIndex + 1]) throw new Error("Uso: node compile-higgsfield.mjs --packet VIDEO_VENDOR_PACKET.json --out HIGGSFIELD_JOB.json");
  const packetPath = resolve(args[packetIndex + 1]);
  const outPath = resolve(args[outIndex + 1]);
  const packet = JSON.parse(await readFile(packetPath, "utf8"));
  const job = compileHiggsfield(packet, packetPath);
  await mkdir(dirname(outPath), { recursive: true });
  await writeFile(outPath, `${JSON.stringify(job, null, 2)}\n`, "utf8");
  console.log(`OK: ${job.source_packet} -> ${outPath} (${job.gate})`);
}

if (import.meta.url === pathToFileURL(process.argv[1]).href) main().catch((error) => {
  console.error(error.message);
  process.exitCode = 1;
});
