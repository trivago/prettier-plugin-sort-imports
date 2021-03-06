import { ParserPlugin } from '@babel/parser';
import { BuiltInParserName, CustomParser } from 'prettier';
import {
    flow,
    typescript,
    decoratorsLegacy,
    classProperties,
    jsx,
} from '../constants';

export const getParserPlugins = (
    prettierParser: BuiltInParserName | CustomParser,
): ParserPlugin[] => {
    const isFlow = prettierParser === flow;
    const isTypescript = prettierParser === typescript;

    const tsPlugins = [typescript, jsx, decoratorsLegacy, classProperties];

    return [...(isFlow ? [flow] : []), ...(isTypescript ? tsPlugins : [])];
};
