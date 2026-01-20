export class ContentGenerator {
  private easyTemplates = [
    "Il était une fois {subject}. {subject} vivait dans {place}.",
    "{subject} aimait beaucoup {activity}. Chaque jour, {pronoun} {verb}.",
    "Un matin, {subject} décida de partir en voyage. Le chemin était long.",
    "{subject} rencontra {character}. Ils devinrent amis rapidement.",
    "Le temps passait vite. {subject} était heureux de cette aventure.",
  ];

  private mediumTemplates = [
    "Dans les premiers jours de {period}, {subject} se trouvait à {place}, contemplant {object}.",
    "Il semblait que {subject} avait toujours su que {event} arriverait un jour ou l'autre.",
    "La vie de {subject} n'avait jamais été simple, mais {pronoun} gardait espoir malgré tout.",
    "Personne ne pouvait prévoir que {event} changerait le cours des choses si rapidement.",
    "Au fil des années, {subject} avait appris à {skill}, une qualité rare en ces temps difficiles.",
  ];

  private hardTemplates = [
    "C'est une vérité universellement reconnue qu'un {subject} en possession d'une {quality} doit nécessairement être à la recherche de {goal}.",
    "Longtemps, {subject} s'était couché de bonne heure. Parfois, à peine {event}, {pronoun} s'éteignait.",
    "Les sociétés, comme les individus, n'acquièrent leur personnalité que par le lent travail de {process}.",
    "Dans cette époque troublée où {context}, {subject} se retrouvait face à un dilemme qui engageait bien plus que sa propre destinée.",
    "L'histoire que je vais raconter concerne {subject}, dont la vie illustre parfaitement les contradictions de notre siècle.",
  ];

  private vocabularyByDifficulty = {
    easy: {
      subjects: ['le jeune garçon', 'la petite fille', 'le voyageur', 'l\'ami', 'le héros'],
      places: ['un village paisible', 'une grande ville', 'une forêt mystérieuse', 'une île lointaine', 'une maison accueillante'],
      activities: ['lire des livres', 'explorer la nature', 'rencontrer des gens', 'découvrir le monde', 'raconter des histoires'],
      verbs: ['marchait', 'observait', 'réfléchissait', 'rêvait', 'chantait'],
      characters: ['un sage vieillard', 'une dame gentille', 'un animal parlant', 'un autre voyageur', 'un guide expérimenté'],
    },
    medium: {
      subjects: ['notre protagoniste', 'le personnage principal', 'cet homme remarquable', 'cette femme courageuse', 'le narrateur'],
      places: ['la capitale', 'cette région reculée', 'le domaine familial', 'les terres inconnues', 'le quartier ancien'],
      objects: ['l\'horizon lointain', 'les vestiges du passé', 'la beauté du paysage', 'les mystères environnants', 'la complexité des choses'],
      events: ['cette rencontre inattendue', 'ce changement radical', 'cette révélation importante', 'ce tournant décisif', 'cette transformation profonde'],
      periods: ['ce printemps mémorable', 'l\'automne de sa vie', 'cette année fatidique', 'cette époque révolue', 'ces temps incertains'],
      skills: ['observer avec attention', 'comprendre les autres', 'surmonter l\'adversité', 'garder son sang-froid', 'voir au-delà des apparences'],
    },
    hard: {
      subjects: ['un homme de condition modeste', 'une âme tourmentée', 'un esprit éclairé', 'un être d\'exception', 'un individu singulier'],
      qualities: ['fortune considérable', 'intelligence remarquable', 'sensibilité exacerbée', 'volonté inébranlable', 'conscience aiguë'],
      goals: ['la vérité absolue', 'la rédemption', 'la justice sociale', 'l\'accomplissement personnel', 'la compréhension universelle'],
      processes: ['l\'histoire', 'l\'expérience', 'la réflexion', 'la souffrance', 'la contemplation'],
      contexts: ['les conventions sociales dictaient chaque geste', 'les bouleversements politiques affectaient tous les destins', 'la morale publique pesait sur les consciences', 'les inégalités criantes divisaient la société', 'les passions humaines se heurtaient aux règles établies'],
    },
  };

  generateChapterTitle(bookTitle: string, chapterNumber: number): string {
    const themes = [
      'Le Commencement',
      'La Rencontre',
      'Le Voyage',
      'La Découverte',
      'L\'Épreuve',
      'Le Mystère',
      'La Révélation',
      'Le Tournant',
      'La Décision',
      'Le Départ',
      'L\'Arrivée',
      'La Transformation',
      'Le Retour',
      'La Vérité',
      'Le Dénouement',
    ];

    const theme = themes[chapterNumber % themes.length];
    return `Chapitre ${chapterNumber}: ${theme}`;
  }

  generateChapterContent(difficulty: 'easy' | 'medium' | 'hard', targetWordCount: number): string {
    const paragraphs: string[] = [];
    let currentWordCount = 0;

    while (currentWordCount < targetWordCount) {
      const paragraph = this.generateParagraph(difficulty);
      paragraphs.push(paragraph);
      currentWordCount += this.calculateWordCount(paragraph);
    }

    return paragraphs.join('\n\n');
  }

  private generateParagraph(difficulty: 'easy' | 'medium' | 'hard'): string {
    const sentenceCount = difficulty === 'easy' ? 4 : difficulty === 'medium' ? 5 : 6;
    const sentences: string[] = [];

    for (let i = 0; i < sentenceCount; i++) {
      sentences.push(this.generateSentence(difficulty));
    }

    return sentences.join(' ');
  }

  private generateSentence(difficulty: 'easy' | 'medium' | 'hard'): string {
    let template: string;
    let vocab: any;

    if (difficulty === 'easy') {
      template = this.easyTemplates[Math.floor(Math.random() * this.easyTemplates.length)];
      vocab = this.vocabularyByDifficulty.easy;

      return template
        .replace(/{subject}/g, vocab.subjects[Math.floor(Math.random() * vocab.subjects.length)])
        .replace(/{place}/g, vocab.places[Math.floor(Math.random() * vocab.places.length)])
        .replace(/{activity}/g, vocab.activities[Math.floor(Math.random() * vocab.activities.length)])
        .replace(/{verb}/g, vocab.verbs[Math.floor(Math.random() * vocab.verbs.length)])
        .replace(/{character}/g, vocab.characters[Math.floor(Math.random() * vocab.characters.length)])
        .replace(/{pronoun}/g, Math.random() > 0.5 ? 'il' : 'elle');
    } else if (difficulty === 'medium') {
      template = this.mediumTemplates[Math.floor(Math.random() * this.mediumTemplates.length)];
      vocab = this.vocabularyByDifficulty.medium;

      return template
        .replace(/{subject}/g, vocab.subjects[Math.floor(Math.random() * vocab.subjects.length)])
        .replace(/{place}/g, vocab.places[Math.floor(Math.random() * vocab.places.length)])
        .replace(/{object}/g, vocab.objects[Math.floor(Math.random() * vocab.objects.length)])
        .replace(/{event}/g, vocab.events[Math.floor(Math.random() * vocab.events.length)])
        .replace(/{period}/g, vocab.periods[Math.floor(Math.random() * vocab.periods.length)])
        .replace(/{skill}/g, vocab.skills[Math.floor(Math.random() * vocab.skills.length)])
        .replace(/{pronoun}/g, Math.random() > 0.5 ? 'il' : 'elle');
    } else {
      template = this.hardTemplates[Math.floor(Math.random() * this.hardTemplates.length)];
      vocab = this.vocabularyByDifficulty.hard;

      return template
        .replace(/{subject}/g, vocab.subjects[Math.floor(Math.random() * vocab.subjects.length)])
        .replace(/{quality}/g, vocab.qualities[Math.floor(Math.random() * vocab.qualities.length)])
        .replace(/{goal}/g, vocab.goals[Math.floor(Math.random() * vocab.goals.length)])
        .replace(/{process}/g, vocab.processes[Math.floor(Math.random() * vocab.processes.length)])
        .replace(/{context}/g, vocab.contexts[Math.floor(Math.random() * vocab.contexts.length)])
        .replace(/{pronoun}/g, Math.random() > 0.5 ? 'il' : 'elle');
    }
  }

  calculateWordCount(text: string): number {
    return text.trim().split(/\s+/).length;
  }

  estimatePageCount(wordCount: number): number {
    return Math.ceil(wordCount / 250);
  }
}

export function randomBetween(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
