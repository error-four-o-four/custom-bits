import rawHtml from '../templates/template.html?raw';
import rawCss from '../templates/template.css?inline';

const template = document.createElement('template');
template.innerHTML = `<style>${rawCss}</style>${rawHtml}\n`;

console.log('morp');

export const ElementTag = 'test-element';

export class HTMLTestElement extends HTMLElement {
  public shadow: ShadowRoot;

  public wrap: HTMLSpanElement;

  constructor() {
    super();
    this.shadow = this.attachShadow({ mode: 'open' });
    this.shadow.appendChild(template.content.cloneNode(true));
    this.wrap = this.shadow.lastElementChild as HTMLSpanElement;
  }

  public connectedCallback(): void {
    const name = this.getAttribute('name') || 'World';
    this.wrap.textContent = `Hellooooo ${name}`;
  }
}
