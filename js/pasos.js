// "Cómo se hace" con poses fijas: 3 o 4 dibujos numerados que se deslizan, con flechas del movimiento,
// un paso corto debajo de cada uno, la zona a cuidar en coral y el bloque "Así sí / Así no".
// Usa el mismo esqueleto de anim.js (segmentos de largo fijo y articulaciones dentro de rangos humanos).
import { dibujarPose, defBase } from './anim.js';
import { PASOS } from './pasos-datos.js';

export const tienePasos = id => !!PASOS[id];

// Zona a cuidar → partes de la figura que se pintan
const SEGS = { espalda: ['torso'], codo: ['brazo', 'ante'], rodilla: ['muslo', 'canilla'], cadera: ['cadera'], hombro: ['hombro'], manos: ['ante'], pies: ['canilla'] };
const pintarZona = (zona, color) => Object.fromEntries((SEGS[zona] || []).map(s => [s, color]));
const NOMBRE_VISTA = { lado: 'De lado', frente: 'De frente' };

function svgPose(def, pose, vista, siguiente, color, etiqueta) {
  const d = { ...def, __m: pose.punto ? pintarZona(pose.punto.zona, color) : {} };
  return `<svg class="video-svg" viewBox="0 0 240 196" role="img" aria-label="${etiqueta}">${dibujarPose(d, pose, vista, pose.punto ? { zona: pose.punto.zona } : null, null, siguiente)}</svg>`;
}

export function montarPasos(cont, id) {
  const x = PASOS[id];
  if (!x) return;
  const def = { ...defBase(id), ...(x.def || {}) };
  const vistas = x.vistas || ['lado'];
  let vista = vistas[0];
  const pintar = () => {
    const n = x.poses.length;
    const poses = x.poses.map((p, i) => {
      const sig = i < n - 1 ? x.poses[i + 1] : x.vuelve != null ? x.poses[x.vuelve] : null;
      return `<figure class="pose">
        <span class="pose-n">${i + 1}</span>
        ${svgPose(def, p, vista, sig, 'var(--acento)', `Paso ${i + 1}: ${p.n}`)}
        <figcaption><b>${i + 1}. ${p.n}</b>${p.punto?.txt ? `<span class="cuida">${p.punto.txt}</span>` : ''}</figcaption>
      </figure>`;
    }).join('');
    const vSiNo = x.siNo || vista;
    cont.innerHTML = `
      ${vistas.length > 1 ? `<div class="seg pasos-vista" role="radiogroup" aria-label="Vista">${vistas.map(v => `<button data-vista="${v}" role="radio" aria-checked="${v === vista}">${NOMBRE_VISTA[v]}</button>`).join('')}</div>` : ''}
      <div class="poses" tabindex="0" aria-label="Pasos del ejercicio. Desliza para ver el siguiente">${poses}</div>
      <p class="poses-ayuda">Desliza para ver los ${n} pasos · la flecha marca hacia dónde te mueves</p>
      <div class="si-no">
        <figure class="si">${svgPose(def, { ...x.bien.pose, punto: x.bien.punto }, vSiNo, null, 'var(--bien)', `Así sí: ${x.bien.txt}`)}<figcaption><b>✅ Así sí</b><span>${x.bien.txt}</span></figcaption></figure>
        <figure class="no">${svgPose(def, { ...x.mal.pose, punto: x.mal.punto }, vSiNo, null, 'var(--acento)', `Así no: ${x.mal.txt}`)}<figcaption><b>❌ Así no</b><span>${x.mal.txt}</span></figcaption></figure>
      </div>`;
  };
  pintar();
  ajustar(cont);
  cont.onclick = ev => {
    const b = ev.target.closest('[data-vista]');
    if (!b || b.dataset.vista === vista) return;
    vista = b.dataset.vista;
    pintar();
    ajustar(cont);
  };
}

// Acerca el dibujo a la figura: mismo encuadre para todas las poses de una fila (para comparar) y el piso abajo
function encuadrar(svgs) {
  let x0 = Infinity, y0 = Infinity, x1 = -Infinity;
  for (const svg of svgs) for (const el of svg.querySelectorAll('*')) {
    if (el.matches('.suelo, .sombra, .marca.oculta') || !el.getBBox) continue;
    const b = el.getBBox();
    if (!b.width && !b.height) continue;
    x0 = Math.min(x0, b.x); y0 = Math.min(y0, b.y); x1 = Math.max(x1, b.x + b.width);
  }
  if (!Number.isFinite(x0)) return;
  const PAD = 12, piso = 190, alto = piso - (y0 - PAD), ancho = Math.max(x1 - x0 + PAD * 2, alto * 240 / 196);
  const h = ancho * 196 / 240, cx = (x0 + x1) / 2;
  const vb = `${(cx - ancho / 2).toFixed(1)} ${(piso - h).toFixed(1)} ${ancho.toFixed(1)} ${h.toFixed(1)}`;
  svgs.forEach(s => s.setAttribute('viewBox', vb));
}
function ajustar(cont) {
  try {
    encuadrar([...cont.querySelectorAll('.poses .video-svg')]);
    encuadrar([...cont.querySelectorAll('.si-no .video-svg')]);
  } catch { /* si el navegador no puede medir, queda el encuadre normal */ }
}
