// Pantalla "Hoy": lo que toca entrenar, series, pesos, cambios de ejercicio, videos y sugerencias
import { GRUPOS, ZONAS, PLAN, SUGERENCIAS, REGLAS, FRASES_DESCANSO, FRASES_FIN, INICIO, TIPO_PESO, CALENTAMIENTO, ENFRIAMIENTO, MOVILIDAD_DIA, ZONA_ESPALDA } from './data.js';
import { S, dia, leerDia, guardar } from './store.js';
import { hoy, info, fechaLarga, fechaCorta, sumar, diaDe, lunesDe, NOMBRE_DIA, proximoLunes } from './calendario.js';
import { planDe, slots, totalSeries, seriesHechas, ultimoPeso, ejercicio, unidadDe, aVista, sugeridoVista, pasoDe, comoCargar, equivalencia, resumenDia, nombreVariante, duracionEstimada, siguientePeso, pesoCercano, pesosPosibles } from './rutina.js';
import { abrirCalculadora } from './calc.js';
import { cuerpo } from './cuerpo.js';
import { $, ico, anillo, moverAnillo, vibrar, sonar, aviso, abrirHoja, cerrarHoja, confeti, semilla, num, pantallaEncendida } from './util.js';
import { iniciarDescanso } from './timer.js';
import { sabadoHTML, accionSabado } from './sabado.js';
import { montar, tieneVideo, musculosDe } from './anim.js';
import { tienePasos, montarPasos } from './pasos.js';
import { chipsAgarre, hojaAgarre } from './agarres.js';
import { hojaSemana } from './semana.js';
import { hojaNoHice, regTarjetaHTML, claseRegistro, ultimoRegistro, textoRegistro, finHTML, terminarDia, hojaResumen, filasDe, guardarFilas, registro, sugerencia, usaPeso, hechasDe, objetivo, notaHTML, SENSACION } from './registro.js';

export const LOGO = `<svg viewBox="0 0 512 512" aria-hidden="true"><defs><linearGradient id="lg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#FF6B4A"/><stop offset="1" stop-color="#FF9F43"/></linearGradient></defs>
  <circle cx="256" cy="256" r="168" fill="none" stroke="#26303B" stroke-width="40"/>
  <circle cx="256" cy="256" r="168" fill="none" stroke="url(#lg)" stroke-width="40" stroke-linecap="round" stroke-dasharray="790 1056" transform="rotate(-90 256 256)"/>
  <g transform="rotate(-35 256 256)" fill="#F5F7FA"><rect x="186" y="244" width="140" height="24" rx="10"/><rect x="160" y="196" width="34" height="120" rx="13"/><rect x="134" y="220" width="22" height="72" rx="9"/><rect x="318" y="196" width="34" height="120" rx="13"/><rect x="356" y="220" width="22" height="72" rx="9"/></g></svg>`;

const abiertas = new Set();
let raiz;
// Día que se está viendo: hoy, o uno pasado abierto desde el calendario para editar lo anotado
let fechaVista = null;
const fechaHoy = () => fechaVista || hoy();

const chip = g => `<span class="tag" style="--c:${GRUPOS[g].c}">${GRUPOS[g].n}</span>`;
const saludo = () => { const h = new Date().getHours(); return h < 12 ? 'Buenos días' : h < 19 ? 'Buenas tardes' : 'Buenas noches'; };

export function renderHoy(el, fecha) {
  raiz = el;
  if (fecha !== undefined) fechaVista = /^\d{4}-\d{2}-\d{2}$/.test(fecha || '') && fecha < hoy() ? fecha : null;
  el.onclick = alTocar;
  el.oninput = alEscribir;
  el.onchange = alCambiar;
  if (!S().ajustes.inicio) { bienvenida(el); return; }
  document.body.classList.remove('sin-tabs');
  const f = fechaHoy(), p = planDe(f);
  const contenido = p.diaPlan === 'dom' ? descansoHTML(f) : p.diaPlan === 'sab' ? sabadoHTML(f, p) : entrenoHTML(f, p);
  el.innerHTML = fechaVista
    ? editandoHTML(f) + contenido
    : cabecera(f, p) + faltasHTML(f) + contenido + sugerenciasHTML() + tipHTML(f);
  pantallaEncendida(!fechaVista && p.diaPlan !== 'dom');
}
const refrescar = () => renderHoy(raiz);

// Día pasado abierto para editar
function editandoHTML(f) {
  return `<header class="top"><p class="saludo">Editando un día pasado</p><h1>${fechaLarga(f)}</h1></header>
    <div class="nota editando">${ico('cal')}<span>Anota o corrige lo que hiciste ese día. <button class="link" data-a="volver-hoy">Volver a hoy</button></span></div>`;
}

