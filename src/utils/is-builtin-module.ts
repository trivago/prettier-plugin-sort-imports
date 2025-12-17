import { builtinModules } from 'module';

/** Every built-in importable path, including those prefixed with `node:`. */
const BUILTIN_PATHS = new Set(
    builtinModules.flatMap((m) => (m.startsWith("node:") ? [m] : [m, `node:${m}`])),
);

/**
 * Check if a module name is a Node.js builtin module.
 * This includes both the traditional names (e.g., 'fs') and the
 * new node: prefixed names (e.g., 'node:fs').
 *
 * @param moduleName The module name to check
 * @returns True if the module is a Node.js builtin module
 */
export const isBuiltinModule = (moduleName: string): boolean =>
    BUILTIN_PATHS.has(moduleName);
