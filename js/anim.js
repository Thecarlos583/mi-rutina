// Videos de los ejercicios: figura humana en SVG animada pose a pose (100% sin internet).
// Cada pose son ángulos de articulación; el motor calcula el cuerpo (cinemática directa),
// lo apoya en el piso, en un asiento o en un banco, y lo interpola cuadro a cuadro.
//
// Ángulos (grados), vista de lado mirando a la derecha:
//   torso: inclinación adelante (negativo = atrás) · cadera: flexión · rodilla: flexión (nunca negativa)
//   punta: pie en puntas · hombro: flexión (0 = brazo abajo, 90 = al frente, 180 = arriba, negativo = atrás)
//   codo: flexión · cabeza: inclinación · giro: rota todo el cuerpo (−90 = boca arriba, 90 = boca abajo)
//   Sufijo 2 (cadera2, hombro2…) = pierna o brazo del fondo; si falta, copia al de adelante.
//   dx / dy: avance y altura.
// Vista de frente: ancho (separación de pies), valgo, lat (desplazamiento lateral), rodLat,
//   hF / cF: abducción del brazo y flexión del codo (con def.brazosF) · tr: giro del tronco.
// Apoyo (def.apoyo o pose.apoyo): 1 / 2 = pie de adelante / del fondo · 'cuerpo' = lo más bajo toca el piso.
// def.ancla = 'cadera': la cadera queda fija en (x0 + dx, y0 − dy), para máquinas con asiento.
// def.vuelta = ['hombro', …]: esos ángulos dan la vuelta completa (círculos).
import { ANIM } from './poses.js';

const L = { torso: 38, cuello: 5, cabeza: 9.5, muslo: 33, pierna: 32, pie: 12, brazo: 22, ante: 20 };
// Grosor de cada parte del cuerpo (ancho al inicio → al final del segmento)
const G = { torso: [15, 19], muslo: [12, 8.5], canilla: [8, 5.5], brazo: [7.5, 6], ante: [6, 4.6], cuello: [6, 6] };
export const SUELO = 182;
const PARAMS = ['torso', 'cadera', 'rodilla', 'punta', 'hombro', 'codo', 'cadera2', 'rodilla2', 'punta2', 'hombro2', 'codo2',
  'dx', 'dy', 'cabeza', 'giro', 'ancho', 'valgo', 'lat', 'rodLat', 'hF', 'cF', 'hF2', 'cF2', 'curva', 'tr'];
const rad = g => g * Math.PI / 180;
const vec = (a, l) => [Math.sin(rad(a)) * l, Math.cos(rad(a)) * l];
const sum = (p, v) => [p[0] + v[0], p[1] + v[1]];
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
const f1 = n => n.toFixed(1);
const medio = (a, b) => [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2];

// Completa la pose: lo que falta del lado 2 copia al lado 1; rodillas y codos nunca al revés
function completar(p, def = {}) {
  const q = { ...p, __ok: true };
  for (const k of ['cadera', 'rodilla', 'punta', 'hombro', 'codo', 'hF', 'cF']) { q[k] ??= 0; q[k + '2'] ??= q[k]; }
  q.ancho ??= def.ancho ?? 11;
  for (const k of PARAMS) q[k] ??= 0;
  for (const k of ['rodilla', 'rodilla2']) q[k] = clamp(q[k], 0, 140);
  for (const k of ['codo', 'codo2']) q[k] = clamp(q[k], 0, 145);
  for (const k of ['cadera', 'cadera2']) q[k] = clamp(q[k], -40, 140);
  return q;
}

// Cinemática directa desde la cadera (coordenadas locales)
function local(p) {
  const t = p.torso;
  const cad = [0, 0];
  const hom = vec(180 - t, L.torso);
  const cue = sum(hom, vec(180 - t - p.cabeza, L.cuello));
  const cab = sum(hom, vec(180 - t - p.cabeza, L.cuello + L.cabeza));
  const pierna = (h, k, pu) => {
    const am = -t + h, rod = vec(am, L.muslo);
    const tob = sum(rod, vec(am - k, L.pierna));
    const pie = 90 - pu;
    return { rod, tob, punta: sum(tob, vec(pie, L.pie)), talon: sum(tob, vec(pie, -4)) };
  };
  const brazo = (s, e) => {
    const ab = -t + s, cod = sum(hom, vec(ab, L.brazo));
    return { cod, mano: sum(cod, vec(ab + e, L.ante)) };
  };
  let f = { cad, hom, cue, cab, p1: pierna(p.cadera, p.rodilla, p.punta), p2: pierna(p.cadera2, p.rodilla2, p.punta2), b1: brazo(p.hombro, p.codo), b2: brazo(p.hombro2, p.codo2) };
  if (p.giro) {
    const c = Math.cos(rad(p.giro)), s = Math.sin(rad(p.giro));
    f = mapear(f, ([x, y]) => [x * c - y * s, x * s + y * c]);
  }
  return f;
}
const mapear = (o, fn) => Object.fromEntries(Object.entries(o).map(([k, v]) => [k, Array.isArray(v) ? fn(v) : mapear(v, fn)]));
const puntos = f => [f.cad, f.hom, [f.cab[0], f.cab[1] + L.cabeza - 3], f.p1.rod, f.p1.tob, f.p1.punta, f.p1.talon, f.p2.rod, f.p2.tob, f.p2.punta, f.p2.talon, f.b1.cod, f.b1.mano, f.b2.cod, f.b2.mano];

