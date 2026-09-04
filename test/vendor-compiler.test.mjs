import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { compileHiggsfield, validateVendorPacket } from "../skills/video-vendor-compiler/scripts/compile-higgsfield.mjs";

const fixture = async () => JSON.parse(await readFile(new URL("../skills/video-vendor-compiler/fixtures/video-vendor-packet.synthetic.json", import.meta.url), "utf8"));

test("un paquete sin autorización no emite argumentos de generación", async () => {
  const packet = await fixture();
  assert.deepEqual(validateVendorPacket(packet), []);
  const job = compileHiggsfield(packet, "C:\\fixture\\packet.json");
  assert.equal(job.create_args, null);
  assert.equal(job.gate, "cost_and_authorization_required");
});

test("un paquete aprobado limita y compila una generación", async () => {
  const packet = await fixture();
  packet.authorization = {
    approved: true,
    approved_at: "2026-09-03",
    estimated_credits: 6.25,
    max_credits: 6.25,
    generation_limit: 1
  };
  packet.status = "authorized";
  const job = compileHiggsfield(packet, "C:\\fixture\\packet.json");
  assert.equal(job.gate, "authorized");
  assert.equal(job.generation_limit, 1);
  assert.deepEqual(job.create_args.slice(0, 3), ["generate", "create", "kling3_0"]);
  assert.ok(job.create_args.includes("--wait"));
});

test("rechaza una autorización cuyo costo supera el máximo", async () => {
  const packet = await fixture();
  packet.authorization = {
    approved: true,
    approved_at: "2026-09-03",
    estimated_credits: 7,
    max_credits: 6,
    generation_limit: 1
  };
  assert.match(validateVendorPacket(packet).join("\n"), /supera max_credits/);
});

test("un ancla final no se compila silenciosamente como start-image", async () => {
  const packet = await fixture();
  packet.source.frame_role = "end";
  assert.throws(() => compileHiggsfield(packet), /frame_role start/);
  packet.source.frame_role = "start";
  const job = compileHiggsfield(packet);
  assert.ok(job.cost_args.includes("--start-image"));
  assert.equal(job.create_args, null);
});
