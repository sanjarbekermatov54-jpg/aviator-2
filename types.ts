
export enum GameState {
  WAITING = 'WAITING',
  PLAYING = 'PLAYING',
  CRASHED = 'CRASHED'
}

export interface Bet {
  id: string;
  user: string;
  amount: number;
  multiplier?: number;
  winAmount?: number;
  isCashedOut: boolean;
  timestamp: number;
}

export interface GameHistory {
  id: string;
  multiplier: number;
  timestamp: number;
  hash: string; // For provably fair verification
}

export interface ServerState {
  gameState: GameState;
  multiplier: number;
  crashValue: number;
  nextRoundTimestamp: number;
  currentRoundHash: string;
}
