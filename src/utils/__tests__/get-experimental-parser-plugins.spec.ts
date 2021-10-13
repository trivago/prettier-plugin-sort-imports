import { getExperimentalParserPlugins } from '../get-experimental-parser-plugins';

test('it should return empty list', () => {
    expect(getExperimentalParserPlugins([])).toEqual([]);
});

test('it should return flow and decorators', () => {
    expect(getExperimentalParserPlugins(['flow', 'decorators'])).toEqual(['flow', 'decorators']);
});

test('it should return decorators with parsed options', () => {
    expect(getExperimentalParserPlugins(['["decorators", { "decoratorsBeforeExport": true }]']))
        .toEqual([['decorators', { decoratorsBeforeExport: true }]]);
});

test('it should return decorators with parsed options', () => {
    expect(getExperimentalParserPlugins(['flow', '["decorators", { "decoratorsBeforeExport": true }]']))
        .toEqual(['flow', ['decorators', { decoratorsBeforeExport: true }]]);
});
