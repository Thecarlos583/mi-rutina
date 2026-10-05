// ─────────────────────────────────────────────────────────────
//  MI RUTINA · datos del plan
//  Edita este archivo para cambiar ejercicios, series o alternativas.
//
//  Ejercicio:  n = nombre · g = grupo (color) · z = zonas que trabaja fuerte
//              s = zonas secundarias · d = descanso (s) · t = qué trabaja
//              p = pasos de cómo hacerlo · a = alternativas [id, series, reps]
//  Las alternativas que solo tienen n y p heredan el resto del ejercicio original.
// ─────────────────────────────────────────────────────────────

export const GRUPOS = {
  espalda:     { n: 'Espalda',        c: '#4C8DFF' },
  biceps:      { n: 'Bíceps',         c: '#A66CFF' },
  hombros:     { n: 'Hombros',        c: '#FF9F43' },
  triceps:     { n: 'Tríceps',        c: '#FF5C8A' },
  pecho:       { n: 'Pecho',          c: '#FF4D4D' },
  cuadriceps:  { n: 'Cuádriceps',     c: '#2ED47A' },
  femoral:     { n: 'Femoral/glúteo', c: '#00C2A8' },
  pantorrilla: { n: 'Pantorrilla',    c: '#7BD389' },
  core:        { n: 'Core',           c: '#FFD43B' },
  cardio:      { n: 'Cardio',         c: '#38BDF8' },
};

// Zona del mapa del cuerpo → grupo (define el color con que se ilumina)
export const ZONAS = {
  pecho: 'pecho', deltoides: 'hombros', deltoidesPost: 'hombros',
  biceps: 'biceps', antebrazo: 'biceps', triceps: 'triceps',
  abdomen: 'core', oblicuos: 'core',
  dorsal: 'espalda', trapecio: 'espalda', lumbar: 'espalda',
  gluteo: 'femoral', gluteoMedio: 'femoral', femoral: 'femoral',
  cuadriceps: 'cuadriceps', pantorrilla: 'pantorrilla',
};

