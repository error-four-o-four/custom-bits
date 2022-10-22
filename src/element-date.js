import { ProtoElement } from './element-proto.js';
import { Spinner } from './spinner.js';

const year = new Date().getFullYear();
const values = [
	{ min: 1, max: 31 },
	{ min: 1, max: 12 },
	/**@todo find another way to handle years! */
	{ min: year - 10, max: year + 10 }
];

export class DateElement extends ProtoElement {
	constructor (element, date = null, callback = null) {
		super(element, values);

		if (date !== null) {
			this.spinners[0].setPositionByValue(date.getDate());
			this.spinners[1].setPositionByIndex(date.getMonth());
			this.spinners[2].setPositionByValue(date.getFullYear());
			this.update();
		}

		if (callback !== null) {
			this.callback = callback;
			for (const spinner of this.spinners) spinner.setCallback(this.update.bind(this));
		}
	}

	update() {
		const [, mm, yyyy] = this.values;
		this.values = this.spinners.map((spinner) => spinner.value);

		if (mm !== this.values[1] || yyyy !== this.values[2]) {
			const numDays = getNumDays(this.values[1], this.values[2]);
			const target = this.spinners[0];

			for (let i = 27; i < 31; i += 1) {
				if (i < numDays) {
					target.activateItem(i);
					continue;
				}
				target.deactivateItem(i);
			}

			if (this.values[0] > target.numChildren) {
				Spinner.animate(target, target.numChildren);
			}
		}

		this.callback && this.callback(...this.values);
	}
}

function getNumDays(month, year) {
	return ([1, 3, 5, 7, 8, 10, 12].includes(month))
		? 31
		: (month !== 2)
			? 30
			: (new Date(year, 1, 29).getMonth() === 1)
				? 29 : 28;
}