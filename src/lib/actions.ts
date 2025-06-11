export function format(node: HTMLInputElement, formatFunction: (value: string) => string) {
	function updateValue() {
		node.value = formatFunction(node.value);
	}

	const controller = new AbortController();

	node.addEventListener('input', updateValue, { signal: controller.signal });
	node.addEventListener('paste', updateValue, { signal: controller.signal });

	node.value = formatFunction(node.value);

	return {
		destroy() {
			controller.abort();
		}
	};
}

export function currency(value: string) {
	const onlyDigits = value.replace(/[^\d]/g, '');

	const padded = onlyDigits.padStart(3, '0');

	const cents = padded.slice(-2);
	let dollars = padded.slice(0, -2);

	dollars = dollars.replace(/^0+/, '') || '0';

	const formattedDollars = dollars.replace(/\B(?=(\d{3})+(?!\d))/g, ',');

	return `$${formattedDollars}.${cents}`;
}
