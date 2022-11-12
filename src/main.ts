import './calendar'
import './selector'

import { HTMLSelectorElement } from './selector/component';

const interactive = document.getElementById('ui-interactive') as HTMLSelectorElement;
const decreaseMin = document.getElementById('decrease-min');
const increaseMin = document.getElementById('increase-min');
const decreaseMax = document.getElementById('decrease-max');
const increaseMax = document.getElementById('increase-max');
const buttons = [decreaseMin, increaseMin, decreaseMax, increaseMax] as HTMLElement[];

window.addEventListener('click', handleInteractiveClick)

function handleInteractiveClick(ev: MouseEvent) {
	if (ev.target === null) return;

	if (!(ev.target instanceof HTMLButtonElement)) return;

	if (!(buttons.includes(ev.target))) return;

	if (ev.target === decreaseMin) {
		const min = interactive.minAsNumber - 1;
		interactive.setAttribute('min', `${min}`);
	}

	if (ev.target === increaseMin) {
		interactive.minAsNumber += 1;
	}
}

// const test = document.getElementById('test');
// console.log(test);

// const test = document.querySelector('ui-number') as HTMLSelectorElement
// test.setAttribute('looping', 'false')
// test.value = '10';
// console.log(test.value, test.content)
