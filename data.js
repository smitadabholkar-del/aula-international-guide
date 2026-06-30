// Initial data for Spanish Study Assistant (Aula internacional 2 plus, Units 1-4)
// This file contains pre-populated datasets that will be imported into local storage.

const INITIAL_VOCABULARY = [
  // Unidad 1: El español y tú
  { id: 'v_1_1', unit: 1, word: 'sentirse ridículo/a', translation: 'to feel ridiculous', type: 'phrase', example: 'Me siento ridículo cuando hablo inglés.', exampleTranslation: 'I feel ridiculous when I speak English.', category: 'Emotions' },
  { id: 'v_1_2', unit: 1, word: 'dar vergüenza', translation: 'to feel embarrassed / shy', type: 'phrase', example: 'A mí me da vergüenza hablar en público.', exampleTranslation: 'It makes me feel embarrassed to speak in public.', category: 'Emotions' },
  { id: 'v_1_3', unit: 1, word: 'dar miedo', translation: 'to scare / make afraid', type: 'phrase', example: 'Me da miedo cometer errores al hablar.', exampleTranslation: 'It scares me to make mistakes when speaking.', category: 'Emotions' },
  { id: 'v_1_4', unit: 1, word: 'hacer el ridículo', translation: 'to make a fool of oneself', type: 'phrase', example: 'No te preocupes por hacer el ridículo.', exampleTranslation: "Don't worry about making a fool of yourself.", category: 'Emotions' },
  { id: 'v_1_5', unit: 1, word: 'inseguro/a', translation: 'insecure', type: 'adjective', example: 'Al principio es normal sentirse inseguro.', exampleTranslation: 'At first, it is normal to feel insecure.', category: 'Adjectives' },
  { id: 'v_1_6', unit: 1, word: 'frustrado/a', translation: 'frustrated', type: 'adjective', example: 'Me siento frustrado cuando no me salen las palabras.', exampleTranslation: 'I feel frustrated when the words don\'t come out.', category: 'Adjectives' },
  { id: 'v_1_7', unit: 1, word: 'costar (o-ue)', translation: 'to cost / to be difficult for someone', type: 'verb', example: 'Me cuesta recordar las conjugaciones.', exampleTranslation: 'It is hard for me to remember the conjugations.', category: 'Grammar' },
  { id: 'v_1_8', unit: 1, word: 'resultar fácil/difícil', translation: 'to turn out easy/difficult', type: 'phrase', example: 'Me resulta fácil entender español cuando leo.', exampleTranslation: 'It is easy for me to understand Spanish when I read.', category: 'Learning' },
  { id: 'v_1_9', unit: 1, word: 'desde hace', translation: 'for (duration of time)', type: 'preposition', example: 'Estudio español desde hace dos años.', exampleTranslation: 'I have been studying Spanish for two years.', category: 'Grammar' },
  { id: 'v_1_10', unit: 1, word: 'desde', translation: 'since (specific point in time)', type: 'preposition', example: 'Vivo en esta ciudad desde el año pasado.', exampleTranslation: 'I have lived in this city since last year.', category: 'Grammar' },

  // Unidad 2: Una vida de película
  { id: 'v_2_1', unit: 2, word: 'nacer', translation: 'to be born', type: 'verb', example: 'Nací en Nueva York en 1995.', exampleTranslation: 'I was born in New York in 1995.', category: 'Biography' },
  { id: 'v_2_2', unit: 2, word: 'superar', translation: 'to overcome / pass', type: 'verb', example: 'Logró superar muchos obstáculos en su vida.', exampleTranslation: 'He/She managed to overcome many obstacles in his/her life.', category: 'Biography' },
  { id: 'v_2_3', unit: 2, word: 'empezar a (+ inf)', translation: 'to start doing something', type: 'phrase', example: 'Empezó a estudiar piano a los seis años.', exampleTranslation: 'He/She started studying piano at six years old.', category: 'Grammar' },
  { id: 'v_2_4', unit: 2, word: 'volver a (+ inf)', translation: 'to do something again', type: 'phrase', example: 'Volvió a actuar en teatro en 2020.', exampleTranslation: 'He/She returned to acting in theater in 2020.', category: 'Grammar' },
  { id: 'v_2_5', unit: 2, word: 'grabar', translation: 'to record / film', type: 'verb', example: 'La banda grabó su primer disco en Madrid.', exampleTranslation: 'La band recorded their first album in Madrid.', category: 'Cinema' },
  { id: 'v_2_6', unit: 2, word: 'tener éxito', translation: 'to be successful', type: 'phrase', example: 'Su última película tuvo mucho éxito.', exampleTranslation: 'His/Her last movie was very successful.', category: 'Biography' },
  { id: 'v_2_7', unit: 2, word: 'morir (o-ue/u)', translation: 'to die', type: 'verb', example: 'El escritor murió en París.', exampleTranslation: 'The writer died in Paris.', category: 'Biography' },
  { id: 'v_2_8', unit: 2, word: 'ganar un premio', translation: 'to win a prize / award', type: 'phrase', example: 'Ella ganó un premio por su trabajo social.', exampleTranslation: 'She won an award for her social work.', category: 'Biography' },
  { id: 'v_2_9', unit: 2, word: 'durante', translation: 'during / for (past block of time)', type: 'preposition', example: 'Viví en España durante tres años.', exampleTranslation: 'I lived in Spain for three years.', category: 'Grammar' },
  { id: 'v_2_10', unit: 2, word: 'hasta', translation: 'until', type: 'preposition', example: 'Trabajó allí hasta su jubilación.', exampleTranslation: 'He/She worked there until his/her retirement.', category: 'Grammar' },

  // Unidad 3: Yo soy así
  { id: 'v_3_1', unit: 3, word: 'llevarse bien/mal con', translation: 'to get along well/badly with', type: 'phrase', example: 'Me llevo muy bien con mi profesor.', exampleTranslation: 'I get along very well with my teacher.', category: 'Relationships' },
  { id: 'v_3_2', unit: 3, word: 'caer bien/mal a alguien', translation: 'to make a good/bad impression on someone', type: 'phrase', example: 'Mi nuevo compañero de piso me cae muy bien.', exampleTranslation: 'I like my new flatmate very much.', category: 'Relationships' },
  { id: 'v_3_3', unit: 3, word: 'parecerse a', translation: 'to look like / resemble', type: 'phrase', example: 'Me parezco mucho a mi madre en el carácter.', exampleTranslation: 'I look a lot like my mother in character.', category: 'Relationships' },
  { id: 'v_3_4', unit: 3, word: 'tímido/a', translation: 'shy', type: 'adjective', example: 'Ella es tímida pero muy simpática.', exampleTranslation: 'She is shy but very friendly.', category: 'Personality' },
  { id: 'v_3_5', unit: 3, word: 'sociable', translation: 'sociable / outgoing', type: 'adjective', example: 'Es un hombre sociable que tiene muchos amigos.', exampleTranslation: 'He is an outgoing man who has many friends.', category: 'Personality' },
  { id: 'v_3_6', unit: 3, word: 'exigente', translation: 'demanding / picky', type: 'adjective', example: 'Nuestra profesora de español es exigente pero justa.', exampleTranslation: 'Our Spanish teacher is demanding but fair.', category: 'Personality' },
  { id: 'v_3_7', unit: 3, word: 'generoso/a', translation: 'generous', type: 'adjective', example: 'Es muy generoso con su tiempo.', exampleTranslation: 'He is very generous with his time.', category: 'Personality' },
  { id: 'v_3_8', unit: 3, word: 'mentiroso/a', translation: 'liar / untruthful', type: 'adjective', example: 'No confío en él porque es un mentiroso.', exampleTranslation: 'I don\'t trust him because he is a liar.', category: 'Personality' },
  { id: 'v_3_9', unit: 3, word: 'ordenado/a', translation: 'organized / tidy', type: 'adjective', example: 'Mi escritorio es muy ordenado.', exampleTranslation: 'My desk is very tidy.', category: 'Personality' },
  { id: 'v_3_10', unit: 3, word: 'desordenado/a', translation: 'disorganized / messy', type: 'adjective', example: 'Tengo una habitación bastante desordenada.', exampleTranslation: 'I have a rather messy room.', category: 'Personality' },

  // Unidad 4: Hogar, dulce hogar
  { id: 'v_4_1', unit: 4, word: 'alquiler', translation: 'rent / rental', type: 'noun', example: 'El alquiler de este piso cuesta 800 euros.', exampleTranslation: 'The rent of this apartment costs 800 euros.', category: 'Housing' },
  { id: 'v_4_2', unit: 4, word: 'piso', translation: 'apartment / flat', type: 'noun', example: 'Compartimos un piso luminoso en el centro.', exampleTranslation: 'We share a bright apartment in the center.', category: 'Housing' },
  { id: 'v_4_3', unit: 4, word: 'chalé', translation: 'villa / detached house', type: 'noun', example: 'Viven en un chalé con piscina.', exampleTranslation: 'They live in a villa with a pool.', category: 'Housing' },
  { id: 'v_4_4', unit: 4, word: 'estantería', translation: 'bookshelf / shelving unit', type: 'noun', example: 'Puse los libros en la estantería del salón.', exampleTranslation: 'I put the books on the living room shelf.', category: 'Furniture' },
  { id: 'v_4_5', unit: 4, word: 'luminoso/a', translation: 'bright / full of light', type: 'adjective', example: 'Tiene un salón muy luminoso con vistas al parque.', exampleTranslation: 'It has a very bright living room with views of the park.', category: 'Housing' },
  { id: 'v_4_6', unit: 4, word: 'afueras', translation: 'outskirts / suburbs', type: 'noun', example: 'Vivimos en las afueras de la ciudad.', exampleTranslation: 'We live on the outskirts of the city.', category: 'Housing' },
  { id: 'v_4_7', unit: 4, word: 'electrodomésticos', translation: 'appliances', type: 'noun', example: 'La cocina viene equipada con electrodomésticos.', exampleTranslation: 'The kitchen comes equipped with appliances.', category: 'Furniture' },
  { id: 'v_4_8', unit: 4, word: 'barrio', translation: 'neighborhood', type: 'noun', example: 'Este es un barrio muy tranquilo e histórico.', exampleTranslation: 'This is a very quiet and historic neighborhood.', category: 'Housing' },
  { id: 'v_4_9', unit: 4, word: 'sofá', translation: 'sofa / couch', type: 'noun', example: 'El sofá de cuero es muy cómodo.', exampleTranslation: 'The leather sofa is very comfortable.', category: 'Furniture' },
  { id: 'v_4_10', unit: 4, word: 'mudarse', translation: 'to move (houses)', type: 'verb', example: 'Nos vamos a mudar a un piso más grande el próximo mes.', exampleTranslation: 'We are moving to a larger apartment next month.', category: 'Housing' }
];

