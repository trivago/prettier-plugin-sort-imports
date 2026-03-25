import generateModule from '@babel/generator';
import { Statement, file } from '@babel/types';

import { newLineCharacters } from '../constants.js';
import { PrettierOptions } from '../types';
import { assembleUpdatedCode } from './assemble-updated-code.js';
import { getAllCommentsFromNodes } from './get-all-comments-from-nodes.js';

const generate = (generateModule as any).default || generateModule;

/**
 * This function generate a code string from the passed nodes.
 * @param originalNodes all imports
 * @param originalCode
 */
export const getCodeFromAst = (
    originalNodes: Statement[],
    originalCode: string,
    nodesToInject: Statement[],
    injectIdx: number = 0,
    options?: Pick<PrettierOptions, 'importOrderImportAttributesKeyword'>,
) => {
    const allCommentsFromImports = getAllCommentsFromNodes(originalNodes);

    const nodesToRemoveFromCode = [...originalNodes, ...allCommentsFromImports];

    const newAST = file({
        type: 'Program',
        body: nodesToInject,
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
