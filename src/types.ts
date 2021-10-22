import { RequiredOptions } from 'prettier';

export interface PrettierOptions extends RequiredOptions {
    // should be of type ParserPlugin from '@babel/parser' but prettier does not support nested arrays in options
    experimentalBabelParserPluginsList: string[];
    importOrder: string[];
    importOrderCaseInsensitive: boolean;
    // should be of type ParserPlugin from '@babel/parser' but prettier does not support nested arrays in options
    importOrderParserPlugins: string[];
    importOrderSeparation: boolean;
    importOrderSortSpecifiers: boolean;
}
