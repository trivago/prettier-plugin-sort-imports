run_spec(__dirname, ['typescript'], {
    importOrder: ['^[./]'],
    importOrderParserPlugins: ['typescript'],
    importOrderBuiltinModulesToTop: false
});