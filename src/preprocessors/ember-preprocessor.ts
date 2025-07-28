import { PrettierOptions } from '../types';
import { preprocessor } from './preprocessor.js';

// @ts-expect-error
let prettierPluginEmberTemplateTag;

try {
    prettierPluginEmberTemplateTag = await import(
        // @ts-expect-error
        'prettier-plugin-ember-template-tag'
    );
} catch {
    // Do not error because the dependency is optional.
}

const sortImports = (code: string, options: PrettierOptions) => {
    // @ts-expect-error
    if (!prettierPluginEmberTemplateTag) {
        throw new Error(
            "Missing peer dependency 'prettier-plugin-ember-template-tag'. Please install it to use the ember-template-tag parser.",
        );
    }

    const { parsers } = (prettierPluginEmberTemplateTag.default ||
        prettierPluginEmberTemplateTag) as {
        parsers: { 'ember-template-tag': any };
    };

    const emberPreprocessedCode = parsers['ember-template-tag'].preprocess(
        code,
        options,
    );

    return preprocessor(emberPreprocessedCode, options);
};

export function emberPreprocessor(code: string, options: PrettierOptions) {
    return sortImports(code, options);
}
