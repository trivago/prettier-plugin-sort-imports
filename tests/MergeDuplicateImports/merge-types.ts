import type { A } from './t';
import type { B } from './t';

import type { TFoo } from './mix';
import { value } from './mix';

import { existing, type alreadyType } from './ts-mixed';
import type { newType } from './ts-mixed';

const x: A = {} as any;
