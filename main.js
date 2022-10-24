import './src/css/button.css';
import './src/css/dialog.css';

import { Element } from './src/element.js';

const form = document.forms['widget'];
const wrap = form['selector'].children[0];

const dialogButton = document.getElementById('main-dialog-button');
const dialogElement = document.getElementById('main-dialog');
const confirmButton = dialogElement.querySelector('button[name=confirm]');

if (typeof dialogElement.showModal !== 'function') {
	dialogElement.hidden = true;
	dialogButton.hidden = true;
	/**@todo create polyfill / fallback */
}

let dialogDate = new Date();
updateDialogButton();

const spinnerElement = new Element(wrap, { date: dialogDate });

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
		spinnerElement.date = dialogDate;
		return;
	};

	dialogDate = new Date(spinnerElement.date);
	updateDialogButton();
}

function updateDialogButton() {
	dialogButton.firstElementChild.textContent = toLocaleDate(dialogDate);
}

function toLocaleDate(d) {
	return d.toLocaleString(navigator.language, { dateStyle: 'short', timeStyle: 'short' })
}

function supportsTouch() {
	return window && 'ontouchstart' in window;
}