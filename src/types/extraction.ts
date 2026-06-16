/** CSS 结构提取结果 */
export interface CSSExtraction {
  colors: {
    raw: Array<{ value: string; frequency: number; sources: string[] }>;
    cssVariables: Record<string, string>;
  };
  typography: {
    fontFamilies: Array<{ family: string; frequency: number }>;
    fontSizes: Array<{ size: string; frequency: number; contexts: string[] }>;
    fontWeights: Array<{ weight: number; frequency: number }>;
    lineHeights: Array<{ value: string; frequency: number }>;
  };
  spacing: {
    values: Array<{ value: string; frequency: number }>;
    detectedBaseUnit: string | null;
  };
  borders: {
    radii: Array<{ value: string; frequency: number }>;
    widths: Array<{ value: string; frequency: number }>;
    styles: Array<{ value: string; frequency: number }>;
  };
  shadows: {
    values: Array<{ value: string; frequency: number }>;
  };
  breakpoints: Array<{ minWidth: string; label: string }>;
  rawCSSVariables: Record<string, string>;
}

/** 像素提取结果（截图分析） */
export interface PixelExtraction {
  dominantColors: Array<{
    hex: string;
    rgb: [number, number, number];
    hsl: [number, number, number];
    population: number;
    role:
      | 'primary'
      | 'secondary'
      | 'accent'
      | 'neutral'
      | 'background'
      | 'text'
      | 'unknown';
  }>;
  paletteHarmony: {
    type:
      | 'monochromatic'
      | 'analogous'
      | 'complementary'
      | 'triadic'
      | 'split-complementary';
    saturationRange: [number, number];
    lightnessRange: [number, number];
  };
}

/** 视觉感知分析结果（LLM 输出） */
export interface VisionAnalysis {
  mood: {
    primary: string;
    descriptors: string[];
  };
  components: {
    buttons: {
      borderRadius: 'sharp' | 'slight' | 'rounded' | 'pill';
      shadowType: 'none' | 'subtle' | 'pronounced' | 'neumorphic';
      borderWeight: 'none' | 'thin' | 'medium';
    };
    cards: {
      borderRadius: string;
      shadowType: string;
      hasBorder: boolean;
    };
    inputs: {
      style: 'outlined' | 'filled' | 'underlined' | 'ghost';
      borderRadius: string;
    };
  };
  layout: {
    density: 'sparse' | 'comfortable' | 'compact';
    alignment: 'left' | 'center' | 'mixed';
    gridFeeling: 'strict' | 'organic' | 'asymmetric';
  };
  visualWeight: {
    contrast: 'low' | 'medium' | 'high';
    emphasis: 'typography' | 'color' | 'imagery' | 'balanced';
  };
  interactions: {
    hoverStyle: string;
    focusStyle: string;
    transitionSpeed: 'instant' | 'fast' | 'smooth' | 'slow';
  };
  confidence: number;
}
