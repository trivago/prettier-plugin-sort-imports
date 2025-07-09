import { PrettierOptions } from '../types';
import { preprocessor } from './preprocessor';

export function defaultPreprocessor(code: string, options: PrettierOptions) {
    for (const extension of ['gjs', 'gts', 'svelte', 'vue']) {
        if (options.filepath?.endsWith(`.${extension}`)) return code;
    }
    return preprocessor(code, options);
}
