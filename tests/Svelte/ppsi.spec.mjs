import plugin from '../../src';

run_spec(__dirname, ["svelte"], {
    importOrder: ['^@core/(.*)$', '^@server/(.*)', '^@ui/(.*)$', '^[./]'],
    importOrderSeparation: true,
    plugins: ['prettier-plugin-svelte', plugin],
    overrides: [{ "files": "*.svelte", "options": { "parser": "svelte" } }]
});
