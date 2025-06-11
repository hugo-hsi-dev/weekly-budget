<script lang="ts">
	import Input from './ui/input/input.svelte';
	import { enhance } from '$app/forms';
	import CurrencyInput from './ui/input/currency-input.svelte';
	import type { ActionData, PageProps } from '../../routes/$types';
	import * as Alert from '$lib/components/ui/alert/index.js';
	import AddPurchase from '$lib/components/add-purchase.svelte';
	import * as Drawer from '$lib/components/ui/drawer/index.js';
	import Button, { buttonVariants } from '$lib/components/ui/button/button.svelte';
	import { Plus } from '@lucide/svelte';

	let { form }: { form: ActionData } = $props();

	$effect(() => {
		if (form?.success) {
			open = false;
		}
	});

	let open = $state(false);
</script>

<Drawer.Root bind:open shouldScaleBackground>
	<Drawer.Trigger
		class={['fixed right-6 bottom-6', buttonVariants({ variant: 'outline', size: 'icon' })]}
	>
		<Plus />
	</Drawer.Trigger>
	<Drawer.Content class="pb-6">
		<Drawer.Header>
			<Drawer.Title>Add a new purchase</Drawer.Title>
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
	<form action="?/addPurchase" method="POST" use:enhance class="flex flex-col gap-2">
		{#if form?.message}
			<Alert.Root variant="destructive">
				<Alert.Title>Something is wrong!</Alert.Title>
				<Alert.Description>{form.message}</Alert.Description>
			</Alert.Root>
		{/if}

		<Input name="name" placeholder="What did I spend money on?" />

		<CurrencyInput type="text" inputmode="numeric" name="amount" />

		<Button type="submit">Add</Button>
	</form>
{/snippet}
