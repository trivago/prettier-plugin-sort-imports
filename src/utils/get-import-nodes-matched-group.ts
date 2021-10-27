import { ImportDeclaration } from '@babel/types';
import { THIRD_PARTY_MODULES_SPECIAL_WORD } from '../constants';

/**
 * Get the regexp group to keep the import nodes.
 * @param node
 * @param importOrder
 */
export const getImportNodesMatchedGroup = (node: ImportDeclaration, importOrder: string[]) => {
    const groupWithRegExp = importOrder.map((group) => ({
        group,
        regExp: new RegExp(group),
    }));

    for (const { group, regExp } of groupWithRegExp) {
        const matched = node.source.value.match(regExp) !== null;
        if (matched) return group;
    }

    return THIRD_PARTY_MODULES_SPECIAL_WORD;
};
