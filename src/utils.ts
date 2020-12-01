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
export const getSortedNodesByImportOrder = (
    nodes: ImportDeclaration[],
    order: PrettierParserOptions['importOrder'],
) => {
    const sorted = order.reduce(
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

    const copy = sorted.map((iD) => cloneNode(iD));

    sorted.forEach(removeComments);

    const firstNodesComment = nodes[0]?.leadingComments;

    if (firstNodesComment) {
        addComments(sorted[0], 'leading', firstNodesComment);
    }

    // comments in-between the imports
    sorted.forEach((importDeclaration, index) => {
        addComments(
            importDeclaration,
            'leading',
            copy[index].leadingComments || [],
        );
    });

    return sorted;
};

/**
 * This function returns all the nodes which are not in the importOrder array.
 * The plugin considered these import nodes as third party import declarations.
 */
export const getSortedNodesNotInTheImportOrder = (
    nodes: ImportDeclaration[],
    order: PrettierParserOptions['importOrder'],
) => {
    const x = nodes.filter(
        (node) => !isSimilarTextExistInArray(order, node.source.value),
    );
    x.sort((a, b) => naturalSort(a.source.value, b.source.value));
    return x;
};

/**
 * This function generate a code string from the passed nodes.
 */
export const getCodeFromAst = (nodes: Statement[], ast: File) => {
    const newAST = file({
        type: 'Program',
        body: nodes.concat(ast.program.body),
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

export const getNewLine = () => '\n';
