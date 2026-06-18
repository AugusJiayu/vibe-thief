/**
 * 验证脚本：测试 DESIGN.md 的风格还原能力
 *
 * 流程：
 * 1. 读取 DESIGN.md（风格规范）
 * 2. 给 Agent 一个「虚构产品」内容简报
 * 3. Agent 根据 DESIGN.md 生成 HTML
 * 4. 裁判 LLM 对比 original 和 generated，按 5 个维度打分
 * 5. 输出评估报告
 *
 * 用法: npx tsx scripts/evaluate.ts <design.md> <original-url>
 */

import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { join } from 'node:path';
import { chromium } from 'playwright';
import { createLLMProvider } from '../src/llm/provider.js';
import type { LLMConfig } from '../src/types/input.js';

// ─── 虚构产品内容简报 ───

const FICTIONAL_BRIEF = `
为一个虚构产品设计 Landing Page。产品信息：

产品名：CloudNote
定位：AI 驱动的云端笔记工具
核心卖点：
1. AI 自动整理和分类笔记
2. 多端同步，随时随地访问
3. 智能搜索，语义理解

页面需要包含以下 section：
1. Hero：主标题 + 副标题 + CTA 按钮
2. Features：3 个功能卡片
3. Social Proof：用户评价或数据展示
4. Pricing：3 个定价方案
5. CTA：最终行动号召

请严格遵循 DESIGN.md 中的设计规范来设计这个页面。
`;

// ─── 评估 Prompt ───

const JUDGE_PROMPT = `你是高级设计总监，负责评估 UI 设计的还原度。

你会看到两张全页截图（包含页面所有 section）：
- 图1：参考网站的完整页面截图
- 图2：根据该网站的设计规范（DESIGN.md），为一个虚构产品生成的完整页面截图

你的任务是判断：生成的页面是否成功继承了参考网站的视觉风格？

请从以下 5 个维度打分（1-10 分），并分析不足的原因。

## 评分维度

1. **色彩氛围**（Color Atmosphere）
   - 评估：色调、对比度、色彩分布是否与参考一致
   - 1分：完全不同的配色方案
   - 10分：色彩感知几乎一致，换个内容也看得出是同一种风格

2. **排版节奏**（Typography Rhythm）
   - 评估：字号层级、字重分布、行间距是否与参考一致
   - 1分：字号杂乱或过于单调
   - 10分：排版层次感和原版完全一致

3. **空间密度**（Spatial Density）
   - 评估：留白比例、组件间距、呼吸感是否与参考一致
   - 1分：过挤或过散，空间感完全不同
   - 10分：空间节奏感一致，留白策略相同

4. **组件风格**（Component Style）
   - 评估：按钮、卡片、输入框的圆角、阴影、边框是否与参考一致
   - 1分：组件风格完全不同
   - 10分：组件视觉语言完全一致

5. **品牌调性**（Brand Tone）
   - 评估：整体给人的感受是否一致（专业/活泼/高级/亲切...）
   - 1分：感觉像不同公司的产品
   - 10分：感觉像同一个设计师做的

## 输出格式

你必须且只能输出一个合法的 JSON 对象，不要用 markdown 代码块包裹：

{
  "scores": {
    "color_atmosphere": 0,
    "typography_rhythm": 0,
    "spatial_density": 0,
    "component_style": 0,
    "brand_tone": 0
  },
  "total": 0,
  "strengths": ["做得好的方面"],
  "weaknesses": ["做得不好的方面，要具体说明差距在哪"],
  "improvement_suggestions": ["具体的改进建议，要能指导 DESIGN.md 的优化"]
}`;

// ─── 工具函数 ───

function getLLMConfig(): LLMConfig {
  const apiKey = process.env.ANTHROPIC_API_KEY || process.env.OPENAI_API_KEY;
  if (!apiKey) throw new Error('Set ANTHROPIC_API_KEY or OPENAI_API_KEY');
  return {
    provider: (process.env.LLM_PROVIDER as any) || 'anthropic',
    model: process.env.LLM_MODEL || 'mimo-v2.5-pro',
    visionModel: process.env.LLM_VISION_MODEL || 'mimo-v2.5',
    apiKey,
    baseUrl: process.env.LLM_BASE_URL,
  };
}

