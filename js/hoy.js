// Pantalla "Hoy": lo que toca entrenar, series, pesos, cambios de ejercicio, videos y sugerencias
import { GRUPOS, ZONAS, PLAN, SUGERENCIAS, REGLAS, FRASES_DESCANSO, FRASES_FIN, INICIO, TIPO_PESO, CALENTAMIENTO } from './data.js';
import { S, dia, leerDia, guardar } from './store.js';
import { hoy, info, fechaLarga, sumar, NOMBRE_DIA, proximoLunes } from './calendario.js';
import { planDe, slots, totalSeries, seriesHechas, ultimoPeso, mejorPeso, ejercicio, tocaSubir } from './rutina.js';
import { cuerpo } from './cuerpo.js';
import { $, ico, anillo, moverAnillo, vibrar, sonar, aviso, abrirHoja, cerrarHoja, confeti, semilla, num, pantallaEncendida } from './util.js';
import { iniciarDescanso } from './timer.js';
import { sabadoHTML, accionSabado } from './sabado.js';
import { montar, tieneVideo, musculosDe } from './anim.js';

export const LOGO = `<svg viewBox="0 0 512 512" aria-hidden="true"><defs><linearGradient id="lg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#FF6B4A"/><stop offset="1" stop-color="#FF9F43"/></linearGradient></defs>
  <circle cx="256" cy="256" r="168" fill="none" stroke="#26303B" stroke-width="40"/>
  <circle cx="256" cy="256" r="168" fill="none" stroke="url(#lg)" stroke-width="40" stroke-linecap="round" stroke-dasharray="790 1056" transform="rotate(-90 256 256)"/>
  <g transform="rotate(-35 256 256)" fill="#F5F7FA"><rect x="186" y="244" width="140" height="24" rx="10"/><rect x="160" y="196" width="34" height="120" rx="13"/><rect x="134" y="220" width="22" height="72" rx="9"/><rect x="318" y="196" width="34" height="120" rx="13"/><rect x="356" y="220" width="22" height="72" rx="9"/></g></svg>`;

const abiertas = new Set();
let raiz;

const chip = g => `<span class="tag" style="--c:${GRUPOS[g].c}">${GRUPOS[g].n}</span>`;
const saludo = () => { const h = new Date().getHours(); return h < 12 ? 'Buenos días' : h < 19 ? 'Buenas tardes' : 'Buenas noches'; };

export function renderHoy(el) {
  raiz = el;
  el.onclick = alTocar;
  el.oninput = alEscribir;
  el.onchange = alCambiar;
  if (!S().ajustes.inicio) { bienvenida(el); return; }
  document.body.classList.remove('sin-tabs');
  const f = hoy(), p = planDe(f);
  const contenido = p.diaPlan === 'dom' ? descansoHTML(f) : p.diaPlan === 'sab' ? sabadoHTML(f, p) : entrenoHTML(f, p);
  el.innerHTML = cabecera(f, p) + contenido + sugerenciasHTML() + tipHTML(f);
  pantallaEncendida(p.diaPlan !== 'dom');
}
const refrescar = () => renderHoy(raiz);

// ── Cabecera con la semana del ciclo ────────────────────────
function cabecera(f, p) {
  const puntos = [1, 2, 3, 4].map(n => `<span class="ciclo-p ${n === p.semana ? 'act' : ''} ${n < p.semana ? 'pas' : ''}">${n % 2 ? 'A' : 'B'}</span>`).join('');
  return `<header class="top">
      <p class="saludo">${saludo()}, Carlos</p>
      <h1>${fechaLarga(f)}</h1>
    </header>
    <div class="ciclo">
      <div class="ciclo-txt">Semana <b>${p.semana}</b> de 4 · Rutina <b>${p.variante}</b>${p.ciclo > 1 ? ` · ciclo ${p.ciclo}` : ''}</div>
      <div class="ciclo-ps" aria-hidden="true">${puntos}</div>
    </div>
    ${p.antes ? `<div class="nota">${ico('cal')}<span>Tu plan arranca el ${fechaLarga(S().ajustes.inicio).toLowerCase()}. Mientras tanto, esto es lo que viene.</span></div>` : ''}
    <div class="fila-acc">
      <button class="btn-chip" data-a="elegir-dia">${ico('cal')} Ver otro día</button>
      ${p.override ? `<button class="btn-chip acento" data-a="volver-plan">${ico('deshacer')} Volver a lo de hoy</button>` : ''}
    </div>`;
}

