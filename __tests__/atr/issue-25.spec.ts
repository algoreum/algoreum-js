import { ATR } from '../../src/ta';
import { ohlc } from './excel-data';

let closes = [
  51.59, 51.65, 51.65, 51.65, 51.65, 51.65, 51.65, 51.65, 51.65, 51.65, 51.65,
  51.65, 51.65, 51.65, 51.65, 51.6, 51.6, 51.6, 51.6, 51.6, 51.6, 51.6, 51.6,
  51.6, 51.6, 51.6, 51.6, 51.6, 51.6, 51.6, 51.6, 51.6, 51.6, 51.6, 51.6, 51.6,
  51.6, 51.6, 51.6, 51.6, 51.6, 51.6, 51.6, 51.6, 51.6, 51.6, 51.6, 51.6, 51.6,
  51.6, 51.6, 51.6, 51.6, 51.6, 51.6
];

describe('ATR', () => {
  it('issue-25: ATR sometimes return undefined value', () => {
    const atr = new ATR();

    ohlc.forEach((candle, index) => {
      atr.next(candle.h, candle.l, candle.c);
    });

    closes.forEach((close) => {
      const value = atr.next(close, close, close);

      expect(value).toBeDefined();
    });
  });
});
