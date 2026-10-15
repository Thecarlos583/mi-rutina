// Registro de lo que se hizo de verdad, serie por serie, y "Terminé el día". Todo va en log[fecha]:
//   reg[puesto] = { e: ejercicio, estado: 'hecho' | 'no' | 'borrador', series: [{ r, w, wv, u, ok, s, t }], notas: [], txt, motivo }
//     r = repeticiones · w = peso en lbs · wv/u = el peso tal cual se escribió y en qué unidad · ok = serie hecha
//     s = 'pesado' | 'bien' | 'facil' · t = fila tocada a mano (las de abajo ya no la copian)
//   fin = { t, variante, semana, dia, dur, est, hechos, total, series } · t0 = hora en que empezó la sesión
// Los registros viejos no traen ok: todas sus series cuentan como hechas.
import { S, dia, leerDia, guardar } from './store.js';
import { INICIO, FRASES_FIN } from './data.js';
import { NOMBRE_DIA, fechaCorta } from './calendario.js';
import { ultimoPeso, unidadDe, aVista, aLbs, sugeridoVista, ejercicio, siguientePeso, nombreVariante, duracionEstimada } from './rutina.js';
import { ico, num, abrirHoja, cerrarHoja, vibrar, aviso, confeti, sonar, semilla } from './util.js';

const SIN_PESO = ['corp', 'banda'];
export const usaPeso = id => !SIN_PESO.includes(INICIO[id]?.[1]);
export const registro = (f, slot) => leerDia(f).reg?.[slot] || null;
export const hechasDe = reg => (reg?.series || []).filter(x => x.ok !== false);
// El peso de una serie en la unidad que se ve (exacto si se anotó en esa misma unidad)
export const pesoVista = (x, id) => (x.w == null ? null : x.u === unidadDe(id) && x.wv != null ? x.wv : aVista(id, x.w));

// Lo indicado: "8-10" → 10 · "12/brazo" → 12 · "7+7+7" → 21 · "1 min" → 60 s · "máx. 15" → 15
export function objetivo(reps) {
  const t = String(reps).toLowerCase();
  const nums = (t.match(/\d+/g) || []).map(Number);
  if (!nums.length) return { r: 10, seg: false };
  if (t.includes('min')) return { r: nums[0] * 60, seg: true };
  if (/\d\s*s\b/.test(t)) return { r: nums[0], seg: true };
  if (t.includes('+')) return { r: nums.reduce((a, b) => a + b, 0), seg: false };
  return { r: Math.max(...nums), seg: false };
}
// El rango: "10-12" → 10 a 12 · "12/brazo" → 12 · "máx. 15" → libre hasta 15
export function rango(reps) {
  const t = String(reps).toLowerCase(), nums = (t.match(/\d+/g) || []).map(Number);
  if (!nums.length) return null;
  if (t.includes('máx')) return { min: nums[0], max: nums[0], libre: true };
  return { min: nums[0], max: nums[1] && !t.includes('+') ? nums[1] : nums[0] };
}

// El último registro con series hechas de un ejercicio, antes de una fecha
export function ultimoRegistro(id, antesDe) {
  const fechas = Object.keys(S().log).filter(x => x < antesDe).sort().reverse();
  for (const x of fechas) {
    const r = Object.values(S().log[x].reg || {}).find(g => g.e === id && g.estado === 'hecho' && hechasDe(g).length);
    if (r) return { ...r, f: x };
  }
  return null;
}

// "2,5 kg × 8, 8, 7" · "10 kg × 8, 12,5 kg × 6" · "8, 8, 7 reps"
export function textoRegistro(reg, id) {
  const fs = hechasDe(reg), u = unidadDe(id);
  const rs = fs.map(x => `${x.r}${reg.seg ? ' s' : ''}`);
  const ws = fs.map(x => pesoVista(x, id));
  if (!usaPeso(id) || ws.every(w => w == null)) return `${rs.join(', ')}${reg.seg ? '' : ' reps'}`;
  if (ws.every(w => w === ws[0])) return `${num(ws[0])} ${u} × ${rs.join(', ')}`;
  return fs.map((x, k) => `${ws[k] != null ? num(ws[k]) + ' ' + u : '—'} × ${rs[k]}`).join(' · ');
}