const INITIAL_VERBS = [
  // Unidad 1 (Presente)
  {
    id: 'verb_preferir',
    verb: 'preferir',
    meaning: 'to prefer',
    unit: 1,
    tense: 'Presente',
    type: 'stem-changing (e-ie)',
    conjugations: {
      yo: 'prefiero',
      tú: 'prefieres',
      él: 'prefiere',
      nosotros: 'preferimos',
      vosotros: 'preferís',
      ellos: 'prefieren'
    }
  },
  {
    id: 'verb_costar',
    verb: 'costar',
    meaning: 'to require effort / to cost',
    unit: 1,
    tense: 'Presente',
    type: 'stem-changing (o-ue)',
    conjugations: {
      yo: 'cuesto',
      tú: 'cuestas',
      él: 'cuesta',
      nosotros: 'costamos',
      vosotros: 'costáis',
      ellos: 'cuestan'
    }
  },
  {
    id: 'verb_soler',
    verb: 'soler',
    meaning: 'to usually do / be accustomed to',
    unit: 1,
    tense: 'Presente',
    type: 'stem-changing (o-ue)',
    conjugations: {
      yo: 'suelo',
      tú: 'sueles',
      él: 'suele',
      nosotros: 'solemos',
      vosotros: 'soléis',
      ellos: 'suelen'
    }
  },

  // Unidad 2 (Pretérito Indefinido)
  {
    id: 'verb_nacer',
    verb: 'nacer',
    meaning: 'to be born',
    unit: 2,
    tense: 'Pretérito Indefinido',
    type: 'regular -er (past)',
    conjugations: {
      yo: 'nací',
      tú: 'naciste',
      él: 'nació',
      nosotros: 'nacimos',
      vosotros: 'nacisteis',
      ellos: 'nacieron'
    }
  },
  {
    id: 'verb_hacer',
    verb: 'hacer',
    meaning: 'to do / to make',
    unit: 2,
    tense: 'Pretérito Indefinido',
    type: 'irregular',
    conjugations: {
      yo: 'hice',
      tú: 'hiciste',
      él: 'hizo',
      nosotros: 'hicimos',
      vosotros: 'hicisteis',
      ellos: 'hicieron'
    }
  },
  {
    id: 'verb_ir',
    verb: 'ir',
    meaning: 'to go',
    unit: 2,
    tense: 'Pretérito Indefinido',
    type: 'irregular (same as ser)',
    conjugations: {
      yo: 'fui',
      tú: 'fuiste',
      él: 'fue',
      nosotros: 'fuimos',
      vosotros: 'fuisteis',
      ellos: 'fueron'
    }
  },
  {
    id: 'verb_ser_past',
    verb: 'ser',
    meaning: 'to be (inherent traits - past)',
    unit: 2,
    tense: 'Pretérito Indefinido',
    type: 'irregular (same as ir)',
    conjugations: {
      yo: 'fui',
      tú: 'fuiste',
      él: 'fue',
      nosotros: 'fuimos',
      vosotros: 'fuisteis',
      ellos: 'fueron'
    }
  },
  {
    id: 'verb_estar_past',
    verb: 'estar',
    meaning: 'to be (location/states - past)',
    unit: 2,
    tense: 'Pretérito Indefinido',
    type: 'irregular stem (estuv-)',
    conjugations: {
      yo: 'estuve',
      tú: 'estuviste',
      él: 'estuvo',
      nosotros: 'estuvimos',
      vosotros: 'estuvisteis',
      ellos: 'estuvieron'
    }
  },
  {
    id: 'verb_tener_past',
    verb: 'tener',
    meaning: 'to have (past)',
    unit: 2,
    tense: 'Pretérito Indefinido',
    type: 'irregular stem (tuv-)',
    conjugations: {
      yo: 'tuve',
      tú: 'tuviste',
      él: 'tuvo',
      nosotros: 'tuvimos',
      vosotros: 'tuvisteis',
      ellos: 'tuvieron'
    }
  },

  // Unidad 3 (Presente)
  {
    id: 'verb_parecer',
    verb: 'parecer',
    meaning: 'to seem / resemble',
    unit: 3,
    tense: 'Presente',
    type: 'irregular yo form (-zco)',
    conjugations: {
      yo: 'parezco',
      tú: 'pareces',
      él: 'parece',
      nosotros: 'parecemos',
      vosotros: 'parecéis',
      ellos: 'parecen'
    }
  },
  {
    id: 'verb_caer',
    verb: 'caer',
    meaning: 'to fall / to make an impression',
    unit: 3,
    tense: 'Presente',
    type: 'irregular yo form (-go)',
    conjugations: {
      yo: 'caigo',
      tú: 'caes',
      él: 'cae',
      nosotros: 'caemos',
      vosotros: 'caéis',
      ellos: 'caen'
    }
  },

  // Unidad 4 (Presente)
  {
    id: 'verb_gustar',
    verb: 'gustar',
    meaning: 'to like / be pleasing to',
    unit: 4,
    tense: 'Presente',
    type: 'indirect object pronoun verb',
    conjugations: {
      yo: 'me gusta / gustan',
      tú: 'te gusta / gustan',
      él: 'le gusta / gustan',
      nosotros: 'nos gusta / gustan',
      vosotros: 'os gusta / gustan',
      ellos: 'les gusta / gustan'
    }
  }
];

