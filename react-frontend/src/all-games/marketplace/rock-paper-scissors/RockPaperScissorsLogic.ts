import { Option, Winner } from './types';

const options: Option[] = ['rock', 'paper', 'scissors'];

export const getRandomOption = (): Option => {
  return options[Math.floor(Math.random() * options.length)];
};

export const determineWinner = (playerOption: Option, computerOption: Option): Winner => {
  if (playerOption === computerOption) {
    return 'tie';
  }

  if (
    (playerOption === 'rock' && computerOption === 'scissors') ||
    (playerOption === 'scissors' && computerOption === 'paper') ||
    (playerOption === 'paper' && computerOption === 'rock')
  ) {
    return 'player';
  }

  return 'computer';
};
