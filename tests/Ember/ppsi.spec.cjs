const plugin = require('../../src');

run_spec(__dirname, ['ember-template-tag'], {
    importOrder: ['^@core/(.*)$', '^@server/(.*)', '^@ui/(.*)$', '^[./]'],
    importOrderSeparation: true,
    plugins: ['prettier-plugin-ember-template-tag', plugin.default],
    overrides: [{ "files": "*.{gjs,gts}", "options": { "parser": "ember-template-tag" } }]
});
