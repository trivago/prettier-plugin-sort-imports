import generate from '@babel/generator';
import { parse as parser } from '@babel/parser';
import traverse, { NodePath } from '@babel/traverse';
import { removeComments, file, ImportDeclaration } from '@babel/types';

import {
    PrettierParserOptions,
    getSortedNodesByImportOrder,
    getSortedNodesNotInTheImportOrder,
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
        ImportDeclaration(path: NodePath<ImportDeclaration>) {
            importNodes.push(path.node);
        },
    });

    const localImports = getSortedNodesByImportOrder(importNodes, importOrder);

    const thirdPartyImports = getSortedNodesNotInTheImportOrder(
        importNodes,
        importOrder,
    );

    const newAst = file({
        type: 'Program',
        body: thirdPartyImports.concat(localImports),
        directives: [],
        sourceType: 'module',
        interpreter: null,
        sourceFile: '',
        leadingComments: [],
        innerComments: [],
        trailingComments: [],
        start: 0,
        end: 0,
        loc: {
            start: { line: 0, column: 0 },
            end: { line: 0, column: 0 },
        },
    });

    const importsStart = importNodes[0]
        ? importNodes[0].start !== null
            ? importNodes[0].start
            : 0
        : 0;

    const modifiedCode = removeImportsFromOriginalCode(code, importNodes);

    const initialCodeBlock = modifiedCode.substring(0, importsStart);
    const middleCodeBlock = generate(newAst).code;
    const endCodeBlock = modifiedCode.substring(importsStart);

    return `${initialCodeBlock}${middleCodeBlock}${endCodeBlock}`;
}
