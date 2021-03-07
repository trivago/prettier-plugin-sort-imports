import { expect } from 'chai';
import prettier from 'prettier';
import { config, configWithSeparation } from './test-config';

describe('no import export', () => {
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
});

describe('no import export with separation', () => {
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
        const output = prettier.format(code, configWithSeparation);

        expect(output).to.equal(formattedCode);
    });
});
