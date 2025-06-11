<script lang="ts">
	import Input from './ui/input/input.svelte';
	import { enhance } from '$app/forms';
	import CurrencyInput from './ui/input/currency-input.svelte';
	import type { ActionData, PageProps } from '../../routes/$types';
	import * as Alert from '$lib/components/ui/alert/index.js';

	import * as Drawer from '$lib/components/ui/drawer/index.js';
	import Button, { buttonVariants } from '$lib/components/ui/button/button.svelte';
	import { Pencil, Plus, Trash } from '@lucide/svelte';
	import type { Purchase } from '$lib/server/db/schema';
	import * as Select from '$lib/components/ui/select/index.js';

	let { form, purchase }: { form: ActionData; purchase: Purchase } = $props();

	$effect(() => {
		if (form?.success) {
			open = false;
		}
	});

	let open = $state(false);
</script>

<Drawer.Root bind:open shouldScaleBackground>
	<Drawer.Trigger class={[buttonVariants({ variant: 'ghost', size: 'icon' })]}>
		<Trash class="text-destructive" />
	</Drawer.Trigger>
	<Drawer.Content class="pb-6">
		<Drawer.Header>
			<Drawer.Title
				>Are you sure you want to <span class="text-destructive">Delete</span>
				<span class="text-primary">{purchase.name}</span>.</Drawer.Title
			>
			<Drawer.Description>This action cannot be undone.</Drawer.Description>
		</Drawer.Header>
		<div class="px-4">
			{@render deletePurchaseForm()}
		</div>
		<Drawer.Footer>
			<Drawer.Close>Cancel</Drawer.Close>
		</Drawer.Footer>
	</Drawer.Content>
</Drawer.Root>

{#snippet deletePurchaseForm()}
	<form action="?/deletePurchase" method="POST" use:enhance class="flex flex-col gap-2">
		{#if form?.message}
			<Alert.Root variant="destructive">
				<Alert.Title>Something is wrong!</Alert.Title>
				<Alert.Description>{form.message}</Alert.Description>
			</Alert.Root>
		{/if}
		<input type="hidden" value={purchase.id} name="id" />
		<Button type="submit" class="w-full" variant="destructive">Delete</Button>
	</form>
{/snippet}
