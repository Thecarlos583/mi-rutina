import { S } from './store.js';

export const $ = (sel, raiz = document) => raiz.querySelector(sel);
export const fmt = s => { s = Math.max(0, Math.ceil(s)); return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`; };
export const num = n => String(n).replace('.', ',');

// ── Íconos (trazo, 24×24) ───────────────────────────────────
const P = {
  hoy: '<path d="M6.5 6.5v11M17.5 6.5v11M3.5 9.5v5M20.5 9.5v5M6.5 12h11"/>',
  progreso: '<path d="M4 4v16h16"/><path d="M8 15l3.5-4 3 2.5L20 7"/>',
  guia: '<path d="M5 5.5A2.5 2.5 0 0 1 7.5 3H19v14H7.5A2.5 2.5 0 0 0 5 19.5z"/><path d="M5 19.5A2.5 2.5 0 0 0 7.5 22H19v-5"/>',
  ajustes: '<path d="M4 7h9M17 7h3M4 17h3M11 17h9"/><circle cx="15" cy="7" r="2"/><circle cx="9" cy="17" r="2"/>',
  check: '<path d="M5 12.5l4.5 4.5L19 7.5"/>',
  cambiar: '<path d="M7 3L3 7l4 4"/><path d="M3 7h13a4 4 0 0 1 4 4"/><path d="M17 21l4-4-4-4"/><path d="M21 17H8a4 4 0 0 1-4-4"/>',
  abajo: '<path d="M6 9l6 6 6-6"/>',
  deshacer: '<path d="M9 14L4 9l5-5"/><path d="M4 9h10.5a5.5 5.5 0 0 1 0 11H11"/>',
  play: '<path d="M7 4.5v15l12-7.5z" fill="currentColor"/>',
  pausa: '<path d="M8 5v14M16 5v14"/>',
  saltar: '<path d="M5 5l10 7-10 7z" fill="currentColor"/><path d="M19 5v14"/>',
  cerrar: '<path d="M6 6l12 12M18 6L6 18"/>',
  fuego: '<path d="M12 22c4.4 0 7.5-3 7.5-7.2 0-3.6-2.3-6-4.1-8.3-.1 2.3-1.2 3.6-2.6 3.6C11 10.1 12.3 5.5 9 2.5 9 6.6 4.5 9.3 4.5 14.8 4.5 19 7.8 22 12 22z"/>',
  luna: '<path d="M20 14.5A8.5 8.5 0 0 1 9.5 4a8.5 8.5 0 1 0 10.5 10.5z"/>',
  cal: '<rect x="3" y="5" width="18" height="16" rx="3"/><path d="M3 10h18M8 3v4M16 3v4"/>',
  bajar: '<path d="M12 4v11M7 10l5 5 5-5M5 20h14"/>',
  subir: '<path d="M12 15V4M7 9l5-5 5 5M5 20h14"/>',
  basura: '<path d="M4 7h16M10 11v6M14 11v6M6 7l1 13h10l1-13M9 7V4h6v3"/>',
  reloj: '<circle cx="12" cy="13" r="8"/><path d="M12 9v4l2.5 2.5M9 2h6"/>',
  trofeo: '<path d="M8 21h8M12 17v4M7 4h10v5a5 5 0 0 1-10 0z"/><path d="M7 6H4v1a3 3 0 0 0 3 3M17 6h3v1a3 3 0 0 1-3 3"/>',
  ola: '<path d="M2 12c2.5 0 2.5-2 5-2s2.5 2 5 2 2.5-2 5-2 2.5 2 5 2"/><path d="M2 17c2.5 0 2.5-2 5-2s2.5 2 5 2 2.5-2 5-2 2.5 2 5 2"/>',
  mas: '<path d="M12 5v14M5 12h14"/>',
  menos: '<path d="M5 12h14"/>',
  correr: '<circle cx="14" cy="4.5" r="2"/><path d="M8 21l3-6 3 2v5M6 12l3-3.5 4 1 3 3.5 3-1M11 15l2-5.5"/>',
};
export const ico = (n, cls = '') => `<svg class="ico ${cls}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${P[n] || ''}</svg>`;

// Anillo de progreso SVG
export function anillo(frac, { tam = 96, grosor = 9, id = 'g' + Math.random().toString(36).slice(2, 7), c1 = '#FF6B4A', c2 = '#FF9F43', centro = '' } = {}) {
  const r = (tam - grosor) / 2, L = 2 * Math.PI * r, f = Math.min(1, Math.max(0, frac));
  return `<div class="anillo" style="width:${tam}px;height:${tam}px">
    <svg viewBox="0 0 ${tam} ${tam}" width="${tam}" height="${tam}">
      <defs><linearGradient id="${id}" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${c1}"/><stop offset="1" stop-color="${c2}"/></linearGradient></defs>
      <circle cx="${tam / 2}" cy="${tam / 2}" r="${r}" fill="none" stroke="var(--linea)" stroke-width="${grosor}"/>
      <circle class="anillo-arco" cx="${tam / 2}" cy="${tam / 2}" r="${r}" fill="none" stroke="url(#${id})" stroke-width="${grosor}" stroke-linecap="round"
        stroke-dasharray="${L}" stroke-dashoffset="${L * (1 - f)}" data-l="${L}" transform="rotate(-90 ${tam / 2} ${tam / 2})"/>
    </svg><div class="anillo-c">${centro}</div></div>`;
}
export function moverAnillo(raiz, frac) {
  const c = raiz?.querySelector('.anillo-arco');
  if (c) c.style.strokeDashoffset = c.dataset.l * (1 - Math.min(1, Math.max(0, frac)));
}

// ── Háptica ─────────────────────────────────────────────────
// Android: vibrate(). iPhone (iOS 18+): el truco del interruptor nativo da un toque
// háptico, solo cuando viene de un toque en pantalla.
export function vibrar(patron = 18) {
  if (!S().ajustes.haptica) return;
  if (navigator.vibrate) { navigator.vibrate(patron); return; }
  try {
    const l = document.createElement('label');
    const i = document.createElement('input');
    i.type = 'checkbox'; i.setAttribute('switch', '');
    l.appendChild(i);
    l.style.cssText = 'position:fixed;left:-99px;opacity:0;pointer-events:none';
    document.body.appendChild(l);
    l.click();
    l.remove();
  } catch { /* sin háptica, no pasa nada */ }
}

// ── Sonido (Web Audio, sin archivos) ────────────────────────
let actx = null;
export function desbloquearAudio() {
  try {
    if (!actx) {
      const AC = window.AudioContext || window.webkitAudioContext;
      if (!AC) return;
      // 'transient' baja tu música un instante en vez de cortarla
      try { if (navigator.audioSession) navigator.audioSession.type = 'transient'; } catch { }
      actx = new AC();
    }
    if (actx.state !== 'running') actx.resume();
    const b = actx.createBuffer(1, 1, 22050), s = actx.createBufferSource();
    s.buffer = b; s.connect(actx.destination); s.start(0);
  } catch { }
}
export function pitido(freq = 880, dur = 0.14, en = 0, vol = 0.28) {
  if (!S().ajustes.sonido || !actx || actx.state !== 'running') return;
  const t = actx.currentTime + en, o = actx.createOscillator(), g = actx.createGain();
  o.type = 'sine'; o.frequency.value = freq;
  g.gain.setValueAtTime(0.0001, t);
  g.gain.exponentialRampToValueAtTime(vol, t + 0.012);
  g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
  o.connect(g).connect(actx.destination);
  o.start(t); o.stop(t + dur + 0.03);
}
export const sonar = {
  serie: () => pitido(1175, 0.07, 0, 0.12),
  tic: () => pitido(740, 0.08, 0, 0.2),
  fin: () => { pitido(880, 0.15); pitido(880, 0.15, 0.2); pitido(1320, 0.45, 0.4); },
  trote: () => { pitido(988, 0.12); pitido(1319, 0.3, 0.16); },
  camina: () => { pitido(784, 0.14); pitido(587, 0.32, 0.18); },
  logro: () => [523, 659, 784, 1047].forEach((f, i) => pitido(f, 0.22, i * 0.11, 0.22)),
};

// ── Pantalla encendida (Wake Lock) ──────────────────────────
let lock = null, quiero = false;
export async function pantallaEncendida(on) {
  quiero = on && S().ajustes.pantalla;
  try {
    if (quiero && 'wakeLock' in navigator && !lock && document.visibilityState === 'visible') {
      lock = await navigator.wakeLock.request('screen');
      lock.addEventListener('release', () => { lock = null; });
    } else if (!quiero && lock) { await lock.release(); lock = null; }
  } catch { lock = null; }
}
document.addEventListener('visibilitychange', () => { if (document.visibilityState === 'visible' && quiero) pantallaEncendida(true); });

// ── Aviso breve ─────────────────────────────────────────────
let tt;
export function aviso(msg, icono = '') {
  const t = $('#aviso');
  t.innerHTML = (icono ? ico(icono) : '') + `<span>${msg}</span>`;
  t.classList.add('visible');
  clearTimeout(tt);
  tt = setTimeout(() => t.classList.remove('visible'), 2600);
}

// ── Hoja inferior ───────────────────────────────────────────
export function abrirHoja(html) {
  const raiz = $('#hoja');
  raiz.innerHTML = `<div class="hoja-fondo" data-cerrar></div><section class="hoja" role="dialog" aria-modal="true"><div class="hoja-asa"></div>${html}</section>`;
  raiz.hidden = false;
  requestAnimationFrame(() => requestAnimationFrame(() => raiz.classList.add('abierta')));
  raiz.querySelector('[data-cerrar]').onclick = cerrarHoja;
  const h = raiz.querySelector('.hoja');
  arrastrarParaCerrar(h);
  return h;
}
export function cerrarHoja() {
  const raiz = $('#hoja');
  raiz.classList.remove('abierta');
  setTimeout(() => { if (!raiz.classList.contains('abierta')) { raiz.hidden = true; raiz.innerHTML = ''; } }, 300);
}
function arrastrarParaCerrar(h) {
  let y0 = null, dy = 0;
  h.addEventListener('touchstart', e => { if (h.scrollTop <= 0) { y0 = e.touches[0].clientY; dy = 0; h.style.transition = 'none'; } }, { passive: true });
  h.addEventListener('touchmove', e => {
    if (y0 === null) return;
    dy = Math.max(0, e.touches[0].clientY - y0);
    if (dy > 0) h.style.transform = `translateY(${dy}px)`;
  }, { passive: true });
  h.addEventListener('touchend', () => {
    if (y0 === null) return;
    h.style.transition = ''; h.style.transform = '';
    if (dy > 110) cerrarHoja();
    y0 = null;
  });
}

// ── Confeti discreto ────────────────────────────────────────
export function confeti() {
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const c = $('#confeti'), ctx = c.getContext('2d'), dpr = devicePixelRatio || 1;
  const W = innerWidth, H = innerHeight;
  c.width = W * dpr; c.height = H * dpr; ctx.scale(dpr, dpr);
  const cols = ['#FF6B4A', '#FF9F43', '#FFD43B', '#2ED47A', '#4C8DFF', '#A66CFF', '#FF5C8A', '#38BDF8'];
  const ps = Array.from({ length: 110 }, (_, i) => ({
    x: W / 2 + (Math.random() - 0.5) * 60, y: H * 0.38,
    vx: (Math.random() - 0.5) * 11, vy: -Math.random() * 11 - 5,
    r: Math.random() * 6, vr: (Math.random() - 0.5) * 0.35,
    w: 5 + Math.random() * 6, h: 3 + Math.random() * 4, c: cols[i % cols.length],
  }));
  const t0 = performance.now(), DUR = 2800;
  (function cuadro(t) {
    const el = t - t0;
    ctx.clearRect(0, 0, W, H);
    for (const p of ps) {
      p.vy += 0.3; p.vx *= 0.985; p.x += p.vx; p.y += p.vy; p.r += p.vr;
      ctx.save(); ctx.globalAlpha = Math.max(0, 1 - el / DUR);
      ctx.translate(p.x, p.y); ctx.rotate(p.r);
      ctx.fillStyle = p.c; ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h * Math.abs(Math.cos(p.r * 2)) + 1);
      ctx.restore();
    }
    if (el < DUR) requestAnimationFrame(cuadro); else ctx.clearRect(0, 0, W, H);
  })(t0);
}

// Número "estable" por fecha, para elegir frases sin que cambien al recargar
export const semilla = f => [...f].reduce((a, ch) => (a * 31 + ch.charCodeAt(0)) >>> 0, 7);
