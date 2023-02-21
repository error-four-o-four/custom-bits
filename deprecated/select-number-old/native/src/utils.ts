export function validatedNumber(value: string | null) {
	return (value === null)
		? null
		: (!isNaN(parseInt(value)))
			? parseInt(value)
			: null;
}

export function validateBoolean(value: string | null) {
	return (value !== null)
}

export function sanitizeStringAsNumber(val: string | null) {
	if (
		(typeof val === 'string' && !(/^-?\d+$/.test(val))) ||
		val === null
	) throw new Error(`${val} is not a valid number.`);

	return parseInt(val)
}

export function sanitizeNumberAsString(num: number, pad: number) {
	return ((Math.sign(num) >= 0) ? '' : '-') + `${Math.abs(num)}`.padStart(pad, '0');
}