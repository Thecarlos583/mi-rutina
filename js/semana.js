// "Organiza tu semana": ver lunes a domingo y acomodar las rutinas como te convenga.
// Tocas una rutina y después el día donde la quieres: se intercambian. Cada cambio se guarda como
// el plan de esa fecha (log[fecha].plan); los días que ya entrenaste quedan fijos para no perder lo anotado.
import { PLAN, GRUPOS } from './data.js';
import { S, dia, leerDia, guardar } from './store.js';
import { info, sumar, lunesDe, diaDe, fechaCorta, NOMBRE_DIA } from './calendario.js';
import { planDe, resumenDia, ejercicio } from './rutina.js';
import { $, ico, abrirHoja, cerrarHoja, vibrar, aviso } from './util.js';

const CORTO = { lun: 'Lun', mar: 'Mar', mie: 'Mié', jue: 'Jue', vie: 'Vie', sab: 'Sáb', dom: 'Dom' };
const esGym = p => p.diaPlan !== 'sab' && p.diaPlan !== 'dom' && !!PLAN[p.variante]?.[p.diaPlan];
const nombre = p => (p.diaPlan === 'sab' ? 'Trote y afloje' : p.diaPlan === 'dom' ? 'Descanso' : PLAN[p.variante][p.diaPlan].t);
const sub = p => (p.diaPlan === 'sab' ? 'Cardio suave y movilidad' : p.diaPlan === 'dom' ? 'Recuperar' : `${PLAN[p.variante][p.diaPlan].sub} · Rutina ${p.variante}`);
const color = p => (p.diaPlan === 'sab' ? GRUPOS.cardio.c : p.diaPlan === 'dom' ? 'var(--txt2)' : GRUPOS[ejercicio(PLAN[p.variante][p.diaPlan].e[0][0]).g].c);

// Guarda la rutina p en la fecha x (si es la que ya tocaba por calendario, quita el cambio)
function poner(x, p) {
  const auto = info(x, S().ajustes.inicio);
  const igual = p.diaPlan === auto.dia && (p.variante === auto.variante || p.diaPlan === 'sab' || p.diaPlan === 'dom');
  if (igual) delete dia(x).plan; else dia(x).plan = { variante: p.variante, dia: p.diaPlan };
}
const hecho = x => resumenDia(x).algo;

// Qué se puede mover: hoy y lo que viene, si no entrenaste ese día; de los días pasados, solo los que faltaste
function estado(x, hoyF) {
  const p = planDe(x);
  if (hecho(x)) return { p, tipo: 'hecho', mover: false };
  if (x < hoyF) return esGym(p) && !leerDia(x).movido && !leerDia(x).ignorar ? { p, tipo: 'falta', mover: true } : { p, tipo: 'pasado', mover: false };
  return { p, tipo: x === hoyF ? 'hoy' : 'futuro', mover: true };
}

function intercambiar(a, b, hoyF) {
  const pa = planDe(a), pb = planDe(b);
  poner(a, pb); poner(b, pa);
  // Un día que ya pasó y se "rescata" queda marcado para que no vuelva a salir el aviso
  for (const [x, y] of [[a, b], [b, a]]) if (x < hoyF) dia(x).movido = y;
}

// Hoy no vas: todo corre un día (hoy toma lo del domingo, que suele ser el descanso)
function correrUnDia(hoyF) {
  const dias = [];
  for (let x = hoyF; x <= sumar(lunesDe(hoyF), 6); x = sumar(x, 1)) dias.push(x);
  const ps = dias.map(planDe);
  dias.forEach((x, i) => poner(x, ps[(i - 1 + ps.length) % ps.length]));
}

