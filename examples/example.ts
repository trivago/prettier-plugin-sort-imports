// eslint-disable-next-line max-len
// I am top level comment in this file.
// I am second line of top level comment in this file.
import threeLevelRelativePath from '../../../threeLevelRelativePath';
import sameLevelRelativePath from './sameLevelRelativePath';
// ayush found a bug
import thirdParty from 'third-party';
// this is the comment for react
import React from 'react';
export { random } from './random';
import oneLevelRelativePath from '../oneLevelRelativePath';
import otherthing from '@core/otherthing';
// eslint-comment
import {
    twoLevelRelativePath, // innerComment
    somethingElse,
} from '../../twoLevelRelativePath';
// trailingComment
import component from '@ui/hello';
// this is export
export default {
    title: 'hello',
};
// four level
import fourLevelRelativePath from '../../../../fourLevelRelativePath';
import something from '@server/something';

function add(a: number, b: number) {
    // stuff
    return a + b;
}