export const EJERCICIOS = {
  // ── Espalda ────────────────────────────────────────────────
  'remo-barra': { n: 'Remo con barra', g: 'espalda', z: ['dorsal', 'trapecio'], s: ['biceps', 'deltoidesPost', 'lumbar'], d: 90,
    t: 'Grosor de la espalda: dorsales, trapecio medio y romboides. Ayudan el bíceps y el hombro posterior.',
    p: ['Inclínate a 45° con la espalda recta.', 'Jala la barra hacia el ombligo.', 'Aprieta los omóplatos arriba.', 'Baja controlado en 2 s.'],
    a: [['remo-mancuernas-pecho', 4, '10'], ['remo-maquina', 4, '10'], ['remo-polea-abierto', 4, '10-12']] },
  'remo-mancuernas-pecho': { n: 'Remo con mancuernas pecho apoyado', p: ['Pecho apoyado en el banco inclinado, lleva las mancuernas a la cadera sin despegar el pecho.'] },
  'remo-maquina': { n: 'Remo en máquina (T o Hammer)', p: ['Pecho contra el apoyo, jala con los codos hacia atrás y aprieta la espalda.'] },
  'remo-polea-abierto': { n: 'Remo en polea baja agarre abierto', p: ['Agarre ancho, torso fijo, jala a la parte baja del pecho abriendo los codos.'] },

  'jalon-ancho': { n: 'Jalón al pecho agarre ancho', g: 'espalda', z: ['dorsal'], s: ['biceps', 'trapecio', 'deltoidesPost'], d: 90,
    t: 'Amplitud de espalda: el dorsal ancho, el que hace la "V". Ayudan bíceps y romboides.',
    p: ['Saca el pecho y agarra la barra más ancho que los hombros.', 'Baja la barra al pecho alto.', 'Codos abajo y atrás.', 'Sube controlado, sin balanceo.'],
    a: [['dominadas-asistidas', 4, '6-10'], ['jalon-hammer', 4, '10-12'], ['jalon-un-brazo', 3, '12/brazo']] },
  'dominadas-asistidas': { n: 'Dominadas asistidas', p: ['En la máquina asistida, sube hasta pasar la barbilla y baja lento.'] },
  'jalon-hammer': { n: 'Jalón en máquina Hammer', p: ['Jala las agarraderas al pecho con los codos hacia abajo, sin echar el torso atrás.'] },
  'jalon-un-brazo': { n: 'Jalón a un brazo en polea', p: ['Un brazo a la vez, lleva el codo hacia la cadera y estira bien arriba.'] },

  'remo-polea-cerrado': { n: 'Remo en polea baja agarre cerrado', g: 'espalda', z: ['dorsal', 'trapecio'], s: ['biceps'], d: 90,
    t: 'Espalda media y baja: dorsales y romboides.',
    p: ['Torso fijo y espalda recta.', 'Jala el agarre hacia el abdomen.', 'Aprieta 1 s con los omóplatos juntos.', 'Regresa lento sin encorvarte.'],
    a: [['remo-maquina', 3, '12'], ['remo-una-mano', 3, '10/brazo']] },

  'remo-una-mano': { n: 'Remo a una mano', g: 'espalda', z: ['dorsal'], s: ['trapecio', 'biceps', 'deltoidesPost'], d: 90,
    t: 'El dorsal de cada lado por separado: corrige diferencias entre un lado y otro.',
    p: ['Rodilla y mano del mismo lado en el banco.', 'Espalda plana, mirada al piso.', 'Lleva la mancuerna a la cadera.', 'Baja estirando bien.'],
    a: [['remo-polea-un-brazo', 4, '12/brazo'], ['remo-mancuernas-pecho', 4, '10']] },
  'remo-polea-un-brazo': { n: 'Remo a un brazo en polea', p: ['Jala el agarre hacia la cadera girando un poco el torso, y estira bien al regresar.'] },

  'jalon-v': { n: 'Jalón cerrado en V', g: 'espalda', z: ['dorsal'], s: ['biceps', 'trapecio'], d: 90,
    t: 'Dorsal bajo y espalda media, con buen recorrido gracias al agarre cerrado.',
    p: ['Agarre en V, pecho afuera.', 'Lleva el agarre al pecho.', 'Codos pegados al cuerpo.', 'Sube lento hasta estirar.'],
    a: [['jalon-supino', 4, '10-12'], ['dominadas-supinas', 4, '6-10']] },
  'jalon-supino': { n: 'Jalón agarre supino', p: ['Palmas hacia ti, al ancho de los hombros; jala al pecho con los codos pegados.'] },
  'dominadas-supinas': { n: 'Dominadas supinas asistidas', p: ['Palmas hacia ti, sube con los codos pegados y baja controlado.'] },

  'jalon-brazos-rectos': { n: 'Jalón con brazos rectos', g: 'espalda', z: ['dorsal'], s: ['triceps', 'abdomen'], d: 60,
    t: 'Aísla el dorsal ancho sin que el bíceps ayude.',
    p: ['Frente a la polea alta, brazos casi estirados.', 'Baja la barra en arco hasta los muslos.', 'Aprieta el dorsal abajo.', 'Sube controlado.'],
    a: [['pullover-mancuerna', 3, '12'], ['pullover-cuerda', 3, '15']] },
  'pullover-mancuerna': { n: 'Pullover con mancuerna', p: ['Acostado en el banco, baja la mancuerna detrás de la cabeza con los brazos casi rectos y regresa sobre el pecho.'] },
  'pullover-cuerda': { n: 'Pullover con cuerda en polea', p: ['Cuerda en polea alta, baja en arco hasta los muslos con los brazos casi estirados.'] },

  'remo-supino': { n: 'Remo con barra supino', g: 'espalda', z: ['dorsal', 'trapecio'], s: ['biceps', 'lumbar'], d: 90,
    t: 'Dorsal bajo, con más trabajo de bíceps por el agarre palmas arriba.',
    p: ['Igual que el remo normal, pero con las palmas arriba.', 'Inclinado a 45°, espalda recta.', 'Barra al ombligo apretando los omóplatos.', 'Baja en 2 s.'],
    a: [['remo-polea-supino', 4, '10-12'], ['remo-mancuernas-supino', 4, '10']] },
  'remo-polea-supino': { n: 'Remo en polea baja agarre supino', p: ['Palmas arriba, torso fijo, jala al abdomen con los codos pegados.'] },
  'remo-mancuernas-supino': { n: 'Remo con mancuernas supino', p: ['Inclinado, palmas al frente, lleva las mancuernas a la cadera.'] },

  'remo-gironda': { n: 'Remo Gironda (polea baja)', g: 'espalda', z: ['dorsal', 'trapecio'], s: ['biceps', 'lumbar'], d: 90,
    t: 'Espalda media y dorsales, con un apretón fuerte al final.',
    p: ['Sentado con el agarre en V.', 'Pecho afuera todo el tiempo.', 'Lleva los codos bien atrás.', 'Regresa estirando sin encorvarte.'],
    a: [['remo-maquina', 3, '12'], ['remo-mancuernas-pecho', 3, '12']] },

  // ── Bíceps ─────────────────────────────────────────────────
  'curl-z': { n: 'Curl barra Z', g: 'biceps', z: ['biceps'], s: ['antebrazo'], d: 90,
    t: 'El bíceps completo. La barra Z cuida las muñecas.',
    p: ['De pie, codos pegados al cuerpo.', 'Sube sin impulso.', 'Aprieta arriba.', 'Baja en 2 s.'],
    a: [['curl-barra-recta', 4, '10'], ['curl-mancuernas', 4, '10'], ['curl-polea-baja', 4, '12']] },
  'curl-barra-recta': { n: 'Curl con barra recta', p: ['Agarre al ancho de los hombros, codos fijos, sube sin mover la espalda.'] },
  'curl-mancuernas': { n: 'Curl con mancuernas supino', p: ['Palmas al frente, sube las dos a la vez con los codos pegados.'] },
  'curl-polea-baja': { n: 'Curl en polea baja', p: ['Barra en polea baja, codos fijos; la polea mantiene la tensión todo el recorrido.'] },

  'curl-martillo': { n: 'Curl martillo alterno', g: 'biceps', z: ['biceps', 'antebrazo'], s: [], d: 60,
    t: 'Braquial y antebrazo: le dan grosor al brazo.',
    p: ['Palmas mirándose entre sí.', 'Sube una mancuerna a la vez.', 'Codos quietos.', 'Baja controlado y alterna.'],
    a: [['martillo-cuerda', 3, '12'], ['curl-inverso-z', 3, '12']] },
  'martillo-cuerda': { n: 'Martillo en polea con cuerda', p: ['Cuerda en polea baja, palmas mirándose, sube con los codos pegados.'] },
  'curl-inverso-z': { n: 'Curl inverso con barra Z', p: ['Palmas hacia abajo, codos fijos; trabaja fuerte el antebrazo.'] },

  'curl-predicador': { n: 'Curl predicador barra Z', g: 'biceps', z: ['biceps'], s: ['antebrazo'], d: 60,
    t: 'La parte baja del bíceps. Sin trampa, porque el brazo va apoyado.',
    p: ['Brazos pegados al cojín.', 'Sube apretando el bíceps.', 'Baja lento.', 'No estires de golpe abajo.'],
    a: [['predicador-maquina', 4, '12'], ['curl-arana', 3, '12'], ['curl-polea-detras', 3, '12/brazo']] },
  'predicador-maquina': { n: 'Curl predicador en máquina', p: ['Brazos apoyados, sube y baja controlado sin estirar de golpe.'] },
  'curl-arana': { n: 'Curl araña con mancuernas', p: ['Pecho apoyado en banco inclinado, brazos colgando; sube sin mover los codos.'] },
  'curl-polea-detras': { n: 'Curl en polea detrás del cuerpo', p: ['De espaldas a la polea, brazo un poco atrás; sube estirando bien el bíceps.'] },

  'curl-concentrado': { n: 'Curl concentrado', g: 'biceps', z: ['biceps'], s: [], d: 60,
    t: 'El pico del bíceps, con máxima concentración.',
    p: ['Sentado, codo en la cara interna del muslo.', 'Sube la mancuerna.', 'Aprieta 1 s arriba.', 'Baja lento.'],
    a: [['curl-polea-una-mano', 3, '12'], ['curl-arana', 3, '12']] },
  'curl-polea-una-mano': { n: 'Curl a una mano en polea', p: ['Agarre en polea baja, codo fijo, sube y aprieta arriba.'] },

  'curl-21': { n: '21s con barra Z', g: 'biceps', z: ['biceps'], s: ['antebrazo'], d: 90,
    t: 'El bíceps en todo su recorrido. Quema, y bastante.',
    p: ['7 reps de abajo a la mitad.', '7 reps de la mitad a arriba.', '7 reps completas.', 'Todo seguido, sin soltar la barra.'],
    a: [['drag-curl', 3, '10'], ['curl-polea-barra', 3, '15']] },
  'drag-curl': { n: 'Drag curl con barra Z', p: ['Sube la barra rozando el cuerpo y llevando los codos hacia atrás.'] },
  'curl-polea-barra': { n: 'Curl en polea con barra', p: ['Barra en polea baja, codos fijos, sube y baja controlado.'] },

  'martillo-sentado': { n: 'Martillo sentado', g: 'biceps', z: ['biceps', 'antebrazo'], s: [], d: 60,
    t: 'Braquial y antebrazo, sin impulso del cuerpo.',
    p: ['Sentado, espalda recta.', 'Palmas mirándose.', 'Sube sin impulso.', 'Baja en 2 s.'],
    a: [['martillo-cuerda', 3, '12'], ['curl-inverso-z', 3, '12']] },

  // ── Piernas: cuádriceps ────────────────────────────────────
  'sentadilla': { n: 'Sentadilla libre o Smith', g: 'cuadriceps', z: ['cuadriceps', 'gluteo'], s: ['femoral', 'lumbar', 'abdomen'], d: 120,
    t: 'La reina de las piernas: cuádriceps y glúteo, con el core sosteniendo todo.',
    p: ['Pies al ancho de los hombros.', 'Pecho arriba.', 'Baja hasta paralelo.', 'Rodillas en línea con los pies, sin irse hacia adentro.'],
    a: [['sentadilla-goblet', 4, '10-12'], ['sentadilla-hack', 4, '10'], ['sentadilla-smith-adelantados', 4, '10'], ['prensa', 4, '10-12']] },
  'prensa': { n: 'Prensa de piernas', p: ['Espalda y cadera pegadas al respaldo, baja hasta 90° y empuja con todo el pie sin bloquear las rodillas.'] },
  'sentadilla-goblet': { n: 'Sentadilla goblet', p: ['Mancuerna pegada al pecho, baja con el torso recto entre las rodillas.'] },
  'sentadilla-hack': { n: 'Sentadilla hack en máquina', p: ['Espalda pegada al respaldo, baja a 90° y sube empujando con todo el pie.'] },
  'sentadilla-smith-adelantados': { n: 'Sentadilla en Smith pies adelantados', p: ['Pies un paso delante de la barra; carga más el cuádriceps.'] },

  'zancadas-caminando': { n: 'Zancadas caminando con peso', g: 'cuadriceps', z: ['cuadriceps', 'gluteo'], s: ['femoral'], d: 90,
    t: 'Cuádriceps y glúteo de cada pierna, más equilibrio.',
    p: ['Una mancuerna en cada mano.', 'Pasos largos.', 'La rodilla de atrás casi toca el piso.', 'Torso recto.'],
    a: [['step-up', 3, '10/pierna'], ['bulgara', 3, '10/pierna'], ['zancada-reversa', 3, '10/pierna']] },
  'step-up': { n: 'Step-up al banco', p: ['Sube al banco empujando con la pierna de arriba, sin impulsarte con la de abajo.'] },
  'zancada-reversa': { n: 'Zancada reversa', p: ['Paso largo hacia atrás, baja la rodilla y regresa empujando con la pierna de adelante.'] },

  'extensiones': { n: 'Extensiones de cuádriceps', g: 'cuadriceps', z: ['cuadriceps'], s: [], d: 60,
    t: 'Aísla el cuádriceps, sobre todo cerca de la rodilla.',
    p: ['Espalda pegada al respaldo.', 'Extiende las piernas completas.', 'Aprieta 1 s arriba.', 'Baja lento.'],
    a: [['goblet-talones', 3, '15'], ['sissy', 3, '12']] },
  'goblet-talones': { n: 'Sentadilla goblet con talones elevados', p: ['Talones sobre un disco, baja profundo con el torso recto.'] },
  'sissy': { n: 'Sissy squat asistida', p: ['Agarrado de un soporte, inclínate atrás llevando las rodillas al frente.'] },

  'desplantes': { n: 'Desplantes', g: 'cuadriceps', z: ['cuadriceps', 'gluteo'], s: ['femoral'], d: 90,
    t: 'Cuádriceps y glúteo, con estabilidad.',
    p: ['En el sitio, paso al frente.', 'La rodilla de atrás casi al piso.', 'Regresa al inicio.', 'Alterna piernas.'],
    a: [['zancada-reversa', 3, '10/pierna'], ['step-up', 3, '10/pierna']] },

  // ── Femoral / glúteo ───────────────────────────────────────
  'femoral-acostado': { n: 'Femoral acostado', g: 'femoral', z: ['femoral'], s: ['pantorrilla'], d: 60,
    t: 'Isquiotibiales: la parte de atrás del muslo.',
    p: ['Boca abajo en la máquina.', 'Cadera pegada al banco.', 'Talones hacia el glúteo.', 'Baja lento.'],
    a: [['femoral-sentado', 3, '12'], ['femoral-fitball', 3, '12']] },
  'femoral-sentado': { n: 'Curl femoral sentado', p: ['Muslos fijos bajo el rodillo, lleva los talones hacia abajo y atrás.'] },
  'femoral-fitball': { n: 'Curl femoral con fitball', p: ['Boca arriba, talones en la pelota, sube la cadera y trae la pelota hacia ti.'] },

  'femoral-pie': { n: 'Femoral de pie', g: 'femoral', z: ['femoral'], s: [], d: 60,
    t: 'El femoral de cada pierna por separado.',
    p: ['A una pierna, en máquina o polea.', 'Cadera quieta.', 'Talón hacia el glúteo.', 'Baja controlado.'],
    a: [['femoral-acostado', 3, '12'], ['femoral-fitball', 3, '12']] },

  'rumano-mancuernas': { n: 'Peso muerto rumano con mancuernas', g: 'femoral', z: ['femoral', 'gluteo'], s: ['lumbar'], d: 120,
    t: 'Femoral y glúteo, con la espalda baja estabilizando.',
    p: ['Rodillas un poco flexionadas.', 'Cadera hacia atrás.', 'Mancuernas pegadas a las piernas.', 'Espalda recta todo el tiempo.'],
    a: [['rumano-barra', 4, '10'], ['hiperextensiones', 3, '15'], ['buenos-dias', 3, '12']] },
  'rumano-barra': { n: 'Peso muerto rumano con barra', p: ['Barra pegada a las piernas, cadera atrás y espalda recta hasta sentir el femoral.'] },
  'hiperextensiones': { n: 'Hiperextensiones', p: ['En el banco romano, baja el torso y sube hasta quedar en línea apretando el glúteo.'] },
  'buenos-dias': { n: 'Buenos días con barra', p: ['Barra en la espalda, rodillas suaves, inclina el torso llevando la cadera atrás.'] },

  'bulgara': { n: 'Sentadilla búlgara', g: 'femoral', z: ['gluteo', 'cuadriceps'], s: ['femoral'], d: 90,
    t: 'Glúteo y cuádriceps, una pierna a la vez.',
    p: ['Pie de atrás apoyado en el banco.', 'Baja en vertical.', 'Rodilla de adelante en línea con el pie.', 'Sube empujando con el talón.'],
    a: [['zancada-reversa', 3, '10/pierna'], ['step-up', 3, '10/pierna']] },

  'curl-femoral-maquina': { n: 'Curl femoral en máquina', g: 'femoral', z: ['femoral'], s: ['pantorrilla'], d: 60,
    t: 'Femoral aislado.',
    p: ['Rodillo sobre los tobillos.', 'Movimiento controlado.', 'Aprieta arriba.', 'Baja lento.'],
    a: [['femoral-acostado', 4, '12'], ['nordico', 3, '6-8']] },
  'nordico': { n: 'Nórdico asistido', p: ['De rodillas con los tobillos sujetos, baja el torso al frente lo más lento que puedas.'] },

  'hip-thrust': { n: 'Hip thrust', g: 'femoral', z: ['gluteo'], s: ['femoral'], d: 90,
    t: 'El mejor ejercicio para el glúteo.',
    p: ['Espalda alta en el banco.', 'Barra sobre la cadera.', 'Sube hasta quedar en línea recta.', 'Aprieta el glúteo 1 s.'],
    a: [['hip-thrust-smith', 3, '12'], ['puente-mancuerna', 3, '15'], ['patada-gluteo-polea', 3, '15/pierna']] },
  'hip-thrust-smith': { n: 'Hip thrust en Smith', p: ['Igual que el hip thrust, con la barra guiada de la Smith.'] },
  'puente-mancuerna': { n: 'Puente de glúteo con mancuerna', p: ['Acostado en el piso, mancuerna en la cadera, sube apretando el glúteo.'] },
  'patada-gluteo-polea': { n: 'Patada de glúteo en polea', p: ['Tobillera en polea baja, lleva la pierna atrás apretando el glúteo.'] },

  'abductor': { n: 'Abductor', g: 'femoral', z: ['gluteoMedio'], s: ['gluteo'], d: 60,
    t: 'Glúteo medio: el lado de la cadera.',
    p: ['Sentado en la máquina, espalda pegada.', 'Abre las piernas controlado.', 'Aprieta afuera 1 s.', 'Cierra lento.'],
    a: [['abduccion-polea', 3, '15/pierna'], ['caminata-banda', 3, '15 pasos/lado']] },
  'abduccion-polea': { n: 'Abducción en polea', p: ['Tobillera en polea baja, lleva la pierna hacia afuera sin inclinar el torso.'] },
  'caminata-banda': { n: 'Caminata lateral con banda', p: ['Banda sobre las rodillas, semi-sentadilla, pasos laterales sin juntar los pies.'] },

  'elevacion-pelvis': { n: 'Elevación de pelvis', g: 'femoral', z: ['gluteo'], s: ['femoral'], d: 60,
    t: 'Glúteo, sin máquina.',
    p: ['Acostado en el piso, rodillas flexionadas.', 'Sube la cadera.', 'Aprieta el glúteo arriba.', 'Baja lento.'],
    a: [['puente-una-pierna', 3, '12/pierna'], ['abductor', 3, '20']] },
  'puente-una-pierna': { n: 'Puente de glúteo a una pierna', p: ['Igual que el puente, con una pierna estirada en el aire.'] },

  // ── Pantorrilla ────────────────────────────────────────────
  'pantorrilla-pie': { n: 'Pantorrilla de pie', g: 'pantorrilla', z: ['pantorrilla'], s: [], d: 60,
    t: 'Gemelos, desde tres ángulos.',
    p: ['Pies cerrados, luego rectos, luego abiertos, en la misma serie.', 'Sube lo más alto que puedas.', 'Pausa 1 s arriba.', 'Baja hasta estirar.'],
    a: [['pantorrilla-smith', 4, '15'], ['pantorrilla-una-pierna', 3, '12/pierna']] },
  'pantorrilla-smith': { n: 'Pantorrilla en Smith', p: ['Puntas sobre un disco, sube lo más alto posible y baja estirando.'] },
  'pantorrilla-una-pierna': { n: 'Pantorrilla a una pierna con mancuerna', p: ['Apoyado en la pared, sube en una pierna con la mancuerna del mismo lado.'] },

  'pantorrilla-sentado': { n: 'Pantorrilla sentado', g: 'pantorrilla', z: ['pantorrilla'], s: [], d: 60,
    t: 'Sóleo: la parte baja de la pantorrilla.',
    p: ['Rodillas bajo el apoyo.', 'Recorrido completo.', 'Sube lo más alto posible.', 'Baja hasta estirar.'],
    a: [['pantorrilla-sentado-mancuerna', 4, '15'], ['pantorrilla-pie', 4, '15']] },
  'pantorrilla-sentado-mancuerna': { n: 'Pantorrilla sentado con mancuerna', p: ['Mancuerna sobre las rodillas, puntas en un disco, sube y baja completo.'] },

  // ── Hombros ────────────────────────────────────────────────
  'militar-mancuernas': { n: 'Press militar mancuernas sentado', g: 'hombros', z: ['deltoides'], s: ['triceps', 'trapecio'], d: 90,
    t: 'Hombro completo, sobre todo el frente y el lateral.',
    p: ['Sentado, respaldo vertical.', 'Mancuernas a la altura de las orejas.', 'Empuja hacia arriba.', 'Sin arquear la espalda baja.'],
    a: [['militar-hammer', 4, '10'], ['press-arnold', 4, '10'], ['militar-barra', 4, '8']] },
  'militar-hammer': { n: 'Press militar Hammer', g: 'hombros', z: ['deltoides'], s: ['triceps'], d: 90,
    t: 'Hombro frontal y lateral, con la estabilidad de la máquina.',
    p: ['Agarres a la altura de los hombros.', 'Empuja sin bloquear los codos.', 'Baja controlado.', 'Espalda pegada al respaldo.'],
    a: [['militar-mancuernas', 4, '10'], ['press-arnold', 4, '10']] },
  'press-arnold': { n: 'Press Arnold', p: ['Empieza con las palmas hacia ti y gíralas al frente mientras empujas hacia arriba.'] },
  'militar-barra': { n: 'Press militar con barra de pie', p: ['Barra a la altura de la clavícula, glúteo y abdomen apretados, empuja arriba.'] },

  'laterales': { n: 'Laterales sentado', g: 'hombros', z: ['deltoides'], s: ['trapecio'], d: 60,
    t: 'Deltoides lateral: los hombros más anchos.',
    p: ['Sentado, mancuernas a los lados.', 'Codos un poco flexionados.', 'Sube hasta la altura del hombro.', 'Baja lento.'],
    a: [['laterales-polea', 4, '12/lado'], ['laterales-maquina', 4, '15']] },
  'laterales-polea': { n: 'Laterales en polea', p: ['Polea baja cruzada por delante del cuerpo, sube el brazo hasta el hombro.'] },
  'laterales-maquina': { n: 'Laterales en máquina', p: ['Codos en los cojines, sube hasta la altura de los hombros y baja lento.'] },

  'posterior-maquina': { n: 'Posterior en máquina', g: 'hombros', z: ['deltoidesPost'], s: ['trapecio'], d: 60,
    t: 'Hombro posterior: mejor postura y hombros menos redondos.',
    p: ['Pecho contra el respaldo.', 'Lleva los brazos hacia atrás.', 'Aprieta 1 s.', 'Regresa controlado.'],
    a: [['pajaro', 3, '15'], ['face-pull', 3, '15'], ['posterior-polea', 3, '15']] },
  'pajaro': { n: 'Vuelo de pájaro con mancuernas', p: ['Inclinado al frente, abre los brazos a los lados con los codos un poco flexionados.'] },
  'posterior-polea': { n: 'Posterior en polea cruzada', p: ['Cables cruzados a la altura del pecho, abre los brazos hacia atrás.'] },

  'face-pull': { n: 'Face pull en polea alta', g: 'hombros', z: ['deltoidesPost'], s: ['trapecio'], d: 60,
    t: 'Hombro posterior y manguito rotador: hombros sanos.',
    p: ['Cuerda en polea alta.', 'Jálala hacia la cara.', 'Manos hacia los lados.', 'Aprieta y regresa lento.'],
    a: [['pajaro', 3, '15'], ['posterior-maquina', 3, '15']] },

  // ── Pecho ──────────────────────────────────────────────────
  'inclinado-mancuernas': { n: 'Press inclinado mancuernas', g: 'pecho', z: ['pecho'], s: ['deltoides', 'triceps'], d: 90,
    t: 'Pecho superior, con ayuda del hombro frontal y el tríceps.',
    p: ['Banco a 30°.', 'Baja a los lados del pecho.', 'Empuja arriba juntándolas.', 'Omóplatos apretados al banco.'],
    a: [['inclinado-barra', 3, '8'], ['inclinado-maquina', 3, '10'], ['cruces-abajo', 3, '12']] },
  'inclinado-barra': { n: 'Press inclinado con barra', p: ['Banco a 30°, baja la barra al pecho alto y empuja.'] },
  'inclinado-maquina': { n: 'Press inclinado en máquina', p: ['Agarres a la altura del pecho alto, empuja sin despegar la espalda.'] },
  'cruces-abajo': { n: 'Cruces de polea desde abajo', p: ['Poleas bajas, sube las manos en arco hasta juntarlas frente al pecho.'] },

  'press-plano-barra': { n: 'Press plano con barra', g: 'pecho', z: ['pecho'], s: ['deltoides', 'triceps'], d: 90,
    t: 'El pecho completo: el básico de empuje.',
    p: ['Omóplatos juntos.', 'Baja la barra al pecho medio.', 'Empuja hacia arriba.', 'Pies firmes en el piso.'],
    a: [['press-plano-mancuernas', 3, '10'], ['press-pecho-maquina', 3, '12'], ['flexiones', 3, 'al fallo']] },
  'press-plano-mancuernas': { n: 'Press plano con mancuernas', p: ['Baja las mancuernas a los lados del pecho y empuja juntándolas.'] },
  'press-pecho-maquina': { n: 'Press de pecho en máquina', p: ['Agarres a la altura del pecho medio, empuja sin bloquear los codos.'] },
  'flexiones': { n: 'Flexiones', p: ['Cuerpo recto como una tabla, baja el pecho casi al piso y empuja.'] },

  // ── Tríceps ────────────────────────────────────────────────
  'frances-z': { n: 'Press francés barra Z', g: 'triceps', z: ['triceps'], s: [], d: 90,
    t: 'Tríceps, sobre todo la cabeza larga: la que da volumen.',
    p: ['Acostado, brazos estirados arriba.', 'Baja la barra a la frente.', 'Solo se mueven los codos.', 'Extiende completo.'],
    a: [['frances-mancuernas', 3, '12'], ['triceps-sobre-cabeza', 3, '12']] },
  'frances-mancuernas': { n: 'Press francés con mancuernas', p: ['Acostado, baja las mancuernas a los lados de la cabeza moviendo solo los codos.'] },
  'triceps-sobre-cabeza': { n: 'Extensión sobre la cabeza en polea', p: ['De espaldas a la polea, codos junto a la cabeza, extiende al frente.'] },

  'triceps-polea': { n: 'Extensión de tríceps en polea alta', g: 'triceps', z: ['triceps'], s: [], d: 60,
    t: 'Tríceps completo, con tensión constante.',
    p: ['Frente a la polea alta.', 'Codos pegados.', 'Extiende completo hacia abajo.', 'Sube controlado.'],
    a: [['triceps-cuerda', 3, '12'], ['fondos-maquina', 3, '12']] },
  'triceps-cuerda': { n: 'Extensión con cuerda', p: ['Codos pegados, extiende hacia abajo y abre la cuerda al final.'] },
  'fondos-maquina': { n: 'Fondos de tríceps en máquina', p: ['Torso recto, empuja hacia abajo hasta estirar los brazos.'] },

  'triceps-predicador': { n: 'Tríceps en banco predicador', g: 'triceps', z: ['triceps'], s: [], d: 60,
    t: 'Tríceps aislado, con el brazo apoyado.',
    p: ['Brazo apoyado en el banco.', 'Extiende completo.', 'Codo quieto.', 'Regresa lento.'],
    a: [['triceps-un-brazo-polea', 3, '12/brazo'], ['frances-una-mancuerna', 3, '12']] },
  'triceps-un-brazo-polea': { n: 'Extensión a una mano en polea', p: ['Un brazo a la vez, codo pegado, extiende completo hacia abajo.'] },
  'frances-una-mancuerna': { n: 'Press francés con mancuerna', p: ['Una mancuerna con las dos manos detrás de la cabeza, extiende hacia arriba.'] },

  'patada-triceps-polea': { n: 'Patada de tríceps en polea', g: 'triceps', z: ['triceps'], s: [], d: 60,
    t: 'Cabeza lateral del tríceps.',
    p: ['Inclinado al frente.', 'Codo pegado al cuerpo.', 'Extiende hacia atrás.', 'Aprieta y regresa.'],
    a: [['patada-mancuerna', 3, '12/brazo'], ['triceps-cuerda', 3, '15']] },
  'patada-mancuerna': { n: 'Patada con mancuerna', p: ['Apoyado en el banco, codo fijo junto al torso, extiende hacia atrás.'] },

  // ── Core ───────────────────────────────────────────────────
  'crunch-maquina': { n: 'Crunch en máquina', g: 'core', z: ['abdomen'], s: [], d: 60,
    t: 'Recto abdominal: los "cuadritos".',
    p: ['Ajusta la máquina a tu altura.', 'Enróllate llevando el pecho a la cadera.', 'Lento, sin impulso.', 'Regresa controlado.'],
    a: [['crunch-polea', 3, '15'], ['crunch-piso', 3, '20']] },
  'crunch-polea': { n: 'Crunch en polea arrodillado', p: ['Arrodillado, cuerda junto a la cabeza, enróllate llevando los codos a los muslos.'] },
  'crunch-piso': { n: 'Crunch en el piso', p: ['Rodillas flexionadas, sube los hombros del piso apretando el abdomen.'] },

  'elevacion-piernas': { n: 'Elevación de piernas', g: 'core', z: ['abdomen'], s: ['oblicuos'], d: 60,
    t: 'Abdomen bajo.',
    p: ['Piernas juntas.', 'Súbelas sin balancearte.', 'Baja lento sin tocar el piso.', 'Espalda baja pegada.'],
    a: [['elevacion-colgado', 3, '12'], ['rodillas-paralelas', 3, '15']] },
  'elevacion-colgado': { n: 'Elevación colgado', p: ['Colgado de la barra, sube las piernas sin balancearte.'] },
  'rodillas-paralelas': { n: 'Rodillas al pecho en paralelas', p: ['Apoyado en las paralelas, sube las rodillas al pecho y baja lento.'] },

  'crunch-lateral': { n: 'Crunch lateral', g: 'core', z: ['oblicuos'], s: ['abdomen'], d: 60,
    t: 'Oblicuos: los lados del abdomen.',
    p: ['De lado o en el banco.', 'Sube el torso hacia un lado.', 'Lento, sin impulso.', 'Termina un lado y cambia.'],
    a: [['russian-twist', 3, '20'], ['plancha-lateral', 3, '30 s/lado']] },
  'russian-twist': { n: 'Russian twist', p: ['Sentado con el torso inclinado, gira de lado a lado con un peso.'] },
  'plancha-lateral': { n: 'Plancha lateral', p: ['Apoyado en un antebrazo, cuerpo en línea recta, cadera arriba.'] },

  'plancha': { n: 'Plancha', g: 'core', z: ['abdomen', 'oblicuos'], s: ['gluteo', 'deltoides'], d: 60,
    t: 'Core completo: la estabilidad que sostiene todo lo demás.',
    p: ['Antebrazos en el piso.', 'Cuerpo recto de la cabeza a los talones.', 'Abdomen y glúteo apretados.', 'Respira normal.'],
    a: [['plancha-toque', 3, '20'], ['dead-bug', 3, '12/lado']] },
  'plancha-toque': { n: 'Plancha con toque de hombros', p: ['En plancha alta, toca un hombro con la mano contraria sin mover la cadera.'] },
  'dead-bug': { n: 'Dead bug', p: ['Boca arriba, estira brazo y pierna contrarios sin despegar la espalda baja.'] },
};

