import {
    ImportDefaultSpecifier,
    ImportNamespaceSpecifier,
    ImportSpecifier,
} from '@babel/types';

export const getSortedNodesModulesNames = (
    modules: (
        | ImportSpecifier
        | ImportDefaultSpecifier
        | ImportNamespaceSpecifier
    )[],
) =>
    modules
        .filter((m) =>
            [
                'ImportSpecifier',
                'ImportDefaultSpecifier',
                'ImportNamespaceSpecifier',
            ].includes(m.type),
        )
        .map((m) => m.local.name); // TODO: get from specifier
