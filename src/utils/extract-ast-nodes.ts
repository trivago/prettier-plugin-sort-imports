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
        Directive(path: NodePath<Directive>) {
            // Only capture directives if they are at the top scope of the source
            // and their previous siblings are all directives
            if (
                path.parent.type === 'Program' &&
                path.getAllPrevSiblings().every((s) => {
                    return s.type === 'Directive';
                })
            ) {
                directives.push(path.node);

                // Trailing comments probably shouldn't be attached to the directive
                path.node.trailingComments = null;
            }
        },

        ImportDeclaration(path: NodePath<ImportDeclaration>) {
            const tsModuleParent = path.findParent((p) =>
                isTSModuleDeclaration(p.node),
            );
            if (!tsModuleParent) {
                importNodes.push(path.node);
            }
        },
    });
    return { importNodes, directives };
}
