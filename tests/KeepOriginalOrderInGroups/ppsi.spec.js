run_spec(__dirname, ["typescript"], {
    importOrder: [
        "^\\.\\.",
        "^\\./"
    ],
    importOrderSeparation: true,
    experimentalBabelParserPluginsList : ["typescript"],
    keepOriginalOrderInGroups: true
});
