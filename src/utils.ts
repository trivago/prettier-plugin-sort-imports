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
    Statement,
    expressionStatement,
    stringLiteral,
    ExpressionStatement,
    CommentBlock,
    CommentLine,
} from '@babel/types';
import { compact, isEqual, pull, clone } from 'lodash';

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
 * @param list
 * @param text
 */
const isSimilarTextExistInArray = (list: string[], text: string) =>
    list.some((element) => text.match(new RegExp(element)) !== null);

/**
 * This function returns all the nodes which are in the importOrder array.
 * The plugin considered these import nodes as local import declarations.
 * @param nodes all import nodes
 * @param order import order
 * @param importOrderSeparation boolean indicating if newline should be inserted after each import order
 */
export const getSortedNodes = (
    nodes: ImportDeclaration[],
    order: PrettierParserOptions['importOrder'],
    importOrderSeparation: boolean,
) => {
    const originalNodes = nodes.map(clone);
    const newLine =
        importOrderSeparation && nodes.length > 1 ? newLineNode : null;

    const sortedNodesByImportOrder = order.reduce(
        (
            res: (ImportDeclaration | ExpressionStatement)[],
            val,
        ): (ImportDeclaration | ExpressionStatement)[] => {
            const x = originalNodes.filter(
                (node) => node.source.value.match(new RegExp(val)) !== null,
            );

            // remove "found" imports from the list of nodes
            pull(originalNodes, ...x);

            if (x.length > 0) {
                x.sort((a, b) => naturalSort(a.source.value, b.source.value));
                return compact([...res, newLine, ...x]);
            }
            return res;
        },
        [],
    );

    const sortedNodesNotInImportOrder = originalNodes.filter(
        (node) => !isSimilarTextExistInArray(order, node.source.value),
    );

    sortedNodesNotInImportOrder.sort((a, b) =>
        naturalSort(a.source.value, b.source.value),
    );

    const allSortedNodes = [
        ...sortedNodesNotInImportOrder,
        ...sortedNodesByImportOrder,
        newLineNode, // insert a newline after all sorted imports
    ];

    // maintain a copy of th nodes to extract comments from
    const sortedNodesClone = allSortedNodes.map(clone);

    const firstNodesComments = nodes[0].leadingComments;

    // Remove all comments from sorted nodes
    allSortedNodes.forEach(removeComments);

    // insert comments other than the first commens
    allSortedNodes.forEach((importDeclaration, index) => {
        addComments(
            importDeclaration,
            'leading',
            sortedNodesClone[index].leadingComments || [],
        );
    });

    if (firstNodesComments && !isEqual(nodes[0], allSortedNodes[0])) {
        addComments(allSortedNodes[0], 'leading', firstNodesComments);
    }

    return allSortedNodes;
};

/**
 * Removes imports from original file
 * @param code the whole file as text
 * @param nodes to be removd
 */
export const removeImportsFromOriginalCode = (
    code: string,
    nodes: (Statement | CommentBlock | CommentLine | ImportDeclaration)[],
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
 * @param nodes all imports
 * @param originalCode
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
    }, [] as (CommentBlock | CommentLine)[]);
