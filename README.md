# Video Factory

Fabrica neutral de preproduccion para video generativo. Convierte referencias, briefs y activos autorizados en contratos verificables y paquetes adaptables a herramientas externas. No genera videos localmente y no depende de un vendor unico.

## Estado

Version inicial `0.1.0`. La primera skill es `video-reference-scanner`, preparada para pruebas con videos reales.

## Principios

- La evidencia y los contratos son la fuente de verdad; los prompts son compilaciones descartables.
- Los IDs de personajes dentro de vendors son caches, no activos maestros.
- Identidad incluye rostro, cuerpo, vestuario, voz, actuacion, estado narrativo y permisos.
- Cada mutacion externa, gasto y publicacion conserva una puerta humana.
- Las instalaciones de Claude y Codex se derivaran de este repositorio; ninguna es fuente de verdad.

## Arquitectura prevista

```text
skills/
  video-reference-scanner/  # referencia -> evidencia + gramatica
  character-pack-builder/   # proxima: identidad versionada y permisos
  video-creative-director/  # proxima: brief -> tratamiento
  shot-plan-builder/        # proxima: tratamiento -> contrato de planos
  video-vendor-compiler/    # proxima: contrato -> paquete por vendor
  continuity-qa/            # proxima: clips -> control de deriva
```

Solo se implementa una capacidad cuando existe un caso real que permita probarla.

## Requisitos de la primera skill

- Node.js 20 o superior.
- Una distribucion completa de FFmpeg.
- `ffprobe` recomendado, aunque existe una ficha tecnica de respaldo con FFmpeg.

Los binarios pueden estar en `PATH`, pasarse con `--ffmpeg`/`--ffprobe` o definirse mediante `VIDEO_FACTORY_FFMPEG` y `VIDEO_FACTORY_FFPROBE`.

## Uso

```powershell
npm test
npm run validate
node skills/video-reference-scanner/scripts/scan.mjs "C:\ruta\video.mp4" --out ".\results"
```

Cada corrida crea una carpeta nueva dentro del directorio indicado. Los videos, resultados y futuros character packs estan excluidos del repositorio.
