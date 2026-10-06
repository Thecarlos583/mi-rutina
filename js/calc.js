// Pantalla "Calculadora": libras ⇄ kilos, tabla de mancuernas y calculadora de barra (ida y vuelta).
// Las cuentas se hacen con el número completo; solo se redondea al mostrar.
import { S } from './store.js';
import { $, ico, num, vibrar } from './util.js';
import { LB } from './rutina.js';

const R1 = x => Math.round(x * 10) / 10;
const muestra = x => num(R1(x));
const otra = u => (u === 'lbs' ? 'kg' : 'lbs');
const convertir = (v, de) => (de === 'lbs' ? v / LB : v * LB);

const RAPIDOS = { lbs: [2.5, 5, 10, 15, 20, 25, 35, 45], kg: [2, 4, 5, 8, 10, 12, 15, 20] };
const DISCOS = { lbs: [45, 35, 25, 10, 5, 2.5], kg: [25, 20, 15, 10, 5, 2.5, 1.25] };
const BARRAS = { olimpica: { n: 'Olímpica', lbs: 45, kg: 20 }, z: { n: 'Barra Z', lbs: 20, kg: 10 } };

// Lo que abre la calculadora desde la tarjeta de un ejercicio
let pendiente = null;
export function abrirCalculadora(v, u) { pendiente = { v, u }; location.hash = '#calc'; }

// Estado de la pantalla (se recuerda mientras la app está abierta)
const st = { v: '', de: null, barra: 'olimpica', propia: '', ud: null, lado: [], meta: '' };

