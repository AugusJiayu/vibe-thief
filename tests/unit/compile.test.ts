import { describe, it, expect } from 'vitest';
import type { CSSExtraction, PixelExtraction, VisionAnalysis } from '../../src/types/extraction.js';

describe('compile pipeline (unit)', () => {
  it('should have correct extraction type shapes', () => {
    const css: CSSExtraction = {
      colors: {
        raw: [{ value: '#3B82F6', frequency: 10, sources: ['color'] }],
        cssVariables: { '--primary': '#3B82F6' },
      },
      typography: {
        fontFamilies: [{ family: 'Inter', frequency: 5 }],
        fontSizes: [{ size: '16px', frequency: 8, contexts: ['p'] }],
        fontWeights: [{ weight: 400, frequency: 10 }],
        lineHeights: [{ value: '1.5', frequency: 8 }],
      },
      spacing: {
        values: [{ value: '8px', frequency: 5 }],
        detectedBaseUnit: '4px',
      },
      borders: {
        radii: [{ value: '8px', frequency: 5 }],
        widths: [{ value: '1px', frequency: 10 }],
        styles: [{ value: 'solid', frequency: 10 }],
      },
      shadows: {
        values: [{ value: '0 1px 2px rgba(0,0,0,0.05)', frequency: 3 }],
      },
      breakpoints: [{ minWidth: '768px', label: 'md' }],
      rawCSSVariables: { '--primary': '#3B82F6' },
    };

    expect(css.colors.raw).toHaveLength(1);
    expect(css.colors.raw[0].value).toBe('#3B82F6');
    expect(css.typography.fontFamilies[0].family).toBe('Inter');
    expect(css.spacing.detectedBaseUnit).toBe('4px');
  });

  it('should have correct pixel extraction shape', () => {
    const pixel: PixelExtraction = {
      dominantColors: [
        {
          hex: '#3B82F6',
          rgb: [59, 130, 246],
          hsl: [220, 90, 60],
          population: 0.15,
          role: 'primary',
        },
      ],
      paletteHarmony: {
        type: 'analogous',
        saturationRange: [30, 80],
        lightnessRange: [40, 70],
      },
    };

    expect(pixel.dominantColors).toHaveLength(1);
    expect(pixel.dominantColors[0].role).toBe('primary');
    expect(pixel.paletteHarmony.type).toBe('analogous');
  });

  it('should have correct vision analysis shape', () => {
    const vision: VisionAnalysis = {
      mood: {
        primary: 'professional',
        descriptors: ['clean', 'modern'],
      },
      components: {
        buttons: { borderRadius: 'rounded', shadowType: 'subtle', borderWeight: 'thin' },
        cards: { borderRadius: '8px', shadowType: 'subtle', hasBorder: false },
        inputs: { style: 'outlined', borderRadius: '4px' },
      },
      layout: { density: 'comfortable', alignment: 'left', gridFeeling: 'strict' },
      visualWeight: { contrast: 'medium', emphasis: 'balanced' },
      interactions: { hoverStyle: 'color change', focusStyle: 'outline', transitionSpeed: 'fast' },
      confidence: 0.85,
    };

    expect(vision.mood.primary).toBe('professional');
    expect(vision.components.buttons.borderRadius).toBe('rounded');
    expect(vision.confidence).toBe(0.85);
  });
});
