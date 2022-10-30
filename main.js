import './src/css/button.css';
import './src/css/dialog.css';
import './src/css/calendar.css';

import { toLocaleDate } from './src/utils.js';

import { Selector } from './src/selector.js';
import { Calendar } from './src/calendar.js';

const dialogButton = document.getElementById('main-dialog-button');
const dialogElement = document.getElementById('main-dialog');

if (typeof dialogElement.showModal !== 'function') {
	dialogElement.hidden = true;
	dialogButton.hidden = true;
	/**@todo create polyfill / fallback */
}

let dialogDate = new Date(2013, 0, 1);
updateDialogButton();

const form = document.forms['date-picker'];
const selectorField = form['selector'];
const calendarField = form['calendar'];

const selector = new Selector(selectorField, { date: dialogDate });
const calendar = new Calendar(calendarField, { date: dialogDate });

selector.callback = () => {
	calendar.setDate(selector.date);
};
calendar.callback = () => {
	selector.setDate(calendar.date, true);
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
		selector.date = dialogDate;
		return;
	};

	dialogDate = new Date(selector.date);
	updateDialogButton();
}

function updateDialogButton() {
	dialogButton.firstElementChild.textContent = toLocaleDate(dialogDate);
}

function supportsTouch() {
	return window && 'ontouchstart' in window;
}