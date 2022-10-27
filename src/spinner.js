import { debounce } from './utils.js';

const optionsDefault = {
	min: 1,
	max: 10,
	step: 1,
	index: 0,
	name: 'default',
	callback: null
};

export class Spinner {
	constructor (parent, options) {
		options = {
			...optionsDefault,
			...options
		};

		this.name = options.name;
		this.callback = options.callback;

		this.parent = parent;
		this.element = document.createElement('div');
		this.element.classList.add('spinner', options.name);

		this.parent.appendChild(this.element);

		this.itemCount = options.max - options.min + 1;
		this.itemWraps = [];

		this.itemWraps[0] = document.createElement('div');
		for (let i = 0; i < this.itemCount; i += options.step) {
			const item = document.createElement('p');
			item.innerText = options.min + i % this.itemCount;
			this.itemWraps[0].appendChild(item);
		}
		this.itemWraps.push(this.itemWraps[0].cloneNode(true));
		this.itemWraps.push(this.itemWraps[0].cloneNode(true));
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

		this.element.addEventListener('scroll', debounce(this.snap.bind(this), 150));
	}

	get value() {
		return (this.currentItem) ? parseFloat(this.currentItem.textContent) : null;
	}

	setByIndex(relItemIndex, smooth = false) {
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
	setByValue(value, smooth = false) {
		if (typeof value !== 'string') value = `${value}`;

		const relItemIndex = [...this.itemWraps[1].children] .reduce((result, item, index) => (result > -1 || value !== item.textContent) ? result : index, -1);

		if (relItemIndex < 0) return;

		this.setByIndex(relItemIndex, smooth);
	}
	setCurrentItem() {
		this.currentItem?.classList.remove('current');

		this.currentItem = this.itemWraps[this.wrapIndex].children[this.itemIndex];
		this.currentItem.classList.add('current');
	}

	deactivateItem(index) {
		for (const itemWrap of this.itemWraps) {
			itemWrap.children[index].classList.add('deactivated');
		}
	}
	activateItem(index) {
		for (const itemWrap of this.itemWraps) {
			itemWrap.children[index].classList.remove('deactivated');
		}
	}
	observe(entries) {
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
		// console.log(this.currentItem)

		this.callback && this.callback(this.name, this.value);
	}
	snapToIndex() {

	}
}

function debug(children) {
	children[0].style.backgroundColor = '#ff000033';
	children[1].style.backgroundColor = 'transparent';
	children[2].style.backgroundColor = '#ff00ff33';
}