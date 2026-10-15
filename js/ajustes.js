// Pantalla "Ajustes": fecha de inicio, sonido, vibración, respaldo y reinicio
import { EQUIPO_GYM, EJERCICIOS, PESOS_CAT } from './data.js';
import { equipoActivo, pesosDisp } from './rutina.js';
import { S, guardar, exportar, importar, reiniciar } from './store.js';
import { hoy, info, fechaLarga, lunesDe } from './calendario.js';
import { $, ico, vibrar, sonar, desbloquearAudio, estadoAudio, usoRespaldo, aviso } from './util.js';

let raiz;
const esIOS = /iP(hone|ad|od)/.test(navigator.userAgent) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);

export function renderAjustes(el) {
  raiz = el;
  const a = S().ajustes, f = hoy();
  const inf = info(f, a.inicio);
  const interruptor = (k, titulo, nota) => `<label class="sw"><span><b>${titulo}</b>${nota ? `<small>${nota}</small>` : ''}</span>
    <input type="checkbox" data-aj="${k}" ${a[k] ? 'checked' : ''}><i aria-hidden="true"></i></label>`;
  el.innerHTML = `<header class="top"><p class="saludo">A tu manera</p><h1>Ajustes</h1></header>

    <section class="card">
      <div class="card-cab"><h3>Tu plan</h3></div>
      <label class="campo"><span>Inicio de la semana 1</span><input type="date" id="aj-inicio" value="${a.inicio ?? ''}"></label>
      <p class="txt2 peq">${a.inicio ? (inf.antes ? `Arrancas el ${fechaLarga(lunesDe(a.inicio)).toLowerCase()}.` : `Tu semana 1 empezó el ${fechaLarga(lunesDe(a.inicio)).toLowerCase()}. Hoy: <b>Semana ${inf.semana} · ${inf.variante}</b>${inf.ciclo > 1 ? `, ciclo ${inf.ciclo}` : ''}. Las semanas empiezan los lunes; el ciclo de 4 (A, B, A, B) se repite solo.`) : 'Elige cuándo arrancas.'}</p>
      <p class="txt2 peq">Si la semana no te cuadra, corrige aquí la fecha en que empezaste.</p>
    </section>

    <section class="card">
      <div class="card-cab"><h3>Durante el entreno</h3></div>
      ${interruptor('sonido', 'Sonido', 'Pitidos al terminar el descanso y en el trote')}
      ${interruptor('haptica', 'Vibración', esIOS ? 'En iPhone vibra al tocar (iOS 18 o más). Al final del descanso suena.' : 'Al marcar series y al terminar el descanso')}
      ${interruptor('pantalla', 'Pantalla encendida', 'Que no se apague mientras entrenas')}
      <button class="btn-sec" data-a="probar">${ico('reloj')} Probar sonido</button>
      <p class="estado-audio" id="aj-audio">${textoAudio()}</p>
      <p class="txt2 peq">Si no suena, sube el volumen del teléfono con los botones de un lado.</p>
    </section>

    <section class="card" id="aj-equipo">
      <div class="card-cab"><h3>Equipo de mi gimnasio</h3></div>
      <p class="txt2 peq">Si apagas algo, sus ejercicios desaparecen y la app usa la siguiente alternativa que sí puedas hacer.</p>
      ${EQUIPO_GYM.map(g => `<h4 class="aj-sub">${g.g}</h4>${g.items.map(([k, n, nota]) => `<label class="sw"><span><b>${n}</b>${nota ? `<small>${nota}</small>` : ''}</span><input type="checkbox" data-eq="${k}" ${equipoActivo().includes(k) ? 'checked' : ''}><i aria-hidden="true"></i></label>`).join('')}`).join('')}
      <p class="txt2 peq">No hay: prensa de 45°, hack squat, barra hexagonal, femoral sentado, laterales en máquina, posterior en máquina, remo en máquina T, máquina de encogimientos ni pantorrilla de pie en máquina.</p>
      ${(a.ocultos || []).length ? `<h4 class="aj-sub">Ejercicios que ocultaste</h4>
        ${a.ocultos.map(id => `<label class="sw"><span><b>${EJERCICIOS[id]?.n || id}</b><small>Apágalo para que vuelva a aparecer</small></span><input type="checkbox" data-oculto="${id}" checked><i aria-hidden="true"></i></label>`).join('')}` : ''}
    </section>

    <section class="card" id="aj-pesos">
      <div class="card-cab"><h3>Pesos disponibles</h3></div>
      <p class="txt2 peq">Marca los discos y mancuernas que existen en tu gimnasio. Los botones + y − y las sugerencias para la próxima vez solo usan estos pesos.</p>
      ${Object.entries(PESOS_CAT).map(([k, x]) => `<h4 class="aj-sub">${x.n}</h4><div class="pesos-chips">${x.v.map(w => `<button class="chip-p ${pesosDisp()[k].includes(w) ? 'on' : ''}" data-peso-disp="${k}" data-w="${w}" aria-pressed="${pesosDisp()[k].includes(w)}">${String(w).replace('.', ',')}</button>`).join('')}</div>`).join('')}
    </section>

    <section class="card">
      <div class="card-cab"><h3>Tus datos</h3></div>
      <p class="txt2 peq">Todo se guarda solo en este teléfono. Haz un respaldo de vez en cuando, por si acaso.</p>
      <div class="fila-2">
        <button class="btn-sec" data-a="exportar">${ico('bajar')} Exportar</button>
        <button class="btn-sec" data-a="importar">${ico('subir')} Importar</button>
      </div>
      <input type="file" id="aj-archivo" accept="application/json,.json" hidden>
    </section>

    <section class="card peligro">
      <button class="btn-peligro" data-a="reiniciar">${ico('basura')} Reiniciar todo</button>
    </section>
    <p class="pie">Mi Rutina · hecha para Carlos · <span id="aj-version">versión guardada…</span></p>`;
  // Qué versión tiene guardada el teléfono (la del service worker)
  const sw = navigator.serviceWorker;
  if (sw?.controller) {
    sw.addEventListener('message', ev => { const v = ev.data?.version; const p = $('#aj-version'); if (v && p) p.textContent = v.replace('mi-rutina-', ''); }, { once: true });
    sw.controller.postMessage('version');
  } else { const p = $('#aj-version'); if (p) p.textContent = 'sin instalar'; }

  el.onclick = alTocar;
  el.oninput = null;
  el.onchange = alCambiar;
}

