import { isBuiltin } from 'module';

/**
 * Check if a module name is a Node.js builtin module.
 * This includes both the traditional names (e.g., 'fs') and the
 * node: prefixed names (e.g., 'node:fs'), as well as prefix-only
 * builtins such as 'node:test' and 'node:sqlite', which
 * `builtinModules` does not list before Node 23.5.
 *
 * @param moduleName The module name to check
 * @returns True if the module is a Node.js builtin module
 */
export const isBuiltinModule = (moduleName: string): boolean =>
    isBuiltin(moduleName);
