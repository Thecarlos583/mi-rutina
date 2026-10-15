// Lógica del plan: qué toca hoy, qué ejercicio está activo en cada puesto, historial de pesos
import { EJERCICIOS, PLAN, INICIO, BARRA, REQ, NUNCA, PROHIBIDOS, EQUIPO_TODO, PESOS_INICIAL } from './data.js';
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

// ¿Usa la torre de poleas? (la máquina de jalón y la de remo sentado van aparte)
export const esPolea = id => (REQ[id] ? REQ[id].includes('poleas') : /polea|cuerda|face-pull|triceps-sobre-cabeza|triceps-barra-v|cruces|gironda/.test(id));

// Equipo que hay en el gimnasio (Ajustes → "Equipo de mi gimnasio"); por defecto, todo el de la lista
export const equipoActivo = () => S().ajustes.equipo ?? EQUIPO_TODO;
// Ejercicios que no se pueden hacer: equipo que no hay, prohibidos u ocultados a mano
export function estaOculto(id) {
  const a = S().ajustes, eq = equipoActivo();
  return (a.ocultos || []).includes(id) || NUNCA.has(id) || PROHIBIDOS.has(id) || (REQ[id] || []).some(k => !eq.includes(k));
}
// "B anterior", "A anterior": las rutinas viejas que solo sirven para ver lo que se anotó
export const nombreVariante = v => (/^[AB]\d$/.test(v) ? `${v[0]} anterior` : v);

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
  // Cada Semana B usa sus propios puestos ("B3-…" la actual) para no chocar con lo anotado en las anteriores
  const pre = d.pre ?? variante;
  return d.e.map(([baseId, series, reps, nota, desc, altsPlan, tip, zona], i) => {
    const slot = `${pre}-${diaPlan}-${i}`;
    const base = ejercicio(baseId);
    // La polea casi siempre está ocupada: las alternativas sin polea van primero.
    // En las rutinas viejas no se esconde nada: se ven tal cual se entrenaron.
    const alts = (altsPlan || base.a || []).filter(a => (d.vieja ? !PROHIBIDOS.has(a[0]) : !estaOculto(a[0]))).sort((x, y) => esPolea(x[0]) - esPolea(y[0]));
    // "Usar siempre" de la Semana B se guarda aparte: no toca los cambios de la Semana A
    const clave = d.propia ? `B|${baseId}` : baseId;
    const h = log.cambios?.[slot], swGuardado = S().siempre[clave];
    const sw = swGuardado && alts.some(a => a[0] === swGuardado) ? swGuardado : null;
    let ejId = baseId, cambio = null;
    if (h && h !== baseId) { ejId = h; cambio = 'hoy'; }
    else if (!h && sw) { ejId = sw; cambio = 'siempre'; }
    // Sin esa máquina: la primera alternativa que sí se puede hacer
    if (!d.vieja && estaOculto(ejId) && alts.length) { ejId = alts[0][0]; cambio = 'equipo'; }
    let s = series, r = reps, n = nota;
    if (cambio) {
      const alt = alts.find(a => a[0] === ejId);
      if (alt) { [, s, r] = alt; n = null; }
    }
    // "¿Ajustar a 3×15?" → Sí: esas repeticiones quedan para este ejercicio
    if (!cambio && S().ajusteReps?.[clave]) r = S().ajusteReps[clave];
    const marcadas = log.series?.[slot] || [];
    return {
      slot, i, base, ej: cambio ? ejercicio(ejId, baseId) : base,
      series: s, reps: r, nota: n, descanso: desc ?? base.d, cambio, orig: { series, reps },
      alts, clave, tip: tip ?? null, zona: zona ?? null,
      hechas: Array.from({ length: s }, (_, k) => !!marcadas[k]),
    };
  });
}

export const totalSeries = ss => ss.reduce((a, s) => a + s.series, 0);

// Días con series anotadas en una rutina que hoy ya no es la que toca (por ejemplo, la Semana B anterior):
// se les fija esa rutina para que se vean con lo que se hizo y cuenten como entrenados.
const PREFIJO = { A2: 'A', B4: 'B', A: 'A0', B3: 'B2', B2: 'B1', B: 'B0' }; // cómo empieza el puesto → semana
// v17: el martes A, el viernes A y el martes B cambiaron de orden (entraron las prensas y salió el femoral sentado).
// Lo anotado se mueve al puesto nuevo de su mismo ejercicio; lo de un ejercicio que ya no está se guarda aparte.
const ORDEN_VIEJO = {
  'A-mar': ['sentadilla', 'zancadas-caminando', 'extensiones', 'femoral-acostado', 'pantorrilla-pie'],
  'A-vie': ['rumano-mancuernas', 'bulgara', 'curl-femoral-maquina', 'hip-thrust', 'abductor', 'pantorrilla-sentado'],
  'B2-mar': ['sentadilla-smith-adelantados', 'femoral-acostado', 'abductor', 'rumano-barra', 'zancadas-caminando', 'femoral-sentado', 'hip-thrust', 'extensiones', 'femoral-pie'],
};
export function migrarPuestosV17() {
  const st = S();
  if (st.migrado?.v17) return false;
  for (const [clave, viejos] of Object.entries(ORDEN_VIEJO)) {
    const [pre, dia] = clave.split('-');
    const nuevos = PLAN[{ A: 'A0', B2: 'B1' }[pre] || pre][dia].e.map(x => x[0]);
    const re = new RegExp(`^${pre}-${dia}-([0-9]+)$`);
    for (const d of Object.values(st.log)) for (const campo of ['series', 'cambios']) {
      const o = d[campo];
      if (!o) continue;
      const n = {};
      for (const [k, v] of Object.entries(o)) {
        const m = re.exec(k);
        if (!m) { n[k] = v; continue; }
        const j = nuevos.indexOf(viejos[Number(m[1])]);
        n[j >= 0 ? `${pre}-${dia}-${j}` : `${pre}-${dia}-viejo-${m[1]}`] = v;
      }
      d[campo] = n;
    }
  }
  st.migrado = { ...(st.migrado || {}), v17: true };
  return true;
}

