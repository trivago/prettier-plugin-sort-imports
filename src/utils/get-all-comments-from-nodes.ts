import { CommentBlock, CommentLine, Statement } from '@babel/types';

export const getAllCommentsFromNodes = (nodes: Statement[]) =>
    nodes.reduce(
        (acc, node) => {
            if (
                Array.isArray(node.leadingComments) &&
                node.leadingComments.length > 0
            ) {
                acc = [...acc, ...node.leadingComments];
            }
            return acc;
        },
        [] as (CommentBlock | CommentLine)[],
    );
