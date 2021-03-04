import { expect } from 'chai';
import prettier from 'prettier';
import { getConfigWithParser } from './test-config';

describe('Parsers', () => {
    describe('babel-flow', () => {
        const code = `// I am top level comment in this file.
import z from 'z';
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

function add(a:number,b:number) {
  return a + b;
}
`;

    const formattedCode = `// I am top level comment in this file.
import thirdParty from 'third-party';
import z from 'z';

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

function add(a: number, b: number) {
    return a + b;
}
`;
        test('formats with babel-flow', () => {
            const config = getConfigWithParser('babel-flow');
            const output = prettier.format(code, config);

            expect(output).to.equal(formattedCode);
        });
    });

    describe('babel', () => {
        const code = `// I am top level comment in this file.
import z from 'z';
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

function add(a,b) {
  return a + b;
}
`;

    const formattedCode = `// I am top level comment in this file.
import thirdParty from 'third-party';
import z from 'z';

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

function add(a, b) {
    return a + b;
}
`;
        test('formats with babel', () => {
            const config = getConfigWithParser('babel');
            const output = prettier.format(code, config);

            expect(output).to.equal(formattedCode);
        });
    });

    describe('typescript', () => {
    const code = `import z from 'z';
import { isEmpty } from "lodash-es";
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

import { Component } from "@angular/core";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"]
})
export class AppComponent {
  title = "ng-prettier";

  get text(): string {
    return isEmpty(this.title) ? "" : this.title;
  }
}`;

    const formattedCode = `import { Component } from '@angular/core';
import { isEmpty } from 'lodash-es';
import thirdParty from 'third-party';
import z from 'z';

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

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css'],
})
export class AppComponent {
    title = 'ng-prettier';

    get text(): string {
        return isEmpty(this.title) ? '' : this.title;
    }
}
`;

    test('formats with typescript', () => {
        const config = getConfigWithParser('typescript');
        const output = prettier.format(code, config);

        expect(output).to.equal(formattedCode);
    });
    });
});
