import { parse as babelParser, ParserOptions } from '@babel/parser';
import traverse, { NodePath } from '@babel/traverse';
import { ImportDeclaration, isTSModuleDeclaration } from '@babel/types';

import { getCodeFromAst } from './utils/get-code-from-ast';
import { getSortedNodes } from './utils/get-sorted-nodes';
import { getParserPlugins } from './utils/get-parser-plugins';
import { PrettierOptions } from './types';
import { getExperimentalParserPlugins } from './utils/get-experimental-parser-plugins';
import { isEmpty } from 'lodash';

export function preprocessor(code: string, options: PrettierOptions) {
    const {
        experimentalBabelParserPluginsList = [],
        importOrderParserPlugins = [],
        importOrder,
        importOrderCaseInsensitive,
        importOrderSeparation,
        parser: prettierParser,
        importOrderSortSpecifiers,
    } = options;

    const plugins = getParserPlugins(prettierParser);
    const parserPlugins = isEmpty(importOrderParserPlugins)
        ? experimentalBabelParserPluginsList
        : importOrderParserPlugins;
    const parsedParserPlugins = getExperimentalParserPlugins(parserPlugins);

    const importNodes: ImportDeclaration[] = [];

    const parserOptions: ParserOptions = {
        sourceType: 'module',
        plugins: [...plugins, ...parsedParserPlugins],
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
