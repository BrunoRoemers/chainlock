import isEmpty from "./is-empty";

describe('isEmpty', () => {
  
  it('returns true when string = undefined', () => {
    expect(isEmpty(undefined)).toBe(true);
  })

  it('returns true when string = <empty string>', () => {
    expect(isEmpty('')).toBe(true);
  })

  it('returns false when string = <single space>', () => {
    expect(isEmpty(' ')).toBe(false);
  })

  it('returns false when string = <multiple spaces>', () => {
    expect(isEmpty('   ')).toBe(false);
  })

  it('returns false when string = abc', () => {
    expect(isEmpty('abc')).toBe(false);
  })
  
})
