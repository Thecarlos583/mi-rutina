// Sábado: movilidad → trote guiado por intervalos → core → estiramiento
import { SABADO, TROTE, FASES, GRUPOS } from './data.js';
import { S, dia, leerDia, guardar } from './store.js';
import { $, ico, anillo, vibrar, sonar, aviso, confeti, fmt, pantallaEncendida } from './util.js';
import { iniciarDescanso } from './timer.js';
import { pasosSabado } from './rutina.js';

const tag = g => `<span class="tag" style="--c:${GRUPOS[g].c}">${GRUPOS[g].n}</span>`;

export function sabadoHTML(f, p) {
  const log = leerDia(f), ps = pasosSabado(log);
  const n = Object.values(ps).filter(Boolean).length;
  const sem = log.sab?.semTrote ?? p.semana;
  return `<section class="hero" style="--hc:#38BDF8">
      <div class="hero-txt">
        <p class="eyebrow">Sábado · Semana ${p.semana}</p>
        <h2>Trote y afloje</h2>
        <p class="hero-sub">Movilidad → trote → core → estiramiento</p>
        <div class="chips">${tag('cardio')}${tag('core')}</div>
      </div>
      <div id="hero-anillo">${anillo(n / 4, { tam: 94, grosor: 9, id: 'as', c1: '#38BDF8', c2: '#2ED47A', centro: `<b class="an-num">${n}</b><span>de 4</span>` })}</div>
    </section>
    <div class="lista-ej">${SABADO.map((x, i) => paso(x, i, ps[x.id], log, sem)).join('')}</div>`;
}

function paso(x, i, hecho, log, sem) {
  let cuerpo = '';
  if (x.id === 'trote') {
    const t = TROTE[sem], total = t.fases.reduce((a, f) => a + f.s, 0) / 60;
    const tipos = [...new Set(t.fases.map(f => f.tipo))];
    cuerpo = `<div class="seg seg-4" role="radiogroup" aria-label="Semana del trote">${[1, 2, 3, 4].map(k => `<button class="${k === sem ? 'act' : ''}" data-a="sab-sem" data-s="${k}" role="radio" aria-checked="${k === sem}">Sem ${k}</button>`).join('')}</div>
      <p class="trote-res"><b>${t.resumen}</b><br><span class="txt2">5 min para calentar y 5 para enfriar · ${total} min en total</span></p>
      <div class="linea-tiempo" aria-hidden="true">${t.fases.map(f => `<span style="flex:${f.s};background:${FASES[f.tipo].c}"></span>`).join('')}</div>
      <div class="leyenda">${tipos.map(k => `<span><i style="background:${FASES[k].c}"></i>${FASES[k].n}</span>`).join('')}</div>
      <button class="btn-pri" data-a="trote-iniciar" data-s="${sem}">${ico('play')} Empezar trote guiado</button>`;
  } else if (x.id === 'core') {
    const r = log.sab?.core || [];
    cuerpo = `<ol class="pasos">${x.items.map(it => `<li>${it}</li>`).join('')}</ol>
      <p class="txt2 peq nota-core">Toca cada ronda al terminarla: arranca el descanso de 60 s.</p>
      <div class="series">${[0, 1, 2].map(k => `<button class="serie ${r[k] ? 'hecha' : ''}" data-a="core-ronda" data-i="${k}" aria-pressed="${!!r[k]}" aria-label="Ronda ${k + 1}"><span class="serie-n">${k + 1}</span>${ico('check', 'serie-ok')}</button>`).join('')}</div>`;
  } else {
    cuerpo = `<div class="mini-chips">${x.items.map(it => `<span>${it}</span>`).join('')}</div>`;
  }
  return `<article class="ej paso ${hecho ? 'completa' : ''}" style="--c:${x.c}">
    <div class="ej-cab">
      <span class="ej-num">${hecho ? ico('check') : i + 1}</span>
      <span class="ej-tit"><span class="ej-n">${x.n}</span><span class="ej-meta">${x.dur}</span></span>
      ${x.id !== 'core' ? `<button class="paso-check ${hecho ? 'on' : ''}" data-a="sab-paso" data-id="${x.id}" aria-pressed="${hecho}" aria-label="Marcar ${x.n} como hecho">${ico('check')}</button>` : ''}
    </div>
    <div class="paso-cuerpo">${cuerpo}</div>
  </article>`;
}

