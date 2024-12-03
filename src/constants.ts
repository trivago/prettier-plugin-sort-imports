import { ParserPlugin } from '@babel/parser';
import { expressionStatement, stringLiteral } from '@babel/types';

export const flow: ParserPlugin = 'flow';
export const typescript: ParserPlugin = 'typescript';
export const jsx: ParserPlugin = 'jsx';

export const newLineCharacters = '\n\n';

export const sortImportsIgnoredComment = 'sort-imports-ignore';

/*
 * Used to mark the position between RegExps,
 * where the not matched imports should be placed
 */
export const THIRD_PARTY_MODULES_SPECIAL_WORD = '<THIRD_PARTY_MODULES>';
export const SEPARATOR_SPECIAL_WORD = '<SEPARATOR>';

const PRETTIER_PLUGIN_SORT_IMPORTS_NEW_LINE =
    'PRETTIER_PLUGIN_SORT_IMPORTS_NEW_LINE';

export const newLineNode = expressionStatement(
    stringLiteral(PRETTIER_PLUGIN_SORT_IMPORTS_NEW_LINE),
);
