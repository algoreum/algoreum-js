import { ATR as ATR2 } from 'technicalindicators';
import { MovingAverage } from '../../src/enums';
import { ATR } from '../../src/ta';
import { atrValues, ohlc } from './excel-data';

describe('ATR', () => {
  it('Excel Validate', () => {
    const period = 14;
    const atr = new ATR(period, MovingAverage.SMA);

    ohlc.forEach((tick, idx) => {
      const calculated = atr.next(tick.h, tick.l, tick.c);
      const excel = atrValues[idx];

      if (idx > period) {
        expect(Math.abs(calculated - excel)).toBeLessThan(0.007);
      }
    });
  });

  it('Cross SDK validate', () => {
    const period = 14;
    const atr = new ATR(period);
    const atr2 = new ATR2({ period, high: [], low: [], close: [] });

    const local = [];
    const cross = [];

    ohlc.forEach((tick) => {
      local.push(atr.next(tick.h, tick.l, tick.c));
      cross.push(atr2.nextValue({ high: tick.h, low: tick.l, close: tick.c }));
    });

    expect(local[-1]).toEqual(cross[-1]);
  });
});
