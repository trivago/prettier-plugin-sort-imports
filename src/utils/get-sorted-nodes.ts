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
 */
export const getSortedNodes = (
    nodes: ImportDeclaration[],
    order: PrettierOptions['importOrder'],
    importOrderSeparation: boolean,
) => {
    const originalNodes = nodes.map(clone);

    // ignore empty regex separation if importOrderSeparation is true to not break existing configs
    order = importOrderSeparation ? compact(order) : order;

    const newLine =
        importOrderSeparation && nodes.length > 1 ? newLineNode : null;
    const sortedNodesByImportOrder = order.reduce((res, val) => {
        if (val === '') return [...res, newLineNode];
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
    }, [] as (ImportDeclaration | ExpressionStatement)[]);

    const sortedNodesNotInImportOrder = originalNodes.filter(
        (node) => !isSimilarTextExistInArray(compact(order), node.source.value),
    );

    sortedNodesNotInImportOrder.sort((a, b) =>
        naturalSort(a.source.value, b.source.value),
    );

    const allSortedNodes = compact([
        ...sortedNodesNotInImportOrder,
        newLine,
        ...sortedNodesByImportOrder,
        newLineNode, // insert a newline after all sorted imports
    ]);
    if (allSortedNodes.length > 1 && allSortedNodes[0] === newLineNode) {
        allSortedNodes.shift(); // remove trailing new line
    }

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
