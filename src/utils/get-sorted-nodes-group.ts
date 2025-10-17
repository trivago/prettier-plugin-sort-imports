import { ImportDeclaration } from '@babel/types';

import { naturalSort } from '../natural-sort/index.js';
import { PrettierOptions } from '../types';

export const getSortedNodesGroup = (
    imports: ImportDeclaration[],
    options: Pick<
        PrettierOptions,
        'importOrderGroupNamespaceSpecifiers' | 'importOrderSortByLength'
    >,
) => {
    return imports.sort((a, b) => {
        const aLength = (a.end || 0) - (a.start || 0);
        const bLength = (b.end || 0) - (b.start || 0);

        if (options.importOrderGroupNamespaceSpecifiers) {
            const diff = namespaceSpecifierSort(a, b);
            if (diff !== 0) return diff;
        }

        if (options.importOrderSortByLength === 'asc')
            return (
                aLength - bLength ||
                a.source.value.localeCompare(b.source.value)
            );

        if (options.importOrderSortByLength === 'desc')
            return (
                bLength - aLength ||
                a.source.value.localeCompare(b.source.value)
            );

        return naturalSort(a.source.value, b.source.value);
    });
};

function namespaceSpecifierSort(a: ImportDeclaration, b: ImportDeclaration) {
    const aFirstSpecifier = a.specifiers.find(
        (s) => s.type === 'ImportNamespaceSpecifier',
    )
        ? 1
        : 0;
    const bFirstSpecifier = b.specifiers.find(
        (s) => s.type === 'ImportNamespaceSpecifier',
    )
        ? 1
        : 0;
    return bFirstSpecifier - aFirstSpecifier;
}
