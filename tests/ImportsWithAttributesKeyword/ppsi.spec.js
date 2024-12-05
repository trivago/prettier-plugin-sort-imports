run_spec(__dirname, ["typescript"], {
    importOrder: ['^@core/(.*)$', '^@server/(.*)', '^@ui/(.*)$', '^[./]'],
    importOrderSeparation: false,
    importOrderSideEffects: false,
    importOrderParserPlugins: ['typescript'],
    importOrderImportAttributesKeyword: 'with',
});
