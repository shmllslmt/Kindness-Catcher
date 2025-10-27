import React, { useState, useEffect, useRef, useCallback } from 'react';
import type { Difficulty, Item, GameOverReason } from '../types';
import { ItemType } from '../types';
import {
  DIFFICULTY_SETTINGS,
  POSITIVE_ITEMS,
  NEGATIVE_ITEMS,
  GAMEOVER_ITEMS,
  PLAYER_WIDTH,
  ITEM_SIZE,
} from '../constants';

interface GameScreenProps {
  difficulty: Difficulty;
  onGameOver: (score: number, reason: GameOverReason) => void;
}

const GameScreen: React.FC<GameScreenProps> = ({ difficulty, onGameOver }) => {
  const settings = DIFFICULTY_SETTINGS[difficulty];
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(settings.timer);
  const [items, setItems] = useState<Item[]>([]);
  const [playerPosition, setPlayerPosition] = useState(
    typeof window !== 'undefined' ? window.innerWidth / 2 : 0
  );

  const gameAreaRef = useRef<HTMLDivElement>(null);
  const animationFrameId = useRef<number>();
  const lastSpawnTime = useRef(0);
  const lastTimestamp = useRef(0);
  const gameStartTime = useRef(Date.now());

  const playerPositionRef = useRef(playerPosition);
  playerPositionRef.current = playerPosition;

  const onGameOverRef = useRef(onGameOver);
  onGameOverRef.current = onGameOver;
  
  const settingsRef = useRef(settings);
  settingsRef.current = settings;

  const gameLoop = useCallback((timestamp: number) => {
    if (lastTimestamp.current === 0) {
      lastTimestamp.current = timestamp;
      animationFrameId.current = requestAnimationFrame(gameLoop);
      return;
    }

    const deltaTime = timestamp - lastTimestamp.current;
    lastTimestamp.current = timestamp;
    const timeCorrection = deltaTime / (1000 / 60);

    // --- Timer ---
    const elapsedSeconds = Math.floor((Date.now() - gameStartTime.current) / 1000);
    const newTimeLeft = settingsRef.current.timer - elapsedSeconds;

    if (newTimeLeft < 0) {
      setScore(currentScore => {
        onGameOverRef.current(currentScore, 'timeUp');
        return currentScore;
      });
      return; 
    }
    setTimeLeft(newTimeLeft);

    // --- Item Spawning ---
    let spawnedItems: Item[] = [];
    if (timestamp - lastSpawnTime.current >= settingsRef.current.spawnRate) {
      const elapsedGameSeconds = (Date.now() - gameStartTime.current) / 1000;
      const { gameOverItemAfter, gameOverItems } = settingsRef.current;
      const canSpawnGameOver = !gameOverItemAfter || elapsedGameSeconds > gameOverItemAfter;

      let itemTypes: ItemType[] = [ItemType.POSITIVE, ItemType.POSITIVE, ItemType.NEGATIVE];
      if (canSpawnGameOver) {
        for (let i = 0; i < gameOverItems; i++) {
          itemTypes.push(ItemType.GAME_OVER);
        }
      }
      const type = itemTypes[Math.floor(Math.random() * itemTypes.length)];
      
      let contentList;
      switch (type) {
        case ItemType.POSITIVE: contentList = POSITIVE_ITEMS; break;
        case ItemType.NEGATIVE: contentList = NEGATIVE_ITEMS; break;
        case ItemType.GAME_OVER: contentList = GAMEOVER_ITEMS; break;
      }
      const content = contentList[Math.floor(Math.random() * contentList.length)];
      const gameAreaWidth = gameAreaRef.current?.clientWidth || window.innerWidth;
      const { speedRange } = settingsRef.current;

      spawnedItems.push({
        id: Date.now(),
        type,
        content,
        x: Math.random() * (gameAreaWidth - ITEM_SIZE),
        y: -ITEM_SIZE,
        speed: speedRange[0] + Math.random() * (speedRange[1] - speedRange[0]),
      });
      lastSpawnTime.current = timestamp;
    }

    // --- Item Movement & Collision ---
    setItems(currentItems => {
      const gameAreaHeight = gameAreaRef.current?.clientHeight || window.innerHeight;
      const playerX = playerPositionRef.current;
      const playerRect = {
        left: playerX - PLAYER_WIDTH / 2,
        right: playerX + PLAYER_WIDTH / 2,
        top: gameAreaHeight - 80, // Adjusted for new player height
        bottom: gameAreaHeight,
      };

      const remainingItems: Item[] = [];

      for (const item of currentItems) {
        const newY = item.y + item.speed * timeCorrection;
        const itemRect = {
          left: item.x,
          right: item.x + ITEM_SIZE,
          top: newY,
          bottom: newY + ITEM_SIZE,
        };

        let caught = false;
        if (
          itemRect.bottom > playerRect.top &&
          itemRect.top < playerRect.bottom &&
          itemRect.right > playerRect.left &&
          itemRect.left < playerRect.right
        ) {
          caught = true;
          if (item.type === ItemType.POSITIVE) {
            setScore(s => s + 10);
          } else if (item.type === ItemType.NEGATIVE) {
            setScore(s => Math.max(0, s - 5));
          } else if (item.type === ItemType.GAME_OVER) {
            if (animationFrameId.current) cancelAnimationFrame(animationFrameId.current);
            setScore(currentScore => {
              onGameOverRef.current(currentScore, 'zeroTolerance');
              return currentScore;
            });
          }
        }

        if (!caught && newY < gameAreaHeight) {
          remainingItems.push({ ...item, y: newY });
        }
      }

      return [...remainingItems, ...spawnedItems];
    });

    animationFrameId.current = requestAnimationFrame(gameLoop);
  }, []);

  useEffect(() => {
    gameStartTime.current = Date.now();
    lastTimestamp.current = 0;
    animationFrameId.current = requestAnimationFrame(gameLoop);
    return () => {
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
    };
  }, [gameLoop]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (gameAreaRef.current) {
        const rect = gameAreaRef.current.getBoundingClientRect();
        const newX = e.clientX - rect.left;
        setPlayerPosition(Math.max(PLAYER_WIDTH / 2, Math.min(newX, rect.width - PLAYER_WIDTH / 2)));
      }
    };
    const handleTouchMove = (e: TouchEvent) => {
      if (gameAreaRef.current && e.touches[0]) {
        const rect = gameAreaRef.current.getBoundingClientRect();
        const newX = e.touches[0].clientX - rect.left;
        setPlayerPosition(Math.max(PLAYER_WIDTH / 2, Math.min(newX, rect.width - PLAYER_WIDTH / 2)));
      }
    };

    const gameNode = gameAreaRef.current;
    gameNode?.addEventListener('mousemove', handleMouseMove);
    gameNode?.addEventListener('touchmove', handleTouchMove);
    return () => {
      gameNode?.removeEventListener('mousemove', handleMouseMove);
      gameNode?.removeEventListener('touchmove', handleTouchMove);
    };
  }, []);
  
  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getItemStyles = (item: Item) => {
    let baseClasses = 'absolute flex flex-col items-center justify-center p-1 rounded-lg text-center font-medium transition-transform duration-300 ';
    let animationClass = '';
    switch (item.type) {
      case ItemType.POSITIVE:
        baseClasses += 'bg-green-500/20 text-green-800';
        animationClass = 'animate-pulse';
        break;
      case ItemType.NEGATIVE:
        baseClasses += 'bg-red-500/20 text-red-800';
        break;
      case ItemType.GAME_OVER:
        baseClasses += 'bg-slate-700/30 text-slate-900 border-2 border-red-500';
        animationClass = 'animate-pulse';
        break;
    }
    return `${baseClasses} ${animationClass}`;
  };

  return (
    <div ref={gameAreaRef} className="w-full h-full relative cursor-none overflow-hidden bg-gradient-to-b from-sky-200 to-blue-300">
      {/* Header */}
      <header className="absolute top-4 left-4 right-4 p-4 flex justify-between items-center bg-white/30 backdrop-blur-sm rounded-xl shadow-lg z-10">
        <div className="text-xl font-bold text-slate-800">Score: <span className="text-2xl bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">{score}</span></div>
        <div className={`text-2xl font-bold ${timeLeft <= 10 ? 'text-red-500 animate-pulse' : 'text-slate-800'}`}>
          {formatTime(timeLeft)}
        </div>
      </header>

      {/* Items */}
      {items.map(item => (
        <div
          key={item.id}
          className={getItemStyles(item)}
          style={{ left: item.x, top: item.y, width: ITEM_SIZE, willChange: 'transform' }}
          aria-hidden="true"
        >
          <span className="text-4xl">{item.content.icon}</span>
          <span className="text-xs mt-1">{item.content.text}</span>
        </div>
      ))}
      
      {/* Player */}
      <div
        className="absolute bottom-2 animate-float"
        style={{
          left: playerPosition,
          transform: `translateX(-50%)`,
          width: PLAYER_WIDTH,
          willChange: 'transform',
          textAlign: 'center'
        }}
        aria-label="Player catcher"
      >
        <span className="text-6xl drop-shadow-lg" aria-hidden="true">🎒</span>
      </div>
    </div>
  );
};

export default GameScreen;