import { HTMLCalendarElement } from "./component"

window.customElements.define(
	'ui-calendar',
	HTMLCalendarElement,
	{ extends: 'input' }
);

declare global {
	interface HTMLElementTagnameMap {
		'ui-calendar': HTMLCalendarElement
	}
}
