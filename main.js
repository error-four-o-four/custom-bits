import './src/css/button.css';
import './src/css/dialog.css';

import { Selector } from './src/selector.js';
import { Calendar } from './src/calendar.js';

const dialogButton = document.getElementById('main-dialog-button');
const dialogElement = document.getElementById('main-dialog');

if (typeof dialogElement.showModal !== 'function') {
	dialogElement.hidden = true;
	dialogButton.hidden = true;
	/**@todo create polyfill / fallback */
}

let dialogDate = new Date(2010, 0, 2);
updateDialogButton();

const form = document.forms['widget'];
const selectorWrap = form['selector'].children[0];
const calendarWrap = form['calendar'].children[0];

const selectorElement = new Selector(selectorWrap, { date: dialogDate });
const calendarElement = new Calendar(calendarWrap, { date: dialogDate });

selectorElement.callback = () => {
	calendarElement.setDate(selectorElement.date);
};
calendarElement.callback = () => {
	console.log(toLocaleDate(calendarElement.date))
	selectorElement.setDate(calendarElement.date, true);
};

// listeners
dialogButton.addEventListener('click', openModal);
dialogElement.addEventListener('close', closeModal);

function openModal() {
	dialogElement.showModal();

	if (document.documentElement.scrollHeight >
		document.documentElement.clientHeight
		&& !supportsTouch()
	) {
		document.body.classList.add('no-scroll-bar');
	}
	document.body.classList.add('no-scroll');
}

function closeModal() {
	document.body.classList.remove('no-scroll', 'no-scroll-bar');

	if (dialogElement.returnValue === 'cancel') {
		selectorElement.date = dialogDate;
		return;
	};

	dialogDate = new Date(selectorElement.date);
	updateDialogButton();
}

function updateDialogButton() {
	dialogButton.firstElementChild.textContent = toLocaleDate(dialogDate);
}

function toLocaleDate(d) {
	return d.toLocaleString(navigator.language, { dateStyle: 'short', timeStyle: 'short' });
}

function supportsTouch() {
	return window && 'ontouchstart' in window;
}