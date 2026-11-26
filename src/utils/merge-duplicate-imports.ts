import {
    ImportAttribute,
    ImportDeclaration,
    ImportDefaultSpecifier,
    ImportNamespaceSpecifier,
    ImportSpecifier,
    addComments,
} from '@babel/types';

type AnyImportSpecifier =
    | ImportSpecifier
    | ImportDefaultSpecifier
    | ImportNamespaceSpecifier;

/**
 * Merges import declarations that share the same module source within the
 * given list. Imports are merged only when combining them produces
 * syntactically valid code; in any ambiguous case the original declarations
 * are preserved untouched.
 *
 * Merge rules:
 *  - The module source (`from "..."`) must match.
 *  - Import attributes/assertions (`with { ... }` / `assert { ... }`) must match.
 *  - A namespace specifier (`* as N`) cannot coexist with named specifiers in
 *    the same declaration; such pairs are left unmerged.
 *  - Conflicting default specifiers with different local names are left unmerged.
 *  - When merging a `import type` declaration with a value declaration, named
 *    specifiers are promoted to specifier-level `type` (e.g. `{ type Foo }`).
 *    Type declarations carrying a default or namespace specifier are not
 *    merged with value declarations, since those specifier kinds cannot
 *    carry a specifier-level `type` modifier.
 *  - Side-effect-only imports (no specifiers) are absorbed into a matching
 *    declaration when one exists; otherwise they are kept as-is.
 *  - Duplicate specifiers (same imported and local name with the same type
 *    modifier) are deduplicated.
 *  - Leading comments from absorbed declarations are appended to the merged
 *    declaration so no user comment is silently dropped.
 */
export const mergeDuplicateImports = (
    nodes: ImportDeclaration[],
): ImportDeclaration[] => {
    const result: ImportDeclaration[] = [];
    const indexByKey = new Map<string, number>();

    for (const node of nodes) {
        const key = `${node.source.value}::${attributesFingerprint(node)}`;
        const existingIdx = indexByKey.get(key);

        if (existingIdx === undefined) {
            result.push(node);
            indexByKey.set(key, result.length - 1);
            continue;
        }

        const merged = tryMerge(result[existingIdx], node);
        if (merged === null) {
            // Keep both — leave the original as the "owner" of this key so
            // any subsequent declaration tries to merge into it first.
            result.push(node);
        } else {
            result[existingIdx] = merged;
        }
    }

    return result;
};

const tryMerge = (
    a: ImportDeclaration,
    b: ImportDeclaration,
): ImportDeclaration | null => {
    // Side-effect-only declarations have no specifiers and carry no useful
    // information beyond their existence — absorb into the other one.
    if (b.specifiers.length === 0) {
        return appendComments(a, b);
    }
    if (a.specifiers.length === 0) {
        return appendComments(b, a);
    }

    const aHasNamespace = a.specifiers.some(isNamespaceSpecifier);
    const bHasNamespace = b.specifiers.some(isNamespaceSpecifier);
    const aHasNamed = a.specifiers.some(isImportSpecifier);
    const bHasNamed = b.specifiers.some(isImportSpecifier);

    if ((aHasNamespace && bHasNamed) || (bHasNamespace && aHasNamed)) {
        return null;
    }

    const aDefault = a.specifiers.find(isDefaultSpecifier);
    const bDefault = b.specifiers.find(isDefaultSpecifier);
    if (aDefault && bDefault && aDefault.local.name !== bDefault.local.name) {
        return null;
    }

    // Two namespace imports from the same path with different locals can't
    // be combined into a single declaration.
    const aNamespace = a.specifiers.find(isNamespaceSpecifier);
    const bNamespace = b.specifiers.find(isNamespaceSpecifier);
    if (
        aNamespace &&
        bNamespace &&
        aNamespace.local.name !== bNamespace.local.name
    ) {
        return null;
    }

    const aKind = a.importKind ?? 'value';
    const bKind = b.importKind ?? 'value';
    const mixedKinds = aKind !== bKind;

    if (mixedKinds) {
        // To merge a type-only declaration into a value declaration each
        // specifier from the type side must support a specifier-level `type`
        // modifier — only `ImportSpecifier` does. Bail if the type side
        // carries a default or namespace specifier.
        const typeSide = aKind === 'type' ? a : b;
        if (typeSide.specifiers.some((s) => !isImportSpecifier(s))) {
            return null;
        }
    }

    const resultKind: 'type' | 'value' =
        aKind === 'type' && bKind === 'type' ? 'type' : 'value';

    const aSpecs =
        aKind === 'type' && resultKind === 'value'
            ? a.specifiers.map(promoteToTypeSpecifier)
            : a.specifiers;
    const bSpecs =
        bKind === 'type' && resultKind === 'value'
            ? b.specifiers.map(promoteToTypeSpecifier)
            : b.specifiers;

    const mergedSpecifiers = dedupeSpecifiers([...aSpecs, ...bSpecs]);

    const merged: ImportDeclaration = {
        ...a,
        specifiers: mergedSpecifiers,
        importKind: resultKind,
    };

    return appendComments(merged, b);
};

