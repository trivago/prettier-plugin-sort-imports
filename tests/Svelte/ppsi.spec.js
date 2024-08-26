run_spec(__dirname, ["svelte"], {
    importOrder: ['^@core/(.*)$', '^@server/(.*)', '^@ui/(.*)$', '^[./]'],
    importOrderSeparation: true,
    plugins: ['prettier-plugin-svelte', './src'],
    overrides: [{ "files": "*.svelte", "options": { "parser": "svelte" } }]
});