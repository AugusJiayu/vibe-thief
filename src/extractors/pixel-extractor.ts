/**
 * 像素提取器
 * 从截图中提取实际渲染的调色板
 */

import type { PixelExtraction } from '../types/extraction.js';
import {
  quantizePixels,
  rgbToHsl,
  inferColorRole,
  analyzePaletteHarmony,
} from '../utils/color.js';
import { logger } from '../utils/logger.js';

/**
 * 从 PNG Buffer 提取色彩数据
 */
export async function extractPixelsFromBuffer(
  imageBuffer: Buffer,
  maxColors: number = 12
): Promise<PixelExtraction> {
  logger.info('Extracting color palette from screenshot...');

  // 解码 PNG 为像素数组
  const pixels = await decodeImage(imageBuffer);

  // 量化颜色
  const rawPalette = quantizePixels(pixels, maxColors);

  // 为每个颜色添加 HSL 和角色信息
  const dominantColors = rawPalette.map(color => {
    const hsl = rgbToHsl(...color.rgb);
    const role = inferColorRole(hsl, color.population);
    return {
      hex: color.hex,
      rgb: color.rgb,
      hsl,
      role,
      population: color.population,
    };
  });

  // 分析调色板和谐度
  const paletteHarmony = analyzePaletteHarmony(dominantColors);

  logger.info(`Pixel extraction complete: ${dominantColors.length} dominant colors`);

  return {
    dominantColors,
    paletteHarmony,
  };
}

/**
 * 解码图片 Buffer 为 RGBA 像素数组
 */
async function decodeImage(buffer: Buffer): Promise<Uint8ClampedArray> {
  // 尝试使用 sharp（如果可用）
  try {
    // @ts-ignore — optional dependency
    const sharpMod = await import('sharp');
    const sharp = sharpMod.default || sharpMod;
    const { data } = await sharp(buffer)
      .ensureAlpha()
      .raw()
      .toBuffer({ resolveWithObject: true });
    return new Uint8ClampedArray(data.buffer, data.byteOffset, data.byteLength);
  } catch {
    // sharp 不可用，尝试 pngjs
  }

  // 备用方案：使用 pngjs（纯 JS PNG 解码）
  try {
    // @ts-ignore — optional dependency
    const pngjsMod = await import('pngjs');
    const PNG = pngjsMod.PNG || pngjsMod.default?.PNG;
    if (PNG) {
      const png = PNG.sync.read(buffer);
      return new Uint8ClampedArray(png.data.buffer, png.data.byteOffset, png.data.byteLength);
    }
  } catch {
    // pngjs 也不可用
  }

  throw new Error(
    'No image decoder available. Please install "sharp":\n' +
    '  npm install sharp'
  );
}
