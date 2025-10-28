import type { Options } from 'prettier';
import { parsers as babelParsers } from 'prettier/plugins/babel';
import { parsers as flowParsers } from 'prettier/plugins/flow';
import { parsers as htmlParsers } from 'prettier/plugins/html';
import { parsers as typescriptParsers } from 'prettier/plugins/typescript';

import { defaultPreprocessor } from './preprocessors/default-processor.js';
import { emberPreprocessor } from './preprocessors/ember-preprocessor.js';
import { sveltePreprocessor } from './preprocessors/svelte-preprocessor.js';
import { vuePreprocessor } from './preprocessors/vue-preprocessor.js';
import { createEmberParsers } from './utils/create-ember-parsers.js';
import { createSvelteParsers } from './utils/create-svelte-parsers.js';

const emberParsers = await createEmberParsers();
const svelteParsers = await createSvelteParsers();

const options: Options = {
    importOrderExclude: {
        type: 'path',
        category: 'Global',
        array: true,
        default: [{ value: [] }],
        description:
            'Provide a list of glob patterns to exclude from import sorting.',
    },
    importOrder: {
        type: 'path',
        category: 'Global',
        array: true,
        default: [{ value: [] }],
        description: 'Provide an order to sort imports.',
    },
    importOrderCaseInsensitive: {
        type: 'boolean',
        category: 'Global',
        default: false,
        description: 'Provide a case sensitivity boolean flag',
    },
    importOrderParserPlugins: {
        type: 'path',
        category: 'Global',
        array: true,
        // By default, we add ts and jsx as parsers but if users define something
        // we take that option
        default: [{ value: ['typescript', 'jsx'] }],
        description: 'Provide a list of plugins for special syntax',
    },
    importOrderSeparation: {
        type: 'boolean',
        category: 'Global',
        default: false,
        description: 'Should imports be separated by new line?',
    },
    importOrderGroupNamespaceSpecifiers: {
        type: 'boolean',
        category: 'Global',
        default: false,
        description:
            'Should namespace specifiers be grouped at the top of their group?',
    },
    importOrderSortSpecifiers: {
        type: 'boolean',
        category: 'Global',
        default: false,
        description: 'Should specifiers be sorted?',
    },
    importOrderSortByLength: {
        type: 'choice',
        category: 'Global',
        default: null,
        choices: [
            { value: 'asc', description: 'will sort from shortest to longest' },
            {
                value: 'desc',
                description: 'will sort from longest to shortest',
            },
            {
                value: null,
                description: 'will disable sorting based on length',
            },
        ],
        description: 'Should imports be sorted by their string length',
    },
    importOrderSideEffects: {
        type: 'boolean',
        category: 'Global',
        default: true,
        description: 'Should side effects be sorted?',
    },
    importOrderImportAttributesKeyword: {
        type: 'string',
        category: 'Global',
        default: 'with',
        description: 'Provide a keyword for import attributes',
    },
};

export default {
    parsers: {
        babel: {
            ...babelParsers.babel,
            preprocess: defaultPreprocessor,
        },
        flow: {
            ...flowParsers.flow,
            preprocess: defaultPreprocessor,
        },
        typescript: {
            ...typescriptParsers.typescript,
            preprocess: defaultPreprocessor,
        },
        vue: {
            ...htmlParsers.vue,
            preprocess: vuePreprocessor,
        },
        ...(svelteParsers.parsers
            ? {
                  svelte: {
                      ...svelteParsers.parsers.svelte,
                      preprocess: sveltePreprocessor,
                  },
              }
            : {}),
        ...(emberParsers.parsers
            ? {
                  'ember-template-tag': {
                      ...emberParsers.parsers['ember-template-tag'],
                      preprocess: emberPreprocessor,
                  },
              }
            : {}),
    },
    options,
};
