const { parsers: typescriptParsers } = require('prettier/parser-typescript');
const { parsers: babelParsers } = require('prettier/parser-babel');
const { preprocessor: pluginPreprocessor } = require('./preprocessor');

const options = {
    importOrder: {
        type: 'path',
        category: 'Global',
        array: true,
        default: [{ value: [] }],
        description: 'Provide an order to sort imports.',
    },
};

module.exports = {
    parsers: {
        typescript: {
            ...typescriptParsers.typescript,
            preprocess: pluginPreprocessor,
        },
        babel: {
            ...babelParsers.babel,
            preprocess: pluginPreprocessor,
        },
    },
    options,
};
