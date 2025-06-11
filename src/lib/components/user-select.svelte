<script lang="ts">
	import * as Select from '$lib/components/ui/select/index.js';
	import type { PageProps } from '../../routes/$types';
	import { enhance } from '$app/forms';
	import { tick } from 'svelte';
	import type { User } from '$lib/server/auth/session';

	let form: HTMLFormElement = $state(null!);

	let { userName }: NonNullable<User> = $props();
	let currentName = $derived(userName);
</script>

<form action="?/changeUser" method="POST" bind:this={form} use:enhance>
	<Select.Root
		type="single"
		name="user"
		bind:value={currentName}
		onValueChange={() =>
			tick().then(() => {
				form.submit();
			})}
	>
		<Select.Trigger class="w-[100px]">{currentName}</Select.Trigger>
		<Select.Content>
			<Select.Item value="Cassie">Cassie</Select.Item>
			<Select.Item value="Hugo">Hugo</Select.Item>
		</Select.Content>
	</Select.Root>
</form>