// ── Progresión doble: qué hacer la próxima vez ──────────────
// Compara lo hecho con el rango y devuelve { txt, w (peso sugerido en la unidad que se ve), r (repeticiones a buscar) }
const mediana = xs => { const o = [...xs].sort((a, b) => a - b); return o[Math.floor((o.length - 1) / 2)]; };
export function sugerencia(reg, reps, id) {
  const fs = hechasDe(reg), R = rango(reps);
  if (!fs.length || !R || reg.seg) return null;
  const rs = fs.map(x => x.r), conPeso = usaPeso(id), u = unidadDe(id);
  const w = conPeso ? pesoVista(fs[0], id) : null, wt = w != null ? `${num(w)} ${u}` : '';
  if (R.libre) {
    if (rs.every(r => r >= R.max)) return { txt: `Llegaste a ${R.max} en todas las series: prueba la versión más difícil en "Cambiar ejercicio".` };
    return { txt: `Meta: ${Math.min(R.max, mediana(rs) + 1)} repeticiones por serie, con buena técnica.`, r: Math.min(R.max, mediana(rs) + 1) };
  }
  const med = mediana(rs), pesadas = fs.every(x => x.s === 'pesado');
  const faltaPeso = (reg.notas || []).includes(NOTAS[0]);
  // Muy por debajo (3 o más reps en la mayoría de las series) o todo "Muy pesado": bajar
  if (med <= R.min - 3 || pesadas) {
    const menor = conPeso && w != null ? siguientePeso(id, w, -1) : null;
    if (!conPeso) return { txt: `Haz las que puedas, descansa 10-15 s y saca 2 o 3 más hasta llegar a ${R.min}.`, r: R.min };
    if (faltaPeso || menor == null || menor <= 0) return { txt: `No hay un peso más bajo: haz las que puedas con ${wt}, descansa 10-15 s y saca 2 o 3 más hasta llegar a ${R.min}.`, w, r: R.min };
    return { txt: `Baja el peso a ${num(menor)} ${u} y busca ${R.min}-${R.max} repeticiones.`, w: menor, r: R.min };
  }
  // Por debajo del rango: mismo peso, una o dos repeticiones más
  if (rs.some(r => r < R.min)) {
    const m = med + 1, meta = m < R.min ? `${m} o ${R.min}` : `${R.min}`;
    return { txt: `${wt ? `Mantén ${wt}` : 'Mantén el ejercicio'}. Meta: ${meta} repeticiones. Cuando hagas ${R.max} en todas las series, sube.`, w, r: Math.min(m, R.min) };
  }
  // El máximo en todas y sin "Muy pesado": subir
  if (rs.every(r => r >= R.max) && !fs.some(x => x.s === 'pesado')) {
    if (!conPeso) return { txt: `Hiciste ${R.max} en todas: suma 1-2 repeticiones o prueba una versión más difícil.` };
    const mayor = w != null ? siguientePeso(id, w, 1) : null;
    if (mayor == null) return { txt: `Hiciste ${R.max} en todas. No hay un peso más alto: suma 1-2 repeticiones o baja 1 s más lento.`, w };
    return { txt: `Sube al siguiente peso: ${num(mayor)} ${u}, y busca ${R.min} repeticiones.`, w: mayor, r: R.min };
  }
  // Dentro del rango
  return { txt: `${wt ? `Mantén ${wt}` : 'Mantén el ejercicio'} y suma 1 repetición por serie.`, w, r: Math.min(R.max, med + 1) };
}

// ── Filas de series de una tarjeta ──────────────────────────
// Lo anotado hoy; si no hay nada, la primera fila trae lo de la vez anterior (o la sugerencia) y las demás la copian.
export function filasDe(f, s) {
  const id = s.ej.id, d = leerDia(f), reg = registro(f, s.slot), u = unidadDe(id);
  const marcadas = d.series?.[s.slot] || [];
  if (reg && reg.e === id && reg.series?.length && reg.estado !== 'no') {
    const fs = reg.series.map(x => ({ r: x.r, w: usaPeso(id) ? pesoVista(x, id) : null, ok: x.ok !== false, s: x.s || null, t: !!x.t }));
    while (fs.length < s.series) fs.push({ ...fs.at(-1), ok: false, s: null, t: false });
    return fs;
  }
  const ant = ultimoRegistro(id, f), sug = ant ? sugerencia(ant, s.reps, id) : null, prim = ant ? hechasDe(ant)[0] : null;
  let w = null;
  if (usaPeso(id)) {
    w = sug?.w ?? (prim ? pesoVista(prim, id) : null);
    if (w == null) { const g = d.pesos?.[id] ?? ultimoPeso(id, f); w = g != null ? aVista(id, g) : INICIO[id]?.[0] ? sugeridoVista(id, INICIO[id][0]) : null; }
  }
  const r = prim?.r ?? objetivo(s.reps).r;
  return Array.from({ length: Math.max(s.series, marcadas.length) }, (_, k) => ({ r, w, ok: !!marcadas[k], s: null, t: false }));
}

