run_spec(__dirname, ["typescript"], {
    importOrder: ['^@core/(.*)$', '^@server/(.*)', '^@ui/(.*)$', '<SEPARATOR>', '^[./]'],
    importOrderSeparation: false,
    importOrderParserPlugins : ['typescript', 'decorators-legacy', 'classProperties']
});