async function compressImage(buffer: Buffer): Promise<Buffer> {
  const sharp = (await import('sharp')).default;
  const metadata = await sharp(buffer).metadata();
  const height = metadata.height || 1000;
  // 全页截图可能很长，限制最大高度 3000px（等比缩放）
  const maxHeight = 3000;
  const resizeOptions: any = { width: 1024, withoutEnlargement: true };
  if (height > maxHeight) {
    resizeOptions.height = maxHeight;
    resizeOptions.fit = 'inside';
  }
  return sharp(buffer)
    .resize(resizeOptions)
    .jpeg({ quality: 75 })
    .toBuffer();
}

// ─── Step 1: Agent 生成页面 ───

async function generatePage(designMd: string, llmConfig: LLMConfig): Promise<string> {
  console.log('  🎨 Agent generating page from DESIGN.md...');
  const provider = createLLMProvider(llmConfig);

  const response = await provider.chat([
    {
      role: 'system',
      content: `你是一个前端开发专家。根据提供的 DESIGN.md 设计规范，为一个虚构产品设计一个完整的 Landing Page。

要求：
1. 严格遵循 DESIGN.md 中的所有设计 token（颜色、字体、间距、圆角、阴影）
2. 严格遵循 DESIGN.md 中的组件模式（按钮、卡片、输入框的样式和状态）
3. 严格遵循 DESIGN.md 中的视觉语言（布局哲学、信息密度、品牌个性）
4. 严格遵循 DESIGN.md 中的动效语言（hover 效果、过渡动画）
5. 使用内联 <style>，不用外部框架
6. 页面内容用中文
7. 只输出完整 HTML，不要解释`,
    },
    {
      role: 'user',
      content: `## 设计规范

${designMd}

## 内容简报

${FICTIONAL_BRIEF}

请根据设计规范生成完整的 HTML 页面。`,
    },
  ], { temperature: 0.3, maxTokens: 8192 });

  let html = response.content.trim();
  if (!html.startsWith('<!DOCTYPE') && !html.startsWith('<html')) {
    const match = html.match(/```(?:html)?\n?([\s\S]*?)```/);
    if (match) html = match[1];
  }
  return html;
}

// ─── Step 2: 截图 ───

async function captureScreenshots(
  originalUrl: string,
  generatedHtml: string,
  outputDir: string
): Promise<{ original: string; generated: string; originalAnimated?: string }> {
  console.log('  📸 Capturing full-page screenshots...');
  const browser = await chromium.launch({ headless: true, channel: 'msedge' });
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });

  try {
    // ── 原始网站 ──
    const page1 = await context.newPage();
    await page1.goto(originalUrl, { waitUntil: 'domcontentloaded', timeout: 30000 });
    await page1.waitForTimeout(2000);

    // 先滚动触发懒加载
    await page1.evaluate(async () => {
      const height = document.documentElement.scrollHeight;
      for (let y = 0; y < height; y += 500) {
        window.scrollTo(0, y);
        await new Promise(r => setTimeout(r, 150));
      }
      window.scrollTo(0, 0);
      await new Promise(r => setTimeout(r, 500));
    });

    // 注入 CSS：强制所有元素显示最终状态（跳过滚动动画）
    await page1.addStyleTag({
      content: `
        *, *::before, *::after {
          animation-delay: 0s !important;
          animation-duration: 0s !important;
          animation-play-state: paused !important;
          transition-delay: 0s !important;
          transition-duration: 0s !important;
          animation-iteration-count: 1 !important;
        }
        /* 强制显示被滚动动画隐藏的元素 */
        [style*="opacity: 0"],
        [style*="opacity:0"],
        [style*="transform: translateY"],
        [style*="transform:translateY"],
        [style*="transform: scale(0"],
        [style*="transform:scale(0"],
        [data-animate],
        [data-scroll],
        .fade-in,
        .fade-up,
        .reveal,
        .animate-in,
        .scroll-triggered,
        .aos-init,
        [data-aos] {
          opacity: 1 !important;
          transform: none !important;
          visibility: visible !important;
        }
      `,
    });
    await page1.waitForTimeout(500);

    // 全页截图（所有元素可见）
    const originalPath = join(outputDir, 'original.png');
    await page1.screenshot({ path: originalPath, fullPage: true });

    // 额外截一张首屏动画状态（展示动效感受）
    await page1.evaluate(() => window.scrollTo(0, 0));
    await page1.waitForTimeout(100);
    // 移除强制样式，恢复动画状态
    await page1.addStyleTag({ content: '*, *::before, *::after { animation: revert !important; transition: revert !important; opacity: revert !important; transform: revert !important; }' });
    await page1.waitForTimeout(1000);
    const originalAnimatedPath = join(outputDir, 'original-animated.png');
    await page1.screenshot({ path: originalAnimatedPath, fullPage: false });
    await page1.close();

    // ── 生成的页面 ──
    const page2 = await context.newPage();
    await page2.setContent(generatedHtml, { waitUntil: 'load' });
    await page2.waitForTimeout(500);
    const generatedPath = join(outputDir, 'generated.png');
    await page2.screenshot({ path: generatedPath, fullPage: true });
    await page2.close();

    return { original: originalPath, generated: generatedPath, originalAnimated: originalAnimatedPath };
  } finally {
    await browser.close();
  }
}