// Guarda las filas: el registro, las burbujas y el peso del día (Progreso y el historial los usan)
export function guardarFilas(f, s, fs, extra = {}) {
  const id = s.ej.id, dd = dia(f), u = unidadDe(id), conPeso = usaPeso(id);
  dd.reg ||= {};
  const prev = dd.reg[s.slot]?.e === id ? dd.reg[s.slot] : {};
  const algunaHecha = fs.some(x => x.ok);
  if (algunaHecha) dd.t0 ||= Date.now();
  dd.reg[s.slot] = {
    ...prev, ...extra, e: id, estado: algunaHecha ? 'hecho' : 'borrador', motivo: undefined,
    seg: objetivo(s.reps).seg || undefined,
    series: fs.map(x => ({ r: x.r, w: conPeso && x.w != null ? aLbs(id, x.w) : null, wv: conPeso ? x.w : null, u, ok: !!x.ok, s: x.s || undefined, t: x.t || undefined })),
  };
  dd.series ||= {};
  dd.series[s.slot] = fs.map(x => !!x.ok);
  const ws = fs.filter(x => x.ok && x.w != null).map(x => aLbs(id, x.w));
  dd.pesos ||= {};
  if (conPeso && ws.length) dd.pesos[id] = Math.max(...ws); else if (!fs.some(x => x.ok)) delete dd.pesos[id];
  guardar();
}

// ── "No hice": el motivo ────────────────────────────────────
const MOTIVOS = ['No hay la máquina', 'Estaba ocupada', 'Me molestaba algo', 'No me dio tiempo'];
export function hojaNoHice(f, s, { alGuardar, abrirAlternativas }) {
  const h = abrirHoja(`
    <p class="eyebrow">${ico('saltar')} No lo hiciste</p>
    <h3 class="hoja-t">${s.ej.n}</h3>
    <p class="hoja-sub">¿Qué pasó?</p>
    <div class="motivos">${MOTIVOS.map(m => `<button class="btn-sec" data-m="${m}">${m}</button>`).join('')}</div>
    <div class="sin-maquina" hidden>
      <p>¿Tu gimnasio no tiene esta máquina?</p>
      <button class="btn-pri" data-ocultar>Ocultar este ejercicio siempre</button>
      <button class="btn-sec" data-alts>${ico('cambiar')} Ver alternativas</button>
      <button class="link" data-listo>Solo anotarlo</button>
    </div>`);
  const anotar = motivo => {
    const dd = dia(f);
    dd.reg ||= {};
    dd.reg[s.slot] = { e: s.ej.id, estado: 'no', motivo };
    if (dd.series) delete dd.series[s.slot];
    guardar(); vibrar(8);
  };
  h.onclick = ev => {
    const b = ev.target.closest('button');
    if (!b) return;
    if (b.dataset.m) {
      anotar(b.dataset.m);
      if (b.dataset.m === 'No hay la máquina') { h.querySelector('.motivos').hidden = true; h.querySelector('.sin-maquina').hidden = false; return; }
      cerrarHoja(); alGuardar?.(); return;
    }
    if (b.hasAttribute('data-ocultar')) {
      const a = S().ajustes;
      a.ocultos = [...new Set([...(a.ocultos || []), s.ej.id])];
      delete dia(f).reg[s.slot]; // ya no aparece: no queda como "no hecho"
      guardar();
      cerrarHoja();
      aviso(`${s.ej.n} quedó oculto. Lo puedes volver a activar en Ajustes`, 'check');
      alGuardar?.(); return;
    }
    if (b.hasAttribute('data-alts')) { cerrarHoja(); setTimeout(() => abrirAlternativas?.(), 320); return; }
    if (b.hasAttribute('data-listo')) { cerrarHoja(); alGuardar?.(); }
  };
}

