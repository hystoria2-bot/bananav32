V32: PWA en modo red, sin Cache Storage.

Cambios:
- El service worker elimina todas las cachés al activarse.
- Todas las solicitudes GET usan red con cache: no-store.
- El index solicita la actualización del service worker con updateViaCache: none.
- Los assets de imagen llevan bananaBuild=32 para impedir reutilización de PNG antiguos.
- El JavaScript principal usa un nombre nuevo: banana-rush-main-v32.js.
- Los offsets visuales de plataformas flotantes se recalibran al 10% (nivel 5), 21% (nivel 6) y 29% (nivel 7).
- No se modifican física ni colisiones.