export function reconciliarDias() {
  let cambio = false;
  for (const [f, d] of Object.entries(S().log)) {
    const marcadas = Object.entries(d.series || {}).filter(([, v]) => (v || []).some(Boolean)).map(([k]) => k);
    if (!marcadas.length) continue;
    const p = planDe(f), actuales = new Set(slots(f, p.variante, p.diaPlan).map(s => s.slot));
    if (marcadas.some(k => actuales.has(k))) continue;
    const m = /^(A2|B4|A|B3|B2|B)-(lun|mar|mie|jue|vie)-\d+$/.exec(marcadas[0]);
    if (!m || !PLAN[PREFIJO[m[1]]]?.[m[2]]) continue;
    d.plan = { variante: PREFIJO[m[1]], dia: m[2] };
    cambio = true;
  }
  return cambio;
}
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
  const algo = series > 0 || !!log.hecho || !!log.fin || !!(sab.movilidad || sab.trote || sab.estiramiento) || (sab.core || []).some(Boolean);
  return { series, completo: !!log.completo || !!log.fin, algo };
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

// ── Duración estimada del día ───────────────────────────────
// Calentamiento 10 min + aproximación 3 min + estiramiento 5 min + cada serie (40 s, u 80 s si es por brazo o por pierna)
// + su descanso. Después de la última serie de cada ejercicio no se descansa: ahí van los 60 s de cambio.
export const porLadoReps = reps => /\/(brazo|pierna)|por (brazo|pierna)/.test(String(reps));
export function duracionEstimada(ss) {
  let s = 600 + 180 + 300;
  ss.forEach((x, i) => { s += x.series * (porLadoReps(x.reps) ? 80 : 40) + (x.series - 1) * x.descanso; if (i) s += 60; });
  return Math.round(s / 60);
}

// ── Pesos que existen en el gimnasio ────────────────────────
export const pesosDisp = () => ({ ...PESOS_INICIAL, ...(S().ajustes.pesosDisp || {}) });
// Todos los pesos que se pueden armar para un ejercicio, en la unidad que se ve (null: máquina de pasador o peso corporal)
export function pesosPosibles(id) {
  const tipo = INICIO[id]?.[1], kg = unidadDe(id) === 'kg', pd = pesosDisp();
  if (tipo === 'c/u' || tipo === 'una') return [...(pd[kg ? 'mancKg' : 'mancLb'] || [])].sort((a, b) => a - b);
  if (tipo !== 'barra' && tipo !== 'discos') return null;
  // Lo que se puede poner por lado con hasta 4 discos de los que hay
  const discos = pd[kg ? 'discosKg' : 'discosLb'] || [];
  const lados = new Set([0]);
  for (let k = 0; k < 4; k++) for (const l of [...lados]) for (const d of discos) lados.add(Math.round((l + d) * 100) / 100);
  const barra = tipo === 'barra' ? barraDe(id).w : 0;
  return [...new Set([...lados].map(l => Math.round((barra + 2 * l) * 100) / 100))].filter(w => w > 0).sort((a, b) => a - b);
}
// El peso que sigue (dir +1) o el anterior (dir -1) que existe; en máquinas, de 5 en 5 lbs o de 2,5 en 2,5 kg
export function siguientePeso(id, v, dir) {
  const lista = pesosPosibles(id), paso = pasoDe(id);
  if (!lista?.length) return v == null ? (dir > 0 ? paso : null) : Math.max(0, Math.round((v + dir * paso) * 100) / 100);
  if (v == null) return dir > 0 ? lista[0] : null;
  const c = dir > 0 ? lista.find(w => w > v + 1e-6) : [...lista].reverse().find(w => w < v - 1e-6);
  return c ?? null;
}
// El peso que existe más cercano
export function pesoCercano(id, v) {
  const lista = pesosPosibles(id);
  if (!lista?.length || v == null) return v;
  return lista.reduce((a, w) => (Math.abs(w - v) < Math.abs(a - v) ? w : a), lista[0]);
}
