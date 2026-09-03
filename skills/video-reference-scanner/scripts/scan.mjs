#!/usr/bin/env node

import { createHash } from "node:crypto";
import { createReadStream, existsSync, mkdirSync, writeFileSync } from "node:fs";
import { basename, join, resolve } from "node:path";
import { findBinary, run, siblingBinary } from "./lib/runtime.mjs";
import { buildShots, suggestThreshold } from "./lib/timeline.mjs";

const VERSION = "0.1.0";
const round = (value, digits = 3) => Number(value.toFixed(digits));

function fail(message) {
  console.error(`ERROR: ${message}`);
  process.exit(1);
}

function parseArgs(argv) {
  if (!argv.length || argv.includes("--help")) return { help: true };
  const value = (name, fallback = null) => {
    const index = argv.indexOf(`--${name}`);
    return index >= 0 ? argv[index + 1] : fallback;
  };
  return {
    source: argv[0],
    out: value("out"),
    threshold: Number(value("threshold", "0.35")),
    minShot: Number(value("min-shot", "0.5")),
    width: Number(value("width", "640")),
    ffmpeg: value("ffmpeg"),
    ffprobe: value("ffprobe"),
  };
}

function help() {
  console.log(`video-reference-scanner ${VERSION}\n\nuso:\n  node scan.mjs <video-local> --out <directorio> [opciones]\n\nopciones:\n  --threshold <n>  umbral de cambio de escena (default 0.35)\n  --min-shot <s>   fusiona detecciones consecutivas mas cercanas (default 0.5)\n  --width <px>     ancho de frames (default 640)\n  --ffmpeg <ruta>  binario FFmpeg\n  --ffprobe <ruta> binario ffprobe opcional\n`);
}

async function sha256(file) {
  const hash = createHash("sha256");
  for await (const chunk of createReadStream(file)) hash.update(chunk);
  return hash.digest("hex");
}

function parseRate(rate) {
  if (!rate) return null;
  const [a, b = "1"] = rate.split("/").map(Number);
  return b ? round(a / b) : null;
}

function probeWithFfprobe(ffprobe, source) {
  const result = run(ffprobe, ["-v", "error", "-print_format", "json", "-show_format", "-show_streams", source]);
  const data = JSON.parse(result.stdout);
  const video = data.streams.find((stream) => stream.codec_type === "video");
  const audio = data.streams.find((stream) => stream.codec_type === "audio");
  if (!video) throw new Error("el archivo no contiene stream de video");
  const duration = Number(data.format.duration || video.duration);
  return {
    probe_method: "ffprobe",
    duration_s: round(duration),
    container: (data.format.format_name || "").split(",")[0] || null,
    video: {
      codec: video.codec_name || null,
      width: video.width,
      height: video.height,
      fps: parseRate(video.avg_frame_rate || video.r_frame_rate),
      orientation: video.width > video.height ? "horizontal" : video.width < video.height ? "vertical" : "square",
    },
    audio: audio ? { codec: audio.codec_name || null, sample_rate: Number(audio.sample_rate) || null, channels: audio.channels || null } : null,
  };
}

function probeWithFfmpeg(ffmpeg, source) {
  const result = run(ffmpeg, ["-hide_banner", "-i", source], { allowFailure: true });
  const text = result.stderr || "";
  const durationMatch = text.match(/Duration:\s*(\d+):(\d+):([\d.]+)/);
  const videoMatch = text.match(/Video:.*?(\d{2,5})x(\d{2,5}).*?(\d+(?:\.\d+)?)\s*fps/i);
  if (!durationMatch || !videoMatch) throw new Error("ffprobe no esta disponible y FFmpeg no permitio obtener una ficha tecnica suficiente");
  const duration = Number(durationMatch[1]) * 3600 + Number(durationMatch[2]) * 60 + Number(durationMatch[3]);
  const width = Number(videoMatch[1]);
  const height = Number(videoMatch[2]);
  return {
    probe_method: "ffmpeg_fallback",
    duration_s: round(duration),
    container: null,
    video: { width, height, fps: Number(videoMatch[3]), orientation: width > height ? "horizontal" : width < height ? "vertical" : "square" },
    audio: /Audio:/i.test(text) ? { present: true } : null,
  };
}