const INITIAL_PROMPTS = [
  {
    id: 'p_1_1',
    unit: 1,
    prompt: '¿Por qué decidiste estudiar español y qué es lo que más te motiva a seguir aprendiendo?',
    context: 'Motivations (por / para)',
    translation: 'Why did you decide to study Spanish and what motivates you the most to keep learning?',
    sampleAnswer: 'Decidí estudiar español para viajar por España y Latinoamérica. Lo que más me motiva es poder hablar con la gente local en su propio idioma y entender la cultura.',
    sampleAnswerTranslation: 'I decided to study Spanish to travel around Spain and Latin America. What motivates me the most is being able to talk to local people in their own language and understand the culture.'
  },
  {
    id: 'p_1_2',
    unit: 1,
    prompt: 'Describe tus hábitos de estudio. ¿Qué actividades haces para practicar fuera de clase?',
    context: 'Habits & Routine',
    translation: 'Describe your study habits. What activities do you do to practice outside of class?',
    sampleAnswer: 'Estudio español treinta minutos al día. Fuera de clase, escucho podcasts en español, leo artículos sencillos y veo series con subtítulos.',
    sampleAnswerTranslation: 'I study Spanish for thirty minutes a day. Outside of class, I listen to podcasts in Spanish, read simple articles, and watch series with subtitles.'
  },
  {
    id: 'p_1_3',
    unit: 1,
    prompt: '¿Qué destrezas te resultan más fáciles en español? ¿Qué te da más vergüenza o miedo?',
    context: 'Difficulties (me cuesta / me resulta fácil)',
    translation: 'Which skills are easiest for you in Spanish? What makes you feel most embarrassed or afraid?',
    sampleAnswer: 'Me resulta bastante fácil leer y comprender textos en español, pero me cuesta mucho hablar. Me da vergüenza cometer errores de pronunciación al conversar.',
    sampleAnswerTranslation: 'I find it quite easy to read and understand texts in Spanish, but speaking is very hard for me. I feel embarrassed about making pronunciation mistakes when conversing.'
  },
  {
    id: 'p_2_1',
    unit: 2,
    prompt: 'Cuéntale a tu profesor/a qué hiciste este fin de semana o en tus últimas vacaciones.',
    context: 'Past Activities (Indefinido)',
    translation: 'Tell your teacher what you did this weekend or on your last vacation.',
    sampleAnswer: 'El fin de semana pasado salí a cenar con mis amigos a un restaurante de comida mexicana. El domingo caminé por el parque y leí un libro muy interesante.',
    sampleAnswerTranslation: 'Last weekend I went out to dinner with my friends at a Mexican restaurant. On Sunday I walked in the park and read a very interesting book.'
  },
  {
    id: 'p_2_2',
    unit: 2,
    prompt: 'Habla sobre una persona que admires (un cineasta, artista, científico) y describe tres hitos importantes en su vida.',
    context: 'Biographies (Indefinido)',
    translation: 'Talk about someone you admire (a filmmaker, artist, scientist) and describe three important milestones in their life.',
    sampleAnswer: 'Admiro a Gabriel García Márquez. Primero, escribió su obra maestra "Cien años de soledad" en 1967. Segundo, ganó el Premio Nobel de Literatura en 1982. Finalmente, influyó profundamente en el periodismo y la literatura mundial.',
    sampleAnswerTranslation: 'I admire Gabriel García Márquez. First, he wrote his masterpiece "One Hundred Years of Solitude" in 1967. Second, he won the Nobel Prize in Literature in 1982. Finally, he deeply influenced world journalism and literature.'
  },
  {
    id: 'p_3_1',
    unit: 3,
    prompt: 'Descríbete físicamente y habla de tu carácter. ¿Cuáles consideras que son tus mayores virtudes y defectos?',
    context: 'Personal Description',
    translation: 'Describe yourself physically and talk about your character. What do you consider to be your greatest virtues and flaws?',
    sampleAnswer: 'Tengo el pelo castaño y los ojos marrones. Creo que soy una persona simpática, sociable y muy ordenada. Mi mayor defecto es que soy un poco impaciente.',
    sampleAnswerTranslation: 'I have brown hair and brown eyes. I think I am a friendly, outgoing, and very organized person. My greatest flaw is that I am a bit impatient.'
  },
  {
    id: 'p_3_2',
    unit: 3,
    prompt: '¿Cómo te llevas con tus compañeros de clase o colegas? Describe una persona con la que te lleves especialmente bien.',
    context: 'Relationships (llevarse bien/mal, caer bien)',
    translation: 'How do you get along with your classmates or colleagues? Describe someone you get along with particularly well.',
    sampleAnswer: 'Me llevo muy bien con mis colegas de trabajo. Especialmente me llevo genial con Carlos, porque es muy divertido, generoso y siempre me ayuda cuando tengo dudas.',
    sampleAnswerTranslation: 'I get along very well with my colleagues at work. I get along great with Carlos in particular, because he is very funny, generous, and always helps me when I have questions.'
  },
  {
    id: 'p_4_1',
    unit: 4,
    prompt: 'Describe la casa o piso donde vives ahora. ¿Cómo está distribuido? ¿Qué muebles hay en el salón?',
    context: 'My House',
    translation: 'Describe the house or apartment where you live now. How is it laid out? What furniture is in the living room?',
    sampleAnswer: 'Vivo en un piso muy luminoso. Tiene dos dormitorios, un baño, una cocina moderna y un salón grande. En el salón hay un sofá de cuero, una televisión grande y una estantería llena de libros.',
    sampleAnswerTranslation: 'I live in a very bright apartment. It has two bedrooms, one bathroom, a modern kitchen, and a large living room. In the living room, there is a leather sofa, a large TV, and a bookshelf full of books.'
  },
  {
    id: 'p_4_2',
    unit: 4,
    prompt: 'Compara tu casa actual con una casa en la que hayas vivido antes. ¿Cuál prefieres y por qué?',
    context: 'Comparatives (más/menos que, tan como)',
    translation: 'Compare your current home with a home you lived in before. Which one do you prefer and why?',
    sampleAnswer: 'Mi piso actual es más luminoso y moderno que mi casa anterior, aunque es un poco más pequeño. Prefiero mi piso actual porque está en un barrio más tranquilo y cerca del parque.',
    sampleAnswerTranslation: 'My current apartment is brighter and more modern than my previous house, although it is a bit smaller. I prefer my current apartment because it is in a quieter neighborhood and close to the park.'
  }
];

