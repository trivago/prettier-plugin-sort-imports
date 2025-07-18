import { Comment } from '@babel/types';

import { sortImportsIgnoredComment } from '../constants';

export const isSortImportsIgnored = (comments: Comment[]) => {
    return comments.some((comment) =>
        comment.value.includes(sortImportsIgnoredComment),
    );
};
