run_spec(__dirname, ["babel"], {
    importOrder: ['^@core/(.*)$', '^@server/(.*)', '^@ui/(.*)$', '^[./]'],
    importOrderSeparation: true,
});
