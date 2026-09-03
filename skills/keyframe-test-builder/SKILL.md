---
name: keyframe-test-builder
description: Construye y evalúa una prueba de keyframe estático desde un shot plan y un character pack antes de animar video; úsala para comprobar identidad, composición y continuidad sin convertir una salida generada en nueva referencia canónica.
---

# Keyframe Test Builder

Convierte un plano planificado en una prueba estática auditable. El objetivo es aislar la identidad y la composición antes de pagar por movimiento.

## Invariantes

- Probar un solo plano y una sola hipótesis por test.
- Referenciar activos por sus IDs del character pack; no duplicar ni publicar activos privados.
- Mantener fijos identidad, edad, cabello, cuerpo y vestuario mientras se prueba la escena.
- Tratar el resultado generado como `candidate`; nunca promoverlo automáticamente a referencia canónica.
- Evaluar identidad y dirección creativa por separado.
- Exigir decisión humana antes de animar el candidato.
- Registrar proveedor, modelo y parámetros cuando estén disponibles; usar `not_recorded` en vez de inventarlos.

## Flujo

1. Elegir el plano menos costoso que todavía pruebe la hipótesis principal.
2. Resolver sus referencias contra el `CHARACTER_PACK`.
3. Redactar un prompt único con identidad primero y variables creativas después.
4. Generar solamente si existe autorización para usar el proveedor y subir esas referencias.
5. Registrar el candidato y completar la revisión observacional.
6. Crear `KEYFRAME_TEST.json` conforme a [schemas/keyframe-test.schema.json](schemas/keyframe-test.schema.json).
7. Validar el contrato y sus vínculos:

```powershell
node scripts/validate.mjs "C:\ruta\KEYFRAME_TEST.json" "C:\ruta\SHOT_PLAN.json" "C:\ruta\CHARACTER_PACK.json"
```

8. Detenerse en `human_decision: pending` hasta que el usuario apruebe o rechace el frame.

## Criterio de salida

Un candidato puede pasar a animación solamente cuando su rostro sigue siendo el personaje autorizado, los locks del pack permanecen estables, la composición sirve al plano y `human_decision` es `approved`.
