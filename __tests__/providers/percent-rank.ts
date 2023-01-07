import { PercentRank } from '../../src/providers/percent-rank';

const percentRank = new PercentRank(10);

[100, 5, 20, 50, 55, 60, 70, 80, 90, 1].forEach((v) => {
  percentRank.next(v);
});

console.log(percentRank.next(66));
