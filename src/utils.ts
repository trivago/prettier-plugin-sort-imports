import { RequiredOptions } from 'prettier';
import { NodePath } from '@babel/traverse';
import { isImportDeclaration } from '@babel/types';
import { ImportDeclaration, Program } from '@babel/types';
// we do not have types for javascript-natural-sort
//@ts-ignore
import naturalSort from 'javascript-natural-sort';

export interface PrettierParserOptions extends RequiredOptions {
    importOrder: string[];
}

const isSimilarTextExistInArray = (arr: string[], text: string) =>
    arr.some((element) => text.startsWith(element));

export const getSortedNodesByImportOrder = (
    nodes: ImportDeclaration[],
    order: PrettierParserOptions['importOrder'],
) => {
    return order.reduce((res: ImportDeclaration[], val) => {
        const x = nodes.filter((node) => node.source.value.startsWith(val));
        x.sort((a, b) => naturalSort(a.source.value, b.source.value));
        return res.concat(x);
    }, []);
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
