import { DC } from '../../src/ta';
import { dcValues, ohlc } from './excel-data';

describe('Donchian Channels', () => {
  it('Excel Validate', () => {
    const dc = new DC(20);
    const EPSILON = 0.001;

    ohlc.forEach((tick, idx) => {
      const calculated = dc.next(tick.h, tick.l);
      const excel = dcValues[idx];

      expect(Math.abs(calculated.upper - excel.upper)).toBeLessThan(EPSILON);
      expect(Math.abs(calculated.lower - excel.lower)).toBeLessThan(EPSILON);
    });
  });
});
