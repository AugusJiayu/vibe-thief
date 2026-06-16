/**
 * Pipeline 编排器
 * 串联输入→提取→编译→输出四层
 */

import type { InputSource, PipelineConfig } from '../types/input.js';
import type { CSSExtraction, PixelExtraction, VisionAnalysis } from '../types/extraction.js';
import type { DesignTokens } from '../types/tokens.js';
import { BrowserManager } from '../browser/manager.js';
import { captureScreenshots } from '../browser/screenshot.js';
import { extractCSSFromPage } from '../extractors/css-extractor.js';
import { extractPixelsFromBuffer } from '../extractors/pixel-extractor.js';
import { analyzeVision } from '../extractors/vision-analyzer.js';
import { compile } from './compile.js';
import { renderMarkdown } from './output.js';
import { logger } from '../utils/logger.js';

export interface DesignResult {
  /** 最终 DESIGN.md 内容 */
  markdown: string;
  /** 结构化 token 数据 */
  tokens: DesignTokens;
  /** 提取的原始数据（调试用） */
  raw: {
    css?: CSSExtraction;
    pixel?: PixelExtraction;
    vision?: VisionAnalysis;
  };
  /** 处理元信息 */
  meta: {
    duration: number;
    llmTokensUsed: number;
    confidence: number;
    degraded: string[];
  };
}

/**
 * 从 URL 生成 DESIGN.md（完整流程）
 */
export async function extractFromURL(
  url: string,
  config: PipelineConfig
): Promise<DesignResult> {
  const startTime = Date.now();
  const degraded: string[] = [];

  logger.info(`Starting extraction from URL: ${url}`);

  // 输入层：启动浏览器，导航到 URL
  const manager = new BrowserManager(config.browser);
  const page = await manager.navigateTo(url);

  try {
    // 截图
    const screenshots = await captureScreenshots(page);

    // 提取层：并行执行 CSS 提取 + 像素提取
    logger.info('Running extractors in parallel...');
    const [cssData, pixelData] = await Promise.all([
      extractCSSFromPage(page).catch(err => {
        logger.warn(`CSS extraction failed: ${err}`);
        degraded.push('css');
        return null;
      }),
      extractPixelsFromBuffer(screenshots.fullPage).catch(err => {
        logger.warn(`Pixel extraction failed: ${err}`);
        degraded.push('pixel');
        return null;
      }),
    ]);

    // 视觉分析（需要 LLM）
    let visionData: VisionAnalysis | null = null;
    try {
      visionData = await analyzeVision(screenshots.viewport, config.llm);
    } catch (err) {
      logger.warn(`Vision analysis failed: ${err}`);
      degraded.push('vision');
    }

    // 编译层
    const compileResult = await compile(
      cssData || emptyCSSExtraction(),
      pixelData,
      visionData,
      config.llm,
      config.output?.language
    );

    // 计算置信度
    const confidence = calculateConfidence(cssData, pixelData, visionData, degraded);

    // 设置 token 元数据
    compileResult.tokens.source = url;
    compileResult.tokens.extractedAt = new Date().toISOString();
    compileResult.tokens.schemaVersion = '1.0';
    compileResult.tokens.confidence = confidence;

    // 输出层
    const markdown = renderMarkdown(compileResult.tokens, config.output?.language);

    const result: DesignResult = {
      markdown,
      tokens: compileResult.tokens,
      raw: { css: cssData || undefined, pixel: pixelData || undefined, vision: visionData || undefined },
      meta: {
        duration: Date.now() - startTime,
        llmTokensUsed: compileResult.llmTokensUsed,
        confidence,
        degraded,
      },
    };

    logger.info(`Extraction complete in ${result.meta.duration}ms (confidence: ${confidence})`);
    return result;
  } finally {
    await manager.close();
  }
}

/**
 * 从截图生成 DESIGN.md
 */
