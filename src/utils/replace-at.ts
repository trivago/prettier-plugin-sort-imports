/**
 * Replaces the contents of a string (str) at a given index with the replacement string - writes over as much text
 * as the replacement string's length
 *
 * @param str
 * @param index
 * @param replacement
 * @returns
 */
export function replaceAt(str: string, index: number, replacement: string) {
    return (
        str.substring(0, index) +
        replacement +
        str.substring(index + replacement.length)
    );
}
