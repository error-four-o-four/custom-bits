import { HTMLSelectorElement} from "./component";

export function getIndexOfValue(target: HTMLSelectorElement, value: string): number {
	for (let i = 0; i < target.content.children.length; i += 1) {
		const child = target.content.children[i];

		if (child.textContent !== value) continue;

		return i;
	}
	return -1;
}

export function sanitizeStringAsNumber(val: string) {
	if (!(/^-?\d+$/.test(val))) throw new Error(`${val} is not a valid number.`);
	return parseInt(val)
}

export function sanitizeNumberAsString(num: number, pad: number) {
	return ((Math.sign(num) >= 0) ? '' : '-') + `${Math.abs(num)}`.padStart(pad, '0') ;
}