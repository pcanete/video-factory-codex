# Guia de interpretacion

Usar esta guia despues de ejecutar el motor y mirar la evidencia visual.

## Estados de conocimiento

- `medido`: numero calculado directamente desde el archivo.
- `observado`: rasgo visible en uno o mas frames.
- `inferido`: lectura cinematografica compatible con la evidencia, pero no demostrada.
- `no_determinado`: evidencia insuficiente o contradictoria.

Una regla de `VIDEO_DNA` debe declarar estado, confianza y planos que la sostienen.

## Ejes obligatorios

1. **Ritmo:** duracion media y mediana, variacion, cortes por minuto y evolucion por tercios.
2. **Encuadre:** proporcion de planos abiertos, medios, cerrados e insertos. Es observado por el agente.
3. **Camara:** fija, desplazamiento, cambio de escala o movimiento interno. Las tiras ayudan, pero paneo y travelling requieren paralaje visible.
4. **Luz y color:** describir relaciones entre planos. No inventar temperatura Kelvin, lente ni esquema de iluminacion fuera de cuadro.
5. **Transiciones:** corte, disolvencia, fundido u otra lectura, declarando dudas.
6. **Audio:** medir presencia de stream, nivel y silencio; distinguir estas mediciones de escucha, transcripción e interpretación musical. Sin escucha/transcripción verificadas no afirmar palabras; sin escucha no identificar instrumentos, efectos o emoción. La sincronía perceptual no se demuestra con una envolvente de volumen.
7. **Estructura:** funcion de apertura, desarrollo, contraste y cierre. Siempre es interpretativa.

## De referencia a gramatica

Conservar patrones repetidos o estructuralmente decisivos. Un rasgo aislado puede ser un acento, no una regla. No aplicar un umbral universal de frecuencia: una apertura o un cierre puede ocurrir una sola vez y seguir siendo parte esencial de la gramatica.

En inspiración, cada regla debe poder convertirse en una instrucción para una pieza nueva sin reutilizar contenido distintivo no autorizado. En transformación autorizada, documentar además los elementos y tiempos que deben conservarse; mantener ese mapa separado de la gramática neutral.

## Veredicto de produccion

Evaluar por plano:

- `produccion_segura`: el mecanismo fue probado con ese modelo y el riesgo entra en el presupuesto.
- `requiere_prueba`: hay capacidad declarada, pero falta evidencia propia o la accion es inestable.
- `resolver_fuera_del_generador`: filmacion, stock, compositing, grafica o montaje son mas confiables.

Nunca convertir marketing de un vendor en una garantia. Registrar modelo, version, fecha, intentos y resultado cuando exista una prueba.
