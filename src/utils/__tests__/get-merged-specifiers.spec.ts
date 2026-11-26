import { expect, test } from 'vitest';

import { getImportNodes } from '../get-import-nodes';
import { getMergedSpecifiers } from '../get-merged-specifiers.js';
import { getSortedNodesModulesNames } from '../get-sorted-nodes-modules-names';

test('should merge import specifiers', () => {
    const code = `
    import { eventHandler } from '@server/z';
    import { filter } from '@server/z';
    import { reduce } from '@server/z';
    `;
    const importNodes = getImportNodes(code);
    const [importDeclaration] = getMergedSpecifiers(importNodes);
    const specifiersList = getSortedNodesModulesNames(
        importDeclaration.specifiers,
    );

    expect(specifiersList).toEqual(['eventHandler', 'filter', 'reduce']);
});

test('should merge import specifiers with default import', () => {
    const code = `
    import Component from '@server/z';
    import { eventHandler } from '@server/z';
    import { filter } from '@server/z';
    import { reduce } from '@server/z';
    `;
    const importNodes = getImportNodes(code);
    const [importDeclaration] = getMergedSpecifiers(importNodes);
    const specifiersList = getSortedNodesModulesNames(
        importDeclaration.specifiers,
    );

    expect(specifiersList).toEqual([
        'Component',
        'eventHandler',
        'filter',
        'reduce',
    ]);
});

test('should ignore namespace specifiers', () => {
    const code = `
    import * as Component from '@server/z';
    import { eventHandler } from '@server/z';
    import { filter } from '@server/z';
    import { reduce } from '@server/z';
    `;
    const importNodes = getImportNodes(code);
    const importDeclarations = getMergedSpecifiers(importNodes);
    const specifiersLists = importDeclarations.map((declaration) =>
        getSortedNodesModulesNames(declaration.specifiers),
    );

    expect(specifiersLists).toEqual([
        ['Component'],
        ['eventHandler', 'filter', 'reduce'],
    ]);
});