// Dónde va la figura: pie clavado, cuerpo acostado o cadera fija en un asiento
function anclar(f, p, def, apoyo) {
  if (def.ancla === 'cadera') return { ox: (def.x0 ?? 110) + p.dx, oy: (def.y0 ?? 120) - p.dy };
  if (apoyo === 'cuerpo') {
    const bajo = Math.max(...puntos(f).map(q => q[1])) + 3;
    return { ox: (def.x0 ?? 110) + p.dx, oy: (def.piso ?? SUELO) - p.dy - bajo };
  }
  const pa = apoyo === 2 ? f.p2 : f.p1;
  return { ox: (def.x0 ?? 110) + p.dx - pa.punta[0], oy: SUELO - p.dy - (def.puntas ? pa.punta[1] : Math.max(pa.punta[1], pa.talon[1])) };
}
function figura(p, def, fijo = null) {
  const f = local(p);
  const o = fijo?.ox !== undefined ? fijo : anclar(f, p, def, fijo?.apoyo ?? p.apoyo ?? def.apoyo ?? 1);
  return mapear(f, ([x, y]) => [x + o.ox, y + o.oy]);
}
const traslado = (p, def) => anclar(local(p), p, def, p.apoyo ?? def.apoyo ?? 1);

// ── Dibujo del cuerpo con volumen ────────────────────────────
// Segmento con grosor que se afina (cápsula); las uniones se redondean con círculos
function capsula(a, b, wa, wb, cls, color) {
  const dx = b[0] - a[0], dy = b[1] - a[1], l = Math.hypot(dx, dy) || 1, nx = -dy / l, ny = dx / l;
  const q = [[a[0] + nx * wa / 2, a[1] + ny * wa / 2], [b[0] + nx * wb / 2, b[1] + ny * wb / 2], [b[0] - nx * wb / 2, b[1] - ny * wb / 2], [a[0] - nx * wa / 2, a[1] - ny * wa / 2]];
  return `<path class="${cls}"${color ? ` style="fill:${color}"` : ''} d="M${q.map(z => `${f1(z[0])} ${f1(z[1])}`).join('L')}Z"/>`;
}
const bola = (c, r, cls, color) => `<circle class="${cls}"${color ? ` style="fill:${color}"` : ''} cx="${f1(c[0])}" cy="${f1(c[1])}" r="${f1(r)}"/>`;
const ln = (a, b, cls) => `<line class="${cls}" x1="${f1(a[0])}" y1="${f1(a[1])}" x2="${f1(b[0])}" y2="${f1(b[1])}"/>`;

// Torso de lado: de la cadera al hombro, con la espalda recta, redonda (curva +) o hundida (curva −)
function torsoLado(f, curva, color) {
  const d = [f.hom[0] - f.cad[0], f.hom[1] - f.cad[1]], l = Math.hypot(...d) || 1, u = [d[0] / l, d[1] / l], n = [u[1], -u[0]];
  const m = [medio(f.cad, f.hom)[0] + n[0] * curva, medio(f.cad, f.hom)[1] + n[1] * curva];
  const [wa, wb] = G.torso, wm = (wa + wb) / 2 + 1;
  const lado = s => [[f.cad[0] + n[0] * wa / 2 * s, f.cad[1] + n[1] * wa / 2 * s], [m[0] + n[0] * wm / 2 * s, m[1] + n[1] * wm / 2 * s], [f.hom[0] + n[0] * wb / 2 * s, f.hom[1] + n[1] * wb / 2 * s]];
  const a = lado(1), b = lado(-1);
  const P = z => `${f1(z[0])} ${f1(z[1])}`;
  return `<path class="cuerpo torso"${color ? ` style="fill:${color}"` : ''} d="M${P(a[0])}Q${P(a[1])} ${P(a[2])}L${P(b[2])}Q${P(b[1])} ${P(b[0])}Z"/>`;
}

function pie(x, cls) {
  const d = [x.punta[0] - x.talon[0], x.punta[1] - x.talon[1]], l = Math.hypot(...d) || 1, n = [-d[1] / l, d[0] / l];
  const s = x.tob, a = [x.talon[0] - n[0] * 1.5, x.talon[1] - n[1] * 1.5], b = [x.punta[0] - n[0] * 0.5, x.punta[1] - n[1] * 0.5];
  return `<path class="${cls}" d="M${f1(s[0] + n[0] * 3)} ${f1(s[1] + n[1] * 3)}L${f1(a[0])} ${f1(a[1])}L${f1(b[0])} ${f1(b[1])}L${f1(b[0] + n[0] * 3)} ${f1(b[1] + n[1] * 3)}Z"/>`;
}