function sceneScores(ffmpeg, source) {
  const filter = "select=gt(scene\\,0),metadata=print:file=-";
  const result = run(ffmpeg, ["-v", "error", "-i", source, "-an", "-vf", filter, "-f", "null", "-"]);
  const text = `${result.stdout || ""}\n${result.stderr || ""}`;
  const scores = [];
  let time = null;
  for (const line of text.split(/\r?\n/)) {
    const timeMatch = line.match(/pts_time:([\d.]+)/);
    if (timeMatch) time = Number(timeMatch[1]);
    const scoreMatch = line.match(/lavfi\.scene_score=([\d.eE+-]+)/);
    if (scoreMatch && time !== null) {
      scores.push({ time_s: round(time), score: Number(scoreMatch[1]) });
      time = null;
    }
  }
  return scores;
}

function extractFrame(ffmpeg, source, time, destination, width) {
  run(ffmpeg, ["-v", "error", "-ss", String(Math.max(0, time)), "-i", source, "-frames:v", "1", "-vf", `scale=${width}:-2`, "-y", destination]);
}

function makeContact(ffmpeg, framesDir, count, destination) {
  const columns = Math.min(4, count);
  const rows = Math.ceil(count / columns);
  const result = run(ffmpeg, ["-v", "error", "-framerate", "1", "-start_number", "1", "-i", join(framesDir, "shot-%03d.png"), "-vf", `tile=${columns}x${rows}:margin=8:padding=6`, "-frames:v", "1", "-y", destination], { allowFailure: true });
  return result.status === 0 && existsSync(destination);
}

function analyzeAudio(ffmpeg, source, technicalAudio) {
  if (!technicalAudio) return null;
  const result = run(ffmpeg, ["-hide_banner", "-i", source, "-af", "volumedetect", "-f", "null", "-"], { allowFailure: true });
  const text = result.stderr || "";
  const mean = text.match(/mean_volume:\s*(-?inf|-?[\d.]+)\s*dB/i)?.[1];
  const max = text.match(/max_volume:\s*(-?inf|-?[\d.]+)\s*dB/i)?.[1];
  if (!mean && !max) return { method: "volumedetect", state: "analysis_unavailable" };
  const meanDb = mean === "-inf" ? -Infinity : Number(mean);
  return {
    method: "volumedetect",
    mean_db: Number.isFinite(meanDb) ? meanDb : null,
    max_db: max && max !== "-inf" ? Number(max) : null,
    state: meanDb === -Infinity || meanDb <= -70 ? "present_but_effectively_silent" : "present_with_content",
    note: "El umbral de -70 dB es operativo y debe contrastarse con escucha cuando el audio importe.",
  };
}

function rhythm(shots, duration) {
  const values = shots.map((shot) => shot.duration_s);
  const sorted = [...values].sort((a, b) => a - b);
  const mean = values.reduce((sum, value) => sum + value, 0) / values.length;
  return {
    shot_count: shots.length,
    mean_shot_s: round(mean),
    median_shot_s: round(sorted[Math.floor(sorted.length / 2)]),
    shortest_shot_s: round(Math.min(...values)),
    longest_shot_s: round(Math.max(...values)),
    cuts_per_minute: round((shots.length - 1) / (duration / 60), 1),
  };
}

