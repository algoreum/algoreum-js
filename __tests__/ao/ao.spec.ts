import { AwesomeOscillator as AO2 } from 'technicalindicators';
import { AwesomeOscillator } from '../../src/ta';
import { aoValues, lows, highs } from './excel-data';

describe('AO', () => {
  it('Excel Validate', () => {
    const ao = new AwesomeOscillator();

    lows.forEach((l, idx) => {
      const calculated = ao.next(highs[idx], l);
      const excel = aoValues[idx];

      if (!excel && !calculated) {
        expect(excel).toEqual(undefined);
      } else {
        expect(Math.abs(calculated - excel)).toBeLessThan(0.0001);
      }
    });
  });

  it('Cross SDK validate', () => {
    const ao = new AwesomeOscillator(5, 34);
    const ao2 = new AO2({ fastPeriod: 5, high: [], low: [], slowPeriod: 34 });

    lows.forEach((l, idx) => {
      const priceData = {
        high: highs[idx],
        low: l
      };

      const local = ao.next(priceData.high, priceData.low);
      const cross = ao2.nextValue(priceData);

      if (!local || !cross) {
        expect(local).toBe(NaN);
        expect(cross).toEqual(undefined);
      } else {
        expect(Math.abs(local - cross)).toBeLessThan(0.000001);
      }
    });
  });
});
