import { Statement } from '@babel/types';

import { getAllCommentsFromNodes } from './get-all-comments-from-nodes';

export const isSortImportsIgnored = (nodes: Statement[]) =>
    getAllCommentsFromNodes(nodes).some(
        (comment) =>
            comment.loc.start.line === 1 &&
            comment.value.includes('sort-imports-ignore'),
    );
