<script context="module">
    // I am top level comment in this file.
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
    import { defineComponent } from 'vue';
	import Header from './Header.svelte';
	import './styles.css';
</script>

<div class="app">
	<Header />

	<main>
		<slot />
	</main>

	<footer>
		<p>visit <a href="https://kit.svelte.dev">kit.svelte.dev</a> to learn SvelteKit</p>
	</footer>
</div>

<style>
	.app {
		display: flex;
		flex-direction: column;
		min-height: 100vh;
	}
	main {
		flex: 1;
		display: flex;
		flex-direction: column;
		padding: 1rem;
		width: 100%;
		max-width: 64rem;
		margin: 0 auto;
		box-sizing: border-box;
	}
	footer {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		padding: 12px;
	}
	footer a {
		font-weight: bold;
	}
	@media (min-width: 480px) {
		footer {
			padding: 12px 0;
		}
	}
</style>
