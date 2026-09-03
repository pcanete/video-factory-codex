# Adaptador Higgsfield CLI

## Verificado el 2026-09-03

- La CLI oficial se distribuye como `@higgsfield/cli` y usa autenticación de navegador, sin guardar una API key en el proyecto.
- `higgsfield account status` devuelve plan y créditos actuales.
- `higgsfield model get <job_type>` devuelve el schema real del modelo.
- `higgsfield generate cost <job_type> ...` estima créditos sin generar.
- `higgsfield generate create <job_type> ... --wait` crea y espera el resultado.
- Kling 3.0 usa `job_type` `kling3_0` y acepta `start_image`, `prompt`, `aspect_ratio`, `duration`, `mode` y `sound`.

Una corrida de calibración con un keyframe 9:16 aprobado, `kling3_0`, 5 segundos, modo `std` y sonido apagado produjo 720 × 1280 a 24 fps. El costo estimado y real fue 6,25 créditos en esa fecha. Este valor es evidencia de una corrida, no una tarifa fija: consultar siempre `generate cost` nuevamente.

## Forma de ejecución

Usar los arrays producidos por `compile-higgsfield.mjs` como argumentos del ejecutable, sin concatenarlos como una cadena de shell.

Orden:

1. `model_get_args` para confirmar parámetros.
2. `cost_args` para conocer el costo.
3. aprobación humana explícita con máximo de créditos y cantidad;
4. `create_args` una única vez;
5. `account status` y registro del resultado.

La CLI y el MCP consumen créditos normales aunque la web ofrezca generaciones gratuitas o modelos ilimitados. Cuando esa diferencia importe, informar al usuario antes de elegir el canal.

## Prompt de movimiento

Con `start_image`, describir solamente lo que cambia: acción corporal, microexpresión y cámara. Declarar qué debe permanecer quieto cuando continuidad sea prioritaria. Si se pide cámara fija, negar explícitamente paneo, tilt, órbita y zoom.
