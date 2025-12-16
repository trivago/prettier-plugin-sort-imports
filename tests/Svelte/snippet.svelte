<script module>
    import { a } from 'z'
    import { c } from 'y'
    
	export { add };
</script>

{#snippet add(a, b)}
	{a} + {b} = {a + b}
{/snippet}