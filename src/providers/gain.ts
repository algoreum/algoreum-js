import { SMMA } from '../ta/moving-averages/smma';

export class AvgChangeProvider {
  private avgGain: SMMA;
  private avgLoss: SMMA;
  private previous: number;

  constructor(period: number) {
    this.avgGain = new SMMA(period);
    this.avgLoss = new SMMA(period);
  }

  next(price: number) {
    const change = price - this.previous;

    if (!this.previous) {
      this.previous = price;
      return;
    }

    const isPositive = change > 0;
    const isNegative = change < 0;
    const localGain = isPositive ? change : 0;
    const localLoss = isNegative ? change : 0;
    const upAvg = this.avgGain.next(localGain);
    const downAvg = this.avgLoss.next(localLoss);

    this.previous = price;

    return { upAvg, downAvg };
  }

  moment(price: number) {
    const change = price - this.previous;
    const isPositive = change > 0;
    const isNegative = change < 0;
    const localGain = isPositive ? change : 0;
    const localLoss = isNegative ? change : 0;
    const upAvg = this.avgGain.moment(localGain);
    const downAvg = this.avgLoss.moment(localLoss);

    return { upAvg, downAvg };
  }
}
