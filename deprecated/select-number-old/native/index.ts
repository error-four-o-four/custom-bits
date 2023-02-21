import { HTMLSelectorElement } from './component';

window.customElements.define('ui-number', HTMLSelectorElement, {
  extends: 'input',
});

declare global {
  interface HTMLElementTagnameMap {
    'ui-number': HTMLSelectorElement;
  }
}

declare global {
  interface HTMLElementEventMap {
    onsnapend: CustomEvent;
  }
}
