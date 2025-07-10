import { PrettierOptions } from '../types';
import { preprocessor } from './preprocessor.js';

export function vuePreprocessor(code: string, options: PrettierOptions) {
    const { parse } = require('@vue/compiler-sfc');
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
