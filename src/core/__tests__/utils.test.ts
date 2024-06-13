import { tryGetNumericValue } from '../utils';

describe('tryGetNumericValue', function () {
  describe('should try to get number from input value of any', function () {
    it.each`
      input        | result
      ${0}         | ${0}
      ${1}         | ${1}
      ${10}        | ${10}
      ${112.456}   | ${112.456}
      ${1e3}       | ${1000}
      ${0.3}       | ${0.3}
      ${{}}        | ${undefined}
      ${NaN}       | ${undefined}
      ${undefined} | ${undefined}
      ${''}        | ${undefined}
      ${true}      | ${undefined}
      ${[]}        | ${undefined}
      ${'text'}    | ${undefined}
    `('and return number id it is numeric value or undefined', ({ input, result }) => {
      expect(tryGetNumericValue(input)).toEqual(result);
    });
  });
});
