import substringAfter from "./substring-after";

describe('substringAfter', () => {
  const cases: [string?, string?, string?][] = [
    [undefined, 'aa', ''],
    ['', 'aa', ''],
    ['abc', undefined, ''],
    ['abc', '', ''],
    ['abc', ' ', ''],
    ['hello world', ' ', 'world'],
    ['abcd', 'bc', 'd'],
    ['abcd', 'a', 'bcd'],
    ['abcd', 'e', ''],
    ['abcabcabc', 'abc', 'abcabc'],
  ];

  for (const [str, fragment, expectedResult] of cases) {
    it(`when str = '${str}' and fragment = '${fragment}' the return value should be '${expectedResult}'`, () => {
      expect(substringAfter(str as string, fragment as string)).toBe(expectedResult);
    })
  }

})
