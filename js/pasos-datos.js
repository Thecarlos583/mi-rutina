// Poses fijas de cada ejercicio (los ángulos se explican en js/anim.js).
// poses: 3 o 4 pasos en orden · n: el paso, corto y concreto · punto: zona a cuidar (se marca en coral) y su nota
// vuelve: a qué pose regresa la última (la flecha de la última apunta hacia allá)
// bien / mal: la pose correcta y el error más común · siNo: vista para ese bloque
// def: cambios sobre el dibujo base del ejercicio (equipo, apoyo…) · vistas: la primera es la que se ve al abrir
const SENT = { torso: -4, cadera: 92, rodilla: 92 }; // sentado derecho

export const PASOS = {
  'remo-barra': {
    poses: [
      { n: 'De pie con la barra, pies al ancho de las caderas', torso: 4, cadera: 6, rodilla: 8, hombro: 4, codo: 4 },
      { n: 'Inclínate a 45° doblando un poco las rodillas', torso: 48, cadera: 58, rodilla: 20, hombro: 48, codo: 4, punto: { zona: 'espalda', txt: 'Espalda recta' } },
      { n: 'Jala la barra al ombligo y baja lento', torso: 48, cadera: 58, rodilla: 20, hombro: -8, codo: 105, punto: { zona: 'codo', txt: 'Codos cerca del cuerpo' } },
    ],
    vuelve: 1,
    bien: { pose: { torso: 48, cadera: 58, rodilla: 20, hombro: -8, codo: 105 }, punto: { zona: 'espalda' }, txt: 'Espalda recta y la barra llega al ombligo.' },
    mal: { pose: { torso: 62, cadera: 74, rodilla: 14, hombro: 20, codo: 95, curva: 8 }, punto: { zona: 'espalda' }, txt: 'Espalda redonda: toda la carga se va a la zona lumbar.' },
  },
  'curl-z': {
    poses: [
      { n: 'De pie, barra en los muslos, codos pegados', rodilla: 4, hombro: 4, codo: 8 },
      { n: 'Sube la barra sin mover los codos', rodilla: 4, hombro: 6, codo: 80, punto: { zona: 'codo', txt: 'Codos pegados' } },
      { n: 'Aprieta arriba 1 s y baja en 2 s', rodilla: 4, hombro: 10, codo: 134 },
    ],
    vuelve: 0,
    bien: { pose: { rodilla: 4, hombro: 10, codo: 134 }, punto: { zona: 'codo' }, txt: 'El cuerpo quieto; solo se mueven los antebrazos.' },
    mal: { pose: { torso: -14, cadera: -10, rodilla: 6, hombro: 48, codo: 120 }, punto: { zona: 'espalda' }, txt: 'Echar el cuerpo atrás y adelantar los codos para subirla.' },
  },
  'sentadilla': {
    vistas: ['lado', 'frente'],
    def: { mano: 'barraT' },
    poses: [
      { n: 'Pies al ancho de los hombros, barra en los trapecios', torso: 4, cadera: 4, rodilla: 2, hombro: -40, codo: 145 },
      { n: 'Baja llevando la cadera hacia atrás', torso: 18, cadera: 58, rodilla: 60, hombro: -26, codo: 145, punto: { zona: 'espalda', txt: 'Pecho arriba, espalda recta' } },
      { n: 'Con los muslos paralelos al piso, sube empujando el piso', torso: 30, cadera: 104, rodilla: 108, hombro: -14, codo: 145, punto: { zona: 'rodilla', txt: 'Rodillas en línea con los pies' } },
    ],
    vuelve: 0,
    siNo: 'frente',
    bien: { pose: { torso: 30, cadera: 104, rodilla: 108, hombro: -14, codo: 145 }, punto: { zona: 'rodilla' }, txt: 'Las rodillas siguen la dirección de las puntas de los pies.' },
    mal: { pose: { torso: 30, cadera: 104, rodilla: 108, hombro: -14, codo: 145, valgo: 9 }, punto: { zona: 'rodilla' }, txt: 'Rodillas que se van hacia adentro al subir.' },
  },
  'militar-mancuernas': {
    vistas: ['lado', 'frente'],
    poses: [
      { n: 'Sentado, espalda pegada, mancuernas a la altura de las orejas', ...SENT, torso: -6, hombro: 30, codo: 140, hF: 90, cF: 90 },
      { n: 'Empuja hacia arriba, sin despegar la espalda', ...SENT, torso: -6, hombro: 100, codo: 70, hF: 128, cF: 46, punto: { zona: 'espalda', txt: 'Espalda pegada al respaldo' } },
      { n: 'Arriba sin bloquear los codos, y baja hasta las orejas', ...SENT, torso: -6, hombro: 168, codo: 8, hF: 166, cF: 8 },
    ],
    vuelve: 0,
    bien: { pose: { ...SENT, torso: -6, hombro: 168, codo: 8, hF: 166, cF: 8 }, punto: { zona: 'espalda' }, txt: 'Espalda apoyada en el respaldo de arriba abajo.' },
    mal: { pose: { ...SENT, torso: -20, cadera: 78, hombro: 168, codo: 8, hF: 166, cF: 8, curva: -7 }, punto: { zona: 'espalda' }, txt: 'Arquear la espalda baja para empujar más peso.' },
  },
  'jalon-ancho': {
    poses: [
      { n: 'Sentado, rodillas bajo los rodillos, brazos arriba', torso: -8, cadera: 92, rodilla: 95, hombro: 168, codo: 12 },
      { n: 'Pecho afuera y baja llevando los codos hacia abajo', torso: -12, cadera: 95, rodilla: 95, hombro: 100, codo: 80, punto: { zona: 'codo', txt: 'Codos hacia abajo y atrás' } },
      { n: 'Barra al pecho alto, y sube controlado', torso: -16, cadera: 98, rodilla: 95, hombro: 22, codo: 138, punto: { zona: 'espalda', txt: 'Sin balancear el torso' } },
    ],
    vuelve: 0,
    bien: { pose: { torso: -16, cadera: 98, rodilla: 95, hombro: 22, codo: 138 }, punto: { zona: 'espalda' }, txt: 'Torso casi derecho y la barra llega al pecho alto.' },
    mal: { pose: { torso: -42, cadera: 72, rodilla: 95, hombro: 30, codo: 128 }, punto: { zona: 'espalda' }, txt: 'Echarse muy atrás y jalar con impulso.' },
  },
};
