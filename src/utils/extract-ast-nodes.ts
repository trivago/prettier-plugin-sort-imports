import { ParseResult } from '@babel/parser';
import traverse, { NodePath } from '@babel/traverse';
import {
    Directive,
    File,
    ImportDeclaration,
    isTSModuleDeclaration,
} from '@babel/types';

export function extractASTNodes(ast: ParseResult<File>) {
    const importNodes: ImportDeclaration[] = [];
    const directives: Directive[] = [];
    traverse(ast, {
        Directive({ node }) {
            directives.push(node);

            // Trailing comments probably shouldn't be attached to the directive
            node.trailingComments = null;
        },

        ImportDeclaration(path: NodePath<ImportDeclaration>) {
            const tsModuleParent = path.findParent((p) =>
                isTSModuleDeclaration(p),
            );
            if (!tsModuleParent) {
                importNodes.push(path.node);
            }
        },
    });
    return { importNodes, directives };
}
