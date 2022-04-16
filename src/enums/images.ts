import { Value } from './../models/Types';
import zero from '../assets/zero.png';
import fiveCents from '../assets/five-cents.png';
import tenCents from '../assets/ten-cents.png';
import twentyFiveCents from '../assets/twenty-five-cents.png';
import fifthCents from '../assets/fifth-cents.png';
import oneCents from '../assets/one.png';
import one from '../assets/one.png';
import two from '../assets/two.png';
import five from '../assets/five.png';
import ten from '../assets/ten.png';
import twenty from '../assets/twenty.png';
import fifth from '../assets/fifth.png';
import oneHundred from '../assets/one-hundred.png';
import twoHundred from '../assets/two-hundred.png';

export const images = new Map<Value, string>([
    [0, zero],
    [0.05, fiveCents],
    [0.1, tenCents],
    [0.25, twentyFiveCents],
    [0.5, fifthCents],
    [1, one],
    [2, two],
    [5, five],
    [10, ten],
    [20, twenty],
    [50, fifth],
    [100, oneHundred],
    [200, twoHundred],
]);
