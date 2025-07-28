import { parseImportsExports } from 'parse-imports-exports';

import { PrettierOptions } from '../types';
import { preprocessor } from './preprocessor.js';

const sortImports = (code: string, options: PrettierOptions) => {
  const importsExports = parseImportsExports(code, { ignoreDynamicImports: true, ignoreRegexpLiterals: true, ignoreRequires: true, ignoreCommonJsExports: true });

  // console.log(importsExports);

  let justImports = '';

  for (let [path, info] of Object.entries({...importsExports.namedImports})) {
    console.log(path, info);
  }

  if (importsExports.defaultExport) {
    let  pos = importsExports.defaultExport;
    let text = code.slice(pos.start, pos.end);
    justImports += text;
  }

  for (let [path, info] of Object.entries(importsExports.namedImports)) {
    console.log(path, info);
  }

  return preprocessor(justImports, options);
};

export function emberPreprocessor(code: string, options: PrettierOptions) {
    return sortImports(code, options);
}
