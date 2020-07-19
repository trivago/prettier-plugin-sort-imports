const prettier = require('prettier');
const { config } = require('./test-config');
const chai = require('chai');

const cExpect = chai.expect;

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

    cExpect(output).to.equal(formattedCode);
});
