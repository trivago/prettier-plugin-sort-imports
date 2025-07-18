import {
    chunkSideEffectNode,
    chunkSideOtherNode,
    newLineNode,
} from '../constants.js';
import { GetSortedNodes, ImportChunk, ImportOrLine } from '../types';
import { adjustCommentsOnSortedNodes } from './adjust-comments-on-sorted-nodes.js';
import { getSortedNodesByImportOrder } from './get-sorted-nodes-by-import-order.js';

/**
 * This function returns the given nodes, sorted in the order as indicated by
 * the importOrder array. The plugin considers these import nodes as local
 * import declarations
 *
 * In addition, this method preserves the relative order of side effect imports
 * and non side effect imports. A side effect import is an ImportDeclaration
 * without any import specifiers. It does this by splitting the import nodes at
 * each side effect node, then sorting only the non side effect import nodes
 * between the side effect nodes according to the given options.
 * @param nodes All import nodes that should be sorted.
 * @param options Options to influence the behavior of the sorting algorithm.
 */
export const getSortedNodes: GetSortedNodes = (
    nodes,
    options,
    maintainFirstNodeComments = true,
) => {
    const { importOrderSeparation, importOrderSideEffects } = options;

    // Split nodes at each boundary between a side-effect node and a
    // non-side-effect node, keeping both types of nodes together.
    const splitBySideEffectNodes = nodes.reduce<ImportChunk[]>(
        (chunks, node) => {
            const isChunkEffectNode =
                node.specifiers.length === 0 &&
                importOrderSideEffects === false;
            const type = isChunkEffectNode
                ? chunkSideEffectNode
                : chunkSideOtherNode;
            const last = chunks[chunks.length - 1];
            if (last === undefined || last.type !== type) {
                chunks.push({ type, nodes: [node] });
            } else {
                last.nodes.push(node);
            }
            return chunks;
        },
        [],
    );

    const finalNodes: ImportOrLine[] = [];

    // Sort each chunk of side-effect and non-side-effect nodes, and insert new
    // lines according the importOrderSeparation option.
    for (const chunk of splitBySideEffectNodes) {
        if (chunk.type === chunkSideEffectNode) {
            // do not sort side effect nodes
            finalNodes.push(...chunk.nodes);
        } else {
            // sort non-side effect nodes
            const sorted = getSortedNodesByImportOrder(chunk.nodes, options);
            finalNodes.push(...sorted);
        }
        if (importOrderSeparation) {
            finalNodes.push(newLineNode);
        }
    }

    if (finalNodes.length > 0 && !importOrderSeparation) {
        finalNodes.push(newLineNode);
    }

    // Adjust the comments on the sorted nodes to match the original comments
    adjustCommentsOnSortedNodes(nodes, finalNodes, maintainFirstNodeComments);

    return finalNodes;
};
