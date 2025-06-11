<script lang="ts">
	import Input from './ui/input/input.svelte';
	import { enhance } from '$app/forms';
	import CurrencyInput from './ui/input/currency-input.svelte';
	import type { ActionData, PageProps } from '../../routes/$types';
	import * as Alert from '$lib/components/ui/alert/index.js';
	import * as Card from '$lib/components/ui/card/index.js';
	import * as Drawer from '$lib/components/ui/drawer/index.js';
	import Button, { buttonVariants } from '$lib/components/ui/button/button.svelte';
	import { ChevronDown, Pencil, Plus } from '@lucide/svelte';
	import type { Purchase } from '$lib/server/db/schema';
	import * as Select from '$lib/components/ui/select/index.js';
	import Calendar from './ui/calendar/calendar.svelte';
	import * as Popover from '$lib/components/ui/popover/index.js';

	import { CalendarDate, getLocalTimeZone, today } from '@internationalized/date';

	let { form, purchase }: { form: ActionData; purchase: Purchase } = $props();

	$effect(() => {
		if (form?.success) {
			drawerOpen = false;
		}
	});

	let selectedCalendarDate = $state<CalendarDate>(
		new CalendarDate(
			purchase.createdAt.getFullYear(),
			purchase.createdAt.getMonth() + 1,
			purchase.createdAt.getDate()
		)
	);

	let selectedDate = $derived(selectedCalendarDate.toDate(getLocalTimeZone()));

	let currentUser = $derived(purchase.user);
	let calendarOpen = $state(false);
	let drawerOpen = $state(false);
</script>

<Drawer.Root bind:open={drawerOpen} shouldScaleBackground>
	<Drawer.Trigger class={[buttonVariants({ variant: 'ghost', size: 'icon' })]}>
		<Pencil />
	</Drawer.Trigger>
	<Drawer.Content class="pb-6">
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
		<input type="hidden" value={selectedDate} name="created-at" />
		<CurrencyInput type="text" inputmode="numeric" name="amount" value={'$' + purchase.amount} />
		<div class="flex gap-2">
			<Popover.Root bind:open={calendarOpen}>
				<Popover.Trigger>
					{#snippet child({ props })}
						<Button {...props} variant="outline" class="flex-1 justify-between font-normal">
							{selectedCalendarDate
								? selectedCalendarDate.toDate(getLocalTimeZone()).toLocaleDateString()
								: 'Select date'}
							<ChevronDown />
						</Button>
					{/snippet}
				</Popover.Trigger>
				<Popover.Content class="w-auto overflow-hidden p-0" align="start">
					<Calendar
						type="single"
						bind:value={selectedCalendarDate}
						captionLayout="dropdown"
						onValueChange={() => {
							calendarOpen = false;
						}}
						maxValue={today(getLocalTimeZone())}
					/>
				</Popover.Content>
			</Popover.Root>

			<Select.Root type="single" name="user" bind:value={currentUser}>
				<Select.Trigger class="w-[100px]">{currentUser}</Select.Trigger>
				<Select.Content>
					<Select.Item value="Cassie">Cassie</Select.Item>
					<Select.Item value="Hugo">Hugo</Select.Item>
				</Select.Content>
			</Select.Root>
		</div>
		<Button type="submit">Change</Button>
	</form>
{/snippet}
