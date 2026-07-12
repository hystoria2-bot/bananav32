# Integración de música

Se ha añadido la pista `audio/Banana-Rush-Bounce.mp3` como música de fondo.

## Comportamiento

- Comienza tras la primera interacción del usuario y al entrar en estado de juego.
- Se reproduce en bucle.
- Volumen fijado al 28 % para dejar margen a futuros efectos.
- Se pausa al pausar la partida, completar un nivel, perder, ganar o cambiar de pestaña.
- Se reanuda al continuar la partida.
- El botón 🔊/🔇 recuerda la preferencia mediante `localStorage`.
- La caché de la PWA se ha actualizado a `banana-rush-mobile-v3-music`.

## Archivo de audio

- Duración aproximada: 3 min 15 s.
- Estéreo, 48 kHz.
- El flujo de audio se ha copiado sin recodificar para evitar pérdida adicional de calidad.
