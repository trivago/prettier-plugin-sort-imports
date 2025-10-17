import { expect, test } from 'vitest';

import { getAllCommentsFromNodes } from '../get-all-comments-from-nodes';
import { getImportNodes } from '../get-import-nodes';
import { isSortImportsIgnored } from '../is-sort-imports-ignored';

const codeIgnored = `// sort-imports-ignore
// second comment
import z from 'z';
`;

const codeNotIgnored = `// second comment
import z from 'z';
`;

const notIgnoreTextWithIgnoreLine = `// you need to write sort-imports-ignore
import z from 'z';
`;

test('it should return true if specific leading comment detected', () => {
    const importNodes = getImportNodes(codeIgnored);

    expect(
        isSortImportsIgnored(getAllCommentsFromNodes(importNodes)),
    ).toBeTruthy();
});

test('it should return false if no specific leading comment detected', () => {
    const importNodes = getImportNodes(codeNotIgnored);

    expect(
        isSortImportsIgnored(getAllCommentsFromNodes(importNodes)),
    ).toBeFalsy();
});

test('it should return false if ignore isnt on top of comment', () => {
    const importNodes = getImportNodes(notIgnoreTextWithIgnoreLine);

    expect(
        isSortImportsIgnored(getAllCommentsFromNodes(importNodes)),
    ).toBeFalsy();
});
