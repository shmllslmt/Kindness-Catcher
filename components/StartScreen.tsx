import React from 'react';

interface StartScreenProps {
  onStart: () => void;
}

const StartScreen: React.FC<StartScreenProps> = ({ onStart }) => {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center p-8 text-center text-slate-800 animate-slide-up">
      <div className="text-center space-y-4">
        <h2 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-blue-500 to-teal-400 bg-clip-text text-transparent">
          Make School Better!
        </h2>
        <p className="text-lg text-slate-600 max-w-md mx-auto">
          Catch positive actions and avoid negative ones. Every good choice makes a difference!
        </p>
      </div>
      <button
        onClick={onStart}
        className="mt-12 px-10 py-4 bg-gradient-to-r from-green-400 to-blue-500 text-white text-2xl font-bold rounded-full shadow-lg hover:scale-105 transition-transform duration-300 shadow-blue-500/30"
      >
        Start Game 🎮
      </button>
    </div>
  );
};

export default StartScreen;