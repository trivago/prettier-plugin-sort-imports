import { ImportDeclaration } from '@babel/types';

import {
    BUILTIN_MODULES_SPECIAL_WORD,
    THIRD_PARTY_MODULES_SPECIAL_WORD,
    THIRD_PARTY_TYPES_SPECIAL_WORD,
    TYPES_SPECIAL_WORD,
} from '../constants.js';
import { isBuiltinModule } from './is-builtin-module.js';

/**
 * Get the regexp group to keep the import nodes.
 * @param node
 * @param importOrder
 */
export const getImportNodesMatchedGroup = (
    node: ImportDeclaration,
    importOrder: string[],
) => {
    const moduleName = node.source.value;

    // Check if this is a builtin module and <BUILTIN_MODULES> is in the importOrder
    if (
        importOrder.includes(BUILTIN_MODULES_SPECIAL_WORD) &&
        isBuiltinModule(moduleName)
    ) {
        return BUILTIN_MODULES_SPECIAL_WORD;
    }

    const groupWithRegExp = importOrder.map((group) => ({
        group,
        regExp: group.startsWith(TYPES_SPECIAL_WORD)
            ? new RegExp(group.replace(TYPES_SPECIAL_WORD, ''))
            : new RegExp(group),
    }));

    // finding the group for non-type imports is easy: it's the first group that matches.
    // however, for type imports, we need to make sure that we don't match a non-type group
    // that's earlier in the list than a type-specific group that would otherwise match.
    // so we need to get all matching groups, look for the first matching _type-specific_ group,
    // and if it exists, return it. otherwise, return the first matching group if there is one.
    const matchingGroups = groupWithRegExp.filter(({ group, regExp }) => {
        if (
            group.startsWith(TYPES_SPECIAL_WORD) &&
            node.importKind !== 'type'
        ) {
            return false;
        } else {
            return node.source.value.match(regExp) !== null;
        }
    });

    if (matchingGroups.length === 0) {
        return node.importKind === 'type' &&
            importOrder.find(
                (group) => group === THIRD_PARTY_TYPES_SPECIAL_WORD,
            )
            ? THIRD_PARTY_TYPES_SPECIAL_WORD
            : THIRD_PARTY_MODULES_SPECIAL_WORD;
    } else if (node.importKind !== 'type') {
        return matchingGroups[0].group;
    } else {
        for (const { group } of matchingGroups) {
            if (group.startsWith(TYPES_SPECIAL_WORD)) return group;
        }
        return matchingGroups[0].group;
    }
};
