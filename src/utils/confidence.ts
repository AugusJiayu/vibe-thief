/**
 * 置信度计算
 * confidence = deterministic_score × 0.6 + llm_subjective_score × 0.4
 */

import type { CSSExtraction, PixelExtraction, VisionAnalysis } from '../types/extraction.js';

/** 提取元数据（记录每一步的成功/失败） */
export interface ExtractionMeta {
  cssSuccess: boolean;
  pixelSuccess: boolean;
  visionSuccess: boolean;
  stage1Success: boolean;
  stage2Success: boolean;
  cssColorCount: number;
  cssFontCount: number;
  pixelColorCount: number;
  visionConfidence: number;
}

/** 确定性评分（基于数据质量，0-1） */
export function deterministicScore(meta: ExtractionMeta): number {
  // 数据完整度（0-1）：每个提取步骤是否成功
  const completeness =
    (meta.cssSuccess ? 0.30 : 0) +
    (meta.pixelSuccess ? 0.20 : 0) +
    (meta.visionSuccess ? 0.20 : 0) +
    (meta.stage1Success ? 0.15 : 0) +
    (meta.stage2Success ? 0.15 : 0);

  // 数据质量（0-1）：提取到的数据丰富程度
  const quality =
    (meta.cssColorCount >= 5 ? 0.20 : meta.cssColorCount >= 2 ? 0.10 : 0) +
    (meta.cssFontCount >= 2 ? 0.20 : meta.cssFontCount >= 1 ? 0.10 : 0) +
    (meta.pixelColorCount >= 5 ? 0.20 : meta.pixelColorCount >= 2 ? 0.10 : 0) +
    (meta.visionConfidence >= 0.5 ? 0.20 : meta.visionConfidence >= 0.3 ? 0.10 : 0) +
    (meta.stage1Success && meta.stage2Success ? 0.20 : 0);

  return Math.round(completeness * quality * 100) / 100;
}

/**
 * 混合置信度
 * @param deterministic 确定性评分（0-1）
 * @param llmSubjective LLM 主观评分（0-1），如果 LLM 没有给出则为 null
 */
export function hybridConfidence(
  deterministic: number,
  llmSubjective: number | null
): number {
  if (llmSubjective === null || llmSubjective === undefined) {
    // 没有 LLM 评分时，确定性评分权重更高
    return Math.round(deterministic * 100) / 100;
  }
  // 确定性 60% + LLM 主观 40%
  const score = deterministic * 0.6 + llmSubjective * 0.4;
  return Math.round(score * 100) / 100;
}

/** 从提取结果构建 ExtractionMeta */
export function buildExtractionMeta(
  css: CSSExtraction | null,
  pixel: PixelExtraction | null,
  vision: VisionAnalysis | null,
  stage1Success: boolean,
  stage2Success: boolean
): ExtractionMeta {
  return {
    cssSuccess: css !== null && css.colors.raw.length > 0,
    pixelSuccess: pixel !== null && pixel.dominantColors.length > 0,
    visionSuccess: vision !== null && vision.confidence > 0,
    stage1Success,
    stage2Success,
    cssColorCount: css?.colors.raw.length ?? 0,
    cssFontCount: css?.typography.fontFamilies.length ?? 0,
    pixelColorCount: pixel?.dominantColors.length ?? 0,
    visionConfidence: vision?.confidence ?? 0,
  };
}
