import { Statement } from '@babel/types';

import { sortImportsIgnoredComment } from '../constants.js';
import { getAllCommentsFromNodes } from './get-all-comments-from-nodes.js';

export const isSortImportsIgnored = (nodes: Statement[]) =>
    getAllCommentsFromNodes(nodes).some(
        (comment) =>
            comment.loc &&
            comment.loc.start.line === 1 &&
            comment.value.includes(sortImportsIgnoredComment),
    );
