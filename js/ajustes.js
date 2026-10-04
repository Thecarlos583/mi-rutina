// Pantalla "Ajustes": fecha de inicio, sonido, vibración, respaldo y reinicio
import { S, guardar, exportar, importar, reiniciar } from './store.js';
import { hoy, info, fechaLarga } from './calendario.js';
import { $, ico, vibrar, sonar, desbloquearAudio, aviso } from './util.js';

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
      <p class="txt2 peq">${a.inicio ? (inf.antes ? `Arrancas el ${fechaLarga(a.inicio).toLowerCase()}.` : `Hoy estás en la semana ${inf.semana} (rutina ${inf.variante})${inf.ciclo > 1 ? `, ciclo ${inf.ciclo}` : ''}. El ciclo de 4 semanas se repite solo.`) : 'Elige cuándo arrancas.'}</p>
    </section>

    <section class="card">
      <div class="card-cab"><h3>Durante el entreno</h3></div>
      ${interruptor('sonido', 'Sonido', 'Pitidos al terminar el descanso y en el trote')}
      ${interruptor('haptica', 'Vibración', esIOS ? 'En iPhone vibra al tocar (iOS 18 o más). Al final del descanso suena.' : 'Al marcar series y al terminar el descanso')}
      ${interruptor('pantalla', 'Pantalla encendida', 'Que no se apague mientras entrenas')}
      <button class="btn-sec" data-a="probar">${ico('reloj')} Probar sonido</button>
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
    <p class="pie">Mi Rutina · hecha para Carlos · v1.0</p>`;

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

async function alTocar(e) {
  const b = e.target.closest('[data-a]');
  if (!b) return;
  const a = b.dataset.a;
  if (a === 'probar') {
    desbloquearAudio(); vibrar(30);
    setTimeout(() => sonar.fin(), 60);
    if (!S().ajustes.sonido) aviso('El sonido está apagado');
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
