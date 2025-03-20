import { parse as babelParser } from '@babel/core';
import { ParserOptions } from '@babel/parser';
import { format } from 'prettier';

import { extractASTNodes } from '../extract-ast-nodes';
import { getCodeFromAst } from '../get-code-from-ast';
import { getExperimentalParserPlugins } from '../get-experimental-parser-plugins';
import { getImportNodes } from '../get-import-nodes';
import { getSortedNodes } from '../get-sorted-nodes';

test('it sorts imports correctly', async () => {
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
        importOrderSortByLength: null,
        importOrderSideEffects: true
    });
    const formatted = getCodeFromAst(sortedNodes, [], code, null);
    expect(await format(formatted, { parser: 'babel' })).toEqual(
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

test('it renders directives correctly', async () => {
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
    if (!ast) throw new Error('ast is null');
    const { directives, importNodes } = extractASTNodes(ast);

    const formatted = getCodeFromAst(importNodes, directives, code, null);
    expect(await format(formatted, { parser: 'babel' })).toEqual(
        `"use client";

// first comment
import b from "b";
import a from "a";
`,
    );
});
