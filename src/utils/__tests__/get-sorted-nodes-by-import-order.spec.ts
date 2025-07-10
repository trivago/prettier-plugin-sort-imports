import { ImportDeclaration } from '@babel/types';
import { expect, test } from 'vitest'

import { getImportNodes } from '../get-import-nodes.js';
import { getSortedNodes } from '../get-sorted-nodes.js';
import { getSortedNodesModulesNames } from '../get-sorted-nodes-modules-names.js';
import { getSortedNodesNames } from '../get-sorted-nodes-names.js';
import { PRETTIER_PLUGIN_SORT_IMPORTS_NEW_LINE } from "../../constants.js"
import { ImportOrLine } from "../../types"

const code = `// first comment
// second comment
import z from 'z';
import c, { cD } from 'c';
import g from 'g';
import { tC, tA, tB } from 't';
import k, { kE, kB } from 'k';
import * as a from 'a';
import * as x from 'x';
import BY from 'BY';
import Ba from 'Ba';
import XY from 'XY';
import Xa from 'Xa';
`;

test('it returns all sorted nodes', () => {
    const result = getImportNodes(code);
    const sorted = getSortedNodes(result, {
        importOrder: [],
        importOrderCaseInsensitive: false,
        importOrderSeparation: false,
        importOrderGroupNamespaceSpecifiers: false,
        importOrderSortSpecifiers: false,
        importOrderSideEffects: true,
    }) as ImportDeclaration[];

    expect(getSortedNodesNames(sorted)).toEqual([
        'BY',
        'Ba',
        'XY',
        'Xa',
        'a',
        'c',
        'g',
        'k',
        't',
        'x',
        'z',
    ]);
    expect(
        sorted
            .filter((node) => node.type === 'ImportDeclaration')
            .map((importDeclaration) =>
                getSortedNodesModulesNames(importDeclaration.specifiers),
            ),
    ).toEqual([
        ['BY'],
        ['Ba'],
        ['XY'],
        ['Xa'],
        ['a'],
        ['c', 'cD'],
        ['g'],
        ['k', 'kE', 'kB'],
        ['tC', 'tA', 'tB'],
        ['x'],
        ['z'],
    ]);
});

test('it returns all sorted nodes case-insensitive', () => {
    const result = getImportNodes(code);
    const sorted = getSortedNodes(result, {
        importOrder: [],
        importOrderCaseInsensitive: true,
        importOrderSeparation: false,
        importOrderGroupNamespaceSpecifiers: false,
        importOrderSortSpecifiers: false,
        importOrderSideEffects: true,
    }) as ImportDeclaration[];

    expect(getSortedNodesNames(sorted)).toEqual([
        'a',
        'Ba',
        'BY',
        'c',
        'g',
        'k',
        't',
        'x',
        'Xa',
        'XY',
        'z',
    ]);
    expect(
        sorted
            .filter((node) => node.type === 'ImportDeclaration')
            .map((importDeclaration) =>
                getSortedNodesModulesNames(importDeclaration.specifiers),
            ),
    ).toEqual([
        ['a'],
        ['Ba'],
        ['BY'],
        ['c', 'cD'],
        ['g'],
        ['k', 'kE', 'kB'],
        ['tC', 'tA', 'tB'],
        ['x'],
        ['Xa'],
        ['XY'],
        ['z'],
    ]);
});

