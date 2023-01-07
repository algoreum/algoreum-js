// console.log(sma([1, 2, 3, 4, 5, 6, 7, 8, 9], 4));
//=> [ '2.50', '3.50', '4.50', '5.50', '6.50', '7.50' ]
//=>   │       │       │       │       │       └─(6+7+8+9)/4
//=>   │       │       │       │       └─(5+6+7+8)/4
//=>   │       │       │       └─(4+5+6+7)/4
//=>   │       │       └─(3+4+5+6)/4
//=>   │       └─(2+3+4+5)/4
//=>   └─(1+2+3+4)/4

import { CircularBuffer } from '../providers/circular-buffer';

export class SMA {
  private buffer: CircularBuffer;
  private sum = 0;

  constructor(private period: number) {
    this.buffer = new CircularBuffer(period);
  }

  next(price: number) {
    this.buffer.push(price);
    this.sum += price;

    if (!this.buffer.filled) {
      return NaN;
    }

    this.next = (price: number) => {
      this.sum = this.sum - this.buffer.push(price) + price;

      return this.sum / this.period;
    };

    this.moment = (price: number) => {
      return (this.sum - this.buffer.peek() + price) / this.period;
    };

    return this.sum / this.period;
  }

  moment(price: number): number {
    return;
  }
}
