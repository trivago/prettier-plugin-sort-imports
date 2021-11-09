import { parsers as babelParsers } from 'prettier/parser-babel';
import { parsers as flowParsers } from 'prettier/parser-flow';
import { parsers as typescriptParsers } from 'prettier/parser-typescript';
import { preprocessor } from './preprocessor';

const options = {
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
};

module.exports = {
    parsers: {
        babel: {
            ...babelParsers.babel,
            preprocess: preprocessor,
        },
        flow: {
            ...flowParsers.flow,
            preprocess: preprocessor,
        },
        typescript: {
            ...typescriptParsers.typescript,
            preprocess: preprocessor,
        },
    },
    options,
};
