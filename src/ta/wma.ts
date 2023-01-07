import { CircularBuffer } from '../providers/circular-buffer';

/**
 * Weighted moving average (WMA) assign a heavier weighting to more current data points since they are more relevant than data points
 * in the distant past. The sum of the weighting should add up to 1 (or 100%).
 * In the case of the simple moving average, the weightings are equally distributed, which is why they are not shown in the table above.
 */
export class WMA {
  private denominator: number;
  private buffer: CircularBuffer;
  private prices: number[];

  constructor(period: number) {
    this.denominator = (period * (period + 1)) / 2;
    this.buffer = new CircularBuffer(period);
    this.prices = [];
  }

  /**
   * Get next value for closed candle hlc
   * affect all next calculations
   */
  next(price: number) {
    this.buffer.push(price);

    if (!this.buffer.filled) {
      return NaN;
    }

    let result = 0;

    this.buffer.forEach((v, idx) => {
      result += (v * (idx + 1)) / this.denominator;
    });

    return result;
  }

  /**
   * Get next value for non closed (tick) candle hlc
   * does not affect any next calculations
   */
  moment(price: number) {
    // return this.prevValue + (value - this.prevValue) / this.period;
  }
}
