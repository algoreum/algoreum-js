import { getTrueRange } from '../../providers/true-range';
import { WEMA } from '../moving-averages/wema';
import { WWS } from '../moving-averages/wws';

/**
 * ADX values help traders identify the strongest and most profitable trends to trade.
 * The values are also important for distinguishing between trending and non-trending conditions.
 * Many traders will use ADX readings above 25 to suggest that the trend is strong enough for trend-trading strategies.
 * Conversely, when ADX is below 25, many will avoid trend-trading strategies.
 * ADX Value	Trend Strength
 * 0-25	Absent or Weak Trend
 * 25-50	Strong Trend
 * 50-75	Very Strong Trend
 * 75-100	Extremely Strong Trend
 */
export class ADX {
  private previousHigh: number;
  private previousLow: number;
  private previousClose: number;
  private wma1: WWS;
  private wma2: WWS;
  private wma3: WWS;
  private wema: WEMA;

  constructor(public period: number = 14) {
    this.wma1 = new WWS(period);
    this.wma2 = new WWS(period);
    this.wma3 = new WWS(period);
    this.wema = new WEMA(period);
  }

  next(high: number, low: number, close: number) {
    if (!this.previousClose) {
      this.previousHigh = high;
      this.previousLow = low;
      this.previousClose = close;

      return;
    }

    let pDM = 0;
    let nDM = 0;

    const hDiff = high - this.previousHigh;
    const lDiff = this.previousLow - low;

    if (hDiff > lDiff && hDiff > 0) {
      pDM = hDiff;
    }

    if (lDiff > hDiff && lDiff > 0) {
      nDM = lDiff;
    }

    if (pDM > nDM || nDM < 0) {
      nDM = 0;
    }

    const atr = this.wma1.next(getTrueRange(high, low, this.previousClose));
    const avgPDI = this.wma2.next(pDM);
    const avgNDI = this.wma3.next(nDM);

    this.previousHigh = high;
    this.previousLow = low;
    this.previousClose = close;

    if (avgPDI === undefined || avgNDI === undefined) {
      return;
    }

    const pDI = (avgPDI * 100) / atr;
    const nDI = (avgNDI * 100) / atr;
    const diAbs = pDI > nDI ? pDI - nDI : nDI - pDI;

    return {
      adx: this.wema.next(100 * (diAbs / (pDI + nDI))),
      pdi: pDI,
      mdi: nDI
    };
  }
}