// ── En la tarjeta ───────────────────────────────────────────
export const NOTAS = ['No había el peso que necesitaba', 'Máquina ocupada', 'Cambié de ejercicio'];
export const SENSACION = [['pesado', 'Muy pesado'], ['bien', 'Bien'], ['facil', 'Fácil']];

// Nota rápida del ejercicio
export function notaHTML(f, s) {
  const r = registro(f, s.slot), notas = r?.e === s.ej.id ? r.notas || [] : [], txt = r?.e === s.ej.id ? r.txt || '' : '';
  return `<details class="nota-ej" ${notas.length || txt ? 'open' : ''}><summary>${ico('guia')} Nota${notas.length || txt ? ` · ${notas.length + (txt ? 1 : 0)}` : ''}</summary>
    <div class="nota-chips">${NOTAS.map(n => `<button class="chip-n ${notas.includes(n) ? 'on' : ''}" data-a="nota" data-n="${n}" aria-pressed="${notas.includes(n)}">${n}</button>`).join('')}</div>
    <input class="nota-txt" data-nota-txt type="text" maxlength="140" placeholder="Escribe algo (opcional)" value="${txt.replace(/"/g, '&quot;')}">
  </details>`;
}

// Estado del ejercicio: "Hice todo" / "No hice", o lo que quedó anotado
export function regTarjetaHTML(f, s) {
  const r = registro(f, s.slot);
  if (r?.estado === 'no') return `<div class="reg-res no">${ico('saltar')}<span>No lo hiciste${r.motivo ? ` · ${r.motivo.toLowerCase()}` : ''}</span><button class="link" data-a="reg-quitar">Deshacer</button></div>`;
  const hechas = r?.e === s.ej.id ? hechasDe(r) : [];
  if (hechas.length && hechas.length >= s.series) {
    const sug = sugerencia(r, s.reps, s.ej.id);
    return `<div class="reg-res hecho">${ico('check')}<span>Hiciste <b>${textoRegistro(r, r.e)}</b></span><button class="link" data-a="reg-quitar">Deshacer</button></div>
      ${sug ? `<p class="sug sug-prox">${ico('subir')}<span><b>Para la próxima:</b> ${sug.txt}</span></p>` : ''}`;
  }
  return `<div class="hice-fila"><button class="btn-hice" data-a="hice-todo">✅ Hice todo</button><button class="btn-nohice" data-a="no-hice">⏭️ No hice</button></div>`;
}
export const claseRegistro = (f, s) => ({ hecho: 'reg-hecho', no: 'reg-no' }[registro(f, s.slot)?.estado] || '');

// ── "Terminé el día" ────────────────────────────────────────
export function finHTML(f, ss, esHoy) {
  const fin = leerDia(f).fin;
  if (fin) return `<section class="card fin-dia">${ico('trofeo')}<div><b>Día terminado</b><small>${fin.hechos} de ${fin.total} ejercicios · ${fin.series} series${fin.dur ? ` · ${fin.dur} min` : ''}${fin.est ? ` (estimado ${fin.est})` : ''}</small></div>
    <div class="fila-2"><button class="btn-sec" data-a="resumen">Ver resumen</button>${esHoy ? `<button class="btn-sec" data-a="reabrir">${ico('deshacer')} Reabrir el día</button>` : '<span></span>'}</div></section>`;
  return `<div class="fin-barra"><button class="btn-pri btn-fin" data-a="terminar">🏁 Terminé el día</button></div>`;
}

