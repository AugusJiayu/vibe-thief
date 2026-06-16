/**
 * CSS 结构提取器
 * 使用 Playwright 从页面提取 CSS 变量、字体、间距等硬数据
 */

import type { Page } from 'playwright';
import type { CSSExtraction } from '../types/extraction.js';
import type { BrowserConfig } from '../types/input.js';
import { BrowserManager } from '../browser/manager.js';
import { collectCSSFromPage } from '../browser/css-collect.js';
import { normalizeColorValue } from '../utils/color.js';
import { logger } from '../utils/logger.js';

/**
 * 从 URL 提取 CSS 数据
 */
export async function extractCSSFromURL(
  url: string,
  browserConfig?: BrowserConfig
): Promise<CSSExtraction> {
  const manager = new BrowserManager(browserConfig);
  try {
    const page = await manager.navigateTo(url);
    const result = await extractCSSFromPage(page);
    await manager.closePage(page);
    return result;
  } finally {
    await manager.close();
  }
}

/**
 * 从已打开的 Page 提取 CSS 数据
 */
export async function extractCSSFromPage(page: Page): Promise<CSSExtraction> {
  logger.info('Extracting CSS data from page...');

  const raw = await page.evaluate(collectCSSFromPage);

  // 后处理：标准化颜色值，过滤掉无法转换的现代 CSS 颜色函数
  const processedColors = raw.colors.raw
    .map(item => ({
      ...item,
      value: normalizeColorValue(item.value),
    }))
    .filter((item): item is typeof item & { value: string } => item.value !== null);

  // 去重合并相似颜色
  const colorMap = new Map<string, { frequency: number; sources: string[] }>();
  for (const color of processedColors) {
    const hex = color.value;
    const existing = colorMap.get(hex);
    if (existing) {
      existing.frequency += color.frequency;
      existing.sources = [...new Set([...existing.sources, ...color.sources])];
    } else {
      colorMap.set(hex, { frequency: color.frequency, sources: color.sources });
    }
  }

  const result: CSSExtraction = {
    colors: {
      raw: [...colorMap.entries()].map(([value, { frequency, sources }]) => ({
        value,
        frequency,
        sources,
      })),
      cssVariables: raw.colors.cssVariables,
    },
    typography: {
      fontFamilies: raw.typography.fontFamilies,
      fontSizes: raw.typography.fontSizes,
      fontWeights: raw.typography.fontWeights,
      lineHeights: raw.typography.lineHeights,
    },
    spacing: raw.spacing,
    borders: raw.borders,
    shadows: raw.shadows,
    breakpoints: raw.breakpoints,
    rawCSSVariables: raw.rawCSSVariables,
  };

  logger.info(
    `CSS extraction complete: ${result.colors.raw.length} colors, ` +
    `${result.typography.fontFamilies.length} fonts, ` +
    `${result.spacing.values.length} spacing values`
  );

  return result;
}
