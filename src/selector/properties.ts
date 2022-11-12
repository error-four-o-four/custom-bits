import { constrain, fnWithArgs } from "../utils/function";

import { HTMLSelectorElement } from "./component";

export class SelectorProperties {
	[key: string]: HTMLSelectorElement | string | number | number[] | boolean | fnWithArgs
	instance: HTMLSelectorElement

	index: number

	maxHeight: number
	itemHeight: number
	velocity: number
	spinning: boolean
	snapping: boolean

	constructor(instance: HTMLSelectorElement) {
		this.instance = instance;

		this.index = 0;

		this.maxHeight = 0;
		this.itemHeight = 0;

		this.velocity = 0;
		this.spinning = false;
		this.snapping = false;
	}

	get position() {
		const y = this.instance.content.style.getPropertyValue('top');
		return (y !== '') ? parseFloat(y.replace('px', '')) : 0
	}
	set position(y: number) {
		y = constrain(y, this.maxHeight, 0);
		this.instance.content.style.top = `${y}px`;
	}

	updateItemHeight() {
		if (this.instance.content.childElementCount === 0) {
			console.warn('Wrong attributes ...');
			return;
		}
		this.itemHeight = this.instance.content.children[0].scrollHeight;
	}
	updateMaxHeight() {
		if (this.instance.shadow.childElementCount === 0) return;

		const wrapper = this.instance.shadow.getElementById('wrapper');

		if (wrapper === null) throw new Error('Something went wrong ...');

		this.maxHeight = -1 * (this.instance.content.scrollHeight - wrapper.offsetHeight);
	}

	updateItem() {
		this.instance.item?.classList.remove('current');

		const item = this.instance.content.children[this.index]

		if (item === null || item === undefined) {
			console.warn(`No item found. The value is out of bounds`);
			return;
		}

		item.classList.add('current');
		this.instance.item = item;

	}
	updatePositionByIndex() {
		this.position = -(this.index * this.itemHeight);
	}
	updatePositionByVelocity() {
		this.position = this.position + this.velocity;
	}
}
