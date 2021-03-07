import { expect } from 'chai';
import prettier from 'prettier';
import { config, configWithSeparation } from './test-config';

describe('import and export in between', () => {
    const code = `import threeLevelRelativePath from "../../../threeLevelRelativePath";
import sameLevelRelativePath from "./sameLevelRelativePath";
import thirdParty from "third-party";
export { random } from './random';
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

function add(a:number,b:number) {
  return a + b;
}
`;

    const formattedCode = `import a from 'a';
import c from 'c';
import thirdParty from 'third-party';
import x from 'x';
import otherthing from '@core/otherthing';
import something from '@server/something';
import component from '@ui/hello';
import fourLevelRelativePath from '../../../../fourLevelRelativePath';
import threeLevelRelativePath from '../../../threeLevelRelativePath';
import twoLevelRelativePath from '../../twoLevelRelativePath';
import oneLevelRelativePath from '../oneLevelRelativePath';
import sameLevelRelativePath from './sameLevelRelativePath';

export { random } from './random';

export default {
    title: 'hello',
};

function add(a: number, b: number) {
    return a + b;
}
`;

    test('format', () => {
        const output = prettier.format(code, config);

        expect(output).to.equal(formattedCode);
    });
});

describe('import and export in between with separation', () => {
    const code = `import threeLevelRelativePath from "../../../threeLevelRelativePath";
import sameLevelRelativePath from "./sameLevelRelativePath";
import thirdParty from "third-party";
export { random } from './random';
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

function add(a:number,b:number) {
  return a + b;
}
`;

    const formattedCode = `import a from 'a';
import c from 'c';
import thirdParty from 'third-party';
import x from 'x';

import otherthing from '@core/otherthing';

import something from '@server/something';

import component from '@ui/hello';

import fourLevelRelativePath from '../../../../fourLevelRelativePath';
import threeLevelRelativePath from '../../../threeLevelRelativePath';
import twoLevelRelativePath from '../../twoLevelRelativePath';
import oneLevelRelativePath from '../oneLevelRelativePath';
import sameLevelRelativePath from './sameLevelRelativePath';

export { random } from './random';

export default {
    title: 'hello',
};

function add(a: number, b: number) {
    return a + b;
}
`;

    test('format', () => {
        const output = prettier.format(code, configWithSeparation);

        expect(output).to.equal(formattedCode);
    });
});
