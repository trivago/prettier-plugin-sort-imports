run_spec(__dirname, ["typescript"], {
    importOrder: ['^@core/(.*)$', '^@server/(.*)', '^@ui/(.*)$', '^[./]'],
    importOrderSeparation: true,
    importOrderParserPlugins : ["classProperties", "[\"decorators\", { \"decoratorsBeforeExport\": true }]"]
});
