import { ImportDeclaration } from '@babel/types';
import { expect, test } from 'vitest'

import { adjustCommentsOnSortedNodes } from '../adjust-comments-on-sorted-nodes';
import { getImportNodes } from '../get-import-nodes';

function leadingComments(node: ImportDeclaration): string[] {
    return node.leadingComments?.map((c) => c.value) ?? [];
}

function trailingComments(node: ImportDeclaration): string[] {
    return node.trailingComments?.map((c) => c.value) ?? [];
}

test('it preserves the single leading comment for each import declaration', () => {
    const importNodes = getImportNodes(`
    import {x} from "c";
    // comment b
    import {y} from "b";
    // comment a
    import {z} from "a";
    `);
    expect(importNodes).toHaveLength(3);
    const finalNodes = [importNodes[2], importNodes[1], importNodes[0]];
    adjustCommentsOnSortedNodes(importNodes, finalNodes);
    expect(finalNodes).toHaveLength(3);
    expect(leadingComments(finalNodes[0])).toEqual([' comment a']);
    expect(trailingComments(finalNodes[0])).toEqual([]);
    expect(leadingComments(finalNodes[1])).toEqual([' comment b']);
    expect(trailingComments(finalNodes[1])).toEqual([]);
    expect(leadingComments(finalNodes[2])).toEqual([]);
    expect(trailingComments(finalNodes[2])).toEqual([]);
});

test('it preserves multiple leading comments for each import declaration', () => {
    const importNodes = getImportNodes(`
    import {x} from "c";
    // comment b1
    // comment b2
    // comment b3
    import {y} from "b";
    // comment a1
    // comment a2
    // comment a3
    import {z} from "a";
    `);
    expect(importNodes).toHaveLength(3);
    const finalNodes = [importNodes[2], importNodes[1], importNodes[0]];
    adjustCommentsOnSortedNodes(importNodes, finalNodes);
    expect(finalNodes).toHaveLength(3);
    expect(leadingComments(finalNodes[0])).toEqual([
        ' comment a1',
        ' comment a2',
        ' comment a3',
    ]);
    expect(trailingComments(finalNodes[0])).toEqual([]);
    expect(leadingComments(finalNodes[1])).toEqual([
        ' comment b1',
        ' comment b2',
        ' comment b3',
    ]);
    expect(trailingComments(finalNodes[1])).toEqual([]);
    expect(leadingComments(finalNodes[2])).toEqual([]);
    expect(trailingComments(finalNodes[2])).toEqual([]);
});

test('it does not move comments at before all import declarations', () => {
    const importNodes = getImportNodes(`
    // comment c1
    // comment c2
    import {x} from "c";
    import {y} from "b";
    import {z} from "a";
    `);
    expect(importNodes).toHaveLength(3);
    const finalNodes = [importNodes[2], importNodes[1], importNodes[0]];
    adjustCommentsOnSortedNodes(importNodes, finalNodes);
    expect(finalNodes).toHaveLength(3);
    expect(leadingComments(finalNodes[0])).toEqual([
        ' comment c1',
        ' comment c2',
    ]);
    expect(trailingComments(finalNodes[0])).toEqual([]);
    expect(leadingComments(finalNodes[1])).toEqual([]);
    expect(trailingComments(finalNodes[1])).toEqual([]);
    expect(leadingComments(finalNodes[2])).toEqual([]);
    expect(trailingComments(finalNodes[2])).toEqual([]);
});

test('it does not affect comments after all import declarations', () => {
    const importNodes = getImportNodes(`
    import {x} from "c";
    import {y} from "b";
    import {z} from "a";
    // comment final 1
    // comment final 2
    `);
    expect(importNodes).toHaveLength(3);
    const finalNodes = [importNodes[2], importNodes[1], importNodes[0]];
    adjustCommentsOnSortedNodes(importNodes, finalNodes);
    expect(finalNodes).toHaveLength(3);
    expect(leadingComments(finalNodes[0])).toEqual([]);
    expect(trailingComments(finalNodes[0])).toEqual([]);
    expect(leadingComments(finalNodes[1])).toEqual([]);
    expect(trailingComments(finalNodes[1])).toEqual([]);
    expect(leadingComments(finalNodes[2])).toEqual([]);
    expect(trailingComments(finalNodes[2])).toEqual([]);
});
