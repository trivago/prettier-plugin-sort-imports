const { parsers: typescriptParsers } = require('prettier/parser-typescript');

const traverse = require('@babel/traverse').default;
const generate = require('@babel/generator').default;
const parser = require('@babel/parser').parse;
const t = require('@babel/types');

const { naturalSort } = require('./natural-sort');

function preprocess(text, options) {
    let importsStart = 0;

    let textToRemove = [];

    const order = options.importOrder;

    const isAnOrderedDependency = (s) => order.some((k) => s.startsWith(k));

    const ast = parser(text, {
        sourceType: 'module',
        plugins: ['typescript', 'jsx'],
    });

    debugger;

    traverse(ast, {
        Program(path) {
            debugger;

            const importDeclarations = path
                .get('body')
                // replace with t.isImportDeclaration
                .filter((p) => t.isImportDeclaration(p.node))
                .map((n) => n.node);

            // const gettingExportPlacedBetweenImports = path
            //     .get('body')
            //     .filter((p) => t.isExportDeclaration(p.node))
            //     .filter((p) => t.isImportDeclaration(p.getNextSibling()) ||  t.isExportDeclaration(p.getNextSibling()))
            //     .map((n) => n.node);

            debugger;




            textToRemove = importDeclarations.map((k) => [k.start, k.end]);

            if(importDeclarations.length > 0){
                importsStart =
                    importDeclarations[0].start;
            }

            debugger;

            const getSortedOrderedImports = order.reduce((res, val, key) => {
                const x = importDeclarations.filter((node) =>
                    node.source.value.startsWith(val),
                );

                return res.concat(x);
            }, []);

            const getSortedUnOrderedImports = importDeclarations.filter(
                (node) => !isAnOrderedDependency(node.source.value),
            );

            // We remove comments
            path.traverse({
                enter(path) {
                    // debugger;
                    t.removeComments(path.node);
                },
            });

            path.container.program.body = [
                ...getSortedUnOrderedImports,
                ...getSortedOrderedImports,
            ];
        },
    });

    debugger;

    // if (importsEnd > 0) {
    //     return `${generate(ast).code}${text.substring(importsEnd + 1)}`;
    // }

    let mtext = text;

    function remove(str, end) {
        return str.substring(end).trim();
    }

    for (const value of textToRemove) {
        mtext = mtext.replace(text.substring(value[0],value[1]),'');
    }

    const mmtext = mtext.trim();
    const newModifiedCode = generate(ast).code;

    debugger;

    return `${mmtext.substring(0,importsStart)}${newModifiedCode}${mmtext.substring(importsStart)}`;
}

const options = {
    importOrder: {
        type: 'path',
        category: 'Global',
        array: true,
        default: [{ value: [] }],
        description: 'Provide an order to sort imports.',
    },
};

module.exports = {
    parsers: {
        typescript: {
            ...typescriptParsers.typescript,
            preprocess,
        },
    },
    options,
};
