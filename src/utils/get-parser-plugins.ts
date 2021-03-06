import { BuiltInParserName, CustomParser } from 'prettier';

export const getParserPlugins = (
    prettierParser: BuiltInParserName | CustomParser,
) => {
    const isFlow = prettierParser === 'flow' || prettierParser === 'babel-flow';
    const isTypescript = prettierParser === 'typescript';

    const tsPlugins = [
        'typescript',
        'jsx',
        'decorators-legacy',
        'classProperties',
    ];

    return [isFlow && 'flow', ...(isTypescript ? tsPlugins : [])].filter(
        Boolean,
    );
};
