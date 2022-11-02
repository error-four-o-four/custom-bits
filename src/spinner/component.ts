// import * as stylesheet from './base.component.css';
// const template = document.createElement('template');

import {
	addListener
} from './listener';

import {
	requestAnimation,
	reposition,
	loop
} from './animation';

import * as stylesheet from './spinner.css';

const style = document.createElement('template');
style.innerHTML = `<style>${stylesheet.default}</style>\n`;

const requiredAttributes = {
	min: 0,
	max: 10,
}

const optionalAttributes = [
	'looping',
	'infinite'
]

export class HTMLSpinnerElement extends HTMLElement {
	static get observedAttributes(): string[] {
		return ['min', 'max', 'looping']
	}
	private shadow: ShadowRoot

	public maxHeight: number
	public itemHeight: number

	// private name: string | null

	public velocity: number
	public itemCount: number
	public itemIndex: number
	public currentItem: HTMLElement | null;

	public looping: boolean
	public infinite: boolean
	public spinning: boolean
	public snapping: boolean
	public content: HTMLElement;

	constructor() {
		super();

		// this.name = 'default';

		this.maxHeight = 0;
		this.itemHeight = 0;
		this.looping = false;
		this.infinite = false;

		this.velocity = 0;
		this.itemCount = 0;
		this.itemIndex = 0;
		this.currentItem = null;

		this.spinning = false;
		this.snapping = false;

		this.shadow = this.attachShadow({ mode: 'open' });

		this.content = document.createElement('div');
		this.content.setAttribute('id', 'content');
	}

	public connectedCallback(): void {
		this.shadow.appendChild(style.content.cloneNode(true));

		const wrapper = document.createElement('div');
		wrapper.setAttribute('id', 'wrapper');
		wrapper.appendChild(this.content);

		this.shadow.appendChild(wrapper);

		/**@todo */
		// https://developer.mozilla.org/en-US/docs/Web/API/ShadowRoot/delegatesFocus
		// https://nolanlawson.com/2021/02/13/managing-focus-in-the-shadow-dom/
		if (!this.hasAttribute('role')) this.setAttribute('role', 'button');
		if (!this.hasAttribute('tabindex')) this.setAttribute('tabindex', '1');


		// get/set required attributes
		for (const key in requiredAttributes) {
			const value = (this.hasAttribute(key))
				? this.getAttribute(key)
				: requiredAttributes[key as keyof typeof requiredAttributes]
			this.setAttribute(key, `${value}`)
		}
		// get/set optional attributes
		for (const key of optionalAttributes) {
			if (this.hasAttribute(key)) {
				/**@todo */
				//@ts-ignore
				this[key] = true;
			}
		}

		// create items based on min max attributes
		const max = parseInt(this.getAttribute('max') as string)
		const min = parseInt(this.getAttribute('min') as string)
		this.itemCount = max - min + 1;

		for (let i = 0; i < this.itemCount; i += 1) {
			const item = document.createElement('span');
			item.innerText = `${min + i % this.itemCount}`.padStart(2, '0');
			this.content.appendChild(item);
		}

		this.itemHeight = this.content.children[0].scrollHeight;
		this.maxHeight = -1 * (this.content.scrollHeight - wrapper.offsetHeight);

		/**@todo getAttribute index and set itemIndex */
		// this.itemIndex = 0;

		this.setCurrentItem();
		// handle animations globally/functionally
		reposition(this);

		// add one global listener
		addListener(this);
	}

	////////////////////////////////////////////////////// SET GET ANIMATION

	public get top() {
		const y = this.content.style.getPropertyValue('top');
		return (y !== '') ? parseFloat(y.replace('px', '')) : 0
	}
	public set top(y: number) {
		this.content.style.top = `${y}px`;
	}
	public get bottom() {
		return this.maxHeight - this.top;
	}

	////////////////////////////////////////////////////// SET GET VALUES

	public setCurrentItem() {
		this.currentItem?.classList.remove('current');
		this.currentItem = this.content.children[this.itemIndex] as HTMLElement;
		this.currentItem.classList.add('current');
	}

	public setIndex(index: number, snapping: boolean = false) {
		this.itemIndex = Math.max(0, Math.min(this.itemCount - 1, index));

		if (snapping) {
			this.snapping = true;
			requestAnimation(this);
			return;
		}

		this.top = -(this.itemIndex * this.itemHeight);
		this.setCurrentItem();

		if (!this.looping && !this.infinite) return;

		loop(this);
	}

	public setValue(value: string, snapping: boolean = false) {
		const index = Array.from(this.content.children).reduce((result, child, index) => (result >= 0 || child.textContent !== value) ? result : index, -1);

		if (index < 0) return;

		this.setIndex(index, snapping)

	}

	// deactivateItem(index: number)_itemCount {
	// 	for (const itemWrap of this._itemWraps) {
	// 		itemWrap.children[index].classList.add('deactivated');
	// 	}
	// }
	// activateItem(index: number) {
	// 	for (const itemWrap of this._itemWraps) {
	// 		itemWrap.children[index].classList.remove('deactivated');
	// 	}
	// }
}