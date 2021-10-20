run_spec(__dirname, ['typescript'], {
    importOrder: ['^@core/(.*)$', '^@server/(.*)', '^@ui/(.*)$', '^[./]'],
    experimentalBabelParserPluginsList: ['typescript']
});
