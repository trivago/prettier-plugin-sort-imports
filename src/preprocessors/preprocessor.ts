import { parse as babelParser, ParserOptions } from '@babel/parser';
import traverse, { NodePath } from '@babel/traverse';
import { Directive, ImportDeclaration, isTSModuleDeclaration } from '@babel/types';

import { PrettierOptions } from '../types';
import { getCodeFromAst } from '../utils/get-code-from-ast';
import { getExperimentalParserPlugins } from '../utils/get-experimental-parser-plugins';
import { getSortedNodes } from '../utils/get-sorted-nodes';

export function preprocessor(code: string, options: PrettierOptions) {
    const {
        importOrderParserPlugins,
        importOrder,
        importOrderCaseInsensitive,
        importOrderSeparation,
        importOrderGroupNamespaceSpecifiers,
        importOrderSortSpecifiers,
    } = options;

    const importNodes: ImportDeclaration[] = [];
    const parserOptions: ParserOptions = {
        sourceType: 'module',
        plugins: getExperimentalParserPlugins(importOrderParserPlugins),
    };

    const ast = babelParser(code, parserOptions);
    const interpreter = ast.program.interpreter;

    const directives: Directive[] = [];
    traverse(ast, {
        Directive({ node }) {
            directives.push(node);

            // Trailing comments probably shouldn't be attached to the directive
            node.trailingComments = null;
        },

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
        importOrderGroupNamespaceSpecifiers,
        importOrderSortSpecifiers,
    });

    return getCodeFromAst(allImports, directives, code, interpreter);
}
