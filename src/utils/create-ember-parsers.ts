export function createEmberParsers() {
    try {
        var { parsers } = require('prettier-plugin-ember-template-tag');
    } catch {
        return {};
    }
    return { parsers };
}