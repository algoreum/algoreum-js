import { CircularBuffer } from './circular-buffer';
/**
 * Returns the percentile of a value. Returns the same values as the Excel PERCENTRANK and PERCENTRANK.INC functions.
 */
export class PercentRank {
  private prices: CircularBuffer;
  private fill = 0;

  constructor(private period: number) {
    this.prices = new CircularBuffer(period);
  }

  public next(price: number) {
    this.prices.push(price);
    this.fill++;

    if (this.fill === this.period) {
      this.next = (value: number) => {
        const result = this.calc(value);

        this.prices.push(value);

        return result;
      };

      this.moment = this.calc;

      return this.calc(price);
    }
  }

  public moment(price: number): number {
    return;
  }

  private calc(price: number) {
    let count = 0;

    this.prices.toArray().forEach((item) => {
      if (item <= price) count++;
    });

    return (count / this.period) * 100;
  }
}
