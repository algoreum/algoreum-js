import { SMA } from '../moving-averages/sma';

/**
 Awesome Oscillator (AO) is an indicator that is non-limiting oscillator,
 providing insight into the weakness or the strength of a stock.
 The Awesome Oscillator is used to measure market momentum and
 to affirm trends or to anticipate possible reversals.
 */

export class AO {
  private smaSlow: SMA;
  private smaFast: SMA;
  private smaSlowValue: number;
  private smaFastValue: number;

  constructor(fastPeriod = 5, slowPeriod = 34) {
    this.smaSlow = new SMA(slowPeriod);
    this.smaFast = new SMA(fastPeriod);
  }

  next(high: number, low: number) {
    this.smaSlowValue = this.smaSlow.next((high + low) / 2);
    this.smaFastValue = this.smaFast.next((high + low) / 2);

    if (this.smaSlowValue === undefined || this.smaFastValue === undefined) {
      return NaN;
    }

    this.next = (high: number, low: number) => {
      this.smaSlowValue = this.smaSlow.next((high + low) / 2);
      this.smaFastValue = this.smaFast.next((high + low) / 2);

      return this.smaFastValue - this.smaSlowValue;
    };

    this.moment = (high: number, low: number) => {
      return (
        this.smaFast.moment((high + low) / 2) -
        this.smaSlow.moment((high + low) / 2)
      );
    };

    return this.smaFastValue - this.smaSlowValue;
  }

  moment(high: number, low: number): number {
    return;
  }
}