// Color de los músculos que trabaja: def.__m = { torso, brazo, ante, muslo, canilla, hombro, cadera } → color
function lado(p, def, punto, fijo) {
  const f = figura(p, def, fijo), m = def.__m || {};
  const pierna = (x, cls) => capsula(f.cad, x.rod, ...G.muslo, cls, m.muslo) + bola(x.rod, G.muslo[1] / 2, cls, m.muslo)
    + capsula(x.rod, x.tob, ...G.canilla, cls, m.canilla) + bola(x.tob, G.canilla[1] / 2, cls) + pie(x, cls);
  const brazo = (x, cls) => capsula(f.hom, x.cod, ...G.brazo, cls, m.brazo) + bola(x.cod, G.brazo[1] / 2, cls, m.brazo)
    + capsula(x.cod, x.mano, ...G.ante, cls, m.ante) + bola(x.mano, 3.2, cls);
  let s = sombra(f) + equipoMovil(def, f, p, 'lado', true);
  s += brazo(f.b2, 'cuerpo fondo') + pierna(f.p2, 'cuerpo fondo');
  s += bola(f.cad, G.torso[0] / 2, 'cuerpo', m.cadera) + torsoLado(f, p.curva, m.torso) + bola(f.hom, G.torso[1] / 2 - 1, 'cuerpo', m.hombro);
  s += capsula(f.hom, f.cue, ...G.cuello, 'cuerpo') + bola(f.cab, L.cabeza, 'cuerpo cabeza');
  s += pierna(f.p1, 'cuerpo') + brazo(f.b1, 'cuerpo');
  s += equipoMovil(def, f, p, 'lado');
  s += marca(punto, { rodilla: [f.p1.rod], cadera: [f.cad], pies: [f.p1.tob], hombro: [f.hom], manos: [f.b1.mano], codo: [f.b1.cod], espalda: [medio(f.cad, f.hom)], cabeza: [f.cab] });
  return s;
}

// Sombra suave en el piso, debajo del cuerpo
function sombra(f) {
  const pts = puntos(f).filter(q => q[1] > SUELO - 60);
  const xs = (pts.length ? pts : [f.cad]).map(q => q[0]);
  const a = Math.min(...xs), b = Math.max(...xs);
  return `<ellipse class="sombra" cx="${f1((a + b) / 2)}" cy="${SUELO + 1}" rx="${f1(Math.max(14, (b - a) / 2 + 10))}" ry="3.5"/>`;
}

// Vista de frente: alturas de la vista de lado y anchos propios
function frente(p, def, punto, fijo) {
  const f = figura(p, def, fijo), m = def.__m || {};
  const CX = 120 + p.lat, s = [];
  const piernaF = (sg, x, flexion) => {
    const hx = CX + sg * 7, fx = CX + sg * p.ancho;
    const r = (x.rod[1] - f.cad[1]) / ((x.tob[1] - f.cad[1]) || 1);
    const enLinea = hx + (fx - hx) * r;
    const flex = clamp(flexion / 90, 0, 1);
    const kx = enLinea + (fx + sg * 2 - enLinea) * flex - sg * p.valgo * flex + p.rodLat;
    const suelo = Math.max(x.punta[1], x.talon[1]);
    return { rod: [kx, x.rod[1]], tob: [fx, x.tob[1]], pie: [fx + sg * 2, suelo - 2.5], cad: [hx, f.cad[1]] };
  };
  const izq = piernaF(-1, f.p1, p.rodilla), der = piernaF(1, f.p2, p.rodilla2);
  const gir = Math.cos(rad(p.tr)), off = Math.sin(rad(p.tr)) * 4;
  const brazoF = (sg, x, hF, cF) => {
    const sx = CX + sg * 13 * gir + off, hom = [sx, f.hom[1] + 2];
    if (def.brazosF) {
      const cod = sum(hom, [sg * Math.sin(rad(hF)) * L.brazo, Math.cos(rad(hF)) * L.brazo]);
      const a = hF + cF;
      return { hom, cod, mano: sum(cod, [sg * Math.sin(rad(a)) * L.ante, Math.cos(rad(a)) * L.ante]) };
    }
    const mx = def.juntas ? CX + sg * 3 : sx + sg * 3;
    const ex = def.juntas ? CX + sg * 12 : sx + sg * 3;
    return { hom, cod: [ex, x.cod[1]], mano: [mx, x.mano[1]] };
  };
  const bi = brazoF(-1, f.b1, p.hF, p.cF), bd = brazoF(1, f.b2, p.hF2, p.cF2);
  f.fm = [bi.mano, bd.mano];
  f.fr = [izq.rod, der.rod];
  s.push(`<ellipse class="sombra" cx="${f1(CX)}" cy="${SUELO + 1}" rx="${f1(Math.max(18, p.ancho + 14))}" ry="3.5"/>`);
  for (const x of [izq, der]) s.push(capsula(x.cad, x.rod, 12, 8.5, 'cuerpo', m.muslo), bola(x.rod, 4.3, 'cuerpo', m.muslo), capsula(x.rod, x.tob, 8, 5.5, 'cuerpo', m.canilla), `<ellipse class="cuerpo" cx="${f1(x.pie[0])}" cy="${f1(x.pie[1])}" rx="5" ry="2.8"/>`);
  // Tronco de frente: trapecio de la cadera a los hombros
  const hi = [CX - 9, f.cad[1] + 2], hd = [CX + 9, f.cad[1] + 2], si = [CX - 14 * gir + off, f.hom[1] + 1], sd = [CX + 14 * gir + off, f.hom[1] + 1];
  s.push(`<path class="cuerpo torso"${m.torso ? ` style="fill:${m.torso}"` : ''} d="M${f1(hi[0])} ${f1(hi[1])}L${f1(si[0])} ${f1(si[1])}Q${f1(CX + off)} ${f1(f.hom[1] - 4)} ${f1(sd[0])} ${f1(sd[1])}L${f1(hd[0])} ${f1(hd[1])}Z"/>`);
  s.push(capsula([CX + off, f.hom[1]], [CX + off * 1.2, f.cue[1]], 6, 6, 'cuerpo'), bola([CX + off * 1.3, f.cab[1]], L.cabeza, 'cuerpo cabeza'));
  for (const x of [bi, bd]) s.push(bola(x.hom, 5, 'cuerpo', m.hombro), capsula(x.hom, x.cod, 7.5, 6, 'cuerpo', m.brazo), bola(x.cod, 3, 'cuerpo', m.brazo), capsula(x.cod, x.mano, 6, 4.6, 'cuerpo', m.ante), bola(x.mano, 3.2, 'cuerpo'));
  s.push(equipoMovil(def, f, p, 'frente'));
  s.push(marca(punto, { rodilla: [izq.rod, der.rod], pies: [izq.pie, der.pie], cadera: [[CX, f.cad[1]]], espalda: [[CX, (f.cad[1] + f.hom[1]) / 2]], hombro: [bi.hom, bd.hom], manos: [bi.mano, bd.mano], codo: [bi.cod, bd.cod], cabeza: [[CX, f.cab[1]]] }));
  return s.join('');
}

