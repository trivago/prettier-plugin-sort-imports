import { isSimilarTextExistInArray } from '../is-similar-text-in-array';

const list = ['a', 'b', 'c', 'd'];
test('it should return true when text exists in the list', () => {
    expect(isSimilarTextExistInArray(list, 'a')).toEqual(true);
});

test('it should return false when text does not exists in the list', () => {
    expect(isSimilarTextExistInArray(list, 'e')).toEqual(false);
});

test('it should return false when list is empty', () => {
    expect(isSimilarTextExistInArray([], 'a')).toEqual(false);
});
