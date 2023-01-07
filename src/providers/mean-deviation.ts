import { CircularBuffer } from './circular-buffer';
export class MeanDeviationProvider {
  private prices: CircularBuffer;

  constructor(private period: number) {
    this.prices = new CircularBuffer(period);
  }

  next(typicalPrice: number, average?: number) {
    if (!average) {
      this.prices.push(typicalPrice);
      return void 0;
    }

    this.next = this.pureNext;
    this.moment = this.pureMoment;

    return this.pureNext(typicalPrice, average);
  }

  moment(typicalPrice: number, average?: number) {
    return void 0;
  }

  private pureNext(typicalPrice: number, average: number) {
    this.prices.push(typicalPrice);

    return (
      this.prices
        .toArray()
        .reduce((acc, value) => acc + this.positiveDelta(average, value), 0) /
      this.period
    );
  }

  private pureMoment(typicalPrice: number, average: number) {
    const rm = this.prices.push(typicalPrice);
    const mean = this.prices
      .toArray()
      .reduce((acc, value) => acc + this.positiveDelta(average, value), 0);

    this.prices.pushback(rm);

    return mean / this.period;
  }

  private positiveDelta(a: number, b: number) {
    return a > b ? a - b : b - a;
  }
}
