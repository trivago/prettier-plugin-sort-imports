// @ts-ignore
import findBabelConfig from 'find-babel-config';
import * as p from 'process';
import merge from 'deepmerge';
import { parse as babelParser, ParserOptions } from '@babel/parser';
import traverse, { NodePath } from '@babel/traverse';
import { ImportDeclaration, isTSModuleDeclaration } from '@babel/types';
import { PrettierParserOptions, getCodeFromAst, getSortedNodes } from './utils';

export function getBabelConf() {
    const { config } = findBabelConfig.sync(p.cwd());

    return config || {};
}

export function preprocessor(code: string, options: PrettierParserOptions) {
    const {
        importOrder,
        importOrderSeparation,
        parser: selectedPrettierParser,
    } = options;

    const isTSParserUsed = selectedPrettierParser === 'typescript';
    const angularPlugins = [
        ['decorators', { decoratorsBeforeExport: true }],
        'classProperties',
    ];

    console.log({ isTSParserUsed });

    const importNodes: ImportDeclaration[] = [];

    const defaultConfig = {
        sourceType: 'module',
        plugins: [
            'typescript',
            'jsx',
            ...(isTSParserUsed ? angularPlugins : []),
        ],
    } as ParserOptions;
    const babelConfig = getBabelConf();
    const mergedOptions = merge(defaultConfig, babelConfig);

    const ast = babelParser(code, mergedOptions);

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

    // short-circuit if there are no import declaration
    if (importNodes.length === 0) return code;

    const allImports = getSortedNodes(
        importNodes,
        importOrder,
        importOrderSeparation,
    );

    return getCodeFromAst(allImports, code);
}