export async function extractFromScreenshot(
  source: string | Buffer,
  config: PipelineConfig
): Promise<DesignResult> {
  const startTime = Date.now();
  const degraded: string[] = [];

  logger.info('Starting extraction from screenshot...');

  // 读取截图
  let screenshotBuffer: Buffer;
  if (typeof source === 'string') {
    const { readFile } = await import('node:fs/promises');
    screenshotBuffer = await readFile(source);
  } else {
    screenshotBuffer = source;
  }

  // 提取层：像素提取 + 视觉分析
  const [pixelData, visionData] = await Promise.all([
    extractPixelsFromBuffer(screenshotBuffer).catch(err => {
      logger.warn(`Pixel extraction failed: ${err}`);
      degraded.push('pixel');
      return null;
    }),
    analyzeVision(screenshotBuffer, config.llm).catch(err => {
      logger.warn(`Vision analysis failed: ${err}`);
      degraded.push('vision');
      return null;
    }),
  ]);

  // 编译层（无 CSS 数据）
  const compileResult = await compile(
    emptyCSSExtraction(),
    pixelData,
    visionData,
    config.llm,
    config.output?.language
  );

  const confidence = calculateConfidence(null, pixelData, visionData, degraded);

  // 设置 token 元数据
  compileResult.tokens.source = typeof source === 'string' ? source : 'uploaded-screenshot';
  compileResult.tokens.extractedAt = new Date().toISOString();
  compileResult.tokens.schemaVersion = '1.0';
  compileResult.tokens.confidence = confidence;

  // 输出层
  const markdown = renderMarkdown(compileResult.tokens, config.output?.language);

  return {
    markdown,
    tokens: compileResult.tokens,
    raw: { pixel: pixelData || undefined, vision: visionData || undefined },
    meta: {
      duration: Date.now() - startTime,
      llmTokensUsed: compileResult.llmTokensUsed,
      confidence,
      degraded,
    },
  };
}

/**
 * 仅运行提取层（不编译不生成，不调用 LLM）
 */
export async function extractOnly(
  source: InputSource,
  config: PipelineConfig
): Promise<{
  css?: CSSExtraction;
  pixel?: PixelExtraction;
}> {
  logger.info('Running extraction only (no LLM calls)...');

  if (source.type === 'url') {
    const manager = new BrowserManager(config.browser);
    const page = await manager.navigateTo(source.url);
    try {
      const screenshots = await captureScreenshots(page);
      const [cssData, pixelData] = await Promise.all([
        extractCSSFromPage(page).catch(err => {
          logger.warn(`CSS extraction failed: ${err}`);
          return null;
        }),
        extractPixelsFromBuffer(screenshots.fullPage).catch(err => {
          logger.warn(`Pixel extraction failed: ${err}`);
          return null;
        }),
      ]);
      return { css: cssData || undefined, pixel: pixelData || undefined };
    } finally {
      await manager.close();
    }
  } else {
    let buffer: Buffer;
    if ('filePath' in source) {
      const { readFile } = await import('node:fs/promises');
      buffer = await readFile(source.filePath);
    } else {
      buffer = source.buffer;
    }
    const pixelData = await extractPixelsFromBuffer(buffer).catch(err => {
      logger.warn(`Pixel extraction failed: ${err}`);
      return null;
    });
    return { pixel: pixelData || undefined };
  }
}

/** 计算置信度 */
function calculateConfidence(
  css: CSSExtraction | null,
  pixel: PixelExtraction | null,
  vision: VisionAnalysis | null,
  degraded: string[]
): number {
  let score = 1.0;
  // 每个降级步骤扣分
  if (degraded.includes('css')) score -= 0.3;
  if (degraded.includes('pixel')) score -= 0.2;
  if (degraded.includes('vision')) score -= 0.2;
  // 数据质量
  if (css && css.colors.raw.length < 3) score -= 0.1;
  if (pixel && pixel.dominantColors.length < 3) score -= 0.1;
  if (vision && vision.confidence < 0.5) score -= 0.1;
  return Math.max(0, Math.min(1, Math.round(score * 100) / 100));
}

/** 空的 CSS 提取结果 */
function emptyCSSExtraction(): CSSExtraction {
  return {
    colors: { raw: [], cssVariables: {} },
    typography: {
      fontFamilies: [],
      fontSizes: [],
      fontWeights: [],
      lineHeights: [],
    },
    spacing: { values: [], detectedBaseUnit: null },
    borders: { radii: [], widths: [], styles: [] },
    shadows: { values: [] },
    breakpoints: [],
    rawCSSVariables: {},
  };
}