// ── Día de entrenamiento ────────────────────────────────────
function entrenoHTML(f, p) {
  const d = PLAN[p.variante][p.diaPlan], ss = slots(f, p.variante, p.diaPlan);
  const tot = totalSeries(ss), h = seriesHechas(ss);
  const grupos = [...new Set(ss.map(s => s.base.g))];
  const min = Math.round(ss.reduce((a, s) => a + s.series * (45 + s.descanso), 0) / 300) * 5;
  return `<section class="hero" style="--hc:${GRUPOS[grupos[0]].c}">
      <div class="hero-txt">
        <p class="eyebrow">${NOMBRE_DIA[p.diaPlan]} · Rutina ${p.variante}</p>
        <h2>${d.t}</h2>
        <p class="hero-sub">${d.sub} · ${ss.length} ejercicios · ≈${min} min</p>
        <div class="chips">${grupos.map(chip).join('')}</div>
      </div>
      <div id="hero-anillo">${anillo(h / tot, { tam: 94, grosor: 9, id: 'ah', centro: `<b class="an-num">${h}</b><span>de ${tot}</span>` })}</div>
    </section>
    ${calentamientoHTML(f, d, ss, h)}
    <div class="lista-ej">${ss.map(s => tarjeta(f, s)).join('')}</div>`;
}

// ── Calentamiento antes de la rutina ────────────────────────
const r5 = x => Math.max(5, Math.round(x / 5) * 5);
function calentamientoHTML(f, d, ss, hechas) {
  const piernas = /pierna/i.test(d.t), lista = piernas ? CALENTAMIENTO.piernas : CALENTAMIENTO.superior;
  const pri = ss[0], w = pri && (leerDia(f).pesos?.[pri.ej.id] ?? ultimoPeso(pri.ej.id, f) ?? INICIO[pri.ej.id]?.[0]);
  const aprox = w ? `10 reps con <b>${r5(w / 2)} lbs</b> y 5 reps con <b>${r5(w * 0.75)} lbs</b>` : '10 reps con la mitad del peso y 5 reps con tres cuartos';
  const fila = x => `<li><span><b>${x.n}</b><small>${x.d}</small></span>${x.id ? `<button class="ver-mini" data-a="video-cal" data-id="${x.id}" aria-label="Ver cómo se hace ${x.n}">${ico('play')}</button>` : ''}</li>`;
  return `<details class="card calent" ${hechas ? '' : 'open'}>
    <summary><span><b>Calentamiento</b><small>≈10 min · antes de empezar</small></span>${ico('abajo')}</summary>
    <ol class="cal-lista">${fila(CALENTAMIENTO.general)}${lista.map(fila).join('')}
      <li><span><b>Series de aproximación</b><small>Antes de ${pri?.ej.n.toLowerCase() || 'el primer ejercicio'}: ${aprox}</small></span></li></ol>
  </details>`;
}