function alCambiar(e) {
  const t = e.target;
  if (t.dataset.aj) {
    S().ajustes[t.dataset.aj] = t.checked;
    guardar();
    vibrar(10);
  } else if (t.dataset.eq) {
    const lista = new Set(equipoActivo());
    t.checked ? lista.add(t.dataset.eq) : lista.delete(t.dataset.eq);
    S().ajustes.equipo = [...lista];
    guardar(); vibrar(10);
  } else if (t.dataset.oculto) {
    if (!t.checked) S().ajustes.ocultos = (S().ajustes.ocultos || []).filter(x => x !== t.dataset.oculto);
    guardar(); vibrar(10);
    aviso('Vuelve a aparecer en la app', 'check');
  } else if (t.id === 'aj-inicio' && t.value) {
    S().ajustes.inicio = t.value;
    guardar();
    aviso('Fecha de inicio guardada', 'check');
    renderAjustes(raiz);
  } else if (t.id === 'aj-archivo' && t.files[0]) {
    t.files[0].text().then(txt => {
      if (!confirm('Esto reemplaza todos tus datos actuales por los del respaldo. ¿Seguimos?')) return;
      importar(txt);
      aviso('Respaldo importado', 'check');
      renderAjustes(raiz);
    }).catch(err => aviso(err.message || 'No se pudo leer el archivo'));
    t.value = '';
  }
}

// Estado del audio para saber si el pitido va a sonar
function textoAudio() {
  const e = estadoAudio();
  if (e === 'listo') return `<span class="ok">●</span> Audio listo${usoRespaldo() ? ' (con el sonido de respaldo)' : ''}`;
  if (e === 'sin-audio') return '<span class="mal">●</span> Este navegador no puede sonar';
  return '<span class="mal">●</span> Audio bloqueado: toca "Probar sonido" para activarlo';
}

async function alTocar(e) {
  const b = e.target.closest('[data-a], [data-peso-disp]');
  if (!b) return;
  const a = b.dataset.a;
  if (b.dataset.pesoDisp) {
    // Prender o apagar un disco o una mancuerna
    const k = b.dataset.pesoDisp, w = Number(b.dataset.w), pd = pesosDisp(), l = new Set(pd[k]);
    l.has(w) ? l.delete(w) : l.add(w);
    S().ajustes.pesosDisp = { ...pd, [k]: [...l].sort((x, y) => x - y) };
    guardar(); vibrar(8);
    b.classList.toggle('on', l.has(w)); b.setAttribute('aria-pressed', l.has(w));
    return;
  }
  if (a === 'probar') {
    desbloquearAudio(); vibrar(30);
    if (!S().ajustes.sonido) aviso('El sonido está apagado');
    else sonar.fin().then(() => { const p = $('#aj-audio'); if (p) p.innerHTML = textoAudio(); });
  } else if (a === 'exportar') {
    const nombre = `mi-rutina-${hoy()}.json`;
    const blob = new Blob([exportar()], { type: 'application/json' });
    const archivo = new File([blob], nombre, { type: 'application/json' });
    if (navigator.canShare?.({ files: [archivo] })) {
      try { await navigator.share({ files: [archivo], title: 'Respaldo de Mi Rutina' }); return; }
      catch (err) { if (err.name === 'AbortError') return; }
    }
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob); link.download = nombre;
    document.body.appendChild(link); link.click(); link.remove();
    setTimeout(() => URL.revokeObjectURL(link.href), 3000);
  } else if (a === 'importar') {
    $('#aj-archivo').click();
  } else if (a === 'reiniciar') {
    if (!confirm('¿Borrar TODO? Pesos, series, cintura y ajustes.')) return;
    if (!confirm('Última pregunta: esto no se puede deshacer. ¿Borrar todo?')) return;
    reiniciar();
    location.hash = '#hoy';
    location.reload();
  }
}
