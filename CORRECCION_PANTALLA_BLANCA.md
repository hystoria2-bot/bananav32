# Corrección de pantalla blanca

- El bundle principal se carga como script clásico diferido para mejorar la compatibilidad al abrir el juego desde archivos locales o WebViews móviles.
- El acceso a almacenamiento usa un adaptador seguro con memoria temporal cuando `localStorage` está bloqueado.
- El registro del service worker comprueba que la API esté realmente disponible.
- La caché se actualiza a `banana-rush-mobile-v9-deluxe-hotfix`.
- Las navegaciones usan estrategia de red primero para evitar servir un `index.html` obsoleto.
- Se incluye una pantalla de diagnóstico para evitar un blanco silencioso si ocurre otro error de arranque.
