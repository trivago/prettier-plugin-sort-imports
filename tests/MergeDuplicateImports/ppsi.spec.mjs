run_spec(__dirname, ['typescript'], {
    importOrder: ['^@core/(.*)$', '^@server/(.*)$', '^@ui/(.*)$', '^[./]'],
    importOrderMergeDuplicateImports: true,
    importOrderSortSpecifiers: true,
    importOrderParserPlugins: ['typescript'],
});
