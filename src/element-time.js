import { ProtoElement } from './element-proto.js';

const values = [
	{ min: 0, max: 23 },
	{ min: 0, max: 59 }
];

export class TimeElement extends ProtoElement {
	constructor (element, date = null, callback = null) {
		super(element, values);

		if (date !== null) {
			this.spinners[0].setPositionByIndex(date.getHours());
			this.spinners[1].setPositionByIndex(date.getMinutes());
			this.values = this.spinners.map((spinner) => spinner.value);
		}

		if (callback !== null) {
			this.callback = callback;
			for (const spinner of this.spinners) spinner.setCallback(this.update.bind(this));
		}

		// for (const [index, key] of ['hour', 'minute'].entries()) {
		// 	this.spinners[index].setCustomEvent(element, new CustomEvent('snapped', {
		// 		detail: {
		// 			key,
		// 			value: this.spinners[index].value
		// 		}
		// 	}))
		// }

		// element.addEventListener('snapped', (e) => {
		// 	callback && callback(...this.spinners.map((spinner) => spinner.value));
		// });
	}
}