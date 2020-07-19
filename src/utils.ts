import { ParserOptions } from 'prettier';
import { NodePath } from '@babel/traverse';
import { ImportDeclaration, Program } from '@babel/types';

const t = require('@babel/types');
const naturalSort = require('javascript-natural-sort');

export interface PrettierParserOptions extends ParserOptions {
    importOrder: string[];
}

const isSimilarTextExistInArray = (arr: string[], text: string) =>
    arr.some((element) => text.startsWith(element));

const getAllImportNodes = (path: NodePath<Program>) =>
    path
        .get('body')
        .filter(({ node }) => t.isImportDeclaration(node))
        .map(({ node }) => node);

const getSortedNodesByOrder = (
    nodes: ImportDeclaration[],
    order: PrettierParserOptions['importOrder'],
) => {
    return order.reduce((res: ImportDeclaration[], val: string) => {
        const x = nodes.filter((node) => node.source.value.startsWith(val));
        x.sort((a, b) => naturalSort(a.source.value, b.source.value));
        return res.concat(x);
    }, []);
};

const getSortedNodesNotInTheOrder = (
    nodes: ImportDeclaration[],
    order: PrettierParserOptions['importOrder'],
) => {
    const x = nodes.filter(
        (node) => !isSimilarTextExistInArray(order, node.source.value),
    );
    x.sort((a, b) => naturalSort(a.source.value, b.source.value));
    return x;
};

const removeImportsFromOriginalCode = (
    code: string,
    nodes: ImportDeclaration[],
) => {
    let text = code;
    for (const node of nodes) {
        if (node.start && node.end)
            text = text.replace(code.substring(node.start, node.end), '');
    }
    return text.trim();
};

module.exports = {
    getAllImportNodes,
    getSortedNodesByOrder,
    getSortedNodesNotInTheOrder,
    removeImportsFromOriginalCode,
};
