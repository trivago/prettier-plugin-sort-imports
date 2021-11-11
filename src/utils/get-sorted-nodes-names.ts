import { ImportDeclaration } from '@babel/types';

export const getSortedNodesNames = (imports: ImportDeclaration[]) =>
    imports
        .filter((i) => i.type === 'ImportDeclaration')
        .map((i) => i.source.value); // TODO: get from specifier