// ─── Step 3: 裁判评估 ───

interface EvalResult {
  scores: {
    color_atmosphere: number;
    typography_rhythm: number;
    spatial_density: number;
    component_style: number;
    brand_tone: number;
  };
  total: number;
  strengths: string[];
  weaknesses: string[];
  improvement_suggestions: string[];
}

async function judgeDesign(
  screenshots: { original: string; generated: string; originalAnimated?: string },
  designMd: string,
  llmConfig: LLMConfig
): Promise<EvalResult> {
  console.log('  🔍 Judge evaluating design fidelity...');
  const provider = createLLMProvider({
    ...llmConfig,
    model: llmConfig.visionModel || llmConfig.model,
  });

  const originalBuf = await compressImage(await readFile(screenshots.original));
  const generatedBuf = await compressImage(await readFile(screenshots.generated));

  // 重试 3 次
  for (let attempt = 1; attempt <= 3; attempt++) {
    try {
      // 准备第 3 张图：原始网站的动画状态首屏
      let animatedBuf: Buffer | null = null;
      if (screenshots.originalAnimated) {
        animatedBuf = await compressImage(await readFile(screenshots.originalAnimated));
      }

      const contentParts: any[] = [
        { type: 'text', text: '以下是 DESIGN.md 设计规范摘要：\n\n' + designMd.slice(0, 1500) + '\n\n' },
        { type: 'text', text: '图1：参考网站完整页面（所有内容可见）' },
        { type: 'image_url', image_url: { url: `data:image/jpeg;base64,${originalBuf.toString('base64')}`, detail: 'high' } },
      ];
      if (animatedBuf) {
        contentParts.push({ type: 'text', text: '图2：参考网站首屏（含动效和视觉氛围）' });
        contentParts.push({ type: 'image_url', image_url: { url: `data:image/jpeg;base64,${animatedBuf.toString('base64')}`, detail: 'high' } });
      }
      contentParts.push({ type: 'text', text: `图${animatedBuf ? '3' : '2'}：根据设计规范为虚构产品生成的页面` });
      contentParts.push({ type: 'image_url', image_url: { url: `data:image/jpeg;base64,${generatedBuf.toString('base64')}`, detail: 'high' } });
      contentParts.push({ type: 'text', text: '请从 5 个维度打分并分析。输出 JSON。' });

      const response = await provider.chat([
        { role: 'system', content: JUDGE_PROMPT },
        { role: 'user', content: contentParts },
      ], { temperature: 0.1, maxTokens: 2048 });

      console.log(`    Raw response length: ${response.content.length} chars`);
      console.log(`    Raw response preview: ${response.content.slice(0, 200)}`);

      let jsonStr = response.content.trim();
      jsonStr = jsonStr.replace(/^```(?:json)?\n?/, '').replace(/\n?```$/, '').trim();
      const jsonMatch = jsonStr.match(/\{[\s\S]*\}/);
      if (jsonMatch) jsonStr = jsonMatch[0];

      // 修复常见 JSON 问题
      // 1. 修复单引号为双引号（中文引号也处理）
      jsonStr = jsonStr.replace(/['']/g, '"').replace(/[""]/g, '"');
      // 2. 修复截断
      if (!jsonStr.endsWith('}')) {
        const lastBrace = jsonStr.lastIndexOf('}');
        if (lastBrace > 0) jsonStr = jsonStr.substring(0, lastBrace + 1);
      }
      // 3. 修复 trailing comma
      jsonStr = jsonStr.replace(/,\s*([}\]])/g, '$1');

      const parsed = JSON.parse(jsonStr);
      const scores = parsed.scores || { color_atmosphere: 0, typography_rhythm: 0, spatial_density: 0, component_style: 0, brand_tone: 0 };
      // 总分 = 5 个维度平均分 × 10（百分制）
      const sum = (scores.color_atmosphere || 0) + (scores.typography_rhythm || 0) +
                  (scores.spatial_density || 0) + (scores.component_style || 0) + (scores.brand_tone || 0);
      const total = Math.round(sum / 5 * 10);
      return {
        scores,
        total,
        strengths: Array.isArray(parsed.strengths) ? parsed.strengths : [],
        weaknesses: Array.isArray(parsed.weaknesses) ? parsed.weaknesses : [],
        improvement_suggestions: Array.isArray(parsed.improvement_suggestions) ? parsed.improvement_suggestions : [],
      };
    } catch (err) {
      if (attempt < 3) {
        console.log(`    ⚠️ Attempt ${attempt} failed: ${err instanceof Error ? err.message.slice(0, 80) : err}`);
        continue;
      }
      return {
        scores: { color_atmosphere: 0, typography_rhythm: 0, spatial_density: 0, component_style: 0, brand_tone: 0 },
        total: 0,
        strengths: [],
        weaknesses: ['评估失败: ' + (err instanceof Error ? err.message : String(err))],
        improvement_suggestions: [],
      };
    }
  }
  return {
    scores: { color_atmosphere: 0, typography_rhythm: 0, spatial_density: 0, component_style: 0, brand_tone: 0 },
    total: 0,
    strengths: [],
    weaknesses: ['Unexpected error'],
    improvement_suggestions: [],
  };
}

