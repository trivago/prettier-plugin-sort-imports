import generate from '@babel/generator';
import { Directive, InterpreterDirective, Statement, file } from '@babel/types';

import { newLineCharacters } from '../constants';
import { getAllCommentsFromNodes } from './get-all-comments-from-nodes';
import { removeNodesFromOriginalCode } from './remove-nodes-from-original-code';

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
