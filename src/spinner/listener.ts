import {
	supportsTouch,
	debounce,
	add
} from '../utils'
import {
	requestAnimation,
	reposition
} from './animation';

import { HTMLSpinnerElement } from './component';


const elements: HTMLSpinnerElement[] = []

let added = false;

let evTouch: Touch | null = null;
let pClientY: number | null = null;
let evTarget: HTMLSpinnerElement | null = null;


export function addListener(elt: HTMLSpinnerElement) {
	add(elt, elements)

	if (added) return;

	if (supportsTouch()) {
		window.addEventListener('touchstart', handleTouchStart);
		window.addEventListener('touchmove', handleTouchMove);
		window.addEventListener('touchend', handleInteractionEnd);
	}
	else {
		window.addEventListener('wheel', debounce(handleWheel, 50));
		window.addEventListener('mousedown', handleMouseDown);
		window.addEventListener('mousemove', handleMouseMove);
		window.addEventListener('mouseup', handleInteractionEnd);

		window.addEventListener('keyup', handleKeyEvent)
	}

	added = true;
}

function validate(target: any) {
	if (!(target instanceof HTMLSpinnerElement)) return false;

	if (!elements.includes(target)) return false;

	return true;
}

// ////////////////////////////////////////////////////// MOBILE EVENTS

function handleTouchStart(ev: TouchEvent) {
	if (!validate(ev.target)) return;

	console.log(ev.type);

	evTarget = ev.target as HTMLSpinnerElement;
	evTouch = ev.touches[0];
}
function handleTouchMove(ev: TouchEvent) {
	if (evTarget === null || evTouch === null) return;

	const touch = Array.from(ev.touches).find((touch) => touch.identifier === evTouch?.identifier)

	if (touch === undefined) return;

	evTarget.velocity = touch.pageY - evTouch.pageY;
	evTouch = touch;

	reposition(evTarget)
}
// function handleTouchEnd() {
// 	if (evTarget === null) return;

// 	evTarget.spinning = true;
// 	animate(evTarget);

// 	evTarget = null;
// 	pClientY = null;
// }

// ////////////////////////////////////////////////////// DESKTOP EVENTS

function handleWheel(ev: WheelEvent) {
	if (!validate(ev.target)) return;

	console.log(ev.type);

	evTarget = ev.target as HTMLSpinnerElement
	evTarget.snapping = true;
	evTarget.itemIndex = Math.max(0, Math.min(evTarget.itemCount, evTarget.itemIndex + Math.sign(ev.deltaY)));
	evTarget.setCurrentItem();
	requestAnimation(evTarget);

	evTarget = null;
}

function handleMouseDown(ev: MouseEvent) {
	if (!validate(ev.target)) return;

	console.log(ev.type);

	evTarget = ev.target as HTMLSpinnerElement;
	pClientY = ev.clientY;
}
function handleMouseMove(ev: MouseEvent) {
	if (evTarget === null || pClientY === null) return

	evTarget.velocity = ev.clientY - pClientY;
	pClientY = ev.clientY;
	reposition(evTarget);
}
// function handleMouseup() {
// 	if (evTarget === null) return;

// 	evTarget.spinning = true;
// 	animate(evTarget);

// 	evTarget = null;
// 	pClientY = null;
// }

function handleInteractionEnd(ev: TouchEvent | MouseEvent) {
	if (evTarget === null) return;

	console.log(ev.type);

	evTarget.spinning = true;
	requestAnimation(evTarget);

	evTarget = null;
	pClientY = null;
}

// ////////////////////////////////////////////////////// DESKTOP EVENTS

const validKeys = 'ArrowUp ArrowDown 0 1 2 3 4 5 6 7 8 9'.split(' ');

function handleKeyEvent(ev: KeyboardEvent) {
	if (!(ev.target instanceof HTMLSpinnerElement)) return;

	if (!validKeys.includes(ev.key)) return;

	console.log(ev.type, ev.key)

	if (ev.key === 'ArrowUp') {
		ev.target.setIndex(ev.target.itemIndex - 1, true);
		ev.target.setCurrentItem();
		return;
	}

	if (ev.key === 'ArrowDown') {
		ev.target.setIndex(ev.target.itemIndex + 1, true);
		ev.target.setCurrentItem();
		return;
	}

}