const INITIAL_LISTENING = [
  // Unidad 1: El español y tú (Learning)
  {
    id: 'l_1_1',
    unit: 1,
    passage: 'Estudio español desde hace seis meses. Para mí, escuchar es lo más difícil porque la gente nativa habla muy deprisa. Sin embargo, me resulta bastante fácil leer.',
    passageTranslation: 'I have been studying Spanish for six months. For me, listening is the hardest part because native people speak very fast. However, I find reading quite easy.',
    question: '¿Qué destreza le resulta más difícil y cuál más fácil?',
    questionTranslation: 'Which skill does he find most difficult and which one easiest?',
    answer: 'Escuchar es lo más difícil, y leer es lo más fácil.',
    answerTranslation: 'Listening is the hardest, and reading is the easiest.',
    context: 'Learning Difficulties'
  },
  {
    id: 'l_1_2',
    unit: 1,
    passage: 'Para aprender vocabulario, yo recomiendo ver series con subtítulos en español y apuntar las palabras nuevas en una libreta. A mí me sirve mucho.',
    passageTranslation: 'To learn vocabulary, I recommend watching series with subtitles in Spanish and writing down new words in a notebook. It helps me a lot.',
    question: '¿Qué recomendación da la persona para aprender vocabulario?',
    questionTranslation: 'What recommendation does the person give to learn vocabulary?',
    answer: 'Recomienda ver series con subtítulos en español y apuntar las palabras nuevas.',
    answerTranslation: 'They recommend watching series with Spanish subtitles and writing down new words.',
    context: 'Study Recommendations'
  },

  // Unidad 2: Una vida de película (Biography)
  {
    id: 'l_2_1',
    unit: 2,
    passage: 'Penélope Cruz nació en Madrid en 1974. Empezó a actuar en la televisión cuando era muy joven y ganó un premio Óscar en 2008 por su papel en una famosa película.',
    passageTranslation: 'Penelope Cruz was born in Madrid in 1974. She started acting on television when she was very young and won an Oscar in 2008 for her role in a famous movie.',
    question: '¿En qué año nació Penélope Cruz y qué premio importante ganó en 2008?',
    questionTranslation: 'In what year was Penelope Cruz born and what important award did she win in 2008?',
    answer: 'Nació in 1974 y ganó un premio Óscar.',
    answerTranslation: 'She was born in 1974 and won an Oscar award.',
    context: 'Biography (Pretérito Indefinido)'
  },
  {
    id: 'l_2_2',
    unit: 2,
    passage: 'Ayer fue un día increíble. Por la mañana fui a la playa con mis primos, almorzamos en un restaurante de mariscos y por la noche fuimos a ver una película al cine.',
    passageTranslation: 'Yesterday was an amazing day. In the morning I went to the beach with my cousins, we had lunch at a seafood restaurant, and in the evening we went to see a movie at the cinema.',
    question: '¿Qué tres actividades principales hizo la persona ayer?',
    questionTranslation: 'What three main activities did the person do yesterday?',
    answer: 'Fue a la playa, almorzó en un restaurante de mariscos y fue al cine.',
    answerTranslation: 'They went to the beach, had lunch at a seafood restaurant, and went to the cinema.',
    context: 'Past Activities (Indefinido)'
  },

  // Unidad 3: Yo soy así (Relationships)
  {
    id: 'l_3_1',
    unit: 3,
    passage: 'Mi hermana mayor es muy sociable y tiene muchos amigos, pero su esposo es bastante tímido. Ella se parece mucho a mi madre, ambas son muy generosas.',
    passageTranslation: 'My older sister is very outgoing and has many friends, but her husband is quite shy. She looks a lot like my mother, both of them are very generous.',
    question: '¿Cómo es el carácter del esposo de la hermana y a quién se parece ella?',
    questionTranslation: 'What is the sister\'s husband\'s character like, and who does she resemble?',
    answer: 'El esposo es tímido y la hermana se parece a su madre.',
    answerTranslation: 'The husband is shy and the sister resembles her mother.',
    context: 'Descriptions & Personality'
  },
  {
    id: 'l_3_2',
    unit: 3,
    passage: 'Mi hermano menor se parece mucho a mi padre. Los dos son muy exigentes en el trabajo y un poco desordenados en casa, pero tienen un corazón muy generoso.',
    passageTranslation: 'My younger brother looks a lot like my father. Both are very demanding at work and a bit messy at home, but they have a very generous heart.',
    question: '¿En qué rasgos de carácter se parecen el hermano y el padre?',
    questionTranslation: 'In what character traits do the brother and father resemble each other?',
    answer: 'Son exigentes en el trabajo, desordenados en casa y muy generosos.',
    answerTranslation: 'They are demanding at work, messy at home, and very generous.',
    context: 'Family Resemblance & Character'
  },

  // Unidad 4: Hogar, dulce hogar (Housing)
  {
    id: 'l_4_1',
    unit: 4,
    passage: 'Vivo en un piso luminoso a las afueras de Barcelona. El alquiler es caro, pero me encanta porque el barrio es muy tranquilo y tiene muchas estanterías en el salón.',
    passageTranslation: 'I live in a bright apartment on the outskirts of Barcelona. The rent is expensive, but I love it because the neighborhood is very quiet and it has many bookshelves in the living room.',
    question: '¿Por qué le gusta su piso a pesar de que el alquiler es caro?',
    questionTranslation: 'Why does he like his apartment despite the rent being expensive?',
    answer: 'Porque el barrio es muy tranquilo y el piso es muy luminoso.',
    answerTranslation: 'Because the neighborhood is very quiet and the apartment is very bright.',
    context: 'Housing Descriptions'
  },
  {
    id: 'l_4_2',
    unit: 4,
    passage: 'Me mudé a este piso la semana pasada. Lo mejor es que está en el centro, cerca de muchas tiendas y restaurantes. Además, tiene una cocina grande y moderna.',
    passageTranslation: 'I moved into this apartment last week. The best thing is that it is in the center, close to many shops and restaurants. Also, it has a large and modern kitchen.',
    question: '¿Cuáles son las ventajas del nuevo piso de la persona?',
    questionTranslation: 'What are the advantages of the person\'s new apartment?',
    answer: 'Está en el centro y tiene una cocina grande y moderna.',
    answerTranslation: 'It is in the center and has a large and modern kitchen.',
    context: 'Moving & Housing Advantages'
  },
  {
    id: 'l_4_3',
    unit: 4,
    passage: 'Perdone, señora, ¿le importaría hablar un poco más despacio? Es que mi nivel de español es básico y me cuesta comprender cuando habla muy rápido.',
    passageTranslation: 'Excuse me, ma\'am, would you mind speaking a bit slower? My Spanish level is basic and it is hard for me to understand when you speak very fast.',
    question: '¿Qué le pide el estudiante a la señora?',
    questionTranslation: 'What does the student ask the woman to do?',
    answer: 'Le pide que hable más despacio.',
    answerTranslation: 'He asks her to speak slower.',
    context: 'Courtesy Requests (Usted)'
  },
  {
    id: 'l_4_4',
    unit: 4,
    passage: 'Disculpe, señor, ¿me podría decir si esta línea va directamente al centro de la ciudad o tengo que hacer transbordo?',
    passageTranslation: 'Excuse me, sir, could you tell me if this line goes directly to the city center or do I have to transfer?',
    question: '¿Qué información quiere saber el pasajero?',
    questionTranslation: 'What information does the passenger want to know?',
    answer: 'Si la línea va directo al centro o si tiene que hacer transbordo.',
    answerTranslation: 'If the line goes directly to the center or if he has to transfer.',
    context: 'Polite Inquiries (Usted)'
  },
  {
    id: 'l_4_5',
    unit: 4,
    passage: 'Hola, Juan. ¿Te importaría cerrar la ventana? Tengo un poco de frío y el viento molesta bastante.',
    passageTranslation: 'Hi, Juan. Would you mind closing the window? I am a bit cold and the wind is quite annoying.',
    question: '¿Qué favor le pide el hablante a Juan?',
    questionTranslation: 'What favor does the speaker ask Juan?',
    answer: 'Le pide que cierre la ventana.',
    answerTranslation: 'He asks him to close the window.',
    context: 'Polite Requests (Tú)'
  },
  {
    id: 'l_4_6',
    unit: 4,
    passage: 'Buenos días. ¿Le importaría abrir la ventana? Es que hace mucho calor aquí adentro y no hay aire acondicionado.',
    passageTranslation: 'Good morning. Would you mind opening the window? It is very hot in here and there is no air conditioning.',
    question: '¿Qué cambio quiere hacer la persona en la sala?',
    questionTranslation: 'What change does the person want to make in the room?',
    answer: 'Quiere abrir la ventana para refrescar la habitación.',
    answerTranslation: 'They want to open the window to cool down the room.',
    context: 'Courtesy Requests (Usted)'
  }
];

