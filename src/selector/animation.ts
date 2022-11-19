import { add, rem } from "../utils/function";

import { HTMLSelectorElement } from "./component";
import { renderOnPositionChange } from "./renderer";

const animationTargets: HTMLSelectorElement[] = [];

let isAnimating = false;

export function requestSpinAnimation(target: HTMLSelectorElement) {
	target.properties.spinning = true;
	requestAnimation(target)
}

export function requestSnapAnimation(target: HTMLSelectorElement) {
	target.properties.snapping = true;
	requestAnimation(target)
}

function requestAnimation(target: HTMLSelectorElement) {
	add(target, animationTargets);

	if (!isAnimating) animate();
}

function animate() {
	if (!isAnimating) isAnimating = true;

	for (const target of animationTargets) {

		// update elements
		// trigger callbacks
		if (target.properties.spinning) {
			spin(target);
			continue;
		}

		if (target.properties.snapping) {
			snap(target);
			continue;
		}

		// remove element when the animation has finished
		rem(target, animationTargets);
	}

	if (animationTargets.length === 0) isAnimating = false;

	// exit draw loop
	if (!isAnimating) return;

	window.requestAnimationFrame(animate);
}

function spin(target: HTMLSelectorElement) {
	target.properties.velocity *= 0.9;
	target.properties.updatePositionByVelocity();

	renderOnPositionChange(target);

	const position = target.properties.position
	if (
		position === 0 ||
		position === target.properties.maxHeight ||
		Math.abs(target.properties.velocity) < 0.5
	) target.properties.velocity = 0;

	if (target.properties.velocity !== 0) return;

	target.properties.spinning = false;
	target.properties.snapping = true;

	target.properties.index = Math.round(Math.abs(position) / target.properties.itemHeight);
	target.properties.updateItem();

	const value = target.item?.textContent;

	if (value) target.setAttribute('value', value);
}

function snap(target: HTMLSelectorElement) {
	let ty = -(target.properties.index * target.properties.itemHeight);
	let dy = ty - target.properties.position;

	if (Math.abs(dy) > 0.5) {
		target.properties.velocity = 0.25 * dy;
		target.properties.updatePositionByVelocity();
		renderOnPositionChange(target);
		return;
	}

	target.properties.snapping = false;
	target.properties.velocity = 0;
	target.properties.updatePositionByIndex();
	target.properties.updateItem();

	target.dispatchEvent(target.properties.onsnapendEvent)
}