// ── Pesos para empezar ───────────────────────────────────────
// Pensados para Carlos: 19 años, 60 kg, mesomorfo y un año sin entrenar (con algo más de fuerza en pierna). Son conservadores a propósito:
// la semana 1 te deben sobrar 2-3 repeticiones. Si te sobran más, súbele 5 lbs en la serie siguiente.
// [lbs, tipo]: c/u = en cada mano · barra = barra incluida · maq = en la máquina o polea ·
// asist = asistencia de la máquina (más asistencia = más fácil) · discos = sin contar el carro · corp = peso corporal · banda
export const TIPO_PESO = {
  'c/u': 'en cada mano', barra: 'con la barra incluida', maq: 'en la máquina', asist: 'de asistencia',
  discos: 'en discos, sin contar el carro', corp: 'tu peso corporal', banda: 'banda ligera', una: 'con una mancuerna',
};
// Qué barra usa cada ejercicio con barra (las demás, olímpica de 45 lbs / 20 kg)
export const BARRA = {
  'curl-z': 'z', 'curl-barra-recta': 'z', 'curl-inverso-z': 'z', 'curl-predicador': 'z', 'curl-21': 'z', 'drag-curl': 'z', 'frances-z': 'z',
  'sentadilla-smith-adelantados': 'smith', 'hip-thrust-smith': 'smith', 'pantorrilla-smith': 'smith',
};
export const INICIO = {
  // Espalda
  'remo-barra': [65, 'barra'], 'remo-mancuernas-pecho': [20, 'c/u'], 'remo-maquina': [50, 'maq'], 'remo-polea-abierto': [50, 'maq'],
  'jalon-ancho': [60, 'maq'], 'dominadas-asistidas': [60, 'asist'], 'jalon-hammer': [50, 'maq'], 'jalon-un-brazo': [25, 'maq'],
  'remo-polea-cerrado': [60, 'maq'], 'remo-una-mano': [25, 'una'], 'remo-polea-un-brazo': [25, 'maq'],
  'jalon-v': [60, 'maq'], 'jalon-supino': [55, 'maq'], 'dominadas-supinas': [60, 'asist'],
  'jalon-brazos-rectos': [30, 'maq'], 'pullover-mancuerna': [20, 'una'], 'pullover-cuerda': [30, 'maq'],
  'remo-supino': [65, 'barra'], 'remo-polea-supino': [55, 'maq'], 'remo-mancuernas-supino': [20, 'c/u'], 'remo-gironda': [55, 'maq'],
  // Bíceps
  'curl-z': [35, 'barra'], 'curl-barra-recta': [35, 'barra'], 'curl-mancuernas': [15, 'c/u'], 'curl-polea-baja': [30, 'maq'],
  'curl-martillo': [15, 'c/u'], 'martillo-cuerda': [30, 'maq'], 'curl-inverso-z': [25, 'barra'],
  'curl-predicador': [25, 'barra'], 'predicador-maquina': [30, 'maq'], 'curl-arana': [10, 'c/u'], 'curl-polea-detras': [15, 'maq'],
  'curl-concentrado': [15, 'una'], 'curl-polea-una-mano': [15, 'maq'], 'curl-21': [25, 'barra'], 'drag-curl': [30, 'barra'],
  'curl-polea-barra': [30, 'maq'], 'martillo-sentado': [15, 'c/u'],
  // Cuádriceps
  'sentadilla': [75, 'barra'], 'prensa': [90, 'discos'], 'sentadilla-goblet': [30, 'una'], 'sentadilla-hack': [70, 'discos'], 'sentadilla-smith-adelantados': [65, 'barra'],
  'zancadas-caminando': [20, 'c/u'], 'step-up': [15, 'c/u'], 'zancada-reversa': [15, 'c/u'], 'extensiones': [60, 'maq'],
  'goblet-talones': [25, 'una'], 'sissy': [0, 'corp'], 'desplantes': [15, 'c/u'],
  // Femoral y glúteo
  'femoral-acostado': [45, 'maq'], 'femoral-sentado': [60, 'maq'], 'femoral-fitball': [0, 'corp'], 'femoral-pie': [25, 'maq'],
  'rumano-mancuernas': [30, 'c/u'], 'rumano-barra': [85, 'barra'], 'hiperextensiones': [0, 'corp'], 'buenos-dias': [55, 'barra'],
  'bulgara': [15, 'c/u'], 'curl-femoral-maquina': [60, 'maq'], 'nordico': [0, 'corp'],
  'hip-thrust': [115, 'barra'], 'hip-thrust-smith': [95, 'barra'], 'puente-mancuerna': [45, 'una'], 'patada-gluteo-polea': [15, 'maq'],
  'abductor': [80, 'maq'], 'abduccion-polea': [10, 'maq'], 'caminata-banda': [0, 'banda'], 'elevacion-pelvis': [0, 'corp'], 'puente-una-pierna': [0, 'corp'],
  // Pantorrilla
  'pantorrilla-pie': [90, 'maq'], 'pantorrilla-smith': [85, 'barra'], 'pantorrilla-una-pierna': [15, 'una'],
  'pantorrilla-sentado': [60, 'discos'], 'pantorrilla-sentado-mancuerna': [45, 'una'],
  // Hombros
  'militar-mancuernas': [20, 'c/u'], 'militar-hammer': [40, 'maq'], 'press-arnold': [15, 'c/u'], 'militar-barra': [45, 'barra'],
  'laterales': [10, 'c/u'], 'laterales-polea': [10, 'maq'], 'laterales-maquina': [30, 'maq'],
  'posterior-maquina': [40, 'maq'], 'pajaro': [10, 'c/u'], 'posterior-polea': [10, 'maq'], 'face-pull': [30, 'maq'],
  // Pecho
  'inclinado-mancuernas': [25, 'c/u'], 'inclinado-barra': [65, 'barra'], 'inclinado-maquina': [50, 'maq'], 'cruces-abajo': [15, 'maq'],
  'press-plano-barra': [75, 'barra'], 'press-plano-mancuernas': [30, 'c/u'], 'press-pecho-maquina': [60, 'maq'], 'flexiones': [0, 'corp'],
  // Tríceps
  'frances-z': [30, 'barra'], 'frances-mancuernas': [15, 'c/u'], 'triceps-sobre-cabeza': [30, 'maq'], 'triceps-polea': [40, 'maq'],
  'triceps-cuerda': [35, 'maq'], 'fondos-maquina': [60, 'maq'], 'triceps-predicador': [15, 'una'], 'triceps-un-brazo-polea': [15, 'maq'],
  'frances-una-mancuerna': [25, 'una'], 'patada-triceps-polea': [15, 'maq'], 'patada-mancuerna': [10, 'una'],
  // Core
  'crunch-maquina': [40, 'maq'], 'crunch-polea': [40, 'maq'], 'crunch-piso': [0, 'corp'], 'elevacion-piernas': [0, 'corp'],
  'elevacion-colgado': [0, 'corp'], 'rodillas-paralelas': [0, 'corp'], 'crunch-lateral': [0, 'corp'], 'russian-twist': [10, 'una'],
  'plancha-lateral': [0, 'corp'], 'plancha': [0, 'corp'], 'plancha-toque': [0, 'corp'], 'dead-bug': [0, 'corp'],
};