// La marca de "fíjate aquí" siempre existe (2 círculos) para no recrear nodos: se oculta si no hace falta
function marca(punto, pts) {
  const qs = punto ? (pts[punto.zona] || pts.cadera) : [];
  let s = '';
  for (let i = 0; i < 2; i++) { const q = qs[i] || [0, 0]; s += `<circle class="marca${qs[i] ? '' : ' oculta'}" cx="${f1(q[0])}" cy="${f1(q[1])}" r="9"/>`; }
  return s;
}

// ── Equipo ───────────────────────────────────────────────────
const disco = ([x, y], r = 10) => `<circle class="disco" cx="${f1(x)}" cy="${f1(y)}" r="${r}"/><circle class="disco-c" cx="${f1(x)}" cy="${f1(y)}" r="${f1(r * 0.32)}"/>`;
function mancuerna([x, y], vertical = false) {
  // De lado se ve el disco de la punta; de pie (goblet) se ve vertical
  if (!vertical) return `<circle class="manc" cx="${f1(x)}" cy="${f1(y)}" r="5.5"/><circle class="manc-c" cx="${f1(x)}" cy="${f1(y)}" r="2"/>`;
  return `<g transform="translate(${f1(x)} ${f1(y)})"><rect class="manc-b" x="-1.4" y="-7" width="2.8" height="14" rx="1"/><rect class="manc" x="-5.5" y="-10" width="11" height="4.5" rx="1.5"/><rect class="manc" x="-5.5" y="5.5" width="11" height="4.5" rx="1.5"/></g>`;
}

