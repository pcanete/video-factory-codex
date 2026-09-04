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

1. Confirmar que el plano necesita una imagen nueva; el director puede indicar ninguna para sustitución sobre video existente. Elegir el test que pruebe el riesgo principal con menos variables, no simplemente el plano más fácil.
2. Resolver sus referencias contra el `CHARACTER_PACK`.
3. Redactar un prompt único con identidad primero y variables creativas después.
4. Generar solamente si existe autorización para usar el proveedor y subir esas referencias.
5. Registrar el candidato y completar la revisión observacional. Separar identidad, objetos/marcas exactas y composición; no marcar pass por falta de visibilidad.
6. Crear `KEYFRAME_TEST.json` conforme a [schemas/keyframe-test.schema.json](schemas/keyframe-test.schema.json).
7. Validar el contrato y sus vínculos:

```powershell
node scripts/validate.mjs "C:\ruta\KEYFRAME_TEST.json" "C:\ruta\SHOT_PLAN.json" "C:\ruta\CHARACTER_PACK.json"
```

8. Mantener `human_decision: pending` hasta decisión del usuario. Puede aprobar un tablero con varios IDs/revisiones en una sola respuesta; registrar ese alcance en DIRECTOR_BRIEF y en cada test incluido. No pedir aprobación imagen por imagen si el conjunto ya quedó aprobado.

## Anclas de secuencia

El contrato acepta product_pack_refs además de character_pack_refs. En pruebas solo de producto, character_pack_refs puede estar vacío; reference_ids apunta a las referencias del producto declaradas en product_refs del plano. Pasar los PRODUCT_PACK al validador junto a los CHARACTER_PACK que correspondan. No interpretar la ausencia de rostro como fallo en una pieza sin personas.

`frame_role` puede ser `start` (por defecto para contratos anteriores) o `end`. Un final requiere una hipótesis de llegada/enlace, compatibilidad con el inicial y soporte verificado del modelo/canal. Usar un test independiente por rol; no sustituir el inicial por el final. Mostrar el tablero completo antes de animar y evaluar timing con video-assembly-director cuando la secuencia lo necesite. Esta skill produce candidatos individuales, no un único collage para subir como start_image.

## Criterio de salida

Un candidato puede pasar como aprobado solamente cuando los checks aplicables pasan y `human_decision` es `approved`. Un `fail` o `review` no queda resuelto por una aprobación general. Corregir el problema o acordar cambiar el requisito/revisión. La compatibilidad temporal de dos imágenes sigue requiriendo prueba de movimiento.
