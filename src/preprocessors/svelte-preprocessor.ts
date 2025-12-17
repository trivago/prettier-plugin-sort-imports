import { PrettierOptions } from '../types';
import { preprocessor } from './preprocessor.js';

let prettierPluginSvelte: typeof import('prettier-plugin-svelte') | undefined;
let svelteCompiler: typeof import('svelte/compiler') | undefined;

try {
    prettierPluginSvelte = await import('prettier-plugin-svelte');
    svelteCompiler = await import('svelte/compiler');
} catch {
    // Do not error because the dependency is optional.
}

const booleanGuard = <T>(value: T | undefined): value is T => Boolean(value);

const sortImports = (code: string, options: PrettierOptions) => {
    if (!svelteCompiler) {
        throw new Error(
            "Missing peer dependency 'svelte/compiler'. Please install it to use the svelte parser.",
        );
    }

    const { parse } = svelteCompiler;
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

    if (!prettierPluginSvelte) {
        throw new Error(
            "Missing peer dependency 'prettier-plugin-svelte'. Please install it to use the svelte parser.",
        );
    }
    // @ts-expect-error TODO: Fix this type error
    return prettierPluginSvelte.parsers.svelte.preprocess(sorted, options);
}
