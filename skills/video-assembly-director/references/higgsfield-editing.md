# Higgsfield: aprendizajes de ejecución, no API permanente

Observado en una prueba completa el 2026-09-04. Confirmar el workflow y la implementación vigente antes de reutilizar comandos. No confundir el producto Cinema Studio con el motor de edición que ensambla sus clips.

- Consultar herramientas cargadas por su identidad exacta. El catálogo web, CLI y MCP puede diferir; no inferir ausencia en MCP por una búsqueda CLI.
- El MCP consultado ofreció `cinematic_studio_3_0` mientras la web anunciaba Cinema Studio 4.0. Esto es evidencia histórica, no selección automática para el siguiente proyecto.
- Guardar inmediatamente índices y IDs del batch. Esperar trabajos existentes; una salida tardía no justifica enviar otra generación. Al terminar, consultar la salida exacta, no la galería general.
- `ffprobe` del MP4 mostró 1080 × 1920 / 24 fps aunque los parámetros del job contenían otras dimensiones. Validar bytes reales.
- En el runtime higgsedit probado, `p.cut()` fijaba pista 0. El audio añadido con otro `cut` falló por mezclar audio y video en esa pista; `p.over(audioHandle, {at: 0, dur})` lo colocó en pista separada. Verificar el comportamiento vigente; no editar el motor ni escribir project.json a mano.
- `p.frame()` resolvía rutas respecto del proyecto; usar rutas relativas de prueba y verificar que existen. Una línea de log no demuestra que el PNG esté en el destino esperado.
- Render Node fue suficiente para cortes simples. Efectos que requieran WebGL pueden necesitar otra ruta del workflow oficial.
- stdout de sandbox puede truncar imágenes base64. Revisar `exit_code` y `truncated` antes de mostrar/interpretar una captura. Hacer capturas más pequeñas o acotar la consulta; no tratar errores como imágenes.
- El sandbox puede perder persistencia entre sesiones. Mantener IDs/URLs de resultados, edición y manifiestos recuperables en el espacio privado del proyecto. Si se pierde, descargar resultados ya pagados en el entorno de edición autorizado; no regenerar.
- Verificar uploads por PUT exitoso, confirmación y enlace accesible. Una URL reservada no es un video entregado. Si una revisión de permisos bloquea un paso, resolver el alcance con el usuario sin eludir el rechazo mediante otro destino.
- Si el editor compartido no está disponible como herramienta, entregar MP4 verificado y declarar el límite; no inventar una URL de editor.

La prueba verificó una edición de cortes con sonido procedural. No demuestra mezcla profesional escuchada, preservación perfecta de marcas, Genjutsu probado ni equivalencia entre versiones de Cinema.
