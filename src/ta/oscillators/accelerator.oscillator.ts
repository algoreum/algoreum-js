import { SMA } from '../moving-averages/sma';
import { AO } from './awesome.oscillator';

/**
 The Accelerator Oscillator (AC indicator) is a technical analysis tool that helps
 to gauge the momentum in the market. It also helps to predict when the momentum will change.
 */

export class AC {
  private sma: SMA;
  private ao: AO;
  private smaValue: number;
  private aoValue: number;

  constructor() {
    this.sma = new SMA(5);
    this.ao = new AO();
  }

  next(high: number, low: number) {
    this.aoValue = this.ao.next(high, low);

    if (this.aoValue === undefined) {
      return NaN;
    }

    this.smaValue = this.sma.next(this.aoValue);

    if (this.smaValue === undefined) {
      return NaN;
    }

    // Performance hack with method overrides speed up +30_000 op/sec
    this.next = (high: number, low: number) => {
      this.aoValue = this.ao.next(high, low);
      this.smaValue = this.sma.next(this.aoValue);

      return this.aoValue - this.smaValue;
    };

    // Performance hack with method overrides
    this.moment = (high: number, low: number) => {
      return this.ao.moment(high, low) - this.sma.moment(this.aoValue);
    };

    return this.aoValue - this.smaValue;
  }

  moment(high: number, low: number) {
    return;
  }
}
