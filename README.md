# Video Factory — Codex

Conjunto de 12 skills para que un agente actúe como director de un proyecto de video generativo: analizar una referencia, proponer una adaptación, mantener la consistencia de personajes y productos, preparar las escenas y guiar la producción, revisión y entrega del video completo con herramientas externas como Higgsfield.

Es un sistema de instrucciones, contratos y validadores, no una aplicación que genera películas con un clic. No ejecuta modelos generativos de video en la PC y no depende de un proveedor único. El análisis técnico de archivos y las validaciones pueden ejecutarse localmente; la generación y el montaje se coordinan en herramientas externas disponibles y autorizadas.

Este repositorio no comparte working tree con la version de Claude. Cada implementacion evoluciona en su propio entorno y consulta a la otra exclusivamente mediante sus repositorios publicos.

## Estado

Doce skills disponibles en el repositorio. Los contratos/scripts tienen pruebas automatizadas; la dirección, QA y montaje son instrucciones operativas, no motores autónomos de percepción o edición:

- `video-reference-scanner`: referencia -> evidencia y gramatica audiovisual.
- `character-pack-builder`: referencias autorizadas -> identidad portable y versionada.
- `product-pack-builder`: referencias de producto -> variante, locks exactos/perceptuales y estados.
- `consistency-test-builder`: riesgo del guion -> prueba acotada y aprobación reutilizable solo en su contexto vigente.
- `sequence-continuity-builder`: guion o referencia compleja -> estados verificables de personajes y objetos.
- `shot-plan-builder`: concepto + gramática + packs de personajes/productos -> contrato neutral de planos.
- `keyframe-test-builder`: plano + referencias -> candidato estático inicial/final con puerta humana antes de animar.
- `higgsfield-router`: intención -> Studio, preset o `job_type` correcto sin generar ni gastar.
- `video-vendor-compiler`: keyframe aprobado -> trabajo externo con schema, costo y autorización explícita.
- `video-creative-director`: interlocutor y coordinador del recorrido; tratamiento, decisiones, revisiones y aprobaciones.
- `continuity-qa`: tomas y montaje -> controles separados de identidad, marcas, objetos, movimiento y continuidad.
- `video-assembly-director`: previsualización temporizada -> edición reproducible y entrega completa verificada.

Los casos de producción y sus imágenes, videos, manifiestos y planes reales se mantienen privados. Los ejemplos de contratos publicados son sintéticos.

## Principios

- La evidencia y los contratos son la fuente de verdad; los prompts son compilaciones descartables.
- Los IDs de personajes dentro de vendors son caches, no activos maestros.
- Identidad incluye rostro, cuerpo, vestuario, voz, actuacion, estado narrativo y permisos.
- Cada mutacion externa, gasto y publicacion conserva una puerta humana.
- Las copias instaladas de estos skills se derivan de este repositorio; no son la fuente de verdad. Esto no modifica ni sustituye la implementación independiente de Claude.

## Estructura actual

```text
skills/
  video-reference-scanner/  # construida: referencia -> evidencia + gramatica
  character-pack-builder/   # construida: identidad versionada y permisos
  product-pack-builder/     # producto, variante, referencias, marca y geometría
  consistency-test-builder/ # pruebas de personajes/productos y vigencia de evidencia
  sequence-continuity-builder/ # construida: entidades, beats y continuidad de estados
  shot-plan-builder/        # construida: tratamiento -> contrato de planos
  keyframe-test-builder/    # construida: validar un frame antes de animar
  higgsfield-router/        # construida: elegir Genjutsu, Cinema, Marketing, preset o modelo
  video-vendor-compiler/    # construida: compilar y controlar el trabajo externo
  video-creative-director/  # dirección y coordinación operativa
  continuity-qa/            # revisión de tomas, marcas, objetos y estados
  video-assembly-director/  # previsualización, montaje y entrega
```

Solo se implementa una capacidad cuando existe un caso real que permita probarla.

## Recorrido dirigido

Referencia/brief -> análisis con cobertura declarada -> decisión de transformación -> tratamiento y continuidad -> anclas necesarias + tablero -> previsualización con tiempos -> producción autorizada -> QA por dimensión -> video ensamblado.

Empezar por [video-creative-director](skills/video-creative-director/SKILL.md). El usuario decide sobre propuestas comprensibles; no necesita invocar cada skill. El director puede conservar un video y sustituir elementos, transferir movimiento, crear una secuencia original o combinar rutas, según derechos y capacidades verificadas.

Los frames finales son opcionales y requieren soporte del destino; no todas las rutas necesitan imágenes nuevas. El scanner incorpora una guía de inspección profunda y SCAN_COVERAGE, pero no añade transcripción, escucha ni comprensión automática completa al motor. El compilador CLI actual sigue limitado a imagen inicial a video; no se presenta como adaptador Genjutsu/MCP universal.

Una aprobación grupal conserva IDs y revisiones. Los cambios invalidan solo decisiones dependientes. Un fallo crítico no se convierte en aprobado porque otra dimensión haya pasado. Las entregas de revisión se distinguen de masters con marcas/identidad aprobadas.

La consistencia se gestiona desde packs maestros, no desde una cadena de resultados generados. PRODUCT_PACK conserva referencias y requisitos de cada variante; CONSISTENCY_TEST registra condiciones, revisiones, configuración, evidencia y aprobación. Los validadores no perciben imágenes ni certifican derechos. Una prueba de video con revisión temporal parcial no pasa como consistencia aprobada. Personajes/productos pueden coexistir, y planes/keyframes solo de producto no necesitan un personaje ficticio.

## Qué está automatizado y qué requiere revisión

- **Scripts locales:** extracción de evidencia técnica y fotogramas, validación de contratos, selección de rutas y compilación limitada de trabajos externos. Se prueban con datos sintéticos.
- **Dirección y revisión visual:** las instrucciones guían al agente, con herramientas de percepción disponibles y aprobación humana. Pasar los tests no demuestra que un video preserve una cara, una marca o el movimiento correctamente.
- **Producción y montaje:** requieren acceso a herramientas externas, capacidades verificadas en el canal elegido y autorización de gasto. Este repositorio no incluye una conexión MCP universal ni inicia generaciones al validar contratos.
- **Fidelidad exacta:** los prompts no garantizan logotipos, etiquetas ni geometría perfecta. Cuando son requisitos críticos, se evalúa material real o composición y se revisa el resultado antes de aprobarlo.

## Requisitos del análisis local

- Node.js 20 o superior.
- Una distribucion completa de FFmpeg.
- `ffprobe` recomendado, aunque existe una ficha tecnica de respaldo con FFmpeg.

Los binarios pueden estar en `PATH`, pasarse con `--ffmpeg`/`--ffprobe` o definirse mediante `VIDEO_FACTORY_FFMPEG` y `VIDEO_FACTORY_FFPROBE`.

## Uso

```powershell
npm ci
npm run check
node skills/video-reference-scanner/scripts/scan.mjs "C:\ruta\video.mp4" --out ".\results"
```

`npm run check` ejecuta las pruebas y validaciones sin generar medios ni gastar créditos. El comando del scanner crea una carpeta nueva dentro del directorio indicado. Los resultados, medios y carpetas de packs reales están excluidos del repositorio; no deben añadirse manualmente a una publicación.
