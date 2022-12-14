<template>
	<div>
		<span>hello world
		</span></div>
</template>

<script>
// I am top level comment in this file.
// I am second line of top level comment in this file.
import threeLevelRelativePath from '../../../threeLevelRelativePath';
import sameLevelRelativePath from './sameLevelRelativePath';
import thirdParty from 'third-party';
import React from 'react';
export { random } from './random';
import oneLevelRelativePath from '../oneLevelRelativePath';
import otherthing from '@core/otherthing';
import twoLevelRelativePath from '../../twoLevelRelativePath';
import component from '@ui/hello';
export default {
    title: 'hello',
};
import fourLevelRelativePath from '../../../../fourLevelRelativePath';
import something from '@server/something';

function add(a, b) {
    return a + b;
}

</script>

<style>
div { color: red; }
</style>
