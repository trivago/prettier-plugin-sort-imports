import { Options } from 'prettier';

export interface ModifiedOptions extends Options {
    importOrder: string[];
    importOrderSeparation?: boolean;
    experimentalBabelParserPluginsList?: any[];
}

export const config: ModifiedOptions = {
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

export const getConfigWithOptions = (options: ModifiedOptions) => ({
    ...config,
    ...options,
});
