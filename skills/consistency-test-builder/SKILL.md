---
name: consistency-test-builder
description: Diseña y registra pruebas de consistencia de personajes y productos antes de ampliar producción, comparando referencias canónicas, ángulos y acciones del guion. Verifica alcance y vigencia de pruebas anteriores sin generar ni gastar automáticamente.
---

# Consistency Test Builder

Una prueba válida demuestra algo concreto en condiciones registradas; no garantiza identidad perfecta en cualquier plano ni habilita presupuesto.

## Diseñar la prueba mínima útil

1. Leer packs, locks y guion. Para producto usar [product-pack-builder](../product-pack-builder/SKILL.md); para personas, [character-pack-builder](../character-pack-builder/SKILL.md). No exigir un personaje en una publicidad solo de producto.
2. Identificar el riesgo dominante y la cobertura necesaria: una vista reconocible, otro ángulo necesario, una interacción o movimiento riesgoso. Son candidatos, no tres generaciones obligatorias. Reutilizar evidencia existente si cubre el mismo alcance.
3. Distinguir identidad permanente de vestuario/look de esta pieza y de estados transitorios. Mantener las referencias maestras presentes aunque el final del clip anterior ayude a enlazar composición.
4. Crear CONSISTENCY_TEST.json según [schemas/consistency-test.schema.json](schemas/consistency-test.schema.json). Cada condición incluye entidades, dimensión crítica, medio necesario y comprobación. Para productos, nombrar los locks del pack (por ejemplo product:label).
5. Registrar en context las revisiones de todos los packs, proveedor/modelo/canal, receta y alcance. En character packs anteriores sin revisión de contenido, usar hash del manifiesto y referencias como identificador; no confundir version del schema con revisión de identidad.
6. Pedir autorización solo para pruebas nuevas y sus uploads/costos. Una prueba con resultados existentes puede revisarse sin regenerar. Un LoRA/Element/ID del proveedor no es una prueba de consistencia ni un requisito universal.
7. Revisar contra originales con [continuity-qa](../continuity-qa/SKILL.md). Para video mirar toda la acción cuando sea posible; si solo hay muestras temporales, registrar sampled y no aprobar consistencia temporal completa. Una imagen no prueba movimiento.
8. Registrar evidencia y decisión humana. Validar con `node scripts/validate.mjs CONSISTENCY_TEST.json [CURRENT_CONTEXT.json]`. El segundo archivo contiene el objeto context actual, sin envolverlo en otro objeto.

## Alcance y vigencia

El validador rechaza aprobación con checks críticos fallidos, pendientes o no aplicables; también rechaza video aprobado sin revisión temporal completa declarada. Comprueba registros, no percibe imágenes ni verifica que el usuario realmente haya aprobado: el agente debe aportar evidencia auténtica.

`canReuseConsistencyTest(test, currentContext)` solo permite reutilizar un registro aprobado cuyo contexto completo coincide. Mantener actualizado CURRENT_CONTEXT desde el plan y configuración reales, no copiándolo de la prueba para forzar coincidencia. Cambiar identidad, variante, modelo, canal, receta o alcance exige reevaluación; no implica regenerar si otra prueba existente cubre el nuevo contexto.

Una prueba puede aprobar solo las condiciones declaradas. No extrapolar de un rostro inmóvil a un giro con oclusión ni de una etiqueta frontal a un envase aplastado. Registrar limitaciones no críticas y mantenerlas visibles al director. Cambios de requisitos críticos requieren una nueva revisión del alcance y aprobación.

## Recuperación

Si falla, localizar la dimensión: referencia insuficiente, geometría, marca, contacto, cámara o continuidad. Proponer la corrección mínima, incluso material real o composición. No reemplazar originales por derivados con errores, ocultar marcas obligatorias ni entrenar/reintentar sin autorización.
