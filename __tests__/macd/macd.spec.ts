import { MACD as MACD2 } from 'technicalindicators';
import { MACD } from '../../src/ta';
import { macdValues, closes } from './excel-data';

describe('MACD', () => {
  it('Excel Validate', () => {
    const macd = new MACD();
    const EPSILON = 0.001;

    closes.forEach((c, idx) => {
      const calculated = macd.next(c);
      const excel = macdValues[idx];

      expect(
        Math.abs((calculated?.macd || 0) - (excel?.macd || 0))
      ).toBeLessThan(EPSILON);
      expect(
        Math.abs((calculated?.histogram || 0) - (excel?.histogram || 0))
      ).toBeLessThan(EPSILON);
      expect(
        Math.abs((calculated?.signal || 0) - (excel?.signal || 0))
      ).toBeLessThan(EPSILON);
    });
  });

  it('Cross SDK validate', () => {
    const macd = new MACD();
    const macd2 = new MACD2({
      values: [],
      SimpleMAOscillator: false,
      SimpleMASignal: false,
      fastPeriod: 12,
      slowPeriod: 26,
      signalPeriod: 9
    });

    closes.forEach((tick) => {
      const local = macd.next(tick);
      const cross = macd2.nextValue(tick);

      expect(local?.macd).toEqual(cross?.MACD);
      expect(local?.histogram).toEqual(cross?.histogram);
      expect(local?.signal).toEqual(cross?.signal);
    });
  });
});
