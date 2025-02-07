run_spec(__dirname, ['typescript'], {
    importOrder: [
        '^@core/(.*)$',
        '^@server/(.*)$',
        '^@ui/(.*)$',
        '<SEPARATOR>',
        '<THIRD_PARTY_MODULES>',
        '<SEPARATOR>',
        '^[./]',
    ],
    importOrderParserPlugins: ['typescript'],
});
