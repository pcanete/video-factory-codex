# Modelo de estados y continuidad

## Entidades

Una entidad es cualquier elemento cuya identidad o estado deba sobrevivir entre beats:

- `character`: rostro, cuerpo, vestuario, voz o actuación;
- `prop`: forma, color, material, texto permitido, posición, posesión y condición;
- `environment`: geometría, hora, luz, clima o elementos persistentes.

Los `invariants` nunca deben cambiar durante la pieza. Los `mutable_attributes` solo cambian mediante una acción declarada.

## Estados

`state_before` y `state_after` son snapshots parciales pero explícitos. Toda entidad visible debe aparecer en ambos. Los valores deben ser concretos y observables: `closed`, `on-table`, `held-right-hand`, no emociones abstractas como `sad` salvo que se traduzcan a una conducta verificable.

## Acciones

Cada acción declara:

- `actor_id`: quién causa el cambio;
- `verb`: qué ocurre;
- `target_id`: sobre qué entidad actúa, si corresponde;
- `changes`: atributo, valor anterior y valor posterior;
- `constraints`: límites que evitan una ejecución incompatible con el guion.

Una acción sin cambio de estado puede existir para actuación o cámara, pero debe tener una comprobación observable.

## Continuidad

El validador compara `state_after` de un beat con `state_before` del siguiente. Si difieren, `continuity_breaks` debe declarar entidad, atributo y razón. Esto permite elipsis o saltos temporales sin convertir errores accidentales en decisiones creativas.

## Evidencia y QA

Para una referencia, `evidence_refs` debe citar timecodes, frames o muestras densas. Para un guion original puede citar escenas o líneas del documento. Los `observable_checks` se redactan como condiciones binarias y nombran la evidencia necesaria: frame inicial, frame final, muestras temporales, clip completo o audio.
