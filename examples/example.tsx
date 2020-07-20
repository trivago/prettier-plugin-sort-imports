// @ts-nocheck
import threeLevelRelativePath from '../../../threeLevelRelativePath';
import sameLevelRelativePath from './sameLevelRelativePath';
import thirdParty from 'third-party';
import React, { FC } from 'react';
export { random } from './random';
import oneLevelRelativePath from '../oneLevelRelativePath';
import otherthing from '@core/otherthing';
import twoLevelRelativePath from '../../twoLevelRelativePath';
import component from '@ui/hello';
interface HelloWorldProps {
    name: string;
}

const HelloWorld: FC<HelloWorldProps> = ({ name }) => {
    return <div>Hello, {name}</div>;
};

export default HelloWorld;
