import { CircularBuffer } from '../providers/circular-buffer';

export class StandardDeviation {
  private buffer: CircularBuffer;

  constructor(private period: number) {
    this.buffer = new CircularBuffer(period);
  }

  next(price: number, mean?: number) {
    this.buffer.push(price);

    return Math.sqrt(
      this.buffer.toArray().reduce((acc, item) => acc + (item - mean) ** 2, 0) /
        this.period
    );
  }

  moment(price: number, mean?: number) {
    const rm = this.buffer.push(price);
    const result = Math.sqrt(
      this.buffer.toArray().reduce((acc, item) => acc + (item - mean) ** 2, 0) /
        this.period
    );
    this.buffer.pushback(rm);

    return result;
  }

  calculate(prices: number[], price: number, mean?: number) {}
}
