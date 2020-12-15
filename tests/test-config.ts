import { Options, BuiltInParserName } from 'prettier';

interface ModifiedOptions extends Options {
    importOrder: string[];
    importOrderSeparation?: boolean;
}

const config: ModifiedOptions = {
    parser: 'typescript',
    plugins: ['./src/index.ts'],
    importOrder: ['^@core/(.*)$', '^@server/(.*)', '^@ui/(.*)$', '^[./]'],
    printWidth: 80,
    tabWidth: 4,
    trailingComma: 'all',
    singleQuote: true,
    jsxBracketSameLine: true,
    semi: true,
};

export const configWithSeparation: ModifiedOptions = {
    ...config,
    importOrderSeparation: true,
};

export const getConfigWithParser = (parserName: BuiltInParserName) => ({
    ...config,
    importOrderSeparation: true,
    parser: parserName,
});

export default config;