test('it returns all sorted nodes with sort order', () => {
    const result = getImportNodes(code);
    const sorted = getSortedNodes(result, {
        importOrder: ['^a$', '^t$', '^k$', '^B'],
        importOrderCaseInsensitive: false,
        importOrderSeparation: false,
        importOrderGroupNamespaceSpecifiers: false,
        importOrderSortSpecifiers: false,
        importOrderSideEffects: true,
    }) as ImportDeclaration[];

    expect(getSortedNodesNames(sorted)).toEqual([
        'XY',
        'Xa',
        'c',
        'g',
        'x',
        'z',
        'a',
        't',
        'k',
        'BY',
        'Ba',
    ]);
    expect(
        sorted
            .filter((node) => node.type === 'ImportDeclaration')
            .map((importDeclaration) =>
                getSortedNodesModulesNames(importDeclaration.specifiers),
            ),
    ).toEqual([
        ['XY'],
        ['Xa'],
        ['c', 'cD'],
        ['g'],
        ['x'],
        ['z'],
        ['a'],
        ['tC', 'tA', 'tB'],
        ['k', 'kE', 'kB'],
        ['BY'],
        ['Ba'],
    ]);
});

test('it returns all sorted nodes with sort order case-insensitive', () => {
    const result = getImportNodes(code);
    const sorted = getSortedNodes(result, {
        importOrder: ['^a$', '^t$', '^k$', '^B'],
        importOrderCaseInsensitive: true,
        importOrderSeparation: false,
        importOrderGroupNamespaceSpecifiers: false,
        importOrderSortSpecifiers: false,
        importOrderSideEffects: true,
    }) as ImportDeclaration[];
    expect(getSortedNodesNames(sorted)).toEqual([
        'c',
        'g',
        'x',
        'Xa',
        'XY',
        'z',
        'a',
        't',
        'k',
        'Ba',
        'BY',
    ]);
    expect(
        sorted
            .filter((node) => node.type === 'ImportDeclaration')
            .map((importDeclaration) =>
                getSortedNodesModulesNames(importDeclaration.specifiers),
            ),
    ).toEqual([
        ['c', 'cD'],
        ['g'],
        ['x'],
        ['Xa'],
        ['XY'],
        ['z'],
        ['a'],
        ['tC', 'tA', 'tB'],
        ['k', 'kE', 'kB'],
        ['Ba'],
        ['BY'],
    ]);
});

test('it returns all sorted import nodes with sorted import specifiers', () => {
    const result = getImportNodes(code);
    const sorted = getSortedNodes(result, {
        importOrder: ['^a$', '^t$', '^k$', '^B'],
        importOrderCaseInsensitive: false,
        importOrderSeparation: false,
        importOrderGroupNamespaceSpecifiers: false,
        importOrderSortSpecifiers: true,
        importOrderSideEffects: true,
    }) as ImportDeclaration[];
    expect(getSortedNodesNames(sorted)).toEqual([
        'XY',
        'Xa',
        'c',
        'g',
        'x',
        'z',
        'a',
        't',
        'k',
        'BY',
        'Ba',
    ]);
    expect(
        sorted
            .filter((node) => node.type === 'ImportDeclaration')
            .map((importDeclaration) =>
                getSortedNodesModulesNames(importDeclaration.specifiers),
            ),
    ).toEqual([
        ['XY'],
        ['Xa'],
        ['c', 'cD'],
        ['g'],
        ['x'],
        ['z'],
        ['a'],
        ['tA', 'tB', 'tC'],
        ['k', 'kB', 'kE'],
        ['BY'],
        ['Ba'],
    ]);
});

test('it returns all sorted import nodes with sorted import specifiers with case-insensitive ', () => {
    const result = getImportNodes(code);
    const sorted = getSortedNodes(result, {
        importOrder: ['^a$', '^t$', '^k$', '^B'],
        importOrderCaseInsensitive: true,
        importOrderSeparation: false,
        importOrderGroupNamespaceSpecifiers: false,
        importOrderSortSpecifiers: true,
        importOrderSideEffects: true,
    }) as ImportDeclaration[];
    expect(getSortedNodesNames(sorted)).toEqual([
        'c',
        'g',
        'x',
        'Xa',
        'XY',
        'z',
        'a',
        't',
        'k',
        'Ba',
        'BY',
    ]);
    expect(
        sorted
            .filter((node) => node.type === 'ImportDeclaration')
            .map((importDeclaration) =>
                getSortedNodesModulesNames(importDeclaration.specifiers),
            ),
    ).toEqual([
        ['c', 'cD'],
        ['g'],
        ['x'],
        ['Xa'],
        ['XY'],
        ['z'],
        ['a'],
        ['tA', 'tB', 'tC'],
        ['k', 'kB', 'kE'],
        ['Ba'],
        ['BY'],
    ]);
});

