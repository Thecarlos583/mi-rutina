// Lógica del plan: qué toca hoy, qué ejercicio está activo en cada puesto, historial de pesos
import { EJERCICIOS, PLAN, INICIO, BARRA } from './data.js';
import { S, leerDia } from './store.js';
import { info, sumar, diaDe } from './calendario.js';

// Las alternativas sin datos propios heredan grupo, zonas y descripción del original
export function ejercicio(id, padreId) {
  const e = EJERCICIOS[id];
  if (!e) return null;
  if (e.g || !padreId) return { id, ...e };
  const p = EJERCICIOS[padreId];
  return { id, g: p.g, z: p.z, s: p.s, t: p.t, d: p.d, ...e };
}

// Qué se entrena en una fecha (según el calendario o lo que se eligió a mano)
export function planDe(f) {
  const inf = info(f, S().ajustes.inicio);
  const o = leerDia(f).plan;
  return { ...inf, varianteAuto: inf.variante, variante: o?.variante ?? inf.variante, diaPlan: o?.dia ?? inf.dia, override: !!o };
}

export function slots(f, variante, diaPlan) {
  const d = PLAN[variante]?.[diaPlan];
  if (!d) return [];
  const log = leerDia(f);
  return d.e.map(([baseId, series, reps, nota], i) => {
    const slot = `${variante}-${diaPlan}-${i}`;
    const base = ejercicio(baseId);
    const h = log.cambios?.[slot], sw = S().siempre[baseId];
    let ejId = baseId, cambio = null;
    if (h && h !== baseId) { ejId = h; cambio = 'hoy'; }
    else if (!h && sw) { ejId = sw; cambio = 'siempre'; }
    let s = series, r = reps, n = nota;
    if (cambio) {
      const alt = base.a?.find(a => a[0] === ejId);
      if (alt) { [, s, r] = alt; n = null; }
    }
    const marcadas = log.series?.[slot] || [];
    return {
      slot, i, base, ej: cambio ? ejercicio(ejId, baseId) : base,
      series: s, reps: r, nota: n, descanso: base.d, cambio, orig: { series, reps },
      hechas: Array.from({ length: s }, (_, k) => !!marcadas[k]),
    };
  });
}

export const totalSeries = ss => ss.reduce((a, s) => a + s.series, 0);
export const seriesHechas = ss => ss.reduce((a, s) => a + s.hechas.filter(Boolean).length, 0);

// ── Sábado ──────────────────────────────────────────────────
export function pasosSabado(log) {
  const s = log.sab || {};
  return {
    movilidad: !!s.movilidad, trote: !!s.trote, estiramiento: !!s.estiramiento,
    core: (s.core || []).filter(Boolean).length >= 3,
  };
}

// ── Resumen de un día (calendario y racha) ──────────────────
export function resumenDia(f) {
  const log = leerDia(f);
  const series = Object.values(log.series || {}).flat().filter(Boolean).length;
  const sab = log.sab || {};
  const algo = series > 0 || !!(sab.movilidad || sab.trote || sab.estiramiento) || (sab.core || []).some(Boolean);
  return { series, completo: !!log.completo, algo };
}

// Días seguidos entrenando (los domingos no rompen la racha; hoy sin entrenar todavía tampoco)
export function racha(f) {
  let n = 0, d = f;
  if (!resumenDia(d).algo) d = sumar(d, -1);
  for (let k = 0; k < 800; k++) {
    if (diaDe(d) === 'dom') { d = sumar(d, -1); continue; }
    if (!resumenDia(d).algo) break;
    n++; d = sumar(d, -1);
  }
  return n;
}

// ── Pesos ───────────────────────────────────────────────────
// Los pesos se guardan siempre en lbs, con todos sus decimales (lo anotado en kg se convierte sin redondear).
// La app entera se ve en lbs o en kg según ajustes.unidad; se redondea solo al mostrar.
export const LB = 2.20462;
export const unidadDe = () => (S().ajustes.unidad === 'kg' ? 'kg' : 'lbs');
export const enKg = id => unidadDe(id) === 'kg';
// lbs guardadas → número en la unidad que se ve (1 decimal)
export const aVista = (id, lbs) => (lbs == null ? null : enKg(id) ? Math.round((lbs / LB) * 10) / 10 : Math.round(lbs * 10) / 10);
// "40 lbs ≈ 18,1 kg": el mismo peso en la otra unidad
export function equivalencia(id, v) {
  if (v == null || !Number.isFinite(v) || v <= 0) return '';
  const kg = enKg(id), otro = kg ? v * LB : v / LB;
  const t = x => String(Math.round(x * 10) / 10).replace('.', ',');
  return `${t(v)} ${kg ? 'kg' : 'lbs'} ≈ ${t(otro)} ${kg ? 'lbs' : 'kg'}`;
}
// número en la unidad del ejercicio → lbs para guardar
export const aLbs = (id, v) => (enKg(id) ? v * LB : v);
// Una sugerencia en lbs llevada a discos reales: de 5 en 5 lbs o de 2,5 en 2,5 kg
export const sugeridoVista = (id, lbs) => (enKg(id) ? Math.max(2.5, Math.round(lbs / LB / 2.5) * 2.5) : lbs);
export const pasoDe = id => (enKg(id) ? 2.5 : 5);
export const historialVista = id => historialPesos(id).map(x => ({ f: x.f, w: aVista(id, x.w) }));

