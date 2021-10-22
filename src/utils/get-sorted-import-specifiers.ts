import { naturalSort } from '../natural-sort';
import { ImportDeclaration } from '@babel/types';

/**
 * This function returns import nodes with alphabetically sorted module
 * specifiers
 * @param node Import declaration node
 * TODO: For @ayusharma- Add unit tests
 */
export const getSortedImportSpecifiers = (node: ImportDeclaration) => {
    node.specifiers.sort((a, b) => {
        if (a.type !== b.type) {
            return a.type === 'ImportDefaultSpecifier' ? -1 : 1;
        }

        return naturalSort(a.local.name, b.local.name);
    });
    return node;
};
