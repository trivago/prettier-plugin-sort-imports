run_spec(__dirname, ['typescript'], {
    importOrder: ['<BUILTIN_MODULES>', '<THIRD_PARTY_MODULES>', '^[./]'],
    importOrderParserPlugins: ['typescript'],
    importOrderBuiltinModulesToTop: true
});