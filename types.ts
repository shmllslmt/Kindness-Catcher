
export enum GameState {
  START,
  DIFFICULTY,
  PLAYING,
  GAME_OVER,
}

export enum Difficulty {
  EASY,
  MEDIUM,
  ADVANCED,
}

export enum ItemType {
  POSITIVE,
  NEGATIVE,
  GAME_OVER,
}

export type GameOverReason = 'timeUp' | 'zeroTolerance';

export interface Item {
  id: number;
  x: number;
  y: number;
  type: ItemType;
  content: {
    icon: string;
    text: string;
  };
  speed: number;
}

export interface DifficultySettings {
  timer: number;
  spawnRate: number;
  speedRange: [number, number];
  gameOverItems: number;
  gameOverItemAfter?: number; // Time in seconds after which game over items start appearing
}
