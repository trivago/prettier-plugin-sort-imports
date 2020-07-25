// we do not have types for javascript-natural-sort
//@ts-ignore
import naturalSort from 'javascript-natural-sort';
import { RequiredOptions } from 'prettier';
import generate from '@babel/generator';
import { file } from '@babel/types';
import { ImportDeclaration } from '@babel/types';

export interface PrettierParserOptions extends RequiredOptions {
    importOrder: string[];
    importOrderSeparation: boolean;
}

const isSimilarTextExistInArray = (arr: string[], text: string) =>
    arr.some((element) => text.match(new RegExp(element)) !== null);

export const getSortedNodesByImportOrder = (
    nodes: ImportDeclaration[],
    order: PrettierParserOptions['importOrder'],
) => {
    return order.reduce(
        (res: ImportDeclaration[][], val): ImportDeclaration[][] => {
            const x = nodes.filter(
                (node) => node.source.value.match(new RegExp(val)) !== null,
            );

            x.sort((a, b) => naturalSort(a.source.value, b.source.value));
            return [...res, x];
        },
        [],
    );
};

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

export const removeImportsFromOriginalCode = (
    code: string,
    nodes: ImportDeclaration[],
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

export const getCodeFromAst = (node: ImportDeclaration[]) => {
    const ast = file({
        type: 'Program',
        body: node,
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

    return generate(ast).code;
};

export const getLineConnectingString = (isNewLine: boolean) =>
    isNewLine ? '\n\n' : '\n';
