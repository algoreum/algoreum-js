import { SMMA } from '../moving-averages/smma';
import { EMA } from '../moving-averages/ema';
import { WEMA } from '../moving-averages/wema';
import { LWMA } from '../moving-averages/lwma';
import { SMA } from '../moving-averages/sma';
import { EWMA } from '../moving-averages/ewma';
import { RMA } from '../moving-averages/rma';
import { getTrueRange } from '../../providers/true-range';
import { MovingAverage } from '../../enums/MovingAverage.enum';

export class ATR {
  private previousClose: number;
  private avg: EMA | SMMA | WEMA | LWMA | SMA | EWMA | RMA;

  /**
   * Constructor
   * @param period - default period 14
   */
  constructor(period = 14, smoothing: MovingAverage = MovingAverage.SMA) {
    switch (smoothing) {
      case 'SMA':
        this.avg = new SMA(period);
        break;
      case 'EMA':
        this.avg = new EMA(period);
        break;
      case 'SMMA':
        this.avg = new SMMA(period);
        break;
      case 'WEMA':
        this.avg = new WEMA(period);
        break;
      case 'LWMA':
        this.avg = new LWMA(period);
        break;
      case 'EWMA':
        this.avg = new EWMA(0.2);
        break;
      case 'RMA':
        this.avg = new RMA(period);
        break;
    }

    this.previousClose = 0;
  }

  next(high: number, low: number, close: number) {
    const trueRange = getTrueRange(high, low, this.previousClose);

    this.previousClose = close;

    if (trueRange === undefined) {
      return NaN;
    }

    return this.avg.next(trueRange);
  }

  moment(high: number, low: number) {
    const trueRange = getTrueRange(high, low, this.previousClose);

    if (trueRange === undefined) {
      return NaN;
    }

    return this.avg.moment(trueRange);
  }
}
