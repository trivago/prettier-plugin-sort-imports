import { PrettierOptions } from '../types';
import { preprocessor } from './preprocessor';

const { parsers } = require('prettier-plugin-svelte');
const scriptRegex =
    /<!--[^]*?-->|<script((?:\s+[^=>'"\/\s]+=(?:"[^"]*"|'[^']*'|[^>\s]+)|\s+[^=>'"\/\s]+)*\s*)>([^]*?)<\/script>/g;

export function sveltePreprocessor(code: string, options: PrettierOptions) {
    code = code.replace(scriptRegex, (match, attributes, content, index) => {
        if (match.startsWith('<!--')) {
            return match;
        }
        content = preprocessor(content, options);
        return `<script${attributes}>${content}</script>`;
    });
    return parsers.svelte.preprocess(code, options);
}
