import generate from '@babel/generator';
import { file, Statement, InterpreterDirective } from '@babel/types';

import { getAllCommentsFromNodes } from './get-all-comments-from-nodes';
import { removeNodesFromOriginalCode } from './remove-nodes-from-original-code';
import { newLineCharacters } from '../constants';

/**
 * This function generate a code string from the passed nodes.
 * @param nodes all imports
 * @param originalCode
 */
export const getCodeFromAst = (
    nodes: Statement[],
    originalCode: string,
    interpreter?: InterpreterDirective | null,
) => {
    const allCommentsFromImports = getAllCommentsFromNodes(nodes);

    const nodesToRemoveFromCode = [
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
        directives: [],
        sourceType: 'module',
        interpreter: interpreter,
        sourceFile: '',
        leadingComments: [],
        innerComments: [],
        trailingComments: [],
        start: 0,
        end: 0,
        loc: {
            start: { line: 0, column: 0 },
            end: { line: 0, column: 0 },
        },
    });

    const { code } = generate(newAST);

    return (
        code.replace(
            /"PRETTIER_PLUGIN_SORT_IMPORTS_NEW_LINE";/gi,
            newLineCharacters,
        ) + codeWithoutImportsAndInterpreter.trim()
    );
};
