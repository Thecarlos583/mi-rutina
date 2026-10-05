// ─────────────────────────────────────────────────────────────
// Videos: poses clave de cada ejercicio (los ángulos se explican en js/anim.js).
// ms: tiempo hasta la pose siguiente · pausa: tiempo quieto en la pose
// punto: zona que se marca con su texto (rodilla, cadera, espalda, pies, hombro, manos, codo, cabeza)
// Muchos ejercicios se parecen: se arman con plantillas (curl, press, remo…) y cambian postura y equipo.
// ─────────────────────────────────────────────────────────────

// ── Equipo ───────────────────────────────────────────────────
const torre = (x, y0 = 14) => ({ tipo: 'torre', x, y0 });
const cable = (x, y, o = {}) => ({ tipo: 'cable', x, y, ...o });
const banco = (x, ancho, alto = 34) => ({ tipo: 'banco', x, ancho, alto });
// Asiento de máquina bajo la cadera (x0, y0)
const asiento = (x, y) => [{ tipo: 'pad', x1: x - 24, y1: y + 7, x2: x + 18, y2: y + 7, w: 8 }, { tipo: 'pata', x1: x - 3, y1: y + 11 }];
const SENT = { torso: -4, cadera: 92, rodilla: 92 }; // sentado derecho

// ── Bíceps ───────────────────────────────────────────────────
const curlPie = (mano, o = {}) => ({ vistas: ['lado', 'frente'], x0: 128, mano, sigue: 'manos', ...o,
  poses: o.poses || [
    { n: o.n1 || 'De pie, codos pegados al cuerpo', rodilla: 4, hombro: 4, codo: 8, hombro2: o.h2, codo2: o.c2, pausa: 400, ms: 900 },
    { n: o.n2 || 'Sube sin impulso y aprieta arriba', rodilla: 4, hombro: 10, codo: 134, hombro2: o.h2, codo2: o.c2, pausa: 500, ms: 2000, punto: { zona: 'codo', txt: 'Los codos no se mueven' } },
  ] });
const curlPolea = (agarre, o = {}) => curlPie(agarre === 'cuerda' ? null : 'agarre', { ...o, equipo: [torre(212), cable(212, 170, { agarre: agarre === 'cuerda' ? 'cuerda' : 'no', mano: o.mano2 })], vistas: ['lado'] });
const curlSentado = (mano, o = {}) => ({ vistas: ['lado', 'frente'], ancla: 'cadera', x0: 104, y0: 140, mano, sigue: 'manos', equipo: [banco(66, 64, 36)],
  poses: [
    { n: 'Sentado, espalda recta', ...SENT, torso: o.torso ?? 0, hombro: o.h ?? 0, codo: 8, pausa: 400, ms: 900 },
    { n: o.n2 || 'Sube sin impulso', ...SENT, torso: o.torso ?? 0, hombro: (o.h ?? 0) + 8, codo: 134, pausa: 400, ms: 2000, punto: { zona: 'codo', txt: 'Baja en 2 s' } },
  ] });
// Predicador: el brazo descansa en un cojín inclinado frente al pecho
const PRED = [{ tipo: 'pad', x1: 109, y1: 113, x2: 128, y2: 130, w: 9 }, { tipo: 'pata', x1: 128, y1: 134 }, ...asiento(96, 140)];

// ── Tríceps ──────────────────────────────────────────────────
const empuje = (agarre, o = {}) => ({ vistas: ['lado'], x0: 120, mano: o.mano, sigue: 'manos', equipo: [torre(200, 8), cable(200, 22, { agarre })],
  poses: [
    { n: 'Frente a la polea alta, codos pegados', torso: 10, cadera: 8, rodilla: 10, hombro: 12, codo: 110, hombro2: o.h2 ?? 12, codo2: o.c2 ?? 110, pausa: 300, ms: 700 },
    { n: o.n2 || 'Extiende completo hacia abajo', torso: 10, cadera: 8, rodilla: 10, hombro: 14, codo: 4, hombro2: o.h2 ?? 14, codo2: o.c2 ?? 4, pausa: 500, ms: 1300, punto: { zona: 'codo', txt: 'Codos pegados al cuerpo' } },
  ] });
// Acostado en banco plano (press francés, press plano, pullover)
const acostado = (o) => ({ vistas: ['lado'], x0: 146, apoyo: 'cuerpo', mano: o.mano, sigue: 'manos', equipo: [banco(90, 66, 30), ...(o.equipo || [])], poses: o.poses });
const ACOST = { giro: -90, cadera: 12, rodilla: 90 };

// ── Pecho y hombro: banco inclinado y asientos con respaldo ──
const inclinado = (mano, o = {}) => ({ vistas: ['lado'], ancla: 'cadera', x0: 116, y0: 140, mano, sigue: 'manos', equipo: [...asiento(116, 140), { tipo: 'respaldo' }, ...(o.equipo || [])],
  poses: [
    { n: o.n1 || 'Banco a 30°, baja a los lados del pecho', torso: -58, cadera: 37, rodilla: 95, hombro: 10, codo: 118, pausa: 300, ms: 1100 },
    { n: o.n2 || 'Empuja arriba y junta', torso: -58, cadera: 37, rodilla: 95, hombro: 92, codo: 4, pausa: 400, ms: 1600, punto: { zona: 'hombro', txt: 'Omóplatos apretados al banco' } },
  ] });
const pressSentado = (mano, o = {}) => ({ vistas: ['lado', 'frente'], ancla: 'cadera', x0: 104, y0: 136, mano, brazosF: true, sigue: 'manos',
  equipo: [...asiento(104, 136).map(q => ({ ...q, vista: 'lado' })), { tipo: 'respaldo', vista: 'lado' }, { tipo: 'pad', x1: 92, y1: 143, x2: 148, y2: 143, w: 7, vista: 'frente' }],
  poses: [
    { n: o.n1 || 'Espalda pegada, peso a la altura de las orejas', ...SENT, torso: -6, hombro: 30, codo: 140, hF: 90, cF: 90, pausa: 300, ms: 1000 },
    { n: o.n2 || 'Empuja arriba sin bloquear los codos', ...SENT, torso: -6, hombro: 168, codo: 8, hF: 166, cF: 8, pausa: 300, ms: 1500, punto: { zona: 'espalda', txt: 'Sin arquear la espalda baja' } },
  ] });

// ── Espalda ──────────────────────────────────────────────────
const remoInclinado = (mano, o = {}) => ({ vistas: ['lado'], x0: 132, mano, sigue: 'manos', equipo: o.equipo,
  poses: [
    { n: o.n1 || 'Inclinado a 45°, espalda recta', torso: o.t ?? 48, cadera: (o.t ?? 48) + 10, rodilla: 20, hombro: o.t ?? 48, codo: 4, pausa: 300, ms: 800 },
    { n: o.n2 || 'Jala hacia el ombligo y aprieta los omóplatos', torso: o.t ?? 48, cadera: (o.t ?? 48) + 10, rodilla: 20, hombro: -8, codo: 105, pausa: 500, ms: 1600, punto: { zona: 'espalda', txt: 'Espalda recta todo el tiempo' } },
  ] });
const remoSentado = (o = {}) => ({ vistas: ['lado'], ancla: 'cadera', x0: 74, y0: 150, mano: o.mano, sigue: 'manos',
  equipo: [{ tipo: 'pad', x1: 46, y1: 157, x2: 104, y2: 157, w: 8 }, { tipo: 'pata', x1: 74, y1: 161 }, { tipo: 'pad', x1: 150, y1: 134, x2: 150, y2: 170, w: 7 }, torre(214, 104), cable(214, 146, { agarre: o.agarre })],
  poses: [
    { n: o.n1 || 'Sentado, brazos estirados, espalda recta', torso: 8, cadera: 88, rodilla: 25, punta: -10, hombro: 82, codo: 0, pausa: 300, ms: 800 },
    { n: o.n2 || 'Jala hacia el abdomen con los codos atrás', torso: o.atras ?? -4, cadera: 82, rodilla: 25, punta: -10, hombro: o.hFin ?? -28, codo: 110, curva: o.atras ? -3 : 0, pausa: 500, ms: 1500, punto: { zona: 'espalda', txt: 'Pecho afuera, aprieta 1 s' } },
  ] });
const jalon = (mano, o = {}) => ({ vistas: ['lado'], ancla: 'cadera', x0: 106, y0: 138, mano, sigue: 'manos',
  equipo: [...asiento(106, 138), torre(154, 6), cable(154, 12, { agarre: 'no', mano: o.mano2 }), { tipo: 'rodillo', en: 'rodilla', dy: -8, dx: -4 }],
  poses: [
    { n: o.n1 || 'Pecho afuera, brazos arriba', torso: -8, cadera: 92, rodilla: 95, hombro: 168, codo: 12, hombro2: o.h2, codo2: o.c2, pausa: 300, ms: 800 },
    { n: o.n2 || 'Baja al pecho alto con los codos abajo y atrás', torso: -16, cadera: 98, rodilla: 95, hombro: o.hFin ?? 22, codo: 138, hombro2: o.h2, codo2: o.c2, pausa: 400, ms: 1500, punto: { zona: 'codo', txt: 'Sube controlado, sin balanceo' } },
  ] });