// ─── 主流程 ───

async function main() {
  const args = process.argv.slice(2);
  if (args.length < 2) {
    console.error('Usage: npx tsx scripts/evaluate.ts <design.md> <original-url>');
    process.exit(1);
  }

  const designMdPath = args[0];
  const originalUrl = args[1];

  const llmConfig = getLLMConfig();
  const outputDir = join(process.cwd(), 'evaluation-results');
  await mkdir(outputDir, { recursive: true });

  const designMd = await readFile(designMdPath, 'utf-8');

  // Step 1: Agent 生成页面
  const html = await generatePage(designMd, llmConfig);
  await writeFile(join(outputDir, 'generated.html'), html, 'utf-8');

  // Step 2: 截图
  const screenshots = await captureScreenshots(originalUrl, html, outputDir);

  // Step 3: 裁判评估
  const evalResult = await judgeDesign(screenshots, designMd, llmConfig);

  // 输出结果
  console.log('\n' + '═'.repeat(60));
  console.log('  EVALUATION RESULT');
  console.log('═'.repeat(60));
  console.log(`\n  Total Score: ${evalResult.total}/100`);
  console.log(`\n  维度评分：`);
  console.log(`    色彩氛围:     ${evalResult.scores.color_atmosphere}/10`);
  console.log(`    排版节奏:     ${evalResult.scores.typography_rhythm}/10`);
  console.log(`    空间密度:     ${evalResult.scores.spatial_density}/10`);
  console.log(`    组件风格:     ${evalResult.scores.component_style}/10`);
  console.log(`    品牌调性:     ${evalResult.scores.brand_tone}/10`);
  console.log(`\n  Strengths:`);
  for (const s of evalResult.strengths) console.log(`    ✅ ${s}`);
  console.log(`\n  Weaknesses:`);
  for (const w of evalResult.weaknesses) console.log(`    ❌ ${w}`);
  console.log(`\n  Improvement Suggestions:`);
  for (const s of evalResult.improvement_suggestions) console.log(`    💡 ${s}`);

  // 保存结果
  await writeFile(join(outputDir, 'evaluation.json'), JSON.stringify(evalResult, null, 2), 'utf-8');

  // 生成报告
  const report = `# Evaluation Report

**Source**: ${designMdPath}
**Date**: ${new Date().toISOString()}

## Scores

| Dimension | Score |
|-----------|-------|
| 色彩氛围 | ${evalResult.scores.color_atmosphere}/10 |
| 排版节奏 | ${evalResult.scores.typography_rhythm}/10 |
| 空间密度 | ${evalResult.scores.spatial_density}/10 |
| 组件风格 | ${evalResult.scores.component_style}/10 |
| 品牌调性 | ${evalResult.scores.brand_tone}/10 |
| **Total** | **${evalResult.total}/100** |

## Strengths
${evalResult.strengths.map(s => `- ${s}`).join('\n')}

## Weaknesses
${evalResult.weaknesses.map(w => `- ${w}`).join('\n')}

## Improvement Suggestions
${evalResult.improvement_suggestions.map(s => `- ${s}`).join('\n')}
`;

  await writeFile(join(outputDir, 'report.md'), report, 'utf-8');
  console.log(`\n  Report: ${join(outputDir, 'report.md')}`);
}

main().catch(err => {
  console.error('Fatal:', err);
  process.exit(1);
});
