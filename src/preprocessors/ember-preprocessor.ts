import { PrettierOptions } from '../types';
import { preprocessor } from './preprocessor';

export function emberPreprocessor(code: string, options: PrettierOptions) {
    const sorted = preprocessor(code, options);

    const prettierPluginEmberTemplateTag = require('prettier-plugin-ember-template-tag');
    return prettierPluginEmberTemplateTag.parsers['ember-template-tag'].preprocess(sorted, options);
}
