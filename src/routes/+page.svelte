<script lang="ts">
	import type { PageProps } from './$types';

	import UserSelect from '$lib/components/user-select.svelte';
	import Purchases from '$lib/components/purchases.svelte';
	import AddPurchase from '$lib/components/add-purchase.svelte';
	import CurrentBudget from '$lib/components/current-budget.svelte';
	import ActiveWeeks from '$lib/components/active-weeks.svelte';

	let { data, form }: PageProps = $props();
</script>

<div class="bg-background min-h-screen" data-vaul-drawer-wrapper>
	<header class="bg-background fixed top-0 flex w-full items-center justify-between p-6">
		<h1 class="text-2xl font-semibold">My Budget</h1>
		<UserSelect userName={data.user.userName} />
	</header>
	<div class="px-6 pt-22">
		<ActiveWeeks weeks={data.activeWeeks} />
		<div class="mb-6">
			<CurrentBudget totalBudget={data.totalBudget} remainingBudget={data.remainingBudget} {form} />
		</div>
		<Purchases purchases={data.purchases} {form} />
		<AddPurchase {form} />
	</div>
</div>
