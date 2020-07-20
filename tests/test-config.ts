import { Options } from 'prettier';

interface ModifiedOptions extends Options {
    importOrder: string[];
}

const config: ModifiedOptions = {
    parser: 'typescript',
    plugins: ['./src/index.ts'],
    importOrder: ['@core', '@server', '@ui', '.'],
    printWidth: 80,
    tabWidth: 4,
    trailingComma: 'all',
    singleQuote: true,
    jsxBracketSameLine: true,
    semi: true,
};

export default config;
