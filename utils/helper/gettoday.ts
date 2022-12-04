/**
 * Summary. Get today's date in long version. e.g. "3 November 1997"
 * @returns {string} Long Date.
 */
export function getTodayLong() {
  const today = new Date();
  const monthNames = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];
  const date = today.getDate();
  const month = monthNames[today.getMonth()];
  const year = today.getFullYear();

  return `${date} ${month} ${year}`;
}

/**
 * Summary. Get today's date in short version. "2022-11-03"
 * @returns {string} Short date
 */
export function getTodayShort() {
  const today = new Date();

  return `${today.getFullYear()}-${today.getMonth() + 1}-${
    today.getDate() < 10 ? `0${today.getDate()}` : today.getDate()
  }`;
}
