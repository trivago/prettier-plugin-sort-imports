import generateModule from '@babel/generator';
import { Statement, file } from '@babel/types';

import { newLineCharacters } from '../constants.js';
import { PrettierOptions } from '../types';
import { assembleUpdatedCode } from './assemble-updated-code.js';
import { getAllCommentsFromNodes } from './get-all-comments-from-nodes.js';

const generate = (generateModule as any).default || generateModule;

/**
 * This function generate a code string from the passed nodes.
 * @param nodes the imports to be emitted in their final order
 * @param originalCode the source file's full text
 * @param injectIdx the offset at which the generated imports are injected
 * @param options generator options
 * @param originalNodes the imports as they appear in `originalCode`; when
 *   provided, these (rather than `nodes`) are used to determine which
 *   ranges must be removed from the original source. This is required
 *   when `nodes` was derived from `originalNodes` via a transformation
 *   that drops or merges nodes (so that absorbed declarations no longer
 *   appear in `nodes` but still need to be removed from the source).
 */
export const getCodeFromAst = (
    nodes: Statement[],
    originalCode: string,
    injectIdx: number = 0,
    options?: Pick<PrettierOptions, 'importOrderImportAttributesKeyword'>,
    originalNodes?: Statement[],
) => {
    const nodesForRemoval = originalNodes ?? nodes;
    const allCommentsFromImports = getAllCommentsFromNodes(nodesForRemoval);

    const nodesToRemoveFromCode = [
        ...nodesForRemoval,
        ...allCommentsFromImports,
    ];

    const newAST = file({
        type: 'Program',
        body: nodes,
        directives: [],
        sourceType: 'module',
        leadingComments: [],
        innerComments: [],
        trailingComments: [],
        start: 0,
        end: 0,
        loc: {
            filename: '',
            identifierName: '',
            start: { line: 0, column: 0, index: 0 },
            end: { line: 0, column: 0, index: 0 },
        },
    });

    const { code } = generate(newAST, {
        importAttributesKeyword: options?.importOrderImportAttributesKeyword,
    });

    return assembleUpdatedCode(
        originalCode,
        nodesToRemoveFromCode,
        code.replace(
            /"PRETTIER_PLUGIN_SORT_IMPORTS_NEW_LINE";/gi,
            newLineCharacters,
        ),
        injectIdx,
    );
};
