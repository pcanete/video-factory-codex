# Dirección, controles y cambios

## Elegir qué debe permanecer

| Intención | Unidad de trabajo | Qué preservar | Control principal |
| --- | --- | --- | --- |
| Reemplazo localizado | Plano o rango fuente autorizado | Todo salvo la región/entidad indicada | Comparación temporal antes/después, incluyendo zonas no editadas |
| Transferencia de movimiento | Acción fuente autorizada | Coreografía, cámara y tiempos acordados | Trayectorias, contactos, oclusiones y sincronía |
| Original inspirado | Guion propio y nueva secuencia | Función narrativa, relaciones de ritmo/estética seleccionadas | Diferencias deliberadas y adecuación al nuevo protagonista/producto |
| Híbrido | Decisión por plano o rango | Invariantes específicas de cada operación | Continuidad y consistencia entre motores/materiales |

Genjutsu Object Swap y Motion Transfer son candidatos para las dos primeras intenciones; Cinema Studio es candidato para la tercera. No son garantías ni opciones excluyentes. Marketing Studio o un preset pueden resolver un pedido específico mejor: recomendarlo si conserva las prioridades, no añadirlo por novedad.

Analizar una referencia no concede permiso para reutilizar sus imágenes, música o interpretación. Registrar el alcance autorizado antes de transformar/subir material; no pedir otra vez derechos ya establecidos. En original inspirado separar gramática transferida de contenidos que no se reutilizarán.

## Referencias que el director debe pedir

Solicitar el mínimo que resuelva una incertidumbre concreta: perfil faltante, mano sujetando el producto, objeto abierto/cerrado, logo original, vestuario visto de espalda. Indicar qué plano habilita cada referencia. No pedir un LoRA si las imágenes alcanzan y la ruta no lo necesita.

Distinguir identidad, pose, composición, producto/marca y entorno. Una foto puede ser buena identidad pero mala postura. Identidad incluye proporciones y edad aparente, no solo cara. Para objetos: forma, tamaño relativo, orientación, piezas móviles y contactos con personas.

## Frames iniciales y finales

- No generar un frame nuevo por obligación para editar un video existente.
- Inicial: cuando fija un estado de partida que el motor usará realmente.
- Final: cuando controla una llegada, contacto, revelación o enlace; verificar soporte del modelo/canal y compatibilidad de estados antes de producirlo.
- Una pareja de frames no demuestra que el recorrido intermedio sea físicamente posible.
- Un collage sirve para aprobar dirección; enviar imágenes individuales al generador salvo que el schema pida un storyboard.
- No adoptar imágenes generadas como identidad canónica sin decisión explícita.

## Puntos de decisión

Agrupar aprobaciones para reducir interrupciones, manteniendo el alcance visible:

1. **Tratamiento y ruta:** intención, invariantes, diferencias, derechos, riesgos y entrega esperada.
2. **Previsualización:** tablero completo, roles de frames y ritmo. La aprobación grupal debe enumerar IDs/revisiones incluidos; trasladarla a cada contrato, sin inventar un sí para candidatos excluidos.
3. **Producción:** proveedor/canal, referencias que se subirán, configuración consultada, trabajos nuevos, créditos máximos y reintentos. La duración final puede ser menor que la suma de clips facturados. Un cambio de costo/configuración fuera del alcance requiere nueva decisión.
4. **Entrega:** alcance de QA y pendientes. Con autorización para montar una primera versión, el director puede seleccionar tomas técnicamente utilizables y entregar revisión; no llamarla master de marca aprobado.

No exigir cuatro preguntas si una autorización ya cubre varias etapas. Tampoco interpretar «me gusta» como permiso económico o de publicación.

## Cambios sin rehacer todo

| Cambio | Volver a revisar |
| --- | --- |
| Identidad o producto | Referencias y planos dependientes, frames, clips y QA de esos elementos |
| Estado de salida de un plano | Enlace siguiente y las transiciones dependientes |
| Duración/orden | Previsualización, sincronía sonora y montaje; no regenerar clips útiles automáticamente |
| Modelo/canal/preset | Soporte de controles, costo y alcance autorizado |
| Solo mezcla sonora | Audio, sincronía y exportación; no regenerar imagen |

## Aprendizajes de una prueba deportiva

La altura del bloque y la postura deben resolverse en el frame, no confiar su corrección al prompt de movimiento. Un salto y una brazada de otro estilo pueden funcionar como montaje de entrenamiento con elipsis, pero no como prueba de una carrera continua. Prohibir zoom facial fue una decisión de esa pieza: no convertirlo en regla universal para retratos o diálogos.

Las marcas exactas requieren comprobación independiente. Si fallan, considerar tomas reales, compositing/tracking o una nueva referencia autorizada; ocultarlas puede violar el brief. No prometer corrección perfecta por añadir instrucciones negativas.
