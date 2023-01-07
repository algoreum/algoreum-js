import { ADX as ADX2 } from 'technicalindicators';
import { ADX } from '../../src/ta';
import { ohlc } from './data';

describe('ADX', () => {
  it('Cross SDK validate', () => {
    const period = 14;
    const adx = new ADX(period);
    const adx2 = new ADX2({ period, high: [], low: [], close: [] });

    ohlc.forEach((tick) => {
      const local = adx.next(tick.h, tick.l, tick.c);
      // @ts-ignore typing error?
      const cross = adx2.nextValue({
        high: tick.h,
        low: tick.l,
        close: tick.c
      });

      if (local && cross) {
        expect(local.adx).toEqual(cross.adx);
        expect(local.mdi).toEqual(cross.mdi);
        expect(local.pdi).toEqual(cross.pdi);
      }
    });
  });
});
