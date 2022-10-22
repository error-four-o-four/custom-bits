const optionsDefault = {
	min: 1,
	max: 12,
	step: 1,
	index: 0,
};
const animationTargets = [];
let pointerTarget = null;

let isAnimating = false;
let pClientY = null;

function add(item, arr) {
	if (arr.indexOf(item) < 0) arr.push(item);
}

function rem(item, arr) {
	const index = arr.indexOf(item);

	if (arr.length === 1 || index === arr.length - 1) {
		arr.pop();
		return;
	}

	arr[index] = arr.pop();
}

function animate() {
	if (!isAnimating) isAnimating = true;

	for (const target of animationTargets) {
		if (target === null) {
			rem(target, animationTargets);
			continue;
		}

		// set transform
		target.animate();

		if (target.spinning) continue;

		if (target.snapping) continue;

		// remove element when the animation has finished
		rem(target, animationTargets);
	}

	if (animationTargets.length === 0) isAnimating = false;

	// exit draw loop
	if (!isAnimating) return;

	// request draw
	window.requestAnimationFrame(animate);
}

export class Spinner {
	static pressed(target, e) {
		pointerTarget = target;
		pClientY = e.clientY;
	}
	static drag(e) {
		if (pointerTarget === null) return;

		pointerTarget.drag(e.clientY - pClientY);
		pClientY = e.clientY;
	}
	static release() {
		if (pointerTarget === null) return;

		// avoid invoking multiple callbacks
		add(pointerTarget, animationTargets);

		pointerTarget.spinning = true;
		pointerTarget = null;
		pClientY = null;

		if (isAnimating) return;

		animate();
	}
	static animate(target, index) {
		add(target, animationTargets);

		// set state
		target.setIndex(index);
		target.snapping = true;

		if (isAnimating) return;

		animate();
	}

	// ///////////////////////////////////////////// //

	constructor (element, options = {}) {
		options = {
			...optionsDefault,
			...options
		};

		this.callback = null;

		// properties
		this.i = 0;
		this.y = 0;		// position [0, -maxHeight]
		this.vy = 0;	// velocity
		this.spinning = false;
		this.snapping = false;

		// create elements
		this.wrap = document.createElement('ul');
		this.wrap.classList.add('no-select', 'spinner');

		this.values = [];
		for (let i = options.min; i <= options.max; i += options.step) {
			const item = document.createElement('li');
			item.textContent = i;
			this.wrap.appendChild(item);
			this.values.push(i);
		}

		// append created element
		element.appendChild(this.wrap);

		// add listener
		element.onpointerdown = this.constructor.pressed.bind(null, this);

		this.itemHeight = this.wrap.children[0].clientHeight;
		this.setPositionByIndex(options.index);
	}

	get numChildren() {
		const activeChildren = (child) => !child.classList.contains('deactivated');
		return [...this.wrap.children].filter(activeChildren).length - 1;
	}
	get maxHeight() {
		return this.numChildren * this.itemHeight;
		// return this.wrap.scrollHeight - this.itemHeight;
	}

	get value() {
		return this.values[this.i];
	}

	// ///////////////////////////////////////////// //

	// setCustomEvent(listener, event) {
	// 	this.listener = listener;
	// 	this.event = event;
	// }

	setCallback(callback) {
		this.callback = callback;
	}

	activateItem(index) {
		this.wrap.children[index].classList.remove('deactivated');
	}
	deactivateItem(index) {
		this.wrap.children[index].classList.remove('current');
		this.wrap.children[index].classList.add('deactivated');
	}

	setIndex(index) {
		this.wrap.children[this.i].classList.remove('current');
		this.i = Math.max(0, Math.min(this.numChildren, index));
		this.wrap.children[this.i].classList.add('current');
	}
	setPositionByIndex(index) {
		this.setIndex(index);
		this.y = (this.i / this.numChildren) * -this.maxHeight;
		this.updateTransform();
	}
	setPositionByValue(value) {
		const index = this.values.indexOf(value);
		this.setPositionByIndex(index);
	}

	updateTransform() {
		// animation frame
		// use absolute height
		const h = -(this.wrap.scrollHeight - this.itemHeight);
		this.y = Math.min(0, Math.max(h, this.y + this.vy));
		this.wrap.style.transform = `translateY(${this.itemHeight + this.y}px)`;
	};
	updateIndex() {
		// update index to highlight current value
		let i = Math.max(0, Math.round(-this.y / this.itemHeight));
		if (i !== this.i) {
			this.wrap.children[this.i].classList.remove('current');
			this.wrap.children[i].classList.add('current');
		}
		this.i = i;
	};

	// ///////////////////////////////////////////// //

	drag(vy) {
		this.vy = vy;
		this.updateTransform();
		this.updateIndex();
	}

	animate() {
		if (this.spinning) {
			this.spin();
			return;
		}

		this.snap();
	}
	spin() {
		this.vy *= 0.9;
		this.updateTransform();
		this.updateIndex();

		if (-0.1 < this.vy && this.vy < 0.1) this.vy = 0;

		if (this.y === 0 || this.y === -this.maxHeight) this.vy = 0;

		if (this.vy !== 0) return;

		this.spinning = false;
		this.snapping = true;
	}
	snap() {
		let ty = -(this.i * this.itemHeight);
		let dy = ty - this.y;

		if (Math.abs(dy) < 0.5) {
			this.vy = 0;
			this.y = ty;
			this.snapping = false;

			this.callback && this.callback();
			// if (this.listener && this.event) {
			// 	this.listener.dispatchEvent(this.event);
			// }
		}
		else {
			this.vy = 0.1 * dy;
		}

		this.updateTransform();
	}
}