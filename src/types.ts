import { RequiredOptions } from 'prettier';
import { ParserPlugin } from '@babel/parser';

export interface PrettierOptions extends RequiredOptions {
    experimentalBabelParserPluginsList: ParserPlugin[];
    importOrder: string[];
    importOrderCaseInsensitive: boolean;
    importOrderSeparation: boolean;
    sortModules: boolean;
}
