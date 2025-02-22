import { extractASTNodes } from '../extract-ast-nodes';
import { getImportNodes } from '../get-import-nodes';
import { isSortImportsIgnored } from '../is-sort-imports-ignored';
import {  parse  } from '@babel/parser';

const codeIgnored = `// sort-imports-ignore
// second comment
import z from 'z';
`;

const codeNotIgnored = `// second comment
import z from 'z';
`;

const codeIgnoredWithInterpreterCommand = `#!/usr/bin/env node
// sort-imports-ignore

import z from 'z';
`;

test('it should return true if specific leading comment detected', () => {
    const ast = parse(codeIgnored, { sourceType: 'module' });
    const { importNodes } = extractASTNodes(ast);

    expect(isSortImportsIgnored(importNodes, !!ast.program.interpreter)).toBeTruthy();
});

test('it should return false if no specific leading comment detected', () => {
    const ast = parse(codeNotIgnored, { sourceType: 'module' });
    const { importNodes } = extractASTNodes(ast);

    expect(isSortImportsIgnored(importNodes, !!ast.program.interpreter)).toBeFalsy();
});

test('it should return true if specific leading comment detected in a ts module', () => {
    const ast = parse(codeIgnoredWithInterpreterCommand, { sourceType: 'module' });
    const { importNodes } = extractASTNodes(ast);

    expect(isSortImportsIgnored(importNodes, !!ast.program.interpreter)).toBeTruthy();
});

