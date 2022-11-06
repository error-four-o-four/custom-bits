
import { deactivateScrollWhileFocused, supportsTouch } from '../utils/environment';

import { HTMLSelectorElement } from './component';
import { requestAnimation, animatePosition } from './animation';

let addedWindowListener = false;

/**@todo */
// const validKeys = 'ArrowUp ArrowDown 0 1 2 3 4 5 6 7 8 9'.split(' ');
const validKeys = 'ArrowUp ArrowDown'.split(' ');

let evTouch: Touch | null = null;
let pClientY: number | null = null;
let evTarget: HTMLSelectorElement | null = null;

export function addListener(target: HTMLSelectorElement) {
	// attach inital events to element
	if (supportsTouch) {
		target.addEventListener('touchstart', handleTouchStart);
	}
	else {
		target.addEventListener('mousedown', handleMouseDown);
		target.addEventListener('keydown', handleKeyEvent);
	}

	deactivateScrollWhileFocused(target, validKeys);

	// attach global events only once
	if (addedWindowListener) {
		return;
	}
	else {
		addedWindowListener = true;
	}

	if (supportsTouch) {
		window.addEventListener('touchmove', handleTouchMove);
		window.addEventListener('touchend', handleTouchEnd);
	}
	else {
		window.addEventListener('mousemove', handleMouseMove);
		window.addEventListener('mouseup', handleMouseUp);
	}
}

function validate(target: any) {
	return target instanceof HTMLSelectorElement;
}

// ////////////////////////////////////////////////////// MOBILE EVENTS

function handleTouchStart(ev: TouchEvent) {
	if (!validate(ev.target)) return;

	console.log(ev.type);

	evTarget = ev.target as HTMLSelectorElement;
	evTouch = ev.touches[0];

	evTarget.focus();
}
function handleTouchMove(ev: TouchEvent) {
	if (evTarget === null || evTouch === null) return;

	const touch = Array.from(ev.touches).find((touch) => touch.identifier === evTouch?.identifier)

	if (touch === undefined) return;

	evTarget.velocity = touch.pageY - evTouch.pageY;
	evTouch = touch;

	animatePosition(evTarget)
}
function handleTouchEnd(ev: TouchEvent): void {
	if (evTarget === null) return;

	console.log(ev.type);

	evTarget.spinning = true;
	requestAnimation(evTarget);

	evTarget.blur();
	evTarget = null;
	evTouch = null;
}

// ////////////////////////////////////////////////////// DESKTOP EVENTS

function handleMouseDown(ev: MouseEvent) {
	if (!validate(ev.target)) return;

	console.log(ev.type);

	evTarget = ev.target as HTMLSelectorElement;
	pClientY = ev.clientY;
}
function handleMouseMove(ev: MouseEvent) {
	if (evTarget === null || pClientY === null) return

	evTarget.velocity = ev.clientY - pClientY;
	pClientY = ev.clientY;
	animatePosition(evTarget);
}
function handleMouseUp(ev: MouseEvent): void {
	if (evTarget === null) return;

	console.log(ev.type);

	evTarget.spinning = true;
	requestAnimation(evTarget);

	evTarget = null;
	pClientY = null;
}

// ////////////////////////////////////////////////////// DESKTOP EVENTS

function handleKeyEvent(ev: KeyboardEvent): void {
	if (!(ev.target instanceof HTMLSelectorElement)) return;

	if (!validKeys.includes(ev.key)) return;

	console.log(ev.type, ev.key)

	if (ev.key === 'ArrowUp') ev.target.stepDown()

	if (ev.key === 'ArrowDown') ev.target.stepUp()
}

