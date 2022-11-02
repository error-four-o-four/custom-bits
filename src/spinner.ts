// import { debounce } from './utils.js';

interface optionsDefault {
	min: number,
	max: number,
	step: number,
	index: number,
	name: string,
	looping: boolean,
	infinite: boolean,
	callback: () => void | null
}

const optionsDefault = {
	min: 1,
	max: 10,
	step: 1,
	index: 0,
	name: 'default',
	looping: false,
	infinite: false,
	callback: null
};

export class Spinner {
	name: string;
	callback: ((name: string, value: number|null) => void) | null;

	parent: HTMLElement;
	element: HTMLElement;

	itemHeight: number;
	itemCount: number;
	itemWraps: HTMLElement[];

	wrapIndex: number;
	itemIndex: number;
	currentItem: HTMLElement | null;

	io: IntersectionObserver;

	constructor(
		parent: HTMLElement,
		options: optionsDefault
	) {
		options = {
			...optionsDefault,
			...options
		};

		this.name = options.name;
		this.callback = options.callback;

		this.parent = parent;
		this.element = document.createElement('div');
		this.element.classList.add('spinner', options.name);
		this.element.setAttribute('tabindex', '0')

		this.parent.appendChild(this.element);

		this.itemCount = options.max - options.min + 1;
		this.itemWraps = [];

		this.itemWraps[0] = document.createElement('div');
		for (let i = 0; i < this.itemCount; i += options.step) {
			const item = document.createElement('p');
			item.innerText = `${options.min + i % this.itemCount}`.padStart(2, '0');
			this.itemWraps[0].appendChild(item);
		}
		this.itemWraps.push(this.itemWraps[0].cloneNode(true) as HTMLDivElement);
		this.itemWraps.push(this.itemWraps[0].cloneNode(true) as HTMLDivElement);
		for (const itemWrap of this.itemWraps) this.element.appendChild(itemWrap);

		this.itemHeight = this.itemWraps[0].children[0].scrollHeight;

		// debug(this.element.children);

		this.wrapIndex = 0;
		this.itemIndex = 0;
		this.currentItem = null;
		this.setByIndex(options.index);

		const margin = 0.5 * (this.itemWraps[0].scrollHeight - this.element.offsetHeight);
		const optionsIO = {
			root: this.element,
			rootMargin: `${margin}px 0px`,
			threshold: 0.5
		};

		this.io = new IntersectionObserver(this.observe.bind(this), optionsIO);
		for (const itemWrap of this.itemWraps) this.io.observe(itemWrap);

		// this.element.addEventListener('scroll', debounce(this.snap.bind(this), 150));
	}

	get value() {
		if (this.currentItem === null) {
			throw new Error("Current Item is null");
		}

		return (this.currentItem?.textContent)
			? parseFloat(this.currentItem.textContent)
			: null;
	}

	setByIndex(
		relItemIndex: number,
		smooth: boolean = false
	) {
		const newScrollTop = (relItemIndex + this.itemCount - 1) * this.itemHeight;

		this.wrapIndex = 1;
		this.itemIndex = Math.max(0, Math.min(this.itemCount - 1, relItemIndex));
		this.setCurrentItem()

		if (smooth) {
			this.element.scrollTo({
				top: newScrollTop,
				behavior: 'smooth'
			})
			return;
		}

		this.element.scrollTop = newScrollTop;
	}
	setByValue(
		value: string,
		smooth: boolean = false
	) {
		if (typeof value !== 'string') value = `${value}`.padStart(2, '0');

		// console.log(value)

		const relItemIndex = Array.from(this.itemWraps[1].children).reduce((result, item, index) => (result > -1 || value !== item.textContent) ? result : index, -1);

		if (relItemIndex < 0) return;

		this.setByIndex(relItemIndex, smooth);
	}
	setCurrentItem() {
		this.currentItem?.classList.remove('current');

		this.currentItem = this.itemWraps[this.wrapIndex].children[this.itemIndex] as HTMLParagraphElement;
		this.currentItem.classList.add('current');
	}

	deactivateItem(index: number) {
		for (const itemWrap of this.itemWraps) {
			itemWrap.children[index].classList.add('deactivated');
		}
	}
	activateItem(index: number) {
		for (const itemWrap of this.itemWraps) {
			itemWrap.children[index].classList.remove('deactivated');
		}
	}
	observe(entries: IntersectionObserverEntry[]) {
		if (this.element.scrollTop === 0) {
			this.element.scrollTop = this.itemWraps[0].scrollHeight - this.itemHeight;
			return;
		}

		for (const entry of entries) {
			if (entry.target === this.element.firstElementChild
				|| entry.target === this.element.lastElementChild) continue;

			if (entry.intersectionRatio > 0.5) continue;

			/**@GAAAAHHRGH different logic on mobile and desktop*/
			if (entry.boundingClientRect.y < 0) {
				// this.element.appendChild(this.element.removeChild(this.element.firstElementChild));
				this.element.scrollTop -= this.itemWraps[0].scrollHeight;
				continue;
			}
			else {
				// this.element.insertBefore(this.element.removeChild(this.element.lastElementChild), this.element.firstElementChild);
				this.element.scrollTop += this.itemWraps[0].scrollHeight;
				continue;
			}
		}
	}
	snap() {
		const eltScrollTop = this.element.scrollTop + 1.5 * this.itemHeight;
		const absItemIndex = Math.floor(eltScrollTop / this.itemHeight);
		const newScrollTop = absItemIndex * this.itemHeight - this.itemHeight;

		if (this.element.scrollTop === newScrollTop) return;

		this.element.scrollTo({
			top: newScrollTop,
			behavior: 'smooth'
		});

		this.wrapIndex = Math.floor(absItemIndex / this.itemCount);
		this.itemIndex = absItemIndex % this.itemCount;
		this.setCurrentItem();

		// if (this.callback === null) return;

		this.callback && this.callback(this.name, this.value);
	}
}
