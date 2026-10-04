# Mi Rutina

App web personal (PWA) para seguir la rutina del gym desde el iPhone. HTML, CSS y JS puro, sin build. Funciona sin internet, y todos los datos se guardan solo en el teléfono (localStorage).

## Estructura

```
index.html          pantallas fijas (descanso, trote, pestañas)
manifest.json       datos de la app instalable
sw.js               caché para usarla sin internet
css/styles.css      todo el diseño
icons/              ícono propio (SVG + PNG)
js/data.js          ← LA RUTINA: ejercicios, alternativas, plan A/B, sábado, hábitos
js/app.js           arranque y pestañas
js/hoy.js           pantalla Hoy (tarjetas, series, pesos, cambios, hábitos)
js/sabado.js        sábado + trote guiado por intervalos
js/timer.js         temporizador de descanso
js/progreso.js      racha, calendario, cintura, gráficas de pesos
js/guia.js · js/ajustes.js
js/rutina.js        lógica del plan (qué toca hoy, historial)
js/calendario.js    fechas y semana 1-4 (A/B/A/B)
js/cuerpo.js        mapa del cuerpo en SVG
js/store.js         guardado en localStorage
js/util.js          sonido, vibración, confeti, hoja inferior, íconos
```

## Cambiar la rutina

Todo está en `js/data.js`. Después de editar cualquier archivo, sube `VERSION` en `sw.js` (por ejemplo, `mi-rutina-v2`) para que el teléfono descargue lo nuevo.

## Probar en la PC

```
python -m http.server 8765
```
Abre `http://localhost:8765`. Para simular otro día: `http://localhost:8765/?fecha=2026-10-10`.
