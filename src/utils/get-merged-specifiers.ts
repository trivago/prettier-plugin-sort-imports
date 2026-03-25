import type { ImportDeclaration } from '@babel/types';

export function getMergedSpecifiers(nodes: ImportDeclaration[]) {
    // Combine import specifiers
    const merged = nodes.reduce<typeof nodes>((acc, node) => {
        if (node.specifiers.length === 0) {
            acc.push(node);
            return acc;
        }

        const exists = acc.find((n) => {
            return (
                n.source.value === node.source.value &&
                // ignore import if it's a namespace specifier
                n.specifiers[0]?.type !== 'ImportNamespaceSpecifier'
            );
        });
        if (exists) {
            exists.specifiers.push(...node.specifiers);
        } else {
            acc.push(node);
        }
        return acc;
    }, []);

    return merged;
}
