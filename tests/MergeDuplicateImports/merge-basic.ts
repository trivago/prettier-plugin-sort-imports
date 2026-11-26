import { A } from 'path-to-A';
import { type B } from 'path-to-A';

import { reduce } from 'lodash-es';
import { debounce } from 'lodash-es';

import D from './m';
import { named } from './m';

import './side-effect';
import { sideEffectExport } from './side-effect';

import { A as A1 } from '@core/m';
import { B as B2, C } from '@core/m';

const x = A;
const y: B = {} as any;
const z = sideEffectExport + A1 + B2 + C + D + named + reduce + debounce;
