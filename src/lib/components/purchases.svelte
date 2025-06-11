<script lang="ts">
	import type { Purchase } from '$lib/server/db/schema';
	import { Badge } from '$lib/components/ui/badge/index.js';
	import EditPurchase from './edit-purchase.svelte';
	import type { ActionData } from '../../routes/$types';
	import DeletePurchase from './delete-purchase.svelte';
	import { blur, fade } from 'svelte/transition';
	import { flip } from 'svelte/animate';
	import { circOut } from 'svelte/easing';
	let { purchases, form }: { purchases: Purchase[]; form: ActionData } = $props();
</script>

<div class="flex flex-col gap-6">
	{#each purchases as { amount, createdAt, name, user, id, updatedAt } (id)}
		<div
			class="bg-card rounded-xl border p-6 shadow"
			transition:blur
			animate:flip={{ duration: 600, easing: circOut }}
		>
			<div class="text-muted-foreground mb-2 flex items-center justify-between text-lg font-medium">
				{name}
				<div class="flex">
					<EditPurchase {form} purchase={{ amount, createdAt, name, user, id, updatedAt }} />
					<DeletePurchase {form} purchase={{ amount, createdAt, name, user, id, updatedAt }} />
				</div>
			</div>
			<div class="mb-6 text-4xl font-medium">${amount}</div>
			<div class="flex items-center justify-between">
				<Badge>{user}</Badge>
				<div>{createdAt.toLocaleDateString()}</div>
			</div>
		</div>
	{/each}
</div>
