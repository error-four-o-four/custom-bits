import { addTabindexAttributes } from '../utils/environment';

import { getIndexOfValue, sanitizeNumberAsString, sanitizeStringAsNumber } from './utils';
import { requestAnimation, loop, setPosition } from './animation';
import { addListener } from './listener';

import cssProperties from './template.css';
import { constrain } from '../utils/function';
// import htmlContent from './template.html?raw';

const cssTemplate = document.createElement('template');
cssTemplate.innerHTML = `<style>${cssProperties}</style>\n`;

// const htmlTemplate = document.createElement('template');
// htmlTemplate.innerHTML = htmlContent;

interface ElementAttributes {
	[key: string]: boolean | string | number
	index: number
	// reflected as attributes
	value: string
	min: number
	max: number
	off: number
	looping: boolean
	infinite: boolean
	pad: number
}

const defaultAttributes: ElementAttributes = {
	index: 0,
	value: '0',
	min: 0,
	max: 9,
	off: 10,
	looping: false,
	infinite: false,
	pad: 1,
}

export class HTMLSelectorElement extends HTMLInputElement {
	static get observedAttributes(): string[] {
		return ['min', 'max', 'value', 'pad', 'looping', 'infinite']
	}
	static get formAssociated() { return true; }

	private _internals: ElementInternals
	private _properties: ElementAttributes

	public shadow: ShadowRoot
	public content: HTMLUListElement;

	public maxHeight: number
	public itemHeight: number
	public velocity: number
	public spinning: boolean
	public snapping: boolean

	public item: HTMLElement | null

	constructor() {
		super();

		this.maxHeight = 0;
		this.itemHeight = 0;
		this.velocity = 0;
		this.spinning = false;
		this.snapping = false;

		this.item = null;

		// this.name = 'default';
		this._internals = this.attachInternals();
		this._properties = { ...defaultAttributes };

		this.shadow = this.attachShadow({ mode: 'open' });

		this.content = document.createElement('ul');
		this.content.id = 'content';

		console.log(this._internals.shadowRoot)
	}

	public connectedCallback(): void {
		const wrapper = document.createElement('div');
		wrapper.id = 'wrapper';

		this.shadow.appendChild(cssTemplate.content.cloneNode(true));
		this.shadow.appendChild(wrapper);

		wrapper.appendChild(this.content);

		addTabindexAttributes(this);

		if (!this.infinite) {
			const ii = this._properties.max - this._properties.min + 1;

			for (let i = 0; i < ii; i += 1) {
				const item = document.createElement('li');
				item.innerText = `${this._properties.min + i}`.padStart(this._properties.pad, '0');
				this.content.appendChild(item);
			}
		}
		else {
			const min = this.valueAsNumber - this._properties.off;
			const max = this.valueAsNumber + this._properties.off;

			for (let i = min; i < max; i += 1) {
				const item = document.createElement('li');
				item.innerText = sanitizeNumberAsString(i, this._properties.pad)
				this.content.appendChild(item);
			}
		}

		this.maxHeight = -1 * (this.content.scrollHeight - wrapper.offsetHeight);
		this.itemHeight = this.content.children[0].scrollHeight;

		setValue(this, this.value)

		// handle animations globally/functionally
		if (this.looping || this.infinite) loop(this);

		addListener(this);
	}

	////////////////////////////////////////////////////// SET GET ATTRIBUTES

	attributeChangedCallback(attribute: string, oldValue: string, newValue: string) {
		// called when
		// tag has attribute e.g. 'looping'
		// .setAttribute() was invoked
		if (oldValue === newValue) return;

		if (typeof this._properties[attribute] === 'boolean') {
			// looping, infinite
			this._properties[attribute] = (newValue === '') ? true : false;
		}

		if (typeof this._properties[attribute] === 'string') {
			// name, value
			this._properties[attribute] = newValue;
		}

		// if (attribute === 'value') {
		// 	let num = sanitizeStringAsNumber(newValue);

		// 	if (num === null) throw new Error(`Not a valid ${attribute} value: ${newValue}`);

		// 	let val = `${num}`.padStart(this._properties.pad, '0');
		// 	this._properties.index = Math.max(
		// 		this._properties.min, Math.min(
		// 			this._properties.max, getIndexOfValue(this, val)
		// 		)
		// 	)
		// }

		if (typeof this._properties[attribute] === 'number') {
			const num = sanitizeStringAsNumber(newValue);

			if (num === null) throw new Error(`Not a valid ${attribute} value: ${newValue}`);

			this._properties[attribute] = num;
		}
	}

	////////////////////////////////////////////////////// GET SET ATTRIBUTES VIA PROPERTIES

	get min() {
		return `${this._properties.min}`;
	}
	get minAsNumber() {
		return this._properties.min;
	}
	set min(val: string) {
		const num = sanitizeStringAsNumber(val);
		if (num !== null) this.minAsNumber = num;
	}
	set minAsNumber(num: number) {
		this.setAttribute('min', `${num}`);
	}

	get max() {
		return `${this._properties.max}`;
	}
	get maxAsNumber() {
		return this._properties.max;
	}
	set max(val: string) {
		const num = sanitizeStringAsNumber(val);
		if (num !== null) this.maxAsNumber = num;
	}
	set maxAsNumber(num: number) {
		this.setAttribute('max', `${num}`);
	}

	get value() {
		return `${this._properties.value}`.padStart(this.pad, '0');
	}
	get valueAsNumber() {
		return parseInt(this._properties.value);
	}
	set value(val: string) {
		let num = sanitizeStringAsNumber(val);

		if (!this.infinite) num = constrain(num, this._properties.min, this._properties.max)

		val = sanitizeNumberAsString(num, this._properties.pad);

		setValue(this, val);
		this.setAttribute('value', val)
	}
	set valueAsNumber(num: number) {
		let val;

		if (!this.infinite) num = constrain(num, this._properties.min, this._properties.max);
		val = sanitizeNumberAsString(num, this._properties.pad);

		setValue(this, val);
		this.setAttribute('value', val)
	}

	get pad() {
		return this._properties.pad;
	}
	set pad(num: number) {
		this.setAttribute('pad', `${num}`);
	}

	get looping() {
		return this._properties.looping;
	}
	set looping(bool: boolean) {
		(bool) ? this.setAttribute('looping', '') : this.removeAttribute('looping');
	}
	get infinite() {
		return this._properties.infinite;
	}
	set infinite(bool: boolean) {
		(bool) ? this.setAttribute('infinite', '') : this.removeAttribute('infinite');
	}

	////////////////////////////////////////////////////// PROPERTIES

	get itemCount() {
		return this.content.children.length
	}
	get itemIndex() {
		return this._properties.index;
	}
	set itemIndex(num: number) {
		this._properties.index = constrain(num, 0, this.itemCount - 1);

		this.item?.classList.remove('current');
		this.item = this.content.children[this._properties.index] as HTMLElement;
		this.item.classList.add('current');

		this.setAttribute('value', this.item.innerText);
	}

	////////////////////////////////////////////////////// ANIMATED METHODS

	stepDown(n: number = 1): void {
		this.itemIndex -= n;
		this.snapping = true;
		requestAnimation(this)
	}
	stepUp(n: number = 1): void {
		this.itemIndex += n;
		this.snapping = true;
		requestAnimation(this)
	}
	stepTo() {

	}
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

function setValue(target: HTMLSelectorElement, value: string): void {
	target.itemIndex = getIndexOfValue(target, value);
	setPosition(target, -(target.itemIndex * target.itemHeight))

	if (!target.looping) return;

	loop(target);
}

