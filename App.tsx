import React, { useState, useCallback } from 'react';
import StartScreen from './components/StartScreen';
import DifficultyScreen from './components/DifficultyScreen';
import GameScreen from './components/GameScreen';
import GameOverScreen from './components/GameOverScreen';
import type { GameOverReason } from './types';
import { GameState, Difficulty } from './types';

export default function App(): React.ReactElement {
  const [gameState, setGameState] = useState<GameState>(GameState.START);
  const [difficulty, setDifficulty] = useState<Difficulty>(Difficulty.EASY);
  const [finalScore, setFinalScore] = useState<number>(0);
  const [gameOverReason, setGameOverReason] = useState<GameOverReason>('timeUp');

  const handleStart = useCallback(() => {
    setGameState(GameState.DIFFICULTY);
  }, []);

  const handleSelectDifficulty = useCallback((level: Difficulty) => {
    setDifficulty(level);
    setGameState(GameState.PLAYING);
  }, []);
  
  const handleGameOver = useCallback((score: number, reason: GameOverReason) => {
    setFinalScore(score);
    setGameOverReason(reason);
    setGameState(GameState.GAME_OVER);
  }, []);

  const handleRestart = useCallback(() => {
    setGameState(GameState.DIFFICULTY);
  }, []);

  const renderContent = () => {
    switch (gameState) {
      case GameState.START:
        return <StartScreen onStart={handleStart} />;
      case GameState.DIFFICULTY:
        return <DifficultyScreen onSelectDifficulty={handleSelectDifficulty} />;
      case GameState.PLAYING:
        return <GameScreen difficulty={difficulty} onGameOver={handleGameOver} />;
      case GameState.GAME_OVER:
        return <GameOverScreen score={finalScore} reason={gameOverReason} onRestart={handleRestart} />;
      default:
        return <StartScreen onStart={handleStart} />;
    }
  };

  return (
    <div className="font-sans w-full min-h-screen bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100 flex flex-col items-center justify-between p-4 sm:p-8 text-slate-800 overflow-x-hidden select-none">
      <header className="text-center my-8 animate-slide-up">
        <h1 className="text-5xl md:text-7xl font-bold mb-4 bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">
          School Heroes
        </h1>
        <p className="text-xl md:text-2xl text-slate-600 max-w-2xl mx-auto">
          Together, we can make every school day better for everyone! 🌈
        </p>
      </header>

      <main className="w-full flex-grow flex items-center justify-center">
         <div className="w-full h-full max-w-[480px] min-h-[600px] sm:h-[700px] bg-white/50 rounded-2xl shadow-2xl backdrop-blur-md relative overflow-hidden">
          {renderContent()}
        </div>
      </main>

      <footer className="mt-12 text-center space-y-4 animate-slide-up w-full">
        <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-8">
          {/* Rules Section */}
          <div className="bg-white/60 rounded-2xl p-6 shadow-lg text-left">
            <h3 className="text-2xl font-bold mb-4 text-slate-700">
              How to Play 📜
            </h3>
            <ul className="space-y-2 text-slate-600 list-disc list-inside">
              <li><span className="font-semibold text-green-600">+10 points</span> for each positive action caught.</li>
              <li><span className="font-semibold text-red-600">-5 points</span> for catching a negative action.</li>
              <li>Catching a <span className="font-semibold text-slate-800">💀 Zero Tolerance</span> item ends the game immediately!</li>
            </ul>
          </div>

          {/* Tips Section */}
          <div className="bg-white/60 rounded-2xl p-6 shadow-lg text-left">
            <h3 className="text-2xl font-bold mb-4 text-slate-700">
              Ways to Make School Better 💡
            </h3>
            <ul className="space-y-2 text-slate-600">
              <li className="flex items-center gap-2"><span className="text-2xl">🤝</span><span>Help classmates with homework</span></li>
              <li className="flex items-center gap-2"><span className="text-2xl">♻️</span><span>Recycle and keep campus clean</span></li>
              <li className="flex items-center gap-2"><span className="text-2xl">💚</span><span>Show kindness to everyone</span></li>
            </ul>
          </div>
        </div>
        <p className="text-sm text-slate-500 pt-4">
          Every positive action counts! Share this game with your friends! 🚀
        </p>
      </footer>
    </div>
  );
}