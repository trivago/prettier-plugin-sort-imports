import { ImportDeclaration, Program } from '@babel/types';
import { NodePath } from '@babel/traverse';
import { PrettierParserOptions } from './utils';

const t = require('@babel/types');
const traverse = require('@babel/traverse').default;
const generate = require('@babel/generator').default;
const parser = require('@babel/parser').parse;
const {
    getAllImportNodes,
    getNodesSortedByOrder,
    getNodesNotInTheOrder,
    removeImportsFromOriginalCode,
} = require('./utils');

function preprocessor(code: string, options: PrettierParserOptions) {
    const { importOrder } = options;
    let importNodes: ImportDeclaration[] = [];

    const ast = parser(code, {
        sourceType: 'module',
        plugins: ['typescript', 'jsx'],
    });

    traverse(ast, {
        enter(path: NodePath) {
            t.removeComments(path.node);
        },
        Program(path: NodePath<Program>) {
            importNodes = getAllImportNodes(path);

            const localImports = getNodesSortedByOrder(
                importNodes,
                importOrder,
            );

            const thirdPartyImports = getNodesNotInTheOrder(
                importNodes,
                importOrder,
            );

            const finalNodes = thirdPartyImports.concat(localImports);

            path.set('body', finalNodes);
        },
    });

    const importsStart = importNodes[0]
        ? typeof importNodes[0].start !== null
            ? importNodes[0].start || 0
            : 0
        : 0;

    const modifiedCode = removeImportsFromOriginalCode(code, importNodes);

    const initialCodeBlock = modifiedCode.substring(0, importsStart);
    const middleCodeBlock = generate(ast).code;
    const endCodeBlock = modifiedCode.substring(importsStart);

    return `${initialCodeBlock}${middleCodeBlock}${endCodeBlock}`;
}

module.exports = {
    preprocessor,
};
