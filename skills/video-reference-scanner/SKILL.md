---
name: video-reference-scanner
description: Analiza un video de referencia y extrae evidencia temporal, visual y sonora para convertirla en una gramatica audiovisual reutilizable. Usar cuando el usuario aporte un video y quiera entender como esta construido, describir que le gusta o preparar una pieza inspirada en su logica; no usar para copiar contenido, marcas o planos de terceros ni para editar el video fuente.
---

# Video Reference Scanner

Convierte una referencia audiovisual en evidencia verificable y decisiones de direccion. El objetivo es aprender su gramatica sin copiar su contenido.

## Invariantes

- El script mide; el agente interpreta.
- Separar siempre `observado`, `medido`, `inferido` y `no_determinado`.
- No atribuir lente, temperatura de color, intencion narrativa o movimiento de camara como hechos si solo se infieren de frames.
- Conservar timecodes y archivos de evidencia para toda conclusion material.
- No usar logos, textos, musica, personajes ni encuadres distintivos de una referencia como activos de generacion sin derechos.
- No generar ni publicar video. Esta skill termina en un paquete de analisis y un molde de planos.

## Flujo

1. Confirmar que la fuente puede analizarse y que el uso pedido es de estudio o transformacion de gramatica.
2. Ejecutar `scripts/scan.mjs` con una ruta local. Para opciones, usar `--help`.
3. Revisar `diagnostico` antes de aceptar el corte automatico de planos. Si aparece un solo plano largo, no asumir toma continua: usar `threshold_candidates` para generar corridas conservadora, equilibrada y sensible, y comparar sus hojas de contacto.
4. Para referencias con acciones encadenadas, objetos que cambian de estado, planos secuencia, morphs o transiciones internas, repetir con `--dense`. Esto extrae nueve muestras por plano para distinguir subacciones sin inventar cortes.
5. Abrir primero `contact.png`, luego las tiras `motion-*.png` y finalmente los frames individuales necesarios. Las posiciones temporales son mediciones; el sentido de cada fase sigue siendo interpretación.
6. Leer [references/interpretation-guide.md](references/interpretation-guide.md) para sintetizar ritmo, encuadre, camara, luz/color, transiciones, audio y estructura.
7. Escribir en el directorio del escaneo:
   - `VIDEO_DNA.json`: reglas reutilizables con evidencia y confianza.
   - `VIDEO_REPORT.md`: explicacion humana, limitaciones y vocabulario anclado a planos.
   - `SHOT_TEMPLATE.json`: funciones narrativas y parametros vaciados del contenido original.
8. Validar los JSON contra los schemas en `schemas/`.

## Ejecucion

```powershell
node scripts/scan.mjs "C:\ruta\referencia.mp4" --out "C:\ruta\analisis"
```

El motor crea un subdirectorio nuevo por corrida para evitar mezclar evidencias. Puede recibir rutas explicitas a binarios:

```powershell
node scripts/scan.mjs referencia.mp4 --out analisis --ffmpeg C:\tools\ffmpeg.exe --ffprobe C:\tools\ffprobe.exe
```

Para una lectura temporal densa:

```powershell
node scripts/scan.mjs referencia.mp4 --out analisis --dense
```

Tambien reconoce `VIDEO_FACTORY_FFMPEG` y `VIDEO_FACTORY_FFPROBE`. Si `ffprobe` no existe, obtiene una ficha tecnica reducida desde `ffmpeg` y lo declara.

## Replicabilidad

No declarar que un plano es universalmente posible o imposible. Evaluarlo contra un destino y version concretos cuando se conozcan. Reportar:

- nivel: `produccion_segura`, `requiere_prueba` o `resolver_fuera_del_generador`;
- mecanismo de control necesario;
- riesgo principal;
- presupuesto maximo de intentos;
- alternativa concreta.

Si no se conoce el modelo destino, el veredicto es preliminar.

## Limites v0.2

- Entrada por URL todavia no esta implementada; descargar la referencia por un medio autorizado y analizar el archivo local.
- El detector de escenas propone cortes, no sustituye la revision visual.
- Las disolvencias, morphs y transiciones fluidas pueden requerir una segunda pasada con los umbrales adaptativos del diagnostico.
- La transcripcion no forma parte del motor v0.2.
- Movimiento de camara se conserva como tarea interpretativa; las tiras temporales son evidencia, no una clasificacion automatica definitiva.
