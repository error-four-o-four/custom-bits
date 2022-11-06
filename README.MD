# Fancy Web Components

## Todo

- [ ] Build Components
	- [x] Number Selector
		- [ ] attribute `name`
		- [x] ~~use `.toggleAttribute()` => booleans~~
		- [x] implement `.stepUp()` and `.stepDown()`
		- [x] ~~validate min/max when infinite~~\
		~~infinite => inifinite-start/infinite-end~~\
		use offset property
	- [ ] String Selector (with slots)
	- [ ] Proto Selector (?)
	- [x] Calendar
	- [ ] Dialog

- [ ] Improve Disable scoll (global boolean vs attached event listeners)
- [ ] Make use of `.attachInternals()`
- [ ] Doublecheck CSS
 - [ ] focus transition template

- [ ] Make library Build

## Resources

### Typescript
[Typescript DOM Manipulation](https://www.typescriptlang.org/docs/handbook/dom-manipulation.html)

### Focus
[mdn | Delegate Focus](https://developer.mozilla.org/en-US/docs/Web/API/ShadowRoot/delegatesFocus)
[nolanloawson | Managing Focus in the Shadow DOM](https://nolanlawson.com/2021/02/13/managing-focus-in-the-shadow-dom/)

### Events
[github | passive event listners](https://github.com/WICG/EventListenerOptions/blob/gh-pages/explainer.md)\
[Stackoverflow | disable scroll](https://stackoverflow.com/questions/4770025/how-to-disable-scrolling-temporarily/)\
[javascript.info | Shadow DOM and events](https://javascript.info/shadow-dom-events)\
[Event bus](https://pineco.de/creating-a-javascript-event-bus/)

### Attributes and Properties
[lamplightdev.com](https://lamplightdev.com/blog/2020/04/30/whats-the-difference-between-web-component-attributes-and-properties/)
[lamplightdev.com | boolean](https://lamplightdev.com/blog/2021/04/29/how-to-use-boolean-attributes-in-web-components/)

### Data Handling
[medium | Handling data with web components](https://itnext.io/handling-data-with-web-components-9e7e4a452e6e)\
[web.dev | Defining a form-associated custom element](https://web.dev/more-capable-form-controls/#defining-a-form-associated-custom-element)\
[interface HTMLInputElement](https://microsoft.github.io/PowerBI-JavaScript/interfaces/_node_modules_typedoc_node_modules_typescript_lib_lib_dom_d_.htmlinputelement.html#valueasdate)\
[html spec type=data](https://html.spec.whatwg.org/multipage/input.html#date-state-(type=date))

### Accessibility
[ARIA Authoring Practices Guide (APG) | patterns](https://www.w3.org/WAI/ARIA/apg/patterns/)
