const prettier = require('prettier');
const { config } = require('./test-config');
const chai = require('chai');

const cExpect = chai.expect;

const code = `// I am top level comment in this file.
// I am second line of top level comment in this file.
import threeLevelRelativePath from "../../../threeLevelRelativePath";
import sameLevelRelativePath from "./sameLevelRelativePath";
import thirdParty from "third-party";
export { random } from './random';
import oneLevelRelativePath from "../oneLevelRelativePath";
import otherthing from "@core/otherthing";
import twoLevelRelativePath from "../../twoLevelRelativePath";
import component from "@ui/hello";
export default {
    title: 'hello',
};
import fourLevelRelativePath from "../../../../fourLevelRelativePath";
import something from "@server/something";

function add(a:number,b:number) {
  return a + b;
}
`;

const formattedCode = `// I am top level comment in this file.
// I am second line of top level comment in this file.
import thirdParty from 'third-party';
import otherthing from '@core/otherthing';
import something from '@server/something';
import component from '@ui/hello';
import threeLevelRelativePath from '../../../threeLevelRelativePath';
import sameLevelRelativePath from './sameLevelRelativePath';
import oneLevelRelativePath from '../oneLevelRelativePath';
import twoLevelRelativePath from '../../twoLevelRelativePath';
import fourLevelRelativePath from '../../../../fourLevelRelativePath';

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

    cExpect(output).to.equal(formattedCode);
});
