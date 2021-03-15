import { Options } from 'prettier';

import { PrettierOptions } from '../src/types';

export interface ModifiedOptions extends Partial<PrettierOptions> {}

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
