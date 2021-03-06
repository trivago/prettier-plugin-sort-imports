import { expressionStatement, stringLiteral } from '@babel/types';

export const flow = 'flow';
export const babelFlow = 'babel-flow';
export const typescript = 'typescript';
export const decoratorsLegacy = 'decorators-legacy';
export const classProperties = 'classProperties';
export const jsx = 'jsx';

export const newLineCharacters = '\n\n';

const PRETTIER_PLUGIN_SORT_IMPORTS_NEW_LINE =
    'PRETTIER_PLUGIN_SORT_IMPORTS_NEW_LINE';

export const newLineNode = expressionStatement(
    stringLiteral(PRETTIER_PLUGIN_SORT_IMPORTS_NEW_LINE),
);
