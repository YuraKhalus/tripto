import { describe, it, expect } from 'vitest';
import { parseLimit } from '../../src/utils/limit.js';

const options = { defaultValue: 10, max: 50 };

describe('parseLimit', () => {
  it('повертає defaultValue, якщо limit не передано', () => {
    expect(parseLimit(undefined, options)).toBe(10);
  });

  it('використовує defaultValue з переданих опцій, а не зашите значення', () => {
    expect(parseLimit(undefined, { defaultValue: 25, max: 100 })).toBe(25);
  });

  it.each([
    ['мінімальне значення', '1', 1],
    ['звичайне значення', '20', 20],
    ['максимальне значення', '50', 50],
  ])('перетворює коректний рядок на число: %s', (_name, input, expected) => {
    expect(parseLimit(input, options)).toBe(expected);
  });

  it('враховує max з переданих опцій', () => {
    expect(parseLimit('100', { defaultValue: 10, max: 100 })).toBe(100);
    expect(parseLimit('101', { defaultValue: 10, max: 100 })).toBeNull();
  });

  it.each([
    ['нуль', '0'],
    ['від’ємне число', '-5'],
    ['на одиницю більше за максимум', '51'],
    ['дробове число', '2.5'],
    ['не число', 'abc'],
    ['порожній рядок', ''],
    ['Infinity', 'Infinity'],
  ])('повертає null, якщо limit некоректний: %s', (_name, input) => {
    expect(parseLimit(input, options)).toBeNull();
  });

  it('повертає null, якщо limit передано кілька разів (масив)', () => {
    // ?limit=1&limit=2 → Express дає req.query.limit = ['1', '2']
    expect(parseLimit(['1', '2'], options)).toBeNull();
  });

  it('повертає null, якщо limit прийшов як об’єкт', () => {
    // ?limit[a]=1 → { a: '1' }
    expect(parseLimit({ a: '1' }, options)).toBeNull();
  });
});