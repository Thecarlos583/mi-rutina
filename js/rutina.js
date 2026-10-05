// Lógica del plan: qué toca hoy, qué ejercicio está activo en cada puesto, historial de pesos
import { EJERCICIOS, PLAN } from './data.js';
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
  return h[1].w + incremento(ejId);
}
export function mejorPeso(ejId, antesDe) {
  const h = historialPesos(ejId).filter(x => x.f < antesDe);
  return h.length ? Math.max(...h.map(x => x.w)) : null;
}
