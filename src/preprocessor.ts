import { parse as parser, ParserOptions } from '@babel/parser';
import { merge } from 'lodash';
import { loadPartialConfig } from '@babel/core';
import traverse, { NodePath } from '@babel/traverse';
import { ImportDeclaration } from '@babel/types';
import {
    PrettierParserOptions,
    getCodeFromAst,
    getSortedNodesByImportOrder,
    getSortedNodesNotInTheImportOrder,
} from './utils';

export function preprocessor(code: string, options: PrettierParserOptions) {
    const { importOrder, importOrderSeparation } = options;
    let importNodes: ImportDeclaration[] = [];

    const defaultConfig = {
        sourceType: 'module',
        plugins: ['typescript', 'jsx'],
    } as ParserOptions;
    const babelConfig = loadPartialConfig() as ParserOptions;
    const mergedOptions = merge(defaultConfig, babelConfig);

    const ast = parser(code, mergedOptions);

    traverse(ast, {
        ImportDeclaration(path: NodePath<ImportDeclaration>) {
            const { node, scope } = path;
            importNodes.push(node);
            path.remove();
        },
    });

    const thirdPartyImports = getSortedNodesNotInTheImportOrder(
        importNodes,
        importOrder,
    );
    const localImports = getSortedNodesByImportOrder(importNodes, importOrder);

    const newAST = getCodeFromAst([...thirdPartyImports, ...localImports], ast);

    return newAST;
}
