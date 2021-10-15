import { getParserPlugins } from '../get-parser-plugins';

test('it should return empty list', () => {
    expect(getParserPlugins('babel')).toEqual([]);
});

test('it should return empty list when invalid parser is entered in prettier', () => {
    // @ts-ignore
    expect(getParserPlugins('xxxxx')).toEqual([]);
});

test('it should return flow', () => {
    expect(getParserPlugins('flow')).toEqual(['flow']);
});

test('it should return ts related plugins', () => {
    expect(getParserPlugins('typescript')).toEqual([
        'typescript',
        'jsx',
        'classProperties',
    ]);
});
