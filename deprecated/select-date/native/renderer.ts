import { equalMonth, getFirstMonday, getNextDate, getWeek, toISODateString } from '../../utils/date';
import { HTMLCalendarElement } from './component';

// const months = 'January February March April May June July August September October November December'.split(' ');
const days = '&nbsp; Mon Tue Wed Thu Fri Sat Sun'.split(' ');

export function renderContent() {
	let content = `<div class="cal-head">
			${days.map((value) => `<span>${value}</span>`).join(`\n`)}
		</div>`;

	content += `<div class="cal-wrap">\n`;
	content += `<div class="cal-body">\n`;

	for (let row = 0; row < 6; row += 1) {
		for (let cell = 0; cell < 8; cell += 1) {
			content += `<span ${(cell === 0) ? `class="cal-cell-head"` : ``}>0</span>\n`;
		}
	}
	content += `</div>\n`;
	content += `</div>`;

	return content;
}

export function updateCells(
	cells: HTMLSpanElement[],
	date: Date
): void {
	let cellDate = getFirstMonday(date);

	for (const [index, cell] of cells.entries()) {
		if (index % 8 === 0) {
			cell.textContent = `${getWeek(cellDate)}`;
			continue;
		}

		// set date of cell
		cell.classList.remove('deactivated');
		cell.textContent = `${cellDate.getDate()}`;
		cell.title = toISODateString(cellDate);

		if (index % 8 === 7) cell.classList.add('sunday');

		if (!equalMonth(date, cellDate)) cell.classList.add('deactivated');

		// increment date for the next cell
		cellDate = getNextDate(cellDate);
	}
}


export function updateCurrentCell(target: HTMLCalendarElement) {
	target.cell?.classList.remove('current');
	target.cell = getCell(target.cells, target.valueAsDate);
	target.cell?.classList.add('current');
}

function getCell(cells: HTMLSpanElement[], date: Date) {
	const dateString = toISODateString(date);
	const cell = cells.find((cell) => cell.title === dateString);

	console.log(dateString)

	return (cell) ? cell : null;
}