import { describe, it, expect } from 'vitest';
import { parsePrice, parseBool, parseAmenities, parseIntOrNull, htmlBreaksToNewlines } from '../../src/utils/parse.js';

describe('parsePrice', () => {
  it.each([
    ['$1,234.00', 1234],
    ['$80.00', 80],
    ['', null],
    [undefined, null],
    ['free', null],
  ])('%s -> %s', (input, expected) => {
    expect(parsePrice(input)).toBe(expected);
  });
});

describe('parseBool', () => {
  it('розуміє формат Inside Airbnb', () => {
    expect(parseBool('t')).toBe(true);
    expect(parseBool('f')).toBe(false);
    expect(parseBool('')).toBe(false);
  });
});

describe('parseIntOrNull', () => {
  it.each([
    ['3', 3],
    ['2.0', 2],
    ['', null],
  ])('%s -> %s', (input, expected) => {
    expect(parseIntOrNull(input)).toBe(expected);
  });
});

describe('parseAmenities', () => {
  it('парсить JSON-масив', () => {
    expect(parseAmenities('["Wifi", "Kitchen"]')).toEqual(['Wifi', 'Kitchen']);
  });

  it('не падає на зіпсованому рядку', () => {
    expect(parseAmenities('[broken')).toEqual([]);
  });
});

describe('htmlBreaksToNewlines', () => {
  it('замінює <br /> на перенос рядка', () => {
    expect(htmlBreaksToNewlines('A<br /><br />B<br/>C')).toBe('A\n\nB\nC');
  });

  it('порожнє значення -> null', () => {
    expect(htmlBreaksToNewlines('')).toBe(null);
  });
});
