import { parse } from '@vue/compiler-sfc';

import { PrettierOptions } from '../types';
import { preprocessor } from './preprocessor';

export function vuePreprocessor(code: string, options: PrettierOptions) {
    const { descriptor } = parse(code);
    const content =
        (descriptor.script ?? descriptor.scriptSetup)?.content ?? code;

    return code.replace(content, `\n${preprocessor(content, options)}\n`);
}
