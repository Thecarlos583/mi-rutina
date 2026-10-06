// Temporizador de descanso: círculo grande + mini barra cuando te mueves de pantalla.
// Se basa en la hora de fin (no en contar ticks), así que sigue exacto aunque bloquees el teléfono.
import { S, guardar } from './store.js';
import { $, fmt, sonar, vibrar, pantallaEncendida } from './util.js';

const R = 118, L = 2 * Math.PI * R;
let t = null, raf = 0, ultimoSeg = null, terminando = false, grande = false, cierre = 0;

export const descansoActivo = () => !!t;

export function iniciarDescanso(seg, titulo, sub = '') {
  t = { fin: Date.now() + seg * 1000, total: seg, titulo, sub };
  S().timer = t; guardar();
  terminando = false; ultimoSeg = null; clearTimeout(cierre);
  $('#descanso').classList.remove('listo'); $('#mini').classList.remove('listo');
  $('#descanso [data-t=saltar]').textContent = 'Saltar';
  pantallaEncendida(true); // que el teléfono no se bloquee mientras cuenta
  mostrar(true);
  bucle();
}

export function restaurarDescanso() {
  const x = S().timer;
  if (x && x.fin > Date.now()) { t = x; mostrar(false); bucle(); }
  // Terminó con la app cerrada hace poco: se avisa al abrirla
  else if (x && Date.now() - x.fin < 5 * 60 * 1000) { t = x; mostrar(true); pintar(); }
  else if (x) { S().timer = null; guardar(); }
}

function mostrar(g) {
  grande = g;
  const d = $('#descanso');
  if (g) {
    d.hidden = false;
    requestAnimationFrame(() => requestAnimationFrame(() => d.classList.add('abierto')));
  } else {
    d.classList.remove('abierto');
    setTimeout(() => { if (!grande) d.hidden = true; }, 280);
  }
  $('#mini').hidden = g || !t;
  document.body.classList.toggle('con-mini', !g && !!t);
  if (t) {
    $('#descanso .descanso-titulo').textContent = t.titulo;
    $('#descanso .descanso-sub').textContent = t.sub;
    $('#mini .mini-txt').textContent = t.titulo;
  }
  pintar();
}

function pintar() {
  if (!t) return;
  const resta = (t.fin - Date.now()) / 1000;
  const frac = Math.max(0, resta / t.total);
  $('#reloj-arco').style.strokeDashoffset = L * (1 - frac);
  const txt = terminando ? '¡Listo!' : fmt(resta);
  $('#descanso .reloj-num').textContent = txt;
  $('#mini .mini-num').textContent = txt;
  $('#mini .mini-barra').style.transform = `scaleX(${frac})`;
  const seg = Math.ceil(resta);
  if (seg !== ultimoSeg) {
    if (seg <= 3 && seg > 0 && ultimoSeg !== null) sonar.tic();
    ultimoSeg = seg;
  }
  if (resta <= 0) terminar();
}

function bucle() {
  cancelAnimationFrame(raf);
  const paso = () => { pintar(); if (t && !terminando) raf = requestAnimationFrame(paso); };
  raf = requestAnimationFrame(paso);
}

// Fin: pantalla destacada, 3 pitidos fuertes y el círculo cambia de color y parpadea (el iPhone no vibra)
function terminar() {
  if (terminando) return;
  terminando = true;
  if (!grande) mostrar(true);
  $('#descanso .reloj-num').textContent = '¡Listo!';
  $('#mini .mini-num').textContent = '¡Listo!';
  $('#descanso .descanso-titulo').textContent = '¡Descanso terminado!';
  $('#descanso .descanso-sub').textContent = 'A la siguiente serie.';
  $('#descanso').classList.add('listo'); $('#mini').classList.add('listo');
  $('#descanso [data-t=saltar]').textContent = 'Seguir';
  sonar.fin();
  vibrar([260, 120, 260]);
  dispatchEvent(new Event('mr:descanso-fin'));
  clearTimeout(cierre);
  cierre = setTimeout(cerrar, 12000);
}

function cerrar() {
  clearTimeout(cierre);
  cancelAnimationFrame(raf);
  t = null; terminando = false;
  S().timer = null; guardar();
  mostrar(false);
}

function ajustar(d) {
  if (!t || terminando) return;
  t.fin += d * 1000;
  if (d > 0) t.total += d;
  S().timer = t; guardar();
  vibrar();
  pintar();
}

export function initTimer() {
  const arco = $('#reloj-arco');
  arco.setAttribute('r', R);
  arco.style.strokeDasharray = L;
  $('#descanso').addEventListener('click', e => {
    const b = e.target.closest('[data-t]');
    if (!b) return;
    const a = b.dataset.t;
    if (a === 'min') mostrar(false);
    else if (a === 'saltar' || terminando) { vibrar(); cerrar(); }
    else ajustar(Number(a));
  });
  $('#mini').addEventListener('click', () => { if (t) mostrar(true); });
  // Al volver a la app se recalcula con la hora de fin: si ya terminó, avisa de una vez
  document.addEventListener('visibilitychange', () => { if (document.visibilityState === 'visible' && t) { pintar(); if (!terminando) bucle(); } });
  restaurarDescanso();
}
