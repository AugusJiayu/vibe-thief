/**
 * 阶段 2 Prompt：感知融合 + Markdown 生成
 * 将结构化 token 数据与视觉感知分析融合
 */

import type { VisionAnalysis } from '../../types/extraction.js';

export function buildGenerationPrompt(
  tokenData: Record<string, unknown>,
  visionData: VisionAnalysis | null,
  language: 'zh' | 'en' = 'zh'
): { system: string; user: string } {
  const langInstruction = language === 'zh' ? '使用中文输出' : 'Output in English';

  const system = `你是一个设计系统编排专家。你的任务是将结构化的 Design Token 数据与视觉感知分析融合，生成最终的 DesignTokens JSON。

规则：
1. 将视觉感知分析融合到 perception 字段
2. 根据感知分析为 token 生成更精确的 usage 描述
3. 根据 mood 和 descriptors 生成一段 designPhilosophy（50-100字）
4. 如果感知分析和 token 数据有矛盾，以 token 数据为准
5. 输出严格 JSON，不要包含任何解释文字
6. ${langInstruction}

输出 JSON 结构与 DesignTokens 类型一致：
{
  ... (所有 token 字段保持不变),
  "perception": {
    "mood": "描述",
    "descriptors": ["词1", "词2"],
    "density": "sparse|comfortable|compact",
    "contrastLevel": "low|medium|high",
    "designPhilosophy": "一段话描述整体设计哲学"
  }
}`;

  const user = `以下是输入数据：

【Token 数据】
\`\`\`json
${JSON.stringify(tokenData, null, 2)}
\`\`\`
${visionData ? `
【视觉感知分析】
\`\`\`json
${JSON.stringify(visionData, null, 2)}
\`\`\`` : '\n（无视觉感知数据，仅基于 token 数据生成 perception 字段）'}

请融合数据，输出最终的 DesignTokens JSON。`;

  return { system, user };
}
