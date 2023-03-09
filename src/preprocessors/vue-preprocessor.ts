import type { SFCBlock, SFCDescriptor } from '@vue/compiler-sfc';

import { PrettierOptions } from '../types';
import { preprocessor } from './preprocessor';

export function vuePreprocessor(code: string, options: PrettierOptions) {
    const { parse } = require('@vue/compiler-sfc');
    const descriptor: SFCDescriptor = parse(code).descriptor;

    // 1. filter valid blocks
    const blocks = [descriptor.script, descriptor.scriptSetup].filter(
        (block) => block?.content,
    ) as SFCBlock[];
    if (!blocks.length) {
        return code;
    }

    // 2. sort blocks by start position
    blocks.sort((a, b) => a.loc.start.offset - b.loc.start.offset);

    // 3. replace blocks
    // Using offsets to avoid string replace catching the wrong place and improve efficiency
    let offset = 0;
    let result = '';
    for (const block of blocks) {
        // https://github.com/vuejs/core/blob/9060bf0353e88cc1f4cf06981b9799c5c1e09466/packages/compiler-core/src/ast.ts#L71
        // The node's range. The `start` is inclusive and `end` is exclusive.
        // [start, end)
        const { start, end } = block.loc;
        const trasnformed = `\n${preprocessor(block.content, options)}\n`;
        result += code.slice(offset, start.offset) + trasnformed;
        offset = end.offset;
    }

    // 4. append the rest
    result += code.slice(offset);

    return result;
}
