
import { GameState, GameHistory } from './types';

// Simple SHA-256 like hash for simulation (Provably Fair)
const mockHash = (str: string) => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return Math.abs(hash).toString(16);
};

export class GameEngine {
  private gameState: GameState = GameState.WAITING;
  private multiplier: number = 1.0;
  private crashValue: number = 0;
  private lastUpdateTime: number = 0;
  private nextRoundTime: number = 0;
  private roundHash: string = '';
  private history: GameHistory[] = [];
  
  private onStateChange: (state: any) => void;

  constructor(onStateChange: (state: any) => void) {
    this.onStateChange = onStateChange;
    this.initNextRound();
    this.tick();
  }

  private initNextRound() {
    this.gameState = GameState.WAITING;
    this.multiplier = 1.0;
    this.nextRoundTime = Date.now() + 5000;
    
    // Provably fair generation
    const seed = Math.random().toString();
    this.roundHash = mockHash(seed);
    
    // RNG logic: 1% chance of instant crash at 1.00
    // Otherwise 1/(1-X) formula
    const r = Math.random();
    if (r < 0.03) {
      this.crashValue = 1.00;
    } else {
      const val = 0.99 / (1 - r);
      this.crashValue = Math.max(1.01, Math.floor(val * 100) / 100);
    }

    this.broadcast();
  }

  private startRound() {
    this.gameState = GameState.PLAYING;
    this.lastUpdateTime = performance.now();
    this.broadcast();
  }

  private tick = () => {
    const now = Date.now();

    if (this.gameState === GameState.WAITING) {
      if (now >= this.nextRoundTime) {
        this.startRound();
      }
    } else if (this.gameState === GameState.PLAYING) {
      const performanceNow = performance.now();
      const delta = (performanceNow - this.lastUpdateTime) / 1000;
      this.lastUpdateTime = performanceNow;

      // Realistic growth: e^(0.06 * time)
      // For simplicity here, we use a controlled increment
      const increment = this.multiplier * 0.05 * delta;
      this.multiplier += increment;

      if (this.multiplier >= this.crashValue) {
        this.multiplier = this.crashValue;
        this.gameState = GameState.CRASHED;
        
        const record: GameHistory = {
          id: Math.random().toString(36).substr(2, 9),
          multiplier: this.multiplier,
          timestamp: now,
          hash: this.roundHash
        };
        
        this.history = [record, ...this.history].slice(0, 50);
        
        setTimeout(() => this.initNextRound(), 3000);
      }
      this.broadcast();
    }

    requestAnimationFrame(this.tick);
  }

  private broadcast() {
    this.onStateChange({
      gameState: this.gameState,
      multiplier: this.multiplier,
      nextRoundTime: this.nextRoundTime,
      history: this.history,
      roundHash: this.roundHash
    });
  }

  public getHistory() {
    return this.history;
  }
}
