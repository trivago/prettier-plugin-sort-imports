import type { ImportDeclaration } from '@babel/types';

/**
 * This function merges the specifiers of import nodes that have the same source
 * into a single import declaration.
 * @param node All imports nodes that should be merged.
 */
export function getMergedSpecifiers(nodes: ImportDeclaration[]) {
    const merged = nodes.reduce<typeof nodes>((acc, node) => {
        if (node.specifiers.length === 0) {
            acc.push(node);
            return acc;
        }

        const nodeToMerge = acc.find(
            (n) =>
                n.source.value === node.source.value &&
                // ignore import if it's a namespace specifier
                n.specifiers[0]?.type !== 'ImportNamespaceSpecifier',
        );

        if (nodeToMerge) {
            nodeToMerge.specifiers.push(...node.specifiers);
        } else {
            acc.push(node);
        }

        return acc;
    }, []);

    return merged;
}
