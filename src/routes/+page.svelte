<script lang="ts">
	import type { PageProps } from './$types';

	import UserSelect from '$lib/components/user-select.svelte';

	let { data }: PageProps = $props();
</script>

<header class="flex items-center justify-between p-6">
	<h1 class="text-2xl font-semibold">My Budget</h1>
	<UserSelect {data} />
</header>
