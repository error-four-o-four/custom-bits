import { HTMLSpinnerElement } from "./spinner/component";

window.customElements.define('div-spinner', HTMLSpinnerElement);

declare global {
	interface HTMLElementTagnameMap {
		'div-spinner': HTMLSpinnerElement
	}
}

const date = new Date();

const spinners = document.getElementsByTagName('div-spinner') as HTMLCollectionOf<HTMLSpinnerElement>;

spinners[0].setValue(`${date.getDate()}`.padStart(2, '0'));
spinners[1].setValue(`${date.getMonth() + 1}`.padStart(2, '0'));
spinners[2].setValue(`${date.getFullYear()}`);