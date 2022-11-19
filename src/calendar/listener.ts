import { equalMonth, equalYear, getNumDaysOfMonth } from "../utils/date";
import { deactivateScrollWhileFocused, supportsTouch } from "../utils/environment";

import { HTMLCalendarElement } from "./component";
import { requestAnimation } from "./animation";
import { updateCurrentCell } from "./component";

const validKeys = 'ArrowUp ArrowRight ArrowDown ArrowLeft'.split(' ');

export function addListener(target: HTMLCalendarElement) {
	target.table?.addEventListener('click', selectCell.bind(target));

	if (!supportsTouch) {
		target.addEventListener('keydown', handleKeyEvent.bind(target))
	}

	deactivateScrollWhileFocused(target, validKeys);
}

function selectCell(this: HTMLCalendarElement, ev: Event) {
	if ((ev.target as HTMLElement).nodeName !== 'TD') return;

	const date = new Date((ev.target as HTMLTableCellElement).title)

	if (equalMonth(date, this.valueAsDate) && equalYear(date, this.valueAsDate)) {
		this.valueAsDate = date;
		updateCurrentCell(this);
		return;
	}

	requestAnimation(this, date);
}

function handleKeyEvent(this: HTMLCalendarElement, ev: KeyboardEvent) {
	if (!validKeys.includes(ev.key) || this.cell === null) return

	const cellIndex = this.cell.cellIndex;
	const row = this.cell.parentElement as HTMLTableRowElement;

	if (row === null) return;

	const rowIndex = row.rowIndex;

	if (ev.key === 'ArrowUp' && rowIndex > 1) {
		const prev = row.previousElementSibling as HTMLTableRowElement;
		prev.cells[cellIndex].click();
		return;
	}
	if (ev.key === 'ArrowDown' && rowIndex < 6) {
		const next = row.nextElementSibling as HTMLTableRowElement;
		next.cells[cellIndex].click();
		return;
	}
	if (ev.key === 'ArrowRight' && cellIndex < 7) {
		row.cells[cellIndex + 1].click();
		return;
	}
	if (ev.key === 'ArrowLeft' && cellIndex > 1) {
		row.cells[cellIndex - 1].click();
		return;
	}

	const date = this.valueAsDate;

	if (ev.key === 'ArrowRight') {
		const month = date.getMonth() + 1;
		date.setMonth(month, 1);
		requestAnimation(this, date);
		return;
	}

	if (ev.key === 'ArrowLeft') {
		const month = date.getMonth() - 1;
		const days = getNumDaysOfMonth(date.getFullYear(), month);
		date.setMonth(month, days);
		console.log(this.valueAsDate, date)
		requestAnimation(this, date);
		return;
	}
}