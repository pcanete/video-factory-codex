---
name: video-vendor-compiler
description: Compila un keyframe aprobado y su intención de movimiento a un trabajo reproducible para un proveedor de video como Higgsfield; úsala para consultar schema y costo, exigir autorización de gasto y limitar generaciones antes de ejecutar.
---

# Video Vendor Compiler

Convierte un plano ya aprobado en argumentos estructurados para la herramienta del proveedor. El contrato conserva la intención; el adaptador contiene el dialecto cambiante.

## Invariantes

- El `start_image` debe ser un keyframe aprobado de la escena, no una foto de identidad con otro entorno.
- El prompt de video describe movimiento y continuidad; no vuelve a inventar la escena fijada por el frame.
- Consultar el schema real del modelo y el costo actual antes de generar.
- No incluir argumentos de generación si falta aprobación explícita, límite de créditos o límite de variantes.
- Una autorización cubre solamente el costo y cantidad declarados.
- Guardar job, costo real, salida y saldo posterior; nunca almacenar tokens o credenciales.
- Una salida generada es candidata hasta pasar QA humana.

## Flujo

1. Crear `VIDEO_VENDOR_PACKET.json` conforme a [schemas/video-vendor-packet.schema.json](schemas/video-vendor-packet.schema.json).
2. Para Higgsfield, leer [references/higgsfield-cli.md](references/higgsfield-cli.md).
3. Validar y compilar sin ejecutar:

```powershell
node scripts/compile-higgsfield.mjs --packet "C:\ruta\VIDEO_VENDOR_PACKET.json" --out "C:\ruta\HIGGSFIELD_JOB.json"
```

4. Ejecutar primero `model_get_args` y `cost_args` con la CLI oficial.
5. Actualizar el paquete con el costo informado y pedir aprobación explícita.
6. Recompilar. `create_args` aparece solamente cuando la autorización es válida.
7. Ejecutar una vez, registrar el resultado y detenerse para QA.

El compilador no invoca Higgsfield: produce arrays de argumentos para evitar comandos opacos y permitir revisión previa.
