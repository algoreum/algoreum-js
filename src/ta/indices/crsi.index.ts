import { PercentRank } from '../../providers/percent-rank';
import { ROC } from '../indicators/roc.indicator';
import { RSI } from './rsi.index';

/**
 * Connors RSI (CRSI) uses the above formula to generate a value between 0 and 100.
 * This is primarily used to identify overbought and oversold levels.
 * Connor's original definition of these levels is that a value over 90
 * should be considered overbought and a value under 10 should be considered oversold.
 * On occasion, signals occur during slight corrections during a trend. For example,
 * when the market is in an uptrend, Connors RSI might generate short term sell signals.
 * When the market is in a downtrend, Connors RSI might generate short term buy signals.
 * Original core here: https://tradingview.com/script/vWAPUAl9-Stochastic-Connors-RSI/
 */
export class cRSI {
  private rsi: RSI;
  private updownRsi: RSI;
  private previousClose: number;
  private updownPeriod: number;
  private updownValue: number;
  private roc: ROC;
  private percentRank: PercentRank;

  constructor(
    private period = 3,
    updownRsiPeriod = 2,
    percentRankPeriod = 100
  ) {
    this.rsi = new RSI(this.period);
    this.updownRsi = new RSI(updownRsiPeriod);
    this.roc = new ROC(1);
    this.percentRank = new PercentRank(percentRankPeriod);
    this.updownPeriod = 0;
    this.previousClose = 0;
  }

  next(price: number) {
    const rsi = this.rsi.next(price);
    const percentRank = this.percentRank.next(this.roc.next(price));

    this.updownPeriod = this.getUpdownPeriod(price);
    this.previousClose = price;
    this.updownValue = this.updownRsi.next(this.updownPeriod);

    if (!this.updownValue) {
      return NaN;
    }

    return (rsi + this.updownValue + percentRank) / 3;
  }

  momentValue(price: number) {
    const rsi = this.rsi.moment(price);
    const percentRank = this.percentRank.moment(this.roc.moment(price));
    const updownPeriod = this.getUpdownPeriod(price);
    const updownValue = this.updownRsi.moment(updownPeriod);

    if (updownValue === undefined) {
      return NaN;
    }

    return (rsi + updownValue + percentRank) / 3;
  }

  private getUpdownPeriod(price: number) {
    let updownPeriod = this.updownPeriod;

    if (price > this.previousClose) {
      // reset negative streak
      if (this.updownPeriod < 0) {
        updownPeriod = 0;
      }

      updownPeriod++;
    } else if (price < this.previousClose) {
      // reset positive streak
      if (this.updownPeriod > 0) {
        updownPeriod = 0;
      }

      updownPeriod--;
    } else {
      updownPeriod = 0;
    }

    return updownPeriod;
  }
}
