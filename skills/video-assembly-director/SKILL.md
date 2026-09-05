---
name: video-assembly-director
description: Dirige la previsualización temporizada y el ensamblado final de un video desde planos aprobados, con edición reproducible, sonido y QA del archivo entregado. No sustituye generación de movimiento ni autoriza gastos o publicación.
---

# Video Assembly Director

El resultado es una pieza audiovisual, no un listado de clips. Preferir la edición/render externos elegidos por el usuario. No trasladar generación o render pesado a su PC sin autorización.

## Previsualización antes de producción

Con un plan original complejo, montar frames aprobados o material existente con duraciones tentativas y sonido guía si está autorizado. Mostrar toda la secuencia. Diferenciar este animatic de una prueba de movimiento. Comprobar función de cada beat, legibilidad, ritmo y duración; no imponer un número fijo de cortes.

No generar frames para construir un animatic cuando el video fuente ya permite evaluar el timing de una sustitución. Usar el mínimo de trabajo que pruebe la decisión pendiente.

Marcar explícitamente acciones, cámara, efectos y sonido que el animatic todavía no representa. La aprobación de imágenes no acredita interacción ni energía temporal. En piezas de referencia compleja, contrastar el ADAPTATION_MAP con el conjunto: qué recursos siguen presentes y cuáles se perdieron. No compensar una interacción inexistente contando reencuadres como acciones nuevas.

## Edición final

1. Recibir tomas y rangos utilizables de [continuity-qa](../continuity-qa/SKILL.md). Una autorización para ensamblar revisión no equivale a aprobación humana definitiva de cada toma.
2. Escribir `EDIT_PLAN.json` con fps/formato objetivo, segmentos (ID, fuente, in/out, posición, duración en frames), transiciones, vínculo al beat y audio. Separar duración de fuentes generadas de duración del montaje. Para fps fraccional usar una base temporal racional y documentar el redondeo.
3. Ajustar cortes al movimiento real. Los trims anteriores a la generación son provisionales. No insertar agua, objetos o ampliaciones vacías solo para alcanzar una cantidad de cortes. Crops fijos y zooms animados son decisiones diferentes; ambos deben respetar las restricciones de encuadre e identidad.
4. Crear una edición reproducible con el workflow oficial del editor disponible. Confirmar capacidad de exportar y recuperar el proyecto antes de una tanda costosa, reutilizando una prueba vigente. Con Higgsfield leer su workflow de video-editing y, cuando aplique, [references/higgsfield-editing.md](references/higgsfield-editing.md).
5. Resolver música, ambiente, efectos y voz según brief y permisos. No reutilizar audio de referencia por defecto ni inventar autorización para generar voces. Identificar sonido guía, sintetizado, grabado o licenciado. Los costes de audio/procesamiento también deben estar cubiertos.
6. Revisar un render del conjunto, no solo las fuentes. Ver cortes y transiciones en el MP4 codificado; escuchar completo cuando sea posible; medir duración, fps, dimensiones, audio, picos y silencios/negros no intencionales. Si hay límites de percepción, declararlos y entregar como revisión.
7. Entregar un solo MP4 funcional, más editor/proyecto cuando estén disponibles y dentro de lo pedido. Verificar el destino y el enlace; exportado, subido, confirmado y publicado son estados distintos. No publicar activos privados en GitHub.

## Cierre

Registrar `FINAL_QA.md`: revisión del plan, rangos y límites efectivamente inspeccionados, specs reales, costo observado, pendientes de marca/identidad/audio, recursos creativos cumplidos o ausentes respecto del mapa acordado, destino y estado de entrega. Guardar scripts, fuentes recuperables y decisiones sin credenciales. La aprobación de un presupuesto no autoriza reintentos ilimitados.
