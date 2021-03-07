import { RequiredOptions } from 'prettier';

export interface PrettierOptions extends RequiredOptions {
    importOrder: string[];
    importOrderSeparation: boolean;
    experimentalBabelParserPluginsList: any[];
}
