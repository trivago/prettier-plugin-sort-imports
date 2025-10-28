import { builtinModules } from 'module';

/**
 * Check if a module name is a Node.js builtin module.
 * This includes both the traditional names (e.g., 'fs') and the
 * new node: prefixed names (e.g., 'node:fs').
 *
 * @param moduleName The module name to check
 * @returns True if the module is a Node.js builtin module
 */
export const isBuiltinModule = (moduleName: string): boolean => {
    // Handle node: prefixed modules
    if (moduleName.startsWith('node:')) {
        const withoutPrefix = moduleName.slice(5);
        return builtinModules.includes(withoutPrefix);
    }

    // Handle traditional module names
    return builtinModules.includes(moduleName);
};
