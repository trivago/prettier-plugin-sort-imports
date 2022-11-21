import { parse as babelParser } from '@babel/core';
import { ParserOptions } from '@babel/parser';
import traverse, { NodePath } from '@babel/traverse';
import {
    Directive,
    ImportDeclaration,
    isTSModuleDeclaration,
} from '@babel/types';
import { format } from 'prettier';

import { getCodeFromAst } from '../get-code-from-ast';
import { getExperimentalParserPlugins } from '../get-experimental-parser-plugins';
import { getImportNodes } from '../get-import-nodes';
import { getSortedNodes } from '../get-sorted-nodes';

test('it sorts imports correctly', () => {
    const code = `// first comment
// second comment
import z from 'z';
import c from 'c';
import g from 'g';
import t from 't';
import k from 'k';
import a from 'a';
`;
    const importNodes = getImportNodes(code);
    const sortedNodes = getSortedNodes(importNodes, {
        importOrder: [],
        importOrderCaseInsensitive: false,
        importOrderSeparation: false,
        importOrderGroupNamespaceSpecifiers: false,
        importOrderSortSpecifiers: false,
    });
    const formatted = getCodeFromAst(sortedNodes, [], code, null);
    expect(format(formatted, { parser: 'babel' })).toEqual(
        `// first comment
// second comment
import a from "a";
import c from "c";
import g from "g";
import k from "k";
import t from "t";
import z from "z";
`,
    );
});

test('it renders directives correctly', () => {
    const code = `
    "use client";
// first comment
import b from 'b';
import a from 'a';`;

    const parserOptions: ParserOptions = {
        sourceType: 'module',
        plugins: getExperimentalParserPlugins([]),
    };
    const ast = babelParser(code, parserOptions);
    const directives: Directive[] = [];
    const importNodes: ImportDeclaration[] = [];

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

    const formatted = getCodeFromAst(importNodes, directives, code, null);
    expect(format(formatted, { parser: 'babel' })).toEqual(
        `"use client";

// first comment
import b from "b";
import a from "a";
`,
    );
});
