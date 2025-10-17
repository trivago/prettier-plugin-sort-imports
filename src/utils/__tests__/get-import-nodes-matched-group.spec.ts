import { expect, test } from 'vitest'

import { getImportNodes } from '../get-import-nodes';
import { getImportNodesMatchedGroup } from '../get-import-nodes-matched-group';

const code = `// first comment
// second comment
import z from '@server/z';
import c from '@server/c';
import g from '@ui/g';
import t from '@core/t';
import k from 'k';
import j from './j';
import l from './l';
import a from '@core/a';
`;
test('should return correct matched groups', () => {
    const importNodes = getImportNodes(code);
    const importOrder = [
        '^@server/(.*)$',
        '^@core/(.*)$',
        '^@ui/(.*)$',
        '^[./]',
    ];

    let matchedGroups: string[] = [];
    for (const importNode of importNodes) {
        const matchedGroup = getImportNodesMatchedGroup(
            importNode,
            importOrder,
        );
        matchedGroups.push(matchedGroup);
    }
    expect(matchedGroups).toEqual([
        '^@server/(.*)$',
        '^@server/(.*)$',
        '^@ui/(.*)$',
        '^@core/(.*)$',
        '<THIRD_PARTY_MODULES>',
        '^[./]',
        '^[./]',
        '^@core/(.*)$',
    ]);
});

test('should return type imports as part of a matching group if no type-specific group is present', () => {
    const code = `
import type { ExternalType } from 'external-type-module';
import type { InternalType } from './internal-type-module';
import { externalFn } from 'external-fn-module';
import { internalFn } from './internal-fn-module';
    `
    const importNodes = getImportNodes(code,{
        plugins: ['typescript'],
    });
    const importOrder = [
        '^[^.].*',
        '^[.].*',
    ];

    let matchedGroups: string[] = [];
    for (const importNode of importNodes) {
        const matchedGroup = getImportNodesMatchedGroup(
            importNode,
            importOrder,
        );
        matchedGroups.push(matchedGroup);
    }
    expect(matchedGroups).toEqual([
        '^[^.].*',
        '^[.].*',
        '^[^.].*',
        '^[.].*',
    ]);
});

test('should return type imports as part of a type-specific group even if a matching non-type specific group precedes it', () => {
    const code = `
import type { ExternalType } from 'external-type-module';
import type { InternalType } from './internal-type-module';
import { externalFn } from 'external-fn-module';
import { internalFn } from './internal-fn-module';
    `
    const importNodes = getImportNodes(code, {
        plugins: ['typescript'],
    });
    const importOrder = [
        '^[^.].*',
        '^[.].*',
        '<TS_TYPES>^[.].*',
    ];

    let matchedGroups: string[] = [];
    for (const importNode of importNodes) {
        const matchedGroup = getImportNodesMatchedGroup(
            importNode,
            importOrder,
        );
        matchedGroups.push(matchedGroup);
    }
    expect(matchedGroups).toEqual([
        '^[^.].*',
        '<TS_TYPES>^[.].*',
        '^[^.].*',
        '^[.].*',
    ]);
});

test('should return THIRD_PARTY_MODULES as matched group with empty order list', () => {
    const importNodes = getImportNodes(code);
    const importOrder: string[] = [];

    for (const importNode of importNodes) {
        const matchedGroup = getImportNodesMatchedGroup(
            importNode,
            importOrder,
        );
        expect(matchedGroup).toEqual('<THIRD_PARTY_MODULES>');
    }
});
