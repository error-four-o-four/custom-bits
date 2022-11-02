import { getNumDaysOfMonth, dateToValsObj } from './utils.js';
import { Spinner } from './spinner.js';

const optionsDefault = {
	date: new Date(),
	callback: null,

	values: [
		{
			name: 'day',
			min: 1, max: 31,
		},
		{
			name: 'month',
			min: 1, max: 12,
		},
		{
			name: 'year',
			min: 2012, max: 2032,
			/**@todo */
			infinite: true,
		},
		{
			name: 'hour',
			min: 0, max: 23
		},
		{
			name: 'minute',
			min: 0, max: 59
		}
	]
};

export class Selector {
	constructor (parent, options) {
		options = {
			...optionsDefault,
			...options
		};

		this.spinners = [];

		const wrap = document.createElement('div');
		wrap.classList.add('spinners-wrap')

		this.parent = parent;
		this.parent.appendChild(wrap);

		for (const [index, values] of options.values.entries()) {
			values.callback = this.update.bind(this);
			this.spinners[index] = new Spinner(wrap, values);

			if (index === 3) {
				const elt = wrap.appendChild(document.createElement('div'));
				elt.innerHTML = ':';
				elt.classList.add('divider');
			}
		}

		this.callback = options.callback;

		// create default key:value pairs
		this.values = options.values.reduce((result, { label, min }) => ({ ...result, [label]: min }), {});

		// set values
		this.setDate(options.date);
	}

	setDate(date, smooth = false) {
		this.values = dateToValsObj(date);

		this.spinners[2].setByValue(this.values.year, smooth);
		this.spinners[1].setByIndex(this.values.month - 1, smooth);
		this.spinners[0].setByIndex(this.values.day - 1, smooth);

		this.spinners[3].setByIndex(this.values.hour, smooth);
		this.spinners[4].setByIndex(this.values.minute, smooth);
	}
	get date() {
		return new Date(
			this.values.year,
			this.values.month - 1,
			this.values.day,
			this.values.hour,
			this.values.minute
		)
	}

	/**@todo */
	update(label, value) {
		if (
			(label === 'month' && value !== this.values.month) ||
			(label === 'year' && value !== this.values.year)
		) {
			const numDays = (label === 'month')
				? getNumDaysOfMonth(value, this.values.year)
				: getNumDaysOfMonth(this.values.month, value);

			const target = this.spinners[0];
			target.itemCount = numDays;

			for (let i = 27; i < 31; i += 1) {
				if (i < numDays) {
					target.activateItem(i);
					continue;
				}
				target.deactivateItem(i);
			}

			if (this.values.day > numDays) {
				target.value = numDays;
			}
		}

		this.values[label] = value;
		this.callback && this.callback();
	}
}