// ── Cabecera con la semana del ciclo ────────────────────────
function cabecera(f, p) {
  const puntos = [1, 2, 3, 4].map(n => `<span class="ciclo-p ${n === p.semana ? 'act' : ''} ${n < p.semana ? 'pas' : ''}">${n % 2 ? 'A' : 'B'}</span>`).join('');
  return `<header class="top">
      <p class="saludo">${saludo()}, Carlos</p>
      <h1>${fechaLarga(f)}</h1>
    </header>
    <div class="ciclo">
      <div class="ciclo-txt"><b class="sem-grande">Semana ${p.semana} · ${p.varianteAuto}</b>${p.ciclo > 1 ? `<small>ciclo ${p.ciclo}</small>` : ''}${esDiaGym(p) && p.variante !== p.varianteAuto ? `<small>Hoy haces la ${p.variante}</small>` : ''}</div>
      <div class="ciclo-ps" aria-hidden="true">${puntos}</div>
    </div>
    ${leerDia(f).hecho ? `<div class="nota hecho-mano">${ico('check')}<span>Marcaste hoy como entrenado. <button class="link" data-a="deshacer-hecho">Deshacer</button></span></div>` : ''}
    ${p.antes ? `<div class="nota">${ico('cal')}<span>Tu plan arranca el ${fechaLarga(S().ajustes.inicio).toLowerCase()}. Mientras tanto, esto es lo que viene.</span></div>` : ''}
    <div class="fila-acc">
      <button class="btn-chip acento" data-a="semana">${ico('cal')} Organizar semana</button>
      <button class="btn-chip" data-a="elegir-dia">${ico('cambiar')} Ver otro día</button>
      ${esDiaGym(p) && !p.antes && !resumenDia(f).algo ? `<button class="btn-chip acento" data-a="ya-entrene">${ico('check')} Ya entrené hoy</button>` : ''}
      ${esDiaGym(p) && !p.antes && !/^[AB]\d$/.test(p.variante) ? `<button class="btn-chip" data-a="otra-variante">${ico('cambiar')} Cambiar a ${p.variante === 'A' ? 'B' : 'A'} solo hoy</button>` : ''}
      ${p.override ? `<button class="btn-chip acento" data-a="volver-plan">${ico('deshacer')} Volver a lo de hoy</button>` : ''}
    </div>`;
}

const esDiaGym = p => !!PLAN[p.variante]?.[p.diaPlan];

// ── Día de entrenamiento ────────────────────────────────────
function entrenoHTML(f, p) {
  const d = PLAN[p.variante][p.diaPlan], ss = slots(f, p.variante, p.diaPlan);
  const tot = totalSeries(ss), h = seriesHechas(ss), est = duracionEstimada(ss);
  const grupos = [...new Set(ss.map(s => s.base.g))];
  const zonas = [...new Set(ss.map(s => s.zona).filter(Boolean))].map(z => ZONA_ESPALDA[z].toLowerCase());
  const otra = p.variante[0] === 'A' ? 'B' : 'A';
  return `${cronoHTML(f, est)}<section class="hero" style="--hc:${GRUPOS[grupos[0]].c}">
      <div class="hero-txt">
        <p class="eyebrow">${NOMBRE_DIA[p.diaPlan]} · Rutina ${nombreVariante(p.variante)}</p>
        ${etiquetaCambio(f, p)}
        <h2>${d.t}</h2>
        <p class="hero-sub">${d.sub} · ${ss.length} ejercicios</p>
        <p class="hero-dur">${ico('reloj')} Duración estimada: <b>${est} min</b></p>
        <div class="chips">${grupos.map(chip).join('')}</div>
      </div>
      <div id="hero-anillo">${anillo(h / tot, { tam: 94, grosor: 9, id: 'ah', centro: `<b class="an-num">${h}</b><span>de ${tot}</span>` })}</div>
    </section>
    ${d.comp || zonas.length ? `<div class="nota comp">${ico('cambiar')}<span>${d.comp ? `<b>Complementa a la Semana ${otra}:</b> ${d.comp}` : ''}${zonas.length ? `<span class="hoy-trab"><b>Hoy trabajas:</b> ${zonas.join(' · ')}</span>` : ''}</span></div>` : ''}
    ${calentamientoHTML(f, p)}
    <div class="unid-global" role="radiogroup" aria-label="Ver los pesos en"><span>${ico('balanza')} Pesos en</span>${['lbs', 'kg'].map(x => `<button data-a="unidad" data-u="${x}" role="radio" aria-checked="${x === unidadDe()}">${x}</button>`).join('')}</div>
    <div class="lista-ej">${ss.map(s => tarjeta(f, s)).join('')}</div>
    ${finHTML(f, ss, !fechaVista)}
    ${enfriamientoHTML(f, ss, h === tot || !!leerDia(f).fin)}`;
}

// Cronómetro de la sesión: arranca con la primera serie (o el calentamiento) y se queda arriba
const fmtLargo = x => { x = Math.max(0, Math.floor(x)); const hh = Math.floor(x / 3600), mm = Math.floor((x % 3600) / 60), ss = x % 60; return hh ? `${hh}:${String(mm).padStart(2, '0')}:${String(ss).padStart(2, '0')}` : `${mm}:${String(ss).padStart(2, '0')}`; };
function cronoHTML(f, est) {
  const d = leerDia(f);
  if (fechaVista || !d.t0 || d.fin) return '';
  return `<div class="crono" data-t0="${d.t0}" role="timer" aria-label="Tiempo de la sesión">${ico('reloj')}<b>${fmtLargo((Date.now() - d.t0) / 1000)}</b><small>de ≈${est} min</small></div>`;
}
setInterval(() => { const c = document.querySelector('.crono[data-t0]'); if (c) c.querySelector('b').textContent = fmtLargo((Date.now() - Number(c.dataset.t0)) / 1000); }, 1000);
function mostrarCrono(f, p) {
  if (raiz.querySelector('.crono') || !leerDia(f).t0) return;
  raiz.querySelector('.hero')?.insertAdjacentHTML('beforebegin', cronoHTML(f, duracionEstimada(slots(f, p.variante, p.diaPlan))));
}