const isImportSpecifier = (s: AnyImportSpecifier): s is ImportSpecifier =>
    s.type === 'ImportSpecifier';

const isDefaultSpecifier = (
    s: AnyImportSpecifier,
): s is ImportDefaultSpecifier => s.type === 'ImportDefaultSpecifier';

const isNamespaceSpecifier = (
    s: AnyImportSpecifier,
): s is ImportNamespaceSpecifier => s.type === 'ImportNamespaceSpecifier';

const promoteToTypeSpecifier = (
    specifier: AnyImportSpecifier,
): AnyImportSpecifier => {
    if (!isImportSpecifier(specifier)) return specifier;
    if (specifier.importKind === 'type') return specifier;
    return { ...specifier, importKind: 'type' };
};

const dedupeSpecifiers = (
    specifiers: AnyImportSpecifier[],
): AnyImportSpecifier[] => {
    const seen = new Set<string>();
    const out: AnyImportSpecifier[] = [];
    for (const spec of specifiers) {
        const key = specifierKey(spec);
        if (seen.has(key)) continue;
        seen.add(key);
        out.push(spec);
    }
    return out;
};

const specifierKey = (spec: AnyImportSpecifier): string => {
    if (isDefaultSpecifier(spec)) {
        return `default::${spec.local.name}`;
    }
    if (isNamespaceSpecifier(spec)) {
        return `namespace::${spec.local.name}`;
    }
    const imported =
        spec.imported.type === 'Identifier'
            ? spec.imported.name
            : spec.imported.value;
    const kind = spec.importKind ?? 'value';
    return `named::${kind}::${imported}::${spec.local.name}`;
};

const attributesFingerprint = (node: ImportDeclaration): string => {
    const attrs = getAttributes(node);
    if (!attrs || attrs.length === 0) return '';
    const parts = attrs
        .map((attr) => {
            const keyName =
                attr.key.type === 'Identifier' ? attr.key.name : attr.key.value;
            return `${keyName}=${attr.value.value}`;
        })
        .sort();
    return parts.join('&');
};

const getAttributes = (
    node: ImportDeclaration,
): ImportAttribute[] | null | undefined => {
    if (node.attributes && node.attributes.length > 0) return node.attributes;
    // `assertions` is the legacy field for `assert { ... }` syntax. Both
    // shapes share the `ImportAttribute` node type.
    const assertions = (node as unknown as { assertions?: ImportAttribute[] })
        .assertions;
    return assertions;
};

const appendComments = (
    target: ImportDeclaration,
    source: ImportDeclaration,
): ImportDeclaration => {
    const leading = source.leadingComments;
    if (!leading || leading.length === 0) return target;
    addComments(target, 'leading', leading);
    return target;
};
