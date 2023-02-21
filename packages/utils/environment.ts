export const getSupportsTouch = (): boolean =>
  window && 'ontouchstart' in window;

export const supportsTouch = getSupportsTouch();

// Test via a getter in the options object to see if the passive property is accessed
let supportsPassive = false;
try {
  const listener = null as unknown as EventListener;
  const options = Object.defineProperty({}, 'passive', {
    get: function () {
      supportsPassive = true;
    },
  });
  window.addEventListener('testPassive', listener, options);
  window.removeEventListener('testPassive', listener, options);
} catch (e) {}

const option = (
  supportsPassive ? { passive: false } : false
) as EventListenerOptions;

const preventDefault = (ev: Event) => ev.preventDefault();

const preventDefaultForScrollKeys = (ev: KeyboardEvent) => {
  if (!deactivatedKeys.includes(ev.key)) return;

  preventDefault(ev);
  return false;
};

export const deactivateScrollWhileFocused = (
  target: HTMLElement,
  keys: string[]
) => {
  target.addEventListener('focus', deactivateScroll.bind(null, keys));
  target.addEventListener('blur', activateScroll);
};

let addedBlurHandler = false;
let scrollDeactivated = false;
let deactivatedKeys: string[];

const deactivateScroll = (keys: string[]) => {
  if (!addedBlurHandler) addBlurHandler();

  if (scrollDeactivated) return;

  scrollDeactivated = true;
  deactivatedKeys = keys;

  if (supportsTouch)
    window.addEventListener('touchmove', preventDefault, option);

  /**@todo wheel event for modal meh! */
  if (!supportsTouch && deactivatedKeys.length > 0)
    window.addEventListener('keydown', preventDefaultForScrollKeys, option);
};

const activateScroll = () => {
  if (!scrollDeactivated) return;

  if (supportsTouch)
    window.removeEventListener('touchmove', preventDefault, option);

  /**@todo wheel event for modal meh! */
  if (!supportsTouch && deactivatedKeys.length > 0)
    window.removeEventListener('keydown', preventDefaultForScrollKeys, option);

  scrollDeactivated = false;
  deactivatedKeys = [];
};

const addBlurHandler = () => {
  const blurHandler = () => window.focus();

  addedBlurHandler = true;

  supportsTouch
    ? window.addEventListener('touchstart', blurHandler)
    : window.addEventListener('mousedown', blurHandler);
};

export const addTabindexAttributes = (
  target: HTMLElement,
  index: number = 0
) => {
  if (!target.hasAttribute('role')) target.setAttribute('role', 'button');
  if (!target.hasAttribute('tabindex'))
    target.setAttribute('tabindex', `${index}`);
};
