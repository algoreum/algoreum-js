import { MovingAverage } from '../enums/MovingAverage.enum';
import { ATR } from './atr';
/**
 * SuperTrend indicator is one of the hybrid custom tools that show the current trend in the market.
 * The indicator name stands for Multi Time Frame SuperTrend.
 * The tool can show the direction of the trend on several timeframes at once.
 */
export class SuperTrend {
  private atr: ATR;
  private previousSuperTrendValue: number;
  private previousUpper: number;
  private previousLower: number;
  private previousClose: number;

  constructor(
    period = 10,
    private multiplier = 3,
    smoothing: MovingAverage = MovingAverage.SMA
  ) {
    this.atr = new ATR(period, smoothing);
  }

  next(high: number, low: number, close: number) {
    const atr = this.atr.next(high, low, close);

    if (atr) {
      const src = (high + low) / 2;
      let upper = src + this.multiplier * atr;
      let lower = src - this.multiplier * atr;

      if (this.previousLower) {
        lower =
          lower > this.previousLower || this.previousClose < this.previousLower
            ? lower
            : this.previousLower;
        upper =
          upper < this.previousUpper || this.previousClose > this.previousUpper
            ? upper
            : this.previousUpper;
      }

      let superTrend = upper;

      if (this.previousSuperTrendValue === this.previousUpper) {
        superTrend = close > upper ? lower : upper;
      } else {
        superTrend = close < lower ? upper : lower;
      }

      const direction = superTrend === upper ? 1 : -1;

      this.previousUpper = upper;
      this.previousLower = lower;
      this.previousSuperTrendValue = superTrend;
      this.previousClose = close;

      return { upper, lower, superTrend, direction };
    }
  }

  moment(high: number, low: number, close: number) {
    const atr = this.atr.moment(high, low);
    const src = (high + low) / 2;

    let upper = src + this.multiplier * atr;
    let lower = src - this.multiplier * atr;

    if (this.previousLower) {
      lower =
        lower > this.previousLower || this.previousClose < this.previousLower
          ? lower
          : this.previousLower;
      upper =
        upper < this.previousSuperTrendValue ||
        this.previousClose > this.previousUpper
          ? upper
          : this.previousUpper;
    }

    let superTrend = upper;

    if (this.previousSuperTrendValue === this.previousUpper) {
      superTrend = close > upper ? lower : upper;
    } else {
      superTrend = close < lower ? upper : lower;
    }

    const direction = superTrend === upper ? 1 : -1;

    return { upper, lower, superTrend, direction };
  }
}
