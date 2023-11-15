import { define } from '@custom-bits/core';

import { ElementTag, HTMLTestElement } from './component/index.js';

define(ElementTag, HTMLTestElement);

declare global {
	interface HTMLElementTagnameMap {
		[ElementTag]: HTMLTestElement;
	}
}