const INITIAL_COMPARE = [
  {
    id: 'c_1',
    sentenceEs: 'Mi piso es más grande [blank] el tuyo.',
    sentenceEn: 'My flat is larger than yours.',
    options: ['que', 'como', 'de', 'sino'],
    answer: 'que',
    explanation: 'With the comparative of superiority "más", we use the connector "que".'
  },
  {
    id: 'c_2',
    sentenceEs: 'Tu habitación no es tan luminosa [blank] la mía.',
    sentenceEn: 'Your room is not as bright as mine.',
    options: ['como', 'que', 'de', 'sino'],
    answer: 'como',
    explanation: 'With "tan" (as) modifying an adjective, we use the connector "como" to establish equality.'
  },
  {
    id: 'c_3',
    sentenceEs: 'El alquiler en las afueras es menos caro [blank] en el centro.',
    sentenceEn: 'Rent in the outskirts is less expensive than in the center.',
    options: ['que', 'como', 'de', 'sino'],
    answer: 'que',
    explanation: 'With the comparative of inferiority "menos", we use the connector "que".'
  },
  {
    id: 'c_4',
    sentenceEs: 'En mi salón hay tanta luz [blank] en el tuyo.',
    sentenceEn: 'In my living room there is as much light as in yours.',
    options: ['como', 'que', 'de', 'sino'],
    answer: 'como',
    explanation: 'With "tanta" (as much, feminine singular), we use "como" for equality comparisons involving nouns.'
  },
  {
    id: 'c_5',
    sentenceEs: 'Este armario tiene más estanterías [blank] ese.',
    sentenceEn: 'This wardrobe has more shelves than that one.',
    options: ['que', 'como', 'de', 'sino'],
    answer: 'que',
    explanation: 'With comparative structures like "más ...", we use "que" to mean "than".'
  },
  {
    id: 'c_6',
    sentenceEs: 'Mi casa tiene tantos dormitorios [blank] la tuya.',
    sentenceEn: 'My house has as many bedrooms as yours.',
    options: ['como', 'que', 'de', 'sino'],
    answer: 'como',
    explanation: 'With "tantos" (as many, masculine plural), we use the connector "como" to establish equality.'
  },
  {
    id: 'c_7',
    sentenceEs: 'El nuevo sofá es más cómodo [blank] el viejo.',
    sentenceEn: 'The new sofa is more comfortable than the old one.',
    options: ['que', 'como', 'de', 'sino'],
    answer: 'que',
    explanation: 'With the comparative of superiority "más", we use the connector "que" (than).'
  },
  {
    id: 'c_8',
    sentenceEs: 'Vivimos en un barrio tan tranquilo [blank] el de mis abuelos.',
    sentenceEn: 'We live in a neighborhood as quiet as my grandparents\'.',
    options: ['como', 'que', 'de', 'sino'],
    answer: 'como',
    explanation: 'With "tan" (as) followed by an adjective ("tranquilo"), we use the connector "como" for equality.'
  },
  {
    id: 'c_9',
    sentenceEs: 'Esta cocina viene equipada con menos electrodomésticos [blank] aquella.',
    sentenceEn: 'This kitchen comes equipped with fewer appliances than that one.',
    options: ['que', 'como', 'de', 'sino'],
    answer: 'que',
    explanation: 'With the comparative of inferiority "menos" (fewer), we use the connector "que".'
  },
  {
    id: 'c_10',
    sentenceEs: 'En este piso hay tantas mesas [blank] en el otro.',
    sentenceEn: 'In this flat there are as many tables as in the other.',
    options: ['como', 'que', 'de', 'sino'],
    answer: 'como',
    explanation: 'With "tantas" (as many, feminine plural) followed by a noun, we use the connector "como" for equality.'
  }
];

