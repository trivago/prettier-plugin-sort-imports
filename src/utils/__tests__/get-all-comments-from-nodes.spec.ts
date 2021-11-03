import { ParserOptions } from '@babel/parser';
import { ImportDeclaration, CommentBlock, CommentLine } from '@babel/types';
import { getAllCommentsFromNodes } from '../get-all-comments-from-nodes';
import { getSortedNodes } from '../get-sorted-nodes';
import { getImportNodes } from '../get-import-nodes';

const getSortedImportNodes = (code: string, options?: ParserOptions) => {
    const importNodes: ImportDeclaration[] = getImportNodes(code, options);

    return getSortedNodes(importNodes, {
        importOrder: [],
        importOrderCaseInsensitive: false,
        importOrderSeparation: false,
        importOrderSortSpecifiers: false,
    });
};

const getComments = (commentNodes: (CommentBlock | CommentLine)[]) =>
    commentNodes.map((node) => node.value);

test('it returns empty array when there is no comment', () => {
    const result = getSortedImportNodes(`import z from 'z';
    `);
    const commentNodes = getAllCommentsFromNodes(result);
    const comments = getComments(commentNodes);
    expect(comments).toEqual([]);
});

test('it returns single comment of a node', () => {
    const result = getSortedImportNodes(`// first comment
import z from 'z';
`);
    const commentNodes = getAllCommentsFromNodes(result);
    const comments = getComments(commentNodes);
    expect(comments).toEqual([' first comment']);
});

test('it returns all comments for a node', () => {
    const result = getSortedImportNodes(`// first comment
// second comment
import z from 'z';
`);
    const commentNodes = getAllCommentsFromNodes(result);
    const comments = getComments(commentNodes);
    expect(comments).toEqual([' first comment', ' second comment']);
});

test('it returns comment block for a node', () => {
    const result = getSortedImportNodes(`
/**
 * some block
 */
import z from 'z';
`);
    const commentNodes = getAllCommentsFromNodes(result);
    const comments = getComments(commentNodes);
    expect(comments).toEqual(['*\n * some block\n ']);
});
