import { RequiredOptions } from 'prettier';

export interface PrettierOptions extends RequiredOptions {
    experimentalBabelParserPluginsList: string[]; // should be of type ParserPlugin from '@babel/parser' but prettier does not support nested arrays in options
    importOrder: string[];
    importOrderCaseInsensitive: boolean;
    importOrderParserPlugins: string[]; // should be of type ParserPlugin from '@babel/parser' but prettier does not support nested arrays in options
    importOrderSeparation: boolean;
    importOrderSortSpecifiers: boolean;
}