const asistidas = (n1) => ({ vistas: ['lado'], ancla: 'cadera', x0: 116, y0: 108, sigue: 'hombro', equipo: [{ tipo: 'barraFija', x1: 70, x2: 172, y: 24 }, { tipo: 'pata', x1: 166, y1: 24 }, { tipo: 'rodillo', en: 'rodilla', dy: 9, dx: -2 }],
  poses: [
    { n: n1, torso: 0, cadera: 5, rodilla: 90, hombro: 176, codo: 0, pausa: 500, ms: 1000 },
    { n: 'Sube hasta pasar la barbilla', torso: -10, cadera: 8, rodilla: 90, hombro: 12, codo: 140, dy: 44, pausa: 300, ms: 1500, punto: { zona: 'codo', txt: 'Codos hacia abajo' } },
    { n: 'Baja lento hasta estirar', torso: -5, cadera: 6, rodilla: 90, hombro: 90, codo: 100, dx: -16, dy: 23, ms: 1300 },
  ] });

// ── Piernas ──────────────────────────────────────────────────
const sentadilla = (o = {}) => ({ vistas: ['lado', 'frente'], x0: 130, mano: o.mano, ancho: 15, sigue: 'cadera', equipo: o.equipo,
  poses: [
    { n: o.n1 || 'Pies al ancho de los hombros, pecho arriba', torso: 4, cadera: 4, rodilla: 2, hombro: o.h ?? -55, codo: o.c ?? 140, punta: o.punta, pausa: 500, ms: 1600 },
    { n: o.n2 || 'Baja hasta paralelo', torso: o.tAbajo ?? 30, cadera: 104, rodilla: o.rAbajo ?? 108, hombro: (o.h ?? -55) + 12, codo: o.c ?? 140, punta: o.punta, pausa: 300, ms: 900, punto: { zona: 'rodilla', txt: 'Rodillas en línea con los pies' } },
  ] });
const pantorrilla = (o = {}) => ({ vistas: ['lado', 'frente'], x0: 132, puntas: true, sigue: 'pies', mano: o.mano, equipo: [{ tipo: 'escalon', x: 112, ancho: 26, alto: 12 }, ...(o.equipo || [])],
  poses: [
    { n: o.n1 || 'Talones abajo hasta estirar', punta: -18, hombro: o.h ?? 0, codo: o.c ?? 10, cadera2: o.c2a, rodilla2: o.r2, dy: 12, pausa: 500, ms: 600 },
    { n: o.n2 || 'Sube lo más alto que puedas y pausa 1 s', punta: 42, hombro: o.h ?? 0, codo: o.c ?? 10, cadera2: o.c2a, rodilla2: o.r2, dy: 12, pausa: 1000, ms: 1400, punto: { zona: 'pies', txt: 'Recorrido completo' } },
  ] });
const puente = (o = {}) => ({ vistas: ['lado'], x0: 168, apoyo: o.apoyo, sigue: 'cadera', equipo: [{ tipo: 'colchoneta', x: 40, ancho: 170 }, ...(o.equipo || [])],
  poses: [
    { n: o.n1 || 'Acostado, rodillas dobladas', torso: -95, cadera: 60, rodilla: 125, cadera2: o.c2a, rodilla2: o.r2a, hombro: 0, codo: 0, pausa: 400, ms: 800 },
    { n: o.n2 || 'Sube la cadera y aprieta el glúteo arriba', torso: -112, cadera: 0, rodilla: 112, cadera2: o.c2b, rodilla2: o.r2b, hombro: 0, codo: 0, pausa: 1000, ms: 1100, punto: { zona: 'cadera', txt: 'Aprieta el glúteo, sin arquear la espalda' } },
  ] });
const hipThrust = (o = {}) => ({ vistas: ['lado'], x0: 172, sigue: 'cadera', equipo: [banco(58, 44, 32), { tipo: 'pesoCadera' }, ...(o.equipo || [])],
  poses: [
    { n: 'Espalda alta en el banco, barra sobre la cadera', torso: -55, cadera: 70, rodilla: 125, hombro: 12, codo: 25, pausa: 400, ms: 800 },
    { n: 'Sube hasta quedar en línea y aprieta 1 s', torso: -90, cadera: 0, rodilla: 90, hombro: 12, codo: 25, pausa: 1000, ms: 1000, punto: { zona: 'cadera', txt: 'Aprieta el glúteo arriba' } },
  ] });

