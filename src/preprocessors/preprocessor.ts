import { ParserOptions, parse as babelParser } from '@babel/parser';
import { Directive, ImportDeclaration } from '@babel/types';

import { PrettierOptions } from '../types';
import { extractASTNodes } from '../utils/extract-ast-nodes';
import { getCodeFromAst } from '../utils/get-code-from-ast';
import { getExperimentalParserPlugins } from '../utils/get-experimental-parser-plugins';
import { getSortedNodes } from '../utils/get-sorted-nodes';
import { isSortImportsIgnored } from '../utils/is-sort-imports-ignored';
import { shouldSkipFile } from '../utils/should-skip-file';

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
        importOrderSkipFiles,
        filepath,
    } = options;

    // Check if the file should be skipped
    if (filepath && shouldSkipFile(filepath, (importOrderSkipFiles || []) as string[])) {
        return code;
    }

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
        importOrderSkipFiles,
    });

    return getCodeFromAst(allImports, directives, code, interpreter, {
        importOrderImportAttributesKeyword,
    });
}
