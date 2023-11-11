import { PrettierOptions } from '../types';
import { preprocessor } from './preprocessor';

export function vuePreprocessor(code: string, options: PrettierOptions) {
    const { parse } = require('@vue/compiler-sfc');
    const { descriptor } = parse(code);

    const content = (descriptor.script ?? descriptor.scriptSetup)?.content;
    if (!content) {
        return code;
    }
    const replacement = preprocessor(content, options).replace(/\$/g, '$$$$');
    return code.replace(content, `\n${replacement}\n`);
}