// ── Calentamiento antes de la rutina (~10 min) ───────────────
// id = video en js/poses.js; z = músculos que se encienden en el video
export const CALENTAMIENTO = {
  general: { n: 'Cardio suave', d: '5 min en bici, elíptica o caminadora' },
  superior: [
    { id: 'cal-brazos', n: 'Círculos de brazos', d: '10 adelante y 10 atrás', z: ['deltoides'] },
    { id: 'cal-pullapart', n: 'Pull-apart con banda', d: '2 × 15', z: ['deltoidesPost', 'trapecio'] },
    { id: 'cal-torso', n: 'Rotaciones de torso', d: '10 por lado', z: ['oblicuos'] },
  ],
  piernas: [
    { id: 'cal-balanceo', n: 'Balanceos de pierna', d: '10 por pierna', z: ['gluteo', 'femoral'] },
    { id: 'cal-sentadilla', n: 'Sentadilla sin peso', d: '15 lentas', z: ['cuadriceps', 'gluteo'] },
    { id: 'elevacion-pelvis', n: 'Puente de glúteo', d: '12', z: ['gluteo'] },
    { id: 'cal-tobillo', n: 'Movilidad de tobillo en la pared', d: '10 por pie', z: ['pantorrilla'] },
  ],
};

// ── Plan semanal ─────────────────────────────────────────────
// Cada ejercicio del día: [id, series, reps, nota opcional]
const VIERNES_A = [
  ['rumano-mancuernas', 4, '10-12'], ['bulgara', 3, '10/pierna'], ['curl-femoral-maquina', 4, '12-15'],
  ['hip-thrust', 3, '12'], ['abductor', 3, '20'], ['pantorrilla-sentado', 4, '15-20'],
];

