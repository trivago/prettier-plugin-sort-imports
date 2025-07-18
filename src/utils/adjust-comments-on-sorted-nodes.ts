import { ImportDeclaration, addComments, removeComments } from '@babel/types';
import { clone, isEqual } from 'lodash-es';

import { ImportOrLine } from '../types';

/**
 * Takes the original nodes before sorting and the final nodes after sorting.
 * Adjusts the comments on the final nodes so that they match the comments as
 * they were in the original nodes.
 * @param nodes A list of nodes in the order as they were originally.
 * @param finalNodes The same set of nodes, but in the final sorting order.
 */
export const adjustCommentsOnSortedNodes = (
    nodes: ImportDeclaration[],
    finalNodes: ImportOrLine[],
    maintainFirstNodeComments: boolean = true,
) => {
    // maintain a copy of the nodes to extract comments from
    const finalNodesClone = finalNodes.map(clone);

    const firstNodesComments = nodes[0].leadingComments;

    // Remove all comments from sorted nodes
    finalNodes.forEach(removeComments);

    // insert comments other than the first comments
    finalNodes.forEach((node, index) => {
        if (maintainFirstNodeComments) {
            if (isEqual(nodes[0].loc, node.loc)) return;

            // remove comments location to not confuse print AST
            firstNodesComments?.forEach((comment) => {
                delete comment.loc;
            });
        }

        addComments(
            node,
            'leading',
            finalNodesClone[index].leadingComments || [],
        );
    });

    if (maintainFirstNodeComments && firstNodesComments) {
        addComments(finalNodes[0], 'leading', firstNodesComments);
    }
};
