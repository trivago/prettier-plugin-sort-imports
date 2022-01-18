import { ImportDeclaration } from '@babel/types';

import { getImportNodes } from '../get-import-nodes';
import { getSortedNodes } from '../get-sorted-nodes';
import { getSortedNodesModulesNames } from '../get-sorted-nodes-modules-names';
import { getSortedNodesNames } from '../get-sorted-nodes-names';

const code = `// first comment
// second comment
import "se3";
import z from 'z';
import c, { cD } from 'c';
import g from 'g';
import { tC, tA, tB } from 't';
import k, { kE, kB } from 'k';
import "se4";
import "se1";
import * as a from 'a';
import * as x from 'x';
import BY from 'BY';
import Ba from 'Ba';
import XY from 'XY';
import Xa from 'Xa';
import "se2";
`;

test('it returns all sorted nodes, preserving the order side effect nodes', () => {
    const result = getImportNodes(code);
    const sorted = getSortedNodes(result, {
        importOrder: [],
        importOrderCaseInsensitive: false,
        importOrderSeparation: false,
        importOrderGroupNamespaceSpecifiers: false,
        importOrderSortSpecifiers: false,
    }) as ImportDeclaration[];

    expect(getSortedNodesNames(sorted)).toEqual([
        'se3',
        'c',
        'g',
        'k',
        't',
        'z',
        'se4',
        'se1',
        'BY',
        'Ba',
        'XY',
        'Xa',
        'a',
        'x',
        'se2',
    ]);
    expect(
        sorted
            .filter((node) => node.type === 'ImportDeclaration')
            .map((importDeclaration) =>
                getSortedNodesModulesNames(importDeclaration.specifiers),
            ),
    ).toEqual([
        [],
        ['c', 'cD'],
        ['g'],
        ['k', 'kE', 'kB'],
        ['tC', 'tA', 'tB'],
        ['z'],
        [],
        [],
        ['BY'],
        ['Ba'],
        ['XY'],
        ['Xa'],
        ['a'],
        ['x'],
        [],
    ]);
});
