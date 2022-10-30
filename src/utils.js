// /////////////////////////// FN UTILS

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



// /////////////////////////// DATE UTILS


export const toLocaleDate = (d) => d.toLocaleString(navigator.language, { dateStyle: 'short', timeStyle: 'short' });

export const getFirstDateOfYear = (d) => new Date(d.getFullYear(), 0, 1);

export const isLeapYear = (d) => (typeof d === 'number')
  ? new Date(d, 1, 29).getMonth() === 1
  : new Date(d.getFullYear(), 1, 29).getMonth() === 1;

export const getNumWeeksOfYear = (d) => {
  const isLeap = isLeapYear(d);
  const firstDay = getFirstDateOfYear(d);

  return (isLeap && firstDay === 3)
    ? 53
    : (firstDay === 4)
      ? 53 : 52;
};

export const getFirstDateOfMonth = (d) => new Date(d.getFullYear(), d.getMonth(), 1);

export const getNumDaysOfMonth = (month, year) => ([1, 3, 5, 7, 8, 10, 12].includes(month))
  ? 31
  : (month !== 2)
    ? 30
    : (isLeapYear(year))
      ? 29 : 28;

export const getWeek = (d) => {
  const t = new Date(d);
  t.setHours(0, 0, 0, 0);
  t.setDate(t.getDate() + 3 - (t.getDay() + 6) % 7);

  const w = new Date(t.getFullYear(), 0, 4);
  return 1 + Math.round(((d.getTime() - w.getTime()) / 86400000 - 3 + (w.getDay() + 6) % 7) / 7);
};

export const getFirstMonday = (d) => {
  const f = getFirstDateOfMonth(d);

  if (f.getDay() === 1) return f;

  f.setDate(f.getDate() - (f.getDay() + 6) % 7);

  return f;
};

export const getNextDate = (d, i = 1) => new Date(d.getFullYear(), d.getMonth(), d.getDate() + i);

export const equalDay = (a, b) => a.getDate() === b.getDate();

export const equalMonth = (a, b) => a.getMonth() === b.getMonth();

export const equalYear = (a, b) => a.getFullYear() === b.getFullYear();

export const dateToValsObj = (d) => ({
  day: d.getDate(),
  month: d.getMonth() + 1,
  year: d.getFullYear(),
  hour: d.getHours(),
  minute: d.getMinutes()
});

export const dateToValsArr = (d) => ([
  d.getDate(),
  d.getMonth() + 1,
  d.getFullYear(),
  d.getHours(),
  d.getMinutes()
]);