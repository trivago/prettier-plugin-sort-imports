import { ImportDeclaration } from '@babel/types';

import {
    THIRD_PARTY_MODULES_SPECIAL_WORD,
    THIRD_PARTY_TYPES_SPECIAL_WORD,
    TYPES_SPECIAL_WORD,
} from '../constants';

/**
 * Get the regexp group to keep the import nodes.
 * @param node
 * @param importOrder
 */
export const getImportNodesMatchedGroup = (
    node: ImportDeclaration,
    importOrder: string[],
) => {
    const groupWithRegExp = importOrder.map((group) => ({
        group,
        regExp: group.startsWith(TYPES_SPECIAL_WORD)
            ? new RegExp(group.replace(TYPES_SPECIAL_WORD, ''))
            : new RegExp(group),
    }));

    for (const { group, regExp } of groupWithRegExp) {
        if (
            (group.startsWith(TYPES_SPECIAL_WORD) &&
                node.importKind !== 'type') ||
            (!group.startsWith(TYPES_SPECIAL_WORD) &&
                node.importKind === 'type')
        )
            continue;

        const matched = node.source.value.match(regExp) !== null;
        if (matched) return group;
    }

    return node.importKind === 'type' &&
        importOrder.find((group) => group === THIRD_PARTY_TYPES_SPECIAL_WORD)
        ? THIRD_PARTY_TYPES_SPECIAL_WORD
        : THIRD_PARTY_MODULES_SPECIAL_WORD;
};
