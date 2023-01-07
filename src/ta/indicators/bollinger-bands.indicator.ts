import { SMA } from '../moving-averages/sma';
import { StandardDeviation } from '../standard-deviation';
export class BollingerBands {
  private sd: StandardDeviation;
  private sma: SMA;
  private fill = 0;

  constructor(private period = 20, private stdDev: number = 2) {
    this.sma = new SMA(period);
    this.sd = new StandardDeviation(period);
  }

  next(close: number) {
    const middle = this.sma.next(close);
    const sd = this.sd.next(close, middle);

    this.fill++;

    if (this.fill !== this.period) {
      return;
    }

    const lower = middle - this.stdDev * sd;
    const upper = middle + this.stdDev * sd;

    this.next = (close: number) => {
      const middle = this.sma.next(close);
      const sd = this.sd.next(close, middle);
      const lower = middle - this.stdDev * sd;
      const upper = middle + this.stdDev * sd;

      return { lower, middle, upper };
    };

    return { lower, middle, upper };
  }

  moment(close: number) {
    const middle = this.sma.moment(close);
    const sd = this.sd.moment(close, middle);
    const lower = middle - this.stdDev * sd;
    const upper = middle + this.stdDev * sd;

    return { lower, middle, upper };
  }
}
