import { SMA } from './sma';

/**
 * The WEMA (Wilder's Smoothed Moving Average) is a powerful indicator based on the Simple Moving Average indicator.
 * The Simple Moving Average (SMA) indicator is useful to identify the start and reversal of a trend.
 */
export class WEMA {
  private smooth: number;
  private wema: number;
  private sma: SMA;

  constructor(private period: number) {
    this.smooth = 1 / this.period;
    this.sma = new SMA(this.period);
  }

  /**
   * Get next value for closed candle hlc
   * affect all next calculations
   */
  next(price: number) {
    if (!this.wema) {
      return (this.wema = this.sma.next(price));
    }

    return (this.wema = (price - this.wema) * this.smooth + this.wema);
  }

  /**
   * Get next value for non closed (tick) candle hlc
   * does not affect any next calculations
   */
  moment(price: number) {
    if (!this.wema) {
      return NaN;
    }

    return (price - this.wema) * this.smooth + this.wema;
  }
}
