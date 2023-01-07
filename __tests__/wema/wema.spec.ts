import { WEMA as WEMA1 } from 'technicalindicators';
import { WEMA } from '../../src/ta';
import { ohlc } from './data';

describe("Wilder's Smoothed Moving Average", () => {
  it('Cross SDK validate', () => {
    const cross = new WEMA1({ period: 6, values: [] });
    const local = new WEMA(6);

    ohlc.forEach((tick, idx) => {
      const calcValue = cross.nextValue(tick.c);
      const crossValue = local.next(tick.c);

      if (idx > 6) {
        expect(calcValue).toEqual(crossValue);
      }
    });
  });
});
