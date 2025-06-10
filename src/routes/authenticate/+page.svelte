<script lang="ts">
	import * as InputOTP from '$lib/components/ui/input-otp/index.js';
	import { REGEXP_ONLY_DIGITS } from 'bits-ui';
	import type { PageProps } from './$types';
	import { enhance } from '$app/forms';

	let { data, form: formData }: PageProps = $props();

	let form = $state<HTMLFormElement>(null!);
</script>

<div class="flex h-screen items-center justify-center">
	<form method="POST" bind:this={form} use:enhance>
		<InputOTP.Root
			maxlength={6}
			onComplete={() => form.submit()}
			pattern={REGEXP_ONLY_DIGITS}
			name="pin"
		>
			{#snippet children({ cells })}
				<InputOTP.Group>
					{#each cells.slice(0, 6) as cell (cell)}
						<InputOTP.Slot {cell} aria-invalid={!!formData?.message} />
					{/each}
				</InputOTP.Group>
			{/snippet}
		</InputOTP.Root>

		<p class={['text-destructive transition-opacity', { 'opacity-0': !formData?.message }]}>
			{formData?.message ?? '_'}
		</p>
	</form>
</div>
