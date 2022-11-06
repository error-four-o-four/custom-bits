// import cssPropertiesButton from './css/button.css';
// import cssPropertiesDialog from './css/dialog.css';
// import cssPropertiesCalendar from './css/calendar.css';
// import htmlContent from './template.html?raw';

// import { settings } from '../calendar/attributes';

// const cssTemplate = document.createElement('template');
// cssTemplate.innerHTML = `<style>${cssPropertiesButton}\n${cssPropertiesDialog}\n${cssPropertiesCalendar}</style>\n`;

// const htmlTemplate = document.createElement('template');
// htmlTemplate.innerHTML = htmlContent;

export class HTMLCustomDialogElement extends HTMLInputElement {
	public shadow

	constructor() {
		super()

		this.shadow = this.attachShadow({ mode: 'open' });
	}

	public connectedCallback(): void {
		// this.shadow.appendChild(cssTemplate.content.cloneNode(true));
		// this.shadow.appendChild(htmlTemplate.content.cloneNode(true));

		// createSelectors(this);
		// addListener(this);
	}
}

// function createSelectors(target: HTMLCustomDialogElement) {
// 	const wrap = document.createElement('div');
// 	wrap.setAttribute('id', 'selector-wrap')

// 	const selector = target.shadow.getElementById('selector') as HTMLFieldSetElement;
// 	selector.appendChild(wrap);

// 	/**@todo get attributes */

// 	for (let i = 0; i < settings.length; i += 1) {
// 		const spinner = document.createElement('number-spinner');
// 		const attributes = settings[i];

// 		for (const attribute in attributes) {
// 			const value = attributes[attribute];
// 			spinner.setAttribute(attribute, `${value}`);
// 		}
// 		wrap.appendChild(spinner);
// 	}
// }

// function addListener(target: HTMLCustomDialogElement) {
// 	const dialogButton = target.shadow.getElementById('dialog-button') as HTMLButtonElement;
// 	const dialogElement = target.shadow.getElementById('dialog-element') as HTMLDialogElement;

// 	dialogButton?.addEventListener('click', function () {
// 		dialogElement.showModal()
// 	})
// }