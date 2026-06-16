import { describe, it, expect } from 'vitest';
import {
  hexToRgb,
  rgbToHex,
  rgbToHsl,
  inferColorRole,
  normalizeColorValue,
} from '../../src/utils/color.js';

describe('color utils', () => {
  describe('hexToRgb', () => {
    it('converts 6-digit hex', () => {
      expect(hexToRgb('#FF0000')).toEqual([255, 0, 0]);
      expect(hexToRgb('#3B82F6')).toEqual([59, 130, 246]);
    });

    it('converts 3-digit hex', () => {
      expect(hexToRgb('#F00')).toEqual([255, 0, 0]);
    });
  });

  describe('rgbToHex', () => {
    it('converts rgb to hex', () => {
      expect(rgbToHex(255, 0, 0)).toBe('#ff0000');
      expect(rgbToHex(59, 130, 246)).toBe('#3b82f6');
    });
  });

  describe('rgbToHsl', () => {
    it('converts pure red', () => {
      const [h, s, l] = rgbToHsl(255, 0, 0);
      expect(h).toBe(0);
      expect(s).toBe(100);
      expect(l).toBe(50);
    });

    it('converts pure white', () => {
      const [h, s, l] = rgbToHsl(255, 255, 255);
      expect(h).toBe(0);
      expect(s).toBe(0);
      expect(l).toBe(100);
    });

    it('converts pure black', () => {
      const [h, s, l] = rgbToHsl(0, 0, 0);
      expect(h).toBe(0);
      expect(s).toBe(0);
      expect(l).toBe(0);
    });
  });

  describe('inferColorRole', () => {
    it('identifies text color (very dark)', () => {
      expect(inferColorRole([0, 0, 10], 0.3)).toBe('text');
    });

    it('identifies background color (very light)', () => {
      expect(inferColorRole([0, 0, 95], 0.3)).toBe('background');
    });

    it('identifies neutral color (low saturation)', () => {
      expect(inferColorRole([0, 5, 50], 0.3)).toBe('neutral');
    });

    it('identifies primary color (high saturation, high population)', () => {
      expect(inferColorRole([220, 80, 50], 0.2)).toBe('primary');
    });
  });

  describe('normalizeColorValue', () => {
    it('normalizes 3-digit hex', () => {
      expect(normalizeColorValue('#F00')).toBe('#ff0000');
    });

    it('normalizes 6-digit hex', () => {
      expect(normalizeColorValue('#3B82F6')).toBe('#3b82f6');
    });

    it('normalizes rgb()', () => {
      expect(normalizeColorValue('rgb(59, 130, 246)')).toBe('#3b82f6');
    });

    it('normalizes rgba() ignoring alpha', () => {
      expect(normalizeColorValue('rgba(59, 130, 246, 0.5)')).toBe('#3b82f6');
    });

    it('returns null for unsupported formats', () => {
      expect(normalizeColorValue('currentColor')).toBeNull();
      expect(normalizeColorValue('inherit')).toBeNull();
    });
  });
});
