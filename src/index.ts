import { parsers as babelParsers } from 'prettier/parser-babel';
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
    importOrderSeparation: {
        type: 'boolean',
        category: 'Global',
        default: false,
        description: 'Should imports be separated by new line ?',
    },
};

module.exports = {
    parsers: {
        typescript: {
            ...typescriptParsers.typescript,
            preprocess: preprocessor,
        },
        babel: {
            ...babelParsers.babel,
            preprocess: preprocessor,
        },
    },
    options,
};
