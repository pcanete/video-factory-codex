---
name: higgsfield-router
description: Selecciona el flujo correcto de Higgsfield —Genjutsu, Cinema Studio, Marketing Studio, Viral Presets o modelos directos— y produce una ruta verificable sin generar ni gastar; úsala antes de compilar cualquier pedido para Higgsfield.
---

# Higgsfield Router

Convierte una intención de producción en una decisión explícita de workflow, canal y activos. El router evita forzar todos los pedidos a un único modelo o prompt.

## Invariantes

- Elegir el workflow por la transformación que debe preservarse, no por novedad o popularidad.
- Mantener identidad, objetos, locaciones y estados en los contratos de Video Factory; los IDs del proveedor son enlaces descartables.
- Distinguir una capacidad web de un `job_type` disponible en CLI. No inventar equivalencias.
- Consultar el catálogo y schema vivos antes de compilar una ruta CLI.
- El router nunca estima, autoriza ni ejecuta una generación. `create_args` permanece ausente hasta pasar por `video-vendor-compiler` y recibir autorización explícita.
- Si falta un activo requerido, devolverlo como faltante; no sustituirlo silenciosamente.

## Flujo

1. Clasificar el pedido con uno de los intents del contrato [schemas/higgsfield-routing-request.schema.json](schemas/higgsfield-routing-request.schema.json).
2. Leer [references/higgsfield-capabilities.md](references/higgsfield-capabilities.md) cuando se necesite distinguir Studios, presets, CLI o sus límites.
3. Crear `HIGGSFIELD_ROUTING_REQUEST.json` y enrutar sin ejecutar:

```powershell
node scripts/route.mjs --request "C:\ruta\HIGGSFIELD_ROUTING_REQUEST.json" --out "C:\ruta\HIGGSFIELD_ROUTE.json"
```

4. Resolver `missing_inputs` antes de seguir.
5. Para `execution.channel: cli`, verificar `model_get_args` y pasar la ruta al adaptador de `video-vendor-compiler`.
6. Para `execution.channel: web`, preparar el handoff indicado: uploads ordenados, roles de las referencias, configuración y checks de QA. No pulsar **Generate** sin autorización.

## Criterio de selección

- `motion_transfer`: Genjutsu Motion Transfer; conserva coreografía, cámara y timing del video de referencia.
- `element_swap`: Genjutsu Object Swap; cambia un elemento y protege el resto.
- `cinematic_sequence`: Cinema Studio 4.0; secuencia original, varios planos y Elements persistentes.
- `marketing_video`: Marketing Studio Video; producto, avatar, hook, setting o storyboard publicitario.
- `viral_effect`: Viral Presets; el efecto es la idea central, no una decoración tardía.
- `video_edit`: Seedance 2.5 `video_edit`; edición multimodal directa sin reclamar paridad con Genjutsu.
- `ad_variants`: Ad Multiplier; variantes de una pieza existente.
- `virality_analysis`: Virality Predictor; análisis, no generación.
- `youtube_clips`: Clipify; extracción desde una URL de YouTube.

Una solicitud híbrida puede requerir más de una ruta secuencial. Elegir primero la operación que preserve más evidencia y dejar las demás como `follow_up_routes`; no combinar workflows en una llamada opaca.
