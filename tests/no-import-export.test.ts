import { expect } from 'chai';
import prettier from 'prettier';
import config from './test-config';

const code = `
function add(a:number,b:number) {
  return a + b;
}
`;

const formattedCode = `function add(a: number, b: number) {
    return a + b;
}
`;

test('format', () => {
    const output = prettier.format(code, config);

    expect(output).to.equal(formattedCode);
});
