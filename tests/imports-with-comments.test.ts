import { expect } from 'chai';
import prettier from 'prettier';
import config, { configWithSeparation } from './test-config';

describe('import with comments', () => {
    const code = `// I am top level comment in this file.
// I am second line of top level comment in this file.
import './commands';

// Comment
// Comment

function add(a:number,b:number) {
    return a + b;
}
`;

    const formattedCode = `// I am top level comment in this file.
// I am second line of top level comment in this file.
import './commands';

// Comment
// Comment
function add(a: number, b: number) {
    return a + b;
}
`;

    test('format', () => {
        const output = prettier.format(code, config);

        expect(output).to.equal(formattedCode);
    });
});

describe('import with comments and third party import', () => {
    const code = `// I am top level comment in this file.
// I am second line of top level comment in this file.
import './commands';
import React from 'react';
// Comment
// Comment

function add(a:number,b:number) {
    return a + b;
}
`;

    const formattedCode = `// I am top level comment in this file.
// I am second line of top level comment in this file.
import React from 'react';
import './commands';

// Comment
// Comment
function add(a: number, b: number) {
    return a + b;
}
`;

    test('format', () => {
        const output = prettier.format(code, config);

        expect(output).to.equal(formattedCode);
    });
});

describe('import with comments and separation', () => {
    const code = `// I am top level comment in this file.
// I am second line of top level comment in this file.
import './commands';

// Comment
// Comment

function add(a:number,b:number) {
    return a + b;
}
`;

    const formattedCode = `// I am top level comment in this file.
// I am second line of top level comment in this file.
import './commands';

// Comment
// Comment
function add(a: number, b: number) {
    return a + b;
}
`;

    test('format', () => {
        const output = prettier.format(code, configWithSeparation);

        expect(output).to.equal(formattedCode);
    });
});

describe('import with comments and third party import and separation', () => {
    const code = `// I am top level comment in this file.
// I am second line of top level comment in this file.
import './commands';
import React from 'react';
// Comment
// Comment

function add(a:number,b:number) {
    return a + b;
}
`;

    const formattedCode = `// I am top level comment in this file.
// I am second line of top level comment in this file.
import React from 'react';

import './commands';

// Comment
// Comment
function add(a: number, b: number) {
    return a + b;
}
`;

    test('format', () => {
        const output = prettier.format(code, configWithSeparation);

        expect(output).to.equal(formattedCode);
    });
});
