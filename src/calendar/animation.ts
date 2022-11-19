import {
	HTMLCalendarElement,
	getCells,
	updateCells,
	updateCurrentCell
} from "./component";

const slideInFrames = [
	{ transform: 'translateX(100%)' },
	{ transform: 'translateX(0%)' },
];
const slideOutFrames = [
	{ transform: 'translateX(-100%)' },
	{ transform: 'translateX(0%)' },
];
const slideOptions: KeyframeAnimationOptions = {
	duration: 250,
	fill: 'forwards',
	easing: 'ease-in-out',
	composite: 'add',
};

let animTarget: HTMLTableElement | null;

export function requestAnimation(target: HTMLCalendarElement, date: Date) {
	const isLastMonth = date.getTime() < target.valueAsDate.getTime();
	const slideFrames = (isLastMonth) ? slideOutFrames : slideInFrames;

	const wrapper = target.shadow.getElementById('wrapper') as HTMLElement;

	// split update current before and after animation
	target.cell?.classList.remove('current');
	target.valueAsDate = date;

	// set the date of the animated table
	animTarget = target.table?.cloneNode(true) as HTMLTableElement;
	animTarget.classList.add('animated');

	updateCells(getCells(animTarget), date);

	const slideAnim = animTarget.animate(slideFrames, slideOptions);
	slideAnim.onfinish = () => {
		// set new date value and update table
		updateCells(target.cells, target.valueAsDate);
		updateCurrentCell(target);

		if (animTarget !== null) wrapper.removeChild(animTarget);
	};

	wrapper.appendChild(animTarget);
}