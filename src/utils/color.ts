/**
 * 色彩工具函数
 * 用于色彩转换、角色推断、命名
 */

/** HEX 转 RGB */
export function hexToRgb(hex: string): [number, number, number] {
  const h = hex.replace('#', '');
  const num = parseInt(h.length === 3 ? h.split('').map(c => c + c).join('') : h, 16);
  return [(num >> 16) & 255, (num >> 8) & 255, num & 255];
}

/** RGB 转 HEX */
export function rgbToHex(r: number, g: number, b: number): string {
  return '#' + [r, g, b].map(x => x.toString(16).padStart(2, '0')).join('');
}

/** RGB 转 HSL */
export function rgbToHsl(r: number, g: number, b: number): [number, number, number] {
  r /= 255; g /= 255; b /= 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h = 0, s = 0;
  const l = (max + min) / 2;
  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
      case g: h = ((b - r) / d + 2) / 6; break;
      case b: h = ((r - g) / d + 4) / 6; break;
    }
  }
  return [Math.round(h * 360), Math.round(s * 100), Math.round(l * 100)];
}

/** 根据 HSL 推断色彩角色 */
export function inferColorRole(
  hsl: [number, number, number],
  population: number
): 'primary' | 'secondary' | 'accent' | 'neutral' | 'background' | 'text' | 'unknown' {
  const [, s, l] = hsl;
  if (l < 15) return 'text';
  if (l > 90) return 'background';
  if (s < 10) return 'neutral';
  if (population > 0.15 && s > 40) return 'primary';
  if (population > 0.05 && s > 30) return 'secondary';
  if (s > 50 && population > 0.02) return 'accent';
  return 'unknown';
}

/** 量化像素数组为调色板（Modified Median Cut 简化版） */
export function quantizePixels(
  pixels: Uint8ClampedArray,
  maxColors: number = 12
): Array<{ hex: string; rgb: [number, number, number]; population: number }> {
  // 构建颜色频率表
  const colorMap = new Map<string, number>();
  for (let i = 0; i < pixels.length; i += 4) {
    // 量化到 5-bit 减少噪点
    const r = (pixels[i] >> 3) << 3;
    const g = (pixels[i + 1] >> 3) << 3;
    const b = (pixels[i + 2] >> 3) << 3;
    const a = pixels[i + 3];
    if (a < 128) continue; // 跳过透明像素
    const key = `${r},${g},${b}`;
    colorMap.set(key, (colorMap.get(key) || 0) + 1);
  }

  // 按频率排序，取 Top N
  const totalPixels = [...colorMap.values()].reduce((a, b) => a + b, 0);
  const sorted = [...colorMap.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, maxColors);

  return sorted.map(([key, count]) => {
    const [r, g, b] = key.split(',').map(Number);
    return {
      hex: rgbToHex(r, g, b),
      rgb: [r, g, b] as [number, number, number],
      population: count / totalPixels,
    };
  });
}

/** 分析调色板和谐类型 */
export function analyzePaletteHarmony(
  colors: Array<{ hsl: [number, number, number] }>
): {
  type: 'monochromatic' | 'analogous' | 'complementary' | 'triadic' | 'split-complementary';
  saturationRange: [number, number];
  lightnessRange: [number, number];
} {
  if (colors.length < 2) {
    return {
      type: 'monochromatic',
      saturationRange: [0, 0],
      lightnessRange: [0, 100],
    };
  }

  const hues = colors.map(c => c.hsl[0]);
  const sats = colors.map(c => c.hsl[1]);
  const lights = colors.map(c => c.hsl[2]);

  const satRange: [number, number] = [Math.min(...sats), Math.max(...sats)];
  const lightRange: [number, number] = [Math.min(...lights), Math.max(...lights)];

  // 简化的和谐检测
  const hueSpread = Math.max(...hues) - Math.min(...hues);
  let type: 'monochromatic' | 'analogous' | 'complementary' | 'triadic' | 'split-complementary';

  if (satRange[1] < 10 || hueSpread < 15) {
    type = 'monochromatic';
  } else if (hueSpread < 60) {
    type = 'analogous';
  } else if (hueSpread < 150) {
    type = 'complementary';
  } else {
    type = 'triadic';
  }

  return { type, saturationRange: satRange, lightnessRange: lightRange };
}

/** CSS 颜色值标准化为 HEX */
export function normalizeColorValue(value: string): string | null {
  value = value.trim().toLowerCase();

  // 已经是 hex
  if (/^#([0-9a-f]{3}|[0-9a-f]{6})$/.test(value)) {
    if (value.length === 4) {
      return '#' + value[1] + value[1] + value[2] + value[2] + value[3] + value[3];
    }
    return value;
  }

  // rgb(r, g, b)
  const rgbMatch = value.match(/rgb\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*\)/);
  if (rgbMatch) {
    return rgbToHex(+rgbMatch[1], +rgbMatch[2], +rgbMatch[3]);
  }

  // rgba(r, g, b, a) — 忽略 alpha
  const rgbaMatch = value.match(/rgba\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*,\s*[\d.]+\s*\)/);
  if (rgbaMatch) {
    return rgbToHex(+rgbaMatch[1], +rgbaMatch[2], +rgbaMatch[3]);
  }

  // hsl(h, s%, l%)
  const hslMatch = value.match(/hsl\(\s*(\d+)\s*,\s*(\d+)%?\s*,\s*(\d+)%?\s*\)/);
  if (hslMatch) {
    const h = +hslMatch[1] / 360;
    const s = +hslMatch[2] / 100;
    const l = +hslMatch[3] / 100;
    const hue2rgb = (p: number, q: number, t: number) => {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1/6) return p + (q - p) * 6 * t;
      if (t < 1/2) return q;
      if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
      return p;
    };
    const q2 = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p2 = 2 * l - q2;
    const r = Math.round(hue2rgb(p2, q2, h + 1/3) * 255);
    const g = Math.round(hue2rgb(p2, q2, h) * 255);
    const b = Math.round(hue2rgb(p2, q2, h - 1/3) * 255);
    return rgbToHex(r, g, b);
  }

  // lab(), oklch(), color() 等现代 CSS 颜色函数 — 无法直接转换，返回 null
  if (value.startsWith('lab(') || value.startsWith('oklch(') || value.startsWith('oklab(') ||
      value.startsWith('lch(') || value.startsWith('color(')) {
    return null;
  }

  return null;
}

/** 频率表排序并限制数量 */
export function topN<T>(items: Array<T & { frequency: number }>, n: number): T[] {
  return items
    .sort((a, b) => b.frequency - a.frequency)
    .slice(0, n);
}
