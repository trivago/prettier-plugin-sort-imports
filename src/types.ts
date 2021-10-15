import { RequiredOptions } from 'prettier';

export interface PrettierOptions extends RequiredOptions {
    importOrder: string[];
    importOrderSeparation: boolean;
    importOrderCaseInsensitive: boolean;
    experimentalBabelParserPluginsList: string[]; // should be of type ParserPlugin from '@babel/parser' but prettier does not support nested arrays in options
}
