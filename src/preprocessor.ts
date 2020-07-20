import generate from '@babel/generator';
import { parse as parser } from '@babel/parser';
import traverse, { NodePath } from '@babel/traverse';
import { removeComments, ImportDeclaration, Program } from '@babel/types';

import {
    PrettierParserOptions,
    getAllImportNodes,
    getSortedNodesByOrder,
    getSortedNodesNotInTheOrder,
    removeImportsFromOriginalCode,
} from './utils';

export function preprocessor(code: string, options: PrettierParserOptions) {
    const { importOrder } = options;
    let importNodes: ImportDeclaration[] = [];

    const ast = parser(code, {
        sourceType: 'module',
        plugins: ['typescript', 'jsx'],
    });

    traverse(ast, {
        enter(path: NodePath) {
            removeComments(path.node);
        },
        Program(path: NodePath<Program>) {
            importNodes = getAllImportNodes(path) as ImportDeclaration[];

            const localImports = getSortedNodesByOrder(
                importNodes,
                importOrder,
            );

            const thirdPartyImports = getSortedNodesNotInTheOrder(
                importNodes,
                importOrder,
            );

            const finalNodes = thirdPartyImports.concat(localImports);

            // @ts-ignore
            path.set('body', finalNodes);
        },
    });

    const importsStart = importNodes[0]
        ? importNodes[0].start !== null
            ? importNodes[0].start || 0
            : 0
        : 0;

    const modifiedCode = removeImportsFromOriginalCode(code, importNodes);

    const initialCodeBlock = modifiedCode.substring(0, importsStart);
    const middleCodeBlock = generate(ast).code;
    const endCodeBlock = modifiedCode.substring(importsStart);

    return `${initialCodeBlock}${middleCodeBlock}${endCodeBlock}`;
}
