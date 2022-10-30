import { isLeap, getDay } from './utils.js';

const optionsDefault = {
	date: new Date(),
	callback: null,
};

const labels = 'Mo Tu We Th Fr Sa Su'.split(' ');

const slideInFrames = [
	{ transform: 'translateX(100%)' },
	{ transform: 'translateX(0%)' },
];
const slideOutFrames = [
	{ transform: 'translateX(-100%)' },
	{ transform: 'translateX(0%)' },
];

const slideOptions = {
	duration: 250,
	fill: 'forwards',
	easing: 'ease-in-out',
	composite: 'add',
};

export class Calendar {
	constructor (parent, options) {
		options = {
			...optionsDefault,
			...options
		};

		this.parent = parent;
		this.table = this.parent.appendChild(createTable());
		this.cells = getCells(this.table);
		this.currentCell = null;

		this.animating = false;
		this.animTarget = this.parent.appendChild(createTable());
		this.animTarget.classList.add('hidden');
		this.animTargetCells = getCells(this.animTarget);

		// set initial values
		updateCells(this.cells, options.date);
		// store reference
		this.date = options.date;
		this.setCurrentCell();

		this.table.addEventListener('click', this.update.bind(this));
	}

	setDate(date) {
		if (equalMonth(date, this.date) && equalYear(date, this.date)) {
			// set new date value
			this.date = date;
			this.setCurrentCell();
			return;
		}

		updateCells(this.animTargetCells, date);

		// if (this.animating) return;

		if (!this.animating) this.animating = true;

		const earlierMonth = date.getTime() < this.date.getTime();
		const slideFrames = (earlierMonth) ? slideOutFrames : slideInFrames;

		// set new date value
		this.date = date;

		this.animTarget.classList.remove('hidden');
		const slideAnim = this.animTarget.animate(slideFrames, slideOptions);

		slideAnim.onfinish = () => {
			updateCells(this.cells, this.date);
			this.setCurrentCell();
			this.animTarget.classList.add('hidden');
			this.animating = false;
		};
	}

	setCurrentCell() {
		const dateString = `${this.date.getDate()}`;
		const cell = this.cells.find((cell) => (
			cell.nodeName === 'TD'
			&& !cell.classList.contains('deactivated')
			&& cell.textContent === dateString));

		this.currentCell?.classList.remove('current');
		this.currentCell = (cell) ? cell : null;
		this.currentCell?.classList.add('current');
	}

	update(e) {
		if (e.target.nodeName !== 'TD') return;

		const cell = e.target;
		const day = parseInt(cell.textContent);

		const next = new Date(this.date);
		if (cell.classList.contains('deactivated')) {
			const isInFirstRow = cell.parentElement === this.table.tBodies[0].children[0];
			// const month = this.date.getMonth() + ((isInFirstRow) ? -1 : 1);
			next.setMonth(next.getMonth() + ((isInFirstRow) ? -1 : 1));
		}
		next.setDate(day);

		this.setDate(next);
		this.callback && this.callback();
	}
}

function createTable() {
	const table = document.createElement('table');
	const thead = table.appendChild(document.createElement('thead'));
	const tbody = table.appendChild(document.createElement('tbody'));

	for (let i = 0; i < 7; i += 1) {
		const row = document.createElement('tr');
		const el = (i === 0) ? thead : tbody;
		el.appendChild(row);

		for (let j = 0; j < 8; j += 1) {
			const type = (j === 0) ? 'th' : 'td';
			const cell = document.createElement(type);
			row.appendChild(cell);

			if (j === 0) {
				cell.innerHTML = '&nbsp;';
				continue;
			}

			cell.innerHTML = (i === 0) ? labels[j - 1] : '&nbsp;';
		}
	}
	return table;
}

function getCells(table) {
	return [...table.tBodies[0].children].reduce((cells, row) => [...cells, ...row.children], []);
}

function updateCells(cells, date) {
	const startDate = new Date(date.getFullYear(), 0, 1);
	let offsetDate = getFirstDate(date);
	const weeks = getWeeksAmount(date);

	for (let i = 0; i < cells.length; i += 1) {
		const cell = cells[i];
		if (i % 8 === 0) {
			const month = date.getMonth();

			if (month === 0 && i === 0) {
				const year = date.getFullYear() - 1;
				const d = new Date(year, 0, 1);
				cell.textContent = getWeeksAmount(d);
				continue;
			}

			if (month === 11 && i === 40 && weeks === 53) {
				cell.textContent = 1;
				continue;
			}

			const days = Math.floor((offsetDate - startDate) / (24 * 60 * 60 * 1000));
			const week = Math.ceil(days / 7) + ((weeks === 53) ? 1 : 0);

			cell.textContent = `${week}`;
			continue;
		}
		// reset
		cell.classList.remove('deactivated');
		cell.textContent = offsetDate.getDate();

		if ((i + 1) % 8 === 0) cell.classList.add('sunday');

		if (!equalMonth(date, offsetDate)) cell.classList.add('deactivated');

		// if (equalDay(date, offsetDate) && equalMonth(date, offsetDate)) cell.classList.add('current');

		offsetDate = getNextDate(offsetDate);
	}
}

function getFirstDate(d) {
	const first = new Date(d.getFullYear(), d.getMonth(), 1);
	const offset = 1 - getDay(d);

	first.setDate(offset);
	return first;
}

function getNextDate(d, i = 1) {
	return new Date(d.getFullYear(), d.getMonth(), d.getDate() + i);
}

// function equalDay(a, b) {
// 	return a.getDate() === b.getDate();
// }

function equalMonth(a, b) {
	return a.getMonth() === b.getMonth();
}

function equalYear(a, b) {
	return a.getFullYear() === b.getFullYear();
}

function getWeeksAmount(d) {
	const year = d.getFullYear();
	const leap = isLeap(year);
	let firstDay = getDay(new Date(year, 0, 1));

	return (leap && firstDay === 2) ? 53 : (firstDay === 3) ? 53 : 52;
}