// /////////////////////////// FN UTILS

// export const debounce = (func, wait) => {
//   let timeout;
//   return function () {
//     const ctxt = this,
//       args = arguments;

//     clearTimeout(timeout);
//     timeout = setTimeout(() => func.apply(ctxt, args), wait);
//   };
// };

interface fnWithArgs {
  (...args: any[]): any
}

export const debounce = (fn: fnWithArgs, ms: number = 150): () => void => {
  let timer: ReturnType<typeof setTimeout>;

  return function debouncedFn(this: any) {
    const ctxt = this;
    const args = Array.from(arguments);
    if (timer) {
      clearTimeout(timer);
    }
    timer = setTimeout(() => fn.apply(ctxt, args), ms);
  }

}


export const supportsTouch = ():boolean => {
	return window && 'ontouchstart' in window;
}


export const add = (item: any, arr: any[]) => {
	if (arr.indexOf(item) < 0) arr.push(item);
}

export const rem = (item:any, arr: any[]) => {
	const index = arr.indexOf(item);

	if (arr.length === 1 || index === arr.length - 1) {
		arr.pop();
		return;
	}

	arr[index] = arr.pop();
}



// /////////////////////////// DATE UTILS


export const toLocaleDate = (d: { toLocaleString: (arg0: string, arg1: { dateStyle: string; timeStyle: string; }) => any; }) => d.toLocaleString(navigator.language, { dateStyle: 'short', timeStyle: 'short' });

export const getFirstDateOfYear = (d: Date): Date => new Date(d.getFullYear(), 0, 1);

export const isLeapYear = (d: Date | number) => (typeof d === 'number')
  ? new Date(d, 1, 29).getMonth() === 1
  : new Date(d.getFullYear(), 1, 29).getMonth() === 1;

export const getNumWeeksOfYear = (d: Date) => {
  const isLeap = isLeapYear(d);
  const firstDay = getFirstDateOfYear(d).getDay();

  return (isLeap && firstDay === 3)
    ? 53
    : (firstDay === 4)
      ? 53 : 52;
};

export const getFirstDateOfMonth = (d: { getFullYear: () => number; getMonth: () => number; }) => new Date(d.getFullYear(), d.getMonth(), 1);

export const getNumDaysOfMonth = (month: number, year: any) => ([1, 3, 5, 7, 8, 10, 12].includes(month))
  ? 31
  : (month !== 2)
    ? 30
    : (isLeapYear(year))
      ? 29 : 28;

export const getWeek = (d: Date) => {
  const t = new Date(d);
  t.setHours(0, 0, 0, 0);
  t.setDate(t.getDate() + 3 - (t.getDay() + 6) % 7);

  const w = new Date(t.getFullYear(), 0, 4);
  return 1 + Math.round(((d.getTime() - w.getTime()) / 86400000 - 3 + (w.getDay() + 6) % 7) / 7);
};

export const getFirstMonday = (d: any) => {
  const f = getFirstDateOfMonth(d);

  if (f.getDay() === 1) return f;

  f.setDate(f.getDate() - (f.getDay() + 6) % 7);

  return f;
};

export const getNextDate = (d: Date, i: number = 1) => new Date(d.getFullYear(), d.getMonth(), d.getDate() + i);

export const equalDay = (a: Date, b: Date) => a.getDate() === b.getDate();

export const equalMonth = (a: Date, b: Date) => a.getMonth() === b.getMonth();

export const equalYear = (a: Date, b: Date) => a.getFullYear() === b.getFullYear();

interface ValsObj {
  day: number,
  month: number,
  year: number,
  hour: number,
  minute: number
}

export const dateToValsObj = (d: Date): ValsObj => ({
  day: d.getDate(),
  month: d.getMonth() + 1,
  year: d.getFullYear(),
  hour: d.getHours(),
  minute: d.getMinutes()
});

export const dateToValsArr = (d: Date): number[] => ([
  d.getDate(),
  d.getMonth() + 1,
  d.getFullYear(),
  d.getHours(),
  d.getMinutes()
]);