// ── Días que faltaste: pasar esa rutina a otro día para no perderla ──
const diaFecha = x => `${NOMBRE_DIA[diaDe(x)].toLowerCase()} ${fechaCorta(x)}`;
const nombreRutina = p => (p.diaPlan === 'sab' ? 'Trote y afloje' : p.diaPlan === 'dom' ? 'Descanso' : `${PLAN[p.variante][p.diaPlan].t} · ${PLAN[p.variante][p.diaPlan].sub}`);
const esGym = p => p.diaPlan !== 'sab' && p.diaPlan !== 'dom' && !!PLAN[p.variante]?.[p.diaPlan];
// Días de gimnasio de la última semana sin ninguna serie marcada (y que no se pasaron ni se descartaron)
function faltas(f) {
  const ini = S().ajustes.inicio, out = [];
  for (let k = 1; k <= 7; k++) {
    const x = sumar(f, -k);
    if (!ini || x < ini) break;
    const p = planDe(x), l = leerDia(x);
    if (!esGym(p) || l.movido || l.ignorar) continue;
    if (resumenDia(x).algo) continue; // anotaste algo ese día: cuenta como entrenado
    out.push({ f: x, p });
  }
  return out;
}
function faltasHTML(f) {
  const fs = faltas(f);
  if (!fs.length) return '';
  return `<section class="card falta">
    <div class="falta-cab">${ico('cal')}<div><b>${fs.length === 1 ? `¿Fuiste el ${diaFecha(fs[0].f)}?` : `${fs.length} días sin nada anotado`}</b>
      <small>Dime si fuiste o no. Si quieres recuperar alguno, pásalo a otro día.</small></div></div>
    ${fs.map(x => `<div class="falta-fila"><span><b>${NOMBRE_DIA[diaDe(x.f)]} ${fechaCorta(x.f)}</b><small>${nombreRutina(x.p)}</small></span>
      <div class="falta-btns"><button class="btn-chip" data-a="no-fui" data-f="${x.f}">No fui</button><button class="btn-chip" data-a="si-fui" data-f="${x.f}">${ico('check')} Sí fui</button></div>
      <button class="link" data-a="semana" data-f="${x.f}">Pasarla a otro día</button></div>`).join('')}
    ${fs.length > 1 ? `<button class="btn-sec" data-a="no-fui-todos">No fui a ninguno</button>` : ''}
  </section>`;
}
// Si este día trae una rutina movida: de qué día faltado viene, o que la cambiaste en la semana
function etiquetaCambio(f, p) {
  if (!p.override || /^[AB]\d$/.test(p.variante)) return ''; // las rutinas anteriores no son un cambio tuyo
  for (let k = 1; k <= 7; k++) { const x = sumar(f, -k); if (leerDia(x).movido === f) return `<p class="recupera">${ico('deshacer')} Recuperando el ${diaFecha(x)}</p>`; }
  return `<p class="recupera">${ico('cal')} Cambiada en tu semana</p>`;
}

// Quitar el cambio de un día: vuelve lo que tocaba y, si traía un día que faltaste, ese queda pendiente otra vez
function quitarRecuperada(t) {
  delete dia(t).plan;
  for (let k = 1; k <= 7; k++) { const x = sumar(t, -k); if (leerDia(x).movido === t) delete dia(x).movido; }
}

// ── Estiramiento final (5 min): 2 o 3 estiramientos de lo que se trabajó hoy, 30 s cada uno ──
function pasosEnfriamiento(ss) {
  const grupos = [...new Set(ss.map(s => s.ej.g))], E = ENFRIAMIENTO.estiramientos;
  const out = grupos.map(g => E[g]?.[0]).filter(Boolean).slice(0, 3);
  if (out.length < 2) out.push(...(E[grupos[0]] || []).slice(1, 3 - out.length));
  return out;
}
function enfriamientoHTML(f, ss, terminado) {
  const pasos = pasosEnfriamiento(ss), est = leerDia(f).estira || [], X = ENFRIAMIENTO.extra;
  const listo = pasos.every((_, i) => est[i]);
  const dur = x => (x.lados ? `${x.t / 2} s por lado` : `${x.t} s`);
  return `<details class="card calent enfria" id="enfria" ${terminado && !listo ? 'open' : ''}>
    <summary><span><b>Estiramiento final${listo ? ' ✓' : ''}</b><small>5 min · al terminar, ahí mismo</small></span>${ico('abajo')}</summary>
    <ol class="cal-lista">${pasos.map((x, i) => `<li class="${est[i] ? 'hecho' : ''}"><span><b>${x.n} · ${dur(x)}</b><small>${x.d}</small></span><button class="ver-mini" data-a="enfria" data-i="${i}" aria-label="Empezar ${x.n}: ${dur(x)}">${ico('reloj')}</button><button class="paso-check ${est[i] ? 'on' : ''}" data-a="estira-check" data-i="${i}" aria-pressed="${!!est[i]}" aria-label="Marcar ${x.n} como hecho">${ico('check')}</button></li>`).join('')}</ol>
  </details>
  <section class="card extra-op"><div class="extra-cab"><span><b>Extra opcional · ${X.min} min</b><small>${X.d}</small></span><button class="ver-mini" data-a="extra" aria-label="Empezar ${X.min} minutos de caminata o bicicleta">${ico('reloj')}</button></div></section>`;
}

