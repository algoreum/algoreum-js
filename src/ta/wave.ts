import { percentageChange } from '../utils';

export type WaveData = {
  consolidate: number;
  power: number;
  streak: number;
  diff: number;
  startPrice: number;
  previousPeak: number;
};

function clenWave(wave: WaveData) {
  wave.consolidate = 0;
  wave.power = 0;
  wave.streak = 0;
  wave.diff = 0;
  wave.startPrice = 0;
  wave.previousPeak = 0;

  return wave;
}

export class Wave {
  private up: WaveData;
  private down: WaveData;

  constructor() {
    this.up = {
      consolidate: 0,
      power: 0,
      streak: 0,
      startPrice: 0,
      diff: 0,
      previousPeak: 0
    };
    this.down = {
      consolidate: 0,
      power: 0,
      streak: 0,
      startPrice: 0,
      diff: 0,
      previousPeak: 0
    };
  }

  next(open: number, close: number, high: number, low: number) {
    // bullish
    if (open < close || (this.up.streak && this.up.previousPeak < low)) {
      if (!this.up.startPrice) {
        this.up.startPrice = open;
      }

      if (this.down.streak) {
        clenWave(this.down);
      }

      const diff = close - open;
      this.up.streak++;
      this.up.previousPeak = low;

      if (this.up.diff > diff) {
        this.up.consolidate++;
      } else {
        this.up.consolidate = 0;
      }

      this.up.diff = diff;
      this.up.power = percentageChange(close, this.up.startPrice);
    }

    // bearish
    if (open > close || (this.down.streak && this.down.previousPeak > high)) {
      if (!this.down.startPrice) {
        this.down.startPrice = open;
      }

      if (this.up.streak) {
        clenWave(this.up);
      }

      const diff = open - close;
      this.down.streak++;
      this.down.previousPeak = high;

      if (this.down.diff > diff) {
        this.down.consolidate++;
      } else {
        this.down.consolidate = 0;
      }

      this.down.diff = diff;
      this.down.power = percentageChange(close, this.down.startPrice);
    }

    // doji is neutral
    if (open === close) {
      this.up.streak++;
      this.down.streak++;
      this.up.diff = this.down.diff = 0;
    }

    if (this.up.streak > this.down.streak) {
      return { ...this.up };
    } else {
      return { ...this.down };
    }
  }
}
