import React from 'react';
import { Difficulty } from '../types';

interface DifficultyScreenProps {
  onSelectDifficulty: (level: Difficulty) => void;
}

const DifficultyButton: React.FC<{
  level: Difficulty;
  text: string;
  color: string;
  onClick: (level: Difficulty) => void;
}> = ({ level, text, color, onClick }) => {
  return (
    <button
      onClick={() => onClick(level)}
      className={`w-full px-8 py-4 ${color} text-white text-2xl font-bold rounded-xl shadow-lg hover:opacity-90 transform hover:scale-105 transition-transform duration-300 mb-6`}
    >
      {text}
    </button>
  );
};

const DifficultyScreen: React.FC<DifficultyScreenProps> = ({ onSelectDifficulty }) => {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center p-8 text-slate-800 animate-slide-up">
      <h2 className="text-4xl font-bold mb-10">Choose Your Challenge</h2>
      <div className="w-full max-w-xs">
        <DifficultyButton
          level={Difficulty.EASY}
          text="Easy"
          color="bg-gradient-to-r from-cyan-500 to-blue-500"
          onClick={onSelectDifficulty}
        />
        <DifficultyButton
          level={Difficulty.MEDIUM}
          text="Medium"
          color="bg-gradient-to-r from-yellow-500 to-orange-500"
          onClick={onSelectDifficulty}
        />
        <DifficultyButton
          level={Difficulty.ADVANCED}
          text="Advanced"
          color="bg-gradient-to-r from-red-500 to-pink-500"
          onClick={onSelectDifficulty}
        />
      </div>
    </div>
  );
};

export default DifficultyScreen;