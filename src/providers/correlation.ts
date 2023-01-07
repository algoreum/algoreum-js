import { SMA } from '../ta/moving-averages/sma';
import { CircularBuffer } from './circular-buffer';

export class Correlation {
  private pricesX: CircularBuffer;
  private pricesY: CircularBuffer;
  private filled: boolean;
  private SMAx: SMA;
  private SMAy: SMA;
  private SMAxValue: number;
  private SMAyValue: number;

  constructor(public period: number) {
    this.SMAx = new SMA(this.period);
    this.SMAy = new SMA(this.period);
    this.pricesX = new CircularBuffer(this.period);
    this.pricesY = new CircularBuffer(this.period);
  }

  next(priceX: number, priceY: number) {
    this.pricesX.push(priceX);
    this.pricesY.push(priceY);

    this.SMAxValue = this.SMAx.next(priceX);
    this.SMAyValue = this.SMAy.next(priceY);

    let SSxy = 0;
    let SSxx = 0;
    let SSyy = 0;

    for (let i = 0; i < this.period; i++) {
      const xPrice = this.pricesX.toArray()[i];
      const yPrice = this.pricesY.toArray()[i];

      SSxy += (xPrice - this.SMAxValue) * (yPrice - this.SMAyValue);
      SSxx += (xPrice - this.SMAxValue) ** 2;
      SSyy += (yPrice - this.SMAyValue) ** 2;
    }

    return SSxy / Math.sqrt(SSxx * SSyy);
  }
}
