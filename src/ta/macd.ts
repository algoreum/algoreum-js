import { EMA } from './ema';

/*
How work MACD?
https://www.investopedia.com/terms/m/macd.asp#:~:text=The%20MACD%20is%20calculated%20by,for%20buy%20and%20sell%20signals.
*/

export class MACD {
  private emaFastIndicator: EMA;
  private emaSlowIndicator: EMA;
  private emaSignalIndicator: EMA;

  constructor(
    private periodEmaFast = 12,
    private periodEmaSlow = 26,
    private periodSignal = 9
  ) {
    this.emaFastIndicator = new EMA(periodEmaFast);
    this.emaSlowIndicator = new EMA(periodEmaSlow);
    this.emaSignalIndicator = new EMA(periodSignal);
  }

  next(price: number) {
    const emaFast = this.emaFastIndicator.next(price);
    const emaSlow = this.emaSlowIndicator.next(price);
    const macd = emaFast - emaSlow;
    const signal = (macd && this.emaSignalIndicator.next(macd)) || undefined;
    const histogram = macd - signal || undefined;

    if (isNaN(macd)) {
      return;
    }

    return {
      macd,
      emaFast,
      emaSlow,
      signal,
      histogram
    };
  }

  moment(price: number) {
    const emaFast = this.emaFastIndicator.moment(price);
    const emaSlow = this.emaSlowIndicator.moment(price);
    const macd = emaFast - emaSlow;
    const signal = macd && this.emaSignalIndicator.moment(macd);
    const histogram = macd - signal;

    return {
      macd,
      emaFast,
      emaSlow,
      signal,
      histogram
    };
  }
}
