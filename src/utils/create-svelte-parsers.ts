export function createSvelteParsers() {
    try {
        var { parsers } = require('prettier-plugin-svelte');
    } catch {
        return {};
    }
    return { parsers };
}