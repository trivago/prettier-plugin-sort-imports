import { expect } from 'chai';
import prettier from 'prettier';
import { config, configWithSeparation } from './test-config';

describe('import export only', () => {
    const code = `import React from 'react';
export const a = 1;`;

    const formattedCode = `import React from 'react';

export const a = 1;
`;

    test('format', () => {
        const output = prettier.format(code, config);

        expect(output).to.equal(formattedCode);
    });
});

describe('import export only with separation', () => {
    const code = `import React from 'react';
export const a = 1;`;

    const formattedCode = `import React from 'react';

export const a = 1;
`;

    test('format', () => {
        const output = prettier.format(code, configWithSeparation);

        expect(output).to.equal(formattedCode);
    });
});
