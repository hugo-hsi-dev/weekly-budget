<script lang="ts">
	import * as Select from '$lib/components/ui/select/index.js';
	import type { PageProps } from '../../routes/$types';
	import { enhance } from '$app/forms';
	import { tick } from 'svelte';

	let form: HTMLFormElement = $state(null!);

	let { data }: Omit<PageProps, 'form'> = $props();
	let userName = $derived(data.user.userName);
</script>

<form action="?/changeUser" method="POST" bind:this={form} use:enhance>
	<Select.Root
		type="single"
		name="user"
		bind:value={userName}
		onValueChange={() =>
			tick().then(() => {
				form.submit();
			})}
	>
		<Select.Trigger class="w-[100px]">{userName}</Select.Trigger>
		<Select.Content>
			<Select.Item value="Cassie">Cassie</Select.Item>
			<Select.Item value="Hugo">Hugo</Select.Item>
		</Select.Content>
	</Select.Root>
</form>
