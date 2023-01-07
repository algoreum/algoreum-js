/**
 * The Welles Wilder's Smoothing Average (WWS) was developed by J. Welles Wilder, Jr. and is part of the Wilder's RSI indicator implementation.
 * This indicator smoothes price movements to help you identify and spot bullish and bearish trends.
 */
export class WWS {
  private previousValue: number = 0;
  private sumCount = 1;

  constructor(private period: number) {}

  /**
   * Get next value for closed candle hlc
   * affect all next calculations
   */
  next(price: number) {
    if (this.sumCount < this.period) {
      this.previousValue += price;
      this.sumCount++;

      return;
    }

    if (this.sumCount === this.period) {
      this.previousValue += price;
      this.sumCount++;

      this.next = (value: number) =>
        (this.previousValue =
          this.previousValue - this.previousValue / this.period + value);

      return this.previousValue;
    }
  }

  /**
   * Get next value for non closed (tick) candle hlc
   * does not affect any next calculations
   */
  moment(price: number) {
    return this.previousValue + (price - this.previousValue) / this.period;
  }
}