const args = parseArgs(process.argv.slice(2));
if (args.help) { help(); process.exit(0); }
if (!args.out) fail("falta --out <directorio>");
if (/^https?:\/\//i.test(args.source)) fail("v0.1 acepta archivos locales; descarga la referencia por un medio autorizado");

const source = resolve(args.source);
if (!existsSync(source)) fail(`no existe el archivo: ${source}`);
if (!(args.threshold > 0 && args.threshold <= 1)) fail("--threshold debe estar entre 0 y 1");
if (!(args.minShot >= 0)) fail("--min-shot no puede ser negativo");
if (!(args.width >= 160 && args.width <= 3840)) fail("--width debe estar entre 160 y 3840");

const ffmpeg = findBinary("ffmpeg", args.ffmpeg, "VIDEO_FACTORY_FFMPEG");
if (!ffmpeg) fail("FFmpeg no esta en PATH. Usa --ffmpeg o VIDEO_FACTORY_FFMPEG.");
const ffprobe = findBinary("ffprobe", args.ffprobe, "VIDEO_FACTORY_FFPROBE") || siblingBinary(ffmpeg, "ffprobe");
const runId = new Date().toISOString().replace(/[:.]/g, "-");
const output = join(resolve(args.out), runId);
const framesDir = join(output, "frames");
mkdirSync(framesDir, { recursive: true });

console.error(`Analizando ${basename(source)} -> ${output}`);
let technical;
let probeWarning = null;
if (ffprobe) {
  try {
    technical = probeWithFfprobe(ffprobe, source);
  } catch (error) {
    probeWarning = `ffprobe no pudo ejecutarse; se uso FFmpeg como respaldo (${error.code || error.name || "error"})`;
    technical = probeWithFfmpeg(ffmpeg, source);
  }
} else {
  technical = probeWithFfmpeg(ffmpeg, source);
}
const scores = sceneScores(ffmpeg, source);
const cuts = scores.filter((item) => item.score >= args.threshold).map((item) => item.time_s);
const { shots, grouped } = buildShots(cuts, technical.duration_s, args.minShot);

for (const shot of shots) {
  const id = String(shot.index).padStart(3, "0");
  const middle = shot.start_s + shot.duration_s / 2;
  const frameName = `shot-${id}.png`;
  extractFrame(ffmpeg, source, middle, join(framesDir, frameName), args.width);
  shot.frame = `frames/${frameName}`;
  shot.motion_strip = null;
  if (shot.duration_s >= 1) {
    const margin = Math.min(0.35, shot.duration_s * 0.15);
    const stripParts = [shot.start_s + margin, middle, shot.end_s - margin].map((time, index) => {
      const file = join(framesDir, `motion-${id}-${index + 1}.png`);
      extractFrame(ffmpeg, source, time, file, args.width);
      return file;
    });
    const strip = join(output, `motion-${id}.png`);
    const stack = run(ffmpeg, ["-v", "error", ...stripParts.flatMap((file) => ["-i", file]), "-filter_complex", "hstack=inputs=3", "-y", strip], { allowFailure: true });
    if (stack.status === 0 && existsSync(strip)) shot.motion_strip = basename(strip);
  }
}

const contactPath = join(output, "contact.png");
const contactCreated = makeContact(ffmpeg, framesDir, shots.length, contactPath);
const thresholdSuggestion = shots.length === 1 && technical.duration_s > 12 ? suggestThreshold(scores, technical.duration_s) : null;
const evidence = {
  contract: "VIDEO_EVIDENCE",
  version: VERSION,
  run_id: runId,
  generated_at: new Date().toISOString(),
  source: { file_name: basename(source), sha256: await sha256(source) },
  runtime: { node: process.version, ffmpeg: basename(ffmpeg), ffprobe: ffprobe ? basename(ffprobe) : null },
  technical,
  parameters: { scene_threshold: args.threshold, min_shot_s: args.minShot, frame_width_px: args.width },
  rhythm: rhythm(shots, technical.duration_s),
  audio: analyzeAudio(ffmpeg, source, technical.audio),
  shots,
  diagnostic: {
    scene_score_count: scores.length,
    grouped_detections: grouped,
    strongest_scene_scores: [...scores].sort((a, b) => b.score - a.score).slice(0, 40),
    threshold_suggestion: thresholdSuggestion,
    warnings: [
      probeWarning,
      thresholdSuggestion === null ? null : "Se detecto un solo plano largo; revisar visualmente y considerar otra corrida con el umbral sugerido."
    ].filter(Boolean),
    contact_sheet: contactCreated ? "contact.png" : null,
  },
  pending_interpretation: [
    "escala y angulo de cada plano",
    "movimiento de camara versus accion interna",
    "luz, paleta y textura",
    "tipo de transicion",
    "estructura narrativa",
    "replicabilidad contra un modelo y version concretos"
  ],
};

writeFileSync(join(output, "VIDEO_EVIDENCE.json"), JSON.stringify(evidence, null, 2), "utf8");
console.error(`Listo: ${shots.length} planos, ${evidence.rhythm.cuts_per_minute} cortes/min`);
console.log(output);
