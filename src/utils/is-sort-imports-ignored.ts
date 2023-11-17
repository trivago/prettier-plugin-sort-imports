import { Statement } from '@babel/types';

import { sortImportsIgnoredComment } from '../constants';
import { getAllCommentsFromNodes } from './get-all-comments-from-nodes';

export const isSortImportsIgnored = (nodes: Statement[]) =>
    getAllCommentsFromNodes(nodes).some(
        (comment) =>
            comment.loc.start.line === 1 &&
            comment.value.includes(sortImportsIgnoredComment),
    );
