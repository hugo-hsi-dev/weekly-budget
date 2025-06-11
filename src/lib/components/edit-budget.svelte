<script lang="ts">
	import * as Drawer from '$lib/components/ui/drawer/index.js';
	import { Pencil } from '@lucide/svelte';
	import { badgeVariants } from './ui/badge';
	import { enhance } from '$app/forms';
	import CurrencyInput from './ui/input/currency-input.svelte';
	import Button from './ui/button/button.svelte';
	import type { ActionData } from '../../routes/$types';
	import * as Alert from '$lib/components/ui/alert/index.js';

	let { totalBudget, form }: { totalBudget: string; form: ActionData } = $props();
	let open = $state(false);

	$effect(() => {
		if (form?.success) {
			open = false;
		}
	});
</script>

<Drawer.Root bind:open shouldScaleBackground>
	<Drawer.Trigger class={badgeVariants({ variant: 'outline' })}
		><Pencil />${totalBudget}</Drawer.Trigger
	>
	<Drawer.Content>
		<Drawer.Header>
			<Drawer.Title>Edit the total budget</Drawer.Title>
		</Drawer.Header>
		<div class="px-4">
			{@render editBudgetForm()}
		</div>
		<Drawer.Footer>
			<Drawer.Close>Cancel</Drawer.Close>
		</Drawer.Footer>
	</Drawer.Content>
</Drawer.Root>

{#snippet editBudgetForm()}
	<form method="POST" action="?/updateBudget" use:enhance class="flex flex-col gap-2">
		{#if form?.message}
			<Alert.Root variant="destructive">
				<Alert.Title>Something is wrong!</Alert.Title>
				<Alert.Description>{form.message}</Alert.Description>
			</Alert.Root>
		{/if}
		<div class="flex flex-col">
			<CurrencyInput type="text" inputmode="numeric" name="budget" class="mb-4" />
			<Button type="submit">Change Budget</Button>
		</div>
	</form>
{/snippet}
