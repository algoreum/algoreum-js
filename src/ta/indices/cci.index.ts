import { MeanDeviationProvider } from '../../providers/mean-deviation';
import { SMA } from '../moving-averages/sma';

/**
 * The CCI, or Commodity Channel Index, was developed by Donald Lambert,
 * a technical analyst who originally published the indicator in Commodities magazine (now Futures)
 * in 1980.1 Despite its name, the CCI can be used in any market and is not just for commodities
 */
export class CCI {
  private md: MeanDeviationProvider;
  private sma: SMA;

  constructor(period = 20) {
    this.md = new MeanDeviationProvider(period);
    this.sma = new SMA(period);
  }

  next(high: number, low: number, close: number) {
    const typicalPrice = (high + low + close) / 3;
    const average = this.sma.next(typicalPrice);
    const meanDeviation = this.md.next(typicalPrice, average);

    return meanDeviation && (typicalPrice - average) / (0.015 * meanDeviation);
  }

  moment(high: number, low: number, close: number) {
    const typicalPrice = (high + low + close) / 3;
    const average = this.sma.moment(typicalPrice);
    const meanDeviation = this.md.next(typicalPrice, average);

    return meanDeviation && (typicalPrice - average) / (0.015 * meanDeviation);
  }
}
