import React from 'react';
import type { GameOverReason } from '../types';

interface GameOverScreenProps {
  score: number;
  reason: GameOverReason;
  onRestart: () => void;
}

const GameOverScreen: React.FC<GameOverScreenProps> = ({ score, reason, onRestart }) => {
  const getMessage = () => {
    if (reason === 'zeroTolerance') {
      return (
        <>
          <h2 className="text-4xl font-bold text-red-600 mb-2">Game Over! 🎯</h2>
          <p className="text-lg text-slate-700 max-w-sm">You encountered a zero-tolerance situation! Remember to always seek adult help in serious situations.</p>
        </>
      );
    }

    if (score >= 100) return "Amazing! You're a school hero! 🌟";
    if (score >= 50) return "Great job! Keep making school better! 💪";
    if (score >= 20) return "Good start! Every positive action counts! 👍";
    return "Keep trying! Small actions make big changes! 💚";
  };

  return (
    <div className="w-full h-full flex flex-col items-center justify-center p-8 text-center bg-white/70 animate-bounce-in">
        <div className="text-center space-y-4">
          <div className="space-y-2">
             <h2 className="text-4xl md:text-5xl font-bold text-slate-800">
                {reason !== 'zeroTolerance' ? 'Game Over! 🎯' : ''}
             </h2>
            <p className="text-8xl font-bold bg-gradient-to-r from-green-400 to-blue-500 bg-clip-text text-transparent">
              {score}
            </p>
            <p className="text-xl text-slate-600">points</p>
          </div>
          <p className="text-lg text-slate-700 max-w-md mx-auto min-h-[56px]">
            {getMessage()}
          </p>
        </div>
      <button
        onClick={onRestart}
        className="mt-8 px-10 py-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-2xl font-bold rounded-full shadow-lg hover:scale-105 transition-transform duration-300"
      >
        Play Again 🔄
      </button>
    </div>
  );
};

export default GameOverScreen;