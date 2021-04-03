//@ts-ignore
import naturalSort from 'javascript-natural-sort';
import {
    ImportDeclaration,
    ExpressionStatement,
    isImportDeclaration,
} from '@babel/types';

export const getSortedSpecifiers = (
    node: ImportDeclaration | ExpressionStatement,
) => {
    if (isImportDeclaration(node)) {
        node.specifiers.sort((a, b) => naturalSort(a.local.name, b.local.name));
    }

    return node;
};
