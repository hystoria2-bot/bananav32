# Revisión de controles móviles

## Problemas corregidos

1. En orientación horizontal, al ocultarse la etiqueta central, el botón de salto era recolocado automáticamente en la segunda columna de la cuadrícula. Ahora los controles tienen columnas y áreas explícitas: flechas a la izquierda y salto a la derecha.
2. El manejador global `pointerup` liberaba izquierda, derecha y salto al levantar cualquier dedo. Esto interrumpía el movimiento al soltar el botón de salto durante una pulsación simultánea de dirección. Ahora solo actúa cuando el toque termina directamente sobre el contenedor.
3. Los botones detienen la propagación de sus eventos táctiles y liberan su tecla concreta en `pointerup`, `pointercancel` y `lostpointercapture`.
4. Se refuerzan `touch-action: none`, la desactivación de selección y el comportamiento de sobre-desplazamiento en los controles.
5. La caché PWA se ha actualizado a `banana-rush-mobile-v4-controls`.
