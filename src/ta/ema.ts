import { SMA } from './sma';

/**
 * An exponential moving average (EMA) is a type of moving average (MA)
 * that places a greater weight and significance on the most recent data points.
 * The exponential moving average is also referred to as the exponentially weighted moving average.
 * An exponentially weighted moving average reacts more significantly to recent price changes
 * than a simple moving average (SMA), which applies an equal weight to all observations in the period.
 */
export class EMA {
  private smooth: number;
  private ema: number;
  private sma: SMA;

  constructor(private period: number) {
    this.smooth = 2 / (this.period + 1);
    this.sma = new SMA(this.period);
  }

  /**
   * Get next value for closed candle hlc
   * affect all next calculations
   */
  next(price: number) {
    const sma = this.sma.next(price);

    if (sma) {
      this.ema = sma;
      this.next = (price: number) => {
        return (this.ema = (price - this.ema) * this.smooth + this.ema);
      };
      this.moment = (price: number) => {
        return (price - this.ema) * this.smooth + this.ema;
      };
    }

    return sma;
  }

  /**
   * Get next value for non closed (tick) candle hlc
   * does not affect any next calculations
   */
  moment(price: number): number {
    return;
  }
}
