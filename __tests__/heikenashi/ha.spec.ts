import { haValues, ohlc } from './excel-data';
import { HeikinAshi as HeikenAshi2 } from 'technicalindicators';
import { HeikenAshi } from '../../src/ta';

describe('Heiken Ashi', () => {
  it('Excel Validate', () => {
    const ha = new HeikenAshi();
    const EPSILON = 0.008;

    ohlc.forEach((tick, idx) => {
      const calculated = ha.next(tick.o, tick.h, tick.l, tick.c);
      const excel = haValues[idx];

      expect(Math.abs(calculated.open - excel.o)).toBeLessThan(EPSILON);
      expect(Math.abs(calculated.high - excel.h)).toBeLessThan(EPSILON);
      expect(Math.abs(calculated.low - excel.l)).toBeLessThan(EPSILON);
      expect(Math.abs(calculated.close - excel.c)).toBeLessThan(EPSILON);
    });
  });

  it('Cross SDK Validate', () => {
    const ha = new HeikenAshi();
    const first = ohlc[0];
    const ha2 = new HeikenAshi2({
      open: [first.o],
      high: [first.h],
      low: [first.l],
      close: [first.c]
    });
    const EPSILON = 0.000001;

    ohlc.forEach((tick, idx) => {
      const calculated = ha.next(tick.o, tick.h, tick.l, tick.c);

      if (idx == 0) {
        return;
      }

      const cross = ha2.nextValue({
        open: tick.o,
        high: tick.h,
        low: tick.l,
        close: tick.c
      });

      expect(calculated.open - cross.open).toBeLessThan(EPSILON);
      expect(calculated.high - cross.high).toBeLessThan(EPSILON);
      expect(calculated.low - cross.low).toBeLessThan(EPSILON);
      expect(calculated.close - cross.close).toBeLessThan(EPSILON);
    });
  });
});
