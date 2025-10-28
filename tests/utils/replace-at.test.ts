import { it, expect as hardExpect } from 'vitest';

import { replaceAt } from '../../src/utils/replace-at';

const expect = hardExpect.soft;

it('replaces at the beginning', () => {
    expect(replaceAt('0 2 4 6 8', 0, 'one')).toBe('one 4 6 8')
})

it('relpaces in the middle', () => {
    expect(replaceAt('0 2 4 6 8', 2, 'two')).toBe('0 two 6 8')
});

it('replaces at the end', () => {
    expect(replaceAt('0 2 4 6 8', 6, 'end')).toBe('0 2 4 end')
});

it('overflows', () => {
    expect(replaceAt('0 2 4 6 8', 8, 'end')).toBe('0 2 4 6 end')
});

it('handles negative index', () => {
    expect(replaceAt('0 2 4 6 8', -5, 'begin')).toBe('begin0 2 4 6 8')
});