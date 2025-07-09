const plugin = require('../../src');

run_spec(__dirname, ["svelte"], {
    importOrder: ['^@core/(.*)$', '^@server/(.*)', '^@ui/(.*)$', '^[./]'],
    importOrderSeparation: true,
    plugins: ['prettier-plugin-svelte', plugin.default],
    overrides: [{ "files": "*.svelte", "options": { "parser": "svelte" } }]
});
