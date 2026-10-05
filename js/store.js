// Estado de la app guardado en localStorage. Nada sale del teléfono.
const KEY = 'mi-rutina:v1';

const base = () => ({
  v: 1,
  ajustes: { inicio: null, sonido: true, haptica: true, pantalla: true },
  log: {},       // 'AAAA-MM-DD' → { plan, series, pesos, cambios, sab } (habitos: de versiones viejas, ya no se usa)
  siempre: {},   // ejercicio original → alternativa elegida con "Usar siempre"
  cintura: {},   // lunes de la semana → cm
  timer: null,   // descanso en curso
  carrera: null, // trote guiado en curso
});

const fusionar = d => {
  const b = base();
  return { ...b, ...d, ajustes: { ...b.ajustes, ...(d.ajustes || {}) } };
};

function cargar() {
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) return fusionar(JSON.parse(raw));
  } catch (e) { console.warn('No se pudo leer el estado', e); }
  return base();
}

let estado = cargar();

export const S = () => estado;

export function guardar() {
  try { localStorage.setItem(KEY, JSON.stringify(estado)); }
  catch (e) { console.warn('No se pudo guardar', e); }
}

// Devuelve (y crea si no existe) el registro de un día
export const dia = f => (estado.log[f] ||= {});
// Solo lectura, sin crear nada
export const leerDia = f => estado.log[f] || {};

export const exportar = () => JSON.stringify({ ...estado, timer: null, carrera: null }, null, 2);

export function importar(texto) {
  const d = JSON.parse(texto);
  if (!d || typeof d !== 'object' || typeof d.log !== 'object') throw new Error('Ese archivo no parece un respaldo de Mi Rutina.');
  estado = fusionar(d);
  guardar();
}

export function reiniciar() {
  estado = base();
  guardar();
}
