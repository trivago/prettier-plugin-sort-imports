import { clone } from 'lodash';

import { THIRD_PARTY_MODULES_SPECIAL_WORD, newLineNode } from '../constants';
import { naturalSort } from '../natural-sort';
import { GetSortedNodes, ImportGroups, ImportOrLine } from '../types';
import { getImportNodesMatchedGroup } from './get-import-nodes-matched-group';
import { getSortedImportSpecifiers } from './get-sorted-import-specifiers';

/**
 * This function returns the given nodes, sorted in the order as indicated by
 * the importOrder array from the given options.
 * The plugin considers these import nodes as local import declarations.
 * @param nodes A subset of all import nodes that should be sorted.
 * @param options Options to influence the behavior of the sorting algorithm.
 */
export const getSortedNodesByImportOrder: GetSortedNodes = (nodes, options) => {
    naturalSort.insensitive = options.importOrderCaseInsensitive;

    let { importOrder } = options;
    const { importOrderSeparation, importOrderSortSpecifiers } = options;

    const originalNodes = nodes.map(clone);
    const finalNodes: ImportOrLine[] = [];

    if (!importOrder.includes(THIRD_PARTY_MODULES_SPECIAL_WORD)) {
        importOrder = [THIRD_PARTY_MODULES_SPECIAL_WORD, ...importOrder];
    }

    const importOrderGroups = importOrder.reduce<ImportGroups>(
        (groups, regexp) => ({
            ...groups,
            [regexp]: [],
        }),
        {},
    );

    const importOrderWithOutThirdPartyPlaceholder = importOrder.filter(
        (group) => group !== THIRD_PARTY_MODULES_SPECIAL_WORD,
    );

    for (const node of originalNodes) {
        const matchedGroup = getImportNodesMatchedGroup(
            node,
            importOrderWithOutThirdPartyPlaceholder,
        );
        importOrderGroups[matchedGroup].push(node);
    }

    for (const group of importOrder) {
        const groupNodes = importOrderGroups[group];
        const last = group === importOrder[importOrder.length - 1];

        if (groupNodes.length === 0) continue;

        const sortedInsideGroup = groupNodes.sort((a, b) =>
            naturalSort(a.source.value, b.source.value),
        );

        // Sort the import specifiers
        if (importOrderSortSpecifiers) {
            sortedInsideGroup.forEach((node) =>
                getSortedImportSpecifiers(node),
            );
        }

        finalNodes.push(...sortedInsideGroup);

        if (importOrderSeparation && !last) {
            finalNodes.push(newLineNode);
        }
    }

    return finalNodes;
};
