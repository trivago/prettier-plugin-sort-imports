import { expect } from 'chai';
import prettier from 'prettier';
import config, { configWithSeparation } from './test-config';

describe('no third party imports', () => {
    const code = `// I am top level comment
import otherthing from "@core/otherthing";
import abc from "@core/abc";
// I am comment
import twoLevelRelativePath from "../../twoLevelRelativePath";
import component from "@ui/hello";
import fourLevelRelativePath from "../../../../fourLevelRelativePath";
import something from "@server/something";`;

    const formattedCode = `// I am top level comment
import abc from '@core/abc';
import otherthing from '@core/otherthing';
import something from '@server/something';
import component from '@ui/hello';
import fourLevelRelativePath from '../../../../fourLevelRelativePath';
// I am comment
import twoLevelRelativePath from '../../twoLevelRelativePath';
`;

    test('format', () => {
        const output = prettier.format(code, config);

        expect(output).to.equal(formattedCode);
    });
});

describe('no third party imports', () => {
    const code = `// I am top level comment
import otherthing from "@core/otherthing";
import abc from "@core/abc";
// I am comment
import twoLevelRelativePath from "../../twoLevelRelativePath";
import component from "@ui/hello";
import fourLevelRelativePath from "../../../../fourLevelRelativePath";
import something from "@server/something";`;

    const formattedCode = `// I am top level comment
import abc from '@core/abc';
import otherthing from '@core/otherthing';

import something from '@server/something';

import component from '@ui/hello';

import fourLevelRelativePath from '../../../../fourLevelRelativePath';
// I am comment
import twoLevelRelativePath from '../../twoLevelRelativePath';
`;

    test('format', () => {
        const output = prettier.format(code, configWithSeparation);

        expect(output).to.equal(formattedCode);
    });
});
