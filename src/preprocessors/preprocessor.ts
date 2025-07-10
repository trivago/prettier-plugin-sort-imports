import { ParserOptions, parse as babelParser } from '@babel/parser';
import { Directive, ImportDeclaration } from '@babel/types';

import { PrettierOptions } from '../types';
import { extractASTNodes } from '../utils/extract-ast-nodes.js';
import { getCodeFromAst } from '../utils/get-code-from-ast.js';
import { getExperimentalParserPlugins } from '../utils/get-experimental-parser-plugins.js';
import { getSortedNodes } from '../utils/get-sorted-nodes.js';
import { isSortImportsIgnored } from '../utils/is-sort-imports-ignored.js';

export function preprocessor(code: string, options: PrettierOptions) {
    const {
        importOrderParserPlugins,
        importOrder,
        importOrderCaseInsensitive,
        importOrderSeparation,
        importOrderGroupNamespaceSpecifiers,
        importOrderSortSpecifiers,
        importOrderSideEffects,
        importOrderImportAttributesKeyword,
    } = options;

    const parserOptions: ParserOptions = {
        sourceType: 'module',
        plugins: getExperimentalParserPlugins(importOrderParserPlugins),
    };

    const ast = babelParser(code, parserOptions);
    const interpreter = ast.program.interpreter;

    const {
        importNodes,
        directives,
    }: { importNodes: ImportDeclaration[]; directives: Directive[] } =
        extractASTNodes(ast);

    // short-circuit if there are no import declaration
    if (importNodes.length === 0) return code;
    if (isSortImportsIgnored(importNodes)) return code;

    const allImports = getSortedNodes(importNodes, {
        importOrder,
        importOrderCaseInsensitive,
        importOrderSeparation,
        importOrderGroupNamespaceSpecifiers,
        importOrderSortSpecifiers,
        importOrderSideEffects,
    });

    return getCodeFromAst(allImports, directives, code, interpreter, {
        importOrderImportAttributesKeyword,
    });
}
