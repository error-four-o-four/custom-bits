import { validateAttributes } from "./attributes";
import { HTMLSelectorElement } from "../component";
import { sanitizeNumberAsString } from "./utils";

export function renderPostValueChange(target: HTMLSelectorElement) {
	validateAttributes(target);

	const [num, values] = getValues(target);

	// console.log(num, values);

	let html = '';
	for (let i = 0; i < values.length; i += 1) {
		const value = values[i];
		const isCurrent = (value === num);
		html += `<li ${(isCurrent) ? `class="current"` : ``}>`;
		html += sanitizeNumberAsString(value, target.padAsNumber);
		html += `</li>\n`;

		if (!isCurrent) continue;
		target.properties.index = i;
	}

	target.content.innerHTML = html;
	target.properties.updateItem();
	target.properties.updateMaxHeight();
	target.properties.updatePositionByIndex();
}

function getValues(target: HTMLSelectorElement): [number, number[]] {
	const min = target.minAsNumber;
	const max = target.maxAsNumber;
	const num = target.valueAsNumber;
	const isLooping = target.looping;

	const maxAmountValues = Math.max(max - min + 1, 1);
	const amount = 9;

	if (maxAmountValues <= amount) {
		return [num, Array.from({ length: maxAmountValues }, (_, i) => min + i)]
	}

	const off = 4;

	if (min === -Infinity && max === Infinity) {
		return [num, Array.from({ length: amount }, (_, i) => num - off + i)]
	}

	if (min !== -Infinity && max === Infinity) {
		const minOff = Math.max(min, num - off);
		return [num, Array.from({ length: amount }, (_, i) => minOff + i)]
	}

	if (min === -Infinity && max !== Infinity) {
		const minOff = Math.min(max - amount + 1, num - off)
		return [num, Array.from({ length: amount }, (_, i) => minOff + i)]
	}

	if (min !== -Infinity && max !== Infinity && !isLooping) {
		const offMinNum = num - min;
		if (offMinNum < off) {
			return [num, Array.from({ length: amount }, (_, i) => num - offMinNum + i)]
		}

		const offMaxNum = max - num;
		if (offMaxNum < off) {
			return [num, Array.from({ length: amount }, (_, i) => num + offMaxNum - amount + 1 + i)]
		}

		const minOff = Math.max(min, num - off);
		return [num, Array.from({ length: amount }, (_, i) => minOff + i)]
	}

	return [num, Array.from({ length: amount }, (_, i) => num - off + i).map((val) => {
		return (val < min)
			? max - (val - min + 1)
			: (val > max)
				? min - (max - val + 1)
				: val;
	})]
}

export function renderOnPositionChange(target: HTMLSelectorElement) {
	if (target.content.firstElementChild === null || target.content.lastElementChild === null) throw new Error("Element does not exist");

	const position = target.properties.position;
	const threshold = 1.25 * target.properties.itemHeight;

	const isAtTop = Math.abs(position) < threshold;
	const isAtBottom = Math.abs(target.properties.maxHeight - position) < threshold

	if (!isAtTop && !isAtBottom) return;

	const pad = target.padAsNumber;
	const min = target.minAsNumber;
	const max = target.maxAsNumber;
	const isLooping = target.looping;

	if (isAtTop) {
		const prev = getInnerText(target.content.firstElementChild);
		if (min !== -Infinity && !isLooping && prev === min) return;

		const element = document.createElement('li');
		element.textContent = getPrependedInnerText(prev, pad, min, max, isLooping)

		target.content.insertBefore(element, target.content.firstElementChild);
		target.content.removeChild(target.content.lastElementChild);

		target.properties.position = position - target.properties.itemHeight;
		target.properties.index += 1;

		return;
	}

	if (isAtBottom) {
		const prev = getInnerText(target.content.lastElementChild);
		if (max !== Infinity && !isLooping && prev === max) return;

		const element = document.createElement('li');
		element.textContent = getAppendedInnerText(prev, pad, min, max, isLooping);

		target.content.appendChild(element);
		target.content.removeChild(target.content.firstElementChild);

		target.properties.position = position + target.properties.itemHeight;
		target.properties.index -= 1;

		return;
	}
}

function getInnerText(element: Element) {
	const content = element.textContent;

	if (typeof content !== 'string') throw new Error("Element does not have any content");

	const number = parseInt(content);

	if (isNaN(number)) throw new Error("Element has no valid text content");

	return number;
}

function getPrependedInnerText(
	prev: number,
	pad: number,
	min: number,
	max: number,
	isLooping: boolean
) {
	const next = (isLooping && prev === min)
		? max
		: (isLooping && prev === max)
			? max - 1
			: prev - 1;
	return sanitizeNumberAsString(next, pad);
}

function getAppendedInnerText(
	prev: number,
	pad: number,
	min: number,
	max: number,
	isLooping: boolean
) {
	const next = (isLooping && prev === max)
		? min
		: (isLooping && prev === min)
			? min + 1
			: prev + 1;
	return sanitizeNumberAsString(next, pad);
}