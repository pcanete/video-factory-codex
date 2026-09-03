# Primera prueba real — Concepts by Paul

Fecha: 2026-09-03

## Alcance

Se analizaron cuatro videos locales suministrados por el usuario y las descripciones públicas de sus publicaciones de Instagram. El objetivo es aprender la gramática de producción, no copiar campañas, marcas, personajes, música ni planos.

Fuentes:

- Ferrari: https://www.instagram.com/p/DZMEHY2Mo5-/
- Red Bull: https://www.instagram.com/p/DcxD4SshnK1/
- Blackthorn: https://www.instagram.com/p/DY_lSvgsPen/
- Orebella: https://www.instagram.com/p/DYB7NkdMLL3/

## Workflow declarado por el autor

| Pieza | Concepto / dirección | Imagen fija | Movimiento | Edición |
|---|---|---|---|---|
| Ferrari | Claude | Nano Banana Pro mediante fal.ai | Kling 3.0 y Higgsfield | CapCut |
| Red Bull | No indicado | Nano Banana Pro | Kling y Seedance 2.0 | CapCut |
| Blackthorn | Claude | Nano Banana Pro | Kling 3.0 y Higgsfield | CapCut |
| Orebella | No indicado | Nano Banana Pro | Kling 3.0/2.6 y Higgsfield | No indicado |

Estas atribuciones provienen del texto del autor. No prueban qué herramienta produjo cada plano particular.

## Evidencia medida

Todos los videos son verticales y tienen audio con contenido.

| Pieza | Duración | Resolución | Planos propuestos | Mediana por plano | Cortes/min |
|---|---:|---:|---:|---:|---:|
| Ferrari | 33,29 s | 720×1280 | 21 | 1,067 s | 36,0 |
| Red Bull | 33,29 s | 720×1280 | 30 | 0,800 s | 52,3 |
| Blackthorn | 30,28 s | 1080×1920 | 8 | 3,300 s | 13,9 |
| Orebella | 15,74 s | 1080×1920 | 10 candidatos | — | 34,3 |

Los valores de Orebella corresponden a la pasada adaptativa sensible con umbral 0,0169. Son segmentos candidatos, no diez cortes confirmados: las disolvencias y superposiciones requieren revisión visual.

## Gramáticas observadas

### Ferrari

- Montaje de alta presión: retratos, cascos, boxes, archivo simulado, siluetas y símbolos.
- Predominio casi monocromático con rojo usado como acento y como cierre.
- Alternancia entre rostro/personaje, textura mecánica y emblema.
- La identidad principal no es una cara: es el sistema Ferrari, sostenido por color, uniforme, vehículo, iconografía y ritmo.

### Red Bull

- La variante más rápida del conjunto.
- Inserciones de producto y vehículo, pilotos, manos, indumentaria y ambiente de boxes.
- La continuidad se sostiene por códigos de equipo y mundo visual más que por un único personaje.
- Comparte gramática con Ferrari, pero no debería compartir prompts literales ni planos distintivos.

### Blackthorn

- Un mismo personaje masculino aparece en diferentes escalas y acciones.
- Alta continuidad aparente de rostro, cabello, camisa verde azulado, pantalón claro y espacio interior de madera.
- Luz cálida, humo, whisky, lámparas y mobiliario construyen un mundo cerrado.
- El producto funciona como inserto; el personaje lleva la continuidad narrativa.
- Es la mejor referencia de este lote para diseñar un `character-pack` porque exige consistencia de persona, vestuario, utilería y locación a través de varios planos.

### Orebella

- Un mismo personaje femenino y un mismo frasco dominan la pieza.
- Paleta estrecha: rojos, ámbar, piel y reflejos dorados.
- Macroproducto, rostro, manos, aerosol y figura distante forman una progresión de escala.
- Las transiciones fluidas, dobles exposiciones y morphs reducen la discontinuidad entre planos.
- La continuidad combina personaje y producto; ambos necesitan anclas independientes y una regla de interacción entre mano, rostro y frasco.

## Inferencia de producción

La evidencia coincide con una producción guiada por imágenes clave:

1. concepto y mundo visual;
2. imágenes maestras consistentes;
3. animación por plano;
4. transiciones y montaje;
5. acabado sonoro y edición.

No parece conveniente diseñar Video Factory como un generador de video de una sola instrucción. El contrato central debe ser una secuencia de planos con referencias visuales, anclas de identidad y reglas de continuidad, compilada luego para cada proveedor.

## Decisiones para Video Factory Codex

1. Construir primero `character-pack-builder`.
2. Hacer que el pack abarque persona, vestuario, producto, utilería, locación y permisos; no solo rostro.
3. Añadir un `world-pack` o sección equivalente para paleta, luz, textura, símbolos y restricciones de marca.
4. Separar el prompt de imagen clave del prompt de movimiento.
5. Crear adaptadores para proveedores; las versiones y nombres comerciales nunca deben formar parte del contrato maestro.
6. Diseñar `continuity-qa` para comparar identidad entre planos y también dentro de un clip.
7. Producir un blueprint de edición independiente del generador, compatible con CapCut u otro editor.
8. Mantener intervención humana para elegir keyframes, aceptar deriva y autorizar gasto externo.

## Hallazgo del scanner

El umbral fijo 0,35 funcionó razonablemente para Ferrari, Red Bull y Blackthorn, pero describió Orebella como un único plano. A partir de este caso se incorporaron tres sugerencias adaptativas que consideran la agrupación temporal:

- conservadora: 0,0279;
- equilibrada: 0,0261;
- sensible: 0,0169.

La pasada sensible propuso 10 segmentos y permitió recuperar la progresión visual. El scanner no debe convertir ese resultado en verdad automática: debe presentar alternativas y conservar la decisión visual humana.

## No determinado

- Qué proveedor generó cada plano individual.
- Qué imágenes fueron regeneradas, compuestas o retocadas.
- Cuántos intentos, seeds o referencias usó el autor.
- Si hubo face lock, character reference, LoRA u otro mecanismo de identidad.
- Qué transiciones fueron generadas dentro del clip y cuáles se resolvieron en edición.
- Relación exacta entre música, efectos y cortes; requiere análisis sonoro adicional.

