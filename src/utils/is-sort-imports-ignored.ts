import { Comment } from '@babel/types';

import { sortImportsIgnoredComment } from '../constants.js';

export const isSortImportsIgnored = (comments: Comment[]) => {
    return comments.some((comment) =>
        comment.value.trimStart().startsWith(sortImportsIgnoredComment),
    );
};
