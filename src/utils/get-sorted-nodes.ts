// we do not have types for javascript-natural-sort
//@ts-ignore
import naturalSort from 'javascript-natural-sort';
import { compact, isEqual, pull, clone } from 'lodash';

import {
    ImportDeclaration,
    ExpressionStatement,
    addComments,
    removeComments,
} from '@babel/types';

import { isSimilarTextExistInArray } from './is-similar-text-in-array';
import { PrettierOptions } from '../types';
import { newLineNode } from '../constants';

/**
 * This function returns all the nodes which are in the importOrder array.
 * The plugin considered these import nodes as local import declarations.
 * @param nodes all import nodes
 * @param order import order
 * @param importOrderSeparation boolean indicating if newline should be inserted after each import order
 * @param importOrderCaseInsensitive boolean indicating if ordering within import groups should be case-insensitive
 */
export const getSortedNodes = (
    nodes: ImportDeclaration[],
    options: Pick<
        PrettierOptions,
        | 'importOrder'
        | 'importOrderCaseInsensitive'
        | 'importOrderSeparation'
        | 'sortModules'
    >,
) => {
    naturalSort.insensitive = options.importOrderCaseInsensitive;

    const originalNodes = nodes.map(clone);
    const newLine =
        options.importOrderSeparation && nodes.length > 1 ? newLineNode : null;
    const sortedNodesByImportOrder = options.importOrder.reduce(
        (
            res: (ImportDeclaration | ExpressionStatement)[],
            val,
        ): (ImportDeclaration | ExpressionStatement)[] => {
            const x = originalNodes.filter(
                (node) => node.source.value.match(new RegExp(val)) !== null,
            );

            // remove "found" imports from the list of nodes
            pull(originalNodes, ...x);

            if (x.length > 0) {
                x.sort((a, b) => naturalSort(a.source.value, b.source.value));

                if (res.length > 0) {
                    return compact([...res, newLine, ...x]);
                }
                return x;
            }
            return res;
        },
        [],
    );

    const sortedNodesNotInImportOrder = originalNodes.filter(
        (node) =>
            !isSimilarTextExistInArray(options.importOrder, node.source.value),
    );

    sortedNodesNotInImportOrder.sort((a, b) =>
        naturalSort(a.source.value, b.source.value),
    );

    const shouldAddNewLineInBetween =
        sortedNodesNotInImportOrder.length > 0 && options.importOrderSeparation;

    const allSortedNodes = compact([
        ...sortedNodesNotInImportOrder,
        shouldAddNewLineInBetween ? newLineNode : null,
        ...sortedNodesByImportOrder,
        newLineNode, // insert a newline after all sorted imports
    ]);

    // maintain a copy of the nodes to extract comments from
    const sortedNodesClone = allSortedNodes.map(clone);

    const firstNodesComments = nodes[0].leadingComments;

    // Remove all comments from sorted nodes
    allSortedNodes.forEach(removeComments);

    // insert comments other than the first comments
    allSortedNodes.forEach((node, index) => {
        if (!isEqual(nodes[0].loc, node.loc)) {
            addComments(
                node,
                'leading',
                sortedNodesClone[index].leadingComments || [],
            );
        }
    });

    if (firstNodesComments) {
        addComments(allSortedNodes[0], 'leading', firstNodesComments);
    }

    return allSortedNodes;
};
