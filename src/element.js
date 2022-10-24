import { createSpinner } from './spinner.js';

const optionsDefault = {
	date: new Date(),
	callback: null,
};

export class Element {
	constructor (wrap, options) {
		options = {
			...optionsDefault,
			...options
		};

		const values = [
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
		];

		for (const value of values) {
			value.callback = this.update.bind(this);
		}

		wrap.classList.add('spinner-date-time');

		this.spinners = values.map((value) => createSpinner(wrap, value));
		this.callback = options.callback;

		this.values = values.reduce((result, { label, min }) => ({ ...result, [label]: min }), {});
		this.date = options.date;
	}

	set date(d) {
		this.values = date2entries(d);

		this.spinners[0].value = this.values.day;
		this.spinners[1].value = this.values.month;
		this.spinners[2].value = this.values.year;

		this.spinners[3].index = this.values.hour;
		this.spinners[4].index = this.values.minute;
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
				console.log(target.itemCount, target);
			}
		}

		this.values[label] = value;
		this.callback && this.callback();
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

function date2entries(d) {
	return {
		day: d.getDate(),
		month: d.getMonth() + 1,
		year: d.getFullYear(),
		hour: d.getHours(),
		minute: d.getMinutes()
	};
}