import { ImportDeclaration } from '@babel/types';

import { getImportNodes } from '../get-import-nodes';
import { getSortedNodes } from '../get-sorted-nodes';
import { getSortedNodesModulesNames } from '../get-sorted-nodes-modules-names';
import { getSortedNodesNames } from '../get-sorted-nodes-names';

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
