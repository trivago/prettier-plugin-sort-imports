/**
 * This function checks that specified string exists in the specified list.
 * @param list
 * @param text
 */
export const isSimilarTextExistInArray = (list: string[], text: string) =>
    list.some((element) => text.match(new RegExp(element)) !== null);
