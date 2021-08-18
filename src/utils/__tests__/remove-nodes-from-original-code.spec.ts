import { format } from 'prettier';
import { parse as babelParser, ParserOptions } from '@babel/parser';
import traverse, { NodePath } from '@babel/traverse';
import { ImportDeclaration, isTSModuleDeclaration } from '@babel/types';
import { getAllCommentsFromNodes } from '../get-all-comments-from-nodes';
import { getSortedNodes } from '../get-sorted-nodes';
import { removeNodesFromOriginalCode } from '../remove-nodes-from-original-code';

const getImportNodes = (code: string, options?: ParserOptions) => {
    const importNodes: ImportDeclaration[] = [];
    const ast = babelParser(code, {
        ...options,
        sourceType: 'module',
    });

    traverse(ast, {
        ImportDeclaration(path: NodePath<ImportDeclaration>) {
            const tsModuleParent = path.findParent((p) =>
                isTSModuleDeclaration(p),
            );
            if (!tsModuleParent) {
                importNodes.push(path.node);
            }
        },
    });

    return importNodes;
};

const code = `// first comment
// second comment
import z from 'z';
import c from 'c';
import g from 'g';
import t from 't';
import k from 'k';
// import a from 'a';
  // import a from 'a';
import a from 'a';
`;

test('it should remove nodes from the original code', () => {
    const importNodes = getImportNodes(code);
    const sortedNodes = getSortedNodes(importNodes, [], false);
    const allCommentsFromImports = getAllCommentsFromNodes(sortedNodes);

    const commentAndImportsToRemoveFromCode = [
        ...sortedNodes,
        ...allCommentsFromImports,
    ];
    const codeWithoutImportDeclarations = removeNodesFromOriginalCode(
        code,
        commentAndImportsToRemoveFromCode,
    );
    const result = format(codeWithoutImportDeclarations, { parser: 'babel' });
    expect(result).toEqual('');
});
