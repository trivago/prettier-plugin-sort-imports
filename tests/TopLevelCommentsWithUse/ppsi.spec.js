run_spec(__dirname, ['typescript'], {
  importOrderParserPlugins: ['typescript'],
  importOrderSeparation: true,
  importOrderSortSpecifiers: true,
  importOrder: [
    "^@/(.*)$",
    "^[.]"
  ],
});
