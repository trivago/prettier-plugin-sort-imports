import { format } from 'prettier';
import { expect, test } from 'vitest';

import { assembleUpdatedCode } from '../assemble-updated-code';
import { getAllCommentsFromNodes } from '../get-all-comments-from-nodes';
import { getImportNodes } from '../get-import-nodes';
import { getSortedNodes } from '../get-sorted-nodes';

const code = `"use strict";
// first comment
// second comment
import z from 'z';
import c from 'c';
import g from 'g';
import t from 't';
import k from 'k';
// import a from 'a';
  // import a from 'a';
import a from 'a';
`;

test('it should remove nodes from the original code', async () => {
    const importNodes = getImportNodes(code);
    const sortedNodes = getSortedNodes(importNodes, {
        importOrder: [],
        importOrderCaseInsensitive: false,
        importOrderSeparation: false,
        importOrderGroupNamespaceSpecifiers: false,
        importOrderSortSpecifiers: false,
        importOrderSideEffects: true,
        importOrderSortByLength: null,
    });
    const allCommentsFromImports = getAllCommentsFromNodes(sortedNodes);

    const commentAndImportsToRemoveFromCode = [
        ...sortedNodes,
        ...allCommentsFromImports,
    ];
    const codeWithoutImportDeclarations = assembleUpdatedCode(
        code,
        commentAndImportsToRemoveFromCode,
    );
    const result = await format(codeWithoutImportDeclarations, {
        parser: 'babel',
    });
    expect(result).toEqual(`"use strict";
`);
});

test('it should inject the generated code at the correct location', async () => {
    const importNodes = getImportNodes(code);
    const sortedNodes = getSortedNodes(importNodes, {
        importOrder: [],
        importOrderCaseInsensitive: false,
        importOrderSeparation: false,
        importOrderGroupNamespaceSpecifiers: false,
        importOrderSortSpecifiers: false,
        importOrderSideEffects: true,
        importOrderSortByLength: null,
    });
    const allCommentsFromImports = getAllCommentsFromNodes(sortedNodes);

    const commentAndImportsToRemoveFromCode = [
        ...sortedNodes,
        ...allCommentsFromImports,
    ];
    const codeWithoutImportDeclarations = assembleUpdatedCode(
        code,
        commentAndImportsToRemoveFromCode,
        `import generated from "generated";`,
        '"use strict";'.length,
    );
    const result = await format(codeWithoutImportDeclarations, {
        parser: 'babel',
    });
    expect(result).toEqual(`"use strict";
import generated from "generated";
`);
});
