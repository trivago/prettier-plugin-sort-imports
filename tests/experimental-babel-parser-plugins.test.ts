import { expect } from 'chai';
import prettier from 'prettier';
import { getConfigWithOptions } from './test-config';

describe('Experimental Parsers', () => {
    const code = `// I am top level comment in this file.
import threeLevelRelativePath from "../../../threeLevelRelativePath";
import sameLevelRelativePath from "./sameLevelRelativePath";
import thirdParty from "third-party";
import oneLevelRelativePath from "../oneLevelRelativePath";
import otherthing from "@core/otherthing";
import abc from "@core/abc";
import twoLevelRelativePath from "../../twoLevelRelativePath";
import component from "@ui/hello";
import fourLevelRelativePath from "../../../../fourLevelRelativePath";
import something from "@server/something";
import xyz from "@ui/xyz";

class BaseClassWithPrivateStaticField {
    static #PRIVATE_STATIC_FIELD

    static basePublicStaticMethod() {
        this.#PRIVATE_STATIC_FIELD = 42
        return this.#PRIVATE_STATIC_FIELD
    }
  }

class SubClass extends BaseClassWithPrivateStaticField { }

let error = null

try {
    SubClass.basePublicStaticMethod()
} catch(e) { error = e}
`;

    const formattedCode = `// I am top level comment in this file.
import thirdParty from 'third-party';

import abc from '@core/abc';
import otherthing from '@core/otherthing';

import something from '@server/something';

import component from '@ui/hello';
import xyz from '@ui/xyz';

import fourLevelRelativePath from '../../../../fourLevelRelativePath';
import threeLevelRelativePath from '../../../threeLevelRelativePath';
import twoLevelRelativePath from '../../twoLevelRelativePath';
import oneLevelRelativePath from '../oneLevelRelativePath';
import sameLevelRelativePath from './sameLevelRelativePath';

class BaseClassWithPrivateStaticField {
    static #PRIVATE_STATIC_FIELD;

    static basePublicStaticMethod() {
        this.#PRIVATE_STATIC_FIELD = 42;
        return this.#PRIVATE_STATIC_FIELD;
    }
}

class SubClass extends BaseClassWithPrivateStaticField {}

let error = null;

try {
    SubClass.basePublicStaticMethod();
} catch (e) {
    error = e;
}
`;
    test('should format correctly', () => {
        const config = getConfigWithOptions({
            importOrder: [
                '^@core/(.*)$',
                '^@server/(.*)',
                '^@ui/(.*)$',
                '^[./]',
            ],
            importOrderSeparation: true,
            experimentalBabelParserPluginsList: ['classPrivateProperties'],
        });
        const output = prettier.format(code, config);

        expect(output).to.equal(formattedCode);
    });
});
