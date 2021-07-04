run_spec(__dirname, ['typescript'], {
    importOrder: [
        '^@core/(.*)$',
        '^@server/(.*)',
        '^@ui/(.*)$',
        '<3RD_PARTY>',
        '^[./]',
    ],
    importOrderSeparation: true,
    importOrderParserPlugins : ["typescript"]
});
