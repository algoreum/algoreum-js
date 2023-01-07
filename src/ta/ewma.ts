/**
 * The Exponentially Weighted Moving Average (EWMA) is a quantitative or statistical measure used to model or describe
 * a time series. The EWMA is widely used in finance, the main applications being technical analysis and volatility modeling.
 * The moving average is designed as such that older observations are given lower weights.
 * The weights fall exponentially as the data point gets older – hence the name exponentially weighted.
 * The only decision a user of the EWMA must make is the parameter alpha.
 * The parameter decides how important the current observation is in the calculation of the EWMA.
 * The higher the value of alpha, the more closely the EWMA tracks the original time series.
 * @param alpha must be from 0 to 1
 */
export class EWMA {
  private previousValue: number;
  private filled = false;

  constructor(private alpha = 0.2) {}

  next(price: number) {
    const ewma =
      this.alpha * price + (1 - this.alpha) * (this.previousValue || 1);
    this.filled = this.filled || this.previousValue !== undefined;
    this.previousValue = ewma;

    if (this.filled) {
      return ewma;
    }
  }

  moment(price: number) {
    if (this.filled) {
      return this.alpha * price + (1 - this.alpha) * (this.previousValue || 1);
    }
  }
}
