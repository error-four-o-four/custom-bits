import './calendar'
import './selector'

import { HTMLSelectorElement } from './selector/component';

const uiStepTo = document.getElementById('ui-interactive-step') as HTMLSelectorElement;
const uiMinMax = document.getElementById('ui-interactive-minmax') as HTMLSelectorElement;
const buttons = Array.from(document.querySelectorAll('button[name=interactive-button]'));

window.addEventListener('click', handleClick);

function handleClick(ev: MouseEvent) {
	const evTarget = ev.target;

	if (
		evTarget === null ||
		!(evTarget instanceof HTMLButtonElement) ||
		!(buttons.includes(evTarget))
	) {
		return;
	}

	const type = evTarget.id.split('-')[1];

	if (type === 'value') {
		const value = parseInt(evTarget.value) as number;
		uiStepTo.stepTo(uiStepTo.valueAsNumber + value);
	}

	if (type === 'min' || type === 'max') {
		const value = (
			(type === 'min')
				? uiMinMax.minAsNumber
				: uiMinMax.maxAsNumber
		) + parseInt(evTarget.value) as number;

		uiMinMax.setAttribute(type, `${value}`);
	}
}