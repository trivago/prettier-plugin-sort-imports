// we do not have types for javascript-natural-sort
//@ts-ignore
import naturalSort from 'javascript-natural-sort';
import { RequiredOptions } from 'prettier';
import generate from '@babel/generator';
import {
    ImportDeclaration,
    File,
    file,
    addComments,
    removeComments,
    cloneNode,
    Statement,
} from '@babel/types';

export interface PrettierParserOptions extends RequiredOptions {
    importOrder: string[];
    importOrderSeparation: boolean;
}

/**
 * This function checks that specified string exists in the specified list.
 */
const isSimilarTextExistInArray = (arr: string[], text: string) =>
    arr.some((element) => text.match(new RegExp(element)) !== null);

/**
 * This function returns all the nodes which are in the importOrder array.
 * The plugin considered these import nodes as local import declarations.
 */
export const getSortedNodes = (
    nodes: ImportDeclaration[],
    order: PrettierParserOptions['importOrder'],
) => {
    const sortedNodesByImportOrder = order.reduce(
        (res: ImportDeclaration[], val): ImportDeclaration[] => {
            const x = nodes.filter(
                (node) => node.source.value.match(new RegExp(val)) !== null,
            );
            if (x.length > 0) {
                x.sort((a, b) => naturalSort(a.source.value, b.source.value));
                return [...res, ...x];
            }
            return res;
        },
        [],
    );

    const sortedNodesNotInImportOrder = nodes.filter(
        (node) => !isSimilarTextExistInArray(order, node.source.value),
    );
    sortedNodesNotInImportOrder.sort((a, b) =>
        naturalSort(a.source.value, b.source.value),
    );

    const allSortedNodes = [
        ...sortedNodesNotInImportOrder,
        ...sortedNodesByImportOrder,
    ];

    const copy = allSortedNodes.map((n) => cloneNode(n));

    const firstNodesComment = nodes[0].leadingComments;

    // Now we remove all comments
    allSortedNodes.forEach(removeComments);

    // comments in-between the imports
    allSortedNodes.forEach((importDeclaration, index) => {
        addComments(
            importDeclaration,
            'leading',
            copy[index].leadingComments || [],
        );
    });

    if (firstNodesComment) {
        addComments(allSortedNodes[0], 'leading', firstNodesComment);
    }

    return allSortedNodes;
};

/**
 * This function generate a code string from the passed nodes.
 */
export const getCodeFromAst = (nodes: Statement[], ast: File) => {
    const allCommentsFromImports = getAllCommentsFromNodes(nodes);

    const originalAstWithoutImportComments = removeNodesFromAnotherListOfNodes(
        ast.program.body,
        allCommentsFromImports,
    );

    const originalAstWithoutImportCommentsAndImports = removeNodesFromAnotherListOfNodes(
        originalAstWithoutImportComments,
        nodes,
    );

    const newAST = file({
        type: 'Program',
        body: nodes.concat(originalAstWithoutImportCommentsAndImports),
        directives: [],
        sourceType: 'module',
        interpreter: null,
        sourceFile: '',
        leadingComments: [],
        innerComments: [],
        trailingComments: [],
        start: 0,
        end: 0,
        loc: {
            start: { line: 0, column: 0 },
            end: { line: 0, column: 0 },
        },
    });

    return generate(newAST).code;
};

const getAllCommentsFromNodes = (nodes: Statement[]) =>
    nodes.reduce((acc, node) => {
        if (
            Array.isArray(node.leadingComments) &&
            node.leadingComments.length > 0
        ) {
            acc = [...acc, ...node.leadingComments];
        }
        return acc;
    }, [] as Statement[]);

const removeNodesFromAnotherListOfNodes = (
    nodesToRemoveFrom: Statement[],
    nodesToRemove: Statement[],
) =>
    nodesToRemoveFrom.reduce((acc, node) => {
        let deleteThisNode = false;
        nodesToRemove.forEach((n) => {
            if (n.start === node.start && n.end === node.end) {
                deleteThisNode = true;
            }
        });

        if (!deleteThisNode) {
            acc.push(node);
        }

        return acc;
    }, [] as Statement[]);
