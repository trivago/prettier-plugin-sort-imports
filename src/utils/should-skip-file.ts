import { minimatch } from 'minimatch';
import path from 'path';

/**
 * Checks if the current file path matches any of the patterns in importOrderExclude
 * @param filePath The path of the current file being processed
 * @param skipPatterns Array of patterns for files to skip
 * @returns boolean indicating whether the file should be skipped
 */
export function shouldSkipFile(
    filepath: string,
    skipPatterns: string[],
): boolean {
    if (skipPatterns.length === 0) {
        return false;
    }

    const normalizedPath = filepath.split(path.sep).join('/');
    const filename = path.basename(filepath);

    return skipPatterns.some((pattern) => {
        // Normalize pattern to use forward slashes
        const normalizedPattern = pattern.split(path.sep).join('/');

        // If pattern doesn't contain '/', match against filename only
        if (!normalizedPattern.includes('/')) {
            return minimatch(filename, normalizedPattern, { matchBase: true });
        }

        // Otherwise match against full path
        return minimatch(normalizedPath, normalizedPattern);
    });
}