export function renderCalc(el) {
  st.de ??= S().ajustes.unidad === 'kg' ? 'kg' : 'lbs';
  st.ud ??= st.de;
  if (pendiente) { st.v = String(pendiente.v ?? ''); st.de = pendiente.u; pendiente = null; }
  el.innerHTML = `<header class="top"><p class="saludo">Libras y kilos</p><h1>Calculadora</h1></header>

    <section class="card calc">
      <div class="seg" role="radiogroup" aria-label="Convertir">
        ${['lbs', 'kg'].map(u => `<button data-c="de" data-u="${u}" role="radio" aria-checked="${st.de === u}">${u} → ${otra(u)}</button>`).join('')}
      </div>
      <label class="calc-in"><input id="calc-v" type="number" inputmode="decimal" step="any" min="0" value="${st.v}" placeholder="0" aria-label="Peso a convertir"><span id="calc-u">${st.de}</span></label>
      <p class="calc-res" id="calc-res" aria-live="polite"></p>
      <p class="calc-sub">Toca un peso común</p>
      ${['lbs', 'kg'].map(u => `<div class="rapidos">${RAPIDOS[u].map(x => `<button data-c="rapido" data-u="${u}" data-v="${x}">${num(x)} ${u}</button>`).join('')}</div>`).join('')}
      <details class="calc-tabla">
        <summary>${ico('abajo')} Tabla de mancuernas</summary>
        <div class="tablas">
          <table><thead><tr><th>lbs</th><th>kg</th></tr></thead><tbody>${Array.from({ length: 20 }, (_, i) => (i + 1) * 5).map(x => `<tr><td>${x}</td><td>${muestra(x / LB)}</td></tr>`).join('')}</tbody></table>
          <table><thead><tr><th>kg</th><th>lbs</th></tr></thead><tbody>${Array.from({ length: 20 }, (_, i) => (i + 1) * 2).map(x => `<tr><td>${x}</td><td>${muestra(x * LB)}</td></tr>`).join('')}</tbody></table>
        </div>
      </details>
    </section>

    <section class="card calc" id="calc-barra">
      <div class="card-cab"><h3>${ico('balanza')} Calculadora de barra</h3></div>
      <p class="calc-sub">Barra</p>
      <div class="seg seg-3" role="radiogroup" aria-label="Barra">
        ${Object.entries(BARRAS).map(([k, b]) => `<button data-c="barra" data-b="${k}" role="radio" aria-checked="${st.barra === k}">${b.n}</button>`).join('')}
        <button data-c="barra" data-b="propia" role="radio" aria-checked="${st.barra === 'propia'}">Otra</button>
      </div>
      <label class="calc-propia" ${st.barra === 'propia' ? '' : 'hidden'}><span>Peso de la barra</span><input id="calc-propia" type="number" inputmode="decimal" step="any" min="0" value="${st.propia}" placeholder="0"><b>${st.ud}</b></label>
      <p class="calc-sub">Discos en</p>
      <div class="seg" role="radiogroup" aria-label="Unidad de los discos">
        ${['lbs', 'kg'].map(u => `<button data-c="ud" data-u="${u}" role="radio" aria-checked="${st.ud === u}">${u}</button>`).join('')}
      </div>
      <p class="calc-sub">Toca los discos que pones en cada lado</p>
      <div class="discos-btn">${DISCOS[st.ud].map(d => `<button data-c="disco" data-d="${d}" style="--dc:var(--disco-${color(d, st.ud)})">${num(d)}</button>`).join('')}</div>
      <div id="calc-dibujo"></div>
      <p class="calc-res" id="calc-total" aria-live="polite"></p>
      <div class="fila-2"><button class="btn-sec" data-c="quitar">${ico('deshacer')} Quitar el último</button><button class="btn-sec" data-c="vaciar">${ico('basura')} Vaciar</button></div>
      <p class="calc-sub">Al revés: ¿cuánto quieres en total?</p>
      <label class="calc-in chico"><input id="calc-meta" type="number" inputmode="decimal" step="any" min="0" value="${st.meta}" placeholder="0" aria-label="Peso total que quieres"><span>${st.ud}</span></label>
      <p class="calc-meta" id="calc-meta-txt"></p>
    </section>`;
  pintar(el);
  el.oninput = ev => {
    if (ev.target.id === 'calc-v') { st.v = ev.target.value; pintar(el); }
    if (ev.target.id === 'calc-propia') { st.propia = ev.target.value; pintar(el); }
    if (ev.target.id === 'calc-meta') { st.meta = ev.target.value; pintar(el); }
  };
  el.onclick = ev => {
    const b = ev.target.closest('[data-c]');
    if (!b) return;
    const c = b.dataset.c;
    if (c === 'de') { if (st.de !== b.dataset.u && st.v !== '') st.v = String(R1(convertir(parseFloat(st.v), st.de))); st.de = b.dataset.u; return renderCalc(el); }
    if (c === 'rapido') { st.de = b.dataset.u; st.v = b.dataset.v; vibrar(8); return renderCalc(el); }
    if (c === 'barra') { st.barra = b.dataset.b; return renderCalc(el); }
    if (c === 'ud') { if (st.ud !== b.dataset.u) { st.ud = b.dataset.u; st.lado = []; if (st.propia) st.propia = String(R1(convertir(parseFloat(st.propia), otra(st.ud)))); } return renderCalc(el); }
    if (c === 'disco') { st.lado.push(Number(b.dataset.d)); st.lado.sort((x, y) => y - x); vibrar(8); }
    if (c === 'quitar') { const menor = Math.min(...st.lado); if (st.lado.length) st.lado.splice(st.lado.lastIndexOf(menor), 1); }
    if (c === 'vaciar') st.lado = [];
    if (c === 'cargar') { st.lado = JSON.parse(b.dataset.l); vibrar(8); }
    pintar(el);
  };
}

const color = (d, u) => {
  const k = u === 'kg' ? { 25: 1, 20: 2, 15: 3, 10: 4, 5: 5, 2.5: 6, 1.25: 6 } : { 45: 1, 35: 3, 25: 2, 10: 4, 5: 5, 2.5: 6 };
  return k[d] || 6;
};
const pesoBarra = () => (st.barra === 'propia' ? parseFloat(st.propia) || 0 : BARRAS[st.barra][st.ud]);

