<script lang="ts">
	import { onMount } from 'svelte';
	import '@fontsource-variable/raleway';
	import '../app.css';
	let { children } = $props();

	async function detectSWUpdate() {
		const registration = await navigator.serviceWorker.ready;

		registration.addEventListener('updatefound', () => {
			const newSW = registration.installing;
			newSW?.addEventListener('statechange', () => {
				if (newSW.state === 'installed') {
					if (confirm('New update available!')) {
						newSW.postMessage({ type: 'SKIP_WAITING' });
						window.location.reload();
					}
				}
			});
		});
	}
	onMount(() => {
		detectSWUpdate();
	});
</script>

<main>
	{@render children()}
</main>

<style>
	:global(body) {
		font-family: 'Raleway Variable', sans-serif;
	}
</style>