export const ANIM = {
  // ── Espalda ────────────────────────────────────────────────
  'remo-barra': remoInclinado('barra'),
  'remo-supino': remoInclinado('barra', { n2: 'Palmas arriba: barra al ombligo' }),
  'remo-mancuernas-supino': remoInclinado('mancuernas', { n1: 'Inclinado, mancuernas con las palmas al frente' }),
  'remo-mancuernas-pecho': remoInclinado('mancuernas', { t: 52, n1: 'Pecho apoyado en el banco inclinado', n2: 'Lleva las mancuernas a la cadera', equipo: [{ tipo: 'respaldo', lado: 1 }] }),
  'remo-maquina': { vistas: ['lado'], ancla: 'cadera', x0: 88, y0: 142, mano: 'agarre', sigue: 'manos',
    equipo: [...asiento(88, 142), { tipo: 'pad', x1: 115, y1: 98, x2: 115, y2: 128, w: 8 }, { tipo: 'pata', x1: 116, y1: 128 }, torre(198, 64), cable(198, 104, { agarre: 'no' })],
    poses: [
      { n: 'Pecho contra el apoyo, brazos estirados', torso: 16, cadera: 84, rodilla: 80, hombro: 78, codo: 0, pausa: 300, ms: 800 },
      { n: 'Jala con los codos hacia atrás', torso: 16, cadera: 84, rodilla: 80, hombro: -30, codo: 110, pausa: 500, ms: 1500, punto: { zona: 'espalda', txt: 'Aprieta la espalda' } },
    ] },
  'remo-polea-abierto': remoSentado({ agarre: 'no', mano: 'agarre', n2: 'Jala a la parte baja del pecho abriendo los codos', hFin: -10 }),
  'remo-polea-cerrado': remoSentado({ agarre: 'no', mano: 'agarre' }),
  'remo-polea-supino': remoSentado({ agarre: 'no', mano: 'agarre', n2: 'Palmas arriba, jala al abdomen' }),
  'remo-gironda': remoSentado({ agarre: 'no', mano: 'agarre', atras: -12, n1: 'Sentado con el agarre en V', n2: 'Pecho afuera y codos bien atrás' }),
  'jalon-ancho': jalon('barra'),
  'jalon-supino': jalon('agarre', { n1: 'Palmas hacia ti, al ancho de los hombros', n2: 'Jala al pecho con los codos pegados' }),
  'jalon-hammer': jalon('agarre', { n1: 'Agarraderas arriba, pecho afuera', n2: 'Jala al pecho sin echar el torso atrás' }),
  'jalon-v': jalon('agarre', { n1: 'Agarre en V, pecho afuera', n2: 'Lleva el agarre al pecho, codos pegados' }),
  'jalon-un-brazo': jalon('agarre', { h2: 20, c2: 60, n1: 'Un brazo arriba, estirado', n2: 'Lleva el codo hacia la cadera' }),
  'dominadas-asistidas': asistidas('Rodillas en la asistencia, brazos estirados'),
  'dominadas-supinas': asistidas('Palmas hacia ti, rodillas en la asistencia'),
  'remo-una-mano': { vistas: ['lado'], x0: 112, mano: 'mancuerna', sigue: 'manos', equipo: [banco(60, 86, 34)],
    poses: [
      { n: 'Rodilla y mano en el banco, espalda plana', torso: 80, cadera: 85, rodilla: 10, cadera2: 80, rodilla2: 90, punta2: 180, hombro: 80, codo: 0, hombro2: 80, codo2: 0, pausa: 300, ms: 800 },
      { n: 'Lleva la mancuerna a la cadera', torso: 80, cadera: 85, rodilla: 10, cadera2: 80, rodilla2: 90, punta2: 180, hombro: 15, codo: 100, hombro2: 80, codo2: 0, pausa: 400, ms: 1500, punto: { zona: 'espalda', txt: 'Mirada al piso, espalda plana' } },
    ] },
  'remo-polea-un-brazo': { vistas: ['lado'], x0: 116, sigue: 'manos', equipo: [torre(210, 90), cable(210, 112)],
    poses: [
      { n: 'De pie, un brazo estirado hacia la polea', torso: 22, cadera: 30, rodilla: 18, cadera2: -10, rodilla2: 10, hombro: 82, codo: 0, hombro2: 10, codo2: 20, pausa: 300, ms: 800 },
      { n: 'Jala hacia la cadera girando un poco', torso: 18, cadera: 28, rodilla: 18, cadera2: -10, rodilla2: 10, hombro: -30, codo: 105, hombro2: 10, codo2: 20, pausa: 400, ms: 1400, punto: { zona: 'espalda', txt: 'Estira bien al regresar' } },
    ] },
  'jalon-brazos-rectos': { vistas: ['lado'], x0: 104, sigue: 'manos', equipo: [torre(208, 12), cable(208, 22, { agarre: 'no' })], mano: 'agarre',
    poses: [
      { n: 'Frente a la polea alta, brazos casi estirados', torso: 22, cadera: 22, rodilla: 12, hombro: 150, codo: 12, pausa: 300, ms: 1100 },
      { n: 'Baja en arco hasta los muslos', torso: 24, cadera: 24, rodilla: 12, hombro: 12, codo: 10, pausa: 500, ms: 1300, punto: { zona: 'espalda', txt: 'Aprieta el dorsal abajo' } },
    ] },
  'pullover-cuerda': { vistas: ['lado'], x0: 104, sigue: 'manos', equipo: [torre(208, 12), cable(208, 22, { agarre: 'cuerda' })],
    poses: [
      { n: 'Cuerda en polea alta, brazos arriba', torso: 22, cadera: 22, rodilla: 12, hombro: 150, codo: 12, pausa: 300, ms: 1100 },
      { n: 'Baja en arco hasta los muslos', torso: 24, cadera: 24, rodilla: 12, hombro: 12, codo: 10, pausa: 500, ms: 1300, punto: { zona: 'codo', txt: 'Brazos casi estirados' } },
    ] },
  'pullover-mancuerna': acostado({ mano: 'goblet', poses: [
    { n: 'Acostado en el banco, mancuerna sobre el pecho', ...ACOST, hombro: 90, codo: 10, pausa: 400, ms: 1400 },
    { n: 'Bájala detrás de la cabeza, brazos casi rectos', ...ACOST, hombro: 165, codo: 15, pausa: 300, ms: 1200, punto: { zona: 'hombro', txt: 'Hasta donde estés cómodo' } },
  ] }),

  // ── Bíceps ─────────────────────────────────────────────────
  'curl-z': curlPie('z'),
  'curl-barra-recta': curlPie('barra'),
  'curl-inverso-z': curlPie('z', { n1: 'Palmas hacia abajo, codos fijos' }),
  'curl-mancuernas': curlPie('mancuernas', { n1: 'Palmas al frente, codos pegados' }),
  'curl-martillo': curlPie('mancuernas', { poses: [
    { n: 'Palmas mirándose entre sí', rodilla: 4, hombro: 4, codo: 8, hombro2: 4, codo2: 8, pausa: 300, ms: 900 },
    { n: 'Sube una mancuerna', rodilla: 4, hombro: 10, codo: 134, hombro2: 4, codo2: 8, pausa: 400, ms: 1600, punto: { zona: 'codo', txt: 'Codos quietos' } },
    { n: 'Baja controlado', rodilla: 4, hombro: 4, codo: 8, hombro2: 4, codo2: 8, pausa: 200, ms: 900 },
    { n: 'Ahora la otra', rodilla: 4, hombro: 4, codo: 8, hombro2: 10, codo2: 134, pausa: 400, ms: 1600 },
  ] }),
  'curl-polea-baja': curlPolea('barra', { n1: 'Barra en polea baja, codos fijos' }),
  'curl-polea-barra': curlPolea('barra', { n1: 'Barra en polea baja, codos fijos' }),
  'martillo-cuerda': curlPolea('cuerda', { n1: 'Cuerda en polea baja, palmas mirándose' }),
  'curl-polea-una-mano': curlPolea('barra', { h2: 4, c2: 8, n1: 'Un agarre en polea baja, codo fijo' }),
  'curl-polea-detras': { vistas: ['lado'], x0: 128, mano: 'agarre', sigue: 'manos', equipo: [torre(36, 70), cable(36, 112, { agarre: 'no' })],
    poses: [
      { n: 'De espaldas a la polea, brazo un poco atrás', rodilla: 6, cadera2: -12, rodilla2: 8, hombro: -22, codo: 8, hombro2: 0, codo2: 10, pausa: 400, ms: 900 },
      { n: 'Sube estirando bien el bíceps', rodilla: 6, cadera2: -12, rodilla2: 8, hombro: -18, codo: 130, hombro2: 0, codo2: 10, pausa: 400, ms: 1800, punto: { zona: 'codo', txt: 'El codo se queda atrás' } },
    ] },
  'drag-curl': curlPie('z', { poses: [
    { n: 'Barra pegada al cuerpo', rodilla: 4, hombro: 4, codo: 8, pausa: 400, ms: 1000 },
    { n: 'Súbela rozando el cuerpo, codos hacia atrás', rodilla: 4, hombro: -42, codo: 125, pausa: 400, ms: 1800, punto: { zona: 'codo', txt: 'Los codos van atrás, no al frente' } },
  ] }),
  'curl-21': curlPie('z', { poses: [
    { n: '7 reps de abajo a la mitad', rodilla: 4, hombro: 4, codo: 8, ms: 600 },
    { n: 'Hasta la mitad', rodilla: 4, hombro: 6, codo: 80, ms: 700 },
    { n: '7 reps de la mitad a arriba', rodilla: 4, hombro: 6, codo: 80, pausa: 300, ms: 600 },
    { n: 'Hasta arriba', rodilla: 4, hombro: 10, codo: 134, ms: 700 },
    { n: '7 reps completas, sin soltar la barra', rodilla: 4, hombro: 6, codo: 80, ms: 500 },
    { n: 'Abajo y repite completo', rodilla: 4, hombro: 4, codo: 8, ms: 1200, punto: { zona: 'codo', txt: 'Todo seguido' } },
  ] }),
  'curl-predicador': { vistas: ['lado'], ancla: 'cadera', x0: 96, y0: 140, mano: 'z', sigue: 'manos', equipo: PRED,
    poses: [
      { n: 'Brazos pegados al cojín', ...SENT, torso: 15, hombro: 60, codo: 10, pausa: 400, ms: 1000 },
      { n: 'Sube apretando el bíceps', ...SENT, torso: 15, hombro: 60, codo: 135, pausa: 400, ms: 2200, punto: { zona: 'codo', txt: 'Baja lento, sin estirar de golpe' } },
    ] },
  'predicador-maquina': { vistas: ['lado'], ancla: 'cadera', x0: 96, y0: 140, mano: 'agarre', sigue: 'manos', equipo: PRED,
    poses: [
      { n: 'Brazos apoyados en el cojín', ...SENT, torso: 15, hombro: 60, codo: 10, pausa: 400, ms: 1000 },
      { n: 'Sube y baja controlado', ...SENT, torso: 15, hombro: 60, codo: 135, pausa: 400, ms: 2200, punto: { zona: 'codo', txt: 'Sin estirar de golpe abajo' } },
    ] },
  'curl-arana': { vistas: ['lado'], x0: 150, mano: 'mancuernas', sigue: 'manos', equipo: [{ tipo: 'respaldo', lado: 1 }],
    poses: [
      { n: 'Pecho en el banco inclinado, brazos colgando', torso: 50, cadera: 55, rodilla: 25, hombro: 50, codo: 6, pausa: 400, ms: 900 },
      { n: 'Sube sin mover los codos', torso: 50, cadera: 55, rodilla: 25, hombro: 52, codo: 132, pausa: 400, ms: 1800, punto: { zona: 'codo', txt: 'Codos quietos' } },
    ] },
  'curl-concentrado': { vistas: ['lado'], ancla: 'cadera', x0: 92, y0: 140, mano: 'mancuerna', sigue: 'manos', equipo: [banco(52, 70, 36)],
    poses: [
      { n: 'Sentado, codo en la cara interna del muslo', ...SENT, torso: 38, cadera: 100, hombro: 40, codo: 8, hombro2: 20, codo2: 70, pausa: 400, ms: 1000 },
      { n: 'Sube la mancuerna y aprieta 1 s', ...SENT, torso: 38, cadera: 100, hombro: 42, codo: 135, hombro2: 20, codo2: 70, pausa: 1000, ms: 2000, punto: { zona: 'codo', txt: 'Baja lento' } },
    ] },
  'martillo-sentado': curlSentado('mancuernas', { n2: 'Palmas mirándose, sube sin impulso' }),

  // ── Piernas: cuádriceps ────────────────────────────────────
  'sentadilla': sentadilla({ mano: 'barra' }),
  'sentadilla-goblet': sentadilla({ mano: 'goblet', h: 6, c: 145, tAbajo: 26, n1: 'Mancuerna pegada al pecho', n2: 'Baja con el torso recto entre las rodillas' }),
  'goblet-talones': sentadilla({ mano: 'goblet', h: 6, c: 145, tAbajo: 18, rAbajo: 122, punta: 14, equipo: [{ tipo: 'escalon', x: 102, ancho: 18, alto: 6 }], n1: 'Talones sobre un disco', n2: 'Baja profundo con el torso recto' }),
  'sentadilla-smith-adelantados': sentadilla({ mano: 'barra', tAbajo: 14, rAbajo: 96, equipo: [{ tipo: 'rieles', x: 104, vista: 'lado' }, { tipo: 'rieles', x: 72, x2: 168, vista: 'frente' }], n1: 'Pies un paso delante de la barra', n2: 'Baja con el torso derecho' }),
  'sentadilla-hack': sentadilla({ mano: null, h: 10, c: 120, tAbajo: 12, rAbajo: 112, equipo: [{ tipo: 'respaldo', vista: 'lado' }, { tipo: 'rodillo', en: 'hombro', dy: -6, vista: 'lado' }], n1: 'Espalda pegada al respaldo', n2: 'Baja a 90° y sube empujando con todo el pie' }),
  'zancadas-caminando': { vistas: ['lado', 'frente'], x0: 70, mano: 'mancuernas', sigue: 'cadera',
    poses: [
      { n: 'Mancuernas en las manos, de pie', torso: 2, hombro: 0, codo: 0, pausa: 300, ms: 700 },
      { n: 'Paso largo al frente', apoyo: 1, torso: 4, cadera: 70, rodilla: 76, cadera2: -16, rodilla2: 62, punta2: 60, hombro: 0, codo: 0, dx: 50, pausa: 400, ms: 700, punto: { zona: 'rodilla', txt: 'La rodilla de atrás casi toca el piso' } },
      { n: 'Sube y trae la otra pierna adelante', apoyo: 1, torso: 2, hombro: 0, codo: 0, dx: 50, pausa: 200, ms: 900 },
    ] },
  'desplantes': { vistas: ['lado', 'frente'], x0: 110, apoyo: 2, sigue: 'cadera',
    poses: [
      { n: 'De pie', torso: 2, hombro: 0, codo: 10, pausa: 300, ms: 800 },
      { n: 'Paso al frente y baja la rodilla de atrás', torso: 4, cadera: 80, rodilla: 86, cadera2: -14, rodilla2: 62, punta2: 60, hombro: 0, codo: 10, pausa: 400, ms: 800, punto: { zona: 'rodilla', txt: 'Rodilla de adelante en línea con el pie' } },
      { n: 'Regresa al inicio y alterna', torso: 2, hombro: 0, codo: 10, ms: 600 },
    ] },
  'zancada-reversa': { vistas: ['lado', 'frente'], x0: 150, sigue: 'cadera',
    poses: [
      { n: 'De pie', torso: 4, hombro: 0, codo: 10, pausa: 300, ms: 800 },
      { n: 'Paso largo hacia atrás y baja la rodilla', torso: 8, cadera: 82, rodilla: 86, cadera2: -14, rodilla2: 62, punta2: 60, hombro: 0, codo: 10, pausa: 400, ms: 700, punto: { zona: 'rodilla', txt: 'Regresa empujando con la pierna de adelante' } },
    ] },
  'step-up': { vistas: ['lado', 'frente'], x0: 130, dy: 34, sigue: 'cadera', equipo: [{ ...banco(96, 52, 34), vista: 'lado' }, { tipo: 'pad', x1: 88, y1: 151, x2: 152, y2: 151, w: 6, vista: 'frente' }],
    poses: [
      { n: 'Un pie arriba del banco', torso: 16, cadera: 100, rodilla: 120, cadera2: -12, rodilla2: 6, punta2: 30, hombro: 0, codo: 10, dy: 34, pausa: 500, ms: 900 },
      { n: 'Sube empujando con la pierna de arriba', torso: 4, cadera: 0, rodilla: 0, cadera2: 70, rodilla2: 80, hombro: 0, codo: 10, dy: 34, pausa: 400, ms: 1000, punto: { zona: 'cadera', txt: 'Sin impulsarte con la de abajo' } },
    ] },
  'extensiones': { vistas: ['lado'], ancla: 'cadera', x0: 96, y0: 128, sigue: 'pies', equipo: [...asiento(96, 128), { tipo: 'respaldo' }, { tipo: 'rodillo', en: 'tobillo', dx: 6, dy: 0 }],
    poses: [
      { n: 'Espalda pegada al respaldo, rodillo en los tobillos', torso: -12, cadera: 90, rodilla: 92, hombro: 20, codo: 30, pausa: 300, ms: 900 },
      { n: 'Extiende las piernas completas y aprieta 1 s', torso: -12, cadera: 90, rodilla: 4, hombro: 20, codo: 30, pausa: 1000, ms: 1800, punto: { zona: 'rodilla', txt: 'Baja lento' } },
    ] },
  'sissy': { vistas: ['lado'], x0: 132, puntas: true, sigue: 'rodilla', equipo: [{ tipo: 'pata', x1: 164, y1: 70 }],
    poses: [
      { n: 'Agarrado del soporte, en puntas', torso: 0, cadera: 0, rodilla: 6, punta: 30, hombro: 70, codo: 20, pausa: 400, ms: 1400 },
      { n: 'Inclínate atrás llevando las rodillas al frente', torso: -28, cadera: -20, rodilla: 105, punta: 45, hombro: 88, codo: 8, pausa: 400, ms: 1200, punto: { zona: 'rodilla', txt: 'Cadera y torso en línea' } },
    ] },

  // ── Piernas: femoral y glúteo ──────────────────────────────
  'rumano-mancuernas': { vistas: ['lado', 'frente'], x0: 128, mano: 'mancuernas', ancho: 11, sigue: 'cadera',
    poses: [
      { n: 'De pie, mancuernas pegadas a los muslos', torso: 0, cadera: 0, rodilla: 8, hombro: 0, codo: 0, pausa: 500, ms: 1000 },
      { n: 'Cadera atrás, rodillas un poco flexionadas', torso: 66, cadera: 96, rodilla: 22, hombro: 60, codo: 0, pausa: 500, ms: 900, punto: { zona: 'espalda', txt: 'Espalda recta todo el tiempo' } },
    ] },
  'rumano-barra': { vistas: ['lado', 'frente'], x0: 128, mano: 'barra', ancho: 11, sigue: 'cadera',
    poses: [
      { n: 'De pie, barra pegada a los muslos', torso: 0, cadera: 0, rodilla: 8, hombro: 0, codo: 0, pausa: 500, ms: 1000 },
      { n: 'Cadera atrás hasta sentir el femoral', torso: 66, cadera: 96, rodilla: 22, hombro: 60, codo: 0, pausa: 500, ms: 900, punto: { zona: 'manos', txt: 'Barra pegada a las piernas' } },
    ] },
  'buenos-dias': { vistas: ['lado'], x0: 128, mano: 'barra', sigue: 'cadera',
    poses: [
      { n: 'Barra en la espalda, rodillas suaves', torso: 0, cadera: 0, rodilla: 12, hombro: -55, codo: 140, pausa: 400, ms: 1200 },
      { n: 'Inclina el torso llevando la cadera atrás', torso: 68, cadera: 80, rodilla: 18, hombro: -40, codo: 140, pausa: 400, ms: 1100, punto: { zona: 'espalda', txt: 'Espalda recta' } },
    ] },
  'hiperextensiones': { vistas: ['lado'], ancla: 'cadera', x0: 128, y0: 104, sigue: 'hombro', equipo: [{ tipo: 'rodillo', en: 'cadera', dy: 6, dx: 4 }, { tipo: 'pata', x1: 132, y1: 116 }, { tipo: 'pad', x1: 74, y1: 150, x2: 132, y2: 116, w: 5 }],
    poses: [
      { n: 'En el banco romano, baja el torso', giro: 60, torso: 75, cadera: 75, hombro: 25, codo: 140, pausa: 300, ms: 1100 },
      { n: 'Sube hasta quedar en línea apretando el glúteo', giro: 60, torso: 0, hombro: 25, codo: 140, pausa: 600, ms: 1100, punto: { zona: 'espalda', txt: 'Sin pasarte hacia atrás' } },
    ] },
  'bulgara': { vistas: ['lado', 'frente'], x0: 168, mano: 'mancuernas', sigue: 'cadera', equipo: [{ ...banco(62, 50, 40), vista: 'lado' }],
    poses: [
      { n: 'Pie de atrás apoyado en el banco', torso: 8, cadera: 22, rodilla: 8, cadera2: -25, rodilla2: 60, punta2: -20, hombro: 0, codo: 0, pausa: 400, ms: 1300 },
      { n: 'Baja en vertical', torso: 12, cadera: 78, rodilla: 92, cadera2: -5, rodilla2: 125, punta2: -40, hombro: 0, codo: 0, pausa: 300, ms: 900, punto: { zona: 'rodilla', txt: 'Sube empujando con el talón' } },
    ] },
  'femoral-acostado': { vistas: ['lado'], x0: 120, apoyo: 'cuerpo', piso: 146, sigue: 'pies', equipo: [banco(52, 130, 36), { tipo: 'rodillo', en: 'tobillo', dx: 2, dy: -7 }],
    poses: [
      { n: 'Boca abajo, cadera pegada al banco', giro: 90, cadera: 0, rodilla: 0, punta: 70, hombro: 150, codo: 60, pausa: 300, ms: 900 },
      { n: 'Talones hacia el glúteo', giro: 90, cadera: 0, rodilla: 110, punta: 70, hombro: 150, codo: 60, pausa: 500, ms: 1700, punto: { zona: 'cadera', txt: 'La cadera no se despega' } },
    ] },
  'femoral-sentado': { vistas: ['lado'], ancla: 'cadera', x0: 96, y0: 128, sigue: 'pies', equipo: [...asiento(96, 128), { tipo: 'respaldo' }, { tipo: 'rodillo', en: 'rodilla', dx: -10, dy: -8 }, { tipo: 'rodillo', en: 'tobillo', dx: 0, dy: 7 }],
    poses: [
      { n: 'Muslos fijos bajo el rodillo, piernas estiradas', torso: -12, cadera: 92, rodilla: 8, hombro: 25, codo: 40, pausa: 300, ms: 900 },
      { n: 'Lleva los talones hacia abajo y atrás', torso: -12, cadera: 92, rodilla: 108, hombro: 25, codo: 40, pausa: 400, ms: 1600, punto: { zona: 'cadera', txt: 'Sube lento' } },
    ] },
  'femoral-fitball': { vistas: ['lado'], x0: 110, apoyo: 'cuerpo', sigue: 'cadera', equipo: [{ tipo: 'colchoneta', x: 30, ancho: 180 }, { tipo: 'balonPies' }],
    poses: [
      { n: 'Boca arriba, talones en la pelota, cadera arriba', giro: -76, cadera: 0, rodilla: 0, punta: 20, hombro: 10, codo: 0, pausa: 400, ms: 1100 },
      { n: 'Trae la pelota hacia ti', giro: -70, cadera: 70, rodilla: 105, punta: 20, hombro: 10, codo: 0, pausa: 400, ms: 1300, punto: { zona: 'cadera', txt: 'La cadera no baja' } },
    ] },
  'femoral-pie': { vistas: ['lado'], x0: 120, apoyo: 2, sigue: 'pies', equipo: [{ tipo: 'pata', x1: 160, y1: 76 }, torre(196, 100), cable(196, 172, { a: 'pie', agarre: 'no' })],
    poses: [
      { n: 'A una pierna, agarrado de la máquina', torso: 12, cadera: 0, rodilla: 4, cadera2: 0, rodilla2: 4, hombro: 75, codo: 15, pausa: 300, ms: 900 },
      { n: 'Talón hacia el glúteo, cadera quieta', torso: 12, cadera: 0, rodilla: 110, cadera2: 0, rodilla2: 4, hombro: 75, codo: 15, pausa: 400, ms: 1400, punto: { zona: 'cadera', txt: 'Baja controlado' } },
    ] },
  'curl-femoral-maquina': { vistas: ['lado'], ancla: 'cadera', x0: 96, y0: 128, sigue: 'pies', equipo: [...asiento(96, 128), { tipo: 'respaldo' }, { tipo: 'rodillo', en: 'rodilla', dx: -10, dy: -8 }, { tipo: 'rodillo', en: 'tobillo', dx: 0, dy: 7 }],
    poses: [
      { n: 'Rodillo sobre los tobillos', torso: -12, cadera: 92, rodilla: 8, hombro: 25, codo: 40, pausa: 300, ms: 900 },
      { n: 'Lleva los talones atrás y aprieta', torso: -12, cadera: 92, rodilla: 108, hombro: 25, codo: 40, pausa: 500, ms: 1700, punto: { zona: 'cadera', txt: 'Baja lento' } },
    ] },
  'nordico': { vistas: ['lado'], x0: 110, apoyo: 'cuerpo', sigue: 'hombro', equipo: [{ tipo: 'colchoneta', x: 40, ancho: 170 }, { tipo: 'rodillo', en: 'tobillo', dx: -2, dy: -7 }],
    poses: [
      { n: 'De rodillas, tobillos sujetos, cuerpo recto', torso: 0, cadera: 0, rodilla: 90, punta: 70, hombro: 20, codo: 90, pausa: 500, ms: 2600 },
      { n: 'Baja al frente lo más lento que puedas', torso: 55, cadera: 0, rodilla: 35, punta: 70, hombro: 70, codo: 40, pausa: 200, ms: 500, punto: { zona: 'cadera', txt: 'Cadera y torso en línea' } },
      { n: 'Apóyate con las manos y vuelve', torso: 62, cadera: 0, rodilla: 28, punta: 70, hombro: 90, codo: 10, pausa: 400, ms: 1400 },
    ] },
  'hip-thrust': hipThrust(),
  'hip-thrust-smith': hipThrust({ equipo: [{ tipo: 'rieles', x: 130 }] }),
  'elevacion-pelvis': puente(),
  'puente-mancuerna': puente({ equipo: [{ tipo: 'pesoCadera' }], n1: 'Acostado, mancuerna en la cadera' }),
  'puente-una-pierna': { vistas: ['lado'], x0: 168, apoyo: 2, sigue: 'cadera', equipo: [{ tipo: 'colchoneta', x: 40, ancho: 170 }],
    poses: [
      { n: 'Acostado, una pierna estirada en el aire', torso: -95, cadera: 55, rodilla: 0, cadera2: 60, rodilla2: 125, hombro: 0, codo: 0, pausa: 400, ms: 800 },
      { n: 'Sube con la cadera nivelada', torso: -112, cadera: 0, rodilla: 0, cadera2: 0, rodilla2: 112, hombro: 0, codo: 0, pausa: 1000, ms: 1100, punto: { zona: 'cadera', txt: 'Empuja con el talón del pie apoyado' } },
    ] },
  'patada-gluteo-polea': { vistas: ['lado'], x0: 132, apoyo: 2, sigue: 'pies', equipo: [torre(184, 40), cable(184, 172, { a: 'pie', agarre: 'no' })],
    poses: [
      { n: 'Tobillera en polea baja, agarrado de la máquina', torso: 22, cadera: 10, rodilla: 10, cadera2: 22, rodilla2: 6, hombro: 75, codo: 20, pausa: 300, ms: 900 },
      { n: 'Lleva la pierna atrás apretando el glúteo', torso: 22, cadera: -38, rodilla: 6, cadera2: 22, rodilla2: 6, hombro: 75, codo: 20, pausa: 500, ms: 1200, punto: { zona: 'cadera', txt: 'Sin arquear la espalda' } },
    ] },
  'abductor': { vistas: ['frente'], ancla: 'cadera', x0: 120, y0: 140, juntas: true, sigue: 'rodilla', equipo: [{ tipo: 'pad', x1: 94, y1: 147, x2: 146, y2: 147, w: 7 }, { tipo: 'pata', x1: 120, y1: 150 }, { tipo: 'almohadillas' }],
    poses: [
      { n: 'Sentado, espalda pegada', cadera: 90, rodilla: 90, hombro: 10, codo: 20, ancho: 10, pausa: 300, ms: 1100 },
      { n: 'Abre las piernas y aprieta afuera 1 s', cadera: 90, rodilla: 90, hombro: 10, codo: 20, ancho: 30, pausa: 1000, ms: 1400, punto: { zona: 'rodilla', txt: 'Cierra lento' } },
    ] },
  'abduccion-polea': { vistas: ['frente'], x0: 120, sigue: 'pies', equipo: [torre(28, 60), cable(28, 172, { a: 'pie', agarre: 'no' })],
    poses: [
      { n: 'Tobillera en polea baja, de lado', ancho: 8, lat: -2, hombro: 0, codo: 10, pausa: 300, ms: 900 },
      { n: 'Lleva la pierna hacia afuera', ancho: 22, lat: 12, cadera2: 25, hombro: 0, codo: 10, pausa: 400, ms: 1200, punto: { zona: 'espalda', txt: 'Sin inclinar el torso' } },
    ] },
  'caminata-banda': { vistas: ['frente'], x0: 120, sigue: 'cadera', equipo: [{ tipo: 'banda' }],
    poses: [
      { n: 'Banda sobre las rodillas, semi-sentadilla', torso: 20, cadera: 50, rodilla: 55, hombro: 30, codo: 90, lat: 0, ancho: 16, pausa: 400, ms: 450 },
      { n: 'Paso lateral', torso: 20, cadera: 50, rodilla: 55, hombro: 30, codo: 90, lat: 6, ancho: 22, pausa: 150, ms: 450 },
      { n: 'Trae el otro pie, sin juntarlos', torso: 20, cadera: 50, rodilla: 55, hombro: 30, codo: 90, lat: 12, ancho: 16, pausa: 300, ms: 450, punto: { zona: 'rodilla', txt: 'Rodillas hacia afuera' } },
      { n: 'De vuelta al otro lado', torso: 20, cadera: 50, rodilla: 55, hombro: 30, codo: 90, lat: 6, ancho: 22, pausa: 150, ms: 450 },
    ] },

  // ── Pantorrilla ────────────────────────────────────────────
  'pantorrilla-pie': pantorrilla({ n1: 'Pies cerrados, luego rectos, luego abiertos' }),
  'pantorrilla-smith': pantorrilla({ h: -55, c: 140, mano: 'barra', equipo: [{ tipo: 'rieles', x: 116 }], n1: 'Barra en la espalda, puntas sobre un disco' }),
  'pantorrilla-una-pierna': pantorrilla({ mano: 'mancuerna', c2a: -10, r2: 80, equipo: [{ tipo: 'muro', x: 160 }], n1: 'Apoyado en la pared, en una pierna' }),
  'pantorrilla-sentado': { vistas: ['lado'], ancla: 'cadera', x0: 96, y0: 136, sigue: 'pies', equipo: [...asiento(96, 136), { tipo: 'rodillo', en: 'rodilla', dy: -7 }, { tipo: 'escalon', x: 116, ancho: 22, alto: 10 }],
    poses: [
      { n: 'Rodillas bajo el apoyo, talones abajo', torso: 4, cadera: 92, rodilla: 92, punta: -14, hombro: 40, codo: 60, pausa: 400, ms: 700 },
      { n: 'Sube lo más alto posible', torso: 4, cadera: 82, rodilla: 96, punta: 40, hombro: 40, codo: 60, pausa: 800, ms: 1500, punto: { zona: 'pies', txt: 'Baja hasta estirar' } },
    ] },
  'pantorrilla-sentado-mancuerna': { vistas: ['lado'], ancla: 'cadera', x0: 92, y0: 138, mano: 'goblet', sigue: 'pies', equipo: [banco(52, 60, 38), { tipo: 'escalon', x: 112, ancho: 22, alto: 10 }],
    poses: [
      { n: 'Mancuerna sobre las rodillas, puntas en un disco', torso: 4, cadera: 92, rodilla: 92, punta: -14, hombro: 50, codo: 70, pausa: 400, ms: 700 },
      { n: 'Sube y baja completo', torso: 4, cadera: 82, rodilla: 96, punta: 40, hombro: 50, codo: 70, pausa: 800, ms: 1500, punto: { zona: 'pies', txt: 'Recorrido completo' } },
    ] },

  // ── Hombros ────────────────────────────────────────────────
  'militar-mancuernas': pressSentado('mancuernas'),
  'militar-hammer': pressSentado('agarre', { n1: 'Agarres a la altura de los hombros', n2: 'Empuja sin bloquear los codos' }),
  'press-arnold': { vistas: ['frente', 'lado'], ancla: 'cadera', x0: 104, y0: 136, mano: 'mancuernas', brazosF: true, sigue: 'manos',
    equipo: [...asiento(104, 136).map(q => ({ ...q, vista: 'lado' })), { tipo: 'respaldo', vista: 'lado' }, { tipo: 'pad', x1: 92, y1: 143, x2: 148, y2: 143, w: 7, vista: 'frente' }],
    poses: [
      { n: 'Palmas hacia ti, mancuernas frente a la cara', ...SENT, torso: -6, hombro: 80, codo: 140, hF: 25, cF: 140, pausa: 300, ms: 700 },
      { n: 'Abre los codos girando las palmas al frente', ...SENT, torso: -6, hombro: 60, codo: 130, hF: 90, cF: 90, ms: 600 },
      { n: 'Empuja arriba', ...SENT, torso: -6, hombro: 168, codo: 8, hF: 166, cF: 8, pausa: 300, ms: 1300, punto: { zona: 'espalda', txt: 'Sin arquear la espalda' } },
    ] },
  'militar-barra': { vistas: ['lado', 'frente'], x0: 128, mano: 'barra', brazosF: true, sigue: 'manos',
    poses: [
      { n: 'Barra a la altura de la clavícula', torso: 0, rodilla: 5, hombro: 25, codo: 140, hF: 90, cF: 90, pausa: 300, ms: 800 },
      { n: 'Glúteo y abdomen apretados, empuja arriba', torso: 0, rodilla: 5, hombro: 170, codo: 6, hF: 166, cF: 8, pausa: 300, ms: 1300, punto: { zona: 'espalda', txt: 'Sin arquear la espalda' } },
    ] },
  'laterales': { vistas: ['frente'], ancla: 'cadera', x0: 120, y0: 138, brazosF: true, mano: 'mancuernas', sigue: 'manos', equipo: [{ tipo: 'pad', x1: 94, y1: 145, x2: 146, y2: 145, w: 7 }, { tipo: 'pata', x1: 120, y1: 149 }],
    poses: [
      { n: 'Sentado, mancuernas a los lados', ...SENT, hF: 10, cF: 15, hF2: 10, cF2: 15, pausa: 300, ms: 1000 },
      { n: 'Sube hasta la altura del hombro', ...SENT, hF: 86, cF: 15, hF2: 86, cF2: 15, pausa: 300, ms: 1600, punto: { zona: 'hombro', txt: 'Baja lento' } },
    ] },
  'laterales-polea': { vistas: ['frente'], x0: 120, brazosF: true, sigue: 'manos', equipo: [torre(30, 120), cable(30, 172, { lado: 1 })],
    poses: [
      { n: 'Polea baja cruzada por delante', hF: 8, hF2: 10, cF2: 10, pausa: 300, ms: 1000 },
      { n: 'Sube el brazo hasta el hombro', hF: 8, hF2: 86, cF2: 10, pausa: 300, ms: 1500, punto: { zona: 'hombro', txt: 'Controla la bajada' } },
    ] },
  'laterales-maquina': { vistas: ['frente'], ancla: 'cadera', x0: 120, y0: 138, brazosF: true, sigue: 'codo', equipo: [{ tipo: 'pad', x1: 94, y1: 145, x2: 146, y2: 145, w: 7 }, { tipo: 'pata', x1: 120, y1: 149 }],
    poses: [
      { n: 'Codos en los cojines', ...SENT, hF: 10, cF: 70, hF2: 10, cF2: 70, pausa: 300, ms: 1000 },
      { n: 'Sube hasta la altura de los hombros', ...SENT, hF: 86, cF: 70, hF2: 86, cF2: 70, pausa: 300, ms: 1500, punto: { zona: 'hombro', txt: 'Baja lento' } },
    ] },
  'posterior-maquina': { vistas: ['frente'], ancla: 'cadera', x0: 120, y0: 138, brazosF: true, sigue: 'manos', mano: 'agarre', equipo: [{ tipo: 'pad', x1: 94, y1: 145, x2: 146, y2: 145, w: 7 }, { tipo: 'pata', x1: 120, y1: 149 }],
    poses: [
      { n: 'Pecho contra el respaldo, brazos al frente', ...SENT, hF: 40, cF: -110, hF2: 40, cF2: -110, pausa: 300, ms: 900 },
      { n: 'Lleva los brazos hacia atrás y aprieta 1 s', ...SENT, hF: 88, cF: 0, hF2: 88, cF2: 0, pausa: 1000, ms: 1400, punto: { zona: 'hombro', txt: 'Regresa controlado' } },
    ] },
  'pajaro': { vistas: ['frente', 'lado'], x0: 120, brazosF: true, mano: 'mancuernas', sigue: 'manos',
    poses: [
      { n: 'Inclinado al frente, espalda recta', torso: 60, cadera: 68, rodilla: 18, hombro: 60, codo: 10, hF: 8, hF2: 8, cF: 10, cF2: 10, pausa: 300, ms: 900 },
      { n: 'Abre los brazos a los lados', torso: 60, cadera: 68, rodilla: 18, hombro: 60, codo: 10, hF: 82, hF2: 82, cF: 10, cF2: 10, pausa: 400, ms: 1300, punto: { zona: 'espalda', txt: 'Codos un poco flexionados' } },
    ] },
  'posterior-polea': { vistas: ['frente'], x0: 120, brazosF: true, sigue: 'manos', equipo: [torre(24, 60), torre(216, 60), cable(24, 100, { lado: 1 }), cable(216, 100, { lado: 0 })],
    poses: [
      { n: 'Cables cruzados a la altura del pecho', hF: 40, cF: -110, hF2: 40, cF2: -110, pausa: 300, ms: 900 },
      { n: 'Abre los brazos hacia atrás', hF: 88, cF: 0, hF2: 88, cF2: 0, pausa: 500, ms: 1300, punto: { zona: 'hombro', txt: 'Aprieta atrás' } },
    ] },
  'face-pull': { vistas: ['lado'], x0: 96, sigue: 'manos', equipo: [torre(210, 30), cable(210, 66, { agarre: 'cuerda' })],
    poses: [
      { n: 'Cuerda en polea alta, brazos al frente', torso: -4, cadera: 8, rodilla: 10, hombro: 100, codo: 0, pausa: 300, ms: 900 },
      { n: 'Jálala hacia la cara, manos a los lados', torso: -4, cadera: 8, rodilla: 10, hombro: 105, codo: 128, pausa: 500, ms: 1100, punto: { zona: 'codo', txt: 'Codos altos' } },
    ] },

  // ── Pecho ──────────────────────────────────────────────────
  'inclinado-mancuernas': inclinado('mancuernas'),
  'inclinado-barra': inclinado('barra', { n1: 'Banco a 30°, barra al pecho alto', n2: 'Empuja arriba' }),
  'inclinado-maquina': inclinado('agarre', { n1: 'Agarres a la altura del pecho alto', n2: 'Empuja sin despegar la espalda' }),
  'press-plano-barra': acostado({ mano: 'barra', poses: [
    { n: 'Omóplatos juntos, barra al pecho medio', ...ACOST, hombro: 14, codo: 118, pausa: 300, ms: 1000 },
    { n: 'Empuja hacia arriba', ...ACOST, hombro: 90, codo: 4, pausa: 400, ms: 1600, punto: { zona: 'pies', txt: 'Pies firmes en el piso' } },
  ] }),
  'press-plano-mancuernas': acostado({ mano: 'mancuernas', poses: [
    { n: 'Mancuernas a los lados del pecho', ...ACOST, hombro: 14, codo: 118, pausa: 300, ms: 1000 },
    { n: 'Empuja juntándolas arriba', ...ACOST, hombro: 90, codo: 4, pausa: 400, ms: 1600, punto: { zona: 'hombro', txt: 'Baja controlado' } },
  ] }),
  'press-pecho-maquina': { vistas: ['lado'], ancla: 'cadera', x0: 92, y0: 130, mano: 'agarre', sigue: 'manos', equipo: [...asiento(92, 130), { tipo: 'respaldo' }],
    poses: [
      { n: 'Agarres a la altura del pecho medio', torso: -6, cadera: 92, rodilla: 92, hombro: -12, codo: 110, pausa: 300, ms: 900 },
      { n: 'Empuja sin bloquear los codos', torso: -6, cadera: 92, rodilla: 92, hombro: 86, codo: 6, pausa: 300, ms: 1500, punto: { zona: 'hombro', txt: 'Hombros pegados al respaldo' } },
    ] },
  'flexiones': { vistas: ['lado'], x0: 40, sigue: 'hombro',
    poses: [
      { n: 'Cuerpo recto como una tabla', giro: 74, punta: 14, hombro: 90, codo: 0, pausa: 300, ms: 1000 },
      { n: 'Baja el pecho casi al piso', giro: 80, punta: 10, hombro: 40, codo: 95, pausa: 200, ms: 700, punto: { zona: 'cadera', txt: 'Cadera alineada' } },
    ] },
  'cruces-abajo': { vistas: ['frente'], x0: 120, brazosF: true, sigue: 'manos', equipo: [torre(24, 100), torre(216, 100), cable(24, 172, { lado: 0 }), cable(216, 172, { lado: 1 })],
    poses: [
      { n: 'Poleas bajas, brazos abajo y a los lados', hF: 30, cF: 6, hF2: 30, cF2: 6, pausa: 300, ms: 1100 },
      { n: 'Sube en arco hasta juntarlas frente al pecho', hF: 45, cF: -105, hF2: 45, cF2: -105, pausa: 500, ms: 1300, punto: { zona: 'manos', txt: 'Aprieta el pecho arriba' } },
    ] },

  // ── Tríceps ────────────────────────────────────────────────
  'frances-z': acostado({ mano: 'z', poses: [
    { n: 'Acostado, brazos estirados arriba', ...ACOST, hombro: 100, codo: 4, pausa: 300, ms: 1600 },
    { n: 'Baja la barra a la frente, solo se mueven los codos', ...ACOST, hombro: 100, codo: 118, pausa: 300, ms: 1100, punto: { zona: 'codo', txt: 'Codos quietos' } },
  ] }),
  'frances-mancuernas': acostado({ mano: 'mancuernas', poses: [
    { n: 'Acostado, mancuernas arriba', ...ACOST, hombro: 100, codo: 4, pausa: 300, ms: 1600 },
    { n: 'Bájalas a los lados de la cabeza', ...ACOST, hombro: 100, codo: 118, pausa: 300, ms: 1100, punto: { zona: 'codo', txt: 'Solo se mueven los codos' } },
  ] }),
  'frances-una-mancuerna': { vistas: ['lado'], x0: 128, mano: 'goblet', sigue: 'manos',
    poses: [
      { n: 'Mancuerna con las dos manos detrás de la cabeza', torso: 0, rodilla: 5, hombro: 165, codo: 130, pausa: 300, ms: 1300 },
      { n: 'Extiende hacia arriba', torso: 0, rodilla: 5, hombro: 170, codo: 6, pausa: 400, ms: 1500, punto: { zona: 'codo', txt: 'Codos junto a la cabeza' } },
    ] },
  'triceps-sobre-cabeza': { vistas: ['lado'], x0: 150, sigue: 'manos', mano: 'agarre', equipo: [torre(34, 30), cable(34, 54, { agarre: 'no' })],
    poses: [
      { n: 'De espaldas a la polea, codos junto a la cabeza', torso: 25, cadera: 30, rodilla: 18, cadera2: -15, rodilla2: 10, hombro: 160, codo: 130, pausa: 300, ms: 1000 },
      { n: 'Extiende al frente', torso: 25, cadera: 30, rodilla: 18, cadera2: -15, rodilla2: 10, hombro: 165, codo: 6, pausa: 400, ms: 1400, punto: { zona: 'codo', txt: 'Los codos no se mueven' } },
    ] },
  'triceps-polea': empuje('no', { mano: 'agarre' }),
  'triceps-cuerda': empuje('cuerda', { n2: 'Extiende y abre la cuerda al final' }),
  'triceps-un-brazo-polea': empuje('no', { h2: 4, c2: 20, n2: 'Un brazo: extiende completo hacia abajo' }),
  'fondos-maquina': { vistas: ['lado'], ancla: 'cadera', x0: 104, y0: 136, mano: 'agarre', sigue: 'manos', equipo: [...asiento(104, 136), { tipo: 'respaldo' }],
    poses: [
      { n: 'Torso recto, agarres a los lados', ...SENT, torso: -4, hombro: -32, codo: 105, pausa: 300, ms: 900 },
      { n: 'Empuja hacia abajo hasta estirar', ...SENT, torso: -4, hombro: -8, codo: 4, pausa: 400, ms: 1400, punto: { zona: 'codo', txt: 'Codos atrás, pegados' } },
    ] },
  'triceps-predicador': { vistas: ['lado'], ancla: 'cadera', x0: 96, y0: 140, mano: 'mancuerna', sigue: 'manos', equipo: [{ tipo: 'pad', x1: 110, y1: 106, x2: 122, y2: 84, w: 9 }, { tipo: 'pata', x1: 122, y1: 110 }, ...asiento(96, 140)],
    poses: [
      { n: 'Brazo apoyado en el banco, codo doblado', ...SENT, torso: 10, hombro: 150, codo: 135, pausa: 300, ms: 1200 },
      { n: 'Extiende completo con el codo quieto', ...SENT, torso: 10, hombro: 150, codo: 6, pausa: 400, ms: 1500, punto: { zona: 'codo', txt: 'Regresa lento' } },
    ] },
  'patada-triceps-polea': { vistas: ['lado'], x0: 116, sigue: 'manos', equipo: [torre(206, 100), cable(206, 170, { agarre: 'no' })],
    poses: [
      { n: 'Inclinado al frente, codo pegado al cuerpo', torso: 58, cadera: 68, rodilla: 22, hombro: -30, codo: 95, hombro2: 40, codo2: 60, pausa: 300, ms: 800 },
      { n: 'Extiende hacia atrás y aprieta', torso: 58, cadera: 68, rodilla: 22, hombro: -32, codo: 4, hombro2: 40, codo2: 60, pausa: 600, ms: 1300, punto: { zona: 'codo', txt: 'El codo no se mueve' } },
    ] },
  'patada-mancuerna': { vistas: ['lado'], x0: 112, mano: 'mancuerna', sigue: 'manos', equipo: [banco(60, 86, 34)],
    poses: [
      { n: 'Apoyado en el banco, codo junto al torso', torso: 80, cadera: 85, rodilla: 10, cadera2: 80, rodilla2: 90, punta2: 180, hombro: -10, codo: 95, hombro2: 80, codo2: 0, pausa: 300, ms: 800 },
      { n: 'Extiende hacia atrás', torso: 80, cadera: 85, rodilla: 10, cadera2: 80, rodilla2: 90, punta2: 180, hombro: -12, codo: 4, hombro2: 80, codo2: 0, pausa: 600, ms: 1300, punto: { zona: 'codo', txt: 'Codo fijo' } },
    ] },

  // ── Core ───────────────────────────────────────────────────
  'crunch-maquina': { vistas: ['lado'], ancla: 'cadera', x0: 100, y0: 136, mano: 'agarre', sigue: 'hombro', equipo: [...asiento(100, 136), { tipo: 'rodillo', en: 'tobillo', dx: 6, dy: 0 }],
    poses: [
      { n: 'Sentado, agarres junto al pecho', ...SENT, torso: -4, hombro: 70, codo: 130, pausa: 300, ms: 1300 },
      { n: 'Enróllate llevando el pecho a la cadera', ...SENT, torso: 40, cadera: 100, hombro: 70, codo: 130, curva: 7, pausa: 500, ms: 1300, punto: { zona: 'espalda', txt: 'Lento, sin impulso' } },
    ] },
  'crunch-polea': { vistas: ['lado'], x0: 100, apoyo: 'cuerpo', sigue: 'hombro', equipo: [torre(196, 8), cable(196, 20, { agarre: 'cuerda' }), { tipo: 'colchoneta', x: 40, ancho: 170 }],
    poses: [
      { n: 'Arrodillado, cuerda junto a la cabeza', torso: 10, cadera: 10, rodilla: 90, punta: 70, hombro: 160, codo: 140, pausa: 300, ms: 1300 },
      { n: 'Enróllate llevando los codos a los muslos', torso: 70, cadera: 60, rodilla: 90, punta: 70, hombro: 160, codo: 140, curva: 8, pausa: 500, ms: 1300, punto: { zona: 'espalda', txt: 'La cadera no se mueve' } },
    ] },
  'crunch-piso': { vistas: ['lado'], x0: 120, apoyo: 'cuerpo', sigue: 'hombro', equipo: [{ tipo: 'colchoneta', x: 40, ancho: 170 }],
    poses: [
      { n: 'Boca arriba, rodillas dobladas', giro: -90, cadera: 55, rodilla: 110, hombro: 30, codo: 140, pausa: 300, ms: 900 },
      { n: 'Sube los hombros apretando el abdomen', giro: -90, torso: 26, cadera: 55, rodilla: 110, hombro: 30, codo: 140, cabeza: 6, curva: 3, pausa: 500, ms: 1300, punto: { zona: 'cabeza', txt: 'Sin jalar el cuello' } },
    ] },
  'crunch-lateral': { vistas: ['lado'], x0: 120, apoyo: 'cuerpo', sigue: 'hombro', equipo: [{ tipo: 'colchoneta', x: 40, ancho: 170 }],
    poses: [
      { n: 'De lado, piernas juntas, mano en la cabeza', giro: -90, cadera: 20, rodilla: 30, hombro: 150, codo: 135, pausa: 300, ms: 900 },
      { n: 'Sube el torso hacia un lado', giro: -90, torso: 24, cadera: 20, rodilla: 30, hombro: 150, codo: 135, pausa: 500, ms: 1300, punto: { zona: 'espalda', txt: 'Lento; termina un lado y cambia' } },
    ] },
  'elevacion-piernas': { vistas: ['lado'], x0: 120, apoyo: 'cuerpo', sigue: 'pies', equipo: [{ tipo: 'colchoneta', x: 40, ancho: 170 }],
    poses: [
      { n: 'Boca arriba, piernas juntas', giro: -90, cadera: 8, rodilla: 6, hombro: 8, codo: 0, pausa: 300, ms: 1100 },
      { n: 'Súbelas sin balancearte', giro: -90, cadera: 85, rodilla: 8, hombro: 8, codo: 0, pausa: 300, ms: 1800, punto: { zona: 'espalda', txt: 'Baja lento sin tocar el piso' } },
    ] },
  'elevacion-colgado': { vistas: ['lado'], ancla: 'cadera', x0: 116, y0: 112, sigue: 'pies', equipo: [{ tipo: 'barraFija', x1: 70, x2: 172, y: 24 }],
    poses: [
      { n: 'Colgado de la barra', torso: 0, cadera: 4, rodilla: 6, hombro: 176, codo: 0, pausa: 400, ms: 1200 },
      { n: 'Sube las piernas sin balancearte', torso: -8, cadera: 92, rodilla: 10, hombro: 176, codo: 0, pausa: 400, ms: 1500, punto: { zona: 'cadera', txt: 'Controla la bajada' } },
    ] },
  'rodillas-paralelas': { vistas: ['lado'], ancla: 'cadera', x0: 112, y0: 112, sigue: 'rodilla', equipo: [{ tipo: 'paralelas', x: 96, y: 64 }],
    poses: [
      { n: 'Apoyado en las paralelas, piernas abajo', torso: 0, cadera: 6, rodilla: 8, hombro: 0, codo: 90, pausa: 400, ms: 1100 },
      { n: 'Sube las rodillas al pecho', torso: -6, cadera: 112, rodilla: 105, hombro: 0, codo: 90, pausa: 400, ms: 1500, punto: { zona: 'cadera', txt: 'Baja lento' } },
    ] },
  'russian-twist': { vistas: ['frente'], ancla: 'cadera', x0: 120, y0: 174, ancho: 10, mano: 'balon', brazosF: true, sigue: 'manos', equipo: [{ tipo: 'colchoneta', x: 60, ancho: 130 }],
    poses: [
      { n: 'Sentado, torso inclinado, peso al frente', torso: -22, cadera: 140, rodilla: 140, hF: 20, hF2: -20, cF: 40, cF2: -40, tr: 0, pausa: 200, ms: 600 },
      { n: 'Gira a un lado', torso: -22, cadera: 140, rodilla: 140, hF: 50, hF2: -30, cF: -20, cF2: 60, tr: -40, pausa: 200, ms: 800 },
      { n: 'Y al otro lado', torso: -22, cadera: 140, rodilla: 140, hF: -30, hF2: 50, cF: 60, cF2: -20, tr: 40, pausa: 200, ms: 800, punto: { zona: 'espalda', txt: 'Espalda recta' } },
    ] },
  'plancha': { vistas: ['lado'], x0: 40, sigue: 'cadera', equipo: [{ tipo: 'colchoneta', x: 26, ancho: 180 }],
    poses: [
      { n: 'Antebrazos en el piso, cuerpo recto', giro: 80, punta: 12, hombro: 80, codo: 92, pausa: 1500, ms: 600, punto: { zona: 'cadera', txt: 'Abdomen y glúteo apretados' } },
      { n: 'Aguanta respirando normal', giro: 80, punta: 12, hombro: 80, codo: 92, cabeza: 4, pausa: 1500, ms: 600 },
    ] },
  'plancha-lateral': { vistas: ['lado'], x0: 40, sigue: 'cadera', equipo: [{ tipo: 'colchoneta', x: 26, ancho: 180 }],
    poses: [
      { n: 'De lado sobre el antebrazo, cadera abajo', giro: 82, cadera: -12, punta: 12, hombro: 82, codo: 92, hombro2: 0, codo2: 0, pausa: 500, ms: 700 },
      { n: 'Sube la cadera: cuerpo en línea recta', giro: 76, punta: 12, hombro: 80, codo: 92, hombro2: 0, codo2: 0, pausa: 2000, ms: 700, punto: { zona: 'cadera', txt: 'La cadera no cae' } },
    ] },
  'plancha-toque': { vistas: ['lado'], x0: 40, sigue: 'manos', equipo: [{ tipo: 'colchoneta', x: 26, ancho: 180 }],
    poses: [
      { n: 'Plancha alta, brazos estirados', giro: 72, punta: 16, hombro: 90, codo: 0, pausa: 500, ms: 500 },
      { n: 'Toca un hombro con la mano contraria', giro: 72, punta: 16, hombro: 40, codo: 140, hombro2: 90, codo2: 0, pausa: 400, ms: 500, punto: { zona: 'cadera', txt: 'La cadera no se mueve' } },
      { n: 'Vuelve y cambia de mano', giro: 72, punta: 16, hombro: 90, codo: 0, pausa: 300, ms: 500 },
    ] },
  'dead-bug': { vistas: ['lado'], x0: 120, apoyo: 'cuerpo', sigue: 'manos', equipo: [{ tipo: 'colchoneta', x: 40, ancho: 170 }],
    poses: [
      { n: 'Boca arriba, brazos al techo, rodillas a 90°', giro: -90, cadera: 90, rodilla: 90, hombro: 90, codo: 0, pausa: 300, ms: 1000 },
      { n: 'Estira un brazo y la pierna contraria', giro: -90, cadera: 90, rodilla: 90, cadera2: 15, rodilla2: 0, hombro: 170, hombro2: 90, codo: 0, pausa: 400, ms: 1000, punto: { zona: 'espalda', txt: 'Espalda baja pegada al piso' } },
      { n: 'Vuelve y cambia de lado', giro: -90, cadera: 15, rodilla: 0, cadera2: 90, rodilla2: 90, hombro: 90, hombro2: 170, codo: 0, pausa: 400, ms: 1000 },
    ] },
};
