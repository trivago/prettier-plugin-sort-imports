// we do not have types for javascript-natural-sort
//@ts-ignore
import naturalSort from 'javascript-natural-sort';
import { RequiredOptions } from 'prettier';
import generate from '@babel/generator';
import {
    ImportDeclaration,
    file,
    addComments,
    removeComments,
    cloneNode,
    Statement,
    expressionStatement,
    stringLiteral,
    ExpressionStatement,
} from '@babel/types';
import { compact, isEqual } from 'lodash';

export interface PrettierParserOptions extends RequiredOptions {
    importOrder: string[];
    importOrderSeparation: boolean;
}

const PRETTIER_PLUGIN_SORT_IMPORTS_NEW_LINE =
    'PRETTIER_PLUGIN_SORT_IMPORTS_NEW_LINE';

const newLineNode = expressionStatement(
    stringLiteral(PRETTIER_PLUGIN_SORT_IMPORTS_NEW_LINE),
);

const newLineCharacters = '\n\n';

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
    importOrderSeparation: boolean,
) => {
    const newLine =
        importOrderSeparation && nodes.length > 1 ? newLineNode : null;

    const sortedNodesByImportOrder = order.reduce(
        (
            res: (ImportDeclaration | ExpressionStatement)[],
            val,
        ): (ImportDeclaration | ExpressionStatement)[] => {
            const x = nodes.filter(
                (node) => node.source.value.match(new RegExp(val)) !== null,
            );
            if (x.length > 0) {
                x.sort((a, b) => naturalSort(a.source.value, b.source.value));
                return compact([...res, newLine, ...x]);
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
        newLineNode,
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

    if (firstNodesComment && !isEqual(nodes[0], allSortedNodes[0])) {
        addComments(allSortedNodes[0], 'leading', firstNodesComment);
    }

    return allSortedNodes;
};

export const removeImportsFromOriginalCode = (
    code: string,
    nodes: Statement[],
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

/**
 * This function generate a code string from the passed nodes.
 */
export const getCodeFromAst = (nodes: Statement[], originalCode: string) => {
    const allCommentsFromImports = getAllCommentsFromNodes(nodes);

    const commentAndImportsToRemoveFromCode = [
        ...nodes,
        ...allCommentsFromImports,
    ];

    const codeWithoutImportDeclarations = removeImportsFromOriginalCode(
        originalCode,
        commentAndImportsToRemoveFromCode,
    );

    const newAST = file({
        type: 'Program',
        body: nodes,
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

    const { code } = generate(newAST);

    return (
        code.replace(
            /"PRETTIER_PLUGIN_SORT_IMPORTS_NEW_LINE";/gi,
            newLineCharacters,
        ) + codeWithoutImportDeclarations
    );
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
