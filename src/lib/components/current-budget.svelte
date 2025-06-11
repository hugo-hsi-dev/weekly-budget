<script lang="ts">
	import type { ActionData } from '../../routes/$types';
	import EditBudget from './edit-budget.svelte';
	let {
		totalBudget,
		remainingBudget,
		form
	}: { totalBudget: string; remainingBudget: string; form: ActionData } = $props();
	let remainingBudgetIsNegative = $derived(Number(remainingBudget) < 0);
</script>

<div class="flex flex-col gap-2">
	<div class="text-muted-foreground text-lg font-medium">Remaining Budget</div>
	<div class={['mb-2 text-5xl font-semibold', { 'text-destructive': remainingBudgetIsNegative }]}>
		${remainingBudget}
	</div>
	<div class="flex items-center gap-2">
		<div class="text-muted-foreground text-xs">Total Budget</div>
		<EditBudget {totalBudget} {form} />
	</div>
</div>
