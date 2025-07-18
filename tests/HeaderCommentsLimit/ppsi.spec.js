run_spec(__dirname, ["typescript"], {
    importOrder: ['^@core/(.*)$', '^@server/(.*)', '^@ui/(.*)$', '^[./]'],
    importOrderSeparation: false,
    importOrderSideEffects: false,
    importOrderParserPlugins: ['typescript'],
    importOrderImportAttributesKeyword: 'with',
    importOrderIgnoreHeaderComments: 1,
    importOrderIgnoreHeaderCommentTypes: 'CommentBlock',
});