function tarjeta(f, s) {
  const e = s.ej, c = GRUPOS[e.g].c, completa = s.hechas.every(Boolean);
  const peso = leerDia(f).pesos?.[e.id], ult = ultimoPeso(e.id, f);
  const [ini, tipo] = INICIO[e.id] || [];
  const sube = tocaSubir(e.id, f);
  return `<article class="ej ${abiertas.has(s.slot) ? 'abierta' : ''} ${completa ? 'completa' : ''}" data-slot="${s.slot}" style="--c:${c}">
    <button class="ej-cab" data-a="abrir" aria-expanded="${abiertas.has(s.slot)}">
      <span class="ej-num">${completa ? ico('check') : s.i + 1}</span>
      <span class="ej-tit">
        <span class="ej-n">${e.n}</span>
        <span class="ej-meta"><b>${s.series}×${s.reps}</b>${s.nota ? ` · ${s.nota}` : ''} · ${s.descanso} s</span>
      </span>
      <span class="ej-chev">${ico('abajo')}</span>
    </button>
    <div class="ej-tags">${chip(e.g)}${s.cambio ? `<span class="tag marca">${ico('cambiar')} ${s.cambio === 'hoy' ? 'Solo hoy' : 'Siempre'}</span><button class="tag volver" data-a="revertir">${ico('deshacer')} Original</button>` : ''}</div>
    <div class="series" role="group" aria-label="Series">${s.hechas.map((h, k) => `<button class="serie ${h ? 'hecha' : ''}" data-a="serie" data-i="${k}" aria-pressed="${h}" aria-label="Serie ${k + 1}"><span class="serie-n">${k + 1}</span>${ico('check', 'serie-ok')}</button>`).join('')}</div>
    <div class="peso">
      <button class="peso-btn" data-a="peso" data-d="-5" aria-label="Bajar 5 lbs">${ico('menos')}</button>
      <label class="peso-in"><input type="number" inputmode="decimal" step="any" min="0" data-peso="${e.id}" value="${peso ?? ''}" placeholder="${ult ?? ini ?? '0'}" aria-label="Peso en libras"><span>lbs</span></label>
      <button class="peso-btn" data-a="peso" data-d="5" aria-label="Subir 5 lbs">${ico('mas')}</button>
    </div>
    ${sube && (peso == null || peso < sube) ? `<p class="subir">${ico('subir')}<span><b>Toca subir:</b> completaste todo con ${num(ult)} lbs dos sesiones seguidas. Hoy prueba <b>${num(sube)} lbs</b>. <button class="link" data-a="repetir" data-w="${sube}">Usar</button></span></p>` : ''}
    <p class="ultima">${ult != null
      ? `Última vez: <b>${num(ult)} lbs</b>${peso == null ? ` <button class="link" data-a="repetir" data-w="${ult}">Repetir</button>` : ''}`
      : ini ? `Empieza con <b>${ini} lbs</b> ${TIPO_PESO[tipo]}${peso == null ? ` <button class="link" data-a="repetir" data-w="${ini}">Usar</button>` : ''}<br><span class="peq">Si te sobran más de 3 reps, súbele 5 lbs.</span>`
      : tipo ? `Empieza con ${TIPO_PESO[tipo]}.` : 'Primera vez: anota con cuánto arrancas'}</p>
    <div class="mas"><div class="mas-in">
      ${tieneVideo(e.id) ? `<button class="btn-sec ver-video" data-a="video">${ico('play')} Ver cómo se hace</button>` : ''}
      <div class="mapa">${cuerpo(e.z || [], e.s || [])}</div>
      <h4>Qué trabaja</h4><p class="txt2">${e.t}</p>
      <h4>Cómo hacerlo</h4><ol class="pasos">${e.p.map(x => `<li>${x}</li>`).join('')}</ol>
      <button class="btn-sec" data-a="cambiar">${ico('cambiar')} Cambiar ejercicio</button>
    </div></div>
  </article>`;
}

// ── Domingo ─────────────────────────────────────────────────
function descansoHTML(f) {
  const frase = FRASES_DESCANSO[semilla(f) % FRASES_DESCANSO.length];
  const m = sumar(f, 1), pm = planDe(m), dm = PLAN[pm.variante]?.[pm.diaPlan];
  const grupos = dm ? [...new Set(dm.e.map(([id]) => ejercicio(id).g))] : [];
  return `<section class="hero reposo">
      <div class="reposo-ico">${ico('ola')}</div>
      <p class="eyebrow">Domingo</p>
      <h2>Día de descanso</h2>
      <p class="hero-sub">${frase}</p>
    </section>
    ${dm ? `<section class="card manana">
      <p class="eyebrow">Mañana te toca</p>
      <h3>${NOMBRE_DIA[pm.diaPlan]} · ${dm.t}</h3>
      <p class="txt2">${dm.sub} · Semana ${pm.semana}, rutina ${pm.variante}</p>
      <div class="chips">${grupos.map(chip).join('')}</div>
    </section>` : ''}`;
}

// ── Sugerencias del día (solo consejos, nada que marcar) ─────
function sugerenciasHTML() {
  return `<section class="card sugerencias">
    <div class="card-cab"><h3>Sugerencias para hoy</h3></div>
    <ul>${SUGERENCIAS.map(x => `<li>${ico(x.i)}<span><b>${x.b}</b> ${x.t}</span></li>`).join('')}</ul>
  </section>`;
}

// ── Video del ejercicio ─────────────────────────────────────
const musculos = e => musculosDe(e.z || [], ZONAS, GRUPOS);
const leyenda = e => [...new Set((e.z || []).map(z => ZONAS[z]))].map(g => chip(g)).join('');
function hojaVideo(e) {
  const h = abrirHoja(`<p class="eyebrow">${ico('play')} Cómo se hace</p>
    <h3 class="hoja-t">${e.n}</h3>
    <div class="musculos-leyenda">${leyenda(e)}<span class="txt2 peq">se encienden en el video</span></div>
    <div class="video-caja"></div>`);
  montar(h.querySelector('.video-caja'), e.id, musculos(e));
}

