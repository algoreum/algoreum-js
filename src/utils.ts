export function sum(values: number[]) {
  let sum = 0;
  let i = values.length;

  while (i > 0) {
    sum += values[--i];
  }

  return sum;
}

export const percentageChange = (currentPrice: number, previousPrice: number) =>
  ((currentPrice - previousPrice) / previousPrice) * 100;

export const avg = (values: number[], period = values.length) =>
  sum(values) / period || 0;

export const getMax = (values: number[]) => {
  let max = -Infinity;
  let idx = 0;

  for (let i = values.length - 1; i >= 0; i--) {
    const item = values[i];

    if (max < item) {
      idx = i;
      max = item;
    }
  }

  return { max, idx };
};

export const getMin = (values: number[]) => {
  let min = Infinity;
  let idx = 0;

  for (let i = values.length - 1; i >= 0; i--) {
    const item = values[i];

    if (min > item) {
      idx = i;
      min = item;
    }
  }

  return { min, idx };
};