export function hojaSemana(hoyF, { seleccion = null, alCambiar } = {}) {
  let lunes = lunesDe(seleccion && seleccion < hoyF ? seleccion : hoyF), sel = seleccion;
  const h = abrirHoja('<div id="sem"></div>');
  const caja = $('#sem', h);
  const pintar = () => {
    const dias = Array.from({ length: 7 }, (_, i) => sumar(lunesDe(lunes), i));
    const ests = dias.map(x => estado(x, hoyF));
    const hayCambios = dias.some(x => leerDia(x).plan && !hecho(x));
    const enEsta = lunes === lunesDe(hoyF), eh = estado(hoyF, hoyF);
    const puedeCorrer = enEsta && eh.mover && eh.p.diaPlan !== 'dom';
    caja.innerHTML = `
      <h3 class="hoja-t">Organiza tu semana</h3>
      <p class="hoja-sub">${sel ? `Ahora toca el día donde quieres <b>${nombre(planDe(sel))}</b>. Se intercambian.` : 'Toca una rutina y después el día donde la quieres: se intercambian.'}</p>
      <div class="seg" role="radiogroup" aria-label="Semana">
        <button data-sem="0" role="radio" aria-checked="${enEsta}">Esta semana</button>
        <button data-sem="7" role="radio" aria-checked="${!enEsta}">La próxima</button>
      </div>
      <div class="sem-lista">${dias.map((x, i) => {
        const e = ests[i], movida = !!leerDia(x).plan;
        const etiqueta = { hecho: `${ico('check')} Hecho`, falta: 'Faltaste', hoy: 'Hoy', pasado: '', futuro: '' }[e.tipo];
        return `<button class="sem-dia ${e.tipo} ${x === sel ? 'sel' : ''} ${e.mover ? '' : 'fijo'}" data-x="${x}" style="--c:${color(e.p)}" aria-pressed="${x === sel}" aria-label="${NOMBRE_DIA[diaDe(x)]} ${fechaCorta(x)}: ${nombre(e.p)}${etiqueta ? ', ' + e.tipo : ''}">
          <span class="sem-fecha"><b>${CORTO[diaDe(x)]}</b><small>${fechaCorta(x).split(' ')[0]}</small></span>
          <span class="sem-rut"><b>${nombre(e.p)}</b><small>${sub(e.p)}${movida && e.tipo !== 'hecho' ? ` · <em>cambiado</em>` : ''}</small></span>
          ${etiqueta ? `<span class="sem-est">${etiqueta}</span>` : ''}
        </button>`;
      }).join('')}</div>
      ${puedeCorrer ? `<button class="btn-sec" data-acc="correr">${ico('cal')} Hoy no voy: correr la semana un día</button>
        <p class="txt2 peq">Lo de hoy pasa a mañana, lo de mañana al día siguiente, y así hasta el domingo. Hoy queda de descanso.</p>` : ''}
      ${hayCambios ? `<button class="btn-sec" data-acc="deshacer">${ico('deshacer')} Volver al plan original de esta semana</button>` : ''}
      <button class="btn-pri" data-acc="listo">Listo</button>`;
  };
  pintar();
  const cambio = msg => { guardar(); vibrar(12); if (msg) aviso(msg, 'check'); pintar(); alCambiar?.(); };
  h.onclick = ev => {
    const s = ev.target.closest('[data-sem]');
    if (s) { lunes = sumar(lunesDe(hoyF), Number(s.dataset.sem)); sel = null; return pintar(); }
    const a = ev.target.closest('[data-acc]')?.dataset.acc;
    if (a === 'listo') return cerrarHoja();
    if (a === 'correr') {
      correrUnDia(hoyF); sel = null;
      return cambio(`Hoy descansas. Mañana: ${nombre(planDe(sumar(hoyF, 1)))}`);
    }
    if (a === 'deshacer') {
      for (let i = 0; i < 7; i++) {
        const x = sumar(lunes, i);
        if (hecho(x)) continue;
        delete dia(x).plan; delete dia(x).movido;
      }
      sel = null;
      return cambio('Semana como estaba en el plan');
    }
    const b = ev.target.closest('[data-x]');
    if (!b) return;
    const x = b.dataset.x, e = estado(x, hoyF);
    if (!e.mover) {
      aviso(e.tipo === 'hecho' ? 'Ese día ya entrenaste: queda como está' : 'Ese día ya pasó', 'cal');
      return;
    }
    if (!sel) { sel = x; vibrar(8); return pintar(); }
    if (sel === x) { sel = null; return pintar(); }
    if (sel < hoyF && x < hoyF) { aviso('Elige hoy o un día que venga', 'cal'); return; }
    const de = sel; sel = null;
    intercambiar(de, x, hoyF);
    cambio(`${CORTO[diaDe(x)]}: ${nombre(planDe(x))} · ${CORTO[diaDe(de)]}: ${nombre(planDe(de))}`);
  };
}
