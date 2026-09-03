import { spawnSync } from "node:child_process";
import { delimiter, dirname, extname, isAbsolute, join } from "node:path";
import { accessSync, constants } from "node:fs";

function executable(path) {
  try { accessSync(path, constants.X_OK); return true; }
  catch { return false; }
}

export function findBinary(name, explicit, envName) {
  const candidates = [explicit, process.env[envName]].filter(Boolean);
  const suffix = process.platform === "win32" && !extname(name) ? ".exe" : "";
  for (const folder of (process.env.PATH || "").split(delimiter).filter(Boolean)) {
    candidates.push(join(folder, `${name}${suffix}`));
    candidates.push(join(folder, name));
  }
  for (const candidate of candidates) {
    if ((isAbsolute(candidate) || candidate.includes("/") || candidate.includes("\\")) && executable(candidate)) return candidate;
  }
  return null;
}

export function run(binary, args, options = {}) {
  if (!binary) throw new Error(`binario no configurado para: ${args.join(" ")}`);
  const result = spawnSync(binary, args, {
    encoding: options.encoding ?? "utf8",
    maxBuffer: options.maxBuffer ?? 256 * 1024 * 1024,
    cwd: options.cwd,
  });
  if (result.error) throw new Error(`no se pudo ejecutar ${binary}: ${result.error.message}`);
  if (result.status !== 0 && !options.allowFailure) {
    const stderr = Buffer.isBuffer(result.stderr) ? result.stderr.toString("utf8") : result.stderr;
    throw new Error(`${binary} termino con codigo ${result.status}:\n${(stderr || "sin diagnostico").trim()}`);
  }
  return result;
}

export function siblingBinary(binary, siblingName) {
  if (!binary) return null;
  const suffix = process.platform === "win32" ? ".exe" : "";
  const candidate = join(dirname(binary), `${siblingName}${suffix}`);
  return executable(candidate) ? candidate : null;
}
