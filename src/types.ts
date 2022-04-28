import { ExpressionStatement, ImportDeclaration } from '@babel/types';
import { RequiredOptions } from 'prettier';

export interface PrettierOptions extends RequiredOptions {
    importOrder: string[];
    importOrderCaseInsensitive: boolean;
    importOrderBuiltinModulesToTop: boolean;
    // should be of type ParserPlugin from '@babel/parser' but prettier does not support nested arrays in options
    importOrderParserPlugins: string[];
    importOrderSeparation: boolean;
    importOrderGroupNamespaceSpecifiers: boolean;
    importOrderSortSpecifiers: boolean;
}

export type ImportGroups = Record<string, ImportDeclaration[]>;
export type ImportOrLine = ImportDeclaration | ExpressionStatement;

export type GetSortedNodes = (
    nodes: ImportDeclaration[],
    options: Pick<
        PrettierOptions,
        | 'importOrder'
        | 'importOrderBuiltinModulesToTop'
        | 'importOrderCaseInsensitive'
        | 'importOrderSeparation'
        | 'importOrderGroupNamespaceSpecifiers'
        | 'importOrderSortSpecifiers'
    >,
) => ImportOrLine[];
