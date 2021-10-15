run_spec(__dirname, ["typescript"], {
    importOrder: ['^@core/(.*)$', '^@server/(.*)', '^@ui/(.*)$', '^[./]'],
    importOrderSeparation: true,
    experimentalBabelParserPluginsList : ["[\"decorators\", { \"decoratorsBeforeExport\": true }]"]
});
