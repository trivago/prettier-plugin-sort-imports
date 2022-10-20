import { PrettierOptions } from '../types';
import { preprocessor } from './preprocessor';

export function defaultPreprocessor(code: string, options: PrettierOptions) {
    if (options.filepath?.endsWith('.vue')) return code;
    return preprocessor(code, options);
}
