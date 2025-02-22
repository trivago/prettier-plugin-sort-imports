import { Statement } from '@babel/types';

import { sortImportsIgnoredComment } from '../constants';
import { getAllCommentsFromNodes } from './get-all-comments-from-nodes';

export const isSortImportsIgnored = (nodes: Statement[], hasInterpreter: boolean ) =>
    getAllCommentsFromNodes(nodes).some(
        (comment) =>
            comment.loc &&
            comment.loc.start.line === (hasInterpreter ? 2 : 1) &&
            comment.value.includes(sortImportsIgnoredComment),
    );
