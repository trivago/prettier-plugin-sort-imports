import { ParseResult } from '@babel/parser';
import traverseModule, { NodePath } from '@babel/traverse';
import { File, ImportDeclaration, Program } from '@babel/types';

const traverse = (traverseModule as any).default || traverseModule;

export function extractASTNodes(ast: ParseResult<File>) {
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
                injectIdx = node.leadingComments?.[0]?.start ?? node.start ?? 0;
                break;
            }
        },

        ImportDeclaration(path: NodePath<ImportDeclaration>) {
            const tsModuleParent = path.findParent((p) =>
                p.isTSModuleDeclaration(),
            );
            if (!tsModuleParent) {
                importNodes.push(path.node);
            }
        },
    });
    return { importNodes, injectIdx };
}
