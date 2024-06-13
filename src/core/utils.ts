/**
 * Check if value is numeric (int or decimal).
 * @param value Value of any type which is supposed to be valid number.
 * @returns true if value is valid number.
 */
export function isNumeric(value: any): boolean {
  return !isNaN(parseFloat(value)) && isFinite(value);
}

/**
 * Try converting value of any type to number.
 * @param value Value of any type which is supposed to be valid number.
 * @returns true if value is valid number otherwise returns undefined.
 */
export function tryGetNumericValue(value: any): number | undefined {
  try {
    return isNumeric(value) ? parseFloat(value) : undefined;
  } catch {
    return;
  }
}
