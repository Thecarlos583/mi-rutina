// Registro de lo que se hizo de verdad: "Hice" (series, repeticiones y peso reales), "No hice" (con motivo)
// y "Terminé el día" (cierre con resumen). Todo va en log[fecha]:
//   reg[puesto] = { e: ejercicio, estado: 'hecho' | 'no', series: [{ r, w }] (w en lbs o null), motivo }
//   fin = { t, variante, semana, dia, dur, hechos, total, series } · t0 = hora del primer ejercicio marcado
import { S, dia, leerDia, guardar } from './store.js';
import { INICIO, FRASES_FIN } from './data.js';
import { sumar, NOMBRE_DIA, fechaCorta } from './calendario.js';
import { ultimoPeso, unidadDe, aVista, aLbs, pasoDe, sugeridoVista, ejercicio } from './rutina.js';
import { $, ico, num, abrirHoja, cerrarHoja, vibrar, aviso, confeti, sonar, semilla } from './util.js';

const SIN_PESO = ['corp', 'banda'];
const usaPeso = id => !SIN_PESO.includes(INICIO[id]?.[1]);
export const registro = (f, slot) => leerDia(f).reg?.[slot] || null;

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

// El último registro "hecho" de un ejercicio antes de una fecha
export function ultimoRegistro(id, antesDe) {
  const fechas = Object.keys(S().log).filter(x => x < antesDe).sort().reverse();
  for (const x of fechas) {
    const r = Object.values(S().log[x].reg || {}).find(g => g.e === id && g.estado === 'hecho' && g.series?.length);
    if (r) return { ...r, f: x };
  }
  return null;
}

// "3×15 · 40 lbs" o "15, 15, 12 · 40 lbs"
export function textoRegistro(reg, id) {
  const rs = reg.series.map(x => x.r), igual = rs.every(r => r === rs[0]);
  const reps = igual ? `${rs.length}×${rs[0]}${reg.seg ? ' s' : ''}` : rs.join(', ');
  const ws = reg.series.map(x => x.w).filter(w => w != null);
  if (!ws.length || !usaPeso(id)) return reps;
  const mx = Math.max(...ws);
  return `${reps} · ${num(aVista(id, mx))} ${unidadDe(id)}`;
}

// Dos veces seguidas por debajo de lo indicado → "¿ajustar a 3×15?"
export function sugerenciaAjuste(s, f) {
  const obj = objetivo(s.reps);
  if (obj.seg) return null;
  const id = s.ej.id, regs = [];
  const hoyReg = registro(f, s.slot);
  if (hoyReg?.estado === 'hecho' && hoyReg.e === id) regs.push({ ...hoyReg, f });
  let antes = f;
  while (regs.length < 2) {
    const r = ultimoRegistro(id, antes);
    if (!r) break;
    regs.push(r); antes = r.f;
  }
  if (regs.length < 2 || !regs.every(r => r.series.every(x => x.r > 0 && x.r < obj.r))) return null;
  if (S().ajusteVisto?.[s.clave] >= regs[0].f) return null;
  const rs = regs[0].series.map(x => x.r).sort((a, b) => a - b);
  return rs[Math.floor(rs.length / 2)];
}

const marcarInicio = d => { d.t0 ||= Date.now(); };