// ── Calentamiento (10 min): cardio suave + movilidad del día, cada uno con su reloj ──
const NOMBRE_MOV = { espalda: 'Para espalda y hombros', pierna: 'Para piernas y cadera', pecho: 'Para pecho y hombros' };
function calentamientoHTML(f, p) {
  const c = leerDia(f).cal || {}, tipo = MOVILIDAD_DIA[p.diaPlan] || 'espalda', listo = c.cardio && c.mov;
  const fila = x => `<li><span><b>${x.n}</b><small>${x.d}</small></span>${x.id && tieneVideo(x.id) ? `<button class="ver-mini" data-a="video-cal" data-id="${x.id}" aria-label="Ver cómo se hace ${x.n}">${ico('play')}</button>` : ''}</li>`;
  const paso = (k, n, sub, extra = '') => `<div class="cal-paso ${c[k] ? 'hecho' : ''}"><div class="cal-paso-cab"><span><b>${n}</b><small>${sub}</small></span>
      <button class="ver-mini" data-a="cal-reloj" data-k="${k}" aria-label="Empezar 5 minutos: ${n}">${ico('reloj')}</button>
      <button class="paso-check ${c[k] ? 'on' : ''}" data-a="cal-check" data-k="${k}" aria-pressed="${!!c[k]}" aria-label="Marcar ${n} como hecho">${ico('check')}</button></div>${extra}</div>`;
  return `<details class="card calent" ${listo ? '' : 'open'}>
    <summary><span><b>Calentamiento${listo ? ' ✓' : ''}</b><small>10 min · antes de empezar</small></span>${ico('abajo')}</summary>
    ${paso('cardio', 'Cardio suave · 5 min', CALENTAMIENTO.cardio.d)}
    ${paso('mov', 'Movilidad y activación · 5 min', NOMBRE_MOV[tipo], `<ol class="cal-lista">${CALENTAMIENTO[tipo].map(fila).join('')}</ol>`)}
  </details>`;
}

// ── Series de aproximación (solo el primer ejercicio): ~50 % × 12 y ~70 % × 6-8 del peso de trabajo ──
function aproxHTML(f, s, w0) {
  const id = s.ej.id;
  if (!usaPeso(id) || !w0) return '';
  const u = unidadDe(id), a = leerDia(f).aprox || [], paso = pasoDe(id);
  const peso = x => (pesosPosibles(id) ? pesoCercano(id, w0 * x) : Math.max(paso, Math.round((w0 * x) / paso) * paso));
  return `<div class="aprox" role="group" aria-label="Series de aproximación">${[[0.5, '12'], [0.7, '6-8']].map(([x, r], k) => `<button class="aprox-f ${a[k] ? 'hecha' : ''}" data-a="aprox" data-i="${k}" aria-pressed="${!!a[k]}">
      <span class="aprox-tag">Aproximación</span><b>${num(peso(x))} ${u} × ${r}</b><small>~${x * 100} %</small>${ico('check')}</button>`).join('')}</div>`;
}

// Una serie: marcar como hecha · peso × repeticiones con + y − · cómo se sintió
function filaHTML(x, k, id, u, conPeso, seg) {
  return `<div class="sfila ${x.ok ? 'ok' : ''}" data-k="${k}">
    <button class="serie ${x.ok ? 'hecha' : ''}" data-a="serie" data-i="${k}" aria-pressed="${x.ok}" aria-label="Serie ${k + 1}: marcar como hecha"><span class="serie-n">${k + 1}</span>${ico('check', 'serie-ok')}</button>
    <div class="sctl">
      ${conPeso ? `<div class="nctl"><button data-a="fw" data-d="-1" aria-label="Menos peso en la serie ${k + 1}">${ico('menos')}</button><label><input type="text" inputmode="decimal" data-fw="${k}" value="${x.w != null ? num(x.w) : ''}" placeholder="0" aria-label="Peso de la serie ${k + 1} en ${u}"><small>${u}</small></label><button data-a="fw" data-d="1" aria-label="Más peso en la serie ${k + 1}">${ico('mas')}</button></div><span class="sx" aria-hidden="true">×</span>` : ''}
      <div class="nctl"><button data-a="fr" data-d="-1" aria-label="Menos repeticiones en la serie ${k + 1}">${ico('menos')}</button><label><input type="text" inputmode="numeric" data-fr="${k}" value="${x.r}" aria-label="Repeticiones de la serie ${k + 1}"><small>${seg ? 's' : 'reps'}</small></label><button data-a="fr" data-d="1" aria-label="Más repeticiones en la serie ${k + 1}">${ico('mas')}</button></div>
    </div>
    ${x.ok ? `<div class="sens" role="group" aria-label="¿Cómo se sintió la serie ${k + 1}?">${SENSACION.map(([v, n]) => `<button class="${x.s === v ? 'on' : ''}" data-a="sens" data-v="${v}" aria-pressed="${x.s === v}">${n}</button>`).join('')}</div>` : ''}
  </div>`;
}

