import { describe, expect, it } from 'vitest';

import { isBuiltinModule } from '../is-builtin-module.js';

describe('isBuiltinModule', () => {
    it('should correctly identify traditional builtin modules', () => {
        expect(isBuiltinModule('fs')).toBe(true);
        expect(isBuiltinModule('path')).toBe(true);
        expect(isBuiltinModule('http')).toBe(true);
        expect(isBuiltinModule('crypto')).toBe(true);
        expect(isBuiltinModule('util')).toBe(true);
        expect(isBuiltinModule('os')).toBe(true);
        expect(isBuiltinModule('events')).toBe(true);
    });

    it('should correctly identify node: prefixed builtin modules', () => {
        expect(isBuiltinModule('node:fs')).toBe(true);
        expect(isBuiltinModule('node:path')).toBe(true);
        expect(isBuiltinModule('node:http')).toBe(true);
        expect(isBuiltinModule('node:crypto')).toBe(true);
        expect(isBuiltinModule('node:util')).toBe(true);
        expect(isBuiltinModule('node:os')).toBe(true);
        expect(isBuiltinModule('node:events')).toBe(true);
    });

    it('should return false for non-builtin modules', () => {
        expect(isBuiltinModule('express')).toBe(false);
        expect(isBuiltinModule('lodash')).toBe(false);
        expect(isBuiltinModule('react')).toBe(false);
        expect(isBuiltinModule('@types/node')).toBe(false);
        expect(isBuiltinModule('./my-module')).toBe(false);
        expect(isBuiltinModule('../other-module')).toBe(false);
    });

    it('should return false for invalid node: prefixes', () => {
        expect(isBuiltinModule('node:express')).toBe(false);
        expect(isBuiltinModule('node:lodash')).toBe(false);
        expect(isBuiltinModule('node:nonexistent')).toBe(false);
    });

    it('should handle edge cases', () => {
        expect(isBuiltinModule('')).toBe(false);
        expect(isBuiltinModule('node:')).toBe(false);
        expect(isBuiltinModule('node')).toBe(false);
    });
});