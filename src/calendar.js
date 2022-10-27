const optionsDefault = {
	date: new Date(),
	callback: null,
};

const labels = {
	en: 'Mo Tu We Th Fr Sa Su'.split(' '),
	de: 'Mo Di Mi Do Fr Sa So'.split(' '),
};

const slideInFrames = [
	{ transform: 'translateX(100%)' },
	{ transform: 'translateX(0%)' },
]
const slideOutFrames = [
	{ transform: 'translateX(-100%)' },
	{ transform: 'translateX(0%)' },
]

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

		this.animating = false;
		this.animTarget = this.parent.appendChild(createTable());
		this.animTarget.classList.add('hidden');
		this.animTargetCells = getCells(this.animTarget);

		// store reference
		this.value = options.date;
		// set initial values
		setCells(this.cells, this.value);
		setCurrentCell(this.cells, this.value);

		this.table.addEventListener('click', this.update.bind(this));
	}

	set date(value) {
		const prev = this.cells.find((cell) => cell.classList.contains('current'));
		prev?.classList.remove('current');

		if (equalMonth(value, this.value) && equalYear(value, this.value)) {
			// set new date value
			setCurrentCell(this.cells, value);
			this.value = value;
			return;
		}

		setCells(this.animTargetCells, value);

		// if (this.animating) return;

		if (!this.animating) this.animating = true;

		const earlierMonth = value.getTime() < this.value.getTime();
		const slideFrames = (earlierMonth) ? slideOutFrames : slideInFrames;
		// if (earlierMonth) this.animTarget.style.transform = 'translateY(0%)';

		this.animTarget.classList.remove('hidden');

		const slideAnim = this.animTarget.animate(slideFrames, slideOptions);

		slideAnim.onfinish = () => {
			setCells(this.cells, value);
			setCurrentCell(this.cells, value);
			this.animTarget.classList.add('hidden');
			this.animating = false;
		};

		// set new date value
		this.value = value;
	}
	get date() {
		return this.value;
	}

	update(e) {
		const cell = e.target;
		const day = parseInt(cell.textContent);

		const next = new Date(this.value);
		next.setDate(day);

		if (cell.classList.contains('deactivated')) {
			const isInFirstRow = cell.parentElement === this.table.tBodies[0].children[0];
			const month = this.value.getMonth() + ((isInFirstRow) ? -1 : 1);
			next.setMonth(month);
		}

		this.date = next;
		this.callback && this.callback();
	}
}

function createTable() {
	const lang = (navigator.language in labels) ? navigator.language : 'en';

	const table = document.createElement('table');
	const thead = table.appendChild(document.createElement('thead'));
	const tbody = table.appendChild(document.createElement('tbody'));

	for (let i = 0; i < 7; i += 1) {
		const row = document.createElement('tr');
		const el = (i === 0) ? thead : tbody;
		el.appendChild(row);

		for (let j = 0; j < 7; j += 1) {
			const cell = document.createElement('td');
			cell.innerHTML = (i === 0) ? labels[lang][j] : '&nbsp;';
			row.appendChild(cell);
		}
	}
	return table;
}

function getCells(table) {
	return [...table.tBodies[0].children].reduce((cells, row) => [...cells, ...row.children], []);
}

function setCells(cells, date) {
	let offsetDate = getFirstDate(date);

	for (let i = 0; i < cells.length; i += 1) {
		const cell = cells[i];
		// reset
		cell.classList.remove('deactivated');
		cell.textContent = offsetDate.getDate();

		if ((i + 1) % 7 === 0) cell.classList.add('sunday');

		if (!equalMonth(date, offsetDate)) cell.classList.add('deactivated');

		// if (equalDay(date, offsetDate) && equalMonth(date, offsetDate)) cell.classList.add('current');

		offsetDate = getNextDate(offsetDate);
	}
}

function setCurrentCell(cells, value) {
	const next = cells.find((cell) => !cell.classList.contains('deactivated') && cell.textContent === `${value.getDate()}`);
	next.classList.add('current');
}

function getFirstDate(d) {
	const first = new Date(d.getFullYear(), d.getMonth(), 1);
	const offset = (first.getDay() + 6) % 7;

	first.setDate(1 - offset);
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