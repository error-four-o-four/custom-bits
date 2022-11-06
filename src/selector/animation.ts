import { add, rem, constrain } from "../utils/function";

import { HTMLSelectorElement } from "./component";
import { sanitizeNumberAsString } from "./utils";

const animationTargets: HTMLSelectorElement[] = [];

let isAnimating = false;

export function requestAnimation(target: HTMLSelectorElement) {
	add(target, animationTargets);

	if (isAnimating) return;

	animate();
}

function animate() {
	if (!isAnimating) isAnimating = true;

	for (const target of animationTargets) {

		// update elements
		if (target.spinning) {
			spin(target);
			continue;
		}

		if (target.snapping) {
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

export function animatePosition(target: HTMLSelectorElement) {
	const position = getPosition(target) + target.velocity;
	setPosition(target, constrain(position, 0, target.maxHeight));

	if (!target.looping && !target.infinite) return;

	loop(target)
}

function spin(target: HTMLSelectorElement) {
	target.velocity *= 0.9;
	animatePosition(target);

	const position = getPosition(target);
	if (position === 0
		|| position === target.maxHeight
		|| Math.abs(target.velocity) < 0.5) target.velocity = 0;

	if (target.velocity !== 0) return;

	target.spinning = false;
	target.snapping = true;
	target.itemIndex = Math.round(Math.abs(position) / target.itemHeight)
}

function snap(target: HTMLSelectorElement) {
	let ty = -(target.itemIndex * target.itemHeight);
	let dy = ty - getPosition(target);

	if (Math.abs(dy) < 0.5) {
		target.snapping = false;
		target.velocity = 0;
	}
	else {
		target.velocity = 0.1 * dy;
	}
	animatePosition(target);
}

export function loop(target: HTMLSelectorElement) {
	if (target.content.firstElementChild === null || target.content.lastElementChild === null) return;

	const threshold = 1.75 * target.itemHeight;
	const position = getPosition(target);

	if (Math.abs(position) < threshold) {
		// reached top
		if (target.looping) {
			target.content.insertBefore(target.content.removeChild(target.content.lastElementChild), target.content.firstElementChild
			)
		}

		if (target.infinite) {
			const item = target.content.firstElementChild.cloneNode(true) as HTMLElement;
			if (item.textContent === null) throw new Error("Somethign went wrong ...");

			const num = parseInt(item.textContent) - 1;
			item.textContent = sanitizeNumberAsString(num, target.pad);
			item.classList.remove('current');
			target.content.insertBefore(item, target.content.firstElementChild);
			target.content.removeChild(target.content.lastElementChild);
		}

		target.itemIndex += 1;
		setPosition(target, position - target.itemHeight)
		return;
	}

	if (Math.abs(target.maxHeight - position) < threshold) {
		// reached bottom
		if (target.looping) {
			target.content.appendChild(target.content.removeChild(target.content.firstElementChild));
		}

		if (target.infinite) {
			const item = target.content.lastElementChild.cloneNode(true) as HTMLElement;
			if (item.textContent === null) throw new Error("Somethign went wrong ...");

			const num = parseInt(item.textContent) + 1;
			item.textContent = sanitizeNumberAsString(num, target.pad);
			item.classList.remove('current');
			target.content.appendChild(item);
			target.content.removeChild(target.content.firstElementChild);
		}

		target.itemIndex -= 1;
		setPosition(target, position + target.itemHeight)
		return;
	}
}

function getPosition(target: HTMLSelectorElement) {
	const y = target.content.style.getPropertyValue('top');
	return (y !== '') ? parseFloat(y.replace('px', '')) : 0
}

export function setPosition(target: HTMLSelectorElement, y: number) {
	target.content.style.top = `${y}px`;
}