// ── "Hice": registro rápido con + y − ───────────────────────
export function hojaHice(f, s, alGuardar) {
  const id = s.ej.id, u = unidadDe(id), paso = pasoDe(id), conPeso = usaPeso(id);
  const obj = objetivo(s.reps), d = leerDia(f), previo = registro(f, s.slot);
  // Peso de partida (en la unidad que ves): el de hoy, el de la última vez o el de "Empieza con"
  const guardado = d.pesos?.[id] ?? ultimoPeso(id, f);
  const wVista = guardado != null ? aVista(id, guardado) : INICIO[id]?.[0] ? sugeridoVista(id, INICIO[id][0]) : null;
  // Si ya hay registro, se edita; si marcaste burbujas, trae esas series; si no, lo indicado
  const marcadas = s.hechas.filter(Boolean).length;
  let filas = previo?.estado === 'hecho' && previo.e === id
    ? previo.series.map(x => ({ r: x.r, w: x.w != null ? aVista(id, x.w) : wVista }))
    : Array.from({ length: marcadas || s.series }, () => ({ r: obj.r, w: wVista }));
  const unidadR = obj.seg ? 's' : 'reps', pasoR = obj.seg ? 5 : 1;
  const pintar = () => `
    <p class="eyebrow">${ico('check')} Lo que hiciste</p>
    <h3 class="hoja-t">${s.ej.n}</h3>
    <p class="hoja-sub">Indicado: ${s.series}×${s.reps}. Cambia lo que no te salió igual.</p>
    <div class="reg-filas">${filas.map((x, k) => `<div class="reg-fila" data-k="${k}">
      <b class="reg-n">${k + 1}</b>
      <div class="reg-ctl" aria-label="Repeticiones de la serie ${k + 1}"><button data-r="-${pasoR}" aria-label="Menos">${ico('menos')}</button><span><b>${x.r}</b><small>${unidadR}</small></span><button data-r="${pasoR}" aria-label="Más">${ico('mas')}</button></div>
      ${conPeso ? `<div class="reg-ctl" aria-label="Peso de la serie ${k + 1}"><button data-w="-${paso}" aria-label="Menos peso">${ico('menos')}</button><span><b>${x.w != null ? num(x.w) : '—'}</b><small>${u}</small></span><button data-w="${paso}" aria-label="Más peso">${ico('mas')}</button></div>` : ''}
    </div>`).join('')}</div>
    <div class="fila-2"><button class="btn-sec" data-serie="-1">${ico('menos')} Quitar serie</button><button class="btn-sec" data-serie="1">${ico('mas')} Agregar serie</button></div>
    <button class="btn-pri" data-guardar>Guardar</button>`;
  const h = abrirHoja(pintar());
  const repintar = () => { const y = h.scrollTop; h.innerHTML = '<div class="hoja-asa"></div>' + pintar(); h.scrollTop = y; };
  h.onclick = ev => {
    const b = ev.target.closest('button');
    if (!b) return;
    const k = Number(b.closest('[data-k]')?.dataset.k);
    if (b.dataset.r) { filas[k].r = Math.max(0, filas[k].r + Number(b.dataset.r)); vibrar(6); return repintar(); }
    if (b.dataset.w) { filas[k].w = Math.max(0, Math.round(((filas[k].w ?? 0) + Number(b.dataset.w)) * 100) / 100); vibrar(6); return repintar(); }
    if (b.dataset.serie) {
      if (b.dataset.serie === '1') filas.push({ ...(filas.at(-1) || { r: obj.r, w: wVista }) });
      else if (filas.length > 1) filas.pop();
      vibrar(6); return repintar();
    }
    if (b.hasAttribute('data-guardar')) {
      const dd = dia(f);
      marcarInicio(dd);
      dd.reg ||= {};
      dd.reg[s.slot] = { e: id, estado: 'hecho', seg: obj.seg || undefined, series: filas.map(x => ({ r: x.r, w: conPeso && x.w != null ? aLbs(id, x.w) : null })) };
      // Las burbujas y el peso del día siguen igual que antes (Progreso y el historial los usan)
      dd.series ||= {};
      dd.series[s.slot] = Array.from({ length: Math.max(s.series, filas.length) }, (_, j) => j < filas.length);
      const ws = dd.reg[s.slot].series.map(x => x.w).filter(w => w != null);
      if (ws.length) { dd.pesos ||= {}; dd.pesos[id] = Math.max(...ws); }
      guardar(); vibrar(); sonar.serie();
      cerrarHoja();
      alGuardar?.();
    }
  };
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
    marcarInicio(dd);
    dd.reg ||= {};
    dd.reg[s.slot] = { e: s.ej.id, estado: 'no', motivo };
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
export function regTarjetaHTML(f, s) {
  const r = registro(f, s.slot), sug = sugerenciaAjuste(s, f);
  const ajuste = sug ? `<div class="reg-ajuste"><p>${ico('subir')}<span>Dos veces seguidas hiciste menos de ${s.reps}. ¿Quieres ajustar este ejercicio a <b>${s.series}×${sug}</b>?</span></p>
    <div class="fila-2"><button class="btn-sec" data-a="ajuste-si" data-r="${sug}">Sí</button><button class="btn-sec" data-a="ajuste-no">No</button></div></div>` : '';
  if (r?.estado === 'hecho') return `${ajuste}<div class="reg-res hecho">${ico('check')}<span>Hiciste <b>${textoRegistro(r, r.e)}</b></span><button class="link" data-a="hice">Editar</button><button class="link" data-a="reg-quitar">Deshacer</button></div>`;
  if (r?.estado === 'no') return `<div class="reg-res no">${ico('saltar')}<span>No lo hiciste${r.motivo ? ` · ${r.motivo.toLowerCase()}` : ''}</span><button class="link" data-a="reg-quitar">Deshacer</button></div>`;
  return `${ajuste}<div class="hice-fila"><button class="btn-hice" data-a="hice">✅ Hice</button><button class="btn-nohice" data-a="no-hice">⏭️ No hice</button></div>`;
}
export const claseRegistro = (f, s) => ({ hecho: 'reg-hecho', no: 'reg-no' }[registro(f, s.slot)?.estado] || '');

// ── "Terminé el día" ────────────────────────────────────────
export function finHTML(f, ss, esHoy) {
  const fin = leerDia(f).fin;
  if (fin) return `<section class="card fin-dia">${ico('trofeo')}<div><b>Día terminado</b><small>${fin.hechos} de ${fin.total} ejercicios · ${fin.series} series${fin.dur ? ` · ${fin.dur} min` : ''}</small></div>
    <div class="fila-2"><button class="btn-sec" data-a="resumen">Ver resumen</button>${esHoy ? `<button class="btn-sec" data-a="reabrir">${ico('deshacer')} Reabrir el día</button>` : '<span></span>'}</div></section>`;
  return `<div class="fin-barra"><button class="btn-pri btn-fin" data-a="terminar">🏁 Terminé el día</button></div>`;
}

export function terminarDia(f, p, ss, { alTerminar }) {
  const d = leerDia(f);
  const sinMarcar = ss.filter(s => !d.reg?.[s.slot] && !s.hechas.some(Boolean));
  const cerrar = marcarNoHechos => {
    const dd = dia(f);
    dd.reg ||= {};
    for (const s of ss) {
      if (dd.reg[s.slot]) continue;
      const n = s.hechas.filter(Boolean).length;
      if (n) {
        // Marcaste burbujas sin "Hice": se guarda lo indicado con el peso del día
        const w = dd.pesos?.[s.ej.id] ?? null, obj = objetivo(s.reps);
        dd.reg[s.slot] = { e: s.ej.id, estado: 'hecho', seg: obj.seg || undefined, series: Array.from({ length: n }, () => ({ r: obj.r, w })) };
      } else if (marcarNoHechos) dd.reg[s.slot] = { e: s.ej.id, estado: 'no', motivo: 'Sin marcar' };
    }
    const regs = ss.map(s => dd.reg[s.slot]).filter(Boolean);
    const hechos = regs.filter(r => r.estado === 'hecho');
    dd.fin = {
      t: Date.now(), variante: p.variante, semana: p.semana, dia: p.diaPlan,
      dur: dd.t0 ? Math.max(1, Math.round((Date.now() - dd.t0) / 60000)) : null,
      hechos: hechos.length, total: ss.length, series: hechos.reduce((a, r) => a + r.series.length, 0),
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
    const ws = r.series.map(x => x.w).filter(w => w != null);
    if (!ws.length || !usaPeso(r.e)) return null;
    const hoyW = Math.max(...ws), antes = ultimoPeso(r.e, f);
    if (antes == null) return { n: ejercicio(r.e).n, txt: `${num(aVista(r.e, hoyW))} ${unidadDe(r.e)} (primera vez)`, cls: '' };
    const dif = Math.round((aVista(r.e, hoyW) - aVista(r.e, antes)) * 10) / 10;
    if (!dif) return null;
    return { n: ejercicio(r.e).n, txt: `${dif > 0 ? '+' : ''}${num(dif)} ${unidadDe(r.e)}`, cls: dif > 0 ? 'sube' : 'baja' };
  }).filter(Boolean);
  abrirHoja(`<div class="resumen">
    <p class="eyebrow">${ico('trofeo')} ${NOMBRE_DIA[fin.dia] || ''} ${fechaCorta(f)} · Semana ${fin.semana} · ${fin.variante === 'B0' ? 'B' : fin.variante}</p>
    <h3 class="hoja-t">¡Día terminado!</h3>
    <div class="res-tiles">
      <div><b>${fin.hechos}<small> de ${fin.total}</small></b><span>ejercicios</span></div>
      <div><b>${fin.series}</b><span>series</span></div>
      <div><b>${fin.dur ?? '—'}<small>${fin.dur ? ' min' : ''}</small></b><span>duración</span></div>
    </div>
    ${cambios.length ? `<h4>Cambios de peso</h4><ul class="res-pesos">${cambios.map(c => `<li><span>${c.n}</span><b class="${c.cls}">${c.txt}</b></li>`).join('')}</ul>` : ''}
    <p class="res-frase">${FRASES_FIN[semilla(f) % FRASES_FIN.length]}</p>
    <button class="btn-pri" data-cerrar-res>Listo</button></div>`).onclick = ev => { if (ev.target.closest('[data-cerrar-res]')) cerrarHoja(); };
}
