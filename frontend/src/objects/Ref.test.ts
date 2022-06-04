import Ref from "./Ref"

test('ref: simple', () => {
  const ref = new Ref<string, number>();

  expect(ref.get('aaa')).toBeUndefined();
  expect(ref.get('bbb')).toBeUndefined();
  expect(ref.get('ccc')).toBeUndefined();

  ref.add('aaa', 123);
  ref.add('bbb', 345);

  expect(ref.get('aaa')).toBe(123);
  expect(ref.get('bbb')).toBe(345);
  expect(ref.get('ccc')).toBeUndefined();

  ref.add('aaa', 123);
  expect(() => ref.add('bbb', 567)).toThrow();

  expect(ref.get('aaa')).toBe(123);
  expect(ref.get('bbb')).toBe(345);
  expect(ref.get('ccc')).toBeUndefined();

  ref.remove('bbb');
  const aaa = ref.getAndRemove('aaa');

  expect(ref.get('aaa')).toBeUndefined();
  expect(aaa).toBe(123);
  expect(ref.get('bbb')).toBeUndefined();
  expect(ref.get('ccc')).toBeUndefined();
})

test('ref: arrow functions as keys and values', () => {
  const ref = new Ref<
    (a: string) => number,
    (b: string) => string
  >();

  const funcA1_1 = (a: string) => 4;
  const funcA1_2 = (a: string) => 4; // same function, different instance

  const funcA2_1 = (a: string) => 7;

  const funcB1_1 = (b: string) => 'hello';
  const funcB1_2 = (b: string) => 'hello'; // same function, different instance

  const funcB2_1 = (b: string) => 'world';

  expect(ref.get(funcA1_1)).toBeUndefined();
  expect(ref.get(funcA1_2)).toBeUndefined();
  expect(ref.get(funcA2_1)).toBeUndefined();

  ref.add(funcA1_1, funcB1_1)
  ref.add(funcA2_1, funcB2_1)

  expect(ref.get(funcA1_1)).toBe(funcB1_1);
  expect(ref.get(funcA1_2)).toBeUndefined(); // same function, different instance
  expect(ref.get(funcA2_1)).toBe(funcB2_1);

  // readding a key with the same value is not an issue
  ref.add(funcA1_1, funcB1_1);

  // readding a key with a different function => throws
  expect(() => ref.add(funcA2_1, funcB1_1)).toThrow();

  // readding a key with a different instance => throws
  expect(() => ref.add(funcA1_1, funcB1_2)).toThrow();

  expect(ref.get(funcA1_1)).toBe(funcB1_1); // unaffected
  expect(ref.get(funcA1_2)).toBeUndefined();
  expect(ref.get(funcA2_1)).toBe(funcB2_1); // unaffected

  ref.remove(funcA1_1);
  const check = ref.getAndRemove(funcA2_1);

  expect(ref.get(funcA1_1)).toBeUndefined();
  expect(ref.get(funcA1_2)).toBeUndefined();
  expect(ref.get(funcA2_1)).toBeUndefined();
  expect(check).toBe(funcB2_1);
})
