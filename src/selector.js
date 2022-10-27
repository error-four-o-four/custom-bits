import { getNumDays, date2entries } from './utils.js';
import { Spinner } from './spinner.js';

const optionsDefault = {
	date: new Date(),
	callback: null,

	values: [
		{
			label: 'day',
			min: 1, max: 31,
		},
		{
			label: 'month',
			min: 1, max: 12,
		},
		{
			/**@todo */
			label: 'year',
			min: 2012, max: 2032,
		},
		{
			label: 'hour',
			min: 0, max: 23
		},
		{
			label: 'minute',
			min: 0, max: 59
		}
	]
};

export class Selector {
	constructor (wrap, options) {
		options = {
			...optionsDefault,
			...options
		};

		for (const value of options.values) {
			value.callback = this.update.bind(this);
		}

		wrap.classList.add('spinner-date-time');

		this.spinners = options.values.map((value) => new Spinner(wrap, value));
		this.callback = options.callback;

		// store reference
		this.value = options.date;
		// create default entries
		this.values = options.values.reduce((result, { label, min }) => ({ ...result, [label]: min }), {});
		// set entries
		this.date = options.date;
	}

	setDate(date) {
		this.values = date2entries(date);

		this.spinners[0].setByValue(this.values.day, true);
		this.spinners[1].setByValue(this.values.month, true);
		this.spinners[2].setByValue(this.values.year, true);

		this.spinners[3].setByIndex(this.values.hour, true);
		this.spinners[4].setByIndex(this.values.minute, true);
	}

	set date(d) {
		this.values = date2entries(d);

		this.spinners[0].setByValue(this.values.day);
		this.spinners[1].setByValue(this.values.month);
		this.spinners[2].setByValue(this.values.year);

		this.spinners[3].setByIndex(this.values.hour);
		this.spinners[4].setByIndex(this.values.minute);
	}

	get date() {
		return new Date(
			this.values.year,
			this.values.month - 1,
			this.values.day,
			this.values.hour,
			this.values.minute
		);
	}

	update(label, value) {
		if (
			(label === 'month' && value !== this.values.month) ||
			(label === 'year' && value !== this.values.year)
		) {
			const numDays = (label === 'month')
				? getNumDays(value, this.values.year)
				: getNumDays(this.values.month, value);

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