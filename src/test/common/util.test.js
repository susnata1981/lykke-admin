import { isInt, isFloat, isNumber } from '../../common/util';

/**
 * isInt
 */
test('1002 is an integer', () => {
  expect(isInt(1002)).toBe(true);
});

test('"1002" is an integer', () => {
  expect(isInt("1002")).toBe(true);
});

test('1002.32 is not an integer', () => {
  expect(isInt(1002.32)).toBe(false);
});

test('123ba in not an integer', () => {
  expect(isInt('123ba')).toBe(false);
});

test('12a3 in not an integer', () => {
  expect(isInt('123ba')).toBe(false);
});

/**
 * isFloat
 */
test('1002 is an float', () => {
  expect(isFloat(1002)).toBe(false);
});

test('1002.32 is not an integer', () => {
  expect(isFloat(1002.32)).toBe(true);
});

test('123ba.23 in not a float', () => {
  expect(isFloat('123ba.23')).toBe(false);
});

test('123.32a in not a float', () => {
  expect(isFloat('123.32a')).toBe(false);
});

/**
 * isNumber
 */
test('1002 is a number', () => {
  expect(isNumber(1002)).toBe(true);
});

test('1002.32 is a number', () => {
  expect(isNumber(1002.32)).toBe(true);
});

test('"1002" is a number', () => {
  expect(isNumber("1002")).toBe(true);
});

test('"1002.32" is a number', () => {
  expect(isNumber("1002.32")).toBe(true);
});

test('123ba.23 in not a number', () => {
  expect(isNumber('123ba.23')).toBe(false);
});

test('123.32a in not a Number', () => {
  expect(isNumber('123.32a')).toBe(false);
});