function tipHTML(f) {
  const todos = REGLAS.flatMap(r => r.items);
  return `<p class="tip">${ico('guia')}<span><b>Tip del día:</b> ${todos[semilla(f + 'tip') % todos.length]}</span></p>`;
}

// ── Bienvenida (primera vez) ────────────────────────────────
function bienvenida(el) {
  document.body.classList.add('sin-tabs');
  const def = proximoLunes(hoy());
  el.innerHTML = `<section class="bienvenida">
    <div class="logo-grande">${LOGO}</div>
    <h1>¡Epa, Carlos!</h1>
    <p class="txt2">Esta es tu rutina: 4 semanas alternando A y B, trote los sábados y descanso los domingos. Todo se guarda en tu teléfono.</p>
    <label class="campo"><span>¿Qué día arranca tu semana 1?</span><input type="date" id="inicio" value="${def}"></label>
    <p class="txt2 peq">Mejor un lunes. Lo puedes cambiar después en Ajustes.</p>
    <button class="btn-pri" data-a="empezar">Arrancar ${ico('play')}</button>
  </section>`;
}

// ── Eventos ─────────────────────────────────────────────────
function alTocar(e) {
  const b = e.target.closest('[data-a]');
  if (!b) return;
  const a = b.dataset.a, card = b.closest('.ej'), f = hoy();
  switch (a) {
    case 'abrir': {
      const abierta = card.classList.toggle('abierta');
      b.setAttribute('aria-expanded', abierta);
      abierta ? abiertas.add(card.dataset.slot) : abiertas.delete(card.dataset.slot);
      vibrar(8);
      break;
    }
    case 'serie': marcarSerie(f, card, Number(b.dataset.i), b); break;
    case 'peso': pasoPeso(f, card, Number(b.dataset.d)); break;
    case 'repetir': {
      const inp = card.querySelector('input[data-peso]');
      inp.value = b.dataset.w;
      guardarPeso(f, inp, false);
      card.querySelector('.subir')?.remove();
      card.querySelectorAll('[data-a="repetir"]').forEach(x => x.remove());
      vibrar(8);
      break;
    }
    case 'cambiar': hojaCambio(f, card.dataset.slot); break;
    case 'video': hojaVideo(slotDe(f, card.dataset.slot).s.ej); break;
    case 'video-cal': { const x = [...CALENTAMIENTO.superior, ...CALENTAMIENTO.piernas].find(c => c.id === b.dataset.id); hojaVideo({ ...x, id: x.id }); break; }
    case 'revertir': revertir(f, card.dataset.slot); break;
    case 'elegir-dia': hojaDia(f); break;
    case 'volver-plan': delete dia(f).plan; guardar(); refrescar(); break;
    case 'empezar':
      S().ajustes.inicio = $('#inicio').value || proximoLunes(f);
      guardar(); vibrar(); refrescar(); scrollTo(0, 0);
      break;
    default: accionSabado(a, b, f, refrescar);
  }
}

function slotDe(f, slotId) {
  const p = planDe(f), ss = slots(f, p.variante, p.diaPlan);
  return { p, ss, s: ss.find(x => x.slot === slotId) };
}

