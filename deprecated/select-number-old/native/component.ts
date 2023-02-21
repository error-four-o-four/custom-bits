import { addTabindexAttributes } from '../../utils/environment';
import { validateBoolean, validatedNumber } from './src/utils';

import { ObservedAttributes } from './types';

import { SelectorProperties } from './src/properties';

import { renderPostValueChange } from './src/renderer';
import { requestSnapAnimation } from './src/animation';
import { addListener } from './src/listener';

import cssProperties from './template.css';
// import htmlContent from './template.html?raw';

/** @logic infinite by default! */

const cssTemplate = document.createElement('template');
cssTemplate.innerHTML = `<style>${cssProperties}</style>\n`;

// const htmlTemplate = document.createElement('template');
// htmlTemplate.innerHTML = htmlContent;

export class HTMLSelectorElement extends HTMLInputElement {
  static get observedAttributes(): string[] {
    return ['pad', 'min', 'max', 'value', 'looping'];
  }

  static get formAssociated(): boolean {
    return true;
  }

  static getAttributes(target: HTMLSelectorElement): ObservedAttributes {
    return this.observedAttributes.map((attr) =>
      attr === 'looping'
        ? validateBoolean(target.getAttribute(attr))
        : validatedNumber(target.getAttribute(attr))
    ) as ObservedAttributes;
  }

  [key: string]: any;

  // private _internals: ElementInternals
  public properties: SelectorProperties;

  public shadow: ShadowRoot;

  public content: HTMLUListElement;
  public item: Element | null;

  // public onsnapend: (() => void) | null

  constructor() {
    super();

    this.properties = new SelectorProperties(this);
    // this._internals = this.attachInternals();

    this.shadow = this.attachShadow({ mode: 'open' });

    // create default content
    this.content = document.createElement('ul');
    this.content.id = 'content';

    this.item = null;

    // console.log(this._internals);
  }

  public connectedCallback(): void {
    // create content wrapper
    const wrapper = document.createElement('div');
    wrapper.id = 'wrapper';
    wrapper.appendChild(this.content);

    if (!this.hasAttribute('value')) this.setAttribute('value', this.value);

    // connect
    this.shadow.appendChild(cssTemplate.content.cloneNode(true));
    this.shadow.appendChild(wrapper);
    renderPostValueChange(this);

    // store rendered layout values (requires connection)
    this.properties.updateMaxHeight();
    this.properties.updateItemHeight();

    // propagate attributes
    this.properties.updateItem();
    this.properties.updatePositionByIndex();

    addTabindexAttributes(this);
    addListener(this);

    // console.log(this);
  }

  ////////////////////////////////////////////////////// SET GET ATTRIBUTES

  attributeChangedCallback(
    attribute: string,
    oldValue: string,
    newValue: string
  ) {
    // .setAttribute() was invoked
    if (oldValue === newValue) return;

    // return if shadow dom isn't attached yet
    if (this.shadow.childElementCount === 0) return;

    // return during animation
    if (
      attribute === 'value' &&
      (this.properties.spinning || this.properties.snapping)
    )
      return;

    // request animation
    if (attribute === 'min' || attribute === 'max') {
      const oldNum = validatedNumber(oldValue);
      const newNum = validatedNumber(newValue);

      if (
        oldNum !== null &&
        newNum !== null &&
        ((attribute === 'min' &&
          newNum < this.maxAsNumber &&
          newNum > this.valueAsNumber) ||
          (attribute === 'max' &&
            newNum > this.minAsNumber &&
            newNum < this.valueAsNumber))
      ) {
        this.addEventListener(
          'onsnapend',
          () => {
            renderPostValueChange(this);
          },
          {
            once: true,
          }
        );

        this.properties.index += newNum - oldNum;
        requestSnapAnimation(this);
        return;
      }
    }

    renderPostValueChange(this);
  }

  ////////////////////////////////////////////////////// GET SET ATTRIBUTES VIA PROPERTIES

  get min() {
    const attr = this.getAttribute('min');
    return attr !== null ? attr : '';
  }
  get minAsNumber() {
    const attr = this.getAttribute('min');
    return attr !== null ? parseInt(attr) : -Infinity;
  }

  set min(str: string) {
    this.setAttribute('min', str);
  }
  set minAsNumber(num: number) {
    this.setAttribute('min', `${num}`);
  }

  get max() {
    const attr = this.getAttribute('max');
    return attr !== null ? attr : '';
  }
  get maxAsNumber() {
    const attr = this.getAttribute('max');
    return attr !== null ? parseInt(attr) : Infinity;
  }
  set max(str: string) {
    this.setAttribute('min', str);
  }
  set maxAsNumber(num: number) {
    this.setAttribute('max', `${num}`);
  }

  get value() {
    const attr = this.getAttribute('value');
    return attr !== null ? attr : '0';
  }
  get valueAsNumber() {
    const attr = this.getAttribute('value');
    return attr !== null ? parseInt(attr) : 0;
  }
  set value(str: string) {
    this.setAttribute('value', str);
  }
  set valueAsNumber(num: number) {
    this.setAttribute('value', `${num}`);
  }

  get pad() {
    return this.getAttribute('pad') || '1';
  }
  get padAsNumber() {
    const attr = this.pad as string;
    return attr !== '' ? parseInt(attr) : 1;
  }
  set pad(value: string | number) {
    if (typeof value === 'number') value = `${value}`;
    this.setAttribute('pad', value);
  }

  get looping() {
    return this.hasAttribute('looping');
  }
  set looping(bool: boolean) {
    bool ? this.setAttribute('looping', '') : this.removeAttribute('looping');
  }

  ////////////////////////////////////////////////////// ANIMATED METHODS

  stepDown(n: number = 1): void {
    if (
      !this.looping &&
      this.minAsNumber !== -Infinity &&
      this.valueAsNumber === this.minAsNumber
    ) {
      return;
    }

    /**@todo bigger steps */

    this.properties.index -= n;
    requestSnapAnimation(this);

    // has to be called after request
    // otherwise the changes will be applied instantly
    this.valueAsNumber -= n;
  }
  stepUp(n: number = 1): void {
    if (
      !this.looping &&
      this.maxAsNumber !== Infinity &&
      this.valueAsNumber === this.maxAsNumber
    ) {
      return;
    }

    this.properties.index += n;
    requestSnapAnimation(this);

    // has to be called after request
    this.valueAsNumber += n;
  }
  stepTo(value: number) {
    const delta =
      Math.max(this.minAsNumber, Math.min(this.maxAsNumber, value)) -
      this.valueAsNumber;
    /**@todo guard clause*/
    this.properties.index += delta;
    requestSnapAnimation(this);
  }
}