function tarjeta(f, s) {
  const e = s.ej, c = GRUPOS[e.g].c, completa = s.hechas.every(Boolean);
  const u = unidadDe(e.id), conPeso = usaPeso(e.id), fs = filasDe(f, s), seg = objetivo(s.reps).seg;
  const reg = registro(f, s.slot), noHecho = reg?.estado === 'no', terminada = reg?.e === e.id && hechasDe(reg).length >= s.series;
  const regAnt = ultimoRegistro(e.id, f), sug = regAnt ? sugerencia(regAnt, s.reps, e.id) : null;
  const [iniLbs, tipo] = INICIO[e.id] || [];
  const ini = iniLbs ? sugeridoVista(e.id, iniLbs) : null, w0 = fs[0]?.w ?? null;
  return `<article class="ej ${abiertas.has(s.slot) ? 'abierta' : ''} ${completa ? 'completa' : ''} ${claseRegistro(f, s)}" data-slot="${s.slot}" style="--c:${c}">
    <button class="ej-cab" data-a="abrir" aria-expanded="${abiertas.has(s.slot)}">
      <span class="ej-num">${completa ? ico('check') : s.i + 1}</span>
      <span class="ej-tit">
        <span class="ej-n">${e.n}</span>
        <span class="ej-meta"><b>${s.series}×${s.reps}</b>${s.nota ? ` · ${s.nota}` : ''} · ${s.descanso} s</span>
      </span>
      <span class="ej-chev">${ico('abajo')}</span>
    </button>
    <div class="ej-tags">${chip(e.g)}${s.zona ? `<span class="tag zona">${ZONA_ESPALDA[s.zona]}</span>` : ''}${chipsAgarre(e.agarre, 'data-a')}${s.cambio === 'equipo' ? `<span class="tag marca">${ico('cambiar')} No tienes ${s.base.n.toLowerCase()}</span>` : s.cambio ? `<span class="tag marca">${ico('cambiar')} ${s.cambio === 'hoy' ? 'Solo hoy' : 'Siempre'}</span><button class="tag volver" data-a="revertir">${ico('deshacer')} Original</button>` : ''}</div>
    ${s.tip ? `<p class="tip-ej">${ico('check')}<span>${s.tip}</span></p>` : ''}
    <p class="ultima">${regAnt ? `Última vez: <b>${textoRegistro(regAnt, e.id)}</b>`
      : ultimoPeso(e.id, f) != null && conPeso ? `Última vez: <b>${num(aVista(e.id, ultimoPeso(e.id, f)))} ${u}</b>`
      : ini ? `Empieza con <b>${u === 'kg' ? '≈ ' : ''}${num(ini)} ${u}</b> ${TIPO_PESO[tipo]}. <span class="peq">Si te sobran más de 3 reps, súbele.</span>`
      : tipo ? `Empieza con ${TIPO_PESO[tipo]}.` : 'Primera vez: anota con cuánto arrancas.'}</p>
    ${sug && !terminada && !noHecho ? `<p class="sug">${ico('subir')}<span><b>Para hoy:</b> ${sug.txt}</span></p>` : ''}
    ${noHecho ? '' : `${s.i === 0 ? aproxHTML(f, s, w0) : ''}
    <div class="sfilas" role="group" aria-label="Series">${fs.map((x, k) => filaHTML(x, k, e.id, u, conPeso, seg)).join('')}</div>
    <div class="sfilas-acc"><button class="link" data-a="fila-menos" ${fs.length <= 1 ? 'disabled' : ''}>${ico('menos')} Quitar serie</button><button class="link" data-a="fila-mas">${ico('mas')} Agregar serie</button></div>
    ${conPeso && w0 ? `<div class="equiv-fila"><p class="equiv">${equivalencia(e.id, w0)}</p><button class="balanza" data-a="calc" aria-label="Abrir la calculadora con este peso">${ico('balanza')}</button></div>
    ${comoCargar(e.id, w0) ? `<p class="carga">${ico('hoy')}<span>${comoCargar(e.id, w0)}</span></p>` : ''}` : ''}
    ${notaHTML(f, s)}`}
    ${sentirHTML(e, u)}
    ${regTarjetaHTML(f, s)}
    <div class="mas"><div class="mas-in">
      ${tieneVideo(e.id) ? `<button class="btn-sec ver-video" data-a="video">${ico('play')} Ver cómo se hace</button>` : ''}
      <div class="mapa">${cuerpo(e.z || [], e.s || [])}</div>
      <h4>Qué trabaja</h4><p class="txt2">${e.t}</p>
      <h4>Cómo hacerlo</h4><ol class="pasos">${e.p.map(x => `<li>${x}</li>`).join('')}</ol>
      <button class="btn-sec" data-a="cambiar">${ico('cambiar')} Cambiar ejercicio</button>
    </div></div>
  </article>`;
}

