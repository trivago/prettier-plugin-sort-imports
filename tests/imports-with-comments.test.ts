import { expect } from 'chai';
import prettier from 'prettier';
import { config, configWithSeparation } from './test-config';

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

describe('import with file level comments, inner comments, leading comments', () => {
    const code = `//@ts-ignore
// I am file top level comments
import threeLevelRelativePath from "../../../threeLevelRelativePath";
// I am stick to sameLevelRelativePath
import sameLevelRelativePath from "./sameLevelRelativePath";
// I am stick to third party comment
import thirdParty from "third-party";
// leading comment
import { 
    random // inner comment
} from './random';
// leading comment
export { 
    random // inner comment
} from './random';
import c from 'c';
import oneLevelRelativePath from "../oneLevelRelativePath";
import otherthing from "@core/otherthing";
import a from 'a';
import twoLevelRelativePath from "../../twoLevelRelativePath";
import component from "@ui/hello";
export default {
    title: 'hello',
};
import fourLevelRelativePath from "../../../../fourLevelRelativePath";
import something from "@server/something";
import x from 'x';

// I am function comment

function add(a:number,b:number) {
  return a + b; // I am inside function 
}`;

    const formattedCode = `//@ts-ignore
// I am file top level comments
import a from 'a';
import c from 'c';
// I am stick to third party comment
import thirdParty from 'third-party';
import x from 'x';

import otherthing from '@core/otherthing';

import something from '@server/something';

import component from '@ui/hello';

import fourLevelRelativePath from '../../../../fourLevelRelativePath';
import threeLevelRelativePath from '../../../threeLevelRelativePath';
import twoLevelRelativePath from '../../twoLevelRelativePath';
import oneLevelRelativePath from '../oneLevelRelativePath';
// leading comment
import {
    random, // inner comment
} from './random';
// I am stick to sameLevelRelativePath
import sameLevelRelativePath from './sameLevelRelativePath';

// leading comment
export {
    random, // inner comment
} from './random';

export default {
    title: 'hello',
};

// I am function comment

function add(a: number, b: number) {
    return a + b; // I am inside function
}
`;

    test('format', () => {
        const output = prettier.format(code, configWithSeparation);

        expect(output).to.equal(formattedCode);
    });
});
