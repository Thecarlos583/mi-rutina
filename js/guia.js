// Pantalla "Guía": reglas, el plan completo y el mapa de colores
import { GRUPOS, ZONAS, PLAN, REGLAS, TROTE, INICIO, EJERCICIOS } from './data.js';
import { guiaAgarresHTML } from './agarres.js';
import { NOMBRE_DIA } from './calendario.js';
import { ejercicio, unidadDe, sugeridoVista } from './rutina.js';
import { cuerpo } from './cuerpo.js';
import { ico, vibrar } from './util.js';

let variante = 'A', raiz;

export function renderGuia(el) {
  raiz = el;
  el.oninput = el.onchange = null;
  el.onclick = e => {
    const b = e.target.closest('[data-v]');
    if (b) { variante = b.dataset.v; vibrar(8); renderGuia(raiz); }
  };
  const todas = Object.keys(ZONAS);
  el.innerHTML = `<header class="top"><p class="saludo">Para no olvidarlo</p><h1>Guía</h1></header>
    <div class="reglas">${REGLAS.map(r => `<section class="card regla" style="--c:${r.c}">
      <h3>${r.t}</h3><ul>${r.items.map(x => `<li>${x}</li>`).join('')}</ul></section>`).join('')}</div>

    <section class="card">
      <div class="card-cab"><h3>Tu plan</h3><span class="cont">semanas 1 y 3 = A · 2 y 4 = B</span></div>
      <div class="seg" role="radiogroup" aria-label="Rutina">${['A', 'B'].map(x => `<button class="${x === variante ? 'act' : ''}" data-v="${x}" role="radio" aria-checked="${x === variante}">Rutina ${x}</button>`).join('')}</div>
      <div class="plan">${['lun', 'mar', 'mie', 'jue', 'vie'].map(d => {
        const p = PLAN[variante][d];
        return `<details class="plan-dia"><summary><span class="dia-n">${NOMBRE_DIA[d]}</span><span class="dia-t">${p.t} · ${p.sub}</span>${ico('abajo')}</summary>
          <ul>${p.e.map(([id, s, r, nota]) => { const e = ejercicio(id); return `<li style="--c:${GRUPOS[e.g].c}"><i class="punto"></i><span>${e.n}${nota ? ` <small>(${nota})</small>` : ''}${INICIO[id]?.[0] ? `<small class="ini-g">Empieza con ${unidadDe(id) === 'kg' ? '≈ ' : ''}${String(sugeridoVista(id, INICIO[id][0])).replace('.', ',')} ${unidadDe(id)}</small>` : ''}</span><b>${s}×${r}</b></li>`; }).join('')}</ul></details>`;
      }).join('')}
        <details class="plan-dia"><summary><span class="dia-n">Sábado</span><span class="dia-t">Trote y afloje</span>${ico('abajo')}</summary>
          <ul>${[1, 2, 3, 4].map(k => `<li style="--c:#38BDF8"><i class="punto"></i><span>Semana ${k}</span><b class="trote-b">${TROTE[k].resumen}</b></li>`).join('')}</ul>
          <p class="txt2 peq">Antes: movilidad 5-10 min. Después: core 3 rondas y 10 min de estiramiento.</p></details>
        <div class="plan-dia quieto"><span class="dia-n">Domingo</span><span class="dia-t">Descanso</span></div>
      </div>
    </section>

    ${guiaAgarresHTML(Object.values(EJERCICIOS))}

    <section class="card">
      <div class="card-cab"><h3>Colores de cada músculo</h3></div>
      <div class="mapa encendido">${cuerpo(todas, [])}</div>
      <div class="leyenda-g">${Object.values(GRUPOS).map(g => `<span style="--c:${g.c}"><i class="punto"></i>${g.n}</span>`).join('')}</div>
    </section>
    <p class="pie">Técnica antes que peso. Constancia antes que intensidad.</p>`;
}
