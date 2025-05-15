import { shouldSkipFile } from '../should-skip-file';

describe('shouldSkipFile', () => {
    it('should return false when skipPatterns is empty', () => {
        expect(shouldSkipFile('src/file.ts', [])).toBe(false);
    });

    it('should return false when no patterns match', () => {
        const patterns = ['test/*.ts', 'lib/*.js'];
        expect(shouldSkipFile('src/file.ts', patterns)).toBe(false);
    });

    it('should return true when file matches a pattern', () => {
        const patterns = ['src/*.ts', 'lib/*.js'];
        expect(shouldSkipFile('src/file.ts', patterns)).toBe(true);
    });

    it('should handle glob patterns correctly', () => {
        const patterns = ['*.test.ts', 'generated/**'];
        expect(shouldSkipFile('Button.test.ts', patterns)).toBe(true);
        expect(shouldSkipFile('generated/types.ts', patterns)).toBe(true);
        expect(shouldSkipFile('src/Button.ts', patterns)).toBe(false);
    });

    it('should match filename-only patterns against basename', () => {
        const patterns = ['*.js', 'example.ts'];
        expect(shouldSkipFile('/long/path/to/file.js', patterns)).toBe(true);
        expect(shouldSkipFile('/different/path/example.ts', patterns)).toBe(true);
        expect(shouldSkipFile('/path/to/file.ts', patterns)).toBe(false);
    });

    it('should handle special characters in filenames', () => {
        const patterns = ['*.spec.ts', '*test*.js'];
        expect(shouldSkipFile('my-component.spec.ts', patterns)).toBe(true);
        expect(shouldSkipFile('my.test.js', patterns)).toBe(true);
        expect(shouldSkipFile('test.jsx', patterns)).toBe(false);
    });

    it('should handle multiple patterns with mixed path separators', () => {
        const patterns = ['src/*.ts', 'test/*.js', '*.test.tsx'];
        expect(shouldSkipFile('src/file.ts', patterns)).toBe(true);
        expect(shouldSkipFile('test/file.js', patterns)).toBe(true);
        expect(shouldSkipFile('component.test.tsx', patterns)).toBe(true);
        expect(shouldSkipFile('src/sub/file.ts', patterns)).toBe(false);
    });

    it('should handle exact filename matches', () => {
        const patterns = ['example.js', 'tsconfig.json'];
        expect(shouldSkipFile('/any/path/example.js', patterns)).toBe(true);
        expect(shouldSkipFile('/root/tsconfig.json', patterns)).toBe(true);
        expect(shouldSkipFile('/path/to/example.test.js', patterns)).toBe(false);
    });

    it('should handle directory patterns', () => {
        const patterns = ['test/**/*.*', 'generated/**/*.*'];
        expect(shouldSkipFile('test/file.ts', patterns)).toBe(true);
        expect(shouldSkipFile('test/unit/component.js', patterns)).toBe(true);
        expect(shouldSkipFile('generated/types.ts', patterns)).toBe(true);
        expect(shouldSkipFile('src/components/button.ts', patterns)).toBe(false);
    });
}); 