import { add, rem } from "../utils";

import { HTMLSpinnerElement } from "./component";

const animationTargets: HTMLSpinnerElement[] = [];

let isAnimating = false;

export function requestAnimation(target: HTMLSpinnerElement) {
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

export function reposition(target: HTMLSpinnerElement) {
	target.top = Math.min(0, Math.max(target.maxHeight, target.top + target.velocity))

	if (!target.looping && !target.infinite) return;

	loop(target)
}

function spin(target: HTMLSpinnerElement) {
	target.velocity *= 0.9;
	reposition(target);

	if (target.top === 0
		|| target.top === target.maxHeight
		|| Math.abs(target.velocity) < 0.5) target.velocity = 0;

	if (target.velocity !== 0) return;

	target.spinning = false;
	target.snapping = true;
	target.itemIndex = Math.max(0, Math.min(target.itemCount, Math.round(Math.abs(target.top) / target.itemHeight)));
	target.setCurrentItem();

	// this.callback && this.callback();
	// if (this.listener && this.event) {
	// 	this.listener.dispatchEvent(this.event);
	// }
}

export function snap(target: HTMLSpinnerElement) {
	let ty = -(target.itemIndex * target.itemHeight);
	let dy = ty - target.top;

	if (Math.abs(dy) < 0.5) {
		target.snapping = false;
		target.velocity = 0;
	}
	else {
		target.velocity = 0.1 * dy;
	}
	reposition(target);
}

export function loop(target: HTMLSpinnerElement) {
	if (target.content.firstElementChild === null || target.content.lastElementChild === null) return;

	const threshold = 1.75 * target.itemHeight;

	if (Math.abs(target.top) < threshold) {
		// reached top
		if (target.looping) {
			target.content.insertBefore(target.content.removeChild(target.content.lastElementChild), target.content.firstElementChild
			)
		}

		if (target.infinite) {
			const item = target.content.firstElementChild.cloneNode(true) as Element;
			item.textContent = `${(parseInt(item.textContent as string) - 1)}`;
			item.classList.remove('current');
			target.content.insertBefore(item, target.content.firstElementChild);
			target.content.removeChild(target.content.lastElementChild);
		}

		target.top -= target.itemHeight;
		return;
	}

	if (Math.abs(target.bottom) < threshold) {
		// reached bottom
		if (target.looping) {
			target.content.appendChild(target.content.removeChild(target.content.firstElementChild));
		}

		if (target.infinite) {
			const item = target.content.lastElementChild.cloneNode(true) as Element;
			item.textContent = `${(parseInt(item.textContent as string) + 1)}`;
			item.classList.remove('current');
			target.content.appendChild(item);
			target.content.removeChild(target.content.firstElementChild);
		}

		target.top += target.itemHeight;
		return;
	}
}