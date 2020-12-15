// @ts-ignore
import findBabelConfig from 'find-babel-config';
import * as p from 'process';
import merge from 'deepmerge';
import { parse as parser, ParserOptions } from '@babel/parser';
import traverse, { NodePath } from '@babel/traverse';
import {
    ImportDeclaration,
    isTSModuleDeclaration,
} from '@babel/types';
import { PrettierParserOptions, getCodeFromAst, getSortedNodes } from './utils';

export function getBabelConf() {
    const { config } = findBabelConfig.sync(p.cwd());

    return config || {};
}

export function preprocessor(code: string, options: PrettierParserOptions) {
    const { importOrder, importOrderSeparation } = options;

    const importNodes: ImportDeclaration[] = [];

    const defaultConfig = {
        sourceType: 'module',
        plugins: ['typescript', 'jsx'],
    } as ParserOptions;
    const babelConfig = getBabelConf();
    const mergedOptions = merge(defaultConfig, babelConfig);

    const ast = parser(code, mergedOptions);

    traverse(ast, {
        ImportDeclaration(path: NodePath<ImportDeclaration>) {
            const tsModuleParent = path.findParent((p) => isTSModuleDeclaration(p));
            if (!tsModuleParent) {
                importNodes.push(path.node);
            }
        },
    });

    // short-circuit if there are no import declaration
    if (importNodes.length === 0) return code;

    const allImports = getSortedNodes(
        importNodes,
        importOrder,
        importOrderSeparation,
    );

    return getCodeFromAst(allImports, code);
}