function marcarSerie(f, card, i, btn) {
  const { p, s } = slotDe(f, card.dataset.slot);
  const d = dia(f);
  d.series ||= {};
  const arr = (d.series[s.slot] = s.hechas.slice());
  arr[i] = !arr[i];
  btn.classList.toggle('hecha', arr[i]);
  btn.setAttribute('aria-pressed', arr[i]);
  if (arr[i]) { btn.classList.remove('pop'); void btn.offsetWidth; btn.classList.add('pop'); vibrar(); sonar.serie(); }

  const completa = arr.every(Boolean);
  card.classList.toggle('completa', completa);
  card.querySelector('.ej-num').innerHTML = completa ? ico('check') : s.i + 1;

  const ss = slots(f, p.variante, p.diaPlan);
  const tot = totalSeries(ss), h = seriesHechas(ss);
  moverAnillo($('#hero-anillo'), h / tot);
  $('#hero-anillo .an-num').textContent = h;
  const antes = !!d.completo;
  d.completo = h === tot;
  guardar();

  if (d.completo && !antes) {
    setTimeout(() => { confeti(); sonar.logro(); vibrar([80, 60, 80]); aviso(FRASES_FIN[semilla(f) % FRASES_FIN.length], 'trofeo'); }, 220);
    return;
  }
  if (!arr[i]) return;
  const quedan = arr.filter(x => !x).length;
  const sig = ss.find(x => x.i > s.i && !x.hechas.every(Boolean)) || ss.find(x => !x.hechas.every(Boolean));
  const sub = quedan ? `Serie ${arr.filter(Boolean).length} de ${s.series} lista · faltan ${quedan}` : `Siguiente: ${sig?.ej.n ?? '¡ya casi!'}`;
  iniciarDescanso(s.descanso, s.ej.n, sub);
  if (completa && sig) {
    setTimeout(() => raiz.querySelector(`[data-slot="${sig.slot}"]`)?.scrollIntoView({ behavior: 'smooth', block: 'center' }), 450);
  }
}

function pasoPeso(f, card, delta) {
  const inp = card.querySelector('input[data-peso]');
  const actual = inp.value !== '' ? parseFloat(inp.value) : (ultimoPeso(inp.dataset.peso, f) ?? 0);
  inp.value = Math.max(0, actual + delta);
  card.querySelector('[data-a="repetir"]')?.remove();
  guardarPeso(f, inp, true);
  vibrar(8);
}

function guardarPeso(f, inp, revisarRecord) {
  const d = dia(f), id = inp.dataset.peso, v = parseFloat(String(inp.value).replace(',', '.'));
  d.pesos ||= {};
  if (Number.isFinite(v) && v >= 0) d.pesos[id] = v; else delete d.pesos[id];
  guardar();
  if (!revisarRecord || !Number.isFinite(v)) return;
  const mejor = mejorPeso(id, f);
  if (mejor != null && v > mejor) {
    const card = inp.closest('.ej');
    card.classList.remove('record'); void card.offsetWidth; card.classList.add('record');
    clearTimeout(guardarPeso.t);
    guardarPeso.t = setTimeout(() => { aviso(`¡Nuevo récord! ${num(v)} lbs en ${ejercicio(id).n}`, 'trofeo'); sonar.logro(); }, 500);
  }
}
const alEscribir = e => { if (e.target.matches('input[data-peso]')) guardarPeso(hoy(), e.target, false); };
const alCambiar = e => { if (e.target.matches('input[data-peso]')) guardarPeso(hoy(), e.target, true); };

// ── Cambiar ejercicio ───────────────────────────────────────
function hojaCambio(f, slotId) {
  const { s } = slotDe(f, slotId), base = s.base;
  let sel = null, modo = 'hoy';
  const alts = (base.a || []).map(([id, se, re]) => {
    const e = ejercicio(id, base.id), actual = s.ej.id === id;
    return `<button class="alt ${actual ? 'actual' : ''}" data-id="${id}">
      <span class="alt-cab"><span class="alt-n">${e.n}</span><b class="alt-sr">${se}×${re}</b></span>
      <span class="alt-p">${e.p[0]}</span>${actual ? '<span class="alt-tag">Ahora</span>' : ''}</button>`;
  }).join('');
  const h = abrirHoja(`<h3 class="hoja-t">Cambiar ejercicio</h3>
    <p class="hoja-sub">En lugar de <b>${base.n}</b> · ${s.orig.series}×${s.orig.reps}</p>
    <div class="alts">
      ${s.cambio ? `<button class="alt original" data-id="${base.id}"><span class="alt-cab"><span class="alt-n">${ico('deshacer')} Volver al original</span><b class="alt-sr">${s.orig.series}×${s.orig.reps}</b></span><span class="alt-p">${base.n}</span></button>` : ''}
      ${alts}
    </div>
    <div class="alt-video" hidden></div>
    <div class="seg" role="radiogroup" aria-label="Duración del cambio">
      <button class="act" data-m="hoy" role="radio" aria-checked="true">Solo por hoy</button>
      <button data-m="siempre" role="radio" aria-checked="false">Usar siempre</button>
    </div>
    <button class="btn-pri" data-listo disabled>Elige una opción</button>`);
  h.onclick = e => {
    const alt = e.target.closest('.alt');
    if (alt) {
      sel = alt.dataset.id;
      h.querySelectorAll('.alt').forEach(x => x.classList.toggle('sel', x === alt));
      const btn = h.querySelector('[data-listo]');
      btn.disabled = false;
      btn.textContent = sel === base.id ? 'Volver al original' : 'Cambiar';
      const caja = h.querySelector('.alt-video'), ej = ejercicio(sel, base.id);
      caja.hidden = !tieneVideo(sel);
      if (tieneVideo(sel)) montar(caja, sel, musculos(ej));
      vibrar(8);
      return;
    }
    const m = e.target.closest('[data-m]');
    if (m) {
      modo = m.dataset.m;
      h.querySelectorAll('[data-m]').forEach(x => { x.classList.toggle('act', x === m); x.setAttribute('aria-checked', x === m); });
      vibrar(8);
      return;
    }
    if (e.target.closest('[data-listo]') && sel) {
      aplicarCambio(f, s, sel, modo);
      cerrarHoja();
      refrescar();
    }
  };
}