// Equipo fijo (detrás de la figura)
function equipoFijo(def, vista) {
  return (def.equipo || []).map(q => {
    if (q.vista && q.vista !== vista) return '';
    switch (q.tipo) {
      // pad: colchón o asiento entre dos puntos (bancos planos o inclinados, respaldos, apoyos)
      case 'pad': return `<line class="pad" x1="${q.x1}" y1="${q.y1}" x2="${q.x2}" y2="${q.y2}" style="stroke-width:${q.w ?? 8}"/>`;
      case 'pata': return `<line class="pata" x1="${q.x1}" y1="${q.y1}" x2="${q.x2 ?? q.x1}" y2="${q.y2 ?? SUELO}"/>`;
      case 'banco': return `<line class="pad" x1="${q.x}" y1="${SUELO - q.alto}" x2="${q.x + q.ancho}" y2="${SUELO - q.alto}" style="stroke-width:7"/><line class="pata" x1="${q.x + 8}" y1="${SUELO - q.alto + 4}" x2="${q.x + 8}" y2="${SUELO}"/><line class="pata" x1="${q.x + q.ancho - 8}" y1="${SUELO - q.alto + 4}" x2="${q.x + q.ancho - 8}" y2="${SUELO}"/>`;
      case 'torre': return `<rect class="torre" x="${q.x - 6}" y="${q.y0 ?? 14}" width="12" height="${SUELO - (q.y0 ?? 14)}" rx="3"/><rect class="pila" x="${q.x - 4}" y="${SUELO - 40}" width="8" height="38" rx="2"/>`;
      case 'barraFija': return `<line class="barra-fija" x1="${q.x1}" y1="${q.y}" x2="${q.x2}" y2="${q.y}"/><line class="pata" x1="${q.x2 - 4}" y1="${q.y}" x2="${q.x2 - 4}" y2="${SUELO}"/>`;
      case 'rieles': return `<line class="riel-s" x1="${q.x}" y1="${q.y0 ?? 10}" x2="${q.x}" y2="${SUELO}"/>${q.x2 ? `<line class="riel-s" x1="${q.x2}" y1="${q.y0 ?? 10}" x2="${q.x2}" y2="${SUELO}"/>` : ''}`;
      case 'muro': return `<rect class="muro" x="${q.x}" y="30" width="8" height="${SUELO - 30}"/>`;
      case 'colchoneta': return `<rect class="colchoneta" x="${q.x}" y="${SUELO - 3}" width="${q.ancho}" height="3" rx="1.5"/>`;
      case 'escalon': return `<rect class="escalon" x="${q.x}" y="${SUELO - (q.alto ?? 12)}" width="${q.ancho ?? 30}" height="${q.alto ?? 12}" rx="2"/>`;
      case 'fitball': return `<circle class="fitball" cx="${q.x}" cy="${SUELO - q.r}" r="${q.r}"/>`;
      case 'paralelas': return `<rect class="torre" x="${q.x - 5}" y="${q.y}" width="10" height="${SUELO - q.y}" rx="3"/><line class="pad" x1="${q.x - 2}" y1="${q.y + 6}" x2="${q.x + 34}" y2="${q.y + 6}" style="stroke-width:6"/>`;
      default: return '';
    }
  }).join('');
}

