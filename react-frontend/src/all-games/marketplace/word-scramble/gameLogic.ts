import { WordData } from './types';

export const SPANISH_WORDS: string[] = [
  'ordenador',
  'programar',
  'desarrollo',
  'teclado',
  'raton',
  'pantalla',
  'internet',
  'algoritmo',
  'funcion',
  'variable',
  'compilar',
  'depurar',
  'software',
  'hardware',
  'servidor',
  'cliente',
  'base',
  'datos',
  'redes',
  'seguridad',
];

export const getRandomWord = (): string => {
  const randomIndex = Math.floor(Math.random() * SPANISH_WORDS.length);
  return SPANISH_WORDS[randomIndex];
};

export const scrambleWord = (word: string): string => {
  let scrambled = word.split('').sort(() => 0.5 - Math.random()).join('');
  // Ensure scrambled word is not the same as original
  while (scrambled === word) {
    scrambled = word.split('').sort(() => 0.5 - Math.random()).join('');
  }
  return scrambled;
};

export const initializeGameData = (): WordData => {
  const original = getRandomWord();
  const scrambled = scrambleWord(original);
  return { original, scrambled };
};

export const checkGuess = (original: string, guess: string): boolean => {
  return original.toLowerCase() === guess.toLowerCase();
};
