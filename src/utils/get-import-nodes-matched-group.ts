import { ImportDeclaration } from '@babel/types';

import {
    THIRD_PARTY_MODULES_SPECIAL_WORD,
    THIRD_PARTY_TYPES_SPECIAL_WORD,
    TYPE_SPECIAL_WORD,
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
    const groupWithRegExp = importOrder
        .sort((a, b) => {
            if (
                a.startsWith(TYPE_SPECIAL_WORD) &&
                !b.startsWith(TYPE_SPECIAL_WORD)
            ) {
                return -1;
            }
            if (
                !a.startsWith(TYPE_SPECIAL_WORD) &&
                b.startsWith(TYPE_SPECIAL_WORD)
            ) {
                return 1;
            }
            return 0;
        })
        .map((group) => ({
            group,
            regExp: group.startsWith(TYPE_SPECIAL_WORD)
                ? new RegExp(group.replace(TYPE_SPECIAL_WORD, ''))
                : new RegExp(group),
        }));

    for (const { group, regExp } of groupWithRegExp) {
        if (group.startsWith(TYPE_SPECIAL_WORD)) {
            if (node.importKind === 'type') {
                const matched = node.source.value.match(regExp) !== null;
                if (matched) return group;
            }
        } else {
            const matched = node.source.value.match(regExp) !== null;
            if (matched) return group;
        }
    }

    return node.importKind === 'type' &&
        importOrder.find((group) => group === THIRD_PARTY_TYPES_SPECIAL_WORD)
        ? THIRD_PARTY_TYPES_SPECIAL_WORD
        : THIRD_PARTY_MODULES_SPECIAL_WORD;
};