export function accionSabado(a, b, f, refrescar) {
  const d = dia(f);
  d.sab ||= {};
  if (a === 'sab-paso') {
    d.sab[b.dataset.id] = !d.sab[b.dataset.id];
    vibrar(); if (d.sab[b.dataset.id]) sonar.serie();
  } else if (a === 'sab-sem') {
    d.sab.semTrote = Number(b.dataset.s);
    vibrar(8);
  } else if (a === 'core-ronda') {
    const r = (d.sab.core = [0, 1, 2].map(k => !!d.sab.core?.[k]));
    const i = Number(b.dataset.i);
    r[i] = !r[i];
    if (r[i]) {
      vibrar(); sonar.serie();
      const hechas = r.filter(Boolean).length;
      if (hechas < 3) iniciarDescanso(60, 'Core', `Ronda ${hechas} de 3 lista`);
    }
  } else if (a === 'trote-iniciar') {
    iniciarCarrera(f, Number(b.dataset.s));
    return;
  } else return;
  guardar();
  revisarFin(f);
  refrescar();
  if (a === 'core-ronda') document.querySelector(`[data-a="core-ronda"][data-i="${b.dataset.i}"].hecha`)?.classList.add('pop');
}

function revisarFin(f) {
  const d = dia(f), todo = Object.values(pasosSabado(d)).every(Boolean), antes = !!d.completo;
  d.completo = todo;
  guardar();
  if (todo && !antes) setTimeout(() => { confeti(); sonar.logro(); aviso('¡Sábado completado! Semana coronada.', 'trofeo'); }, 250);
}

// ── Trote guiado ────────────────────────────────────────────
// Todo se calcula con la hora de inicio, así que si bloqueas el teléfono no se pierde el conteo.
let car = null, raf = 0, faseIdx = -1, ultSeg = null, terminada = false;

const fases = () => TROTE[car.sem].fases;
const total = () => fases().reduce((a, f) => a + f.s, 0);
const transcurrido = () => ((car.pausa ?? Date.now()) - car.inicio - car.pausado + car.salto) / 1000;

function iniciarCarrera(f, sem) {
  car = { f, sem, inicio: Date.now(), pausa: null, pausado: 0, salto: 0 };
  S().carrera = car; guardar();
  abrirCarrera();
  sonar.trote(); vibrar([200, 80, 200]);
}

export function restaurarCarrera() {
  const c = S().carrera;
  if (!c) return;
  car = c;
  if (transcurrido() < total() + 600) abrirCarrera();
  else { car = null; S().carrera = null; guardar(); }
}

function abrirCarrera() {
  const el = $('#carrera');
  terminada = false; faseIdx = -1; ultSeg = null;
  el.classList.remove('fin');
  $('#car-segs').innerHTML = fases().map(f => `<span style="flex:${f.s};background:${FASES[f.tipo].c}"></span>`).join('');
  $('#car-sem').textContent = `Semana ${car.sem} · Trote`;
  botonPausa();
  el.hidden = false;
  requestAnimationFrame(() => requestAnimationFrame(() => el.classList.add('abierto')));
  pantallaEncendida(true);
  bucle();
}

function bucle() {
  cancelAnimationFrame(raf);
  const paso = () => { if (!car || terminada) return; pintar(); raf = requestAnimationFrame(paso); };
  raf = requestAnimationFrame(paso);
}