// Equipo que se mueve con la figura
function equipoMovil(def, f, p, vista, detras = false) {
  let s = '';
  const fm = vista === 'frente' && f.fm;
  const manos = fm ? medio(f.fm[0], f.fm[1]) : medio(f.b1.mano, f.b2.mano);
  for (const q of def.equipo || []) {
    if (q.vista && q.vista !== vista) continue;
    // Respaldos y bancos que acompañan al torso van detrás del cuerpo
    if ((q.tipo === 'respaldo') !== detras) continue;
    if (q.tipo === 'cable') {
      const h = q.a === 'medio' ? manos : q.a === 'pie' ? (fm ? f.fr[1] : f.p1.tob) : fm ? f.fm[q.lado ?? 1] : q.mano === 2 ? f.b2.mano : f.b1.mano;
      s += `<line class="cable" x1="${q.x}" y1="${q.y}" x2="${f1(h[0])}" y2="${f1(h[1])}"/><circle class="polea" cx="${q.x}" cy="${q.y}" r="4.5"/>`;
      if (q.agarre === 'cuerda') s += `<circle class="agarre" cx="${f1(h[0])}" cy="${f1(h[1])}" r="3.5"/>`;
      else if (q.agarre !== 'no') s += `<rect class="agarre" x="${f1(h[0] - 3)}" y="${f1(h[1] - 5)}" width="6" height="10" rx="2.5"/>`;
    }
    if (q.tipo === 'carro') {
      const c = medio(f.p1.punta, f.p1.talon), d = vec(q.riel, 1), n = [d[1], -d[0]];
      const a = [c[0] + n[0] * 17 + d[0] * 4, c[1] + n[1] * 17 + d[1] * 4], b = [c[0] - n[0] * 17 + d[0] * 4, c[1] - n[1] * 17 + d[1] * 4];
      s += `<line class="riel" x1="${f1(c[0] - d[0] * 60)}" y1="${f1(c[1] - d[1] * 60)}" x2="${f1(c[0] + d[0] * 40)}" y2="${f1(c[1] + d[1] * 40)}"/>`;
      s += `<line class="carro" x1="${f1(a[0])}" y1="${f1(a[1])}" x2="${f1(b[0])}" y2="${f1(b[1])}"/>`;
    }
    if (q.tipo === 'respaldo') {
      const d = [f.hom[0] - f.cad[0], f.hom[1] - f.cad[1]], l = Math.hypot(...d) || 1, u = [d[0] / l, d[1] / l];
      const off = q.lado === 1 ? 15 : 11, nrm = [-u[1] * (q.lado ?? -1) * off, u[0] * (q.lado ?? -1) * off];
      const a = [f.cad[0] + nrm[0] - u[0] * 6, f.cad[1] + nrm[1] - u[1] * 6], b = [f.hom[0] + nrm[0] + u[0] * 8, f.hom[1] + nrm[1] + u[1] * 8];
      s += `<line class="pad" x1="${f1(a[0])}" y1="${f1(a[1])}" x2="${f1(b[0])}" y2="${f1(b[1])}" style="stroke-width:7"/>`;
      if (q.lado === 1) s += `<line class="pata" x1="${f1(a[0])}" y1="${f1(a[1])}" x2="${f1(a[0])}" y2="${SUELO}"/>`;
    }
    if (q.tipo === 'rodillo') { const r = { rodilla: f.p1.rod, tobillo: f.p1.tob, hombro: f.hom, cadera: f.cad, codo: f.b1.cod }[q.en] || f.cad; s += `<circle class="rodillo" cx="${f1(r[0] + (q.dx ?? 0))}" cy="${f1(r[1] + (q.dy ?? -8))}" r="${q.r ?? 6.5}"/>`; }
    if (q.tipo === 'almohadillas' && fm) s += f.fr.map(r => `<rect class="rodillo" x="${f1(r[0] + (r[0] < 120 ? -11 : 4))}" y="${f1(r[1] - 7)}" width="7" height="16" rx="3.5"/>`).join('');
    if (q.tipo === 'banda' && fm) s += `<line class="banda" x1="${f1(f.fr[0][0])}" y1="${f1(f.fr[0][1] - 4)}" x2="${f1(f.fr[1][0])}" y2="${f1(f.fr[1][1] - 4)}"/>`;
    if (q.tipo === 'pesoCadera') s += `<line class="barra" x1="${f1(f.cad[0] - 2)}" y1="${f1(f.cad[1] - 9)}" x2="${f1(f.cad[0] + 2)}" y2="${f1(f.cad[1] - 9)}"/>${disco([f.cad[0], f.cad[1] - 9], 10)}`;
    if (q.tipo === 'balonPies') { const r = Math.max(8, Math.min(14, (SUELO - f.p1.tob[1]) / 2)); s += `<circle class="fitball" cx="${f1(f.p1.tob[0] + 4)}" cy="${f1(SUELO - r)}" r="${f1(r)}"/>`; }
    if (q.tipo === 'carroSmith') s += `<line class="barra" x1="${f1(q.x - 6)}" y1="${f1(f.b1.mano[1])}" x2="${f1(q.x + 6)}" y2="${f1(f.b1.mano[1])}"/>`;
  }
  if (detras) return s;
  const mano = def.mano;
  if (mano === 'goblet') s += fm ? mancuerna([120 + p.lat, f.fm[0][1] + 3], true) : mancuerna([f.b1.mano[0] + 2, f.b1.mano[1] + 6], true);
  if (mano === 'mancuernas') s += fm ? f.fm.map(x => mancuerna(x)).join('') : mancuerna(f.b2.mano) + mancuerna(f.b1.mano);
  if (mano === 'mancuerna') s += fm ? mancuerna(f.fm[1]) : mancuerna(f.b1.mano);
  if (mano === 'barra' || mano === 'z') {
    const r = mano === 'z' ? 7.5 : 11;
    s += fm ? `<line class="barra" x1="${f1(f.fm[0][0] - 22)}" y1="${f1(f.fm[0][1])}" x2="${f1(f.fm[1][0] + 22)}" y2="${f1(f.fm[1][1])}"/><rect class="disco" x="${f1(f.fm[0][0] - 26)}" y="${f1(f.fm[0][1] - r)}" width="5" height="${r * 2}" rx="1.5"/><rect class="disco" x="${f1(f.fm[1][0] + 21)}" y="${f1(f.fm[1][1] - r)}" width="5" height="${r * 2}" rx="1.5"/>`
      : disco(manos, r);
  }
  if (mano === 'agarre') s += fm ? f.fm.map(x => `<rect class="agarre" x="${f1(x[0] - 3)}" y="${f1(x[1] - 5)}" width="6" height="10" rx="2.5"/>`).join('') : `<rect class="agarre" x="${f1(f.b1.mano[0] - 3)}" y="${f1(f.b1.mano[1] - 5)}" width="6" height="10" rx="2.5"/>`;
  if (mano === 'balon') s += `<circle class="balon" cx="${f1(manos[0])}" cy="${f1(manos[1] - 2)}" r="8"/>`;
  return s;
}

// Flecha de hacia dónde se mueve (en las poses fijas)
function puntoClave(def, q, vista) {
  const f = figura(q, def);
  const k = def.sigue || 'manos';
  const p = { cadera: f.cad, manos: f.b1.mano, pies: f.p1.tob, hombro: f.hom, rodilla: f.p1.rod, codo: f.b1.cod }[k] || f.cad;
  return vista === 'frente' ? [120 + q.lat, p[1]] : p;
}
function flecha(def, a, b, vista) {
  const p = puntoClave(def, a, vista), q = puntoClave(def, b, vista);
  const dx = q[0] - p[0], dy = q[1] - p[1], l = Math.hypot(dx, dy);
  if (l < 8) return '';
  const u = [dx / l, dy / l], largo = Math.min(l * 0.75, 38), ini = [p[0] + u[0] * 10, p[1] + u[1] * 10], fin = [ini[0] + u[0] * largo, ini[1] + u[1] * largo];
  const n = [-u[1], u[0]], h1 = [fin[0] - u[0] * 7 + n[0] * 5, fin[1] - u[1] * 7 + n[1] * 5], h2 = [fin[0] - u[0] * 7 - n[0] * 5, fin[1] - u[1] * 7 - n[1] * 5];
  return `${ln(ini, fin, 'flecha')}<polygon class="flecha-p" points="${[fin, h1, h2].map(x => x.map(f1).join(',')).join(' ')}"/>`;
}

