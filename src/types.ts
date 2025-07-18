import { ExpressionStatement, ImportDeclaration } from '@babel/types';
import { RequiredOptions } from 'prettier';

import { PluginConfig } from '../types';

export interface PrettierOptions
    extends Required<PluginConfig>,
        RequiredOptions {}

export type ImportGroups = Record<string, ImportDeclaration[]>;
export type ImportOrLine = ImportDeclaration | ExpressionStatement;

export type GetSortedNodes = (
    nodes: ImportDeclaration[],
    options: Pick<
        PrettierOptions,
        | 'importOrder'
        | 'importOrderCaseInsensitive'
        | 'importOrderSeparation'
        | 'importOrderGroupNamespaceSpecifiers'
        | 'importOrderSortSpecifiers'
        | 'importOrderSortByLength'
        | 'importOrderSideEffects'
    >,
    maintainFirstNodeComments?: boolean,
) => ImportOrLine[];

export interface ImportChunk {
    nodes: ImportDeclaration[];
    type: string;
}
