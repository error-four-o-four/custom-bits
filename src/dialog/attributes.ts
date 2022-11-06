
interface SelectorSettings {
	[key: string]: boolean | string | number | undefined
	min: number
	max: number
	value?: number
	// /** @todo */
	infinite?: boolean
	looping?: boolean
}

export const settings: SelectorSettings[] = [
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
		infinite: true,
	},
	{
		name: 'hour',
		min: 0, max: 23, pad: 2
	},
	{
		name: 'minute',
		min: 0, max: 59, pad: 2
	}
]