export const PLAN = {
  A: {
    lun: { t: 'Espalda + bíceps', sub: 'Grosor', e: [
      ['remo-barra', 4, '8-10'], ['jalon-ancho', 4, '10-12'], ['remo-polea-cerrado', 3, '12'],
      ['curl-z', 4, '10'], ['curl-martillo', 3, '12']] },
    mar: { t: 'Piernas', sub: 'Cuádriceps', e: [
      ['sentadilla', 4, '8-10'], ['zancadas-caminando', 3, '12/pierna'], ['extensiones', 4, '15'],
      ['femoral-acostado', 3, '12'], ['pantorrilla-pie', 4, '10+10+10', '3 posiciones']] },
    mie: { t: 'Hombros + tríceps', sub: 'Pecho y abdomen', e: [
      ['militar-mancuernas', 4, '10'], ['laterales', 4, '15'], ['posterior-maquina', 3, '15'],
      ['inclinado-mancuernas', 3, '10'], ['frances-z', 3, '10-12'], ['triceps-polea', 3, '12'],
      ['crunch-maquina', 3, '20'], ['elevacion-piernas', 3, '15']] },
    jue: { t: 'Espalda + bíceps', sub: 'Amplitud', e: [
      ['remo-una-mano', 4, '10/brazo'], ['jalon-v', 4, '10-12'], ['jalon-brazos-rectos', 3, '12-15'],
      ['curl-predicador', 4, '10-12'], ['curl-concentrado', 3, '12']] },
    vie: { t: 'Piernas', sub: 'Femoral + glúteo', e: VIERNES_A },
  },
  B: {
    lun: { t: 'Espalda + bíceps', sub: 'Grosor', e: [
      ['remo-supino', 4, '10'], ['jalon-ancho', 4, '10-12'], ['remo-una-mano', 3, '10/brazo'],
      ['curl-z', 4, '10'], ['curl-21', 3, '7+7+7']] },
    mar: { t: 'Piernas', sub: 'Cuádriceps', e: [
      ['sentadilla', 4, '8-10'], ['desplantes', 3, '10/pierna'], ['extensiones', 4, '15'],
      ['femoral-pie', 3, '12/pierna'], ['pantorrilla-pie', 4, '15-20']] },
    mie: { t: 'Hombros + tríceps', sub: 'Pecho y abdomen', e: [
      ['militar-hammer', 4, '10'], ['laterales', 4, '15'], ['face-pull', 3, '15'],
      ['press-plano-barra', 3, '10'], ['triceps-predicador', 3, '12'], ['patada-triceps-polea', 3, '15'],
      ['crunch-lateral', 3, '20/lado'], ['plancha', 3, '45 s']] },
    jue: { t: 'Espalda + bíceps', sub: 'Amplitud', e: [
      ['remo-barra', 4, '8-10'], ['jalon-v', 4, '12'], ['remo-gironda', 3, '12'],
      ['curl-predicador', 3, '12'], ['martillo-sentado', 3, '10']] },
    vie: { t: 'Piernas', sub: 'Femoral + glúteo', e: VIERNES_A.map(x => x[0] === 'abductor' ? ['elevacion-pelvis', 3, '20'] : x) },
  },
};

