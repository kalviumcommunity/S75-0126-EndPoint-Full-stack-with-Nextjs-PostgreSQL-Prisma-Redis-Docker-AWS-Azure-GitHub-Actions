import { sum } from '../src/utils/sum';

test('adds two numbers', () => {
  expect(sum(2, 3)).toBe(5);
});

test('adds negative numbers', () => {
  expect(sum(-2, -3)).toBe(-5);
});

test('adds zero', () => {
  expect(sum(0, 5)).toBe(5);
});
