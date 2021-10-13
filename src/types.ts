import { RequiredOptions } from 'prettier';

export interface PrettierOptions extends RequiredOptions {
    importOrder: string[];
    importOrderSeparation: boolean;
    experimentalBabelParserPluginsList: string[]; // should be of type ParserPlugin from '@babel/parser' but babel does not support nested arrays in options
}
