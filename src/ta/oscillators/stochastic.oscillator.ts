import { getMin, getMax } from '../../utils';
import { SMA } from '../moving-averages/sma';
import { CircularBuffer } from '../../providers/circular-buffer';

/**
 * A stochastic oscillator is a momentum indicator comparing a particular closing price
 * of a security to a range of its prices over a certain period of time.
 * The sensitivity of the oscillator to market movements is reducible by adjusting that
 * time period or by taking a moving average of the result.
 * It is used to generate overbought and oversold trading signals,
 * utilizing a 0-100 bounded range of values.
 */
export class Stochastic {
  private highsBuffer: CircularBuffer;
  private lowsBuffer: CircularBuffer;
  private higestH: number | null = null;
  private lowestL: number | null = null;
  private sma: SMA;
  private fill = 0;

  constructor(private period: number = 14, private smaPeriod: number = 3) {
    this.sma = new SMA(this.smaPeriod);
    this.highsBuffer = new CircularBuffer(this.period);
    this.lowsBuffer = new CircularBuffer(this.period);
  }

  /**
   * Get next value for closed candle hlc
   * affect all next calculations
   */
  next(high: number, low: number, close: number) {
    this.fill++;

    const filled = this.fill === this.period;

    if (!filled) {
      this.highsBuffer.push(high);
      this.lowsBuffer.push(low);
    }

    if (filled && !this.higestH && !this.lowestL) {
      this.higestH = getMax(this.highsBuffer.toArray()).max;
      this.lowestL = getMin(this.lowsBuffer.toArray()).min;

      this.next = (high: number, low: number, close: number) => {
        const rmHigh = this.highsBuffer.push(high);
        const rmLow = this.lowsBuffer.push(low);

        if (this.higestH === rmHigh) {
          this.higestH = getMax(this.highsBuffer.toArray()).max;
        } else if (this.higestH < high) {
          this.higestH = high;
        }

        if (this.lowestL === rmLow) {
          this.lowestL = getMin(this.lowsBuffer.toArray()).min;
        } else if (this.lowestL > low) {
          this.lowestL = low;
        }

        const k: number =
          ((close - this.lowestL) / (this.higestH - this.lowestL)) * 100;
        const d: number = this.sma.next(k);

        return { k, d };
      };

      this.moment = (high: number, low: number, close: number) => {
        const rmHigh = this.highsBuffer.push(high);
        const rmLow = this.lowsBuffer.push(low);
        let higestH = this.higestH;
        let lowestL = this.lowestL;

        if (higestH === rmHigh) {
          higestH = getMax(this.highsBuffer.toArray()).max;
        } else if (higestH < high) {
          higestH = high;
        }

        if (lowestL === rmLow) {
          lowestL = getMin(this.lowsBuffer.toArray()).min;
        } else if (lowestL > low) {
          lowestL = low;
        }

        this.highsBuffer.pushback(rmHigh);
        this.lowsBuffer.pushback(rmLow);

        const k: number = ((close - lowestL) / (higestH - lowestL)) * 100;
        const d: number = this.sma.moment(k);

        return { k, d };
      };

      return this.next(high, low, close);
    }
  }

  /**
   * Get next value for non closed (tick) candle hlc
   * does not affect any next calculations
   */
  moment(high: number, low: number, close: number): { k: number; d: number } {
    return;
  }
}
