# Corrección del arranque y decoración de islas

La versión anterior insertaba elementos decorativos dentro de un contenedor gestionado por React. Esto podía provocar errores de reconciliación y activar la pantalla de fallo de inicio.

Esta revisión:

- Parte de la última versión estable de power-ups.
- Mantiene intacto el árbol interno de React.
- Coloca nombres y dibujos en una capa externa segura.
- Evita que un error secundario tape un juego que ya ha cargado.
- Amplía a 9 segundos la comprobación real de arranque.
- Actualiza la caché PWA.
