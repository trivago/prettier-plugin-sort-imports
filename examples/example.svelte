<script>
	import { onMount } from 'svelte';
    // I am top level comment in this file.
    // I am second line of top level comment in this file.
    import React from 'react';
    import thirdParty from 'third-party';

    import something from '@server/something';


    import component from '@ui/hello';

    import fourLevelRelativePath from '../../../../fourLevelRelativePath';
    import threeLevelRelativePath from '../../../threeLevelRelativePath';
    import twoLevelRelativePath from '../../twoLevelRelativePath';
    import oneLevelRelativePath from '../oneLevelRelativePath';
    import sameLevelRelativePath from './sameLevelRelativePath';
 
    import otherthing from '@core/otherthing';
	let count = 0;

	function increment() {
		count += 1;
	}
</script>

<main>
	<h1>Hello Svelte!</h1>
	<p>The count is {count}</p>
	<button on:click={increment}>Increment</button>
</main>

<style>
	main {
		text-align: center;
		padding: 1em;
		max-width: 240px;
		margin: 0 auto;
	}

	h1 {
		color: #ff3e00;
	}

	button {
		font-size: 1.2em;
	}
</style>
