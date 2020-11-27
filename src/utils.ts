// we do not have types for javascript-natural-sort
//@ts-ignore
import naturalSort from 'javascript-natural-sort';
import { RequiredOptions } from 'prettier';
import generate from '@babel/generator';
import {
    ImportDeclaration,
    CommentLine,
    Node,
    File,
    file,
    addComments,
    removeComments,
    cloneNode,
} from '@babel/types';

export interface PrettierParserOptions extends RequiredOptions {
    importOrder: string[];
    importOrderSeparation: boolean;
}

/**
 * This function checks that specified string exists in the specified list.
 */
const isSimilarTextExistInArray = (arr: string[], text: string) =>
    arr.some((element) => text.match(new RegExp(element)) !== null);

/**
 * This function returns all the nodes which are in the importOrder array.
 * The plugin considered these import nodes as local import declarations.
 */
export const getSortedNodesByImportOrder = (
    nodes: ImportDeclaration[],
    order: PrettierParserOptions['importOrder'],
) => {
    const firstNodesComment = nodes[0].leadingComments;

    const sorted = order.reduce(
        (res: ImportDeclaration[], val): ImportDeclaration[] => {
            const x = nodes.filter(
                (node) => node.source.value.match(new RegExp(val)) !== null,
            );
            if (x.length > 0) {
                x.sort((a, b) => naturalSort(a.source.value, b.source.value));
                return [...res, ...x];
            }
            return res;
        },
        [],
    );

    const copy = sorted.map(iD => cloneNode(iD));

    sorted.forEach(removeComments);

    if (firstNodesComment) {
        addComments(sorted[0], 'leading', firstNodesComment);
    }

    // comments in-between the imports
    sorted.forEach((iD, index) => {
        // @ts-ignore
        addComments(iD, 'leading', copy[index].leadingComments)
    })

    return sorted;
};

/**
 * This function returns all the nodes which are not in the importOrder array.
 * The plugin considered these import nodes as third party import declarations.
 */
export const getSortedNodesNotInTheImportOrder = (
    nodes: ImportDeclaration[],
    order: PrettierParserOptions['importOrder'],
) => {
    const x = nodes.filter(
        (node) => !isSimilarTextExistInArray(order, node.source.value),
    );
    x.sort((a, b) => naturalSort(a.source.value, b.source.value));
    return x;
};

/**
 * When we get all the imports from the code, we remove these import statements
 * from the original code which is passed to prettier preprocessor.
 */
export const removeImportsFromOriginalCode = (
    code: string,
    nodes: ImportDeclaration[],
) => {
    let text = code;
    for (const node of nodes) {
        const start = Number(node.start);
        const end = Number(node.end);

        if (Number.isSafeInteger(start) && Number.isSafeInteger(end)) {
            text = text.replace(code.substring(start, end), '');
        }

        if (node.leadingComments) {
            for (const lc of node.leadingComments) {
                // console.log({lc, node});
                text = text.replace(
                    code.substring(lc.loc.start.line, lc.loc.end.line),
                    '',
                );
            }
        }
    }
    return text;
};

/**
 * This function generate a code string from the passed nodes.
 */
export const getCodeFromAst = (nodes: ImportDeclaration[], ast: File) => {
    // let x: ImportDeclaration[] = [...nodes];

    // for (let i = 0; i < x.length; i++) {
    //     x = nodes;
    //     if (x[i].trailingComments) {
    //         x[i] = {
    //             ...x[i],
    //             trailingComments: null,
    //         };
    //     }

    //     if (x[i].leadingComments) {
    //         x[i] = {
    //             ...x[i],
    //             // @ts-ignore
    //             leadingComments: x[i].leadingComments?.filter((comment) =>
    //                 comment.value.startsWith(' eslint'),
    //             ),
    //         };
    //     }

    //     if (
    //         x[i].leadingComments &&
    //         x[i].loc?.start.line === importNodes[0].loc?.start.line
    //     ) {
    //         x[i] = {
    //             ...x[i],
    //             leadingComments: null,
    //         };
    //     }
    // }

    // const x = [...nodes, ast.program.body];

    // const x = restOfCode.concat(nodes);

    // console.log(restOfCode);

    const ast2 = file({
        type: 'Program',
        // @ts-ignore
        body: nodes.concat(ast.program.body),
        directives: [],
        sourceType: 'module',
        interpreter: null,
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

    return generate(ast2).code;
};

export const handleImportSeparation = (isNewLine: boolean) =>
    isNewLine ? '\n\n' : '';

export const getNewLine = () => '\n';

/**
 * This function stitches all the imports together. If import separation is
 * enabled then this function adds new line accordingly.
 */
export const getAllGeneratedImportCodeTogether = (
    thirdPartyImportsAsCode: string,
    localImportsAsCode: string,
    importOrderSeparation: boolean,
) => {
    if (thirdPartyImportsAsCode.length > 0) {
        return `${thirdPartyImportsAsCode}${handleImportSeparation(
            importOrderSeparation,
        )}${localImportsAsCode}${handleImportSeparation(
            importOrderSeparation,
        )}${getNewLine()}`;
    }

    return `${localImportsAsCode}${handleImportSeparation(
        importOrderSeparation,
    )}${getNewLine()}`;
};
