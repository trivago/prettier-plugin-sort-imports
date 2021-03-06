import { BuiltInParserName, CustomParser } from 'prettier';
import {
    flow,
    babelFlow,
    typescript,
    decoratorsLegacy,
    classProperties,
    jsx,
} from '../constants';

export const getParserPlugins = (
    prettierParser: BuiltInParserName | CustomParser,
) => {
    const isFlow = prettierParser === flow || prettierParser === babelFlow;
    const isTypescript = prettierParser === typescript;

    const tsPlugins = [typescript, jsx, decoratorsLegacy, classProperties];

    return [isFlow && flow, ...(isTypescript ? tsPlugins : [])].filter(
        Boolean,
    );
};
