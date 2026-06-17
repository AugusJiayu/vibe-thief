/**
 * Pipeline 编排器
 * 串联输入→提取→编译→输出四层
 */

import type { InputSource, PipelineConfig } from '../types/input.js';
import type { CSSExtraction, PixelExtraction, VisionAnalysis } from '../types/extraction.js';
import type { DesignSystemDoc } from '../types/design-doc.js';
import { BrowserManager } from '../browser/manager.js';
import { captureScreenshots } from '../browser/screenshot.js';
import { captureMultiScreenshots } from '../browser/multi-screenshot.js';
import { extractCSSFromPage } from '../extractors/css-extractor.js';
import { extractPixelsFromBuffer } from '../extractors/pixel-extractor.js';
import { analyzeVision } from '../extractors/vision-analyzer.js';
import { compile } from './compile.js';
import { renderDesignDoc } from './output.js';
import { buildExtractionMeta, deterministicScore, hybridConfidence } from '../utils/confidence.js';
import { logger } from '../utils/logger.js';

export interface DesignResult {
  /** 最终 DESIGN.md 内容 */
  markdown: string;
  /** 结构化设计文档 */
  doc: DesignSystemDoc;
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
    // 截图 + 多区域 + 交互状态 + CSS 动画
    const screenshots = await captureScreenshots(page);
    const multiData = await captureMultiScreenshots(page).catch(err => {
      logger.warn(`Multi-screenshot failed: ${err}`);
      return null;
    });

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

    // 将动画信息附加到 CSS 数据
    if (multiData && cssData) {
      (cssData as any).animations = multiData.animations;
    }

    // 视觉分析（使用桌面端首屏 + 交互状态截图）
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
      url,
      config.output?.language
    );

    // 混合置信度：确定性 60% + LLM 主观 40%
    const meta = buildExtractionMeta(cssData, pixelData, visionData, compileResult.stage1Success, compileResult.stage2Success);
    const detScore = deterministicScore(meta);
    const llmScore = compileResult.doc.frontmatter.confidence ?? null;
    const confidence = hybridConfidence(detScore, llmScore);

    // 输出层
    const markdown = renderDesignDoc(compileResult.doc);

    const result: DesignResult = {
      markdown,
      doc: compileResult.doc,
      raw: { css: cssData || undefined, pixel: pixelData || undefined, vision: visionData || undefined },
      meta: {
        duration: Date.now() - startTime,
        llmTokensUsed: compileResult.llmTokensUsed,
        confidence,
        degraded,
      },
    };

    logger.info(`Extraction complete in ${result.meta.duration}ms (confidence: ${result.meta.confidence})`);
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

  const sourceName = typeof source === 'string' ? source : 'uploaded-screenshot';

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
    sourceName,
    config.output?.language
  );

  // 混合置信度
  const extractionMeta = buildExtractionMeta(null, pixelData, visionData, compileResult.stage1Success, compileResult.stage2Success);
  const detScore = deterministicScore(extractionMeta);
  const llmScore = compileResult.doc.frontmatter.confidence ?? null;
  const confidence = hybridConfidence(detScore, llmScore);

  // 输出层
  const markdown = renderDesignDoc(compileResult.doc);

  return {
    markdown,
    doc: compileResult.doc,
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