const fondo = (def, vista) => `<line class="suelo" x1="6" y1="${SUELO}" x2="234" y2="${SUELO}"/>` + equipoFijo(def, vista);
const figuraSVG = (def, q, vista, punto, fijo) => (vista === 'frente' ? frente(q, def, punto, fijo) : lado(q, def, punto, fijo));

export function dibujarPose(def, p, vista = 'lado', punto = null, fijo = null, siguiente = null) {
  const q = p.__ok ? p : completar(p, def);
  const sig = siguiente ? (siguiente.__ok ? siguiente : completar(siguiente, def)) : null;
  return fondo(def, vista) + figuraSVG(def, q, vista, punto, fijo) + (sig ? flecha(def, q, sig, vista) : '');
}

// Actualiza el SVG sin reconstruirlo: si la estructura es la misma, solo cambia los atributos
const RE_TAG = /<(\/?)(\w+)([^>]*?)\/?>/g, RE_ATR = /([\w-]+)="([^"]*)"/g;
function parchear(g, html) {
  const nodos = [];
  for (const m of html.matchAll(RE_TAG)) {
    if (m[1]) continue;
    const a = {};
    for (const x of m[3].matchAll(RE_ATR)) a[x[1]] = x[2];
    nodos.push([m[2], a]);
  }
  const firma = nodos.map(n => n[0]).join('|');
  if (g._firma !== firma) {
    g.innerHTML = html; g._firma = firma;
    g._els = [...g.querySelectorAll('*')];
    g._els.forEach((el, i) => { el._a = nodos[i][1]; });
    return;
  }
  g._els.forEach((el, i) => {
    const a = nodos[i][1], prev = el._a;
    for (const k in a) if (prev[k] !== a[k]) el.setAttribute(k, a[k]);
    el._a = a;
  });
}

// ── Línea de tiempo ──────────────────────────────────────────
const suave = x => 0.5 - Math.cos(Math.PI * x) / 2;
function preparar(def) {
  const poses = def.poses.map(p => completar(p, def));
  const tramos = [];
  let t = 0;
  poses.forEach((p, i) => {
    const pausa = def.poses[i].pausa || 0, ms = def.poses[i].ms || 700;
    tramos.push({ i, ini: t, pausa, ms });
    t += pausa + ms;
  });
  return { def, poses, tramos, total: t, tras: poses.map(p => traslado(p, def)) };
}
function poseEn(prep, t) {
  t %= prep.total;
  const tr = prep.tramos.findLast(x => x.ini <= t) || prep.tramos[0];
  const a = prep.poses[tr.i], b = prep.poses[(tr.i + 1) % prep.poses.length];
  const loc = t - tr.ini;
  if (loc < tr.pausa) return { p: a, activa: tr.i, fijo: null };
  const f = suave(clamp((loc - tr.pausa) / tr.ms, 0, 1));
  const p = { __ok: true };
  const vuelta = prep.def.vuelta || [];
  for (const k of PARAMS) p[k] = a[k] + (vuelta.includes(k) ? ((b[k] - a[k] + 540) % 360) - 180 : b[k] - a[k]) * f;
  const ap = x => x.apoyo ?? prep.def.apoyo ?? 1;
  let fijo = { apoyo: ap(a) };
  if (prep.def.ancla !== 'cadera' && ap(a) !== ap(b)) { const ta = prep.tras[tr.i], tb = prep.tras[(tr.i + 1) % prep.poses.length]; fijo = { ox: ta.ox + (tb.ox - ta.ox) * f, oy: ta.oy + (tb.oy - ta.oy) * f }; }
  return { p, activa: f < 0.5 ? tr.i : (tr.i + 1) % prep.poses.length, fijo };
}

const defDe = id => { const d = ANIM[id]; return d?.como ? { ...ANIM[d.como], ...d, poses: ANIM[d.como].poses, como: undefined } : d; };
export const tieneVideo = id => !!defDe(id);

let detenerActual = null;

