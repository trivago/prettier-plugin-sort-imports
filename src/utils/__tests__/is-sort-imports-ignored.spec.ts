import { getImportNodes } from '../get-import-nodes';
import { isSortImportsIgnored } from '../is-sort-imports-ignored';

const codeIgnored = `// sort-imports-ignore
// second comment
import z from 'z';
`;

const codeNotIgnored = `// second comment
import z from 'z';
`;

test('it should return true if specific leading comment detected', () => {
    const importNodes = getImportNodes(codeIgnored);

    expect(isSortImportsIgnored(importNodes)).toBeTruthy();
});

test('it should return false if no specific leading comment detected', () => {
    const importNodes = getImportNodes(codeNotIgnored);

    expect(isSortImportsIgnored(importNodes)).toBeFalsy();
});