function pintar() {
  const fs = fases(), t = transcurrido();
  let acc = 0, i = 0;
  for (; i < fs.length; i++) { if (t < acc + fs[i].s) break; acc += fs[i].s; }
  if (i >= fs.length) { terminar(); return; }
  const ph = fs[i], resta = acc + ph.s - t;
  if (i !== faseIdx) {
    if (faseIdx !== -1 && !car.pausa) anunciar(ph);
    faseIdx = i;
    const el = $('#carrera');
    el.style.setProperty('--fc', FASES[ph.tipo].c);
    $('#car-fase').textContent = FASES[ph.tipo].n;
    $('#car-desc').textContent = ph.n;
    $('#car-ronda').textContent = ph.ronda ? `Intervalo ${ph.ronda} de ${ph.de}` : i === 0 ? 'Calentamiento' : i === fs.length - 1 ? 'Enfriamiento' : 'Tramo principal';
    const sig = fs[i + 1];
    $('#car-sig').textContent = sig ? `Luego: ${FASES[sig.tipo].n.toLowerCase()} ${fmt(sig.s)}` : 'Último tramo. ¡Ya casi!';
  }
  $('#car-reloj').textContent = fmt(resta);
  $('#car-total').textContent = `Quedan ${fmt(total() - t)}`;
  $('#car-marca').style.left = `${(t / total()) * 100}%`;
  const seg = Math.ceil(resta);
  if (seg !== ultSeg) {
    if (seg <= 3 && seg > 0 && ultSeg !== null && !car.pausa) sonar.tic();
    ultSeg = seg;
  }
}

function anunciar(ph) {
  ph.tipo === 'trote' ? sonar.trote() : sonar.camina();
  vibrar([300, 100, 300]);
  const el = $('#carrera');
  el.classList.remove('destello'); void el.offsetWidth; el.classList.add('destello');
}

function terminar() {
  terminada = true;
  const d = dia(car.f);
  d.sab ||= {}; d.sab.trote = true;
  S().carrera = null; guardar();
  revisarFin(car.f);
  const el = $('#carrera');
  el.classList.add('fin');
  el.style.setProperty('--fc', '#2ED47A');
  $('#car-fase').textContent = '¡Listo!';
  $('#car-desc').textContent = `Trote de la semana ${car.sem} completado`;
  $('#car-ronda').textContent = '';
  $('#car-reloj').textContent = `${Math.round(total() / 60)} min`;
  $('#car-sig').textContent = 'Ahora toca core y estiramiento.';
  $('#car-total').textContent = '';
  $('#car-marca').style.left = '100%';
  sonar.logro(); vibrar([120, 80, 120]); confeti();
  dispatchEvent(new Event('mr:refrescar'));
}

function cerrarCarrera() {
  cancelAnimationFrame(raf);
  car = null;
  const el = $('#carrera');
  el.classList.remove('abierto');
  setTimeout(() => { el.hidden = true; }, 300);
  dispatchEvent(new Event('mr:refrescar'));
}

function botonPausa() {
  const b = $('#car-pausa');
  b.innerHTML = car?.pausa ? `${ico('play')}<span>Seguir</span>` : `${ico('pausa')}<span>Pausa</span>`;
  $('#carrera').classList.toggle('pausada', !!car?.pausa);
}

export function initCarrera() {
  $('#carrera').addEventListener('click', e => {
    const b = e.target.closest('[data-c]');
    if (!b) return;
    const a = b.dataset.c;
    if (a === 'cerrar') {
      if (terminada || !car) { cerrarCarrera(); return; }
      if (confirm('¿Terminar el trote ahora? No se marcará como hecho.')) { S().carrera = null; guardar(); cerrarCarrera(); }
      return;
    }
    if (!car || terminada) { cerrarCarrera(); return; }
    if (a === 'pausa') {
      if (car.pausa) { car.pausado += Date.now() - car.pausa; car.pausa = null; }
      else car.pausa = Date.now();
      botonPausa(); vibrar();
    } else if (a === 'saltar') {
      const fs = fases(), t = transcurrido();
      let acc = 0;
      for (const f of fs) { acc += f.s; if (t < acc) break; }
      car.salto += (acc - t + 0.05) * 1000;
      vibrar();
    }
    S().carrera = car; guardar();
    pintar();
  });
  document.addEventListener('visibilitychange', () => { if (document.visibilityState === 'visible' && car && !terminada) { pintar(); bucle(); } });
  restaurarCarrera();
}
