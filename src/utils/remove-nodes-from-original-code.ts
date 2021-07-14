import {
    ImportDeclaration,
    Statement,
    CommentBlock,
    CommentLine,
    InterpreterDirective,
} from '@babel/types';

/** Escapes a string literal to be passed to new RegExp. See: https://stackoverflow.com/a/6969486/480608.
 * @param s the string to escape
 */
const escapeRegExp = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

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
            text = text.replace(
                // only replace imports at the beginning of the line (ignoring whitespace)
                // otherwise matching commented imports will be replaced
                new RegExp(
                    '^\\s*' + escapeRegExp(code.substring(start, end)),
                    'm',
                ),
                '',
            );
        }
    }
    return text;
};
