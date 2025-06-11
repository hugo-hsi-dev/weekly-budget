<script lang="ts">
	import Input from './ui/input/input.svelte';
	import { enhance } from '$app/forms';
	import CurrencyInput from './ui/input/currency-input.svelte';
	import type { ActionData, PageProps } from '../../routes/$types';
	import * as Alert from '$lib/components/ui/alert/index.js';

	import * as Drawer from '$lib/components/ui/drawer/index.js';
	import Button, { buttonVariants } from '$lib/components/ui/button/button.svelte';
	import { Pencil, Plus } from '@lucide/svelte';
	import type { Purchase } from '$lib/server/db/schema';
	import * as Select from '$lib/components/ui/select/index.js';

	let { form, purchase }: { form: ActionData; purchase: Purchase } = $props();

	$effect(() => {
		if (form?.success) {
			open = false;
		}
	});

	let currentUser = $derived(purchase.user);
	let open = $state(false);
</script>

<Drawer.Root bind:open shouldScaleBackground>
	<Drawer.Trigger class={[buttonVariants({ variant: 'ghost', size: 'icon' })]}>
		<Pencil />
	</Drawer.Trigger>
	<Drawer.Content class="gap-0">
		<Drawer.Header>
			<Drawer.Title>Edit <span class="text-primary">{purchase.name}</span></Drawer.Title>
		</Drawer.Header>
		<div class="px-4">
			{@render addPurchaseForm()}
		</div>
		<Drawer.Footer>
			<Drawer.Close>Cancel</Drawer.Close>
		</Drawer.Footer>
	</Drawer.Content>
</Drawer.Root>

{#snippet addPurchaseForm()}
	<form action="?/editPurchase" method="POST" use:enhance class="flex flex-col gap-2">
		{#if form?.message}
			<Alert.Root variant="destructive">
				<Alert.Title>Something is wrong!</Alert.Title>
				<Alert.Description>{form.message}</Alert.Description>
			</Alert.Root>
		{/if}
		<input type="hidden" name="id" value={purchase.id} />
		<Input name="name" placeholder={purchase.name} />

		<CurrencyInput type="text" inputmode="numeric" name="amount" value={'$' + purchase.amount} />

		<Select.Root type="single" name="user" bind:value={currentUser}>
			<Select.Trigger class="w-[100px]">{currentUser}</Select.Trigger>
			<Select.Content>
				<Select.Item value="Cassie">Cassie</Select.Item>
				<Select.Item value="Hugo">Hugo</Select.Item>
			</Select.Content>
		</Select.Root>

		<Button type="submit">Change</Button>
	</form>
{/snippet}
