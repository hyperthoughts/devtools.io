export type LoremUnit = 'paragraphs' | 'sentences' | 'words';

export interface LoremOptions {
  count: number;
  unit: LoremUnit;
  startWithLorem: boolean;
  htmlMode: boolean; // Wrap in <p> tags
}

const LOREM_WORDS = [
  'lorem',
  'ipsum',
  'dolor',
  'sit',
  'amet',
  'consectetur',
  'adipiscing',
  'elit',
  'sed',
  'do',
  'eiusmod',
  'tempor',
  'incididunt',
  'ut',
  'labore',
  'et',
  'dolore',
  'magna',
  'aliqua',
  'enim',
  'ad',
  'minim',
  'veniam',
  'quis',
  'nostrud',
  'exercitation',
  'ullamco',
  'laboris',
  'nisi',
  'ut',
  'aliquip',
  'ex',
  'ea',
  'commodo',
  'consequat',
  'duis',
  'aute',
  'irure',
  'dolor',
  'in',
  'reprehenderit',
  'in',
  'voluptate',
  'velit',
  'esse',
  'cillum',
  'dolore',
  'eu',
  'fugiat',
  'nulla',
  'pariatur',
  'excepteur',
  'sint',
  'occaecat',
  'cupidatat',
  'non',
  'proident',
  'sunt',
  'in',
  'culpa',
  'qui',
  'officia',
  'deserunt',
  'mollit',
  'anim',
  'id',
  'est',
  'laborum',
];

function getRandomWord(): string {
  return LOREM_WORDS[Math.floor(Math.random() * LOREM_WORDS.length)];
}

function generateSentence(firstSentence: boolean = false): string {
  // 5 to 15 words per sentence
  const length = Math.floor(Math.random() * 11) + 5;
  const sentenceWords: string[] = [];

  for (let i = 0; i < length; i++) {
    if (i === 0 && firstSentence) {
      sentenceWords.push('Lorem', 'ipsum', 'dolor', 'sit', 'amet');
      i += 4;
    } else {
      sentenceWords.push(getRandomWord());
    }
  }

  const sentence = sentenceWords.join(' ');
  return sentence.charAt(0).toUpperCase() + sentence.slice(1) + '.';
}

function generateParagraph(firstParagraph: boolean = false): string {
  // 3 to 8 sentences per paragraph
  const length = Math.floor(Math.random() * 6) + 3;
  const sentences: string[] = [];

  for (let i = 0; i < length; i++) {
    sentences.push(generateSentence(i === 0 && firstParagraph));
  }

  return sentences.join(' ');
}

export function generateLorem(options: LoremOptions): string {
  const result: string[] = [];
  const safeCount = Math.min(Math.max(1, options.count || 1), 10000);

  if (options.unit === 'words') {
    for (let i = 0; i < safeCount; i++) {
      if (i === 0 && options.startWithLorem) {
        result.push('Lorem', 'ipsum', 'dolor', 'sit', 'amet');
        i += 4;
      } else {
        result.push(getRandomWord());
      }
    }
    const text = result.slice(0, safeCount).join(' ');
    // capitalize first letter
    const capitalized = text.charAt(0).toUpperCase() + text.slice(1);
    return options.htmlMode ? `<p>${capitalized}</p>` : capitalized;
  }

  if (options.unit === 'sentences') {
    for (let i = 0; i < safeCount; i++) {
      result.push(generateSentence(i === 0 && options.startWithLorem));
    }
    const text = result.join(' ');
    return options.htmlMode ? `<p>${text}</p>` : text;
  }

  if (options.unit === 'paragraphs') {
    for (let i = 0; i < safeCount; i++) {
      let para = generateParagraph(i === 0 && options.startWithLorem);
      result.push(options.htmlMode ? `<p>${para}</p>` : para);
    }
    return result.join(options.htmlMode ? '\n\n' : '\n\n');
  }

  return '';
}
