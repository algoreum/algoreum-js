import { SMA } from './sma';

/**
 * Relative Moving Average adds more weight to recent data (and gives less importance to older data).
 * This makes the RMA similar to the Exponential Moving Average, although it’s somewhat slower to respond than an EMA is.
 */
export class RMA {
  private previousValue: number;
  private alpha: number;
  private sma: SMA;

  constructor(private period: number = 14) {
    this.alpha = 1 / period;
    this.sma = new SMA(this.period);
  }

  next(price: number) {
    if (!this.previousValue) {
      this.previousValue = this.sma.next(price);
    } else {
      this.previousValue =
        this.alpha * price + (1 - this.alpha) * this.previousValue;

      this.next = (value: number) => {
        this.previousValue =
          this.alpha * value + (1 - this.alpha) * this.previousValue;

        return this.previousValue;
      };
    }

    return this.previousValue;
  }

  moment(price: number) {
    if (this.previousValue) {
      return this.alpha * price + (1 - this.alpha) * this.previousValue;
    }
  }
}
