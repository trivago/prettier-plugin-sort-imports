import { ParserPlugin } from '@babel/parser';
import { RequiredOptions } from 'prettier';
import {
    flow,
    typescript,
    decoratorsLegacy,
    classProperties,
    jsx,
} from '../constants';

/**
 * Returns a list of babel parser plugin names
 * @param prettierParser name of the parser recognized by prettier
 * @returns list of parser plugins to be passed to babel parser
 */
export const getParserPlugins = (
    prettierParser: RequiredOptions['parser'],
): ParserPlugin[] => {
    const isFlow = prettierParser === flow;
    const isTypescript = prettierParser === typescript;

    // In case of typescript as prettier parser, we pass the following
    // decoratorsLegacy, classProperties are passed in case of angular
    // projects.
    const tsPlugins = [typescript, jsx, decoratorsLegacy, classProperties];

    return [...(isFlow ? [flow] : []), ...(isTypescript ? tsPlugins : [])];
};
