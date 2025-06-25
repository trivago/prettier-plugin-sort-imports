run_spec(__dirname, ['ember-template-tag'], {
    importOrder: ['^@core/(.*)$', '^@server/(.*)', '^@ui/(.*)$', '^[./]'],
    importOrderSeparation: true,
    importOrderParserPlugins : ['ember-template-tag'],
    plugins: ['prettier-plugin-ember-template-tag']
});
