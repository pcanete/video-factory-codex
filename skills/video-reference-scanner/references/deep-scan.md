# Escaneo profundo y cobertura explícita

Usar en pedidos de análisis exhaustivo, sustitución fiel, acciones complejas o dudas del escaneo básico. Un modo dense no significa que se haya comprendido todo el video.

## Pasadas dirigidas por incertidumbre

1. Ver la pieza completa cuando sea posible; registrar disponibilidad de reproducción y escucha. Medir metadata, cortes y envolvente sonora con el motor.
2. Revisar cortes candidatos, incluyendo límites, microplanos, flashes, disolvencias y acción interna sin corte. Corregir la interpretación con evidencia; no inventar que el detector entiende semántica.
3. Usar `--dense` y tiras temporales para localizar eventos. En intervalos ambiguos inspeccionar a mayor frecuencia o cuadro a cuadro: antes, durante y después de un contacto, oclusión, entrega de objeto, giro, morph o transición. Conservar timecodes y método. La extracción adicional es tarea explícita del agente/herramienta disponible, no una opción implementada del scanner si no aparece en `--help`.
4. Separar trayectoria del sujeto, movimiento de cámara, cambio de focal/escala inferido y transformación del objeto. Un par de imágenes no prueba travelling ni velocidad constante. Seguir dirección, apoyos, eje, paralaje, entrada/salida de cuadro y oclusiones.
5. Inventariar texto/marca, utilería, vestuario y estados. Para transformación fiel, localizar qué partes deben cambiar y qué partes deben conservarse, con rangos y referencias.
6. Revisar audio independientemente: mediciones de nivel/silencio no identifican instrumentos, palabras ni emoción. Escuchar/transcribir con una herramienta disponible cuando importe; una transcripción tampoco prueba la música. Si no se puede, declarar el hueco y solicitar solo la información necesaria.
7. Describir ritmo a varias escalas: duración de plano, cadencia de acciones, aceleración/pausa por sección y relación audiovisual verificada. Separar velocidad de reproducción observada de cámara lenta inferida y del número de cortes.
8. Explicar función narrativa y causalidad con nivel de confianza. Distinguir escena, plano y beat; derivar estados para sequence-continuity-builder cuando sea necesario.

## SCAN_COVERAGE.md

Crear junto al análisis, sin cambiar el formato del VIDEO_EVIDENCE emitido por el motor:

| Intervalo | Pregunta / dimensión | Método y evidencia con timecode | Estado | Incertidumbre y siguiente comprobación |
| --- | --- | --- | --- | --- |

Estados: `verified`, `partial`, `not_reviewed`, `unavailable`. Cubrir imagen temporal, cortes, cámara, entidades/estados, textos/marcas, audio y sincronía. No llamar exhaustivo a un análisis con acciones críticas o sonido relevante sin revisar. Puede ser suficiente para continuar una etapa concreta si se explica qué decisión permite y cuál sigue pendiente.

El análisis termina cuando las incertidumbres que cambiarían tratamiento, ruta, referencias o costo están resueltas o presentadas al usuario con un plan concreto. No extraer más fotogramas sin una pregunta que puedan resolver.
