import { HTMLSelectorElement } from "./component";
import { attributeNum, attributeBool } from "./component";

export function validateAttributes(target: HTMLSelectorElement) {
	// get attributes as types (number, boolean, null)
	const [pad, min, max, value, looping] = HTMLSelectorElement.getAttributes(target);

	if (invalidPad(pad)) {
		console.warn('Invalid pad values.');
		target.setAttribute('pad', '1');
	}

	// if (noAttributes(min, max, value)) target.setAttribute('value', '0');

	if (invalidMinMax(min, max)) {
		target.setAttribute('min', `${value}`);
		target.setAttribute('max', `${value}`);
		console.warn('Invalid min max values.');
		// worst case - do not check other cases
		return;
	}

	if (invalidValueToMinimum(min, max, value)) target.setAttribute('value', `${min}`);

	if (invalidValueToMaximum(min, max, value)) target.setAttribute('value', `${max}`);

	if (invalidLooping(min, max, looping)) target.removeAttribute('looping')
}


function invalidPad(pad: attributeNum) {
	return (pad !== null && pad < 1)
}

// function noAttributes(min: attributeNum, max: attributeNum, value: attributeNum) {
// 	return (min === null && max === null && value === null)
// }

function invalidMinMax(min: attributeNum, max: attributeNum) {
	return (min !== null && max !== null && min > max)
}

function invalidValueToMinimum(min: attributeNum, max: attributeNum, value: attributeNum) {
	return (
		(
			(min !== null && max === null)
			|| (min !== null && max !== null)
		) && (
			(value === null && min > 0)
			|| (value !== null && min > value)
		)
	)
}

function invalidValueToMaximum(min: attributeNum, max: attributeNum, value: attributeNum) {
	return (
		(
			(min === null && max !== null)
			|| (min !== null && max !== null)
		) && (
			(value === null && max < 0)
			|| (value !== null && max < value)
		)
	)
}


function invalidLooping(min: attributeNum, max: attributeNum, looping: attributeBool) {
	return (
		looping
		&& (
			(min === null && max === null)
			|| (min === null && max !== null)
			|| (min !== null && max === null)
		)
	)
}