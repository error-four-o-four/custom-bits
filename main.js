import './src/css/style.css';
import './src/css/date.css';

import { Spinner } from './src/spinner.js';
import { TimeElement } from './src/element-time.js';
import { DateElement } from './src/element-date.js';

const wrap = document.getElementsByClassName('date-wrap')[0];

const calendar = {
	test: 'test',
	update(...args) {
		// console.log(...args, this)
	}
}
// creation
new DateElement(wrap.children[0], new Date(), calendar.update.bind(calendar))
new TimeElement(wrap.children[1], new Date(), (hh, mm) => console.log(hh, mm));

// listeners
let pointerIsDown = false;

window.addEventListener('pointerdown', handlePointerPressed);
window.addEventListener('pointermove', handlePointerMoved);
window.addEventListener('pointerup', handlePointerRelease);

function handlePointerPressed() {
	pointerIsDown = true;
}

function handlePointerMoved(e) {
	if (!pointerIsDown) return;

	Spinner.drag(e);
}

function handlePointerRelease() {
	pointerIsDown = false;

	Spinner.release();
}