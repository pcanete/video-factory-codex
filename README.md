# Video Factory — Codex

Version desarrollada por Codex de una fabrica neutral de preproduccion para video generativo. Convierte referencias, briefs y activos autorizados en contratos verificables y paquetes adaptables a herramientas externas. No genera videos localmente y no depende de un vendor unico.

Este repositorio no comparte working tree con la version de Claude. Cada implementacion evoluciona en su propio entorno y consulta a la otra exclusivamente mediante sus repositorios publicos.

## Estado

Cinco capacidades construidas y verificadas:

- `video-reference-scanner`: referencia -> evidencia y gramatica audiovisual.
- `character-pack-builder`: referencias autorizadas -> identidad portable y versionada.
- `shot-plan-builder`: concepto + gramatica + character pack -> contrato neutral de planos.
- `keyframe-test-builder`: plano + identidad -> candidato estatico con puerta humana antes de animar.
- `video-vendor-compiler`: keyframe aprobado -> trabajo externo con schema, costo y autorización explícita.

La primera prueba privada usa un personaje sintetico propiedad del usuario. Sus imagenes, manifiestos y planes reales no forman parte del repositorio.

## Principios

- La evidencia y los contratos son la fuente de verdad; los prompts son compilaciones descartables.
- Los IDs de personajes dentro de vendors son caches, no activos maestros.
- Identidad incluye rostro, cuerpo, vestuario, voz, actuacion, estado narrativo y permisos.
- Cada mutacion externa, gasto y publicacion conserva una puerta humana.
- Las instalaciones de Claude y Codex se derivaran de este repositorio; ninguna es fuente de verdad.

## Arquitectura prevista

```text
skills/
  video-reference-scanner/  # construida: referencia -> evidencia + gramatica
  character-pack-builder/   # construida: identidad versionada y permisos
  shot-plan-builder/        # construida: tratamiento -> contrato de planos
  keyframe-test-builder/    # construida: validar un frame antes de animar
  video-vendor-compiler/    # construida: compilar y controlar el trabajo externo
  video-creative-director/  # proxima: brief -> tratamiento
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
npm run validate:contracts
node skills/video-reference-scanner/scripts/scan.mjs "C:\ruta\video.mp4" --out ".\results"
```

Cada corrida crea una carpeta nueva dentro del directorio indicado. Los videos, resultados y futuros character packs estan excluidos del repositorio.
