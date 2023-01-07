/**
 * Heikin-Ashi Candlesticks are an offshoot from Japanese candlesticks.
 * Heikin-Ashi Candlesticks use the open-close data from the prior period
 * and the open-high-low-close data from the current period to create a combo candlestick.
 * The resulting candlestick filters out some noise in an effort to better capture the trend.
 * In Japanese, Heikin means “average” and Ashi means “pace” (EUDict.com).
 * Taken together, Heikin-Ashi represents the average pace of prices.
 * Heikin-Ashi Candlesticks are not used like normal candlesticks.
 * Dozens of bullish or bearish reversal patterns consisting of 1-3 candlesticks are not to be found.
 * Instead, these candlesticks can be used to identify trending periods,
 * potential reversal points and classic technical analysis patterns.
 */
export class HeikenAshi {
  private previousOpen = 0;
  private previousClose = 0;

  /**
   * Get next value for closed candle hlc
   * affect all next calculations
   */
  next(open: number, high: number, low: number, close: number) {
    const data = this.calculate(open, high, low, close);

    this.previousClose = data.close;
    this.previousOpen = data.open;

    return data;
  }

  /**
   * Get next value for non closed (tick) candle hlc
   * does not affect any next calculations
   */
  moment(open: number, high: number, low: number, close: number) {
    return this.calculate(open, high, low, close);
  }

  /**
   * Heiken ashi formula
   */
  calculate(open: number, high: number, low: number, close: number) {
    close = (open + high + low + close) / 4;

    if (this.previousOpen) {
      open = (this.previousOpen + this.previousClose) / 2;
    }

    high = Math.max(high, open, close);
    low = Math.min(low, open, close);

    return { open, high, low, close };
  }
}
