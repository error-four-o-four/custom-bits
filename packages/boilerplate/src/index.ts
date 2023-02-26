import { ElementTag, HTMLTestElement } from './component/index';

if (!window.customElements.get(ElementTag)) {
  window.customElements.define(ElementTag, HTMLTestElement);
}

declare global {
  interface HTMLElementTagnameMap {
    [ElementTag]: HTMLTestElement;
  }
}