test('it returns all sorted nodes with custom third party modules', () => {
    const result = getImportNodes(code);
    const sorted = getSortedNodes(result, {
        importOrder: ['^a$', '<THIRD_PARTY_MODULES>', '^t$', '^k$'],
        importOrderSeparation: false,
        importOrderCaseInsensitive: true,
        importOrderGroupNamespaceSpecifiers: false,
        importOrderSortSpecifiers: false,
        importOrderSideEffects: true,
    }) as ImportDeclaration[];
    expect(getSortedNodesNames(sorted)).toEqual([
        'a',
        'Ba',
        'BY',
        'c',
        'g',
        'x',
        'Xa',
        'XY',
        'z',
        't',
        'k',
    ]);
});

test('it returns all sorted nodes with namespace specifiers at the top', () => {
    const result = getImportNodes(code);
    const sorted = getSortedNodes(result, {
        importOrder: [],
        importOrderCaseInsensitive: false,
        importOrderSeparation: false,
        importOrderGroupNamespaceSpecifiers: true,
        importOrderSortSpecifiers: false,
        importOrderSideEffects: true,
    }) as ImportDeclaration[];

    expect(getSortedNodesNames(sorted)).toEqual([
        'a',
        'x',
        'BY',
        'Ba',
        'XY',
        'Xa',
        'c',
        'g',
        'k',
        't',
        'z',
    ]);
});

test('it returns the default separations if `importOrderSeparation` is false', () => {
    const result = getImportNodes(code);
    const sorted = getSortedNodes(result, {
        importOrder: ['<SEPARATOR>', '^a$', '^t$', '<SEPARATOR>', '^k$', '^B', '<SEPARATOR>'],
        importOrderCaseInsensitive: false,
        importOrderSeparation: false,
        importOrderGroupNamespaceSpecifiers: false,
        importOrderSortSpecifiers: false,
        importOrderSideEffects: true,
    });
    expect(getSeparationData(sorted)).toEqual([
        { type: "ImportDeclaration", value: 'XY' },
        { type: "ImportDeclaration", value: 'Xa' },
        { type: "ImportDeclaration", value: 'c' },
        { type: "ImportDeclaration", value: 'g' },
        { type: "ImportDeclaration", value: 'x' },
        { type: "ImportDeclaration", value: 'z' },
        { type: "ImportDeclaration", value: 'a' },
        { type: "ImportDeclaration", value: 't' },
        { type: "ImportDeclaration", value: 'k' },
        { type: "ImportDeclaration", value: 'BY' },
        { type: "ImportDeclaration", value: 'Ba' },
        { type: "ExpressionStatement", value: undefined },
    ]);
});

test('it returns default import module separations', () => {
    const result = getImportNodes(code);
    const sorted = getSortedNodes(result, {
        importOrder: ['^a$', '^t$', '^k$', '^B'],
        importOrderCaseInsensitive: false,
        importOrderSeparation: true,
        importOrderGroupNamespaceSpecifiers: false,
        importOrderSortSpecifiers: false,
        importOrderSideEffects: true,
    });
    expect(getSeparationData(sorted)).toEqual([
        { type: "ImportDeclaration", value: 'XY' },
        { type: "ImportDeclaration", value: 'Xa' },
        { type: "ImportDeclaration", value: 'c' },
        { type: "ImportDeclaration", value: 'g' },
        { type: "ImportDeclaration", value: 'x' },
        { type: "ImportDeclaration", value: 'z' },
        { type: "ExpressionStatement", value: undefined },
        { type: "ImportDeclaration", value: 'a' },
        { type: "ExpressionStatement", value: undefined },
        { type: "ImportDeclaration", value: 't' },
        { type: "ExpressionStatement", value: undefined },
        { type: "ImportDeclaration", value: 'k' },
        { type: "ExpressionStatement", value: undefined },
        { type: "ImportDeclaration", value: 'BY' },
        { type: "ImportDeclaration", value: 'Ba' },
        { type: "ExpressionStatement", value: undefined },
        { type: "ExpressionStatement", value: undefined },
    ]);
});

