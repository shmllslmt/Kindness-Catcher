import type { DifficultySettings } from './types';
import { Difficulty, ItemType } from './types';

export const PLAYER_WIDTH = 100;
export const ITEM_SIZE = 90;

export const POSITIVE_ITEMS = [
  { icon: '🤝', text: 'Help a friend' },
  { icon: '♻️', text: 'Recycle' },
  { icon: '📚', text: 'Study together' },
  { icon: '💚', text: 'Be kind' },
  { icon: '🌟', text: 'Encourage others' },
  { icon: '🎨', text: 'Share creativity' },
  { icon: '🤗', text: 'Include everyone' },
];

export const NEGATIVE_ITEMS = [
  { icon: '😠', text: 'Arguments' },
  { icon: '🚫', text: 'Exclusion' },
  { icon: '🤫', text: 'Bystander' },
  { icon: '🗑️', text: 'Littering' },
];

export const GAMEOVER_ITEMS = [
  { icon: '💀', text: 'Zero Tolerance' },
  { icon: '⚠️', text: 'Danger Zone' },
];

export const DIFFICULTY_SETTINGS: Record<Difficulty, DifficultySettings> = {
  [Difficulty.EASY]: {
    timer: 60,
    spawnRate: 2000,
    speedRange: [0.4, 0.7],
    gameOverItems: 1,
    gameOverItemAfter: 30,
  },
  [Difficulty.MEDIUM]: {
    timer: 60,
    spawnRate: 1500,
    speedRange: [0.6, 1.0],
    gameOverItems: 1,
  },
  [Difficulty.ADVANCED]: {
    timer: 60,
    spawnRate: 1000,
    speedRange: [0.8, 1.5],
    gameOverItems: 2,
  },
};