import { EMA } from '../ta/ema';
import { SMA } from '../ta/sma';
import { WEMA } from '../ta/wema';
import { Sampler, IndicatorConstructor } from './sampler';

/**
 * Level creation for dynamic data, upper and lower (configurated)
 */
export class UniLevel<T extends IndicatorConstructor> {
  private previousValue = 0;
  private lastUpperValue = 0;
  private lastLowerValue = 0;
  private samplerUp: Sampler<T>;
  private samplerLow: Sampler<T>;

  constructor(
    public redunant = 0.85,
    indicator: T,
    samples: number,
    private multiplier = 1,
    private offset = 1
  ) {
    this.samplerUp = new Sampler<T>(indicator, samples);
    this.samplerLow = new Sampler<T>(indicator, samples);
  }

  public create(...args: ConstructorParameters<T>) {
    this.samplerUp.create(...args);
    this.samplerLow.create(...args);
  }

  public nextValue(value: number) {
    if (value > 0) {
      this.lastUpperValue = Math.max(value, this.previousValue);
    } else {
      this.lastUpperValue = Math.max(0, this.lastUpperValue) * this.redunant;
    }

    if (value <= 0) this.lastLowerValue = Math.min(value, this.previousValue);
    else {
      this.lastLowerValue = Math.min(0, this.lastLowerValue) * this.redunant;
    }

    const low = (value <= 0 ? value : this.lastLowerValue) * this.multiplier;
    const up = (value >= 0 ? value : this.lastUpperValue) * this.multiplier;

    return [
      this.samplerUp.next(up) + this.offset,
      this.samplerLow.next(low) - this.offset
    ];
  }
}

/**
 * Smoothed level creation for dynamic data
 * @deprecated
 */
export class Level {
  private sample1Up: WEMA | SMA | EMA;
  private sample2Up: WEMA | SMA | EMA;
  private sample3Up: WEMA | SMA | EMA;
  private sample1Low: WEMA | SMA | EMA;
  private sample2Low: WEMA | SMA | EMA;
  private sample3Low: WEMA | SMA | EMA;

  private upper = 0;
  private lower = 0;
  private lastUpperValue = 0;
  private lastLowerValue = 0;

  constructor(
    public period: number,
    public samples: number,
    public redunant = 0.85,
    private type: 'WEMA' | 'EMA' | 'SMA' = 'WEMA'
  ) {
    this.sample1Up = this.createSample();
    this.sample2Up = this.createSample();
    this.sample3Up = this.createSample();
    this.sample1Low = this.createSample();
    this.sample2Low = this.createSample();
    this.sample3Low = this.createSample();
  }

  public next(price: number) {
    if (price > 0) {
      this.upper = this.getUp(price);
      this.lastLowerValue *= this.redunant;
      this.lower = this.getDown(this.lastLowerValue);
      this.lastUpperValue = price;
    } else if (price < 0) {
      this.lower = this.getDown(price);
      this.lastUpperValue *= this.redunant;
      this.upper = this.getUp(this.lastUpperValue);
      this.lastLowerValue = price;
    }

    return { upper: this.upper, lower: this.lower };
  }

  public getUp(price: number) {
    const sample1 = this.sample1Up.next(price);
    let sample2: number | null = null;

    if (this.samples === 1) {
      return sample1;
    }

    if (sample1) {
      sample2 = this.sample2Up.next(sample1);
    }

    if (this.samples === 2) {
      return sample2;
    }

    if (sample2) {
      return this.sample3Up.next(sample2);
    }

    return null;
  }

  public getDown(price: number) {
    const sample1 = this.sample1Low.next(price);
    let sample2: number | null = null;

    if (this.samples === 1) {
      return sample1;
    }

    if (sample1) {
      sample2 = this.sample2Low.next(sample1);
    }

    if (this.samples === 2) {
      return sample2;
    }

    if (sample2) {
      return this.sample3Low.next(sample2);
    }

    return null;
  }

  private createSample() {
    switch (this.type) {
      case 'EMA':
        return new EMA(this.period);
      case 'WEMA':
        return new WEMA(this.period);
      case 'SMA':
        return new SMA(this.period);
    }
  }
}
