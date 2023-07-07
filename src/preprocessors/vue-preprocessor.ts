import { PrettierOptions } from '../types';
import { preprocessor } from './preprocessor';

export function vuePreprocessor(code: string, options: PrettierOptions) {
    const { parse, transformRef } = require('@vue/compiler-sfc');

    const descriptor = transformRef
        // @vue/compiler-sfc 3.x
        ? parse(code).descriptor
        // @vue/compiler-sfc 2.7.x
        : parse({ source: code });

    const content = (descriptor.script ?? descriptor.scriptSetup)?.content;
    if (!content) {
        return code;
    }

    return code.replace(content, `\n${preprocessor(content, options)}\n`);
}