test('it returns targeted import module separations', () => {
    const result = getImportNodes(code);
    const sorted = getSortedNodes(result, {
        importOrder: ['^a$', '<SEPARATOR>', '^t$', '<SEPARATOR>', '^k$', '^B'],
        importOrderCaseInsensitive: false,
        importOrderSeparation: true,
        importOrderGroupNamespaceSpecifiers: false,
        importOrderSortSpecifiers: false,
        importOrderSideEffects: true,
    });
    expect(getSeparationData(sorted)).toEqual([
        { type: "ImportDeclaration", value: 'XY' },
        { type: "ImportDeclaration", value: 'Xa' },
        { type: "ImportDeclaration", value: 'c' },
        { type: "ImportDeclaration", value: 'g' },
        { type: "ImportDeclaration", value: 'x' },
        { type: "ImportDeclaration", value: 'z' },
        { type: "ImportDeclaration", value: 'a' },
        { type: "ExpressionStatement", value: undefined },
        { type: "ImportDeclaration", value: 't' },
        { type: "ExpressionStatement", value: undefined },
        { type: "ImportDeclaration", value: 'k' },
        { type: "ImportDeclaration", value: 'BY' },
        { type: "ImportDeclaration", value: 'Ba' },
        { type: "ExpressionStatement", value: undefined },
    ]);
});

test('it never returns a separation at the top of the list (leading separator)', () => {
    const result = getImportNodes(`
        import './test'; 
    `.trim());
    const sorted = getSortedNodes(result, {
        importOrder: ['<SEPARATOR>', '^[./]'],
        importOrderCaseInsensitive: false,
        importOrderSeparation: true,
        importOrderGroupNamespaceSpecifiers: false,
        importOrderSortSpecifiers: false,
        importOrderSideEffects: true,
    });
    expect(getSeparationData(sorted)).toEqual([
        { type: "ImportDeclaration", value: './test' },
        { type: "ExpressionStatement", value: undefined },
    ]);
});

test('it never returns a separation at the top of the list (zero preceding imports)', () => {
    const result = getImportNodes(`
        import './test'; 
    `.trim());
    const sorted = getSortedNodes(result, {
        importOrder: ['^a.*$', '<SEPARATOR>', '^[./]'],
        importOrderCaseInsensitive: false,
        importOrderSeparation: true,
        importOrderGroupNamespaceSpecifiers: false,
        importOrderSortSpecifiers: false,
        importOrderSideEffects: true,
    });
    expect(getSeparationData(sorted)).toEqual([
        { type: "ImportDeclaration", value: './test' },
        { type: "ExpressionStatement", value: undefined },
    ]);
});

// Focuses the nodes solely to the import declarations and the new lines
function getSeparationData(nodes: ImportOrLine[]): { type: "ImportDeclaration" | "ExpressionStatement", value?: string }[] {
    return nodes
      .filter(node => node.type === "ImportDeclaration"
        || (
          node.type === "ExpressionStatement"
          && node.expression.type === "StringLiteral"
          && node.expression.value === PRETTIER_PLUGIN_SORT_IMPORTS_NEW_LINE
        ))
      .map(x => ({
          type: x.type,
          value: x.type === "ImportDeclaration" ? x.source.value : undefined
      }));
}
