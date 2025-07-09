import { ParserOptions, parse as babelParser } from '@babel/parser';
import { ImportDeclaration } from '@babel/types';

import { PrettierOptions } from '../types';
import { extractASTNodes } from '../utils/extract-ast-nodes';
import { getAllCommentsFromNodes } from '../utils/get-all-comments-from-nodes';
import { getCodeFromAst } from '../utils/get-code-from-ast';
import { getExperimentalParserPlugins } from '../utils/get-experimental-parser-plugins';
import { getSortedNodes } from '../utils/get-sorted-nodes';
import { isSortImportsIgnored } from '../utils/is-sort-imports-ignored';

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

    if (isSortImportsIgnored(ast.program.body[0]?.leadingComments ?? []))
        return code;

    const {
        importNodes,
        injectIdx,
    }: { importNodes: ImportDeclaration[]; injectIdx: number } =
        extractASTNodes(ast);

    // short-circuit if there are no import declaration
    if (importNodes.length === 0) return code;
    if (isSortImportsIgnored(getAllCommentsFromNodes(importNodes))) return code;

    const allImports = getSortedNodes(importNodes, {
        importOrder,
        importOrderCaseInsensitive,
        importOrderSeparation,
        importOrderGroupNamespaceSpecifiers,
        importOrderSortSpecifiers,
        importOrderSideEffects,
    });

    return getCodeFromAst(allImports, code, injectIdx, {
        importOrderImportAttributesKeyword,
    });
}
