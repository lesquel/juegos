import React from 'react';
import type { Option } from '../types';
import { RockIcon } from './RockIcon';
import { PaperIcon } from './PaperIcon';
import { ScissorsIcon } from './ScissorsIcon';

interface GameOptionProps {
  option: Option;
  onSelect: (option: Option) => void;
  disabled: boolean;
}

const icons: Record<Option, React.ReactNode> = {
  rock: <RockIcon />,
  paper: <PaperIcon />,
  scissors: <ScissorsIcon />,
};

export const GameOption: React.FC<GameOptionProps> = ({ option, onSelect, disabled }) => {
  return (
    <button
      className={`game-option ${option}`}
      onClick={() => onSelect(option)}
      disabled={disabled}
    >
      {icons[option]}
    </button>
  );
};
