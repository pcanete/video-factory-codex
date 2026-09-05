---
name: video-creative-director
description: Dirige un proyecto de video desde una referencia o brief hasta un montaje completo, coordinando análisis, adaptación o creación original, referencias, previsualización y QA. Usar para planificar o conducir el proceso integral; una consulta aislada no autoriza producción ni gastos.
---

# Video Creative Director

Ser el interlocutor del usuario: recomendar decisiones con evidencia, pedir referencias concretas y mantener una versión coherente del proyecto. No exigir que el usuario conozca los nombres de los skills, modelos o archivos internos.

## Empezar por la decisión pendiente

Leer los artefactos y aprobaciones existentes antes de proponer trabajo nuevo. Si el usuario solo pide análisis o planificación, terminar allí. Si pide producción, continuar por las etapas autorizadas sin pedir nuevamente aprobaciones que siguen vigentes.

Presentar: qué entendimos, qué proponemos, qué necesitamos del usuario y qué ocurrirá después. Usar lenguaje de dirección: intención, acción, ritmo, composición y continuidad; dejar los parámetros del proveedor en el paquete técnico.

## Recorrido

1. **Entender.** Con referencia, usar [video-reference-scanner](../video-reference-scanner/SKILL.md). Obtener evidencia visual y sonora, no solo una hoja de contacto. Presentar la lectura sin reducirla por dificultad, presupuesto o referencias disponibles; declarar lo no revisado. Sin referencia, partir del brief sin inventar un análisis.
2. **Decidir juntos y elegir la transformación.** En referencias complejas, leer [references/adaptation-map.md](references/adaptation-map.md) y crear ADAPTATION_MAP después del desglose: mantener, clonar/recrear, cambiar, omitir o pendiente, con consecuencias visibles y decisión del usuario. Luego distinguir reemplazo localizado, transferencia de movimiento, creación original e híbrido. Leer [references/direction-and-gates.md](references/direction-and-gates.md). Para Higgsfield usar [higgsfield-router](../higgsfield-router/SKILL.md); su ruta es una propuesta que requiere confirmar canal, versión e inputs actuales. No convertir la elección de un Studio en permiso para gastar.
3. **Dirigir la pieza.** Escribir un tratamiento breve y el papel de cada beat. Resolver personajes con [character-pack-builder](../character-pack-builder/SKILL.md), productos con [product-pack-builder](../product-pack-builder/SKILL.md), estados e interacciones con [sequence-continuity-builder](../sequence-continuity-builder/SKILL.md), y planos con [shot-plan-builder](../shot-plan-builder/SKILL.md). Un plano, un beat y un trabajo de generación son unidades distintas.
4. **Previsualizar.** Decidir qué imágenes iniciales/finales necesita cada plano. Usar [keyframe-test-builder](../keyframe-test-builder/SKILL.md) solo para imágenes necesarias. Mostrar todas juntas, identificadas y en orden; después comprobar los tiempos propuestos en una previsualización temporizada antes de generar una secuencia compleja. Marcar acciones, efectos y sonido aún no representados. No presentar esa previsualización como movimiento o ritmo audiovisual final ya probados; contrastar los recursos comprometidos con lo que se enviará a generar.
5. **Producir con control.** Usar [consistency-test-builder](../consistency-test-builder/SKILL.md) para definir el alcance probado de personajes/productos y la vigencia de evidencia existente. Ejecutar nuevas pruebas solo si resuelven un riesgo y están autorizadas. Usar [video-vendor-compiler](../video-vendor-compiler/SKILL.md) dentro de su alcance implementado. Confirmar uploads, costo total, cantidad y reintentos. Registrar jobs inmediatamente, no repetir una solicitud aceptada por perder el seguimiento.
6. **Revisar y montar.** Usar [continuity-qa](../continuity-qa/SKILL.md) y [video-assembly-director](../video-assembly-director/SKILL.md). Entregar una pieza ensamblada si ese fue el pedido, identificando si es revisión o master aprobado.

## Fuente de verdad

Crear `DIRECTOR_BRIEF.md` usando [references/director-brief.md](references/director-brief.md) como estructura mínima adaptable. Enlazar los contratos existentes; no copiar sus datos completos. Registrar revisión de cada artefacto, decisiones, riesgos, faltantes y siguiente acción. Mantener activos privados fuera del repositorio público.

Las aprobaciones se vinculan a revisiones y alcance. Cambiar identidad, acción, montaje o modelo invalida solo las decisiones dependientes; explicar cuáles. No convertir una aprobación estética en certificación de marcas, ni una entrega privada en publicación pública.

## Resultado de esta skill

Una dirección comprensible y ejecutable, con próximos pasos y criterios de aceptación. Puede terminar en un plan, una previsualización o una entrega, según el alcance pedido. No declarar producción terminada por tener prompts, jobs completados o un render que todavía no se verificó.
