run_spec(__dirname, ["typescript"], {
    importOrder: ['^@core/(.*)$', '^@server/(.*)', '^@ui/(.*)$', '^[./]'],
    importOrderSeparation: true,
    experimentalBabelParserPluginsList: ['typescript', 'decorators-legacy', 'classProperties']
});
