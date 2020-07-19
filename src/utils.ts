import { ParserOptions } from 'prettier';
import { NodePath } from '@babel/traverse';
import { ImportDeclaration, Program } from '@babel/types';

const t = require('@babel/types');

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

const getNodesSortedByOrder = (
    nodes: ImportDeclaration[],
    order: PrettierParserOptions['importOrder'],
) => {
    return order.reduce((res: ImportDeclaration[], val: string) => {
        const x = nodes.filter((node) => node.source.value.startsWith(val));

        return res.concat(x);
    }, []);
};

const getNodesNotInTheOrder = (
    nodes: ImportDeclaration[],
    order: PrettierParserOptions['importOrder'],
) => {
    return nodes.filter(
        (node) => !isSimilarTextExistInArray(order, node.source.value),
    );
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
    getNodesSortedByOrder,
    getNodesNotInTheOrder,
    removeImportsFromOriginalCode,
};