// ── Sábado: trote y afloje ───────────────────────────────────
const fase = (n, min, tipo) => ({ n, s: min * 60, tipo });
const repetir = (veces, ...fases) => Array.from({ length: veces }, (_, i) => fases.map(f => ({ ...f, ronda: i + 1, de: veces }))).flat();

export const TROTE = {
  1: { resumen: '5×(3 min trote suave / 2 min caminando)', fases: [
    fase('Caminata rápida', 5, 'calentar'), ...repetir(5, fase('Trota suave', 3, 'trote'), fase('Camina', 2, 'camina')), fase('Caminata lenta', 5, 'enfriar')] },
  2: { resumen: '5×(4 min trote / 1 min caminando)', fases: [
    fase('Caminata', 5, 'calentar'), ...repetir(5, fase('Trota', 4, 'trote'), fase('Camina', 1, 'camina')), fase('Enfría caminando', 5, 'enfriar')] },
  3: { resumen: '30 min de trote suave seguido', fases: [
    fase('Caminata', 5, 'calentar'), fase('Trote suave seguido', 30, 'trote'), fase('Enfría caminando', 5, 'enfriar')] },
  4: { resumen: '40 min de trote suave seguido', fases: [
    fase('Caminata', 5, 'calentar'), fase('Trote suave seguido', 40, 'trote'), fase('Enfría caminando', 5, 'enfriar')] },
};

export const FASES = {
  calentar: { n: 'Calienta', c: '#FFD43B' },
  trote:    { n: 'Trota',    c: '#FF6B4A' },
  camina:   { n: 'Camina',   c: '#38BDF8' },
  enfriar:  { n: 'Enfría',   c: '#A66CFF' },
};

export const SABADO = [
  { id: 'movilidad', n: 'Movilidad', dur: '5-10 min', c: '#FFD43B',
    items: ['Giros de brazos', 'Rotaciones de torso', 'Rotaciones de cadera', 'Balanceos de pierna'] },
  { id: 'trote', n: 'Trote', dur: 'según la semana', c: '#38BDF8' },
  { id: 'core', n: 'Core · 3 rondas', dur: '60 s de descanso entre rondas', c: '#FFD43B', rondas: 3,
    items: ['Plancha 45-60 s', 'Crunch 15-20', 'Elevación de piernas acostado 15'] },
  { id: 'estiramiento', n: 'Estiramiento', dur: '10 min', c: '#7BD389',
    items: ['Cuádriceps', 'Femoral', 'Glúteo', 'Pantorrilla', 'Espalda'] },
];

// ── Sugerencias del día (antes eran hábitos para marcar) ─────
// i = ícono de js/util.js
export const SUGERENCIAS = [
  { i: 'fuego', b: 'Creatina:', t: 'tómala todos los días, entrenes o no.' },
  { i: 'ola', b: 'Agua:', t: 'apunta a 2,5-3 L en el día.' },
  { i: 'trofeo', b: 'Proteína:', t: 'un poco en cada comida.' },
  { i: 'correr', b: 'Caminata:', t: 'unos minutos suaves después del gym.' },
  { i: 'luna', b: 'Sueño:', t: 'duerme 7-8 horas para recuperarte.' },
];

// ── Guía ─────────────────────────────────────────────────────
export const REGLAS = [
  { t: 'Progresión', c: '#FF6B4A', items: [
    'Semana 1: usa pesos con los que te sobren unas 3 repeticiones. El "Empieza con" de cada ejercicio ya está pensado para ti (60 kg, un año sin entrenar).',
    'Cuándo subir: si completas todas las series con las reps máximas dos sesiones seguidas con el mismo peso, sube. La app te avisa en la tarjeta con "Toca subir".',
    'Cuánto subir: 10 lbs en sentadilla, prensa, hack, hip thrust, peso muerto y pantorrilla; 5 lbs en todo lo demás.',
    'Si al subir no completas las reps, quédate con ese peso hasta lograrlas. Nunca subas dos veces seguidas.'] },
  { t: 'Técnica', c: '#4C8DFF', items: [
    'Baja lento (2 s) y sube con fuerza.',
    'Técnica antes que peso. Siempre.',
    'Suelta el aire en el esfuerzo.'] },
  { t: 'Descansos', c: '#2ED47A', items: [
    '90 s en los ejercicios grandes.',
    '60 s en los de aislamiento.',
    'Sentadilla y peso muerto: 2 min, te los ganaste.'] },
];

