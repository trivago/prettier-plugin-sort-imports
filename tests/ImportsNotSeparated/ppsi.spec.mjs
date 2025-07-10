run_spec(__dirname, ['typescript'], {
    importOrder: ['^@core/(.*)$', '^@server/(.*)', '^@ui/(.*)$', '^[./]'],
    importOrderParserPlugins: ['typescript']
});