// Qué discos poner en cada lado para llegar a un total (los más grandes primero)
function discosPara(total) {
  let lado = (total - pesoBarra()) / 2;
  if (lado < 0) return null;
  const out = [];
  for (const d of DISCOS[st.ud]) while (lado >= d - 1e-9) { out.push(d); lado = Math.round((lado - d) * 1000) / 1000; }
  return { out, sobra: lado };
}
const agrupar = (lista, u) => {
  const n = {};
  for (const d of lista) n[d] = (n[d] || 0) + 1;
  const p = Object.keys(n).map(Number).sort((a, b) => b - a).map(d => `${n[d]} de ${num(d)}`);
  return (p.length > 1 ? `${p.slice(0, -1).join(', ')} y ${p.at(-1)}` : p[0] || '') + ` ${u}`;
};

// Dibujo de la barra cargada: los mismos discos a cada lado
function dibujo(lado, u) {
  const W = 320, cx = W / 2, alto = d => ({ lbs: { 45: 84, 35: 74, 25: 64, 10: 50, 5: 40, 2.5: 32 }, kg: { 25: 86, 20: 84, 15: 74, 10: 64, 5: 48, 2.5: 38, 1.25: 30 } }[u][d] || 30);
  const ancho = d => (d >= 20 ? 11 : d >= 10 ? 9 : 7);
  let xi = cx - 66, xd = cx + 66, s = '';
  for (const d of lado) {
    const a = alto(d), w = ancho(d);
    s += `<rect x="${xi - w}" y="${50 - a / 2}" width="${w}" height="${a}" rx="2.5" style="fill:var(--disco-${color(d, u)})"/>`;
    s += `<rect x="${xd}" y="${50 - a / 2}" width="${w}" height="${a}" rx="2.5" style="fill:var(--disco-${color(d, u)})"/>`;
    xi -= w + 2; xd += w + 2;
  }
  return `<svg class="calc-svg" viewBox="0 0 ${W} 100" role="img" aria-label="Barra con ${lado.length ? agrupar(lado, u) : 'sin discos'} en cada lado">
    <rect class="b-barra" x="8" y="46" width="${W - 16}" height="8" rx="4"/>
    <rect class="b-tope" x="${cx - 70}" y="40" width="6" height="20" rx="2"/><rect class="b-tope" x="${cx + 64}" y="40" width="6" height="20" rx="2"/>
    <rect class="b-agarre" x="${cx - 56}" y="45" width="112" height="10" rx="5"/>
    ${s}
  </svg>`;
}

function pintar(el) {
  const v = parseFloat(st.v);
  $('#calc-res', el).innerHTML = Number.isFinite(v) && v > 0 ? `${num(v)} ${st.de} = <b>${muestra(convertir(v, st.de))} ${otra(st.de)}</b>` : 'Escribe un peso o toca uno de abajo';
  const suma = st.lado.reduce((a, b) => a + b, 0), total = pesoBarra() + suma * 2;
  $('#calc-dibujo', el).innerHTML = dibujo(st.lado, st.ud);
  $('#calc-total', el).innerHTML = `Total: <b>${muestra(total)} ${st.ud}</b> · ${muestra(convertir(total, st.ud))} ${otra(st.ud)}<small>${st.lado.length ? `${agrupar(st.lado, st.ud)} en cada lado` : 'Solo la barra'}</small>`;
  const meta = parseFloat(st.meta), mt = $('#calc-meta-txt', el);
  if (!Number.isFinite(meta) || meta <= 0) mt.innerHTML = '';
  else {
    const r = discosPara(meta);
    mt.innerHTML = !r ? `Con la barra ya son ${muestra(pesoBarra())} ${st.ud}.`
      : !r.out.length ? `Solo la barra (${muestra(pesoBarra())} ${st.ud}).`
      : `Pon <b>${agrupar(r.out, st.ud)}</b> en cada lado${r.sobra > 0.001 ? ` (te faltan ${muestra(r.sobra * 2)} ${st.ud}: no cuadra exacto con estos discos)` : ''}. <button class="link" data-c="cargar" data-l="${JSON.stringify(r.out)}">Dibujarla</button>`;
  }
}

