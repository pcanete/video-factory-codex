import test from "node:test";
import assert from "node:assert/strict";
import { readdir, readFile, stat } from "node:fs/promises";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("../skills/", import.meta.url));
async function markdownFiles(dir) {
  const files = [];
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) files.push(...await markdownFiles(path));
    else if (path.endsWith(".md")) files.push(path);
  }
  return files;
}

test("referencias locales de los skills resuelven archivos reales", async () => {
  for (const file of await markdownFiles(root)) {
    const text = await readFile(file, "utf8");
    for (const match of text.matchAll(/\[[^\]]+\]\(([^\s)]+)\)/g)) {
      const target = match[1];
      if (/^[a-z]+:|^#/i.test(target)) continue;
      const path = resolve(dirname(file), decodeURIComponent(target.split("#")[0]));
      assert.ok((await stat(path)).isFile(), `${file}: ${target}`);
    }
  }
});
