---
name: shot-plan-builder
description: Convierte un tratamiento y referencias aprobadas en un contrato neutral de planos para creación original o transformación autorizada; define acciones, continuidad y criterios de éxito sin ejecutar gastos, uploads o generaciones.
---

# Shot Plan Builder

Produce un plan de planos neutral antes de compilar prompts para un proveedor. Separa intención narrativa, continuidad y evidencia de identidad de la sintaxis cambiante de cada modelo.

## Invariantes

- En inspiración, transferir funciones y relaciones, no contenido distintivo no autorizado. En transformación, registrar qué material está autorizado y qué debe preservarse o cambiarse.
- Cada plano debe declarar qué referencias de identidad necesita y qué puede fallar.
- Separar imagen clave de movimiento cuando se anime una imagen. No imponer un frame nuevo a una edición de video existente; registrar anclas inicial/final/ninguna y su razón en el DIRECTOR_BRIEF.
- Mantener los nombres y versiones de vendors fuera del contrato maestro.
- No prometer continuidad en ángulos ausentes del character pack.
- Las duraciones deben sumar el objetivo de la pieza.
- Conservar aprobaciones de concepto y frames por ID/revisión. Para ensamblar una revisión, la autorización puede incluir selección técnica de tomas por el director; no confundirla con aprobación final de clips/marcas.

## Flujo

1. Leer el tratamiento, modo de transformación, `VIDEO_DNA` o `SHOT_TEMPLATE` y packs aprobados que correspondan. No inventar un personaje en piezas centradas únicamente en objetos.
2. Declarar qué se transfiere, qué se conserva por autorización y qué no se reutiliza. Separar escena, plano, beat y job; una acción compleja puede necesitar más de un trabajo y un clip útil puede aportar varios cortes.
3. Diseñar la secuencia más corta capaz de probar la hipótesis creativa o técnica.
4. Para cada plano escribir sujeto, acción, encuadre, cámara, luz, entorno, estilo, referencias, transición, riesgo y criterio de éxito.
5. Crear `SHOT_PLAN.json` conforme a [schemas/shot-plan.schema.json](schemas/shot-plan.schema.json).
6. Validarlo con:

```powershell
node scripts/validate.mjs "C:\ruta\SHOT_PLAN.json"
```

7. Entregar el contrato a un compilador de proveedor solo después de aprobar el plan.

## Personajes y productos

Usar character_pack_refs e identity_refs para personas; product_pack_refs y product_refs para productos. En una pieza solo de producto, character_pack_refs e identity_refs son arrays vacíos, no un personaje ficticio. Los validadores aceptan CHARACTER_PACK y PRODUCT_PACK como archivos de contexto y comprueban referencias contra packs declarados. Mantener IDs de referencias distintos entre packs para evitar ambigüedad.

## Regla del primer piloto

Cuando el objetivo principal es identidad, limitar variables: un personaje, un vestuario, una locación, sin diálogo y con movimientos de cámara moderados. Incluir como máximo un plano deliberadamente difícil para aprender de la falla.
