import { ParseResult } from '@babel/parser';
import traverse, { NodePath } from '@babel/traverse';
import { File, ImportDeclaration, Node, Program } from '@babel/types';

import { PrettierOptions } from '../types';

const adjustCommentsOnFirstNode = (node: Node, options: Options) => {
    const {
        importOrderIgnoreHeaderComments,
        importOrderIgnoreHeaderCommentTypes,
    } = options;

    if (importOrderIgnoreHeaderComments <= 0) {
        return;
    }

    const comments = node.leadingComments ?? [];
    if (comments.length <= 0) {
        return;
    }

    let remaining = importOrderIgnoreHeaderComments;
    node.leadingComments = comments.filter((comment) => {
        if (remaining <= 0) {
            return true;
        }
        if (importOrderIgnoreHeaderCommentTypes === 'All') {
            remaining--;
            return false;
        }
        if (comment.type !== importOrderIgnoreHeaderCommentTypes) {
            remaining = 0;
            return true;
        }
        remaining--;
        return false;
    });
};

type Options = Pick<
    PrettierOptions,
    'importOrderIgnoreHeaderComments' | 'importOrderIgnoreHeaderCommentTypes'
>;

export function extractASTNodes(ast: ParseResult<File>, options: Options) {
    const importNodes: ImportDeclaration[] = [];
    let injectIdx = 0;
    traverse(ast, {
        Program(path: NodePath<Program>) {
            /**
             * Imports will be injected before the first node of the body and
             * its comments, skipping InterpreterDirective and Directive nodes.
             * If the body is empty, default to 0, there will be no imports to
             * inject anyway.
             */
            for (const node of path.node.body) {
                if (node.type === 'ImportDeclaration') {
                    adjustCommentsOnFirstNode(node, options);
                }
                injectIdx = node.leadingComments?.[0]?.start ?? node.start ?? 0;
                // for loop only runs if there is a node, and only a single iteration
                break;
            }
        },

        ImportDeclaration(path: NodePath<ImportDeclaration>) {
            const tsModuleParent = path.findParent((p) =>
                p.isTSModuleDeclaration(),
            );
            if (tsModuleParent) {
                return;
            }

            importNodes.push(path.node);
        },
    });
    return { importNodes, injectIdx };
}
