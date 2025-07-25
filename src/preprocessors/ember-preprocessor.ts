import { PrettierOptions } from '../types';
import { preprocessor } from './preprocessor.js';

// @ts-expect-error
let prettierPluginEmberTemplateTag;

try {
    emberPreprocessor = await import(
        // @ts-expect-error
        'prettier-plugin-ember-template-tag/dist/'
    );
} catch {
    // Do not error because the dependency is optional.
}

const booleanGuard = <T>(value: T | undefined): value is T => Boolean(value);

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
    const ast = parsers['ember-template-tag'].parse(code, options);
    
    
};

export function emberPreprocessor(code: string, options: PrettierOptions) {
    return sortImports(code, options);
}
