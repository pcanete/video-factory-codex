import { readFile, readdir } from "node:fs/promises";
import { spawnSync } from "node:child_process";
import { dirname, join, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const failures = [];

async function walk(dir) {
  const result = [];
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) result.push(...await walk(full));
    else result.push(full);
  }
  return result;
}

const files = await walk(root);
for (const file of files) {
  if (file.includes(`${join(root, ".git")}`) || file.includes(`${join(root, "node_modules")}`)) continue;
  if (file.endsWith(".json")) {
    try { JSON.parse(await readFile(file, "utf8")); }
    catch (error) { failures.push(`${relative(root, file)}: JSON invalido: ${error.message}`); }
  }
  if (file.endsWith(".mjs")) {
    const result = spawnSync(process.execPath, ["--check", file], { encoding: "utf8" });
    if (result.status !== 0) failures.push(`${relative(root, file)}: ${result.stderr.trim()}`);
  }
}

const skill = join(root, "skills", "video-reference-scanner", "SKILL.md");
const text = await readFile(skill, "utf8");
if (!text.startsWith("---\nname: video-reference-scanner\n")) failures.push("SKILL.md: frontmatter inesperado");
if (text.includes("TODO")) failures.push("SKILL.md: contiene TODO sin resolver");

if (failures.length) {
  console.error(failures.join("\n"));
  process.exit(1);
}
console.log(`OK: ${files.length} archivos revisados`);
