# Catálogo de decisiones de Higgsfield

## Evidencia verificada el 2026-09-04

### Workflows web

- **Genjutsu Motion Transfer**: parte de un video y conserva movimiento, cámara y timing mientras reconstruye personaje, locación o look desde referencias.
- **Genjutsu Object Swap**: sustituye personaje, vestuario, producto, lugar u objeto sin pedir una recreación total del plano.
- **Cinema Studio 4.0**: dirección cinematográfica con referencias, extensión, edición, controles de cámara/lente/luz y Elements reutilizables para personajes, locaciones y props.
- **Viral Presets**: recetas visuales como Earth Zoom, Bullet Time u Orbit 360. El nombre del preset es una decisión creativa de interfaz, no un contrato estable de modelo.

En el catálogo CLI consultado no existían los `job_type` `genjutsu`, `cinema_studio` ni `viral_presets`. Esto no demuestra ausencia en MCP. El router automatizado mantiene fallback web para esos nombres y no afirma que un modelo directo sea equivalente.

### Evidencia adicional MCP de la prueba completa

El 2026-09-04 se generaron planos con `cinematic_studio_3_0` mediante MCP y se ensamblaron en un MP4 mediante el workflow de edición remoto. No prueba paridad con Cinema 4.0 web ni que Genjutsu esté conectado. Consultar el catálogo MCP actual antes de elegir modelo y canal; conservar esa decisión fuera del resultado base del script hasta que exista adaptador MCP validado.

### Capacidades presentes en CLI

- `marketing_studio_video`: acepta prompt y, según el schema vivo, avatares, productos, referencia publicitaria, hook, setting, storyboard, imágenes inicial/final, audio, duración, formato y resolución.
- `seedance_2_5`: ofrece `t2v`, `omni_reference`, `video_edit` y `video_extension`.
- `ad_multiplier`: genera variantes multimodales de una pieza.
- `brain_activity`: Virality Predictor.
- `clipify`: crea clips a partir de una URL de YouTube.
- `gemini_omni`: edición multimodal breve con referencias limitadas.
- `soul_cast`, `soul_cinematic`, `soul_location`: generación de actores, imágenes cinematográficas y locaciones.

La disponibilidad y los argumentos pueden cambiar. Antes de generar, ejecutar `higgsfield model get <job_type>` y luego `higgsfield generate cost ...`.

## Mapeo desde Video Factory

| Activo neutral | Uso en Higgsfield |
| --- | --- |
| `CHARACTER_PACK` | Character Element, avatar, Soul ID o referencias de identidad |
| `SEQUENCE_CONTINUITY` | estados entre planos y checks que no debe perder el workflow |
| `SHOT_PLAN` | storyboard, orden de planos y controles cinematográficos |
| keyframe aprobado | imagen inicial, final o referencia de composición |
| prop/environment anchors | Prop/Location Elements o referencias etiquetadas |
| video de referencia | Motion Transfer, Object Swap, video edit, ad reference o análisis |

## Límites de canal

- No inferir el costo de un canal por la oferta de otro. Verificar precio y modalidad de cobro en el canal/modelo/configuración concretos; una modalidad ilimitada o prueba necesita elección explícita del usuario, sin iniciar suscripciones por defecto.
- Una ruta web puede ser la opción correcta por control o costo. El handoff debe indicar exactamente qué subir, qué papel cumple cada activo y qué verificar.
- Los nombres comerciales de Studios no deben guardarse como fuente de verdad. Conservar intención y restricciones en contratos neutrales.

## Fuentes oficiales

- Genjutsu: https://higgsfield.ai/genjutsu
- Cinema Studio: https://higgsfield.ai/creator-hub/help-center/tools/how-do-i-use-cinema-studio
- Marketing Studio: https://higgsfield.ai/creator-hub/help-center/tools/how-do-i-use-marketing-studio-to-create-video-ads
- Selector de herramientas: https://higgsfield.ai/creator-hub/help-center/tools/which-higgsfield-tool-should-i-use
- CLI: https://higgsfield.ai/creator-hub/help-center/integrations/how-do-i-access-higgsfield-via-cli
- Viral Presets: https://higgsfield.ai/viral-presets
