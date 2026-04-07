import type { Intent, KeywordPattern } from '../types';

export const intents: Intent[] = [
  {
    key: 'greeting',
    keywords: [
      { word: 'hi', weight: 5 }, { word: 'hello', weight: 5 }, { word: 'hey', weight: 5 },
      { word: 'hola', weight: 5 }, { word: 'buenas', weight: 4 }, { word: 'saludos', weight: 4 },
      { word: 'bonjour', weight: 5 }, { word: 'ciao', weight: 5 },
    ],
    priority: 1,
    relatedIntents: ['about_me', 'experience', 'skills', 'projects'],
  },
  {
    key: 'about_me',
    keywords: [
      { word: 'who', weight: 4 }, { word: 'name', weight: 5 }, { word: 'about', weight: 4 },
      { word: 'developer', weight: 4 }, { word: 'sebastián', weight: 5 }, { word: 'sebas', weight: 5 },
      { word: 'yourself', weight: 4 }, { word: 'quién', weight: 5 }, { word: 'cómo', weight: 2 },
      { word: 'llamas', weight: 5 }, { word: 'background', weight: 3 },
    ],
    priority: 2,
    relatedIntents: ['experience', 'education', 'contact'],
  },
  {
    key: 'experience',
    keywords: [
      { word: 'experience', weight: 5 }, { word: 'work', weight: 4 }, { word: 'job', weight: 4 },
      { word: 'career', weight: 3 }, { word: 'employed', weight: 3 }, { word: 'company', weight: 3 },
      { word: 'telefonica', weight: 5 }, { word: 'ntt', weight: 5 }, { word: 'banco popular', weight: 5 },
      { word: '4coders', weight: 5 }, { word: 'experiencia', weight: 5 }, { word: 'trabajo', weight: 4 },
      { word: 'empresa', weight: 3 }, { word: 'empleo', weight: 4 },
    ],
    priority: 3,
    relatedIntents: ['skills', 'projects', 'education'],
  },
  {
    key: 'skills',
    keywords: [
      { word: 'skills', weight: 5 }, { word: 'technologies', weight: 4 }, { word: 'tech', weight: 3 },
      { word: 'stack', weight: 5 }, { word: 'react', weight: 4 }, { word: 'angular', weight: 4 },
      { word: 'typescript', weight: 4 }, { word: 'know', weight: 2 }, { word: 'habilidades', weight: 5 },
      { word: 'tecnologías', weight: 5 }, { word: 'lenguajes', weight: 4 }, { word: 'framework', weight: 3 },
    ],
    priority: 3,
    relatedIntents: ['experience', 'projects', 'education'],
  },
  {
    key: 'projects',
    keywords: [
      { word: 'project', weight: 5 }, { word: 'portfolio', weight: 4 }, { word: 'built', weight: 3 },
      { word: 'created', weight: 3 }, { word: 'made', weight: 3 }, { word: 'proyecto', weight: 5 },
      { word: 'logro', weight: 4 }, { word: 'achievement', weight: 4 }, { word: 'migration', weight: 5 },
      { word: 'biodcase', weight: 5 }, { word: 'tinyml', weight: 5 }, { word: 'datapower', weight: 5 },
    ],
    priority: 3,
    relatedIntents: ['skills', 'experience', 'games'],
  },
  {
    key: 'games',
    keywords: [
      { word: 'game', weight: 5 }, { word: 'play', weight: 4 }, { word: 'jugar', weight: 5 },
      { word: 'juego', weight: 5 }, { word: 'snake', weight: 5 }, { word: '2048', weight: 5 },
      { word: 'tic-tac-toe', weight: 5 }, { word: 'flappy', weight: 5 }, { word: 'brick', weight: 4 },
      { word: 'memory', weight: 4 }, { word: 'tetris', weight: 5 }, { word: 'minesweeper', weight: 5 },
      { word: 'tower defense', weight: 5 },
    ],
    priority: 3,
    relatedIntents: ['projects', 'skills'],
  },
  {
    key: 'education',
    keywords: [
      { word: 'education', weight: 5 }, { word: 'degree', weight: 4 }, { word: 'university', weight: 4 },
      { word: 'study', weight: 3 }, { word: 'learn', weight: 3 }, { word: 'educación', weight: 5 },
      { word: 'estudio', weight: 4 }, { word: 'universidad', weight: 5 }, { word: 'master', weight: 4 },
      { word: 'big data', weight: 5 }, { word: 'electronics', weight: 4 },
    ],
    priority: 3,
    relatedIntents: ['skills', 'experience', 'about_me'],
  },
  {
    key: 'contact',
    keywords: [
      { word: 'contact', weight: 5 }, { word: 'email', weight: 4 }, { word: 'reach', weight: 3 },
      { word: 'linkedin', weight: 5 }, { word: 'github', weight: 5 }, { word: 'social', weight: 3 },
      { word: 'contacto', weight: 5 }, { word: 'correo', weight: 4 }, { word: 'redes', weight: 4 },
    ],
    priority: 3,
    relatedIntents: ['about_me'],
  },
  {
    key: 'how_built',
    keywords: [
      { word: 'built', weight: 4 }, { word: 'created', weight: 3 }, { word: 'made', weight: 3 },
      { word: 'technology', weight: 3 }, { word: 'framework', weight: 3 }, { word: 'vite', weight: 5 },
      { word: 'react', weight: 3 }, { word: 'tailwind', weight: 5 }, { word: 'stack', weight: 3 },
      { word: 'cómo', weight: 2 }, { word: 'construyó', weight: 5 }, { word: 'creó', weight: 5 },
      { word: 'hizo', weight: 3 }, { word: 'arquitectura', weight: 4 }, { word: 'architecture', weight: 4 },
    ],
    priority: 3,
    relatedIntents: ['skills', 'projects'],
  },
  {
    key: 'how_work',
    keywords: [
      { word: 'work', weight: 2 }, { word: 'methodology', weight: 5 }, { word: 'process', weight: 3 },
      { word: 'approach', weight: 3 }, { word: 'style', weight: 3 }, { word: 'agile', weight: 4 },
      { word: 'scrum', weight: 5 }, { word: 'testing', weight: 4 }, { word: 'tdd', weight: 5 },
      { word: 'ci/cd', weight: 5 }, { word: 'sdd', weight: 5 }, { word: 'spec', weight: 3 },
      { word: 'cómo', weight: 2 }, { word: 'trabaja', weight: 5 }, { word: 'metodología', weight: 5 },
      { word: 'proceso', weight: 3 },
    ],
    priority: 3,
    relatedIntents: ['experience', 'skills', 'projects'],
  },
  {
    key: 'thanks',
    keywords: [
      { word: 'thanks', weight: 5 }, { word: 'thank you', weight: 5 }, { word: 'gracias', weight: 5 },
      { word: 'merci', weight: 5 }, { word: 'appreciate', weight: 4 },
    ],
    priority: 1,
    relatedIntents: [],
  },
  {
    key: 'goodbye',
    keywords: [
      { word: 'bye', weight: 5 }, { word: 'goodbye', weight: 5 }, { word: 'see you', weight: 5 },
      { word: 'adiós', weight: 5 }, { word: 'adios', weight: 5 }, { word: 'au revoir', weight: 5 },
      { word: 'hasta luego', weight: 5 },
    ],
    priority: 1,
    relatedIntents: [],
  },
  {
    key: 'help',
    keywords: [
      { word: 'help', weight: 5 }, { word: 'what can you', weight: 5 }, { word: 'commands', weight: 3 },
      { word: 'ayuda', weight: 5 }, { word: 'puedes', weight: 4 }, { word: 'puedo', weight: 3 },
      { word: 'preguntar', weight: 4 }, { word: 'ask', weight: 3 },
    ],
    priority: 1,
    relatedIntents: ['about_me', 'experience', 'skills', 'projects', 'games', 'education', 'contact'],
  },
  {
    key: 'follow_up',
    keywords: [
      { word: 'tell me more', weight: 5 }, { word: 'more details', weight: 5 }, { word: 'elaborate', weight: 4 },
      { word: 'cuéntame más', weight: 5 }, { word: 'más detalles', weight: 5 }, { word: 'profundiza', weight: 4 },
      { word: 'which', weight: 3 }, { word: 'what about', weight: 3 }, { word: 'y sobre', weight: 4 },
    ],
    priority: 4,
    requiresContext: true,
    relatedIntents: [],
  },
  {
    key: 'experience_by_year',
    keywords: [
      { word: '2024', weight: 5 }, { word: '2023', weight: 5 }, { word: '2022', weight: 5 },
      { word: '2021', weight: 5 }, { word: '2025', weight: 5 },
    ],
    regex: [
      /(what|qué|qu'est-ce|cosa).*(did|were|worked|hiciste|trabajaste|travaillé|lavorato).*(202[1-5])/i,
      /(202[1-5]).*(experience|trabajo|travail|esperienza|job|empresa|entreprise)/i,
      /(telefonica|banco popular|4coders|ibm|bbva).*(year|año|année|anno)/i,
    ],
    priority: 4,
    relatedIntents: ['experience', 'projects'],
  },
  {
    key: 'fallback',
    keywords: [],
    priority: 99,
    relatedIntents: ['help', 'about_me', 'experience', 'skills', 'projects', 'games'],
  },
];

export function normalizeInput(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/[¿?!¡.,;:()]/g, '')
    .replace(/\s+/g, ' ');
}

export function scoreIntent(input: string, intent: Intent): number {
  const normalized = normalizeInput(input);
  let score = 0;
  const matchedKeywords: string[] = [];

  for (const kw of intent.keywords) {
    if (normalized.includes(kw.word.toLowerCase())) {
      score += kw.weight;
      matchedKeywords.push(kw.word);
    }
  }

  for (const pattern of intent.regex || []) {
    if (pattern.test(input)) {
      score += 10;
      matchedKeywords.push(`regex:${pattern.source}`);
    }
  }

  return score;
}
