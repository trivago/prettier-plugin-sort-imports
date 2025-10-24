import { clone } from 'lodash-es';

import {
    BUILTIN_MODULES_SPECIAL_WORD,
    SEPARATOR_SPECIAL_WORD,
    THIRD_PARTY_MODULES_SPECIAL_WORD,
    newLineNode,
} from '../constants.js';
import { naturalSort } from '../natural-sort/index.js';
import { GetSortedNodes, ImportGroups, ImportOrLine } from '../types';
import { getImportNodesMatchedGroup } from './get-import-nodes-matched-group.js';
import { getSortedImportSpecifiers } from './get-sorted-import-specifiers.js';
import { getSortedNodesGroup } from './get-sorted-nodes-group.js';

/**
 * This function returns the given nodes, sorted in the order as indicated by
 * the importOrder array from the given options.
 * The plugin considers these import nodes as local import declarations.
 * @param nodes A subset of all import nodes that should be sorted.
 * @param options Options to influence the behavior of the sorting algorithm.
 */
export const getSortedNodesByImportOrder: GetSortedNodes = (nodes, options) => {
    naturalSort.insensitive = options.importOrderCaseInsensitive;

    let { importOrder, importOrderSortByLength } = options;
    const {
        importOrderSeparation,
        importOrderSortSpecifiers,
        importOrderGroupNamespaceSpecifiers,
    } = options;

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

    const importOrderWithOutSpecialWords = importOrder.filter(
        (group) =>
            group !== THIRD_PARTY_MODULES_SPECIAL_WORD &&
            group !== BUILTIN_MODULES_SPECIAL_WORD,
    );

    for (const node of originalNodes) {
        const matchedGroup = getImportNodesMatchedGroup(node, importOrder);
        importOrderGroups[matchedGroup].push(node);
    }

    const hasUserProvidedSeparators = options.importOrder.includes(
        SEPARATOR_SPECIAL_WORD,
    );
    let safeToAddNewLine = false;
    for (const group of importOrder) {
        const groupNodes = importOrderGroups[group];

        if (
            importOrderSeparation &&
            group === SEPARATOR_SPECIAL_WORD &&
            safeToAddNewLine
        ) {
            finalNodes.push(newLineNode);
        }
        if (groupNodes.length === 0) continue;

        const sortedInsideGroup = getSortedNodesGroup(groupNodes, {
            importOrderGroupNamespaceSpecifiers,
            importOrderSortByLength,
        });

        // Sort the import specifiers
        if (importOrderSortSpecifiers) {
            sortedInsideGroup.forEach((node) =>
                getSortedImportSpecifiers(node),
            );
        }

        finalNodes.push(...sortedInsideGroup);
        safeToAddNewLine = true;

        if (importOrderSeparation && !hasUserProvidedSeparators) {
            finalNodes.push(newLineNode);
        }
    }

    return finalNodes;
};
