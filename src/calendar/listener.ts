import { equalMonth, equalYear, getNumDaysOfMonth } from "../utils/date";
import { deactivateScrollWhileFocused, supportsTouch } from "../utils/environment";

import { HTMLCalendarElement } from "./component";
import { requestAnimation } from "./animation";
import { updateCurrentCell } from "./renderer";

const validKeys = 'ArrowUp ArrowRight ArrowDown ArrowLeft'.split(' ');

export function addListener(target: HTMLCalendarElement) {
	const body = target.shadow.querySelector('.cal-body') as HTMLElement;
	body.addEventListener('click', selectCell.bind(null, target));

	if (!supportsTouch) {
		target.addEventListener('keydown', handleKeyEvent.bind(null, target))
	}

	deactivateScrollWhileFocused(target, validKeys);
}

function selectCell(target: HTMLCalendarElement, ev: Event) {
	if ((ev.target as HTMLElement).nodeName !== 'SPAN') return;

	const date = new Date((ev.target as HTMLSpanElement).title);

	if (equalMonth(date, target.valueAsDate) && equalYear(date, target.valueAsDate)) {
		target.valueAsDate = date;
		updateCurrentCell(target);
		return;
	}

	requestAnimation(target, date);
}

const numCols = 8;
const numRows = 6;

function handleKeyEvent(target: HTMLCalendarElement, ev: KeyboardEvent) {
	if (!validKeys.includes(ev.key) || target.cell === null) return

	const index = target.cells.indexOf(target.cell);
	const col = index % numCols;
	const row = Math.floor(index / numCols);

	if (ev.key === 'ArrowUp' && row > 0) {
		target.cells[index - numCols].click();
		return;
	}
	if (ev.key === 'ArrowDown' && row < numRows - 1) {
		target.cells[index + numCols].click();
		return;
	}
	if (ev.key === 'ArrowRight' && col < numCols - 1) {
		target.cells[index + 1].click();
		return;
	}
	if (ev.key === 'ArrowLeft' && col > 1) {
		target.cells[index - 1].click();
		return;
	}

	const date = target.valueAsDate;

	if (ev.key === 'ArrowRight') {
		date.setMonth(date.getMonth() + 1, 1);
		requestAnimation(target, date);
		return;
	}

	if (ev.key === 'ArrowLeft') {
		date.setMonth(date.getMonth() - 1);
		date.setDate(getNumDaysOfMonth(date));
		requestAnimation(target, date);
		return;
	}
}