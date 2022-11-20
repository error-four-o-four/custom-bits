import { HTMLCalendarElement } from "./component";
import { updateCells, updateCurrentCell } from "./renderer";

const slideOutLeftFrames = [
	{ transform: 'translateX(0%)' },
	{ transform: 'translateX(-100%)' }
];
const slideOutRightFrames = [
	{ transform: 'translateX(0%)' },
	{ transform: 'translateX(100%)' },
];
const slideOptions: KeyframeAnimationOptions = {
	duration: 300,
	fill: 'none',
	easing: 'ease-in-out',
};

export function requestAnimation(target: HTMLCalendarElement, date: Date) {
	const isLastMonth = date.getTime() < target.valueAsDate.getTime();
	const slideFrames = (isLastMonth) ? slideOutRightFrames : slideOutLeftFrames;

	// split update current before and after animation
	target.cell?.classList.remove('current');
	target.valueAsDate = date;

	const wrap = target.shadow.querySelector('.cal-wrap') as HTMLElement;
	const body = target.shadow.querySelector('.cal-body') as HTMLElement;
	const clone = body.cloneNode(true) as HTMLElement;
	const cloneCells = Array.from(clone.children) as HTMLSpanElement[];

	clone.id = 'pseudo';
	clone.style.left = (isLastMonth) ? '-100%' : '100%';

	// set the date of the animated table
	updateCells(cloneCells, date);

	const slideAnim = wrap.animate(slideFrames, slideOptions);

	slideAnim.onfinish = () => {
		// set new date value and update table
		updateCells(target.cells, target.valueAsDate);
		updateCurrentCell(target);

		wrap.removeChild(clone);
	};

	wrap.appendChild(clone);
}