// ── Para sentir la espalda (remos, jalones y dominadas de las dos semanas) ──
const esEspalda = e => e.g === 'espalda' && /^(remo|jalon|dominadas)/.test(e.id);
const SENTIR = [
  ['Jala con los codos, no con las manos.', 'Tus manos son ganchos: lleva los codos hacia los bolsillos de atrás.'],
  ['Empieza con los omóplatos.', 'Antes de doblar los brazos, baja los hombros y júntalos atrás, como sacando pecho.'],
  ['No aprietes de más el agarre.', 'Firme pero relajado; si aprietas mucho, trabajan los bíceps y los antebrazos.'],
  ['Pausa 1 s', 'con la espalda apretada al final de cada repetición.'],
  ['Estírate arriba o adelante', 'y deja que la espalda se alargue antes de la siguiente repetición.'],
  ['Si te balanceas o no puedes pausar,', 'baja el peso.'],
];
function sentirHTML(e, u) {
  if (!esEspalda(e)) return '';
  const ns = S().noSentida?.[e.id];
  const bajo = ns?.w != null ? Math.max(0, aVista(e.id, ns.w) - pasoDe(e.id)) : null;
  return `<section class="sentir">
    ${ns ? `<div class="no-sentida"><b>La última vez no la sentiste. Hoy prueba:</b>
      <ol><li>${bajo != null ? `Bajar un escalón: <b>${num(bajo)} ${u}</b>.` : 'Bajar un escalón de peso.'}</li><li>Antes, 1 serie de 15 de jalón con brazos rectos, ligero, para encender la espalda.</li><li>La versión con pecho apoyado (remo con mancuernas pecho apoyado), si está en las alternativas.</li></ol>
      <button class="link" data-a="si-senti">Ya la sentí: quitar aviso</button></div>` : ''}
    <h4>${ico('fuego')} Para sentir la espalda</h4>
    <ol class="sentir-l">${SENTIR.map(([a, b]) => `<li><b>${a}</b> ${b}</li>`).join('')}</ol>
    <button class="btn-sec no-senti" data-a="no-senti">No la sentí</button>
  </section>`;
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
  if (tienePasos(e.id)) {
    const h = abrirHoja(`<p class="eyebrow">${ico('play')} Cómo se hace</p><h3 class="hoja-t">${e.n}</h3><div class="pasos-caja"></div>`);
    montarPasos(h.querySelector('.pasos-caja'), e.id);
    return;
  }
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
  const def = lunesDe(hoy()); // el lunes de esta semana: si arrancas un miércoles, igual estás en la semana 1
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
  const a = b.dataset.a, card = b.closest('.ej'), f = fechaHoy();
  switch (a) {
    case 'abrir': {
      const abierta = card.classList.toggle('abierta');
      b.setAttribute('aria-expanded', abierta);
      abierta ? abiertas.add(card.dataset.slot) : abiertas.delete(card.dataset.slot);
      vibrar(8);
      break;
    }
    case 'serie': marcarSerie(f, card, Number(b.dataset.i)); break;
    case 'fw': case 'fr': editarFila(f, card, Number(b.closest('.sfila').dataset.k), a === 'fw' ? 'w' : 'r', Number(b.dataset.d), true); vibrar(6); break;
    case 'fila-mas': case 'fila-menos': {
      conFilas(f, card, fs => { if (a === 'fila-mas') fs.push({ ...fs.at(-1), ok: false, s: null, t: false }); else if (fs.length > 1 && !fs.at(-1).ok) fs.pop(); });
      repintarCard(f, card.dataset.slot); vibrar(6); break;
    }
    case 'sens': { const k = Number(b.closest('.sfila').dataset.k); conFilas(f, card, fs => { fs[k].s = fs[k].s === b.dataset.v ? null : b.dataset.v; }); repintarCard(f, card.dataset.slot); vibrar(6); break; }
    case 'nota': {
      const { s } = slotDe(f, card.dataset.slot), r = registro(f, s.slot);
      const notas = new Set(r?.e === s.ej.id ? r.notas || [] : []);
      notas.has(b.dataset.n) ? notas.delete(b.dataset.n) : notas.add(b.dataset.n);
      conFilas(f, card, () => ({ notas: [...notas] }));
      repintarCard(f, card.dataset.slot); vibrar(6); break;
    }
    case 'aprox': { const d = dia(f), i = Number(b.dataset.i); d.aprox = [0, 1].map(k => !!d.aprox?.[k]); d.aprox[i] = !d.aprox[i]; d.t0 ||= Date.now(); guardar(); vibrar(8); repintarCard(f, card.dataset.slot); mostrarCrono(f, planDe(f)); break; }
    case 'hice-todo': {
      conFilas(f, card, fs => fs.forEach(x => { x.ok = true; }));
      actualizarCompleto(f); vibrar(); sonar.serie();
      const y = scrollY; refrescar(); scrollTo(0, y); break;
    }
    case 'cal-check': { const d = dia(f); d.cal ||= {}; d.cal[b.dataset.k] = !d.cal[b.dataset.k]; if (d.cal[b.dataset.k]) { d.t0 ||= Date.now(); sonar.serie(); } guardar(); vibrar(8); const y = scrollY; refrescar(); scrollTo(0, y); break; }
    case 'cal-reloj': { const d = dia(f); d.t0 ||= Date.now(); guardar(); mostrarCrono(f, planDe(f)); iniciarDescanso(300, b.dataset.k === 'cardio' ? 'Cardio suave' : 'Movilidad y activación', b.dataset.k === 'cardio' ? 'A un ritmo en el que puedas hablar' : 'Haz la lista con calma', 'calma'); break; }
    case 'estira-check': { const d = dia(f), i = Number(b.dataset.i); d.estira ||= []; d.estira[i] = !d.estira[i]; guardar(); vibrar(8); if (d.estira[i]) sonar.serie(); const y = scrollY; refrescar(); scrollTo(0, y); break; }
    case 'extra': { const x = ENFRIAMIENTO.extra; iniciarDescanso(x.min * 60, x.n, 'Extra opcional: no cuenta para la hora', 'calma'); break; }
    case 'video-ej': { const x = ejercicio(b.dataset.id); if (x) hojaVideo(x); break; }
    case 'cambiar': hojaCambio(f, card.dataset.slot); break;
    case 'no-hice': {
      const { s } = slotDe(f, card.dataset.slot);
      hojaNoHice(f, s, { alGuardar: () => { const y = scrollY; refrescar(); scrollTo(0, y); }, abrirAlternativas: () => hojaCambio(f, s.slot) });
      break;
    }
    case 'reg-quitar': {
      const d = dia(f), r = d.reg?.[card.dataset.slot];
      delete d.reg?.[card.dataset.slot]; delete d.series?.[card.dataset.slot];
      if (r?.e) delete d.pesos?.[r.e];
      guardar(); vibrar(8); const y = scrollY; refrescar(); scrollTo(0, y); break;
    }
    case 'ajuste-si': case 'ajuste-no': {
      const { s } = slotDe(f, card.dataset.slot);
      if (a === 'ajuste-si') { S().ajusteReps ||= {}; S().ajusteReps[s.clave] = b.dataset.r; aviso(`${s.ej.n}: ahora ${s.series}×${b.dataset.r}`, 'check'); }
      else { S().ajusteVisto ||= {}; S().ajusteVisto[s.clave] = f; }
      guardar(); vibrar(8);
      const y = scrollY; refrescar(); scrollTo(0, y);
      break;
    }
    case 'terminar': { const p = planDe(f); terminarDia(f, p, slots(f, p.variante, p.diaPlan), { alTerminar: () => { const y = scrollY; refrescar(); scrollTo(0, y); } }); break; }
    case 'reabrir': delete dia(f).fin; guardar(); vibrar(8); refrescar(); aviso('Día abierto otra vez', 'deshacer'); break;
    case 'resumen': { const p = planDe(f); hojaResumen(f, slots(f, p.variante, p.diaPlan)); break; }
    case 'volver-hoy': location.hash = 'hoy'; break;
    case 'otra-variante': {
      const p = planDe(f), otra = p.variante === 'A' ? 'B' : 'A', auto = info(f, S().ajustes.inicio);
      if (otra === auto.variante && p.diaPlan === auto.dia) delete dia(f).plan; else dia(f).plan = { variante: otra, dia: p.diaPlan };
      guardar(); vibrar(); refrescar();
      aviso(`Hoy haces la Semana ${otra}`, 'cambiar');
      break;
    }
    case 'no-senti': {
      const x = slotDe(f, card.dataset.slot).s.ej;
      S().noSentida ||= {};
      S().noSentida[x.id] = { f, w: leerDia(f).pesos?.[x.id] ?? ultimoPeso(x.id, f) ?? null };
      guardar(); vibrar();
      const y = scrollY; refrescar(); scrollTo(0, y);
      aviso('Anotado: la próxima vez te sale qué probar', 'check');
      break;
    }
    case 'si-senti': {
      const x = slotDe(f, card.dataset.slot).s.ej;
      delete S().noSentida?.[x.id];
      guardar(); vibrar(8);
      const y = scrollY; refrescar(); scrollTo(0, y);
      break;
    }
    case 'agarre': { const x = slotDe(f, card.dataset.slot).s.ej; hojaAgarre(x.n, x.agarre); break; }
    case 'video': hojaVideo(slotDe(f, card.dataset.slot).s.ej); break;
    case 'unidad': {
      if (unidadDe() === b.dataset.u) break;
      S().ajustes.unidad = b.dataset.u;
      guardar(); vibrar(8);
      const y = scrollY; refrescar(); scrollTo(0, y);
      aviso(b.dataset.u === 'kg' ? 'Todos los pesos en kilos' : 'Todos los pesos en libras', 'check');
      break;
    }
    case 'calc': {
      const inp = card.querySelector('input[data-fw="0"]'), v = parseFloat(String(inp?.value || '').replace(',', '.'));
      abrirCalculadora(Number.isFinite(v) && v > 0 ? v : '', unidadDe());
      break;
    }
    case 'enfria': {
      const p = planDe(f), x = pasosEnfriamiento(slots(f, p.variante, p.diaPlan))[Number(b.dataset.i)];
      iniciarDescanso(x.t, x.n, x.lados ? `Cambia de lado a la mitad (${x.t / 2} s)` : x.caminata ? 'A paso cómodo, que puedas conversar' : '', 'calma');
      break;
    }
    case 'video-cal': { const x = [...CALENTAMIENTO.espalda, ...CALENTAMIENTO.pierna, ...CALENTAMIENTO.pecho].find(c => c.id === b.dataset.id), e = ejercicio(x.id); hojaVideo(e ? { ...e, n: x.n } : { ...x }); break; }
    case 'revertir': revertir(f, card.dataset.slot); break;
    case 'elegir-dia': hojaDia(f); break;
    case 'volver-plan': quitarRecuperada(f); guardar(); refrescar(); break;
    case 'semana': hojaSemana(f, { seleccion: b.dataset.f || null, alCambiar: () => { const y = scrollY; refrescar(); scrollTo(0, y); } }); break;
    case 'no-fui': dia(b.dataset.f).ignorar = true; guardar(); vibrar(8); refrescar(); aviso('Listo, quitado', 'check'); break;
    case 'no-fui-todos': for (const x of faltas(f)) dia(x.f).ignorar = true; guardar(); vibrar(8); refrescar(); aviso('Listo, quitados', 'check'); break;
    case 'si-fui': dia(b.dataset.f).hecho = true; guardar(); vibrar(8); refrescar(); aviso('Anotado como entrenado', 'check'); break;
    case 'ya-entrene': dia(f).hecho = true; guardar(); vibrar(); refrescar(); aviso('Hoy cuenta como entrenado', 'check'); break;
    case 'deshacer-hecho': delete dia(f).hecho; guardar(); vibrar(8); refrescar(); break;
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

// Lee las filas del ejercicio, las cambia y las guarda (con lo que devuelva fn: notas, etc.)
function conFilas(f, card, fn) {
  const { s } = slotDe(f, card.dataset.slot), fs = filasDe(f, s);
  guardarFilas(f, s, fs, fn(fs, s) || {});
  return s;
}
function repintarCard(f, slot) {
  const { s } = slotDe(f, slot), viejo = raiz.querySelector(`.ej[data-slot="${slot}"]`);
  if (!viejo || !s) return null;
  viejo.outerHTML = tarjeta(f, s);
  return raiz.querySelector(`.ej[data-slot="${slot}"]`);
}
// Cambia el peso o las repeticiones de una serie; las de abajo que no tocaste ni marcaste la copian
function editarFila(f, card, k, campo, v, esPaso) {
  conFilas(f, card, (fs, s) => {
    const x = fs[k];
    if (campo === 'w') x.w = esPaso ? siguientePeso(s.ej.id, x.w, v) ?? x.w : v;
    else x.r = Math.max(0, esPaso ? x.r + v * (objetivo(s.reps).seg ? 5 : 1) : Math.round(v));
    x.t = true;
    for (let j = k + 1; j < fs.length; j++) if (!fs[j].ok && !fs[j].t) fs[j][campo] = x[campo];
  });
  repintarCard(f, card.dataset.slot);
}
function actualizarCompleto(f) {
  const p = planDe(f), ss = slots(f, p.variante, p.diaPlan), d = dia(f);
  const antes = !!d.completo;
  d.completo = seriesHechas(ss) === totalSeries(ss);
  guardar();
  return d.completo && !antes;
}

function marcarSerie(f, card, i) {
  const { p } = slotDe(f, card.dataset.slot);
  let ok = false;
  const s = conFilas(f, card, fs => { ok = fs[i].ok = !fs[i].ok; if (!ok) fs[i].s = null; });
  const el = repintarCard(f, s.slot);
  if (ok) { el?.querySelector(`[data-a="serie"][data-i="${i}"]`)?.classList.add('pop'); vibrar(); sonar.serie(); }
  mostrarCrono(f, p);

  const ss = slots(f, p.variante, p.diaPlan), fs = filasDe(f, ss.find(x => x.slot === s.slot));
  const tot = totalSeries(ss), h = seriesHechas(ss);
  moverAnillo($('#hero-anillo'), h / tot);
  $('#hero-anillo .an-num').textContent = h;
  if (actualizarCompleto(f)) {
    setTimeout(() => { confeti(); sonar.logro(); vibrar([80, 60, 80]); aviso(FRASES_FIN[semilla(f) % FRASES_FIN.length], 'trofeo'); }, 220);
    // Terminaste: abre el estiramiento final
    const enf = $('#enfria');
    if (enf) { enf.open = true; setTimeout(() => enf.scrollIntoView({ behavior: 'smooth', block: 'start' }), 900); }
    return;
  }
  if (!ok || fechaVista) return;
  const hechas = fs.filter(x => x.ok).length, quedan = fs.length - hechas, completa = !quedan;
  const sig = ss.find(x => x.i > s.i && !x.hechas.every(Boolean)) || ss.find(x => !x.hechas.every(Boolean));
  const sub = quedan ? `Serie ${hechas} de ${fs.length} lista · faltan ${quedan}` : `Siguiente: ${sig?.ej.n ?? '¡ya casi!'}`;
  iniciarDescanso(s.descanso, s.ej.n, sub);
  if (completa && sig) setTimeout(() => raiz.querySelector(`[data-slot="${sig.slot}"]`)?.scrollIntoView({ behavior: 'smooth', block: 'center' }), 450);
}

// Escribir a mano: se guarda al salir del campo
const leerNum = v => parseFloat(String(v).replace(',', '.'));
const alEscribir = () => {};
const alCambiar = e => {
  const t = e.target, card = t.closest('.ej'), f = fechaHoy();
  if (!card) return;
  if (t.matches('[data-fw], [data-fr]')) {
    const v = leerNum(t.value);
    if (!Number.isFinite(v) || v < 0) { repintarCard(f, card.dataset.slot); return; }
    editarFila(f, card, Number(t.closest('.sfila').dataset.k), t.matches('[data-fw]') ? 'w' : 'r', Math.round(v * 100) / 100, false);
  } else if (t.matches('[data-nota-txt]')) {
    conFilas(f, card, () => ({ txt: t.value.trim() || undefined }));
  }
};

// ── Cambiar ejercicio ───────────────────────────────────────
function hojaCambio(f, slotId) {
  const { s } = slotDe(f, slotId), base = s.base;
  let sel = null, modo = 'hoy';
  const alts = (s.alts || []).map(([id, se, re]) => {
    const e = ejercicio(id, base.id), actual = s.ej.id === id;
    return `<button class="alt ${actual ? 'actual' : ''}" data-id="${id}">
      <span class="alt-cab"><span class="alt-n">${e.n}</span><b class="alt-sr">${se}×${re}</b></span>
      <span class="alt-p">${e.p[0]}</span>${e.agarre ? `<span class="alt-ag">${chipsAgarre(e.agarre)}</span>` : ''}${tieneVideo(id) ? `<span class="alt-vid">${ico('play')} Toca para ver el video</span>` : ''}${actual ? '<span class="alt-tag">Ahora</span>' : ''}</button>`;
  }).join('');
  const h = abrirHoja(`<h3 class="hoja-t">Cambiar ejercicio</h3>
    <p class="hoja-sub">En lugar de <b>${base.n}</b> · ${s.orig.series}×${s.orig.reps}. Toca una opción para ver su video.</p>
    <div class="alts">
      ${s.cambio && s.cambio !== 'equipo' ? `<button class="alt original" data-id="${base.id}"><span class="alt-cab"><span class="alt-n">${ico('deshacer')} Volver al original</span><b class="alt-sr">${s.orig.series}×${s.orig.reps}</b></span><span class="alt-p">${base.n}</span></button>` : ''}
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
      if (tienePasos(sel)) montarPasos(caja, sel);
      else if (tieneVideo(sel)) montar(caja, sel, musculos(ej));
      // El video justo debajo de la opción tocada, para verlo sin buscarlo
      if (tieneVideo(sel)) { alt.after(caja); setTimeout(() => caja.scrollIntoView({ behavior: 'smooth', block: 'nearest' }), 120); }
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
  const d = dia(f), siempre = S().siempre, baseId = s.base.id, clave = s.clave || baseId;
  d.cambios ||= {};
  if (id === baseId) {
    if (modo === 'siempre') { delete siempre[clave]; delete d.cambios[s.slot]; }
    else if (siempre[clave]) d.cambios[s.slot] = baseId;
    else delete d.cambios[s.slot];
    aviso(`De vuelta a ${s.base.n}`, 'deshacer');
  } else {
    if (modo === 'siempre') { siempre[clave] = id; delete d.cambios[s.slot]; }
    else d.cambios[s.slot] = id;
    aviso(modo === 'siempre' ? 'Cambiado para siempre' : 'Cambiado solo por hoy', 'cambiar');
  }
  guardar();
  vibrar();
}

function revertir(f, slotId) {
  const { s } = slotDe(f, slotId), d = dia(f);
  if (s.cambio === 'hoy') delete d.cambios[slotId];
  else if (s.cambio === 'siempre') delete S().siempre[s.clave || s.base.id];
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
    quitarRecuperada(f);
    if (!igual) dia(f).plan = { variante: v, dia: dd };
    guardar(); vibrar(); cerrarHoja(); refrescar(); scrollTo({ top: 0, behavior: 'smooth' });
  };
}
