// High	1000
// Low	950
// Close	975

import { Pivot } from '../../src/ta';

// R3	1050
// R2	1025
// R1	1000
// PP	975
// S1	950
// S2	925
// S3	900

const pivot = new Pivot();

console.log(pivot.next(1000, 950, 975));