const COMPARE_BUILDER_PROMPTS = [
  {
    id: 'cb_1',
    category: 'superiority-adjective',
    title: '1. Inequality: Adjectives/Adverbs',
    formula: 'más / menos + [adjetivo / adverbio] + que',
    prompt: 'Compare two rooms, apartments, or habits using "más... que" or "menos... que" with an adjective (e.g. grande, tranquilo, luminoso) or adverb.',
    modelEs: 'Mi piso es más luminoso que el tuyo.',
    modelEn: 'My flat is brighter than yours.',
    validator: {
      required: ['que'],
      anyOf: ['más', 'mas', 'menos'],
      forbidden: ['como'],
      errorTip: 'Ensure you use "más... que" or "menos... que" for superiority/inferiority comparisons. Do not use "como".'
    }
  },
  {
    id: 'cb_2',
    category: 'superiority-noun',
    title: '2. Inequality: Nouns',
    formula: 'más / menos + [nombre] + que',
    prompt: 'Compare the quantities of items in two homes (e.g., bedrooms, windows, space) using "más... que" or "menos... que" followed by a noun.',
    modelEs: 'Mi casa tiene más dormitorios que tu piso.',
    modelEn: 'My house has more bedrooms than your apartment.',
    validator: {
      required: ['que'],
      anyOf: ['más', 'mas', 'menos'],
      forbidden: ['como'],
      errorTip: 'Make sure you compare nouns using "más + [noun] + que" or "menos + [noun] + que".'
    }
  },
  {
    id: 'cb_3',
    category: 'superiority-verb',
    title: '3. Inequality: Verbs',
    formula: '[verbo] + más / menos + que',
    prompt: 'Compare how much people do an action (e.g., study, sleep, go out) using a verb followed directly by "más que" or "menos que".',
    modelEs: 'En Madrid la gente sale más que en mi ciudad.',
    modelEn: 'In Madrid people go out more than in my city.',
    validator: {
      required: ['que'],
      anyOf: ['más', 'mas', 'menos'],
      forbidden: ['como'],
      errorTip: 'To compare actions (verbs), place "más que" or "menos que" directly after the conjugated verb.'
    }
  },
  {
    id: 'cb_4',
    category: 'equality-adjective',
    title: '4. Equality: Adjectives/Adverbs',
    formula: 'tan + [adjetivo / adverbio] + como',
    prompt: 'Describe two things that share the same level of a quality (e.g., equally quiet, modern, or old) using "tan... como" with an adjective.',
    modelEs: 'El dormitorio es tan luminoso como el salón.',
    modelEn: 'The bedroom is as bright as the living room.',
    validator: {
      required: ['tan', 'como'],
      forbidden: ['que', 'tanto', 'tanta', 'tantos', 'tantas'],
      errorTip: 'Use "tan + [adjective/adverb] + como" for equality. Avoid using "tanto" or "que".'
    }
  },
  {
    id: 'cb_5',
    category: 'equality-noun',
    title: '5. Equality: Nouns',
    formula: 'tanto/a/os/as + [nombre] + como',
    prompt: 'Describe two properties with the same quantity of a noun (e.g., same amount of light, space, or rooms) using a matching form of "tanto... como".',
    modelEs: 'Mi piso tiene tanto espacio como tu casa.',
    modelEn: 'My apartment has as much space as your house.',
    validator: {
      required: ['como'],
      anyOf: ['tanto', 'tanta', 'tantos', 'tantas'],
      forbidden: ['tan', 'que'],
      errorTip: 'Use "tanto/a/os/as + [noun] + como" for equality with nouns. Make sure "tanto" matches the gender and number of the noun.'
    }
  },
  {
    id: 'cb_6',
    category: 'equality-verb',
    title: '6. Equality: Verbs',
    formula: '[verbo] + tanto como',
    prompt: 'Compare two actions done in equal amounts (e.g., working, sleeping, or studying the same) using a verb followed by "tanto como".',
    modelEs: 'Ella trabaja tanto como yo.',
    modelEn: 'She works as much as I do.',
    validator: {
      required: ['como', 'tanto'],
      forbidden: ['tan', 'que'],
      errorTip: 'For verbs, place "tanto como" directly after the conjugated verb.'
    }
  },
  {
    id: 'cb_7',
    category: 'irregular',
    title: '7. Irregular Comparatives',
    formula: 'mejor / peor / mayor / menor + que',
    prompt: 'Compare things or people using irregular comparison words (better, worse, older, younger) followed by "que".',
    modelEs: 'Los electrodomésticos de esta marca son mejores que los otros.',
    modelEn: 'The appliances of this brand are better than the others.',
    validator: {
      required: ['que'],
      anyOf: ['mejor', 'mejores', 'peor', 'peores', 'mayor', 'mayores', 'menor', 'menores'],
      forbidden: ['más bueno', 'mas bueno', 'más malo', 'mas malo', 'como'],
      errorTip: 'Use "mejor", "peor", "mayor", or "menor" instead of "más bueno/malo/grande/pequeño" followed by "que".'
    }
  }
];



