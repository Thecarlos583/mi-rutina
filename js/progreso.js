// Pantalla "Progreso": racha, calendario del mes, cintura y evolución de pesos
import { GRUPOS } from './data.js';
import { S, guardar } from './store.js';
import { hoy, aFecha, iso, sumar, lunesDe, diaDe, fechaCorta, MESES } from './calendario.js';
import { racha, resumenDia, historialPesos, historialVista, unidadDe, ejercicio } from './rutina.js';
import { $, ico, num, vibrar, aviso } from './util.js';

let mes = 0;          // 0 = mes actual, -1 = anterior…
let abierto = null;   // ejercicio con la gráfica grande abierta
let raiz;

export function renderProgreso(el) {
  raiz = el;
  el.onclick = alTocar;
  el.oninput = el.onchange = null;
  const f = hoy();
  el.innerHTML = `<header class="top"><p class="saludo">Tu evolución</p><h1>Progreso</h1></header>
    ${stats(f)}
    ${calendario(f)}
    ${cintura(f)}
    ${pesos(f)}`;
}

// ── Números grandes ─────────────────────────────────────────
function stats(f) {
  const r = racha(f);
  const pref = f.slice(0, 7);
  const dias = Object.keys(S().log).filter(d => d.startsWith(pref) && d <= f);
  const entrenos = dias.filter(d => resumenDia(d).algo).length;
  const series = dias.reduce((a, d) => a + resumenDia(d).series, 0);
  const tile = (icono, valor, etiqueta, cls = '') => `<div class="stat ${cls}">${ico(icono)}<b>${valor}</b><span>${etiqueta}</span></div>`;
  return `<section class="stats">
    ${tile('fuego', r, r === 1 ? 'día de racha' : 'días de racha', 'racha')}
    ${tile('cal', entrenos, 'entrenos este mes')}
    ${tile('hoy', series, 'series este mes')}
  </section>`;
}

// ── Calendario ──────────────────────────────────────────────
function calendario(f) {
  const base = aFecha(f);
  const m = new Date(base.getFullYear(), base.getMonth() + mes, 1);
  const primero = iso(m);
  const diasMes = new Date(m.getFullYear(), m.getMonth() + 1, 0).getDate();
  const huecos = (m.getDay() + 6) % 7;
  let celdas = '<span class="cal-v"></span>'.repeat(huecos);
  for (let k = 0; k < diasMes; k++) {
    const d = sumar(primero, k), r = resumenDia(d);
    const cls = [r.completo ? 'completo' : r.algo ? 'parcial' : '', d === f ? 'hoy' : '', d > f ? 'futuro' : '', diaDe(d) === 'dom' ? 'dom' : ''].join(' ');
    celdas += `<button class="cal-d ${cls}" data-a="cal-dia" data-f="${d}" aria-label="${fechaCorta(d)}${r.completo ? ', completo' : r.algo ? ', parcial' : ''}">${k + 1}</button>`;
  }
  return `<section class="card">
    <div class="card-cab">
      <button class="cal-nav" data-a="mes" data-d="-1" aria-label="Mes anterior">${ico('abajo')}</button>
      <h3>${MESES[m.getMonth()][0].toUpperCase() + MESES[m.getMonth()].slice(1)} ${m.getFullYear()}</h3>
      <button class="cal-nav sig" data-a="mes" data-d="1" aria-label="Mes siguiente" ${mes >= 0 ? 'disabled' : ''}>${ico('abajo')}</button>
    </div>
    <div class="cal">${['L', 'M', 'M', 'J', 'V', 'S', 'D'].map(x => `<span class="cal-h">${x}</span>`).join('')}${celdas}</div>
    <div class="cal-ley"><span><i class="completo"></i>Completo</span><span><i class="parcial"></i>A medias</span><span><i class="dom"></i>Descanso</span></div>
  </section>`;
}

// ── Cintura ─────────────────────────────────────────────────
function cintura(f) {
  const sem = lunesDe(f), datos = Object.entries(S().cintura).sort(([a], [b]) => a.localeCompare(b)).map(([d, v]) => ({ f: d, w: v }));
  const actual = S().cintura[sem];
  let delta = '';
  if (datos.length > 1) {
    const dif = Math.round((datos[datos.length - 1].w - datos[0].w) * 10) / 10;
    delta = `<p class="delta ${dif < 0 ? 'bien' : dif > 0 ? 'ojo' : ''}">${dif > 0 ? '+' : ''}${num(dif)} cm desde ${fechaCorta(datos[0].f)}</p>`;
  }
  return `<section class="card">
    <div class="card-cab"><h3>Cintura</h3><span class="cont">semanal</span></div>
    <div class="cintura-in">
      <label class="peso-in"><input type="number" inputmode="decimal" step="0.1" min="0" id="cintura" value="${actual ?? ''}" placeholder="${datos.at(-1)?.w ?? '80'}" aria-label="Cintura en centímetros"><span>cm</span></label>
      <button class="btn-pri chico" data-a="cintura">${actual != null ? 'Actualizar' : 'Guardar'}</button>
    </div>
    <p class="txt2 peq">Mídela una vez por semana, en ayunas, a la altura del ombligo.</p>
    ${delta}
    ${datos.length ? grafica(datos, { color: '#FF6B4A', unidad: 'cm', id: 'cintura' }) : ''}
  </section>`;
}

