import * as N from './ns';
import { something } from './ns';

import D1 from './conflict';
import D2 from './conflict';

import { A } from './attrs' with { type: 'json' };
import { B } from './attrs';

import type Foo from './type-default';
import { Bar } from './type-default';

const x = N;
