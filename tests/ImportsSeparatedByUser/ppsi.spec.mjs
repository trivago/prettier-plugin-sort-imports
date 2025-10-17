run_spec(__dirname, ["typescript"], {
    importOrder: ['^@core/(.*)$', '^@server/(.*)', '<SEPARATOR>', '^@ui/(.*)$', '^[./]'],
    importOrderSeparation: true,
    importOrderParserPlugins: ['typescript']
});
