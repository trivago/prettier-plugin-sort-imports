import { PrettierOptions } from '../types';
import { preprocessor } from './preprocessor';

export function vuePreprocessor(code: string, options: PrettierOptions) {
    const { parse } = require('@vue/compiler-sfc');
    const { descriptor } = parse(code);

    const content = (descriptor.script ?? descriptor.scriptSetup)?.content;
    if (!content) {
        return code;
    }

    // 'replacer' is a function so it returns the preprocessed code as-is.
    // If it were passed as just a string and the string contained special groups (like $&, $`, $', $n, $<n>, etc.) this would produce invalid results
    const replacer =  () => `\n${preprocessor(content, options)}\n`;

    return code.replace(content, replacer);
}
