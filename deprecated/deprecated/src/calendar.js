import {
	getNumWeeksOfYear,
	getFirstDateOfYear,
	getWeek,
	getFirstMonday,
	getNextDate,
	equalMonth,
	equalYear,
} from './utils.js.js';

const optionsDefault = {
	date: new Date(),
	callback: null,
};

const labels = 'Mon Tue Wed Thu Fri Sat Sun'.split(' ');

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

		this.animTarget = this.parent.appendChild(createTable());
		this.animTarget.classList.add('pseudo-table', 'hidden');
		this.animTargetCells = getCells(this.animTarget);

		// set initial values
		updateCells(this.cells, options.date);
		// store reference
		this.date = options.date;
		this.setCurrentCell();

		this.table.addEventListener('click', this.handleClick.bind(this));
	}

	setDate(date) {
		if (equalMonth(date, this.date) && equalYear(date, this.date)) {
			// clicked on a day of the month
			// set new date value
			this.date = date;
			this.setCurrentCell();
			return;
		}

		// clicked on a day of another month
		const isLastMonth = date.getTime() < this.date.getTime();
		const slideFrames = (isLastMonth) ? slideOutFrames : slideInFrames;

		// split update current before and after animation
		this.currentCell?.classList.remove('current');

		// set the date of the animated table
		updateCells(this.animTargetCells, date);
		this.animTarget.classList.remove('hidden');

		// create custom animation (prev: left, next: right)
		const slideAnim = this.animTarget.animate(slideFrames, slideOptions);
		slideAnim.onfinish = () => {
			// set new date value and update table
			updateCells(this.cells, date);
			this.currentCell = getCell(this.cells, this.date);
			this.currentCell?.classList.add('current');
			// hide animated table
			this.animTarget.classList.add('hidden');
		};

		this.date = date;
	}

	setCurrentCell() {
		this.currentCell?.classList.remove('current');
		this.currentCell = getCell(this.cells, this.date);
		this.currentCell?.classList.add('current');
	}

	handleClick(e) {
		if (e.target.nodeName !== 'TD') return;

		const cell = e.target;
		const next = new Date(cell.getAttribute('date'));

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

function getCell(cells, date) {
	/**@todo use toDateString attribute */
	const dateString = `${date.getDate()}`;
	const cell = cells.find((cell) => (
		cell.nodeName === 'TD'
		&& !cell.classList.contains('deactivated')
		&& cell.textContent === dateString));

	return (cell) ? cell : null;
}

function updateCells(cells, date) {
	let cellDate = getFirstMonday(date);

	// debugger
	for (let i = 0; i < cells.length; i += 1) {
		const cell = cells[i];

		// set week of row
		if (i % 8 === 0) {
			cell.textContent = `${getWeek(cellDate)}`;
			continue;
		}

		// set date of cell
		updateCell(i, cell, date, cellDate);

		// increment date for the next cell
		cellDate = getNextDate(cellDate);
	}
}

function updateCell(i, cell, date, offsetDate) {
	cell.classList.remove('deactivated');
	cell.textContent = offsetDate.getDate();
	cell.setAttribute('date', offsetDate.toDateString());

	if ((i + 1) % 8 === 0) cell.classList.add('sunday');

	if (!equalMonth(date, offsetDate)) cell.classList.add('deactivated');
}
