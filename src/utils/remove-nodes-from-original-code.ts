import { Comment, Node } from '@babel/types';

type NodeOrComment = Node | Comment;
type BoundedNodeOrComment = NodeOrComment & { start: number; end: number };

/**
 * Removes imports from original file
 * @param code the whole file as text
 * @param nodes to be removed
 */
export const removeNodesFromOriginalCode = (
    code: string,
    nodes: (Node | Comment)[],
) => {
    const ranges: { start: number; end: number }[] = nodes.filter(
        (node): node is BoundedNodeOrComment => {
            const start = Number(node.start);
            const end = Number(node.end);
            return Number.isSafeInteger(start) && Number.isSafeInteger(end);
        },
    );
    ranges.sort((a, b) => a.start - b.start);

    const chunks: string[] = [];
    let idx = 0;

    for (const { start, end } of ranges) {
        if (start > idx) {
            chunks.push(code.slice(idx, start));
            idx = start;
        }
        if (end > idx) {
            idx = end;
        }
    }

    if (idx < code.length) {
        chunks.push(code.slice(idx));
    }

    return chunks.join('');
};
