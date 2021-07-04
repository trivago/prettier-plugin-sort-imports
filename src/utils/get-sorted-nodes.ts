// we do not have types for javascript-natural-sort
//@ts-ignore
import naturalSort from 'javascript-natural-sort';
import { isEqual, clone } from 'lodash';

import {
    ImportDeclaration,
    ExpressionStatement,
    addComments,
    removeComments,
} from '@babel/types';

import { PrettierOptions } from '../types';
import { newLineNode, THIRD_PARTY_MODULES_SPECIAL_WORD } from '../constants';

type ImportGroups = Record<string, ImportDeclaration[]>;
type ImportOrLine = ImportDeclaration | ExpressionStatement;

/**
 * This function returns import nodes with alphabeticaly sorted modules
 * @param node Import declaration node
 */
const getSortedModulesImport = (node: ImportDeclaration) => {
    node.specifiers.sort((a, b) => {
        if (a.type !== b.type) {
            return a.type === 'ImportDefaultSpecifier' ? -1 : 1;
        }

        return naturalSort(a.local.name, b.local.name);
    });
    return node;
};

/**
 * Get the regexp group to keep the import nodes.
 * @param node
 * @param importOrder
 */
const getMatchedGroup = (node: ImportDeclaration, importOrder: string[]) => {
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

/**
 * This function returns all the nodes which are in the importOrder array.
 * The plugin considered these import nodes as local import declarations.
 * @param nodes all import nodes
 * @param options
 */
export const getSortedNodes = (
    nodes: ImportDeclaration[],
    options: Pick<
        PrettierOptions,
        | 'importOrder'
        | 'importOrderCaseInsensitive'
        | 'importOrderSeparation'
        | 'importOrderSortSpecifiers'
    >,
) => {


    naturalSort.insensitive = options.importOrderCaseInsensitive;

    let { importOrder } = options;
    const {importOrderSeparation} = options
    const originalNodes = nodes.map(clone);

    const finalNodes: ImportOrLine[] = [];


    if (!importOrder.includes(THIRD_PARTY_MODULES_SPECIAL_WORD)) {
        importOrder = [THIRD_PARTY_MODULES_SPECIAL_WORD, ...importOrder]
    }

    const importOrderGroups = importOrder.reduce<ImportGroups>((groups, regexp) => ({
        ...groups,
        [regexp]:[]
    }),{});


    const importOrderWithOutThirdPartyPlaceholder = importOrder
        .filter((group) => group !== THIRD_PARTY_MODULES_SPECIAL_WORD);


    for (const node of originalNodes) {
        const matchedGroup = getMatchedGroup(node,importOrderWithOutThirdPartyPlaceholder);
        importOrderGroups[matchedGroup].push(node);
    }

    for (const group of importOrder) {
        const groupNodes = importOrderGroups[group];

        if (groupNodes.length === 0) {
            return;
        }

        const sortedInsideGroup = groupNodes.sort((a, b) =>
            naturalSort(a.source.value, b.source.value),
        );

        finalNodes.push(...sortedInsideGroup);

        if (importOrderSeparation) {
            finalNodes.push(newLineNode);
        }
    }

    if (options.importOrderSortSpecifiers) {
        finalNodes.forEach((node) =>
            // @ts-ignore
            getSortedModulesImport(node),
        );
    }


    if (finalNodes.length > 0 && !importOrderSeparation) {
        // a newline after all imports
        finalNodes.push(newLineNode);
    }

    // maintain a copy of the nodes to extract comments from
    const finalNodesClone = finalNodes.map(clone);

    const firstNodesComments = nodes[0].leadingComments;

    // Remove all comments from sorted nodes
    finalNodes.forEach(removeComments);

    // insert comments other than the first comments
    finalNodes.forEach((node, index) => {
        if (isEqual(nodes[0].loc, node.loc)) return;

        addComments(
            node,
            'leading',
            finalNodesClone[index].leadingComments || [],
        );
    });

    if (firstNodesComments) {
        addComments(finalNodes[0], 'leading', firstNodesComments);
    }

    return finalNodes;
};