function aplicarCambio(f, s, id, modo) {
  const d = dia(f), siempre = S().siempre, baseId = s.base.id;
  d.cambios ||= {};
  if (id === baseId) {
    if (modo === 'siempre') { delete siempre[baseId]; delete d.cambios[s.slot]; }
    else if (siempre[baseId]) d.cambios[s.slot] = baseId;
    else delete d.cambios[s.slot];
    aviso(`De vuelta a ${s.base.n}`, 'deshacer');
  } else {
    if (modo === 'siempre') { siempre[baseId] = id; delete d.cambios[s.slot]; }
    else d.cambios[s.slot] = id;
    aviso(modo === 'siempre' ? 'Cambiado para siempre' : 'Cambiado solo por hoy', 'cambiar');
  }
  guardar();
  vibrar();
}

function revertir(f, slotId) {
  const { s } = slotDe(f, slotId), d = dia(f);
  if (s.cambio === 'hoy') delete d.cambios[slotId];
  else if (s.cambio === 'siempre') delete S().siempre[s.base.id];
  guardar();
  vibrar();
  aviso(`De vuelta a ${s.base.n}`, 'deshacer');
  refrescar();
}

// ── Elegir otro día ─────────────────────────────────────────
function hojaDia(f) {
  const p = planDe(f);
  let v = p.variante;
  const lista = () => `<div class="seg" role="radiogroup" aria-label="Rutina">
      ${['A', 'B'].map(x => `<button class="${x === v ? 'act' : ''}" data-v="${x}" role="radio" aria-checked="${x === v}">Rutina ${x}</button>`).join('')}
    </div>
    <div class="dias">${['lun', 'mar', 'mie', 'jue', 'vie', 'sab', 'dom'].map(d => {
      const pd = PLAN[v][d];
      const t = d === 'sab' ? 'Trote y afloje' : d === 'dom' ? 'Descanso' : `${pd.t} · ${pd.sub}`;
      const tocaHoy = d === p.dia && (v === p.varianteAuto || d === 'sab' || d === 'dom');
      const act = d === p.diaPlan && (v === p.variante || d === 'sab' || d === 'dom');
      return `<button class="dia-op ${act ? 'act' : ''}" data-d="${d}"><span class="dia-n">${NOMBRE_DIA[d]}</span><span class="dia-t">${t}</span>${tocaHoy ? '<span class="dia-hoy">Hoy</span>' : ''}</button>`;
    }).join('')}</div>`;
  const h = abrirHoja(`<h3 class="hoja-t">¿Qué entrenas hoy?</h3>
    <p class="hoja-sub">¿Te saltaste un día o quieres cambiar? Elige aquí; lo que anotes queda en la fecha de hoy.</p>
    <div id="dia-cont">${lista()}</div>`);
  h.onclick = e => {
    const bv = e.target.closest('[data-v]');
    if (bv) { v = bv.dataset.v; h.querySelector('#dia-cont').innerHTML = lista(); vibrar(8); return; }
    const bd = e.target.closest('[data-d]');
    if (!bd) return;
    const dd = bd.dataset.d, auto = info(f, S().ajustes.inicio);
    const igual = dd === auto.dia && (v === auto.variante || dd === 'sab' || dd === 'dom');
    if (igual) delete dia(f).plan; else dia(f).plan = { variante: v, dia: dd };
    guardar(); vibrar(); cerrarHoja(); refrescar(); scrollTo({ top: 0, behavior: 'smooth' });
  };
}
