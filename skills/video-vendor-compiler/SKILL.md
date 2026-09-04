---
name: video-vendor-compiler
description: Prepara un trabajo externo de video con schema, costo, autorización y seguimiento. Incluye un compilador CLI de imagen inicial a video; las demás rutas requieren adaptación explícita al schema vivo, no equivalencias inventadas.
---

# Video Vendor Compiler

Convierte un plano ya aprobado en argumentos estructurados para la herramienta del proveedor. El contrato conserva la intención; el adaptador contiene el dialecto cambiante.

## Invariantes

- En imagen a video, `start_image` debe ser el keyframe inicial aprobado, no una foto de identidad con otro entorno ni el frame final. En transformación sobre video, conservar el video/rango fuente y los roles de reemplazo que pida el schema; no inventar un start_image para encajar en el compilador CLI.
- El prompt de video describe movimiento y continuidad; no vuelve a inventar la escena fijada por el frame.
- Consultar el schema real del modelo y el costo actual antes de generar.
- No incluir argumentos de generación si falta aprobación explícita, límite de créditos o límite de variantes.
- Una autorización cubre solamente el costo y cantidad declarados.
- Guardar job, costo real, salida y saldo posterior; nunca almacenar tokens o credenciales.
- Una salida generada es candidata hasta pasar QA. El director puede seleccionar rangos para una entrega de revisión si fue autorizado; la aceptación final de identidad/marca sigue separada.

## Alcance implementado

`compile-higgsfield.mjs` y VIDEO_VENDOR_PACKET implementan únicamente la ruta CLI de imagen inicial a video. No compilan automáticamente Genjutsu, pares inicial/final ni batches MCP. Para esas rutas, consultar herramientas/esquemas actuales y preparar un paquete técnico separado con inputs, configuración, evidencia de aprobación, límite de trabajos/costo y seguimiento. No declarar soporte ejecutable solo por haber documentado la intención.

Elegir el conector/canal solicitado y confirmar capacidades reales antes de usarlo. Una aprobación de presupuesto puede cubrir un batch completo; registrar cada índice/job aceptado y consultar su estado, sin reenvíos automáticos. Conservar costos de imagen, video, audio y procesamiento dentro del alcance aprobado. No exigir nuevamente permiso para acciones ya cubiertas y sin cambios.

## Flujo

1. Crear `VIDEO_VENDOR_PACKET.json` conforme a [schemas/video-vendor-packet.schema.json](schemas/video-vendor-packet.schema.json). Trasladar `frame_role` desde KEYFRAME_TEST a `source.frame_role`; contratos anteriores sin ese campo se interpretan como start. El compilador rechaza end en vez de convertirlo en start_image.
2. Para Higgsfield, leer [references/higgsfield-cli.md](references/higgsfield-cli.md).
3. Validar y compilar sin ejecutar:

```powershell
node scripts/compile-higgsfield.mjs --packet "C:\ruta\VIDEO_VENDOR_PACKET.json" --out "C:\ruta\HIGGSFIELD_JOB.json"
```

4. Ejecutar primero `model_get_args` y `cost_args` con la CLI oficial.
5. Actualizar el paquete con el costo informado y pedir aprobación explícita.
6. Recompilar. `create_args` aparece solamente cuando la autorización es válida.
7. Ejecutar una vez, registrar el resultado y pasar a continuity-qa. Continuar hacia montaje si está autorizado; detener solo decisiones pendientes reales.

El compilador no invoca Higgsfield: produce arrays de argumentos para evitar comandos opacos y permitir revisión previa.
