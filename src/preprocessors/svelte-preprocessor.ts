import { PrettierOptions } from '../types';
import { preprocessor } from './preprocessor';

const booleanGuard = <T>(value: T | undefined): value is T => Boolean(value);

const sortImports = (code: string, options: PrettierOptions) => {
    const { parse } = require('svelte/compiler.cjs');
    const { instance, module } = parse(code);
    const sources = [instance, module].filter(booleanGuard);
    if (!sources.length) return code;
    return sources.reduce((code, source) => {
        const snippet = code.slice(source.content.start, source.content.end);
        const preprocessed = preprocessor(snippet, options);
        const result = code.replace(snippet, `\n${preprocessed}\n`);
        return result;
    }, code);
};

export function sveltePreprocessor(code: string, options: PrettierOptions) {
    const sorted = sortImports(code, options);

    const prettierPluginSvelte = require('prettier-plugin-svelte');
    return prettierPluginSvelte.parsers.svelte.preprocess(sorted, options);
}