// ── Cómo armar el peso: discos por lado, pasador o mancuernas ─
// Barras: olímpica 45 lbs / 20 kg; Z y Smith 20 lbs / 10 kg. Discos más comunes en cada unidad.
const DISCOS = { lbs: [45, 35, 25, 10, 5, 2.5], kg: [20, 15, 10, 5, 2.5, 1.25] };
const n1 = x => String(Math.round(x * 100) / 100).replace('.', ',');
export function barraDe(id) {
  const t = BARRA[id], u = unidadDe(id);
  if (t === 'z') return { n: 'barra Z', w: u === 'kg' ? 10 : 20 };
  if (t === 'smith') return { n: 'barra de la Smith', w: u === 'kg' ? 10 : 20 };
  return { n: 'barra olímpica', w: u === 'kg' ? 20 : 45 };
}
function porLado(total, u) {
  let lado = Math.max(0, total / 2);
  const out = [];
  for (const d of DISCOS[u]) while (lado >= d - 1e-9) { out.push(d); lado = Math.round((lado - d) * 100) / 100; }
  return { out, sobra: lado };
}
function agrupar(lista, u) {
  const n = {};
  for (const d of lista) n[d] = (n[d] || 0) + 1;
  const p = Object.keys(n).map(Number).sort((a, b) => b - a).map(d => `${n[d]} de ${n1(d)} ${u}`);
  return p.length > 1 ? `${p.slice(0, -1).join(', ')} y ${p.at(-1)}` : p[0] || '';
}
// v: peso en la unidad del ejercicio
export function comoCargar(id, v) {
  const tipo = INICIO[id]?.[1], u = unidadDe(id);
  if (!v || !tipo || tipo === 'corp' || tipo === 'banda') return '';
  if (tipo === 'barra') {
    const b = barraDe(id);
    if (v <= b.w) return `Solo la ${b.n} (${n1(b.w)} ${u}), sin discos.`;
    const { out, sobra } = porLado(v - b.w, u);
    // Menos de lo que pesa el disco más chico: queda solo la barra
    if (!out.length) return `Solo la ${b.n} (${n1(b.w)} ${u}); para ${n1(v)} ${u} exactos no hay discos tan chicos.`;
    return `Pon ${agrupar(out, u)} de cada lado de la ${b.n} (${n1(b.w)} ${u})${sobra ? '; no cuadra exacto, usa el disco más cercano' : ''}.`;
  }
  if (tipo === 'discos') {
    const { out, sobra } = porLado(v, u);
    if (!out.length) return `Sin discos: ${n1(v)} ${u} es menos que el disco más chico.`;
    return `Pon ${agrupar(out, u)} de cada lado, sin contar el carro${sobra ? '; no cuadra exacto, usa el disco más cercano' : ''}.`;
  }
  if (tipo === 'c/u') return `Una mancuerna de ${n1(v)} ${u} en cada mano.`;
  if (tipo === 'una') return `Una mancuerna (o disco) de ${n1(v)} ${u}.`;
  if (tipo === 'asist') return `Pon el pasador de la asistencia en ${n1(v)} ${u}: más asistencia, más fácil.`;
  return `Pon el pasador de la máquina en ${n1(v)} ${u}.`;
}
export function historialPesos(ejId) {
  const log = S().log;
  return Object.keys(log).sort()
    .filter(f => typeof log[f].pesos?.[ejId] === 'number')
    .map(f => ({ f, w: log[f].pesos[ejId] }));
}
export function ultimoPeso(ejId, antesDe) {
  const h = historialPesos(ejId).filter(x => x.f < antesDe);
  return h.length ? h[h.length - 1].w : null;
}
// ¿Hizo todas las series de ese ejercicio en esa fecha?
function completoEn(ejId, f) {
  const p = planDe(f);
  return slots(f, p.variante, p.diaPlan).some(s => s.ej.id === ejId && s.hechas.every(Boolean));
}
// Ejercicios grandes de pierna: suben de 10 en 10 lbs; el resto de 5 en 5
const GRANDES = new Set(['sentadilla', 'prensa', 'sentadilla-hack', 'sentadilla-smith-adelantados', 'hip-thrust', 'hip-thrust-smith', 'rumano-barra', 'buenos-dias', 'pantorrilla-pie', 'pantorrilla-smith']);
export const incremento = ejId => (GRANDES.has(ejId) ? 10 : 5);
// Toca subir: las dos últimas sesiones con el mismo peso y todas las series hechas
export function tocaSubir(ejId, antesDe) {
  const h = historialPesos(ejId).filter(x => x.f < antesDe).slice(-2);
  if (h.length < 2 || !h[1].w || h[0].w !== h[1].w) return null;
  if (!h.every(x => completoEn(ejId, x.f))) return null;
  // En la unidad del ejercicio: +10 / +5 lbs, o +5 / +2,5 kg
  return aVista(ejId, h[1].w) + (enKg(ejId) ? incremento(ejId) / 2 : incremento(ejId));
}
export function mejorPeso(ejId, antesDe) {
  const h = historialPesos(ejId).filter(x => x.f < antesDe);
  return h.length ? Math.max(...h.map(x => x.w)) : null;
}
