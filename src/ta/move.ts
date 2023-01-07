import { CircularBuffer } from '../providers/circular-buffer';
import { percentageChange } from '../utils';

export class Move {
  private changes: CircularBuffer;
  private previousPrice: number;
  private value = 0;

  /**
   * Constructor
   * @param period - integer value from 1 to  12
   */
  constructor(private period: number) {
    this.changes = new CircularBuffer(period);
  }

  next(close: number) {
    if (this.previousPrice) {
      const change = percentageChange(close, this.previousPrice);
      this.calculate(change);
      this.previousPrice = close;

      return this.value;
    }

    this.previousPrice = close;
  }

  calculate(change: number) {
    this.value += change;
    this.value -= this.changes.push(change);

    return this.value;
  }
}