export const FRASES_DESCANSO = [
  'El músculo no crece en el gym: crece hoy, mientras descansas.',
  'Hasta los nadadores de élite tienen día libre. Hoy es el tuyo.',
  'Recargar también es entrenar. Mañana se vuelve con todo.',
  'Duerme bien, come bien, hidrátate. El resto lo hace tu cuerpo.',
  'Una semana más completada. Disfruta el domingo, Carlos.',
];

export const FRASES_FIN = [
  '¡Día completado! Así se hace, Carlos.',
  '¡Listo el entreno! Uno más para la racha.',
  '¡Coronaste! Ahora a comer y descansar.',
  '¡Eso es constancia! Nos vemos mañana.',
];

// ── Agarre de cada ejercicio (dibujos y catálogo en js/agarres.js) ──
// ag(manos, ancho, equipo, nota, D): '/' separa opciones. D = deducido (no estaba en la tabla, por revisar).
const D = true;
const op = x => (x.includes('/') ? x.split('/') : x);
const ag = (manos, ancho, equipo, nota, deducido) => ({ manos: op(manos), ancho: op(ancho), equipo: op(equipo), nota, ...(deducido ? { deducido } : {}) });
export const AGARRES = {
  // Espalda
  'remo-barra': ag('pronado', 'ancho', 'ninguno', 'Torso a 45°, barra al ombligo'),
  'remo-mancuernas-pecho': ag('neutro', 'n/a', 'ninguno', 'Pecho apoyado en el banco, codos hacia la cadera', D),
  'remo-maquina': ag('neutro', 'n/a', 'ninguno', 'Pecho apoyado, aprieta los omóplatos'),
  'remo-polea-abierto': ag('pronado', 'ancho', 'barra-remo', 'Codos abiertos a unos 45°'),
  'jalon-ancho': ag('pronado', 'ancho', 'barra-jalon', 'Manos en las curvas, pecho afuera, codos hacia abajo'),
  'dominadas-asistidas': ag('pronado/supino/neutro', 'hombros/ancho', 'ninguno', 'Según la manija que elijas; pulgares rodeando'),
  'jalon-hammer': ag('neutro', 'n/a', 'ninguno', 'Manijas paralelas, codos hacia las costillas', D),
  'jalon-un-brazo': ag('neutro', 'n/a', 'manija', 'Codo hacia la cadera, sin girar el torso', D),
  'remo-polea-cerrado': ag('neutro', 'cerrado', 'triangulo', 'Torso fijo, aprieta atrás'),
  'remo-una-mano': ag('neutro', 'n/a', 'ninguno', 'Mancuerna hacia la cadera'),
  'remo-polea-un-brazo': ag('neutro', 'n/a', 'manija', 'Codo pegado, jala hacia la cadera', D),
  'jalon-v': ag('neutro', 'cerrado', 'triangulo', 'Codos pegados a las costillas'),
  'jalon-supino': ag('supino', 'hombros', 'barra-recta/barra-jalon', 'Agarra la parte recta de la barra'),
  'dominadas-supinas': ag('supino', 'hombros', 'ninguno', 'Codos hacia adelante y abajo'),
  'jalon-brazos-rectos': ag('pronado', 'hombros', 'barra-recta', 'Brazos casi estirados, baja en arco; con cuerda, palmas enfrentadas'),
  'pullover-mancuerna': ag('neutro', 'n/a', 'ninguno', 'Manos sujetando el disco de arriba por dentro'),
  'pullover-cuerda': ag('neutro', 'hombros', 'cuerda', 'Brazos casi rectos'),
  'remo-supino': ag('supino', 'hombros', 'ninguno', 'Codos pegados al cuerpo'),
  'remo-polea-supino': ag('supino', 'hombros', 'barra-recta', 'Codos pegados, jala hacia el ombligo', D),
  'remo-mancuernas-supino': ag('supino', 'n/a', 'ninguno', 'Palmas hacia adelante, codos pegados al cuerpo', D),
  'remo-gironda': ag('neutro', 'cerrado', 'triangulo', 'Pecho afuera, codos bien atrás'),
  // Bíceps
  'curl-z': ag('supino', 'hombros', 'ninguno', 'Manos en las curvas interiores'),
  'curl-barra-recta': ag('supino', 'hombros', 'ninguno', 'Manos al ancho de los hombros, codos pegados', D),
  'curl-mancuernas': ag('supino', 'n/a', 'ninguno', 'Gira la muñeca al subir'),
  'curl-polea-baja': ag('supino', 'hombros', 'barra-recta/barra-z', 'Codos pegados'),
  'curl-martillo': ag('neutro', 'n/a', 'ninguno', 'Palmas enfrentadas'),
  'martillo-cuerda': ag('neutro', 'cerrado', 'cuerda', 'Palmas enfrentadas, codos pegados', D),
  'curl-inverso-z': ag('pronado', 'hombros', 'ninguno', 'Palmas hacia abajo, manos en las curvas de afuera', D),
  'curl-predicador': ag('supino', 'hombros', 'ninguno', 'Brazos apoyados, curvas interiores'),
  'predicador-maquina': ag('supino', 'n/a', 'ninguno', 'Brazos apoyados en el cojín, codos fijos', D),
  'curl-arana': ag('supino', 'n/a', 'ninguno', 'Pecho en el banco inclinado, brazos colgando', D),
  'curl-polea-detras': ag('supino', 'n/a', 'manija', 'Brazo un poco atrás del cuerpo, codo fijo', D),
  'curl-concentrado': ag('supino', 'n/a', 'ninguno', 'Gira la muñeca al subir'),
  'curl-polea-una-mano': ag('supino', 'n/a', 'manija', 'Codo pegado, gira la muñeca al subir', D),
  'curl-21': ag('supino', 'hombros', 'ninguno', 'Curvas interiores'),
  'drag-curl': ag('supino', 'hombros', 'ninguno', 'Barra pegada al cuerpo, codos hacia atrás', D),
  'curl-polea-barra': ag('supino', 'hombros', 'barra-recta/barra-z', 'Codos pegados'),
  'martillo-sentado': ag('neutro', 'n/a', 'ninguno', 'Palmas enfrentadas'),
  // Piernas
  'sentadilla': ag('pronado', 'ancho', 'ninguno', 'Barra sobre los trapecios, muñecas rectas'),
  'prensa': ag('ninguno', 'n/a', 'ninguno', 'Las manijas laterales solo sirven para sujetarte'),
  'sentadilla-goblet': ag('neutro', 'n/a', 'ninguno', 'Mancuerna vertical pegada al pecho, manos bajo el disco'),
  'sentadilla-hack': ag('ninguno', 'n/a', 'ninguno', 'Hombros bajo los cojines; las manijas solo para sujetarte', D),
  'sentadilla-smith-adelantados': ag('pronado', 'ancho', 'ninguno', 'Barra sobre los trapecios, muñecas rectas', D),
  'zancadas-caminando': ag('neutro', 'n/a', 'ninguno', 'Brazos a los lados'),
  'step-up': ag('neutro', 'n/a', 'ninguno', 'Brazos a los lados'),
  'zancada-reversa': ag('neutro', 'n/a', 'ninguno', 'Brazos a los lados'),
  'extensiones': ag('ninguno', 'n/a', 'ninguno', 'Las manijas laterales solo sirven para sujetarte'),
  'goblet-talones': ag('neutro', 'n/a', 'ninguno', 'Mancuerna vertical pegada al pecho, manos bajo el disco'),
  'sissy': ag('ninguno', 'n/a', 'ninguno', 'Una mano en un soporte firme, solo para el equilibrio', D),
  'desplantes': ag('neutro', 'n/a', 'ninguno', 'Brazos a los lados'),
  'femoral-acostado': ag('ninguno', 'n/a', 'ninguno', 'Las manijas solo sirven para sujetarte'),
  'femoral-sentado': ag('ninguno', 'n/a', 'ninguno', 'Las manijas solo sirven para sujetarte'),
  'femoral-fitball': ag('ninguno', 'n/a', 'fitball', 'Brazos en el piso, talones sobre la pelota', D),
  'femoral-pie': ag('ninguno', 'n/a', 'tobillera', 'En polea, con tobillera; en máquina, sujeta las manijas', D),
  'rumano-mancuernas': ag('neutro', 'n/a', 'ninguno', 'Mancuernas pegadas a las piernas'),
  'rumano-barra': ag('pronado', 'hombros', 'ninguno', 'Brazos por fuera de las rodillas'),
  'hiperextensiones': ag('ninguno', 'n/a', 'ninguno', 'Brazos cruzados sobre el pecho', D),
  'buenos-dias': ag('pronado', 'ancho', 'ninguno', 'Barra sobre los trapecios, muñecas rectas', D),
  'bulgara': ag('neutro', 'n/a', 'ninguno', 'Brazos a los lados'),
  'curl-femoral-maquina': ag('ninguno', 'n/a', 'ninguno', 'Las manijas solo sirven para sujetarte'),
  'nordico': ag('ninguno', 'n/a', 'ninguno', 'Manos listas al frente para frenar la caída', D),
  'hip-thrust': ag('pronado', 'ancho', 'ninguno', 'Manos sujetando la barra a los lados'),
  'hip-thrust-smith': ag('pronado', 'ancho', 'ninguno', 'Manos sujetando la barra a los lados', D),
  'puente-mancuerna': ag('neutro', 'n/a', 'ninguno', 'Ambas manos sujetándola sobre la cadera', D),
  'patada-gluteo-polea': ag('ninguno', 'n/a', 'tobillera', 'Las manos se apoyan en la máquina'),
  'abductor': ag('ninguno', 'n/a', 'ninguno', 'Las manijas laterales solo sirven para sujetarte'),
  'abduccion-polea': ag('ninguno', 'n/a', 'tobillera', 'Tobillera en el pie de afuera, mano en la máquina', D),
  'caminata-banda': ag('ninguno', 'n/a', 'banda', 'Banda sobre las rodillas, pasos cortos', D),
  'elevacion-pelvis': ag('ninguno', 'n/a', 'ninguno', 'Brazos en el piso a los lados', D),
  'puente-una-pierna': ag('ninguno', 'n/a', 'ninguno', 'Brazos en el piso a los lados', D),
  'pantorrilla-pie': ag('ninguno', 'n/a', 'ninguno', 'Hombros bajo los cojines; sujeta las manijas', D),
  'pantorrilla-smith': ag('pronado', 'ancho', 'ninguno', 'Barra sobre los trapecios, muñecas rectas', D),
  'pantorrilla-una-pierna': ag('neutro', 'n/a', 'ninguno', 'Mancuerna en una mano, la otra en la pared', D),
  'pantorrilla-sentado': ag('ninguno', 'n/a', 'ninguno', 'Cojín sobre los muslos; manos en las manijas', D),
  'pantorrilla-sentado-mancuerna': ag('neutro', 'n/a', 'ninguno', 'Mancuerna sobre la rodilla, sujétala con las manos', D),
  // Hombros
  'militar-mancuernas': ag('neutro/diagonal', 'n/a', 'ninguno', 'Más cómodo para el hombro que las palmas al frente'),
  'militar-hammer': ag('neutro', 'n/a', 'ninguno', 'Empuja sin arquear la espalda baja'),
  'press-arnold': ag('supino/pronado', 'n/a', 'ninguno', 'Empieza con las palmas hacia ti y gíralas al subir', D),
  'militar-barra': ag('pronado', 'hombros', 'ninguno', 'Abdomen apretado'),
  'laterales': ag('pronado', 'n/a', 'ninguno', 'Palmas hacia el piso, codos un poco flexionados'),
  'laterales-polea': ag('pronado', 'n/a', 'manija', 'Polea baja, cable por delante del cuerpo', D),
  'laterales-maquina': ag('ninguno', 'n/a', 'ninguno', 'Brazos contra los cojines; las manijas, sin apretar', D),
  'posterior-maquina': ag('neutro', 'n/a', 'ninguno', 'Codos casi rectos, abre hacia atrás'),
  'pajaro': ag('neutro', 'n/a', 'ninguno', 'Palmas enfrentadas, codos casi rectos'),
  'posterior-polea': ag('pronado', 'n/a', 'manija', 'Cables cruzados a la altura del pecho, codos casi rectos', D),
  'face-pull': ag('neutro', 'hombros', 'cuerda', 'Polea a la altura de la cara, abre las manos al llegar'),
  // Pecho
  'inclinado-mancuernas': ag('neutro/pronado', 'n/a', 'ninguno', 'Codos a unos 45-60° del cuerpo'),
  'inclinado-barra': ag('pronado', 'ancho', 'ninguno', 'Igual que el plano: antebrazos verticales abajo'),
  'inclinado-maquina': ag('neutro/pronado', 'n/a', 'ninguno', 'Elige la manija más cómoda para tu hombro', D),
  'cruces-abajo': ag('supino', 'n/a', 'manija', 'Poleas bajas, sube las manos en arco hasta el pecho', D),
  'press-plano-barra': ag('pronado', 'ancho', 'ninguno', 'Antebrazos verticales abajo, pulgares rodeando siempre'),
  'press-plano-mancuernas': ag('neutro/pronado', 'n/a', 'ninguno', 'Codos a unos 45-60° del cuerpo'),
  'press-pecho-maquina': ag('neutro/pronado', 'n/a', 'ninguno', 'Elige la manija más cómoda, a la altura del pecho medio'),
  'flexiones': ag('pronado', 'ancho', 'ninguno', 'Un poco más abiertas que los hombros, codos a 45°'),
  // Tríceps
  'frances-z': ag('diagonal', 'hombros', 'ninguno', 'Curvas interiores, codos sin abrirse'),
  'frances-mancuernas': ag('neutro', 'n/a', 'ninguno', 'Palmas enfrentadas, codos sin abrirse', D),
  'triceps-sobre-cabeza': ag('neutro', 'n/a', 'cuerda', 'De espaldas a la polea, abre la cuerda arriba', D),
  'triceps-polea': ag('pronado', 'hombros', 'barra-recta', 'Codos pegados; con cuerda, palmas enfrentadas'),
  'triceps-cuerda': ag('neutro', 'hombros', 'cuerda', 'Abre la cuerda al final'),
  'fondos-maquina': ag('pronado', 'hombros', 'ninguno', 'Dedos al frente, hombros lejos de las orejas'),
  'triceps-predicador': ag('neutro', 'n/a', 'ninguno', 'Brazo apoyado en el cojín, codo fijo', D),
  'triceps-un-brazo-polea': ag('neutro', 'n/a', 'manija', 'Codo pegado al cuerpo, estira completo', D),
  'frances-una-mancuerna': ag('neutro', 'n/a', 'ninguno', 'Ambas manos bajo el disco de arriba, codos cerrados', D),
  'patada-triceps-polea': ag('neutro', 'n/a', 'manija', 'Codo pegado al cuerpo'),
  'patada-mancuerna': ag('neutro', 'n/a', 'ninguno', 'Codo pegado al cuerpo, estira el brazo atrás', D),
  // Abdomen
  'crunch-maquina': ag('neutro', 'n/a', 'ninguno', 'Sujeta las manijas sin jalar con los brazos', D),
  'crunch-polea': ag('neutro', 'cerrado', 'cuerda', 'Cuerda junto a la cabeza, baja con el abdomen', D),
  'crunch-piso': ag('ninguno', 'n/a', 'ninguno', 'Manos en el pecho o junto a las orejas', D),
  'elevacion-piernas': ag('ninguno', 'n/a', 'ninguno', 'Manos bajo la cadera o a los lados', D),
  'elevacion-colgado': ag('pronado', 'hombros', 'ninguno', 'Pulgares rodeando la barra, sin balancearte', D),
  'rodillas-paralelas': ag('neutro', 'n/a', 'ninguno', 'Antebrazos apoyados, sujeta las manijas', D),
  'crunch-lateral': ag('ninguno', 'n/a', 'ninguno', 'Mano de arriba junto a la oreja', D),
  'russian-twist': ag('neutro', 'n/a', 'ninguno', 'Mancuerna con ambas manos frente al pecho', D),
  'plancha-lateral': ag('ninguno', 'n/a', 'ninguno', 'Sin agarre; apoyo en el antebrazo'),
  'plancha': ag('ninguno', 'n/a', 'ninguno', 'Sin agarre; apoyo en los antebrazos'),
  'plancha-toque': ag('ninguno', 'n/a', 'ninguno', 'Manos bajo los hombros, cadera quieta'),
  'dead-bug': ag('ninguno', 'n/a', 'ninguno', 'Sin agarre; brazos estirados hacia el techo'),
};
for (const [id, a] of Object.entries(AGARRES)) if (EJERCICIOS[id]) EJERCICIOS[id].agarre = a;
