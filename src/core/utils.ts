export function isNumeric(value: any): boolean {
  return !isNaN(parseFloat(value)) && isFinite(value);
}

export function tryGetNumericValue(value: any): number | undefined {
  try {
    return isNumeric(value) ? parseFloat(value) : undefined;
  } catch {
    return;
  }
}
