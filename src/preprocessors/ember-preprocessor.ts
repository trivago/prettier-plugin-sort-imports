import { parseImportsExports } from 'parse-imports-exports';

import { PrettierOptions } from '../types';
import { preprocessor } from './preprocessor.js';

const sortImports = (code: string, options: PrettierOptions) => {
    const importsExports = parseImportsExports(code, {
        ignoreDynamicImports: true,
        ignoreRegexpLiterals: true,
        ignoreRequires: true,
        ignoreCommonJsExports: true,
    });

    let justImports = '';

    for (let [, info] of Object.entries({
        ...importsExports.namedImports,
    })) {
        let pos = info[0];
        justImports += code.slice(pos.start, pos.end + 1);

        let spaces = '';
        for (let i = 0; i < pos.end - pos.start; i++) {
            spaces += ' ';
        }

        code = replaceAt(code, pos.start, spaces);
    }

    let output = preprocessor(justImports, options);
    let result = output + code;

    return result;
};

export function emberPreprocessor(code: string, options: PrettierOptions) {
    return sortImports(code, options);
}
function replaceAt(str: string, index: number, replacement: string) {
    return (
        str.substring(0, index) +
        replacement +
        str.substring(index + replacement.length)
    );
}
