import generateModule from '@babel/generator';
import { Directive, InterpreterDirective, Statement, file } from '@babel/types';

import { newLineCharacters } from '../constants.js';
import { getAllCommentsFromNodes } from './get-all-comments-from-nodes.js';
import { removeNodesFromOriginalCode } from './remove-nodes-from-original-code.js';
import { PrettierOptions } from '../types';

const generate = (generateModule as any).default || generateModule;

/**
 * This function generate a code string from the passed nodes.
 * @param nodes all imports
 * @param originalCode
 */
export const getCodeFromAst = (
    nodes: Statement[],
    directives: Directive[],
    originalCode: string,
    interpreter?: InterpreterDirective | null,
    options?: Pick<PrettierOptions, 'importOrderImportAttributesKeyword'>
) => {
    const allCommentsFromImports = getAllCommentsFromNodes(nodes);

    const nodesToRemoveFromCode = [
        ...directives,
        ...nodes,
        ...allCommentsFromImports,
        ...(interpreter ? [interpreter] : []),
    ];

    const codeWithoutImportsAndInterpreter = removeNodesFromOriginalCode(
        originalCode,
        nodesToRemoveFromCode,
    );

    const newAST = file({
        type: 'Program',
        body: nodes,
        directives,
        sourceType: 'module',
        interpreter: interpreter,
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

    const { code } = generate(newAST, { importAttributesKeyword: options?.importOrderImportAttributesKeyword });

    return (
        code.replace(
            /"PRETTIER_PLUGIN_SORT_IMPORTS_NEW_LINE";/gi,
            newLineCharacters,
        ) + codeWithoutImportsAndInterpreter.trim()
    );
};
