import { RequiredOptions } from 'prettier';
import { ParserPlugin } from '@babel/parser';

export interface PrettierOptions extends RequiredOptions {
    importOrder: string[];
    importOrderSeparation: boolean;
    experimentalBabelParserPluginsList: ParserPlugin[];
}
