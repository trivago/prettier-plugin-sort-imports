export function createSvelteParsers() {
    try {
        const { parsers } = require('prettier-plugin-svelte');
        return { parsers }
    } catch {
        return { parsers: {} };
    }
}