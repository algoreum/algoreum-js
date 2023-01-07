import { PSAR as PSAR2 } from 'technicalindicators';
import { PSAR } from '../../src/ta';
import { lows, highs, closes } from './excel-data';

describe('PSAR', () => {
  it('Cross SDK validate', () => {
    const psar = new PSAR();

    const local = [];
    const cross = PSAR2.calculate({
      high: highs,
      low: lows,
      step: 0.02,
      max: 0.2
    });

    for (let i = 0; i < lows.length; i++) {
      local.push(psar.next(highs[i], lows[i], closes[i]));
    }

    expect(local).toEqual(cross);
  });
  it('Cross sdk moment value validate', () => {
    const psar = new PSAR();

    const localMoment = [];
    const cross = PSAR2.calculate({
      high: highs,
      low: lows,
      step: 0.02,
      max: 0.2
    });

    for (let i = 0; i < lows.length; i++) {
      localMoment.push(psar.moment(highs[i], lows[i]));
      psar.next(highs[i], lows[i], closes[i]);
    }

    expect(localMoment).toEqual(cross);
  });
});
