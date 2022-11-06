export const add = (item: any, arr: any[]) => {
	if (arr.indexOf(item) < 0) arr.push(item);
}

export const rem = (item: any, arr: any[]) => {
	const index = arr.indexOf(item);

	if (arr.length === 1 || index === arr.length - 1) {
		arr.pop();
		return;
	}

	arr[index] = arr.pop();
}

export const constrain = (
	num: number,
	min: number,
	max: number
): number => {
	if (min > max) [min, max] = [max, min];
	return Math.max(min, Math.min(max, num));
}



interface fnWithArgs {
	(...args: any[]): any
}

export const debounce = (fn: fnWithArgs, ms: number = 150): () => void => {
	let timer: ReturnType<typeof setTimeout>;

	return function debouncedFn(this: any) {
		const ctxt = this;
		const args = Array.from(arguments);
		if (timer) clearTimeout(timer);
		timer = setTimeout(() => fn.apply(ctxt, args), ms);
	}
}