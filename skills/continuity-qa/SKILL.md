---
name: continuity-qa
description: Revisa clips y montajes contra guion, identidad, marcas, objetos y estados temporales aprobados. Usar antes de seleccionar tomas o entregar video, sin confundir éxito técnico con fidelidad visual ni generar correcciones automáticamente.
---

# Continuity QA

Comparar evidencia de salida con los contratos y referencias aprobadas. No aprobar por el prompt solicitado ni por el estado completed del proveedor.

## Revisión

1. Leer el plan, los locks y el alcance de entrega. Identificar qué checks son críticos en esta pieza.
   Leer PRODUCT_PACK para los productos y CONSISTENCY_TEST para conocer el alcance ya probado. Comprobar revisiones, modelo/canal y receta; una prueba antigua no certifica automáticamente otra configuración. Comparar contra originales aunque se usen Elements u otros bindings.
2. Verificar archivo real: apertura, duración, dimensiones, fps, streams de audio. Los metadatos del job pueden diferir del MP4.
3. Ver el clip completo en movimiento cuando el runtime lo permita. Inspeccionar inicio, desarrollo, contacto/cambio de estado y final; aumentar muestreo en oclusiones y acciones complejas. Si solo se vieron fotogramas, declarar revisión temporal parcial.
4. Comparar contra fuentes canónicas: identidad/proporciones, marca/texto/patrón, vestuario/objetos, anatomía/contactos, cámara/escala, estados y acción. Revisar las zonas que una sustitución debía dejar intactas, no solo la persona editada.
5. Evaluar el enlace con planos vecinos: dirección de movimiento y mirada, posición/posesión de objetos, iluminación, continuidad o elipsis intencional. Un clip bonito puede no servir al guion.
   Con ADAPTATION_MAP, comprobar además cobertura creativa: acciones, interacciones, cámara, capas, transiciones y sincronías comprometidas. Citar recurso, plano y evidencia de salida; registrar lo ausente aunque identidad y anatomía pasen. Comparar contra las decisiones acordadas, no exigir clonación donde se aprobó un cambio.
6. Registrar `CLIP_QA.md`: plano, job/archivo, revisión contractual, rango inspeccionado, evidencia/timecodes, dimensión, criticidad, estado (`pass`, `fail`, `review`, `not_applicable`), nota y disposición.

## Disposición de tomas

- Utilizable: los checks críticos del rango seleccionado pasan; registrar in/out, no aprobar todo el clip por una parte buena.
- Condicional: hay un pendiente visible. Puede entrar en una versión de revisión si el alcance lo permite y se declara; no pasa a master aprobado.
- Rechazada: contradice un requisito crítico. Proponer recorte, montaje, material real, composición o regeneración limitada. No ejecutar nuevos trabajos pagados sin cobertura presupuestaria vigente.

Una aprobación humana general no borra un `fail` de marcas exactas. Resolverlo o acordar explícitamente cambiar el requisito y su revisión. `review` no equivale a `pass`; `not_applicable` necesita una razón real, no falta de evidencia.

## Marcas e identidad

Comprobar letras, crest/escudo, posición, tamaño y patrón contra los originales cuando sean exactos. Una miniatura no permite certificar texto pequeño. No ocultar un producto/logo obligatorio para hacer pasar QA. Tampoco aumentar la escala del rostro para evitar un defecto si el guion prohíbe ese cambio.

No afirmar identidad perfecta cuando el ángulo no está cubierto por referencias. Si un primer plano es necesario, evaluar cómo conseguirlo, no aplicar universalmente la prohibición de acercarse a caras usada en otra pieza.

## Sonido y montaje completo

Usar [video-assembly-director](../video-assembly-director/SKILL.md) para verificar el archivo final. Separar medición de nivel/picos, escucha y juicio creativo. Si no se pudo escuchar, no afirmar que la mezcla suena bien ni que está sincronizada perceptualmente.
