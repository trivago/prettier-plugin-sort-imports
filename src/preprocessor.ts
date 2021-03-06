import merge from 'deepmerge';
import { parse as babelParser, ParserOptions } from '@babel/parser';
import traverse, { NodePath } from '@babel/traverse';
import { ImportDeclaration, isTSModuleDeclaration } from '@babel/types';
import { PrettierParserOptions, getCodeFromAst, getSortedNodes } from './utils';
import { getBabelConf } from './utils/get-babel-conf';
import { getParserPlugins } from './utils/get-parser-plugins';

export function preprocessor(code: string, options: PrettierParserOptions) {
    const {
        importOrder,
        importOrderSeparation,
        parser: prettierParser,
        experimentalBabelParserPluginsList = [],
    } = options;

    const plugins = getParserPlugins(prettierParser);

    const importNodes: ImportDeclaration[] = [];

    const defaultConfig = {
        sourceType: 'module',
        plugins: [...plugins, ...experimentalBabelParserPluginsList],
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
