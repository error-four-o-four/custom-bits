import cssProperties from './template.css';
import htmlContent from './template.html?raw';

import { equalMonth, getFirstMonday, getNextDate, getWeek, toISODateString } from '../utils/date';
import { addListener } from './listener';

const cssTemplate = document.createElement('template');
cssTemplate.innerHTML = `<style>${cssProperties}</style>\n`;

const htmlTemplate = document.createElement('template');
htmlTemplate.innerHTML = htmlContent;

export class HTMLCalendarElement extends HTMLInputElement {
	static formAssociated = true;

	private _internals: ElementInternals
	private _value: Date

	public shadow

	public table: HTMLTableElement | null
	public cells: HTMLTableCellElement[]
	public cell: HTMLTableCellElement | null

	constructor() {
		super()
		this._internals = this.attachInternals()
		this._value = new Date()

		this.shadow = this.attachShadow({ mode: 'open' });

		this.table = null;
		this.cells = [];
		this.cell = null;
	}

	public connectedCallback(): void {
		this.shadow.appendChild(cssTemplate.content.cloneNode(true));
		this.shadow.appendChild(htmlTemplate.content.cloneNode(true));

		this.table = this.shadow.getElementById('content') as HTMLTableElement
		this.cells = getCells(this.table);

		if (!this.hasAttribute('role')) this.setAttribute('role', 'button');
		if (!this.hasAttribute('tabindex')) this.setAttribute('tabindex', '1');

		if (this.hasAttribute('value')) this.value = this.getAttribute('value') || ''

		updateCells(this.cells, this.valueAsDate)
		updateCurrentCell(this);

		addListener(this);
	}

	public get value() {
		return this._value?.toISOString().split('T')[0] || ''
	}
	public set value(value: string) {
		if (!value.match(/\d{4}-\d{1,2}-\d{1,2}/)) return

		this._value = new Date(value);
		this._value.setHours(0, 0);

		console.log(this._internals)
	}
	public get valueAsDate() {
		return this._value;
	}
	public set valueAsDate(value: Date) {
		if (!(value instanceof Date)) return;

		this._value = value;

		console.log(this._internals)
	}
}

export function getCells(table: HTMLTableElement): HTMLTableCellElement[] {
	const rows = Array.from(table.tBodies[0].children) as HTMLTableRowElement[];
	const cells = (row: HTMLTableRowElement): HTMLTableCellElement[] => Array.from(row.children) as HTMLTableCellElement[]
	const reduceCells = (array: HTMLTableCellElement[], row: HTMLTableRowElement) => [...array, ...cells(row)]

	return rows.reduce(reduceCells, [])
}

export function updateCells(cells: HTMLTableCellElement[], date: Date): void {
	let cellDate = getFirstMonday(date);

	for (const cell of cells) {
		if (cell.cellIndex === 0) {
			cell.textContent = `${getWeek(cellDate)}`;
			continue;
		}

		// set date of cell
		updateCell(cell, date, cellDate);

		// increment date for the next cell
		cellDate = getNextDate(cellDate);
	}
}

function updateCell(
	cell: HTMLTableCellElement,
	date: Date,
	offsetDate: Date
): void {
	cell.classList.remove('deactivated');
	cell.textContent = `${offsetDate.getDate()}`;
	cell.title = toISODateString(offsetDate);

	if (cell.cellIndex === 7) cell.classList.add('sunday');

	if (!equalMonth(date, offsetDate)) cell.classList.add('deactivated');
}

export function updateCurrentCell(target: HTMLCalendarElement) {
	target.cell?.classList.remove('current');
	target.cell = getCell(target.cells, target.valueAsDate);
	target.cell?.classList.add('current');

}

function getCell(cells: HTMLTableCellElement[], date: Date) {
	const dateString = toISODateString(date);
	const cell = cells.find((cell) => cell.title === dateString);

	console.log(dateString)

	return (cell) ? cell : null;
}