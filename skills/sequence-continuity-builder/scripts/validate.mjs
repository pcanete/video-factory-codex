#!/usr/bin/env node

import { readFileSync } from "node:fs";

const hasText = (value) => typeof value === "string" && value.trim().length > 0;

export function validateSequenceContinuity(spec) {
  const errors = [];
  if (spec?.contract !== "SEQUENCE_CONTINUITY") errors.push("contract debe ser SEQUENCE_CONTINUITY");
  if (spec?.version !== "0.1.0") errors.push("version debe ser 0.1.0");
  if (!/^[a-z0-9][a-z0-9-]*$/.test(spec?.sequence_id || "")) errors.push("sequence_id invalido");
  if (!(spec?.duration_target_s > 0)) errors.push("duration_target_s debe ser positiva");

  const entities = Array.isArray(spec?.entities) ? spec.entities : [];
  if (!entities.length) errors.push("entities no puede estar vacio");
  const entityIds = new Set();
  const entitiesById = new Map();
  for (const entity of entities) {
    if (!/^[a-z0-9][a-z0-9-]*$/.test(entity?.id || "")) errors.push(`entity id invalido: ${entity?.id || "vacio"}`);
    if (entityIds.has(entity?.id)) errors.push(`entity id duplicado: ${entity.id}`);
    entityIds.add(entity?.id);
    entitiesById.set(entity?.id, entity);
    if (!Array.isArray(entity?.mutable_attributes) || entity.mutable_attributes.length === 0) errors.push(`entity ${entity?.id}: falta mutable_attributes`);
  }

  const beats = Array.isArray(spec?.beats) ? spec.beats : [];
  if (!beats.length) errors.push("beats no puede estar vacio");
  const duration = beats.reduce((sum, beat) => sum + Number(beat?.duration_s || 0), 0);
  if (Math.abs(duration - Number(spec?.duration_target_s || 0)) > 0.01) errors.push(`las duraciones suman ${duration}, no ${spec?.duration_target_s}`);

  const beatIds = new Set();
  const checkIds = new Set();
  beats.forEach((beat, position) => {
    const label = `beat ${beat?.id || position + 1}`;
    if (beat?.index !== position + 1) errors.push(`${label}: index fuera de secuencia`);
    if (!/^[a-z0-9][a-z0-9-]*$/.test(beat?.id || "")) errors.push(`${label}: id invalido`);
    if (beatIds.has(beat?.id)) errors.push(`${label}: id duplicado`);
    beatIds.add(beat?.id);
    if (!hasText(beat?.narrative_function)) errors.push(`${label}: falta narrative_function`);
    if (!Array.isArray(beat?.evidence_refs) || beat.evidence_refs.length === 0) errors.push(`${label}: falta evidence_refs`);

    const visible = Array.isArray(beat?.visible_entities) ? beat.visible_entities : [];
    for (const entityId of visible) {
      if (!entitiesById.has(entityId)) errors.push(`${label}: entidad visible no declarada ${entityId}`);
      if (!beat?.state_before?.[entityId]) errors.push(`${label}: ${entityId} no tiene state_before`);
      if (!beat?.state_after?.[entityId]) errors.push(`${label}: ${entityId} no tiene state_after`);
    }

    for (const [phase, stateMap] of [["state_before", beat?.state_before], ["state_after", beat?.state_after]]) {
      for (const [entityId, state] of Object.entries(stateMap || {})) {
        const entity = entitiesById.get(entityId);
        if (!entity) {
          errors.push(`${label}: ${phase} refiere entidad no declarada ${entityId}`);
          continue;
        }
        const mutable = new Set(entity.mutable_attributes || []);
        for (const attribute of Object.keys(state || {})) {
          if (!mutable.has(attribute)) errors.push(`${label}: ${entityId}.${attribute} no fue declarado mutable`);
        }
      }
    }

    const declaredChanges = new Set();
    for (const action of beat?.actions || []) {
      if (!entitiesById.has(action?.actor_id)) errors.push(`${label}: actor no declarado ${action?.actor_id}`);
      if (action?.target_id !== null && !entitiesById.has(action?.target_id)) errors.push(`${label}: target no declarado ${action?.target_id}`);
      if (!hasText(action?.verb)) errors.push(`${label}: accion sin verb`);
      for (const change of action?.changes || []) {
        const entity = entitiesById.get(change?.entity_id);
        if (!entity) {
          errors.push(`${label}: cambio refiere entidad no declarada ${change?.entity_id}`);
          continue;
        }
        if (!(entity.mutable_attributes || []).includes(change.attribute)) errors.push(`${label}: cambio no permitido para ${change.entity_id}.${change.attribute}`);
        const changeKey = `${change.entity_id}:${change.attribute}`;
        if (declaredChanges.has(changeKey)) errors.push(`${label}: cambio duplicado para ${change.entity_id}.${change.attribute}`);
        declaredChanges.add(changeKey);
        const before = beat?.state_before?.[change.entity_id]?.[change.attribute];
        const after = beat?.state_after?.[change.entity_id]?.[change.attribute];
        if (before !== change.from) errors.push(`${label}: ${change.entity_id}.${change.attribute} parte de ${JSON.stringify(before)}, no ${JSON.stringify(change.from)}`);
        if (after !== change.to) errors.push(`${label}: ${change.entity_id}.${change.attribute} termina en ${JSON.stringify(after)}, no ${JSON.stringify(change.to)}`);
      }
    }

    for (const [entityId, beforeState] of Object.entries(beat?.state_before || {})) {
      const afterState = beat?.state_after?.[entityId];
      if (!afterState) continue;
      for (const [attribute, beforeValue] of Object.entries(beforeState || {})) {
        if (!(attribute in afterState)) continue;
        if (beforeValue !== afterState[attribute] && !declaredChanges.has(`${entityId}:${attribute}`)) {
          errors.push(`${label}: cambio sin accion declarada en ${entityId}.${attribute}`);
        }
      }
    }

    for (const continuityBreak of beat?.continuity_breaks || []) {
      const entity = entitiesById.get(continuityBreak?.entity_id);
      if (!entity) errors.push(`${label}: continuity_break refiere entidad no declarada ${continuityBreak?.entity_id}`);
      else if (!(entity.mutable_attributes || []).includes(continuityBreak.attribute)) errors.push(`${label}: continuity_break usa atributo no mutable ${continuityBreak.entity_id}.${continuityBreak.attribute}`);
      if (!hasText(continuityBreak?.reason)) errors.push(`${label}: continuity_break sin reason`);
    }

    const checks = Array.isArray(beat?.observable_checks) ? beat.observable_checks : [];
    if (!checks.length) errors.push(`${label}: falta observable_checks`);
    for (const check of checks) {
      if (checkIds.has(check?.id)) errors.push(`${label}: observable_check duplicado ${check?.id}`);
      checkIds.add(check?.id);
      if (!hasText(check?.criterion)) errors.push(`${label}: observable_check sin criterion`);
    }

    if (position > 0) {
      const previous = beats[position - 1];
      const breaks = new Set((beat?.continuity_breaks || []).map((item) => `${item.entity_id}:${item.attribute}`));
      for (const [entityId, currentState] of Object.entries(beat?.state_before || {})) {
        const previousState = previous?.state_after?.[entityId];
        if (!previousState) continue;
        for (const [attribute, currentValue] of Object.entries(currentState || {})) {
          if (!(attribute in previousState)) continue;
          const previousValue = previousState[attribute];
          if (previousValue !== currentValue && !breaks.has(`${entityId}:${attribute}`)) {
            errors.push(`${label}: discontinuidad no declarada en ${entityId}.${attribute}: ${JSON.stringify(previousValue)} -> ${JSON.stringify(currentValue)}`);
          }
        }
      }
    }
  });

  const gates = new Set(spec?.human_gates || []);
  for (const gate of ["script_approval", "state_approval", "clip_approval"]) {
    if (!gates.has(gate)) errors.push(`falta human gate ${gate}`);
  }
  return errors;
}

if (process.argv[1]?.endsWith("validate.mjs")) {
  const file = process.argv[2];
  if (!file) {
    console.error("uso: node validate.mjs <SEQUENCE_CONTINUITY.json>");
    process.exit(2);
  }
  const spec = JSON.parse(readFileSync(file, "utf8"));
  const errors = validateSequenceContinuity(spec);
  if (errors.length) {
    console.error(errors.join("\n"));
    process.exit(1);
  }
  console.log(`OK: SEQUENCE_CONTINUITY ${spec.sequence_id} (${spec.beats.length} beats, ${spec.duration_target_s}s)`);
}
