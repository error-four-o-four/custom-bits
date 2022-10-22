import { Spinner } from './spinner.js';

export class ProtoElement {
	constructor (element, values) {
		this.callback = null;
		this.spinners = [];
		this.values = [];

		for (const [index, options] of values.entries()) {
			const child = document.createElement('div');
			child.classList.add('spinner-wrap');
			element.appendChild(child);

			this.spinners[index] = new Spinner(child, options);
			this.values[index] = this.spinners[index].value;
		}
	}

	update() {
		this.values = this.spinners.map((spinner) => spinner.value);
		this.callback && this.callback(...this.values);
	}
}