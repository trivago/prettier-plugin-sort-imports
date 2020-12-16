import { expect } from 'chai';
import prettier from 'prettier';
import { configWithSeparation } from './test-config';

describe('TypeScript', () => {
    const code = `declare module '*.scss' {
    const content: { [className: string]: string };
    export = content;
}

declare const env: {
    [key: string]: string;
};

declare module 'path-browserify' {
    import * as path from 'path';
    export = path;
}
`;


    test('ignore TS Modules', () => {
        const output = prettier.format(code, configWithSeparation);

        expect(code).to.equal(output);
    });
});