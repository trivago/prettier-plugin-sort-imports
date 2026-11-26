import generateModule from '@babel/generator';
import { ImportDeclaration } from '@babel/types';
import { describe, expect, test } from 'vitest';

import { getImportNodes } from '../get-import-nodes';
import { mergeDuplicateImports } from '../merge-duplicate-imports';

const generate = (generateModule as any).default || generateModule;

const printNode = (node: ImportDeclaration) =>
    generate(node, { retainLines: false, compact: true }).code.trim();

const print = (nodes: ImportDeclaration[]) => nodes.map(printNode);

const parse = (code: string) => getImportNodes(code, { errorRecovery: true });

const tsParse = (code: string) =>
    getImportNodes(code, {
        plugins: ['typescript'],
        errorRecovery: true,
    });

describe('mergeDuplicateImports', () => {
    test('merges two named imports from the same path', () => {
        const nodes = parse(`import { A } from 'm';\nimport { B } from 'm';`);
        const merged = mergeDuplicateImports(nodes);
        expect(print(merged)).toEqual([`import{A,B}from'm';`]);
    });

    test('deduplicates identical specifiers', () => {
        // Parse the two declarations separately so the scope checker does
        // not flag the deliberately duplicated `A` binding.
        const nodes = [
            ...parse(`import { A, B } from 'm';`),
            ...parse(`import { A, C } from 'm';`),
        ];
        const merged = mergeDuplicateImports(nodes);
        expect(print(merged)).toEqual([`import{A,B,C}from'm';`]);
    });

    test('merges default and named imports', () => {
        const nodes = parse(`import D from 'm';\nimport { A } from 'm';`);
        const merged = mergeDuplicateImports(nodes);
        expect(print(merged)).toEqual([`import D,{A}from'm';`]);
    });

    test('merges default and namespace imports', () => {
        const nodes = parse(`import D from 'm';\nimport * as N from 'm';`);
        const merged = mergeDuplicateImports(nodes);
        expect(print(merged)).toEqual([`import D,*as N from'm';`]);
    });

    test('absorbs side-effect imports into a matching declaration', () => {
        const nodes = parse(`import 'm';\nimport { A } from 'm';`);
        const merged = mergeDuplicateImports(nodes);
        expect(merged).toHaveLength(1);
        expect(print(merged)).toEqual([`import{A}from'm';`]);
    });

    test('absorbs trailing side-effect imports', () => {
        const nodes = parse(`import { A } from 'm';\nimport 'm';`);
        const merged = mergeDuplicateImports(nodes);
        expect(print(merged)).toEqual([`import{A}from'm';`]);
    });

    test('does not merge namespace + named imports (invalid syntax)', () => {
        const nodes = parse(`import * as N from 'm';\nimport { A } from 'm';`);
        const merged = mergeDuplicateImports(nodes);
        expect(merged).toHaveLength(2);
    });

    test('does not merge imports with conflicting default locals', () => {
        const nodes = parse(`import D1 from 'm';\nimport D2 from 'm';`);
        const merged = mergeDuplicateImports(nodes);
        expect(merged).toHaveLength(2);
    });

    test('does not merge imports with conflicting namespace locals', () => {
        const nodes = parse(
            `import * as N1 from 'm';\nimport * as N2 from 'm';`,
        );
        const merged = mergeDuplicateImports(nodes);
        expect(merged).toHaveLength(2);
    });

    test('leaves imports from different paths untouched', () => {
        const nodes = parse(`import { A } from 'm';\nimport { B } from 'n';`);
        const merged = mergeDuplicateImports(nodes);
        expect(merged).toHaveLength(2);
    });

    test('merges three imports from the same path', () => {
        const nodes = parse(
            `import { A } from 'm';\nimport { B } from 'm';\nimport { C } from 'm';`,
        );
        const merged = mergeDuplicateImports(nodes);
        expect(print(merged)).toEqual([`import{A,B,C}from'm';`]);
    });

    test('does not merge imports with different attributes', () => {
        const nodes = parse(
            `import { A } from 'm' with { type: 'json' };\nimport { B } from 'm';`,
        );
        const merged = mergeDuplicateImports(nodes);
        expect(merged).toHaveLength(2);
    });

    test('merges imports with matching attributes', () => {
        const nodes = parse(
            `import { A } from 'm' with { type: 'json' };\nimport { B } from 'm' with { type: 'json' };`,
        );
        const merged = mergeDuplicateImports(nodes);
        expect(merged).toHaveLength(1);
    });

    test('promotes named type-only imports when merging with a value import', () => {
        const nodes = tsParse(
            `import { A } from 'm';\nimport type { B } from 'm';`,
        );
        const merged = mergeDuplicateImports(nodes);
        expect(print(merged)).toEqual([`import{A,type B}from'm';`]);
    });

    test('keeps importKind = type when both declarations are type-only', () => {
        const nodes = tsParse(
            `import type { A } from 'm';\nimport type { B } from 'm';`,
        );
        const merged = mergeDuplicateImports(nodes);
        expect(merged).toHaveLength(1);
        expect(merged[0].importKind).toBe('type');
        expect(print(merged)).toEqual([`import type{A,B}from'm';`]);
    });

    test('does not merge type default with value named (would require type modifier on default)', () => {
        const nodes = tsParse(
            `import type D from 'm';\nimport { A } from 'm';`,
        );
        const merged = mergeDuplicateImports(nodes);
        expect(merged).toHaveLength(2);
    });

    test('does not drop the type modifier on already-promoted specifiers when deduping', () => {
        const nodes = tsParse(
            `import { type A } from 'm';\nimport { A } from 'm';`,
        );
        const merged = mergeDuplicateImports(nodes);
        // Differing specifier kinds (type vs value) are distinct specifiers
        expect(print(merged)).toEqual([`import{type A,A}from'm';`]);
    });

    test('preserves leading comments from absorbed declarations', () => {
        const nodes = parse(
            `// keep me\nimport { A } from 'm';\n// also keep\nimport { B } from 'm';`,
        );
        const merged = mergeDuplicateImports(nodes);
        expect(merged).toHaveLength(1);
        const comments = (merged[0].leadingComments ?? []).map((c) =>
            c.value.trim(),
        );
        expect(comments).toEqual(
            expect.arrayContaining(['keep me', 'also keep']),
        );
    });
});
