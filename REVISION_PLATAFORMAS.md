# Revisión de plataformas de Banana Rush

## Problema localizado

Los niveles se generan de forma determinista, pero el cambio vertical entre plataformas podía superar la altura práctica del salto normal. Esto dejaba pasos imposibles en varias fases, especialmente en las fases 3, 6, 7 y 8.

## Cambios aplicados

1. La altura de referencia de la primera plataforma se inicia en la altura del suelo (`ee`, 475) en lugar de 405.
2. El cambio vertical aleatorio se limita al intervalo de 25 a 85 píxeles, en lugar de crecer hasta valores superiores a 130 píxeles.
3. Se mantiene sin cambios la fuerza del salto, la gravedad, la velocidad del personaje y la disposición horizontal general.
4. El archivo JavaScript corregido usa un nombre nuevo para evitar que el navegador reutilice el paquete anterior.
5. La caché del service worker pasa de `banana-rush-mobile-v1` a `banana-rush-mobile-v2`.

## Validación

Se reprodujo el generador determinista de los diez niveles y se ejecutó una simulación de la física de salto y colisiones. Con la versión corregida, todos los pasos consecutivos de los diez niveles resultan alcanzables sin depender del potenciador de doble salto.

## Limitación

El ZIP recibido contiene únicamente la versión compilada de producción. No incluye `src/`, `package.json` ni la configuración original de Vite/React, por lo que la corrección se ha realizado directamente sobre el bundle compilado.