// Monta el video dentro de un contenedor. musculos: { torso: '#4C8DFF', brazo: … } para encender lo que trabaja
export function montar(cont, id, musculos = {}) {
  const base = defDe(id);
  if (!base) return;
  detenerActual?.();
  const def = { ...base, __m: musculos };
  const prep = preparar(def);
  const vistas = def.vistas || ['lado'];
  const st = { t: 0, play: true, vel: 1, vista: vistas[0], ult: performance.now(), dib: 0, raf: 0, paso: null, visible: true, costo: [], gaps: [], lento: false };
  const nombreVista = v => v === 'frente' ? 'Ver de frente' : 'Ver de lado';
  cont.innerHTML = `
    <div class="video">
      <svg class="video-svg" viewBox="0 0 240 196" role="img" aria-label="Video del ejercicio"><g class="video-fijo"></g><g class="video-g"></g></svg>
      <p class="video-punto" aria-live="polite"></p>
    </div>
    <div class="video-ctrl">
      <button data-v="play" aria-label="Pausa"></button>
      <button data-v="vel">Lento</button>
      ${vistas.length > 1 ? `<button data-v="vista">${nombreVista(vistas[1])}</button>` : ''}
    </div>
    <div class="video-fijas" hidden></div>
    <ol class="video-pasos">${def.poses.map((p, i) => `<li data-v="ir" data-i="${i}">${p.n || ''}</li>`).join('')}</ol>`;
  const fijoG = cont.querySelector('.video-fijo'), g = cont.querySelector('.video-g'), txt = cont.querySelector('.video-punto');
  const bPlay = cont.querySelector('[data-v=play]');
  const icoPlay = () => { bPlay.textContent = st.play ? '❚❚ Pausa' : '▶ Seguir'; };
  icoPlay();
  fijoG.innerHTML = fondo(def, st.vista);
  cont._st = st;

  let ultActiva = -1;
  const pintar = () => {
    const t0 = performance.now();
    const { p, activa, fijo } = st.paso !== null ? { p: prep.poses[st.paso], activa: st.paso, fijo: null } : poseEn(prep, st.t);
    const punto = def.poses[activa].punto || null;
    parchear(g, figuraSVG(def, p, st.vista, punto, fijo));
    if (activa !== ultActiva) {
      ultActiva = activa;
      txt.textContent = punto ? punto.txt : '';
      cont.querySelectorAll('.video-pasos li').forEach((b, i) => b.classList.toggle('act', i === activa));
    }
    return performance.now() - t0;
  };
  const io = 'IntersectionObserver' in window ? new IntersectionObserver(es => { st.visible = es[0].isIntersecting; }) : null;
  io?.observe(cont);
  // Poses fijas grandes con flechas, si el teléfono va lento
  const mostrarFijas = () => {
    const n = def.poses.length, caja = cont.querySelector('.video-fijas');
    caja.innerHTML = def.poses.map((p, i) => `<figure><svg class="video-svg" viewBox="0 0 240 196">${dibujarPose(def, p, st.vista, p.punto, null, i < n - 1 ? def.poses[i + 1] : null)}</svg><b>${i + 1}</b></figure>`).join('');
    caja.hidden = false;
    cont.querySelector('.video').hidden = true;
    cont.querySelectorAll('.video-ctrl button:not([data-v=vista])').forEach(b => { b.hidden = true; });
  };
  const detener = () => { cancelAnimationFrame(st.raf); io?.disconnect(); if (detenerActual === detener) detenerActual = null; };
  detenerActual = detener;
  const bucle = ahora => {
    if (!cont.isConnected) return detener();
    const dt = ahora - st.ult; st.ult = ahora;
    if (st.play && st.visible && document.visibilityState === 'visible') {
      st.t += dt * st.vel;
      if (ahora - st.dib >= 33) { // máximo 30 cuadros por segundo
        if (st.dib) st.gaps.push(ahora - st.dib);
        st.dib = ahora;
        const c = pintar();
        const prom = x => x.reduce((a, b) => a + b, 0) / x.length;
        if (st.costo.length < 20) st.costo.push(c);
        else if (!st.lento && (prom(st.costo) > 18 || prom(st.gaps.slice(-20)) > 100)) { st.lento = true; st.play = false; mostrarFijas(); }
      }
    }
    st.raf = requestAnimationFrame(bucle);
  };
  pintar();
  st.raf = requestAnimationFrame(bucle);

  cont.onclick = ev => {
    const b = ev.target.closest('[data-v]');
    if (!b) return;
    const a = b.dataset.v;
    if (a === 'play') { st.play = !st.play; if (st.play) st.paso = null; icoPlay(); }
    if (a === 'vel') { st.vel = st.vel === 1 ? 0.5 : 1; b.classList.toggle('act', st.vel !== 1); b.textContent = st.vel === 1 ? 'Lento' : 'Lento ✓'; }
    if (a === 'vista') {
      const i = (vistas.indexOf(st.vista) + 1) % vistas.length; st.vista = vistas[i];
      b.textContent = nombreVista(vistas[(i + 1) % vistas.length]); ultActiva = -1;
      fijoG.innerHTML = fondo(def, st.vista);
      if (st.lento) mostrarFijas(); else pintar();
    }
    if (a === 'ir') {
      st.play = false; icoPlay();
      st.paso = Number(b.dataset.i);
      st.t = prep.tramos[st.paso].ini;
      ultActiva = -1;
      pintar();
    }
  };
}

// Músculos que trabaja → partes de la figura que se encienden con el color de su grupo
const SEG = {
  biceps: 'brazo', triceps: 'brazo', antebrazo: 'ante', deltoides: 'hombro', deltoidesPost: 'hombro',
  pecho: 'torso', dorsal: 'torso', trapecio: 'torso', lumbar: 'torso', abdomen: 'torso', oblicuos: 'torso',
  gluteo: 'cadera', gluteoMedio: 'cadera', femoral: 'muslo', cuadriceps: 'muslo', pantorrilla: 'canilla',
};
export function musculosDe(zonas = [], ZONAS, GRUPOS) {
  const m = {};
  for (const z of zonas) { const s = SEG[z]; if (s && !m[s]) m[s] = GRUPOS[ZONAS[z]]?.c; }
  return m;
}
