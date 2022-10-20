import { ExpressionStatement, ImportDeclaration } from '@babel/types';
import { RequiredOptions } from 'prettier';

import { PluginConfig } from '../types';

export interface PrettierOptions extends PluginConfig, RequiredOptions {}

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
    >,
) => ImportOrLine[];
