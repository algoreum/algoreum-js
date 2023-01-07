import { MovingAverage } from '../../src/enums';
import { SuperTrend } from '../../src/ta';
import { ohlc, stExcelCalculated } from './data';

describe('Super Trend', () => {
  it('Excel validation test', () => {
    const st = new SuperTrend(10, 2, MovingAverage.SMA);

    ohlc.forEach((tick, idx) => {
      const value = st.next(tick.h, tick.l, tick.c);
      const excel = stExcelCalculated[idx];

      if (value?.upper && excel) {
        const diff = Math.abs(value.upper - excel.upper);

        expect(diff).toBeLessThan(0.00001);
      }
    });
  });
});
