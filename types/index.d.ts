import { Config } from 'prettier';

export interface PluginConfig {
    importOrder: string[];
    importOrderCaseInsensitive: boolean;
    // should be of type ParserPlugin from '@babel/parser' but prettier does not support nested arrays in options
    importOrderParserPlugins: string[];
    importOrderSeparation: boolean;
    importOrderGroupNamespaceSpecifiers: boolean;
    importOrderSortSpecifiers: boolean;
}

export type PrettierConfig = PluginConfig & Config;
