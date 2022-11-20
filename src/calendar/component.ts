import cssProperties from './template.css';

import { addListener } from './listener';
import { addTabindexAttributes } from '../utils/environment';

import { renderContent, updateCells, updateCurrentCell } from './renderer';

const cssTemplate = document.createElement('template');
cssTemplate.innerHTML = `<style>${cssProperties}</style>\n`;

export class HTMLCalendarElement extends HTMLInputElement {
	static formAssociated = true;

	private _internals: ElementInternals
	private _value: Date

	public shadow

	public cells: HTMLSpanElement[]
	public cell: HTMLSpanElement | null

	constructor() {
		super()
		this._internals = this.attachInternals()
		this._value = new Date()

		this.shadow = this.attachShadow({ mode: 'open' });

		this.cells = [];
		this.cell = null;

		console.log(this._internals);
	}

	public connectedCallback(): void {
		// create content wrapper
		const wrapper = document.createElement('div');
		wrapper.id = 'wrapper';
		wrapper.innerHTML = renderContent();

		// connect
		this.shadow.appendChild(cssTemplate.content.cloneNode(true));
		this.shadow.appendChild(wrapper);

		const body = wrapper.querySelector('.cal-body') as HTMLDivElement;
		this.cells = Array.from(body.children) as HTMLSpanElement[];

		updateCells(this.cells, this._value);
		updateCurrentCell(this);

		addTabindexAttributes(this);
		addListener(this);
	}

	/**@todo attributeChangedCallback */

	public get value() {
		return this._value?.toISOString().split('T')[0] || ''
	}
	public set value(value: string) {
		if (!value.match(/\d{4}-\d{1,2}-\d{1,2}/)) return

		this._value = new Date(value);
		this._value.setHours(0, 0);
	}
	public get valueAsDate() {
		return new Date(this._value);
	}
	public set valueAsDate(value: Date) {
		if (!(value instanceof Date)) return;

		this._value = value;
	}
}