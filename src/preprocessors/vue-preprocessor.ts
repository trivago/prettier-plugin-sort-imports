let vueCompilerSfc: typeof import('@vue/compiler-sfc') | undefined;

try {
    vueCompilerSfc = await import('@vue/compiler-sfc');
} catch {
    // Do not error because the dependency is optional.
}

import { PrettierOptions } from '../types';
import { preprocessor } from './preprocessor.js';

export function vuePreprocessor(code: string, options: PrettierOptions) {
    if (!vueCompilerSfc) {
        throw new Error(
        "Missing peer dependency '@vue/compiler-sfc'. Please install it to use the vue parser.",
        );
    }

    const { parse } = vueCompilerSfc;
    const { descriptor } = parse(code);

    const scriptContent = descriptor.script?.content;
    const scriptSetupContent = descriptor.scriptSetup?.content;

    if (!scriptContent && !scriptSetupContent) {
        return code;
    }

    let transformedCode = code;

    const replacer = (content: string) => {
        // we pass the second argument as a function to avoid issues with the replacement string
        // if string contained special groups (like $&, $`, $', $n, $<n>, etc.) this would produce invalid results
        return transformedCode.replace(
            content,
            () => `\n${preprocessor(content, options)}\n`,
        );
    };

    if (scriptContent) {
        transformedCode = replacer(scriptContent);
    }

    if (scriptSetupContent) {
        transformedCode = replacer(scriptSetupContent);
    }

    return transformedCode;
}
