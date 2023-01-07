/**
 * True range calculation
 */
export function getTrueRange(high: number, low: number, previousClose: number) {
  if (previousClose) {
    // Linear conditions without max min and abs
    // Perormance reason
    const hl = high - low;
    const hc =
      high > previousClose ? high - previousClose : previousClose - high;
    const lc = low > previousClose ? low - previousClose : previousClose - low;

    if (hl >= hc && hl >= lc) {
      return hl;
    }

    if (hc >= hl && hc >= lc) {
      return hc;
    }

    return lc;
  }

  return;
}
