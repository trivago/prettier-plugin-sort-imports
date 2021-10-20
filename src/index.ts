import { parsers as babelParsers } from 'prettier/parser-babel';
import { parsers as flowParsers } from 'prettier/parser-flow';
import { parsers as typescriptParsers } from 'prettier/parser-typescript';
import { preprocessor } from './preprocessor';

const options = {
    experimentalBabelParserPluginsList: {
        type: 'path',
        category: 'Global',
        array: true,
        default: [{ value: [] }],
        description:
            'Deprecated! Please use `importOrderParserPlugins` to provide a list of parser plugins for special syntax.',
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
        default: true,
        description: 'Provide a case sensitivity boolean flag',
    },
    importOrderParserPlugins: {
        type: 'path',
        category: 'Global',
        array: true,
        default: [{ value: [] }],
        description: 'Provide a list of plugins for special syntax',
    },
    importOrderSeparation: {
        type: 'boolean',
        category: 'Global',
        default: false,
        description: 'Should imports be separated by new line ?',
    },
    importOrderSortSpecifiers: {
        type: 'boolean',
        category: 'Global',
        default: false,
        description: 'Should modules be sorted ?',
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
