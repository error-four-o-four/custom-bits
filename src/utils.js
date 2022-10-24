export const throttle = (func, limit) => {
  let throttled;
  return function() {
    const ctxt = this,
      args = arguments;
    if (!throttled) {
      func.apply(ctxt, args);
      throttled = true;
      setTimeout(() => throttled = false, limit)
    }
  }
}

export const debounce = (func, wait) => {
  let timeout;
  return function() {
    const ctxt = this,
      args = arguments;

    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(ctxt, args), wait);
  };
}