// ── Pesos por ejercicio ─────────────────────────────────────
function pesos() {
  const ids = new Set();
  for (const d of Object.values(S().log)) for (const id of Object.keys(d.pesos || {})) ids.add(id);
  const lista = [...ids].map(id => ({ id, e: ejercicio(id), h: historialVista(id), u: unidadDe(id) }))
    .filter(x => x.e && x.h.length)
    .sort((a, b) => b.h.at(-1).f.localeCompare(a.h.at(-1).f));
  const cuerpo = lista.length ? lista.map(({ id, e, h, u }) => {
    const c = GRUPOS[e.g]?.c ?? '#FF6B4A', ult = h.at(-1).w, dif = Math.round((ult - h[0].w) * 10) / 10;
    return `<div class="pe ${abierto === id ? 'abierto' : ''}" style="--c:${c}">
      <button class="pe-cab" data-a="pe" data-id="${id}" aria-expanded="${abierto === id}">
        <i class="punto"></i>
        <span class="pe-n">${e.n}<small>${h.length} ${h.length === 1 ? 'registro' : 'registros'}${dif ? ` · ${dif > 0 ? '+' : ''}${num(dif)} ${u}` : ''}</small></span>
        ${chispa(h, c)}
        <b class="pe-v">${num(ult)}<small>${u}</small></b>
      </button>
      ${abierto === id ? grafica(h, { color: c, unidad: u, id: 'pe-' + id }) : ''}
    </div>`;
  }).join('') : `<p class="vacio">${ico('progreso')}Cuando anotes pesos en tus ejercicios, aquí vas a ver cómo subes.</p>`;
  return `<section class="card"><div class="card-cab"><h3>Pesos</h3><span class="cont">toca uno para ver la curva</span></div><div class="pe-lista">${cuerpo}</div></section>`;
}

// Mini línea sin ejes (una sola serie: su color ya la identifica)
function chispa(h, c) {
  const W = 72, H = 26;
  if (h.length < 2) return `<svg class="chispa" viewBox="0 0 ${W} ${H}" aria-hidden="true"><circle cx="${W - 4}" cy="${H / 2}" r="3" fill="${c}"/></svg>`;
  const ys = h.map(x => x.w), mn = Math.min(...ys), mx = Math.max(...ys), rg = mx - mn || 1;
  const pts = h.map((x, i) => [4 + (i / (h.length - 1)) * (W - 8), H - 4 - ((x.w - mn) / rg) * (H - 8)]);
  return `<svg class="chispa" viewBox="0 0 ${W} ${H}" aria-hidden="true"><polyline points="${pts.map(p => p.join(',')).join(' ')}" fill="none" stroke="${c}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><circle cx="${pts.at(-1)[0]}" cy="${pts.at(-1)[1]}" r="3" fill="${c}"/></svg>`;
}

