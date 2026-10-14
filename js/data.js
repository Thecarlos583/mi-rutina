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
  'prensa': { n: 'Prensa de piernas 45°', g: 'cuadriceps', z: ['cuadriceps', 'gluteo'], s: ['femoral'], d: 90,
    t: 'Cuádriceps y glúteo con mucho peso y la espalda apoyada.',
    p: ['Espalda y cadera pegadas al respaldo, pies al ancho de los hombros.', 'Quita los seguros y baja hasta que las rodillas queden a 90°.', 'Empuja con todo el pie, sin despegar los talones.', 'Arriba no bloquees las rodillas.'],
    a: [['prensa-horizontal', 3, '12'], ['sentadilla-hack', 3, '10'], ['sentadilla-smith-adelantados', 3, '12']] },
  'prensa-horizontal': { n: 'Prensa horizontal (de empuje)', g: 'cuadriceps', z: ['cuadriceps', 'gluteo'], s: ['femoral'], d: 90,
    t: 'Cuádriceps y glúteo sentado, empujando al frente. Con los pies altos en la plataforma trabaja más el glúteo y el femoral.',
    p: ['Sentado, espalda pegada al respaldo, pies al ancho de los hombros en la plataforma.', 'Empuja al frente con todo el pie.', 'Vuelve lento hasta que las rodillas queden a 90°.', 'No bloquees las rodillas al estirar.'],
    a: [['prensa', 3, '12'], ['sentadilla-hack', 3, '10'], ['sentadilla-goblet', 3, '12']] },
  'rumano-una-pierna': { n: 'Peso muerto rumano a una pierna con mancuerna ligera', p: ['Mancuerna ligera en la mano contraria a la pierna de apoyo; baja la cadera atrás con la espalda recta y sube apretando el glúteo.'] },
  'femoral-mancuerna': { n: 'Curl femoral con mancuerna, boca abajo', p: ['Acostado boca abajo en un banco, una mancuerna entre los pies; sube los talones hacia el glúteo y baja lento.'] },
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
    a: [['crunch-piso', 3, '20'], ['crunch-inverso', 3, '15'], ['bicicleta', 3, '20']] },
  'crunch-polea': { n: 'Crunch en polea arrodillado', p: ['Arrodillado, cuerda junto a la cabeza, enróllate llevando los codos a los muslos.'] },
  'crunch-piso': { n: 'Crunch en el piso', g: 'core', z: ['abdomen'], s: [], d: 45,
    a: [['crunch-inverso', 3, '15'], ['toques-talon', 3, '20'], ['bicicleta', 3, '20']],
    t: 'El abdomen de arriba, sin máquinas: solo una colchoneta.',
    p: ['Boca arriba, rodillas dobladas y pies en el piso.', 'Manos en el pecho o junto a las orejas, sin jalar el cuello.', 'Sube los hombros del piso apretando el abdomen.', 'Baja lento.'] },
  'toques-talon': { n: 'Toques de talón', g: 'core', z: ['oblicuos'], s: ['abdomen'], d: 45,
    t: 'Los costados del abdomen (oblicuos), en el piso.',
    p: ['Boca arriba, rodillas dobladas y pies en el piso.', 'Despega un poco los hombros.', 'Lleva la mano a tocar el talón de un lado y luego del otro.', 'Sin bajar los hombros entre toque y toque.'] },
  'bicicleta': { n: 'Crunch bicicleta', g: 'core', z: ['abdomen', 'oblicuos'], s: [], d: 45,
    t: 'Abdomen y costados a la vez, en el piso.',
    p: ['Boca arriba, manos junto a las orejas y piernas en el aire.', 'Lleva un codo hacia la rodilla contraria mientras estiras la otra pierna.', 'Cambia de lado como pedaleando.', 'Lento: no es una carrera.'] },
  'tijeras': { n: 'Tijeras', g: 'core', z: ['abdomen'], s: [], d: 45,
    t: 'El abdomen de abajo, con las piernas casi rectas.',
    p: ['Boca arriba, manos bajo la cadera.', 'Sube las piernas un poco del piso.', 'Sube una y baja la otra, alternando.', 'La espalda baja no se despega del piso.'] },

  'elevacion-piernas': { n: 'Elevación de piernas', g: 'core', z: ['abdomen'], s: ['oblicuos'], d: 60,
    t: 'Abdomen bajo.',
    p: ['Piernas juntas.', 'Súbelas sin balancearte.', 'Baja lento sin tocar el piso.', 'Espalda baja pegada.'],
    a: [['crunch-inverso', 3, '15'], ['tijeras', 3, '20'], ['dead-bug', 3, '10/lado']] },
  'elevacion-colgado': { n: 'Elevación colgado', p: ['Colgado de la barra, sube las piernas sin balancearte.'] },
  'rodillas-paralelas': { n: 'Rodillas al pecho en paralelas', p: ['Apoyado en las paralelas, sube las rodillas al pecho y baja lento.'] },

  'crunch-lateral': { n: 'Crunch lateral', g: 'core', z: ['oblicuos'], s: ['abdomen'], d: 60,
    t: 'Oblicuos: los lados del abdomen.',
    p: ['De lado o en el banco.', 'Sube el torso hacia un lado.', 'Lento, sin impulso.', 'Termina un lado y cambia.'],
    a: [['russian-twist', 3, '20'], ['plancha-lateral', 3, '30 s/lado']] },
  'russian-twist': { n: 'Russian twist', p: ['Sentado con el torso inclinado, gira de lado a lado con un peso.'] },
  'plancha-lateral': { n: 'Plancha lateral', g: 'core', z: ['oblicuos'], s: ['abdomen', 'gluteoMedio'], d: 45,
    t: 'Los costados del abdomen, aguantando de lado.',
    p: ['De lado, apoyado en el antebrazo, codo bajo el hombro.', 'Sube la cadera hasta que el cuerpo quede recto.', 'Aguanta sin dejar caer la cadera.', 'Cambia de lado.'] },

  'plancha': { n: 'Plancha', g: 'core', z: ['abdomen', 'oblicuos'], s: ['gluteo', 'deltoides'], d: 60,
    t: 'Core completo: la estabilidad que sostiene todo lo demás.',
    p: ['Antebrazos en el piso.', 'Cuerpo recto de la cabeza a los talones.', 'Abdomen y glúteo apretados.', 'Respira normal.'],
    a: [['plancha-toque', 3, '20'], ['dead-bug', 3, '12/lado']] },
  'plancha-toque': { n: 'Plancha con toque de hombros', p: ['En plancha alta, toca un hombro con la mano contraria sin mover la cadera.'] },
  'dead-bug': { n: 'Dead bug', g: 'core', z: ['abdomen'], s: ['oblicuos'], d: 45,
    t: 'El abdomen profundo, cuidando la espalda baja.',
    p: ['Boca arriba, brazos al techo y rodillas dobladas en el aire.', 'Estira un brazo y la pierna contraria hasta casi tocar el piso.', 'Vuelve y cambia de lado.', 'La espalda baja pegada al piso todo el tiempo.'] },

  // ── Semana B: ejercicios nuevos ────────────────────────────
  'frontal-z': { n: 'Elevación frontal con barra Z', g: 'hombros', z: ['deltoides'], s: ['trapecio'], d: 60,
    t: 'La parte delantera del hombro.',
    p: ['De pie, barra Z frente a los muslos, manos al ancho de los hombros.', 'Sube con los brazos casi rectos hasta la altura de los hombros.', 'Sin balancear el cuerpo.', 'Baja lento en 2 s.'] },
  'curl-21-recta': { n: '21s con barra recta', g: 'biceps', z: ['biceps'], s: ['antebrazo'], d: 90,
    t: 'El bíceps en todo su recorrido, por partes. Quema, y bastante.',
    p: ['7 repeticiones de abajo hasta la mitad.', '7 de la mitad hasta arriba.', '7 completas, de abajo hasta arriba.', 'Codos pegados todo el tiempo.'] },
  'curl-alterno': { n: 'Curl alterno con mancuernas', g: 'biceps', z: ['biceps'], s: ['antebrazo'], d: 60,
    t: 'El bíceps de cada brazo por separado.',
    p: ['De pie, mancuernas a los lados con las palmas enfrentadas.', 'Sube una y gira la muñeca para que la palma mire hacia ti.', 'Baja controlado y cambia de brazo.', 'Codos pegados, sin balancear.'] },
  'aperturas-maquina': { n: 'Aperturas en máquina', g: 'pecho', z: ['pecho'], s: ['deltoides'], d: 60,
    t: 'El pecho juntando los brazos, sin que ayude el tríceps.',
    p: ['Espalda pegada al respaldo, manijas a la altura del pecho.', 'Codos un poco flexionados todo el tiempo.', 'Junta las manos al frente y aprieta 1 s.', 'Abre lento hasta sentir el estiramiento.'] },
  'crunch-lateral-maquina': { n: 'Crunch lateral en máquina', g: 'core', z: ['oblicuos'], s: ['abdomen'], d: 45,
    t: 'Los oblicuos, los músculos de los costados del abdomen.',
    p: ['Ajusta la máquina de crunch lateral o de giro.', 'Dobla el torso hacia un lado, lento.', 'Vuelve sin impulso.', 'Haz todas las de un lado y cambia.'] },
  'fondos-paralelas': { n: 'Paralelas (fondos)', g: 'pecho', z: ['pecho', 'triceps'], s: ['deltoides'], d: 90,
    t: 'Pecho bajo y tríceps con tu propio peso.',
    p: ['Sujétate en las paralelas con los brazos estirados.', 'Inclínate un poco al frente.', 'Baja hasta que los hombros queden a la altura de los codos.', 'Sube sin bloquear los codos de golpe.'] },
  'rueda': { n: 'Rueda abdominal', g: 'core', z: ['abdomen'], s: ['dorsal'], d: 60,
    t: 'Todo el abdomen trabajando para que la espalda no se arquee.',
    p: ['De rodillas sobre una colchoneta, manos en la rueda.', 'Rueda al frente solo hasta donde la espalda baja no se arquee.', 'Aprieta el abdomen y vuelve.', 'Si molesta la espalda baja, haz menos recorrido.'] },
  'elevacion-paralelas': { n: 'Elevación de piernas en paralelas', g: 'core', z: ['abdomen'], s: ['oblicuos'], d: 60,
    t: 'El abdomen bajo, sin apoyar la espalda en el piso.',
    p: ['Antebrazos en los apoyos, espalda pegada al respaldo.', 'Sube las piernas sin balancearte.', 'Baja lento.', 'Si es fácil, una mancuerna de 10 lbs entre los pies.'] },
  'encogimientos-mancuernas': { n: 'Encogimientos con mancuernas', g: 'espalda', z: ['trapecio'], s: ['antebrazo'], d: 60,
    t: 'El trapecio de arriba, el que va de los hombros al cuello.',
    p: ['De pie, una mancuerna en cada mano a los lados.', 'Sube los hombros hacia las orejas.', 'Pausa 1 s arriba.', 'Baja lento, sin girar los hombros.'] },
  'encogimientos-barra': { n: 'Encogimientos con barra recta', g: 'espalda', z: ['trapecio'], s: ['antebrazo'], d: 60,
    t: 'El trapecio de arriba.',
    p: ['De pie, barra frente a los muslos con agarre cerrado.', 'Barra pegada al cuerpo.', 'Sube los hombros hacia las orejas y pausa arriba.', 'Baja lento.'] },
  'remo-menton-z': { n: 'Remo al mentón con barra Z', g: 'hombros', z: ['deltoides', 'trapecio'], s: ['biceps'], d: 60,
    t: 'Hombro medio y trapecio.',
    p: ['De pie, barra Z frente a los muslos, manos al ancho de los hombros.', 'Sube la barra pegada al cuerpo hasta el pecho.', 'Codos como máximo a la altura de los hombros.', 'Baja lento.'] },
  'stir-pot': { n: 'Stir the pot con pelota de pilates', g: 'core', z: ['abdomen'], s: ['oblicuos'], d: 45,
    t: 'El abdomen profundo, aguantando para que la cadera no se mueva.',
    p: ['Antebrazos sobre la pelota en posición de plancha.', 'Haz círculos pequeños con los codos.', 'La cadera no se mueve.', '10 círculos hacia un lado y 10 hacia el otro.'] },
  // Alternativas nuevas de la Semana B (heredan grupo y descripción del ejercicio principal)
  'press-hombro-maquina': { n: 'Press en máquina de hombro', p: ['Espalda pegada al respaldo; empuja las manijas hacia arriba sin bloquear los codos.'] },
  'predicador-mancuerna': { n: 'Curl predicador con mancuerna a una mano', p: ['Brazo apoyado en el banco predicador; sube y baja lento, sin estirar de golpe.'] },
  'extension-mancuerna-cabeza': { n: 'Extensión sobre la cabeza con mancuerna', p: ['Sentado, una mancuerna con las dos manos detrás de la cabeza; extiende hacia arriba con los codos quietos.'] },
  'frontal-mancuernas': { n: 'Elevación frontal con mancuernas alternas', p: ['Sube una mancuerna al frente hasta el hombro, baja y cambia de brazo.'] },
  'frontal-disco': { n: 'Elevación frontal con disco', p: ['Disco agarrado con las dos manos; súbelo al frente hasta la altura de los hombros.'] },
  'frontal-polea': { n: 'Elevación frontal en polea baja', p: ['De espaldas a la polea baja, sube la manija al frente hasta el hombro.'] },
  'triceps-barra-v': { n: 'Extensión de tríceps con barra V', p: ['Polea alta con la barra en V; codos pegados, baja hasta estirar los brazos.'] },
  'martillo-cruzado': { n: 'Martillo cruzado al pecho', p: ['Palma hacia adentro; sube la mancuerna cruzando hacia el hombro contrario.'] },
  'laterales-pie': { n: 'Laterales de pie', p: ['De pie, sube las mancuernas a los lados hasta la altura de los hombros, codos un poco flexionados.'] },
  'curl-inclinado': { n: 'Curl en banco inclinado', p: ['Sentado en un banco inclinado, brazos colgando; sube las mancuernas sin adelantar los codos.'] },
  'fondos-banco': { n: 'Fondos en banco', p: ['Manos en el borde de un banco, piernas al frente; baja doblando los codos hacia atrás y sube.'] },
  'abduccion-lado': { n: 'Abducción acostado de lado', p: ['Acostado de lado, sube la pierna de arriba recta y baja lento.'] },
  'aperturas-mancuernas': { n: 'Aperturas con mancuernas', p: ['Acostado en el banco, abre los brazos con los codos un poco flexionados y júntalos arriba.'] },
  'cruces-medio': { n: 'Cruces de polea a media altura', p: ['Poleas a la altura del pecho; junta las manos al frente en arco.'] },
  'lenador-polea': { n: 'Leñador en polea', p: ['De lado a la polea, ambas manos en la manija; gira desde la cadera en diagonal.'] },
  'inclinado-smith': { n: 'Press inclinado en Smith', p: ['Banco a 30° bajo la Smith; baja la barra al pecho alto y empuja.'] },
  'plano-smith': { n: 'Press plano en Smith', p: ['Banco plano bajo la Smith; baja la barra al pecho medio y empuja.'] },
  'fondos-asistidos': { n: 'Fondos asistidos en máquina', p: ['Rodillas en el apoyo de la máquina asistida; baja hasta los codos a 90° y sube.'] },
  'plancha-desplazamiento': { n: 'Plancha con desplazamiento de codos', p: ['En plancha sobre los antebrazos, adelanta y atrasa los codos unos centímetros sin mover la cadera.'] },
  'rollout-fitball': { n: 'Rollout con fitball', p: ['De rodillas, antebrazos en la pelota; rueda al frente sin arquear la espalda y vuelve.'] },
  'inclinado-cerrado': { n: 'Press inclinado con agarre cerrado', p: ['Banco a 30°, manos al ancho de los hombros; baja al pecho alto con los codos pegados.'] },
  'aperturas-inclinadas': { n: 'Aperturas inclinadas con mancuernas', p: ['Banco a 30°; abre los brazos con los codos un poco flexionados y júntalos arriba.'] },
  'press-cerrado': { n: 'Press con agarre cerrado', p: ['Banco plano, manos al ancho de los hombros, codos pegados al bajar.'] },
  'crunch-inverso': { n: 'Crunch inverso', g: 'core', z: ['abdomen'], s: [], d: 45,
    t: 'El abdomen de abajo, sin máquinas.',
    p: ['Boca arriba, rodillas dobladas en el aire y manos a los lados.', 'Lleva las rodillas al pecho despegando un poco la cadera.', 'Baja lento sin tocar el piso con los pies.', 'Sin impulso.'] },
  'remo-maquina-un-brazo': { n: 'Remo en máquina a un brazo', p: ['Pecho en el apoyo; jala con un brazo llevando el codo atrás.'] },
  'encogimientos-smith': { n: 'Encogimientos en Smith', p: ['Barra de la Smith frente a los muslos; sube los hombros y pausa arriba.'] },
  'encogimientos-maquina': { n: 'Encogimientos en máquina', p: ['Manijas a los lados o cojines en los hombros; sube los hombros y pausa.'] },
  'remo-banda': { n: 'Remo con banda', p: ['Banda atada al frente a la altura del pecho; jala con los codos atrás y aprieta.'] },
  'remo-menton-polea': { n: 'Remo al mentón en polea', p: ['Polea baja con barra recta; sube hasta el pecho con los codos a la altura de los hombros como máximo.'] },
  'remo-invertido': { n: 'Remo invertido', p: ['Bajo una barra fija o de la Smith, cuerpo recto; jala el pecho hacia la barra.'] },
  'crunch-fitball': { n: 'Crunch con fitball', p: ['Espalda baja sobre la pelota, pies firmes; sube el pecho sin jalar el cuello.'] },
  'plancha-rodillas': { n: 'Plancha de rodillas', p: ['Antebrazos y rodillas en el piso, cuerpo recto de las rodillas a la cabeza.'] },
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
  'frontal-z': 'z', 'curl-21-recta': 'z', 'remo-menton-z': 'z', 'inclinado-smith': 'smith', 'plano-smith': 'smith', 'encogimientos-smith': 'smith',
};
export const INICIO = {
  // Semana B
  'frontal-z': [20, 'barra'], 'curl-21-recta': [25, 'barra'], 'curl-alterno': [15, 'c/u'], 'aperturas-maquina': [40, 'maq'],
  'crunch-lateral-maquina': [40, 'maq'], 'fondos-paralelas': [0, 'corp'], 'rueda': [0, 'corp'], 'elevacion-paralelas': [0, 'corp'],
  'encogimientos-mancuernas': [30, 'c/u'], 'encogimientos-barra': [65, 'barra'], 'remo-menton-z': [30, 'barra'], 'stir-pot': [0, 'corp'],
  'press-hombro-maquina': [40, 'maq'], 'predicador-mancuerna': [15, 'una'], 'extension-mancuerna-cabeza': [20, 'una'],
  'frontal-mancuernas': [10, 'c/u'], 'frontal-disco': [10, 'una'], 'frontal-polea': [10, 'maq'], 'triceps-barra-v': [35, 'maq'],
  'martillo-cruzado': [15, 'c/u'], 'laterales-pie': [10, 'c/u'], 'curl-inclinado': [10, 'c/u'], 'fondos-banco': [0, 'corp'],
  'abduccion-lado': [0, 'corp'], 'aperturas-mancuernas': [15, 'c/u'], 'cruces-medio': [15, 'maq'], 'lenador-polea': [20, 'maq'],
  'inclinado-smith': [55, 'barra'], 'plano-smith': [65, 'barra'], 'fondos-asistidos': [60, 'asist'], 'plancha-desplazamiento': [0, 'corp'],
  'rollout-fitball': [0, 'corp'], 'inclinado-cerrado': [55, 'barra'], 'aperturas-inclinadas': [15, 'c/u'], 'press-cerrado': [55, 'barra'],
  'crunch-inverso': [0, 'corp'], 'remo-maquina-un-brazo': [25, 'maq'], 'encogimientos-smith': [65, 'barra'], 'encogimientos-maquina': [70, 'maq'],
  'remo-banda': [0, 'banda'], 'remo-menton-polea': [30, 'maq'], 'remo-invertido': [0, 'corp'], 'crunch-fitball': [0, 'corp'], 'plancha-rodillas': [0, 'corp'],
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
  'sentadilla': [75, 'barra'], 'prensa': [90, 'discos'], 'prensa-horizontal': [100, 'maq'], 'rumano-una-pierna': [10, 'una'], 'femoral-mancuerna': [10, 'una'], 'sentadilla-goblet': [30, 'una'], 'sentadilla-hack': [70, 'discos'], 'sentadilla-smith-adelantados': [65, 'barra'],
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

// ── Vuelta a la calma: al terminar, ahí mismo en el gimnasio ──
// Caminata suave y estiramientos de lo que se entrenó ese día. t: segundos (con lados, la mitad por lado).
export const ENFRIAMIENTO = {
  caminata: {
    piernas: { min: 5, n: 'Caminata suave', d: 'En la caminadora plana o alrededor del gimnasio, a paso lento. Suelta las piernas.' },
    superior: { min: 8, n: 'Caminata', d: 'En la caminadora, a un paso en el que puedas conversar. Baja el ritmo el último minuto.' },
  },
  estiramientos: {
    espalda: [
      { n: 'Colgarte de la barra', d: 'Agarre ancho y brazos estirados; deja caer el peso. Si no aguantas, apoya las puntas de los pies.', t: 30 },
      { n: 'Dorsal en la pared', d: 'Manos en la pared a la altura de la cadera; lleva la cadera hacia atrás hasta sentir los costados.', t: 30 },
    ],
    biceps: [{ n: 'Bíceps en la pared', d: 'Palma en la pared a la altura del hombro, brazo estirado; gira el cuerpo hacia el otro lado.', t: 60, lados: true }],
    hombros: [{ n: 'Hombro cruzado', d: 'Lleva un brazo estirado al otro lado del pecho y sujétalo con la otra mano.', t: 60, lados: true }],
    triceps: [{ n: 'Tríceps sobre la cabeza', d: 'Mano entre los omóplatos; con la otra mano empuja el codo hacia atrás, suave.', t: 60, lados: true }],
    pecho: [{ n: 'Pecho en una columna', d: 'Antebrazo apoyado en una columna, codo a la altura del hombro; da un paso al frente.', t: 60, lados: true }],
    cuadriceps: [
      { n: 'Cuádriceps de pie', d: 'Agárrate el pie por detrás y lleva el talón al glúteo, rodillas juntas. Apóyate en algo si hace falta.', t: 60, lados: true },
      { n: 'Flexor de cadera en zancada', d: 'Rodilla de atrás en el piso; empuja la cadera hacia adelante sin arquear la espalda.', t: 60, lados: true },
    ],
    femoral: [
      { n: 'Isquios en un banco', d: 'Talón en un banco bajo y pierna estirada; inclínate desde la cadera con la espalda recta.', t: 60, lados: true },
      { n: 'Glúteo en figura 4', d: 'Sentado en un banco, tobillo sobre la rodilla contraria; inclínate un poco al frente.', t: 60, lados: true },
    ],
    pantorrilla: [{ n: 'Pantorrilla en la pared', d: 'Manos en la pared, una pierna atrás estirada con el talón pegado al piso.', t: 60, lados: true }],
    core: [{ n: 'Cobra suave', d: 'Boca abajo, apoya los antebrazos y sube el pecho sin forzar la espalda baja.', t: 30 }],
  },
  final: { n: 'Respira y suelta', d: '5 respiraciones lentas: 4 segundos tomando aire y 6 botándolo.', t: 50 },
};

// ── Plan semanal ─────────────────────────────────────────────
// Cada ejercicio del día: [id, series, reps, nota opcional]
const VIERNES_A = [
  ['rumano-mancuernas', 4, '10-12'], ['bulgara', 3, '10/pierna'], ['curl-femoral-maquina', 4, '12-15'],
  ['hip-thrust', 3, '12'], ['abductor', 3, '20'], ['pantorrilla-sentado', 4, '15-20'],
];

// Ejercicios que ya existían solo como alternativa y ahora son principales en la Semana B: les falta su descripción
Object.assign(EJERCICIOS['triceps-cuerda'], { g: 'triceps', z: ['triceps'], s: [], d: 60, t: 'El tríceps, sobre todo la parte de afuera; la cuerda deja abrir al final.' });
Object.assign(EJERCICIOS['sentadilla-smith-adelantados'], { g: 'cuadriceps', z: ['cuadriceps', 'gluteo'], s: ['femoral'], d: 90, t: 'Cuádriceps y glúteo con la barra guiada: más estable que la sentadilla libre.' });
Object.assign(EJERCICIOS['rumano-barra'], { g: 'femoral', z: ['femoral', 'gluteo'], s: ['lumbar'], d: 90, t: 'Isquiotibiales y glúteo, con la espalda baja sosteniendo.' });
Object.assign(EJERCICIOS['femoral-sentado'], { g: 'femoral', z: ['femoral'], s: [], d: 60, t: 'Isquiotibiales: la parte de atrás del muslo.' });
Object.assign(EJERCICIOS['cruces-abajo'], { g: 'pecho', z: ['pecho'], s: ['deltoides'], d: 60, t: 'La parte alta del pecho, con tensión en todo el recorrido.' });
Object.assign(EJERCICIOS['fondos-maquina'], { g: 'triceps', z: ['triceps'], s: ['pecho'], d: 60, t: 'El tríceps empujando con carga guiada.' });
Object.assign(EJERCICIOS['remo-mancuernas-pecho'], { g: 'espalda', z: ['dorsal', 'trapecio'], s: ['biceps', 'deltoidesPost'], d: 90, t: 'Espalda media sin trampa: el pecho apoyado no deja ayudar con el cuerpo.' });
Object.assign(EJERCICIOS['pajaro'], { g: 'hombros', z: ['deltoidesPost'], s: ['trapecio'], d: 60, t: 'El hombro de atrás y la espalda alta.' });

// ── Semana B anterior (del 12 al 13 oct 2026) ──
// Ya no entra en la rotación: solo muestra los días que se anotaron con ella (sus puestos son "B2-…").
// series(n, …): n series de cada ejercicio. Cada ejercicio: [id, reps, clave del día, [alternativas], nota].
// En PLAN.B queda como [id, series, reps, nota, null, alternativas, clave], así lo demás de la app lo lee igual.
const series = (n, ...ej) => ({ n, ej });
function diaB1(t, sub, ...grupos) {
  return {
    t, sub, propia: true, pre: 'B2',
    e: grupos.flatMap(g => g.ej.map(([id, reps, clave, alts = [], nota = null]) => [id, g.n, reps, nota, null, alts.map(a => [a, g.n, reps]), clave])),
  };
}
const SEMANA_B1 = {
  lun: diaB1('Hombros + brazos', 'Bíceps y tríceps',
    series(3,
      ['militar-mancuernas', '12', 'Desde las orejas hacia arriba, sin arquear la espalda baja.', ['militar-hammer', 'press-arnold', 'press-hombro-maquina']],
      ['curl-predicador', '10', 'Brazos pegados al banco; no estires de golpe abajo.', ['predicador-maquina', 'predicador-mancuerna', 'curl-arana']],
      ['frances-z', '10', 'Barra a la frente; solo se mueven los codos.', ['frances-mancuernas', 'triceps-sobre-cabeza', 'extension-mancuerna-cabeza']]),
    series(3,
      ['frontal-z', '15', 'Brazos casi rectos al frente, hasta la altura de los hombros.', ['frontal-mancuernas', 'frontal-disco', 'frontal-polea']],
      ['curl-21-recta', '7+7+7', '7 abajo-mitad, 7 mitad-arriba y 7 completas.', ['curl-21', 'curl-barra-recta', 'curl-polea-barra']],
      ['triceps-cuerda', '20', 'Codos pegados; abre la cuerda al final.', ['triceps-polea', 'triceps-barra-v', 'triceps-un-brazo-polea']]),
    series(3,
      ['posterior-maquina', '12', 'Codos casi rectos, abre hacia atrás y aprieta.', ['pajaro', 'face-pull', 'posterior-polea']],
      ['martillo-sentado', '10', 'Palmas enfrentadas, sin impulso.', ['martillo-cuerda', 'curl-inverso-z', 'martillo-cruzado']],
      ['triceps-predicador', '12', 'Brazo apoyado; extiende completo.', ['triceps-un-brazo-polea', 'frances-una-mancuerna', 'patada-mancuerna']]),
    series(3,
      ['laterales', '15', 'Hasta la altura del hombro, codos un poco flexionados.', ['laterales-polea', 'laterales-maquina', 'laterales-pie']],
      ['curl-alterno', '12/brazo', 'Gira la muñeca al subir.', ['curl-z', 'curl-polea-baja', 'curl-inclinado']],
      ['patada-triceps-polea', '15/brazo', 'Inclinado, codo pegado, extiende hacia atrás.', ['patada-mancuerna', 'triceps-un-brazo-polea', 'fondos-banco']])),
  mar: diaB1('Piernas', 'Cuádriceps, femoral y glúteo',
    series(3,
      ['sentadilla-smith-adelantados', '12', 'Pies un poco adelante, baja a paralelo, rodillas alineadas con los pies.', ['sentadilla-goblet', 'sentadilla', 'sentadilla-hack', 'prensa']],
      ['prensa-horizontal', '12', 'Espalda pegada al respaldo; baja hasta 90° sin despegar los talones.', ['prensa', 'sentadilla-hack', 'sentadilla-goblet']],
      ['femoral-acostado', '12-15', 'Cadera pegada al banco, talones al glúteo.', ['femoral-fitball', 'nordico', 'rumano-una-pierna', 'femoral-mancuerna']],
      ['abductor', '15', 'Abre controlado y aprieta 1 s.', ['abduccion-polea', 'caminata-banda', 'abduccion-lado']]),
    series(3,
      ['rumano-barra', '12', 'Rodillas un poco flexionadas, cadera atrás, barra pegada a las piernas y espalda recta.', ['rumano-mancuernas', 'hiperextensiones', 'buenos-dias']],
      ['zancadas-caminando', '10/pierna', 'Pasos largos, rodilla de atrás casi al piso.', ['zancada-reversa', 'bulgara', 'step-up']]),
    series(4,
      ['hip-thrust', '10', 'Espalda alta en el banco, sube a línea recta y aprieta 1 s.', ['hip-thrust-smith', 'elevacion-pelvis', 'patada-gluteo-polea']],
      ['extensiones', '15', 'Aprieta 1 s arriba y baja lento.', ['sissy', 'goblet-talones', 'step-up']])),
  mie: diaB1('Pecho + abdomen', 'Pecho y abdomen',
    series(4,
      ['inclinado-mancuernas', '10', 'Banco a 30°, baja a los lados del pecho.', ['inclinado-barra', 'inclinado-maquina', 'inclinado-smith']],
      ['aperturas-maquina', '12', 'Codos un poco flexionados, aprieta al centro.', ['aperturas-mancuernas', 'cruces-medio', 'cruces-abajo']],
      ['crunch-lateral', '15/lado', 'Lento, sin impulso.', ['toques-talon', 'bicicleta', 'plancha-lateral']]),
    series(4,
      ['press-plano-barra', '10', 'Baja al pecho medio con los omóplatos juntos.', ['press-plano-mancuernas', 'press-pecho-maquina', 'plano-smith']],
      ['fondos-paralelas', 'máx. 15', 'Inclínate un poco al frente; baja hasta que los hombros queden a la altura de los codos.', ['fondos-asistidos', 'flexiones', 'fondos-banco'], 'al fallo técnico'],
      ['dead-bug', '10/lado', 'La espalda baja pegada al piso todo el tiempo.', ['plancha', 'crunch-inverso', 'plancha-rodillas']]),
    series(4,
      ['cruces-abajo', '12', 'Poleas bajas; sube las manos hacia arriba y al centro.', ['inclinado-cerrado', 'aperturas-inclinadas', 'inclinado-maquina']],
      ['fondos-maquina', '12', 'Codos atrás, hombros lejos de las orejas.', ['fondos-banco', 'triceps-cuerda', 'press-cerrado']],
      ['crunch-inverso', '15', 'Rodillas al pecho sin impulso; baja lento.', ['elevacion-piernas', 'tijeras', 'toques-talon']])),
  jue: diaB1('Espalda + trapecio', 'Y pantorrilla',
    series(1,
      ['jalon-brazos-rectos', '15', 'Ligero: baja la barra en arco hasta los muslos y aprieta los dorsales. Enciende la espalda antes de los remos.', ['pullover-cuerda']]),
    series(3,
      ['remo-una-mano', '10/brazo', 'Rodilla y mano en el banco; lleva el codo hacia la cadera.', ['remo-polea-un-brazo', 'remo-mancuernas-pecho', 'remo-maquina-un-brazo']],
      ['encogimientos-mancuernas', '15', 'Hombros hacia las orejas, pausa 1 s, sin girar.', ['encogimientos-smith', 'encogimientos-barra', 'encogimientos-maquina']]),
    series(3,
      ['jalon-ancho', '12-15', 'Barra al pecho alto, codos hacia abajo y atrás.', ['jalon-hammer', 'dominadas-asistidas', 'jalon-supino']],
      ['remo-polea-cerrado', '15', 'Torso fijo, codos atrás, aprieta 1 s.', ['remo-gironda', 'remo-maquina', 'remo-banda']],
      ['remo-menton-z', '15', 'Sube solo hasta el pecho; codos como máximo a la altura de los hombros.', ['remo-menton-polea', 'laterales', 'face-pull']]),
    series(3,
      ['remo-supino', '12', 'Palmas arriba, torso a 45°, barra al ombligo.', ['remo-barra', 'remo-polea-supino', 'remo-maquina']],
      ['encogimientos-barra', '20', 'Agarre cerrado, barra pegada al cuerpo, pausa arriba.', ['encogimientos-mancuernas', 'encogimientos-smith', 'encogimientos-maquina']]),
    series(3,
      ['pantorrilla-pie', '10+10+10', 'Pies cerrados, rectos y abiertos en la misma serie; recorrido completo.', ['pantorrilla-smith', 'pantorrilla-sentado', 'pantorrilla-una-pierna'], '3 posiciones'])),
  vie: diaB1('Espalda + hombros', 'Y abdomen',
    series(3,
      ['remo-barra', '8-10', 'Torso a 45°, barra al ombligo apretando los omóplatos.', ['remo-maquina', 'remo-mancuernas-pecho', 'remo-polea-abierto']],
      ['laterales', '10-12', 'Hasta la altura del hombro, codos un poco flexionados.', ['laterales-polea', 'laterales-maquina', 'laterales-pie']]),
    series(3,
      ['remo-mancuernas-pecho', '10', 'Pecho apoyado y codos atrás: el remo donde más se siente la espalda, porque no hay trampa.', ['remo-maquina', 'remo-gironda', 'remo-invertido']],
      ['pajaro', '12', 'Inclinado, codos casi rectos, abre los brazos.', ['posterior-maquina', 'face-pull', 'posterior-polea']]),
    series(3,
      ['jalon-v', '12', 'Al pecho con los codos pegados.', ['jalon-supino', 'dominadas-asistidas', 'jalon-un-brazo']],
      ['militar-hammer', '10', 'Empuja sin arquear la espalda baja.', ['militar-mancuernas', 'press-arnold', 'press-hombro-maquina']]),
    series(4,
      ['crunch-piso', '20', 'Lento, sin jalar el cuello.', ['crunch-inverso', 'toques-talon', 'bicicleta']],
      ['plancha', '45 s', 'Cuerpo recto, aprieta abdomen y glúteo.', ['plancha-rodillas', 'plancha-toque', 'dead-bug']],
      ['plancha-lateral', '30 s/lado', 'Codo bajo el hombro; la cadera no cae.', ['toques-talon', 'crunch-lateral', 'bicicleta']])),
};

// ── Semana B: complementa a la A ─────────────────────────────
// Mismos días y grupos que la A (así cada músculo se trabaja 2 veces por semana), con otros ejercicios.
// Casi todo con peso libre: el gimnasio es más de CrossFit y la sala de máquinas es pequeña.
// Un solo ejercicio de cada tipo de movimiento por día, nada de polea salvo el jalón del jueves, y sin circuitos.
// Cada ejercicio: [id, series, reps, descanso en s, consejo, [alternativas], nota]. Las alternativas usan las mismas series y reps.
function diaB(t, sub, comp, ...ej) {
  return {
    t, sub, comp, propia: true, pre: 'B3',
    e: ej.map(([id, n, reps, desc, tip, alts = [], nota = null]) => [id, n, reps, nota, desc, alts.map(a => [a, n, reps]), tip]),
  };
}
const SEMANA_B = {
  lun: diaB('Espalda + bíceps', 'Grosor y trapecio', 'remo con las palmas arriba, dominadas con banda en vez de jalón, pullover sin polea, trapecio y bíceps en banco inclinado.',
    ['remo-supino', 4, '8-10', 120, 'Palmas arriba, torso a 45°, barra al ombligo y codos pegados al cuerpo.', ['remo-barra', 'remo-mancuernas-supino', 'remo-una-mano']],
    ['dominadas-banda', 4, '6-8', 90, 'Desde los brazos estirados, pecho hacia la barra y baja en 3 s. Si llegas fácil a 8, usa una banda más delgada.', ['dominada-negativa', 'remo-invertido', 'jalon-ancho']],
    ['pullover-mancuerna', 3, '12', 60, 'Brazos casi rectos; baja detrás de la cabeza hasta sentir el dorsal y sube hasta el pecho.', ['pullover-disco', 'jalon-brazos-rectos']],
    ['encogimientos-mancuernas', 3, '12-15', 60, 'Hombros hacia las orejas, pausa 1 s arriba, sin girar.', ['encogimientos-barra', 'encogimientos-smith']],
    ['curl-z', 4, '8-10', 90, 'Codos pegados, sube sin impulso y baja en 2 s. Aquí un poco más de peso que en la A.', ['curl-barra-recta', 'curl-mancuernas', 'curl-alterno']],
    ['curl-inclinado', 3, '10-12', 60, 'Banco a 45°, brazos colgando hacia atrás; sube sin adelantar los codos.', ['curl-alterno', 'drag-curl', 'curl-mancuernas']]),
  mar: diaB('Piernas', 'Cuádriceps', 'prensa horizontal en vez de sentadilla con barra, step-up a una pierna, goblet con talones elevados y pantorrilla con mancuerna.',
    ['prensa-horizontal', 4, '10-12', 120, 'Espalda pegada al respaldo; baja hasta 90° sin despegar los talones.', ['prensa', 'sentadilla-goblet', 'sentadilla-smith-adelantados']],
    ['step-up', 3, '10/pierna', 90, 'Sube empujando con el talón de la pierna de arriba, sin impulsarte con la de abajo.', ['zancada-reversa', 'bulgara', 'desplantes']],
    ['goblet-talones', 3, '12-15', 60, 'Talones sobre un disco; baja profundo con el torso recto.', ['extensiones', 'sentadilla-goblet', 'sissy']],
    ['femoral-acostado', 3, '12', 60, 'Cadera pegada al banco, talones al glúteo.', ['femoral-fitball', 'femoral-mancuerna', 'nordico']],
    ['abductor', 3, '15', 60, 'Abre controlado y aprieta 1 s.', ['caminata-banda', 'abduccion-lado']],
    ['pantorrilla-una-pierna', 4, '12/pierna', 60, 'Pausa 2 s abajo estirando y 1 s arriba.', ['pantorrilla-pie', 'pantorrilla-smith']]),
  mie: diaB('Pecho + hombros', 'Tríceps y abdomen', 'aquí el pecho va primero y con barra; press de pie, laterales de pie, tríceps sin polea y otro abdomen.',
    ['press-plano-barra', 4, '8-10', 120, 'Omóplatos juntos, baja al pecho medio y pies firmes en el piso.', ['press-plano-mancuernas', 'flexiones', 'press-pecho-maquina']],
    ['militar-barra', 3, '8-10', 90, 'De pie, glúteo y abdomen apretados; empuja sin arquear la espalda baja.', ['militar-mancuernas', 'press-arnold', 'militar-hammer']],
    ['laterales-pie', 3, '12-15', 60, 'Sube hasta la altura del hombro y pausa 1 s arriba.', ['laterales', 'laterales-maquina', 'laterales-polea']],
    ['pajaro', 3, '12-15', 60, 'Inclinado, codos casi rectos; abre los brazos y aprieta atrás.', ['pull-apart', 'posterior-maquina', 'face-pull']],
    ['fondos-banco', 3, '10-15', 60, 'Manos en el borde del banco; baja hasta los codos a 90° y sube.', ['fondos-paralelas', 'press-cerrado', 'flexiones']],
    ['extension-mancuerna-cabeza', 3, '12', 60, 'Sentado, mancuerna con las dos manos detrás de la cabeza y codos apuntando arriba.', ['frances-mancuernas', 'patada-mancuerna', 'triceps-sobre-cabeza']],
    ['crunch-inverso', 3, '15', 60, 'Rodillas al pecho sin impulso; baja lento.', ['elevacion-piernas', 'tijeras', 'toques-talon']],
    ['plancha', 3, '45 s', 60, 'Cuerpo recto, aprieta abdomen y glúteo.', ['plancha-rodillas', 'plancha-toque', 'dead-bug']]),
  jue: diaB('Espalda + bíceps', 'Amplitud y zona lumbar', 'jalón con las palmas hacia ti, remo con pecho apoyado (el que más se siente en la espalda), zona lumbar y antebrazo.',
    ['jalon-supino', 4, '10-12', 120, 'Palmas hacia ti, al ancho de los hombros; barra al pecho alto con los codos hacia abajo.', ['dominadas-banda', 'dominadas-supinas', 'jalon-ancho']],
    ['remo-mancuernas-pecho', 4, '10-12', 90, 'Pecho apoyado en el banco inclinado; lleva los codos atrás y aprieta.', ['remo-una-mano', 'remo-barra', 'remo-maquina']],
    ['hiperextensiones', 3, '12-15', 60, 'Baja con la espalda recta y sube hasta quedar en línea con las piernas, sin pasarte hacia atrás.', ['buenos-dias', 'elevacion-pelvis', 'rumano-mancuernas']],
    ['curl-arana', 3, '10-12', 60, 'Pecho en el banco inclinado, brazos colgando; sube sin mover los codos.', ['curl-concentrado', 'curl-predicador', 'curl-inclinado']],
    ['curl-inverso-z', 3, '12', 60, 'Palmas hacia abajo y codos pegados: trabaja antebrazo y braquial.', ['curl-martillo', 'martillo-cruzado', 'martillo-sentado']]),
  vie: diaB('Piernas', 'Femoral, glúteo y abdomen', 'rumano con barra para más peso, zancada hacia atrás, sentadilla sumo para la parte de adentro del muslo y femoral sin máquina.',
    ['rumano-barra', 4, '8-10', 120, 'Rodillas un poco flexionadas, cadera atrás, barra pegada a las piernas y espalda recta.', ['rumano-mancuernas', 'rumano-una-pierna', 'buenos-dias']],
    ['zancada-reversa', 3, '10/pierna', 90, 'Paso largo hacia atrás, rodilla casi al piso; empuja con el talón de adelante.', ['bulgara', 'zancadas-caminando', 'step-up']],
    ['hip-thrust', 4, '10', 90, 'Espalda alta en el banco, barra sobre la cadera con almohadilla; sube a línea recta y aprieta 1 s.', ['puente-mancuerna', 'hip-thrust-smith', 'elevacion-pelvis']],
    ['sumo-mancuerna', 3, '12', 60, 'Pies abiertos y puntas afuera; las rodillas siguen a los pies.', ['sentadilla-goblet']],
    ['femoral-fitball', 3, '12', 60, 'Boca arriba, talones sobre la pelota; sube la cadera y trae la pelota hacia ti.', ['femoral-acostado', 'femoral-mancuerna', 'nordico']],
    ['pantorrilla-sentado-mancuerna', 3, '15', 60, 'Mancuerna sobre las rodillas y puntas en un disco; recorrido completo con pausa abajo.', ['pantorrilla-sentado', 'pantorrilla-una-pierna']],
    ['bicicleta', 3, '20', 60, 'Lento: codo hacia la rodilla contraria, sin jalar el cuello.', ['toques-talon', 'crunch-piso', 'dead-bug']],
    ['plancha-lateral', 3, '30 s/lado', 60, 'Codo bajo el hombro; la cadera no cae.', ['toques-talon', 'crunch-lateral', 'plancha']]),
};

export const PLAN = {
  A: {
    lun: { t: 'Espalda + bíceps', sub: 'Grosor', e: [
      ['remo-barra', 4, '8-10'], ['jalon-ancho', 4, '10-12'], ['remo-polea-cerrado', 3, '12'],
      ['curl-z', 4, '10'], ['curl-martillo', 3, '12']] },
    mar: { t: 'Piernas', sub: 'Cuádriceps', e: [
      ['sentadilla', 4, '8-10'], ['prensa', 3, '12'], ['zancadas-caminando', 3, '12/pierna'], ['extensiones', 4, '15'],
      ['femoral-acostado', 3, '12'], ['pantorrilla-pie', 4, '10+10+10', '3 posiciones']] },
    mie: { t: 'Hombros + tríceps', sub: 'Pecho y abdomen', e: [
      ['militar-mancuernas', 4, '10'], ['laterales', 4, '15'], ['posterior-maquina', 3, '15'],
      ['inclinado-mancuernas', 3, '10'], ['frances-z', 3, '10-12'], ['triceps-polea', 3, '12'],
      ['crunch-piso', 3, '20'], ['elevacion-piernas', 3, '15']] },
    jue: { t: 'Espalda + bíceps', sub: 'Amplitud', e: [
      ['remo-una-mano', 4, '10/brazo'], ['jalon-v', 4, '10-12'], ['jalon-brazos-rectos', 3, '12-15'],
      ['curl-predicador', 4, '10-12'], ['curl-concentrado', 3, '12']] },
    vie: { t: 'Piernas', sub: 'Femoral + glúteo', e: [VIERNES_A[0], ['prensa-horizontal', 3, '12', 'pies altos'], ...VIERNES_A.slice(1)] },
  },
  // Semana B: complementa a la A (ver SEMANA_B arriba)
  B: SEMANA_B,
  // Semana B del 12-13 oct 2026: solo para mostrar lo que se anotó con ella
  B1: SEMANA_B1,
  // Semana B anterior (hasta el 12 oct 2026). No entra en la rotación: solo sirve para mostrar los días
  // que ya se entrenaron con ella, con lo que se anotó (sus series se guardaron como "B-…").
  B0: Object.fromEntries(Object.entries({
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
  }).map(([d, x]) => [d, { ...x, pre: 'B' }])),
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

// Contexto para los dibujos: 'posición/implemento' (ver POSES en agarres.js); en piernas 'P:carga' (cómo se lleva el peso)
const CONTEXTO = {
  'remo-barra': 'colgando/barra', 'remo-mancuernas-pecho': 'colgando/mancuernas', 'remo-maquina': 'jalarFrente/manijas', 'remo-polea-abierto': 'jalarFrente/barraRemo',
  'jalon-ancho': 'arriba/barraJalon', 'dominadas-asistidas': 'arriba/barraFija', 'jalon-hammer': 'arriba/manijas', 'jalon-un-brazo': 'arriba/manija',
  'remo-polea-cerrado': 'jalarFrente/triangulo', 'remo-una-mano': 'colgando/mancuernaUna', 'remo-polea-un-brazo': 'jalarFrente/manija', 'jalon-v': 'arriba/triangulo',
  'jalon-supino': 'arriba/barraCorta', 'dominadas-supinas': 'arriba/barraFija', 'jalon-brazos-rectos': 'arriba/barraCorta', 'pullover-mancuerna': 'arriba/mancuerna1',
  'pullover-cuerda': 'arriba/cuerda', 'remo-supino': 'colgando/barra', 'remo-polea-supino': 'jalarFrente/barraCorta', 'remo-mancuernas-supino': 'colgando/mancuernas',
  'remo-gironda': 'jalarFrente/triangulo',
  'curl-z': 'colgando/barraZ', 'curl-barra-recta': 'colgando/barraCorta', 'curl-mancuernas': 'colgando/mancuernas', 'curl-polea-baja': 'colgando/barraCorta',
  'curl-martillo': 'colgando/mancuernas', 'martillo-cuerda': 'colgando/cuerda', 'curl-inverso-z': 'colgando/barraZ', 'curl-predicador': 'jalarFrente/barraZ',
  'predicador-maquina': 'jalarFrente/manijas', 'curl-arana': 'colgando/mancuernas', 'curl-polea-detras': 'colgando/manija', 'curl-concentrado': 'colgando/mancuernaUna',
  'curl-polea-una-mano': 'colgando/manija', 'curl-21': 'colgando/barraZ', 'drag-curl': 'colgando/barraZ', 'curl-polea-barra': 'colgando/barraCorta', 'martillo-sentado': 'colgando/mancuernas',
  'sentadilla': 'P:espalda', 'sentadilla-goblet': 'P:goblet', 'sentadilla-smith-adelantados': 'P:espalda', 'zancadas-caminando': 'P:lados', 'step-up': 'P:lados',
  'zancada-reversa': 'P:lados', 'goblet-talones': 'P:goblet', 'desplantes': 'P:lados', 'rumano-mancuernas': 'P:frenteMuslos', 'rumano-barra': 'P:colgandoBarra',
  'buenos-dias': 'P:espalda', 'bulgara': 'P:lados', 'hip-thrust': 'P:cadera', 'hip-thrust-smith': 'P:cadera', 'puente-mancuerna': 'P:caderaManc',
  'pantorrilla-smith': 'P:espalda', 'pantorrilla-una-pierna': 'P:unaMano', 'pantorrilla-sentado-mancuerna': 'P:rodilla',
  'militar-mancuernas': 'empujeArriba/mancuernas', 'militar-hammer': 'empujeArriba/manijas', 'press-arnold': 'empujeArriba/mancuernas', 'militar-barra': 'empujeArriba/barra',
  'laterales': 'colgando/mancuernas', 'laterales-polea': 'colgando/manija', 'posterior-maquina': 'jalarFrente/manijas', 'pajaro': 'colgando/mancuernas',
  'posterior-polea': 'jalarFrente/manijas', 'face-pull': 'jalarCara/cuerda',
  'inclinado-mancuernas': 'empujeFrente/mancuernas', 'inclinado-barra': 'empujeFrente/barra', 'inclinado-maquina': 'empujeFrente/manijas', 'cruces-abajo': 'jalarFrente/manijas',
  'press-plano-barra': 'empujeFrente/barra', 'press-plano-mancuernas': 'empujeFrente/mancuernas', 'press-pecho-maquina': 'empujeFrente/manijas', 'flexiones': 'piso/piso',
  'frances-z': 'empujeArriba/barraZ', 'frances-mancuernas': 'empujeArriba/mancuernas', 'triceps-sobre-cabeza': 'empujeArriba/cuerda', 'triceps-polea': 'triceps/barraCorta',
  'triceps-cuerda': 'triceps/cuerda', 'fondos-maquina': 'triceps/manijas', 'triceps-predicador': 'empujeFrente/mancuernaUna', 'triceps-un-brazo-polea': 'triceps/manija',
  'frances-una-mancuerna': 'empujeArriba/mancuerna1', 'patada-triceps-polea': 'colgando/manija', 'patada-mancuerna': 'colgando/mancuernaUna',
  'crunch-maquina': 'espalda/manijas', 'crunch-polea': 'espalda/cuerda', 'elevacion-colgado': 'arriba/barraFija', 'rodillas-paralelas': 'triceps/manijas', 'russian-twist': 'sostener/mancuerna1',
};
for (const [id, c] of Object.entries(CONTEXTO)) {
  const a = AGARRES[id];
  if (!a) continue;
  if (c.startsWith('P:')) a.carga = c.slice(2); else [a.pos, a.imp] = c.split('/');
}

// ── Agarres de los ejercicios nuevos de la Semana B ──
const AGARRES_B = {
  'frontal-z': ag('pronado', 'hombros', 'ninguno', 'Brazos casi rectos, sube hasta los hombros', D),
  'curl-21-recta': ag('supino', 'hombros', 'ninguno', 'Codos pegados en las tres partes', D),
  'curl-alterno': ag('supino', 'n/a', 'ninguno', 'Gira la muñeca al subir'),
  'aperturas-maquina': ag('neutro', 'n/a', 'ninguno', 'Manijas a la altura del pecho, codos un poco flexionados', D),
  'crunch-lateral-maquina': ag('neutro', 'n/a', 'ninguno', 'Sujeta las manijas sin jalar con los brazos', D),
  'fondos-paralelas': ag('neutro', 'hombros', 'ninguno', 'Manos en las barras, hombros lejos de las orejas', D),
  'rueda': ag('pronado', 'hombros', 'ninguno', 'Manos en las manijas de la rueda, muñecas rectas', D),
  'elevacion-paralelas': ag('neutro', 'n/a', 'ninguno', 'Antebrazos apoyados, sujeta las manijas', D),
  'encogimientos-mancuernas': ag('neutro', 'n/a', 'ninguno', 'Mancuernas a los lados, palmas hacia las piernas', D),
  'encogimientos-barra': ag('pronado', 'cerrado', 'ninguno', 'Agarre cerrado, barra pegada a los muslos', D),
  'remo-menton-z': ag('pronado', 'hombros', 'ninguno', 'Barra pegada al cuerpo, codos arriba de las manos', D),
  'stir-pot': ag('ninguno', 'n/a', 'fitball', 'Antebrazos en la pelota, cadera quieta', D),
  'press-hombro-maquina': ag('neutro/pronado', 'n/a', 'ninguno', 'Elige la manija más cómoda para tu hombro', D),
  'predicador-mancuerna': ag('supino', 'n/a', 'ninguno', 'Brazo apoyado en el cojín, codo fijo', D),
  'extension-mancuerna-cabeza': ag('neutro', 'n/a', 'ninguno', 'Ambas manos bajo el disco de arriba', D),
  'frontal-mancuernas': ag('pronado', 'n/a', 'ninguno', 'Palmas hacia los muslos, sube al frente', D),
  'frontal-disco': ag('neutro', 'n/a', 'ninguno', 'Manos a los lados del disco', D),
  'frontal-polea': ag('pronado', 'n/a', 'manija', 'Polea baja detrás de ti, sube al frente', D),
  'triceps-barra-v': ag('diagonal', 'cerrado', 'barra-z', 'Manos en la V, codos pegados', D),
  'martillo-cruzado': ag('neutro', 'n/a', 'ninguno', 'Palma hacia adentro, cruza al hombro contrario', D),
  'laterales-pie': ag('pronado', 'n/a', 'ninguno', 'Palmas hacia el piso, codos un poco flexionados'),
  'curl-inclinado': ag('supino', 'n/a', 'ninguno', 'Brazos colgando por detrás del cuerpo', D),
  'fondos-banco': ag('pronado', 'hombros', 'ninguno', 'Dedos al frente, hombros lejos de las orejas'),
  'abduccion-lado': ag('ninguno', 'n/a', 'ninguno', 'Sin agarre; la cabeza apoyada en el brazo', D),
  'aperturas-mancuernas': ag('neutro', 'n/a', 'ninguno', 'Palmas enfrentadas, codos un poco flexionados', D),
  'cruces-medio': ag('neutro', 'n/a', 'manija', 'Una manija en cada mano, codos un poco flexionados', D),
  'lenador-polea': ag('neutro', 'n/a', 'manija', 'Ambas manos entrelazadas, gira desde la cadera'),
  'inclinado-smith': ag('pronado', 'ancho', 'ninguno', 'Igual que el plano: antebrazos verticales abajo'),
  'plano-smith': ag('pronado', 'ancho', 'ninguno', 'Antebrazos verticales abajo, pulgares rodeando siempre'),
  'fondos-asistidos': ag('neutro', 'hombros', 'ninguno', 'Manos en las agarraderas, hombros lejos de las orejas', D),
  'plancha-desplazamiento': ag('ninguno', 'n/a', 'ninguno', 'Sin agarre; apoyo en los antebrazos'),
  'rollout-fitball': ag('ninguno', 'n/a', 'fitball', 'Antebrazos en la pelota, espalda sin arquear', D),
  'inclinado-cerrado': ag('pronado', 'hombros', 'ninguno', 'Manos al ancho de los hombros, codos pegados', D),
  'aperturas-inclinadas': ag('neutro', 'n/a', 'ninguno', 'Palmas enfrentadas, codos un poco flexionados', D),
  'press-cerrado': ag('pronado', 'hombros', 'ninguno', 'Manos al ancho de los hombros, codos pegados', D),
  'crunch-inverso': ag('ninguno', 'n/a', 'ninguno', 'Manos a los lados en el piso', D),
  'remo-maquina-un-brazo': ag('neutro', 'n/a', 'ninguno', 'Pecho en el apoyo, lleva el codo atrás', D),
  'encogimientos-smith': ag('pronado', 'hombros', 'ninguno', 'Barra pegada a los muslos', D),
  'encogimientos-maquina': ag('neutro', 'n/a', 'ninguno', 'Sujeta las manijas a los lados', D),
  'remo-banda': ag('neutro', 'hombros', 'banda', 'Banda atada al frente, codos atrás'),
  'remo-menton-polea': ag('pronado', 'cerrado', 'barra-recta', 'Barra pegada al cuerpo, codos arriba de las manos', D),
  'remo-invertido': ag('pronado', 'ancho', 'ninguno', 'Cuerpo recto, pecho a la barra'),
  'crunch-fitball': ag('ninguno', 'n/a', 'fitball', 'Manos en el pecho o junto a las orejas', D),
  'plancha-rodillas': ag('ninguno', 'n/a', 'ninguno', 'Sin agarre; apoyo en los antebrazos'),
};
const CONTEXTO_B = {
  'frontal-z': 'colgando/barraZ', 'curl-21-recta': 'colgando/barraCorta', 'curl-alterno': 'colgando/mancuernas', 'aperturas-maquina': 'empujeFrente/manijas',
  'crunch-lateral-maquina': 'espalda/manijas', 'fondos-paralelas': 'triceps/manijas', 'rueda': 'jalarFrente/manijas', 'elevacion-paralelas': 'triceps/manijas',
  'encogimientos-mancuernas': 'colgando/mancuernas', 'encogimientos-barra': 'colgando/barra', 'remo-menton-z': 'colgando/barraZ',
  'press-hombro-maquina': 'empujeArriba/manijas', 'predicador-mancuerna': 'jalarFrente/mancuernaUna', 'extension-mancuerna-cabeza': 'empujeArriba/mancuerna1',
  'frontal-mancuernas': 'colgando/mancuernas', 'frontal-disco': 'colgando/mancuerna1', 'frontal-polea': 'colgando/manija', 'triceps-barra-v': 'triceps/barraZ',
  'martillo-cruzado': 'colgando/mancuernaUna', 'laterales-pie': 'colgando/mancuernas', 'curl-inclinado': 'colgando/mancuernas', 'fondos-banco': 'triceps/manijas',
  'aperturas-mancuernas': 'empujeFrente/mancuernas', 'cruces-medio': 'empujeFrente/manijas', 'lenador-polea': 'jalarFrente/manijaJuntas',
  'inclinado-smith': 'empujeFrente/barra', 'plano-smith': 'empujeFrente/barra', 'fondos-asistidos': 'triceps/manijas', 'inclinado-cerrado': 'empujeFrente/barra',
  'aperturas-inclinadas': 'empujeFrente/mancuernas', 'press-cerrado': 'empujeFrente/barra', 'remo-maquina-un-brazo': 'jalarFrente/manija',
  'encogimientos-smith': 'colgando/barra', 'encogimientos-maquina': 'colgando/manijas', 'remo-banda': 'jalarFrente/banda', 'remo-menton-polea': 'colgando/barraCorta',
  'remo-invertido': 'arriba/barraFija',
};
Object.assign(AGARRES, AGARRES_B);
for (const [id, c] of Object.entries(CONTEXTO_B)) {
  const a = AGARRES[id];
  if (!a) continue;
  if (c.startsWith('P:')) a.carga = c.slice(2); else [a.pos, a.imp] = c.split('/');
}
for (const id of Object.keys(AGARRES_B)) if (EJERCICIOS[id]) EJERCICIOS[id].agarre = AGARRES[id];

// ── v17: prensa horizontal y alternativas de femoral sin máquina ──
Object.assign(AGARRES, {
  'prensa-horizontal': ag('ninguno', 'n/a', 'ninguno', 'Las manijas laterales solo sirven para sujetarte'),
  'rumano-una-pierna': ag('neutro', 'n/a', 'ninguno', 'Mancuerna en la mano contraria a la pierna de apoyo', D),
  'femoral-mancuerna': ag('ninguno', 'n/a', 'ninguno', 'Manos sujetando el banco; la mancuerna va entre los pies', D),
});
AGARRES['rumano-una-pierna'].carga = 'unaMano';
for (const id of ['prensa-horizontal', 'rumano-una-pierna', 'femoral-mancuerna']) EJERCICIOS[id].agarre = AGARRES[id];

// ── Equipo que puede no haber en el gimnasio ──
// Si está marcado como "no lo tengo" (ajustes.sinEquipo), esos ejercicios no aparecen:
// en la rutina se cambian solos por la primera alternativa que sí se pueda hacer.
export const EQUIPO = {
  'femoral-sentado': { n: 'Máquina de femoral sentado', ej: ['femoral-sentado'] },
  'hexagonal': { n: 'Barra hexagonal', ej: [] },
  'prensa': { n: 'Prensa de piernas 45°', ej: ['prensa'] },
  'prensa-horizontal': { n: 'Prensa horizontal (de empuje)', ej: ['prensa-horizontal'] },
  'hack': { n: 'Máquina de sentadilla hack', ej: ['sentadilla-hack'] },
  'paralelas': { n: 'Paralelas', ej: ['fondos-paralelas', 'elevacion-paralelas', 'rodillas-paralelas'] },
  'rueda': { n: 'Rueda abdominal', ej: ['rueda'] },
  'fitball': { n: 'Pelota grande (fitball)', ej: ['femoral-fitball', 'stir-pot', 'rollout-fitball', 'crunch-fitball'] },
};
export const SIN_EQUIPO_INICIAL = ['femoral-sentado', 'hexagonal'];

// ── v18: abdomen de piso ──
Object.assign(AGARRES, {
  'toques-talon': ag('ninguno', 'n/a', 'ninguno', 'Manos estiradas hacia los talones', D),
  'bicicleta': ag('ninguno', 'n/a', 'ninguno', 'Manos junto a las orejas, sin jalar el cuello', D),
  'tijeras': ag('ninguno', 'n/a', 'ninguno', 'Manos bajo la cadera', D),
});
for (const id of ['toques-talon', 'bicicleta', 'tijeras']) EJERCICIOS[id].agarre = AGARRES[id];
for (const id of ['toques-talon', 'bicicleta', 'tijeras', 'crunch-piso', 'crunch-inverso', 'dead-bug', 'plancha-lateral']) INICIO[id] ||= [0, 'corp'];

// ── Semana B complementaria: ejercicios que pasan a ser principales y los nuevos ──
Object.assign(EJERCICIOS, {
  'dominadas-banda': { n: 'Dominadas con banda', g: 'espalda', z: ['dorsal'], s: ['biceps', 'trapecio', 'deltoidesPost'], d: 90,
    t: 'Amplitud de espalda con tu propio peso: la banda te ayuda en la parte difícil.',
    p: ['Engancha la banda en la barra y mete una rodilla o un pie.', 'Agarre un poco más ancho que los hombros, brazos estirados.', 'Sube llevando el pecho hacia la barra.', 'Baja lento en 3 s hasta estirar los brazos.'] },
  'dominada-negativa': { n: 'Dominada negativa', p: ['Sube con un salto o desde un cajón hasta tener la barbilla sobre la barra, y baja lo más lento que puedas (4 s).'] },
  'pullover-disco': { n: 'Pullover con disco', p: ['Acostado en el banco, un disco con las dos manos; bájalo detrás de la cabeza con los brazos casi rectos y súbelo al pecho.'] },
  'pull-apart': { n: 'Pull-apart con banda', p: ['Banda con los brazos rectos al frente; ábrela hasta tocar el pecho apretando los omóplatos.'] },
  'sumo-mancuerna': { n: 'Sentadilla sumo con mancuerna', g: 'femoral', z: ['gluteo', 'cuadriceps'], s: ['femoral'], d: 60,
    t: 'Glúteo y la parte de adentro del muslo (aductores).',
    p: ['Pies más abiertos que los hombros, puntas hacia afuera.', 'Mancuerna colgando entre las piernas, sujeta por el disco de arriba.', 'Baja con el torso recto; las rodillas siguen a los pies.', 'Sube apretando el glúteo.'] },
});
const completar = (id, x) => Object.assign(EJERCICIOS[id], x);
completar('pullover-mancuerna', { g: 'espalda', z: ['dorsal'], s: ['pecho', 'triceps'], d: 60, t: 'El dorsal sin polea, con los brazos casi rectos.',
  p: ['Acostado en el banco, una mancuerna con las dos manos sobre el pecho.', 'Brazos casi rectos.', 'Bájala detrás de la cabeza hasta sentir el dorsal.', 'Súbela hasta el pecho sin doblar los codos.'] });
completar('jalon-supino', { g: 'espalda', z: ['dorsal'], s: ['biceps', 'trapecio'], d: 90, t: 'El dorsal de abajo, con más ayuda del bíceps por las palmas hacia ti.',
  p: ['Palmas hacia ti, manos al ancho de los hombros.', 'Saca el pecho.', 'Baja la barra al pecho alto con los codos hacia abajo.', 'Sube lento hasta estirar.'] });
completar('curl-inclinado', { g: 'biceps', z: ['biceps'], s: ['antebrazo'], d: 60, t: 'La cabeza larga del bíceps (la de afuera), bien estirada por el banco inclinado.',
  p: ['Banco a 45°, espalda apoyada.', 'Brazos colgando hacia atrás, palmas al frente.', 'Sube sin adelantar los codos.', 'Baja lento hasta estirar.'] });
completar('step-up', { g: 'cuadriceps', z: ['cuadriceps', 'gluteo'], s: ['femoral'], d: 90, t: 'Cuádriceps y glúteo de cada pierna por separado.',
  p: ['Una mancuerna en cada mano, frente a un banco o cajón.', 'Pon un pie completo arriba.', 'Sube empujando con el talón de esa pierna, sin impulsarte con la de abajo.', 'Baja lento y termina las de un lado antes de cambiar.'] });
completar('goblet-talones', { g: 'cuadriceps', z: ['cuadriceps'], s: ['gluteo'], d: 60, t: 'El cuádriceps, sobre todo cerca de la rodilla, sin máquina.',
  p: ['Talones sobre un disco, pies al ancho de la cadera.', 'Mancuerna pegada al pecho.', 'Baja profundo con el torso recto.', 'Sube sin despegar los talones del disco.'] });
completar('pantorrilla-una-pierna', { g: 'pantorrilla', z: ['pantorrilla'], s: [], d: 60, t: 'El gemelo de cada pierna por separado.',
  p: ['Punta del pie en un escalón o disco, mancuerna en la mano del mismo lado.', 'La otra mano en la pared.', 'Baja el talón y pausa 2 s estirando.', 'Sube lo más alto que puedas y pausa 1 s.'] });
completar('militar-barra', { g: 'hombros', z: ['deltoides'], s: ['triceps', 'trapecio', 'abdomen'], d: 90, t: 'Hombro completo de pie: el abdomen y el glúteo te sostienen.',
  p: ['De pie, barra a la altura de la clavícula.', 'Glúteo y abdomen apretados.', 'Empuja hacia arriba pasando la barra cerca de la cara.', 'Baja controlado sin arquear la espalda baja.'] });
completar('laterales-pie', { g: 'hombros', z: ['deltoides'], s: ['trapecio'], d: 60, t: 'Deltoides lateral: los hombros más anchos.',
  p: ['De pie, mancuernas a los lados.', 'Codos un poco flexionados.', 'Sube hasta la altura del hombro y pausa 1 s.', 'Baja lento.'] });
completar('fondos-banco', { g: 'triceps', z: ['triceps'], s: ['pecho', 'deltoides'], d: 60, t: 'El tríceps con tu propio peso, solo con un banco.',
  p: ['Manos en el borde de un banco, dedos al frente.', 'Piernas al frente; dobladas es más fácil.', 'Baja doblando los codos hacia atrás hasta 90°.', 'Sube hasta estirar los brazos.'] });
completar('extension-mancuerna-cabeza', { g: 'triceps', z: ['triceps'], s: [], d: 60, t: 'La cabeza larga del tríceps, la que le da volumen al brazo.',
  p: ['Sentado con la espalda recta.', 'Una mancuerna con las dos manos detrás de la cabeza.', 'Codos apuntando arriba, sin abrirse.', 'Extiende hacia arriba y baja lento.'] });
completar('hiperextensiones', { g: 'espalda', z: ['lumbar'], s: ['gluteo', 'femoral'], d: 60, t: 'La zona lumbar (espalda baja), con ayuda del glúteo.',
  p: ['En el banco romano, cadera apoyada en el cojín.', 'Brazos cruzados sobre el pecho.', 'Baja con la espalda recta.', 'Sube hasta quedar en línea con las piernas, sin pasarte hacia atrás.'] });
completar('curl-arana', { g: 'biceps', z: ['biceps'], s: [], d: 60, t: 'El pico del bíceps: con el pecho apoyado no hay trampa.',
  p: ['Pecho apoyado en un banco inclinado.', 'Brazos colgando hacia el piso.', 'Sube sin mover los codos.', 'Aprieta arriba y baja lento.'] });
completar('curl-inverso-z', { g: 'biceps', z: ['antebrazo', 'biceps'], s: [], d: 60, t: 'Antebrazo y braquial: le dan grosor al brazo.',
  p: ['De pie, palmas hacia abajo.', 'Codos pegados al cuerpo.', 'Sube sin impulso.', 'Baja en 2 s.'] });
completar('zancada-reversa', { g: 'cuadriceps', z: ['cuadriceps', 'gluteo'], s: ['femoral'], d: 90, t: 'Glúteo y cuádriceps, más suave para la rodilla que la zancada al frente.',
  p: ['Una mancuerna en cada mano.', 'Da un paso largo hacia atrás.', 'Baja hasta que la rodilla de atrás casi toque el piso.', 'Vuelve empujando con el talón de adelante.'] });
completar('femoral-fitball', { g: 'femoral', z: ['femoral'], s: ['gluteo'], d: 60, t: 'Femoral y glúteo sin máquina.',
  p: ['Boca arriba, talones sobre la pelota.', 'Sube la cadera.', 'Trae la pelota hacia ti doblando las rodillas.', 'Estira lento sin bajar la cadera.'] });
completar('pantorrilla-sentado-mancuerna', { g: 'pantorrilla', z: ['pantorrilla'], s: [], d: 60, t: 'El sóleo, la parte baja de la pantorrilla, sin máquina.',
  p: ['Sentado en un banco, puntas sobre un disco.', 'Mancuerna sobre las rodillas.', 'Sube lo más alto que puedas.', 'Baja hasta estirar y pausa.'] });
Object.assign(INICIO, { 'dominadas-banda': [0, 'corp'], 'dominada-negativa': [0, 'corp'], 'pullover-disco': [10, 'una'], 'pull-apart': [0, 'banda'], 'sumo-mancuerna': [35, 'una'] });
Object.assign(AGARRES, {
  'dominadas-banda': ag('pronado', 'ancho', 'banda', 'Rodilla o pie en la banda; pecho hacia la barra', D),
  'dominada-negativa': ag('pronado', 'ancho', 'ninguno', 'Sube con un salto y baja en 4 s', D),
  'pullover-disco': ag('neutro', 'n/a', 'ninguno', 'Disco agarrado por los lados con las dos manos', D),
  'pull-apart': ag('pronado', 'hombros', 'banda', 'Brazos rectos al frente, abre hasta el pecho', D),
  'sumo-mancuerna': ag('neutro', 'n/a', 'ninguno', 'Mancuerna colgando entre las piernas, sujeta por el disco de arriba', D),
});
Object.assign(AGARRES['dominadas-banda'], { pos: 'arriba', imp: 'barraFija' });
Object.assign(AGARRES['dominada-negativa'], { pos: 'arriba', imp: 'barraFija' });
Object.assign(AGARRES['pullover-disco'], { pos: 'arriba', imp: 'mancuerna1' });
Object.assign(AGARRES['pull-apart'], { pos: 'jalarFrente', imp: 'banda' });
AGARRES['sumo-mancuerna'].carga = 'goblet';
for (const id of ['dominadas-banda', 'dominada-negativa', 'pullover-disco', 'pull-apart', 'sumo-mancuerna']) EJERCICIOS[id].agarre = AGARRES[id];
