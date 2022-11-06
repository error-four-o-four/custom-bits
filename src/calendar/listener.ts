import { equalMonth, equalYear } from "../utils/date";
import { deactivateScrollWhileFocused, supportsTouch } from "../utils/environment";
import { requestAnimation } from "./animation";
import { HTMLCalendarElement } from "./component";
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

	/**@todo */
	// const date = new Date(this.valueAsDate);
	// if (ev.key === 'ArrowRight') {
	// 	date.setDate(36);
	// }
	// if (ev.key === 'ArrowLeft') {
	// 	date.setDate(-48);
	// }
	// requestAnimation(this, date);
}