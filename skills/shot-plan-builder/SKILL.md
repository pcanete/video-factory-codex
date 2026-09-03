---
name: shot-plan-builder
description: Convierte un concepto, una gramática audiovisual y character packs aprobados en un contrato neutral de planos para generación externa; no copia contenido distintivo de referencias ni ejecuta gastos, uploads o generaciones.
---

# Shot Plan Builder

Produce un plan de planos neutral antes de compilar prompts para un proveedor. Separa intención narrativa, continuidad y evidencia de identidad de la sintaxis cambiante de cada modelo.

## Invariantes

- Transferir funciones y relaciones de una referencia, no marcas, personajes, textos, música ni encuadres distintivos.
- Cada plano debe declarar qué referencias de identidad necesita y qué puede fallar.
- Separar imagen clave de movimiento: primero aprobar el frame, después animarlo.
- Mantener los nombres y versiones de vendors fuera del contrato maestro.
- No prometer continuidad en ángulos ausentes del character pack.
- Las duraciones deben sumar el objetivo de la pieza.
- Exigir puertas humanas para aprobar concepto, keyframes y clips antes del ensamblado.

## Flujo

1. Leer el tratamiento original, el `VIDEO_DNA` o `SHOT_TEMPLATE` de referencia y los character packs aprobados.
2. Declarar explícitamente qué gramática se transfiere y qué contenido queda prohibido copiar.
3. Diseñar la secuencia más corta capaz de probar la hipótesis creativa o técnica.
4. Para cada plano escribir sujeto, acción, encuadre, cámara, luz, entorno, estilo, referencias, transición, riesgo y criterio de éxito.
5. Crear `SHOT_PLAN.json` conforme a [schemas/shot-plan.schema.json](schemas/shot-plan.schema.json).
6. Validarlo con:

```powershell
node scripts/validate.mjs "C:\ruta\SHOT_PLAN.json"
```

7. Entregar el contrato a un compilador de proveedor solo después de aprobar el plan.

## Regla del primer piloto

Cuando el objetivo principal es identidad, limitar variables: un personaje, un vestuario, una locación, sin diálogo y con movimientos de cámara moderados. Incluir como máximo un plano deliberadamente difícil para aprender de la falla.
