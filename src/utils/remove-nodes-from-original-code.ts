import {
    ImportDeclaration,
    Statement,
    CommentBlock,
    CommentLine,
    InterpreterDirective,
} from '@babel/types';

/**
 * Removes imports from original file
 * @param code the whole file as text
 * @param nodes to be removed
 */
export const removeNodesFromOriginalCode = (
    code: string,
    nodes: (
        | Statement
        | CommentBlock
        | CommentLine
        | ImportDeclaration
        | InterpreterDirective
    )[],
) => {
    let text = code;
    for (const node of nodes) {
        const start = Number(node.start);
        const end = Number(node.end);
        if (Number.isSafeInteger(start) && Number.isSafeInteger(end)) {
            text = text.replace(code.substring(start, end), '');
        }
    }
    return text;
};
