---
name: product-pack-builder
description: Construye un paquete maestro privado de producto o utilería con referencias, variante, geometría, marca, estados y límites de fidelidad, para mantenerlo consistente en imágenes y videos. No genera, entrena, sube ni publica activos por sí solo.
---

# Product Pack Builder

Dar al producto su propia fuente de verdad; no tratarlo como una frase decorativa del prompt del personaje.

## Flujo

1. Identificar producto y variante exactos. Separar envases/tamaños/modelos distintos en packs diferentes; no mezclar vistas de variantes parecidas.
2. Inventariar originales, vistas, etiqueta/logo vectorial o de alta resolución, materiales, proporciones y estados mecánicos necesarios. Registrar datos ausentes sin inventar dimensiones ni colores de catálogo.
3. Seleccionar el mínimo de referencias que cubra el guion. Pedir cada faltante con su razón: vista posterior, tapa abierta, escala en una mano, articulación, etiqueta legible. No pedir todas las vistas si no se usarán.
4. Definir locks observables: geometría, color, material, marca, texto y mecanismo. Para cada uno indicar fidelidad exacta o perceptual y referencias que permiten comprobarlo.
5. Crear PRODUCT_PACK.json conforme a [schemas/product-pack.schema.json](schemas/product-pack.schema.json). Mantener revisión del contenido independiente de la versión del contrato. Un candidato generado solo puede ser canónico con aprobación explícita registrada; nunca desplaza automáticamente los originales.
6. Validar con `node scripts/validate.mjs PRODUCT_PACK.json`. El script comprueba estructura y vínculos declarados, no abre archivos ni certifica similitud, derechos o fidelidad visual.
7. Pedir aprobación del pack cuando se vaya a usar; registrar alcance de uploads/generación por separado. Handoff al [director](../video-creative-director/SKILL.md) y al [protocolo de consistencia](../consistency-test-builder/SKILL.md).

## Decisión de producción

Para logos, etiquetas y geometría obligatoriamente exactos, evaluar material real, composición/tracking o render de un activo autorizado antes de confiar todo al generador. Un plano generado puede pasar solo con evidencia suficiente de sus locks; ocultar el producto no resuelve el requisito.

Separar atributos constantes de estados: una tapa puede abrirse; su rosca no puede desaparecer. Entregar estados y locks a sequence-continuity-builder; usar IDs del producto como entidades prop. Un Element u otro ID del proveedor es un vínculo operativo, no el activo maestro.

Guardar packs reales en private-assets/ o fuera del repositorio; solo fixtures sintéticos son públicos. No almacenar credenciales. La aprobación del pack no autoriza usar nuevas plataformas ni publicar imágenes.
