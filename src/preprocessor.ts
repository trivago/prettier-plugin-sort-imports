import { parse as babelParser, ParserOptions } from '@babel/parser';
import traverse, { NodePath } from '@babel/traverse';
import { ImportDeclaration, isTSModuleDeclaration } from '@babel/types';

import { getCodeFromAst } from './utils/get-code-from-ast';
import { getSortedNodes } from './utils/get-sorted-nodes';
import { PrettierOptions } from './types';
import { getExperimentalParserPlugins } from './utils/get-experimental-parser-plugins';
import { isEmpty } from 'lodash';

export function preprocessor(code: string, options: PrettierOptions) {
    const {
        experimentalBabelParserPluginsList = [], // Deprecated in favor of importOrderParserPlugins
        importOrderParserPlugins = [],
        importOrder,
        importOrderCaseInsensitive,
        importOrderSeparation,
        importOrderSortSpecifiers,
    } = options;

    const parserPlugins = isEmpty(importOrderParserPlugins)
        ? experimentalBabelParserPluginsList
        : importOrderParserPlugins;
    const parsedParserPlugins = getExperimentalParserPlugins(parserPlugins);

    const importNodes: ImportDeclaration[] = [];

    const parserOptions: ParserOptions = {
        sourceType: 'module',
        plugins: parsedParserPlugins,
    };

    const ast = babelParser(code, parserOptions);
    const interpreter = ast.program.interpreter;

    traverse(ast, {
        ImportDeclaration(path: NodePath<ImportDeclaration>) {
            const tsModuleParent = path.findParent((p) =>
                isTSModuleDeclaration(p),
            );
            if (!tsModuleParent) {
                importNodes.push(path.node);
            }
        },
    });

    // short-circuit if there are no import declaration
    if (importNodes.length === 0) return code;

    const allImports = getSortedNodes(importNodes, {
        importOrder,
        importOrderCaseInsensitive,
        importOrderSeparation,
        importOrderSortSpecifiers,
    });

    return getCodeFromAst(allImports, code, interpreter);
}
