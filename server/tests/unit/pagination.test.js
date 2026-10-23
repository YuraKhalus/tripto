import { describe, it, expect } from 'vitest';
import { parsePagination, buildMeta, DEFAULT_LIMIT, MAX_LIMIT } from '../../src/utils/pagination.js';

describe('parsePagination', () => {
  it('рахує skip і take для звичайних значень', () => {
    expect(parsePagination({ page: '3', limit: '20' })).toEqual({ page: 3, limit: 20, skip: 40, take: 20 });
  });

  it('без параметрів повертає першу сторінку з лімітом за замовчуванням', () => {
    expect(parsePagination({})).toEqual({ page: 1, limit: DEFAULT_LIMIT, skip: 0, take: DEFAULT_LIMIT });
  });

  it('не дає попросити більше за MAX_LIMIT', () => {
    expect(parsePagination({ limit: '5000' }).take).toBe(MAX_LIMIT);
  });

  // Одна перевірка — багато вхідних даних: таблиця кейсів
  it.each([
    ['abc', 1],
    ['0', 1],
    ['-5', 1],
    ['2.7', 2],
  ])('page=%s -> %i', (page, expected) => {
    expect(parsePagination({ page }).page).toBe(expected);
  });
});

describe('buildMeta', () => {
  it('округлює кількість сторінок вгору', () => {
    expect(buildMeta({ page: 1, limit: 20, total: 41 })).toEqual({ page: 1, limit: 20, total: 41, totalPages: 3 });
  });
});
