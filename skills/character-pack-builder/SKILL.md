---
name: character-pack-builder
description: Construye y versiona un paquete privado y portable de identidad a partir de referencias autorizadas, para mantener un personaje consistente entre planos generativos; no entrena modelos, sube activos ni genera imágenes sin autorización explícita.
---

# Character Pack Builder

Convierte referencias visuales autorizadas en una fuente de verdad portable. El pack define identidad, variaciones permitidas, derivas prohibidas, procedencia y adaptadores de proveedor sin encerrar el personaje en un vendor.

## Invariantes

- Separar referencias canónicas, expresiones provisionales y pruebas de estrés.
- Las referencias canónicas mandan sobre cualquier salida generada posteriormente.
- Mantener los activos reales fuera del repositorio público; publicar solamente schemas, fixtures sintéticos y lógica reutilizable.
- Registrar naturaleza y titularidad del personaje antes de producir.
- Tratar LoRA, Soul ID y otros identificadores de plataforma como bindings reemplazables, no como el activo maestro.
- No inferir autorización para entrenar, subir, publicar o gastar.
- No rellenar huecos de cobertura con descripciones textuales presentadas como evidencia visual.

## Flujo

1. Inventariar referencias sin modificar los originales.
2. Detectar duplicados y revisar calidad técnica, ángulos, escalas, expresiones, cuerpo, manos, cabello y vestuario.
3. Elegir el conjunto mínimo que cubra la identidad sin dar el mismo peso a derivados con deriva potencial.
4. Declarar locks, variaciones permitidas, derivas prohibidas y huecos.
5. Crear `CHARACTER_PACK.json` conforme a [schemas/character-pack.schema.json](schemas/character-pack.schema.json).
6. Validarlo con:

```powershell
node scripts/validate.mjs "C:\ruta\CHARACTER_PACK.json"
```

7. Pedir aprobación humana antes de usar el pack para generar keyframes o registrar un binding externo.
8. Para producción recurrente o ángulos/acciones de riesgo, usar [consistency-test-builder](../consistency-test-builder/SKILL.md). Identificar la revisión de contenido por hash del manifiesto y referencias si no existe campo de revisión; version 0.1.0 es el formato, no una revisión de identidad.

Un último frame generado ayuda a la composición, no reemplaza las referencias canónicas. Mantener identidad permanente separada del look/vestuario aprobado para la pieza. No exigir LoRA o entrenamiento si las referencias bastan; verificar compatibilidad y autorización si se proponen.

## Resultado

El pack debe permitir que otro productor responda:

- qué archivos son verdad de identidad;
- qué puede cambiar entre planos;
- qué debe permanecer fijo;
- qué ángulos todavía no están cubiertos;
- qué binding usa cada proveedor y cuándo fue verificado;
- qué activos pueden publicarse y cuáles deben seguir privados.
