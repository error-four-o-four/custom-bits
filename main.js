import './src/css/button.css';
import './src/css/dialog.css';
import './src/css/spinner.css';

import { Spinner } from './src/spinner.js';
import { TimeElement } from './src/element-time.js';
import { DateElement } from './src/element-date.js';

const dialogElement = document.getElementById('main-dialog');
const dialogButton = document.getElementById('main-dialog-button');

if (typeof dialogElement.showModal !== 'function') {
	dialogElement.hidden = true;
	dialogButton.hidden = true;
	/**@todo create polyfill / fallback */
}

const form = document.querySelector('form[method=dialog]')
const wrap = form.children[0];

const dateElement = new DateElement(wrap.children[0], new Date())
const timeElement = new TimeElement(wrap.children[1], new Date(), (hh, mm) => console.log(hh, mm));

// listeners
dialogButton.addEventListener('click', openDialog);

function openDialog() {
	dialogElement.showModal();

	for (const spinner of [...dateElement.spinners, ...timeElement.spinners]) {
		spinner.updateItemHeight();
		spinner.setPositionByIndex(spinner.i);
	}
}


//
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