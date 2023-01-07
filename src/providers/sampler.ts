export interface IndicatorInstance {
  next: (price: number) => number;
  moment: (price: number) => number;
}

export interface IndicatorConstructor {
  new (...args: any[]): IndicatorInstance;
}

/**
 * Sampler class for using with simple indicators like SMA, EMA, which nextValue arguments is number and
 * return type also number. Can be user for replace SMA(SMA(SMA(SMA))) calls (sma x4 sample)
 */
export class Sampler<T extends IndicatorConstructor> {
  private _indicators: IndicatorInstance[] = [];

  constructor(private indicator: T, private samples: number) {}

  /**
   * Create indicator instances for next usage, pass period and other
   * indicator constructor parameters
   */
  create(...args: ConstructorParameters<T>) {
    for (let i = 0; i < this.samples; i++) {
      this._indicators.push(new this.indicator(...args));
    }
  }

  /**
   * Calculate next values to get all samples of current idicator
   */
  next(price: number): number {
    for (let i = 0; i < this.samples; i++) {
      price = this._indicators[i].next(price);

      if (price === undefined) {
        return price;
      }
    }

    return price;
  }

  /**
   * Get immediate value
   */
  moment(price: number): number {
    for (let i = 0; i < this.samples; i++) {
      price = this._indicators[i].moment(price);

      if (price === undefined || price === null) {
        return price;
      }
    }

    return price;
  }
}
