import {
    importDeclaration,
    importSpecifier,
    identifier,
    stringLiteral,
    isImportDeclaration,
} from '@babel/types';

import { getSortedSpecifiers } from '../get-sorted-specifiers';

const importNode = importDeclaration(
    [
        importSpecifier(identifier('f'), identifier('f')),
        importSpecifier(identifier('c'), identifier('c')),
        importSpecifier(identifier('b'), identifier('b')),
        importSpecifier(identifier('a'), identifier('a')),
        importSpecifier(identifier('e'), identifier('e')),
        importSpecifier(identifier('d'), identifier('d')),
    ],
    stringLiteral('library'),
);

const importNodeWithSortedSpecifier = getSortedSpecifiers(importNode);
const sortedSpecifiers: string[] = isImportDeclaration(
    importNodeWithSortedSpecifier,
)
    ? importNodeWithSortedSpecifier.specifiers.map(
          (sortedSpecifier) => sortedSpecifier.local.name,
      )
    : [];

test('should return sorted specifiers', () => {
    expect(sortedSpecifiers).toEqual(['a', 'b', 'c', 'd', 'e', 'f']);
});
