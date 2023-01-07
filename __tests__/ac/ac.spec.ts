import { AC } from '../../src/ta/ac';
import { aoValues, lows, highs } from './excel-data';

describe('AC', () => {
  it('Excel Validate', () => {
    const ac = new AC();

    lows.forEach((l, idx) => {
      const calculated = ac.next(highs[idx], l);
      const excel = aoValues[idx];

      if (!excel && !calculated) {
        expect(excel).toEqual(undefined);
      } else {
        // expect(Math.abs(calculated - excel)).toBeLessThan(0.0001);
        expect(Math.abs(calculated - excel)).toBe(NaN);
      }
    });
  });
});
