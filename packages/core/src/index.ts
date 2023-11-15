export const define = (
	elementTag: string,
	ElementConstructor: CustomElementConstructor
): void => {
	if (!window.customElements.get(elementTag)) {
		window.customElements.define(elementTag, ElementConstructor);
	}
};

export const cloneTemplateContent = (html: string, css = '') => {
	const template = document.createElement('template');

	if (css) template.innerHTML = ` <style>${css}</style>\n`;

	template.innerHTML += `${html}\n`;

	return template.content.cloneNode(true);
};
