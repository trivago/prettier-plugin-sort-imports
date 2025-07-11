export async function createSvelteParsers() {
    try {
        const sveltePlugin = await import('prettier-plugin-svelte');
        const { parsers } = (sveltePlugin.default || sveltePlugin) as any;
        return { parsers };
    } catch {
        return {};
    }
}
