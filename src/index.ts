import { parsers as babelParsers } from 'prettier/parser-babel';
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
        babel: {
            ...babelParsers.babel,
            preprocess: preprocessor,
        },
        'babel-flow': {
            ...babelParsers['babel-flow'],
            preprocess: preprocessor,
        },
        typescript: {
            ...babelParsers['babel-ts'],
            preprocess: preprocessor,
        },
    },
    options,
};
