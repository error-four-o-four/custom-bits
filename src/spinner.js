import { debounce } from './utils.js';

const optionsDefault = {
	min: 1,
	max: 10,
	step: 1,
	index: 0,
	label: 'default',
	callback: null
};

export function createSpinner(parent, options = optionsDefault) {
	return new Spinner(parent, options);
}

export class Spinner {
	constructor (parent, options) {
		this.parent = parent;

		options = {
			...optionsDefault,
			...options
		};

		this.itemCount = options.max - options.min + 1;
		this.itemHeight = null;

		this.label = options.label;
		this.callback = options.callback;

		this.element = document.createElement('div');
		this.parent.appendChild(this.element);

		const wrap = document.createElement('div');
		for (let i = 0; i < this.itemCount; i += options.step) {
			const item = document.createElement('p');
			item.innerText = options.min + i % this.itemCount;
			wrap.appendChild(item);
		}
		this.element.appendChild(wrap);
		this.element.appendChild(wrap.cloneNode(true));
		this.element.appendChild(wrap.cloneNode(true));
		this.element.classList.add('spinner', options.label);

		this.itemHeight = this.element.children[0].children[0].scrollHeight;

		this.wrapIndex = 0;
		this.itemIndex = 0;
		this.index = options.index;

		const margin = 0.5 * (this.element.children[0].scrollHeight - this.element.offsetHeight);
		const optionsIO = {
			root: this.element,
			rootMargin: `${margin}px 0px`,
			threshold: 0.5
		};

		this.io = new IntersectionObserver(this.observe.bind(this), optionsIO);
		for (const child of this.element.children) this.io.observe(child);

		this.element.addEventListener('scroll', debounce(this.snap.bind(this), 150));
	}
	set index(relItemIndex) {
		const newScrollTop = (relItemIndex + this.itemCount - 1) * this.itemHeight;

		this.element.children[this.wrapIndex].children[this.itemIndex].classList.remove('current');
		this.element.children[1].children[relItemIndex].classList.add('current');

		this.wrapIndex = 1;
		this.itemIndex = relItemIndex;
		this.element.scrollTop = newScrollTop;
	}
	get index() {
		return this.relItemIndex;
	}

	set value(content) {
		let relItemIndex = -1;

		if (typeof content !== 'string') content = `${content}`;

		for (const [index, child] of [...this.element.children[1].children].entries()) {
			if (content !== child.textContent) continue;
			relItemIndex = index;
		}

		if (relItemIndex < 0) return;

		this.index = relItemIndex;
	}
	get value() {
		// const current = this.element.getElementsByClassName('current')[0];
		const current = this.element.children[this.wrapIndex].children[this.itemIndex];
		return (current) ? parseFloat(current.textContent) : null;
	}

	deactivateItem(index) {
		for (const child of this.element.children) {
			child.children[index].classList.add('deactivated')
		}
	}
	activateItem(index) {
		for (const child of this.element.children) {
			child.children[index].classList.remove('deactivated')
		}
	}
	observe(entries) {
		if (this.element.scrollTop === 0) {
			this.element.scrollTop = this.element.children[0].scrollHeight - this.itemHeight;
			return;
		}

		for (const entry of entries) {
			if (entry.target === this.element.firstElementChild
				|| entry.target === this.element.lastElementChild) continue;

			if (entry.intersectionRatio > 0.5) continue;

			if (entry.boundingClientRect.y < 0) {
				this.element.appendChild(this.element.removeChild(this.element.firstElementChild));
				continue;
			}
			else {
				this.element.insertBefore(this.element.removeChild(this.element.lastElementChild), this.element.firstElementChild);
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
		})

		this.wrapIndex = Math.floor(absItemIndex / this.itemCount);
		this.itemIndex = absItemIndex % this.itemCount;

		const previous = this.element.getElementsByClassName('current')[0];
		previous && previous.classList.remove('current');

		const current = this.element.children[this.wrapIndex].children[this.itemIndex];
		current && current.classList.add('current');

		this.callback && this.callback(this.label, this.value);
	}
	snapToIndex() {

	}
}