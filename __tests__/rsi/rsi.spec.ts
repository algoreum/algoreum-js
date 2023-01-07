import { ohlc, rsiValues } from './excel-data';
import { RSI as RSI2 } from 'technicalindicators';
import { RSI } from '../../src/ta';

describe('RSI', () => {
  it('Excel Validate', () => {
    const bb = new RSI();
    const EPSILON = 0.001;

    ohlc.forEach((tick, idx) => {
      const calculated = bb.next(tick.c);
      const excel = rsiValues[idx];

      if (!excel && !calculated) {
        expect(excel).toEqual(calculated);
      } else {
        expect(Math.abs(calculated - excel)).toBeLessThan(EPSILON);
      }
    });
  });

  it('Cross SDK validate', () => {
    const rsi = new RSI();
    const rsi2 = new RSI2({ period: 14, values: [] });

    ohlc.forEach((tick) => {
      const local = rsi.next(tick.c);
      const cross = rsi2.nextValue(tick.c);

      if (!local || !cross) {
        expect(local).toEqual(cross);
      } else {
        expect(Math.abs(local - cross)).toBeLessThan(0.01);
      }
    });
  });
});
