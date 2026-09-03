---
name: sequence-continuity-builder
description: Convierte un guion o una referencia audiovisual compleja en un contrato temporal de personajes, objetos, acciones y estados verificables entre planos; usar antes del shot plan cuando la continuidad importa, sin generar ni ejecutar video.
---

# Sequence Continuity Builder

Construye una fuente de verdad narrativa entre la referencia y los planos. Su unidad no es el prompt: es el cambio observable de estado.

## Invariantes

- Modelar personajes, objetos relevantes y entorno como entidades con IDs estables.
- Separar atributos inmutables de estados que pueden cambiar durante la secuencia.
- Toda acción debe declarar actor, objetivo opcional y cambios `from -> to`.
- El estado de salida de un beat debe coincidir con el de entrada del siguiente. Una discontinuidad solo es válida si se declara y justifica.
- Cada beat necesita evidencia trazable y controles observables para inicio, desarrollo o final del clip.
- En referencias, distinguir `observed` de `inferred`; en guiones originales usar `authored`.
- No compilar prompts, generar imágenes, gastar créditos ni subir activos. Esta skill termina en `SEQUENCE_CONTINUITY.json` validado.

## Flujo

1. Leer el guion y, cuando exista una referencia compleja, su `VIDEO_EVIDENCE.json`. Si contiene planos largos, acciones encadenadas u objetos que mutan, exigir una corrida `--dense` del `video-reference-scanner`.
2. Inventariar entidades. Para cada una declarar anclas, invariantes y atributos mutables. Un objeto narrativo debe describirse con el mismo rigor que un personaje.
3. Dividir la secuencia en beats por cambio de intención o estado, aunque varios beats puedan vivir dentro de un mismo plano.
4. Para cada beat registrar estado anterior, acciones ordenadas, estado posterior, evidencia y comprobaciones observables.
5. Leer [references/state-model.md](references/state-model.md) cuando haya interacciones, continuidad deliberadamente rota o varios objetos parecidos.
6. Escribir `SEQUENCE_CONTINUITY.json` conforme a [schemas/sequence-continuity.schema.json](schemas/sequence-continuity.schema.json).
7. Validar:

```powershell
node scripts/validate.mjs "C:\ruta\SEQUENCE_CONTINUITY.json"
```

8. Entregar el contrato aprobado a `shot-plan-builder`. Cada plano posterior debe citar los beats y controles que implementa.

## Criterio de granularidad

Crear un nuevo beat cuando cambia al menos uno de estos elementos:

- objetivo o decisión del personaje;
- posesión, posición, orientación, apertura o integridad de un objeto;
- relación física entre personaje y objeto;
- información que el espectador debe comprender;
- continuidad que deberá verificarse en otro plano.

No crear beats separados solo por microgestos decorativos si no alteran estado ni lectura narrativa.