const anotado = r => r?.estado === 'no' || hechasDe(r).length > 0;
export function terminarDia(f, p, ss, { alTerminar }) {
  const d = leerDia(f);
  const sinMarcar = ss.filter(s => !anotado(d.reg?.[s.slot]) && !s.hechas.some(Boolean));
  const cerrar = marcarNoHechos => {
    const dd = dia(f);
    dd.reg ||= {};
    for (const s of ss) {
      const r = dd.reg[s.slot];
      if (anotado(r) && r.estado !== 'borrador') continue;
      const n = s.hechas.filter(Boolean).length;
      if (n && !(r && hechasDe(r).length)) {
        // Burbujas marcadas sin filas (versiones viejas): se guarda lo indicado con el peso del día
        const w = dd.pesos?.[s.ej.id] ?? null, obj = objetivo(s.reps);
        dd.reg[s.slot] = { e: s.ej.id, estado: 'hecho', seg: obj.seg || undefined, series: Array.from({ length: n }, () => ({ r: obj.r, w, ok: true })) };
      } else if (!n && marcarNoHechos) dd.reg[s.slot] = { e: s.ej.id, estado: 'no', motivo: 'Sin marcar' };
    }
    const regs = ss.map(s => dd.reg[s.slot]).filter(Boolean);
    const hechos = regs.filter(r => r.estado === 'hecho' && hechasDe(r).length);
    dd.fin = {
      t: Date.now(), variante: p.variante, semana: p.semana, dia: p.diaPlan,
      dur: dd.t0 ? Math.max(1, Math.round((Date.now() - dd.t0) / 60000)) : null, est: duracionEstimada(ss),
      hechos: hechos.length, total: ss.length, series: hechos.reduce((a, r) => a + hechasDe(r).length, 0),
    };
    guardar();
    cerrarHoja();
    setTimeout(() => { hojaResumen(f, ss); confeti(); sonar.logro(); vibrar([80, 60, 80]); }, 320);
    alTerminar?.();
  };
  if (!sinMarcar.length) return cerrar(false);
  const h = abrirHoja(`<h3 class="hoja-t">Te ${sinMarcar.length === 1 ? 'queda 1 ejercicio' : `quedan ${sinMarcar.length} ejercicios`} sin marcar</h3>
    <p class="hoja-sub">${sinMarcar.map(s => s.ej.n).join(' · ')}</p>
    <p>¿${sinMarcar.length === 1 ? 'Lo marco como no hecho' : 'Los marco como no hechos'}?</p>
    <button class="btn-pri" data-si>Sí, y terminar el día</button>
    <button class="btn-sec" data-volver>Volver</button>`);
  h.onclick = ev => {
    if (ev.target.closest('[data-si]')) cerrar(true);
    else if (ev.target.closest('[data-volver]')) cerrarHoja();
  };
}

export function hojaResumen(f, ss) {
  const d = leerDia(f), fin = d.fin;
  if (!fin) return;
  const cambios = ss.map(s => d.reg?.[s.slot]).filter(r => r?.estado === 'hecho').map(r => {
    const ws = hechasDe(r).map(x => x.w).filter(w => w != null);
    if (!ws.length || !usaPeso(r.e)) return null;
    const hoyW = Math.max(...ws), antes = ultimoPeso(r.e, f);
    if (antes == null) return { n: ejercicio(r.e).n, txt: `${num(aVista(r.e, hoyW))} ${unidadDe(r.e)} (primera vez)`, cls: '' };
    const dif = Math.round((aVista(r.e, hoyW) - aVista(r.e, antes)) * 10) / 10;
    if (!dif) return null;
    return { n: ejercicio(r.e).n, txt: `${dif > 0 ? '+' : ''}${num(dif)} ${unidadDe(r.e)}`, cls: dif > 0 ? 'sube' : 'baja' };
  }).filter(Boolean);
  abrirHoja(`<div class="resumen">
    <p class="eyebrow">${ico('trofeo')} ${NOMBRE_DIA[fin.dia] || ''} ${fechaCorta(f)} · Semana ${fin.semana} · ${nombreVariante(fin.variante)}</p>
    <h3 class="hoja-t">¡Día terminado!</h3>
    <div class="res-tiles">
      <div><b>${fin.hechos}<small> de ${fin.total}</small></b><span>ejercicios</span></div>
      <div><b>${fin.series}</b><span>series</span></div>
      <div><b>${fin.dur ?? '—'}<small>${fin.dur ? ' min' : ''}</small></b><span>${fin.est ? `duró (estimado ${fin.est})` : 'duración'}</span></div>
    </div>
    ${cambios.length ? `<h4>Cambios de peso</h4><ul class="res-pesos">${cambios.map(c => `<li><span>${c.n}</span><b class="${c.cls}">${c.txt}</b></li>`).join('')}</ul>` : ''}
    <p class="res-frase">${FRASES_FIN[semilla(f) % FRASES_FIN.length]}</p>
    <button class="btn-pri" data-cerrar-res>Listo</button></div>`).onclick = ev => { if (ev.target.closest('[data-cerrar-res]')) cerrarHoja(); };
}
