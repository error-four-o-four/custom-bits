export const throttle = (func, limit) => {
  let throttled;
  return function () {
    const ctxt = this,
      args = arguments;
    if (!throttled) {
      func.apply(ctxt, args);
      throttled = true;
      setTimeout(() => throttled = false, limit);
    }
  };
};

export const debounce = (func, wait) => {
  let timeout;
  return function () {
    const ctxt = this,
      args = arguments;

    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(ctxt, args), wait);
  };
};


export const getNumDays = (month, year) => ([1, 3, 5, 7, 8, 10, 12].includes(month))
  ? 31
  : (month !== 2)
    ? 30
    : (new Date(year, 1, 29).getMonth() === 1)
      ? 29 : 28;


export const date2entries = (d) => ({
  day: d.getDate(),
  month: d.getMonth() + 1,
  year: d.getFullYear(),
  hour: d.getHours(),
  minute: d.getMinutes()
});