// Arranque y navegación entre pantallas
import { $, desbloquearAudio, pantallaEncendida } from './util.js';
import { hoy } from './calendario.js';
import { renderHoy } from './hoy.js';
import { renderProgreso } from './progreso.js';
import { renderGuia } from './guia.js';
import { renderAjustes } from './ajustes.js';
import { renderCalc } from './calc.js';
import { initTimer } from './timer.js';
import { initCarrera } from './sabado.js';

const VISTAS = { hoy: renderHoy, progreso: renderProgreso, calc: renderCalc, guia: renderGuia, ajustes: renderAjustes };
let actual = 'hoy', fechaPintada = null;
const vista = $('#vista');

function ir(v, { arriba = true } = {}) {
  if (!VISTAS[v]) v = 'hoy';
  if (v !== 'hoy') pantallaEncendida(false);
  actual = v;
  fechaPintada = hoy();
  document.querySelectorAll('#tabs [data-v]').forEach(b => {
    const on = b.dataset.v === v;
    b.classList.toggle('act', on);
    b.setAttribute('aria-current', on ? 'page' : 'false');
  });
  vista.classList.remove('entra'); void vista.offsetWidth; vista.classList.add('entra');
  VISTAS[v](vista);
  if (arriba) scrollTo(0, 0);
}

$('#tabs').addEventListener('click', e => {
  const b = e.target.closest('[data-v]');
  if (!b) return;
  if (b.dataset.v === actual) scrollTo({ top: 0, behavior: 'smooth' });
  else location.hash = b.dataset.v;
});
addEventListener('hashchange', () => ir(location.hash.slice(1)));
addEventListener('mr:refrescar', () => VISTAS[actual](vista));

// iOS solo deja sonar audio dentro de un toque: lo "despertamos" en cada toque.
// touchend y click cuentan como toque para Safari; pointerdown no siempre.
for (const ev of ['pointerdown', 'touchend', 'click']) addEventListener(ev, desbloquearAudio, { passive: true, capture: true });

// Si la app queda abierta y cambia el día (medianoche), se actualiza sola
document.addEventListener('visibilitychange', () => {
  if (document.visibilityState === 'visible' && fechaPintada !== hoy()) ir(actual, { arriba: false });
});

initTimer();
initCarrera();
ir(location.hash.slice(1) || 'hoy');

if ('serviceWorker' in navigator && location.protocol !== 'file:') {
  navigator.serviceWorker.register('./sw.js').catch(() => { });
}
navigator.storage?.persist?.().catch(() => { });
