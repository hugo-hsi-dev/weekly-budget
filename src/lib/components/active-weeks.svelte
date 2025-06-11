<script lang="ts">
	import * as Sheet from '$lib/components/ui/sheet/index.js';
	import { CalendarClock, X } from '@lucide/svelte';
	import { buttonVariants } from './ui/button';
	let { weeks }: { weeks: Date[] } = $props();

	import { page, navigating } from '$app/state';

	let selectedWeek = $derived(page.url.searchParams.get('week'));

	let open = $state(false);

	$effect(() => {
		if (navigating.to) {
			open = false;
		}
	});
</script>

<Sheet.Root bind:open>
	<Sheet.Trigger
		class={buttonVariants({ variant: 'outline', size: 'icon', class: 'fixed bottom-6 left-6' })}
	>
		<CalendarClock />
	</Sheet.Trigger>
	<Sheet.Content
		side="left"
		class="text-background w-full gap-0 border-none bg-transparent shadow-none"
	>
		<Sheet.Header class="p-6">
			<Sheet.Title class="text-background text-2xl font-semibold">My Budget</Sheet.Title>
			<Sheet.Description class="text-muted font-medium">View previous weeks</Sheet.Description>
		</Sheet.Header>
		<div class="mb-20 flex flex-col gap-2 overflow-auto p-6">
			{#each weeks as week, i}
				{#if i === 0}
					<a href="/" class={['text-3xl font-bold', { 'text-primary': selectedWeek === null }]}
						>Current</a
					>
				{:else}
					<a
						href={`/?week=${week.toISOString()}`}
						class={['text-3xl font-bold', { 'text-primary': selectedWeek === week.toISOString() }]}
						>{week.toLocaleDateString()}</a
					>
				{/if}
			{/each}
		</div>
		<Sheet.Close
			class={['absolute bottom-6 left-6', buttonVariants({ size: 'icon', variant: 'secondary' })]}
		>
			<X />
		</Sheet.Close>
	</Sheet.Content>
</Sheet.Root>
