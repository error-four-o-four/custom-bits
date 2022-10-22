let pointerTarget = null;
let animationTarget = null;

let pClientY = null;

export {
	Spinner,
	// createSpinner,
	// dragSpinner,
	// releaseSpinner
};

// function createSpinner(element) {
// 	const child = element.children[0];

// 	let itemHeight = child.children[0].clientHeight;
// 	let maxHeight = child.scrollHeight - itemHeight;

// 	let i = 0;	// current index
// 	let j = 0;	// previous index

// 	let y = itemHeight;	// position [0, -maxHeight]
// 	let vy = 0;					// velocity

// 	const updateTarget = (e) => {
// 		// set values when spinner is pressed
// 		pointerTarget = handler;
// 		pClientY = e.clientY;
// 	};

// 	const updateOffsetY = () => {
// 		// animation frame
// 		y = Math.min(0, Math.max(-maxHeight, y + vy));
// 		child.style.transform = `translateY(${itemHeight + y}px)`;
// 	};

// 	const updateIndex = () => {
// 		// update index to highlight current value
// 		i = Math.max(0, Math.round(-y / itemHeight));
// 		if (i !== j) {
// 			child.children[j].classList.remove('current');
// 			child.children[i].classList.add('current');
// 		}
// 		j = i;
// 	};

// 	// add top padding
// 	updateOffsetY();

// 	// add listener
// 	element.onpointerdown = updateTarget;
// 	child.children[0].classList.add('current');

// 	const handler = {
// 		drag(clientY) {
// 			vy = clientY - pClientY;
// 			pClientY = clientY;
// 			updateOffsetY();
// 			updateIndex();
// 		},
// 		spin() {
// 			pClientY = null;

// 			vy *= 0.9;
// 			updateOffsetY();
// 			updateIndex();

// 			if (-0.1 < vy && vy < 0.1) vy = 0;

// 			if (y === 0 || y === maxHeight) vy = 0;

// 			if (pointerTarget !== null) {
// 				animationTarget = null;
// 				return;
// 			}

// 			if (vy === 0) {
// 				window.requestAnimationFrame(animationTarget.snap);
// 				return;
// 			}

// 			window.requestAnimationFrame(animationTarget.spin);
// 		},
// 		snap() {
// 			let ty = -(i * itemHeight);
// 			let dy = ty - y;

// 			if (Math.abs(dy) < 0.5) {
// 				animationTarget === null;
// 				vy = 0;
// 				y = ty;
// 				updateOffsetY();
// 				return;
// 			}

// 			vy = 0.5 * dy;
// 			updateOffsetY();

// 			window.requestAnimationFrame(animationTarget.snap);
// 		}
// 	};
// }

// function dragSpinner(e) {
// 	if (pointerTarget === null) return;

// 	pointerTarget.drag(e.clientY);
// }

// function releaseSpinner() {
// 	if (pointerTarget === null) return;

// 	animationTarget = pointerTarget;
// 	pointerTarget = null;

// 	animateSpin();
// }

function animateSpin() {
	window.requestAnimationFrame(animationTarget.spin.bind(animationTarget));
}
function animateSnap() {
	window.requestAnimationFrame(animationTarget.snap.bind(animationTarget));
}

class Spinner {
	static drag(e) {
		if (pointerTarget === null) return;

		pointerTarget.drag(e.clientY);
	}
	static release() {
		if (pointerTarget === null) return;

		animationTarget = pointerTarget;
		pointerTarget = null;

		animateSpin();
	}
	constructor(element, index = 0) {
		this.child = element.children[0];
		this.i = index;

		this.itemHeight = this.child.children[0].clientHeight;
		this.maxHeight = this.child.scrollHeight - this.itemHeight;

		this.y = this.itemHeight;	// position [0, -maxHeight]
		this.vy = 0;							// velocity

		// add top padding
		this.updatePosition();

		// add listener
		element.onpointerdown = this.updateTarget.bind(this);
		this.child.children[0].classList.add('current');
	}
	updateTarget(e) {
		// set values when spinner is pressed
		pointerTarget = this;
		pClientY = e.clientY;
	};

	updatePosition() {
		// animation frame
		this.y = Math.min(0, Math.max(-this.maxHeight, this.y + this.vy));
		this.child.style.transform = `translateY(${this.itemHeight + this.y}px)`;
	};
	updateIndex() {
		// update index to highlight current value
		let i = Math.max(0, Math.round(-this.y / this.itemHeight));
		if (i !== this.i) {
			this.child.children[this.i].classList.remove('current');
			this.child.children[i].classList.add('current');
		}
		this.i = i;
	};

	get index() {
		return this.i;
	}
	set index(value) {
		this.y = -(value / this.child.children.length);
		this.updatePosition();
		this.updateIndex();
	}

	drag(clientY) {
		this.vy = clientY - pClientY;
		pClientY = clientY;
		this.updatePosition();
		this.updateIndex();
	}
	spin() {
		pClientY = null;

		this.vy *= 0.9;
		this.updatePosition();
		this.updateIndex();

		if (-0.1 < this.vy && this.vy < 0.1) this.vy = 0;

		if (this.y === 0 || this.y === this.maxHeight) this.vy = 0;

		if (pointerTarget !== null) {
			animationTarget = null;
			return;
		}

		if (this.vy !== 0) {
			animateSpin()
			return;
		}

		animateSnap();
	}
	snap() {
		let ty = -(this.i * this.itemHeight);
		let dy = ty - this.y;

		if (Math.abs(dy) < 0.5) {
			animationTarget === null;
			this.vy = 0;
			this.y = ty;
			this.updatePosition();
			return;
		}

		this.vy = 0.5 * dy;
		this.updatePosition();

		animateSnap();
	}
}