// Gráfica de línea con ejes discretos; tocar un punto muestra su valor
function grafica(h, { color, unidad, id }) {
  const W = 320, H = 160, L = 34, R = 14, T = 18, B = 26;
  const ys = h.map(x => x.w);
  const mn0 = Math.min(...ys), mx0 = Math.max(...ys);
  // Marcas del eje en números redondos (1, 2, 5, 10…)
  const paso = [1, 2, 5, 10, 20, 25, 50, 100].find(p => p >= (mx0 - mn0) / 3) ?? 100;
  const mn = Math.max(0, Math.floor((mn0 - paso / 2) / paso) * paso), mx = Math.ceil((mx0 + paso / 2) / paso) * paso;
  const X = i => h.length === 1 ? (L + W - R) / 2 : L + (i / (h.length - 1)) * (W - L - R);
  const Y = v => T + (1 - (v - mn) / (mx - mn || 1)) * (H - T - B);
  const salto = (mx - mn) / paso > 5 ? paso * 2 : paso;
  const marcas = [];
  for (let v = mn; v <= mx + 1e-9; v += salto) marcas.push(v);
  const pts = h.map((x, i) => [X(i), Y(x.w)]);
  const area = h.length > 1 ? `<path d="M${pts[0][0]},${H - B} L${pts.map(p => p.join(',')).join(' L')} L${pts.at(-1)[0]},${H - B} Z" fill="url(#ar-${id})"/>` : '';
  const linea = h.length > 1 ? `<polyline points="${pts.map(p => p.join(',')).join(' ')}" fill="none" stroke="${color}" stroke-width="2" stroke-linejoin="round" stroke-linecap="round"/>` : '';
  const ult = pts.at(-1);
  return `<figure class="grafica" data-g="${id}">
    <svg viewBox="0 0 ${W} ${H}" role="img" aria-label="Evolución en ${unidad}: de ${num(h[0].w)} a ${num(h.at(-1).w)}">
      <defs><linearGradient id="ar-${id}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${color}" stop-opacity=".22"/><stop offset="1" stop-color="${color}" stop-opacity="0"/></linearGradient></defs>
      ${marcas.map(v => `<line x1="${L}" x2="${W - R}" y1="${Y(v)}" y2="${Y(v)}" class="g-grid"/><text x="${L - 6}" y="${Y(v) + 3.5}" text-anchor="end" class="g-eje">${num(v)}</text>`).join('')}
      ${area}${linea}
      <line class="g-cruz" x1="0" x2="0" y1="${T}" y2="${H - B}" style="opacity:0"/>
      ${pts.map(([x, y]) => `<circle cx="${x}" cy="${y}" r="4" fill="${color}" stroke="var(--card)" stroke-width="2"/>`).join('')}
      <text x="${Math.min(ult[0], W - R - 2)}" y="${ult[1] - 10}" text-anchor="${h.length > 1 ? 'end' : 'middle'}" class="g-val">${num(h.at(-1).w)} ${unidad}</text>
      <text x="${L}" y="${H - 6}" class="g-eje">${fechaCorta(h[0].f)}</text>
      ${h.length > 1 ? `<text x="${W - R}" y="${H - 6}" text-anchor="end" class="g-eje">${fechaCorta(h.at(-1).f)}</text>` : ''}
      ${pts.map(([x], i) => `<rect class="g-hit" data-i="${i}" x="${x - (W - L - R) / Math.max(2, h.length) / 2}" y="${T}" width="${(W - L - R) / Math.max(2, h.length)}" height="${H - T - B}" fill="transparent"/>`).join('')}
    </svg>
    <figcaption class="g-tip" hidden></figcaption>
    ${h.length === 1 ? '<p class="txt2 peq centro">Anota más días para ver la curva.</p>' : ''}
  </figure>`;
}

function tocarGrafica(fig, i, datos, unidad) {
  const svg = fig.querySelector('svg'), pts = [...svg.querySelectorAll('circle')];
  const p = pts[i];
  const cruz = svg.querySelector('.g-cruz');
  cruz.setAttribute('x1', p.getAttribute('cx')); cruz.setAttribute('x2', p.getAttribute('cx'));
  cruz.style.opacity = 1;
  pts.forEach((c, k) => c.setAttribute('r', k === i ? 6 : 4));
  const tip = fig.querySelector('.g-tip');
  tip.hidden = false;
  tip.innerHTML = `<b>${num(datos[i].w)} ${unidad}</b> · ${fechaCorta(datos[i].f)}`;
  vibrar(6);
}

function alTocar(e) {
  const hit = e.target.closest('.g-hit');
  if (hit) {
    const fig = hit.closest('.grafica'), g = fig.dataset.g, i = Number(hit.dataset.i);
    const datos = g === 'cintura'
      ? Object.entries(S().cintura).sort(([a], [b]) => a.localeCompare(b)).map(([f, w]) => ({ f, w }))
      : historialVista(g.slice(3));
    tocarGrafica(fig, i, datos, g === 'cintura' ? 'cm' : unidadDe(g.slice(3)));
    return;
  }
  const b = e.target.closest('[data-a]');
  if (!b) return;
  const a = b.dataset.a;
  if (a === 'mes') { mes = Math.min(0, mes + Number(b.dataset.d)); vibrar(8); renderProgreso(raiz); }
  else if (a === 'pe') { abierto = abierto === b.dataset.id ? null : b.dataset.id; vibrar(8); renderProgreso(raiz); }
  else if (a === 'cal-dia') {
    const r = resumenDia(b.dataset.f);
    aviso(r.completo ? `${fechaCorta(b.dataset.f)}: día completo${r.series ? `, ${r.series} series` : ''}` : r.algo ? `${fechaCorta(b.dataset.f)}: ${r.series ? `${r.series} series` : 'a medias'}` : `${fechaCorta(b.dataset.f)}: sin registro`, 'cal');
  } else if (a === 'cintura') {
    const v = parseFloat(String($('#cintura').value).replace(',', '.'));
    if (!Number.isFinite(v) || v <= 0) { aviso('Escribe tu medida en cm'); return; }
    S().cintura[lunesDe(hoy())] = v;
    guardar(); vibrar(); aviso('Cintura guardada', 'check');
    renderProgreso(raiz);
  }
}
