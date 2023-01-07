import { WMA as WMA1 } from 'technicalindicators';
import { WMA } from '../../src/ta';
import { ohlc } from './data';

describe("Wilder's Moving Average", () => {
  it('Cross SDK validate', () => {
    const cross = new WMA1({ period: 6, values: [] });
    const local = new WMA(6);

    ohlc.forEach((tick) => {
      const calcValue = cross.nextValue(tick.c);
      const crossValue = local.next(tick.c);

      // console.log(calcValue, crossValue);
      expect(calcValue).toEqual(crossValue);
    });
  });
});
