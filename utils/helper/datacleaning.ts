/**
 * Summary. Uppercase every letter in a string. E.g.: "furqon wilogo" --> "Furqon Wilogo"
 * @param {string} str
 * @returns {string} The uppercase version of that String.
 */
export const upperCaseEveryLetter = (str: string) => {
  return str.replace(/(^\w{1})|(\s+\w{1})/g, (letter) => letter.toUpperCase());
};
