/**
 * 评估脚本 v2：测试 DESIGN.md 的风格迁移能力
 *
 * 流程：
 * 1. 读取 DESIGN.md + 匹配的产品 Brief
 * 2. Implementer Agent（有判断力的设计师）生成 HTML
 * 3. 自动化检测（token 匹配度）
 * 4. Judge Agent 打分（视觉还原度、设计质量）
 * 5. Feedback → Implementer 改进 → 再评分
 *
 * 用法:
 *   npx tsx scripts/evaluate.ts --site <name>      # 单站
 *   npx tsx scripts/evaluate.ts --site all          # 全部
 *   npx tsx scripts/evaluate.ts <design.md> <url>   # 旧模式
 */

import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { join } from 'node:path';
import { chromium } from 'playwright';
import { createLLMProvider } from '../src/llm/provider.js';
import { extractFromURL } from '../src/pipeline/orchestrator.js';
import type { LLMConfig } from '../src/types/input.js';
import type { PipelineConfig } from '../src/types/input.js';

// ─── 产品 Brief 模板（按 archetype 匹配）───

const BRIEF_TEMPLATES: Record<string, string> = {
  'immersive-landing': `
为一个创新科技产品设计 Landing Page。

产品名：Lumina
定位：AI 驱动的创意设计工具，帮助设计师从想法到成品只需几分钟
目标用户：专业设计师、创意团队
核心卖点：
1. AI 一键生成设计稿，从草图到成品
2. 实时协作，团队同步编辑
3. 智能设计建议，自动优化排版和配色

页面需要包含：
1. Hero：大标题 + 副标题 + CTA 按钮 + 产品视觉（可用占位符）
2. Features：3-4 个核心功能展示
3. 社会证明：用户数据或客户 Logo
4. CTA：最终行动号召

设计时参考 DESIGN.md 的设计风格，但要根据产品定位做适当调整。
`,

  'consumer-app': `
为一个内容社区平台设计首页。

产品名：Flicker
定位：发现和分享优质视觉内容的社区
目标用户：创意爱好者、摄影师、设计师
核心卖点：
1. 个性化推荐，发现你喜欢的内容
2. 创作者工具，轻松制作精美内容
3. 社区互动，与志同道合的人交流

页面需要包含：
1. 顶部导航：搜索 + 分类 + 用户入口
2. 内容推荐区：卡片网格展示热门内容
3. 分类导航：不同内容分类的快速入口
4. 创作者展示：推荐创作者区域
5. 注册/登录入口

设计时参考 DESIGN.md 的设计风格，但要根据产品定位做适当调整。
`,

  'showcase-gallery': `
为一个设计灵感展示平台设计首页。

产品名：Canvas
定位：汇聚全球优秀设计作品的灵感平台
目标用户：设计师、创意总监、品牌团队
核心卖点：
1. 精选全球顶级设计作品
2. 按风格、行业、类型筛选
3. 设计师个人主页和作品集

页面需要包含：
1. Hero：平台介绍 + 搜索/筛选入口
2. 精选作品：大尺寸卡片网格展示
3. 分类筛选：按风格/行业/类型的快速筛选
4. 设计师推荐：优秀设计师展示
5. 提交作品入口

设计时参考 DESIGN.md 的设计风格，但要根据产品定位做适当调整。
`,

  'enterprise': `
为一个 B2B 云服务产品设计 Landing Page。

产品名：CloudForge
定位：面向开发者的全栈云开发平台
目标用户：开发团队、技术负责人、企业 CTO
核心卖点：
1. 一站式开发环境，代码到部署只需几分钟
2. 自动扩缩容，按需付费
3. 企业级安全合规

页面需要包含：
1. Hero：价值主张 + CTA + 技术架构示意
2. 核心功能：3-4 个功能模块（代码托管、CI/CD、云部署、监控）
3. 技术优势：数据对比或性能指标
4. 客户案例：知名企业的使用场景
5. 价格方案：3 个定价层级
6. CTA：免费试用入口

设计时参考 DESIGN.md 的设计风格，但要根据产品定位做适当调整。
`,

  'minimal-portfolio': `
为一个 AI 工具产品设计 Landing Page。

产品名：Synth
定位：AI 辅助的数据分析和可视化工具
目标用户：数据分析师、产品经理、业务决策者
核心卖点：
1. 自然语言查询，无需写 SQL
2. AI 自动生成可视化图表
3. 智能洞察，自动发现数据趋势

页面需要包含：
1. Hero：一句话价值主张 + 产品演示区
2. 工作流程：3 步展示使用流程
3. 功能详情：核心功能深入展示
4. 使用场景：不同行业的应用案例
5. CTA：开始使用

设计时参考 DESIGN.md 的设计风格，但要根据产品定位做适当调整。
`,
};

// 默认 brief（无法匹配 archetype 时使用）
const DEFAULT_BRIEF = `
为一个 SaaS 产品设计 Landing Page。

产品名：Nexus
定位：团队协作和项目管理工具
目标用户：远程团队、项目经理
核心卖点：
1. 实时协作，多人同时编辑
2. 智能任务分配和进度追踪
3. 数据洞察，团队效率分析

页面需要包含：
1. Hero：价值主张 + CTA
2. 核心功能：3 个功能展示
3. 社会证明：用户评价或数据
4. 价格方案：3 个层级
5. CTA：最终行动号召

设计时参考 DESIGN.md 的设计风格，但要根据产品定位做适当调整。
`;

function getBrief(archetype: string): string {
  return BRIEF_TEMPLATES[archetype] || DEFAULT_BRIEF;
}

// ─── Judge 评分维度 ───

const JUDGE_PROMPT = `你是高级设计总监，负责评估 UI 设计的还原度和质量。

你会看到两张全页截图：
- 图1：参考网站的完整页面
- 图2：根据该网站的设计规范（DESIGN.md），为一个新产品设计的页面

你的任务是判断：
1. 生成的页面是否成功继承了参考网站的视觉风格？
2. 生成的页面本身设计质量如何？

请从以下 3 个维度打分（1-10 分）：

## 评分维度

1. **视觉还原度**（Visual Fidelity）
   - 色彩方案、排版节奏、空间密度、组件风格是否与参考一致
   - 1分：完全不像参考网站
   - 10分：一眼就能看出是同一个设计系统产出的

2. **设计质量**（Design Quality）
   - 页面本身是否好看、专业、有高级感
   - 1分：业余、粗糙、不协调
   - 10分：专业级设计，可以直接上线

3. **风格一致性**（Style Consistency）
   - 页面内各部分是否风格统一
   - 1分：各部分像拼凑的
   - 10分：整体浑然一体

## 输出格式

你必须且只能输出一个合法的 JSON 对象，不要用 markdown 代码块包裹：

{
  "scores": {
    "visual_fidelity": 0,
    "design_quality": 0,
    "style_consistency": 0
  },
  "total": 0,
  "strengths": ["做得好的方面"],
  "weaknesses": ["做得不好的方面，要具体"],
  "feedback": "给设计师的具体改进建议，要能指导下一轮修改"
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
    baseUrl: process.env.LLM_BASE_URL || 'https://token-plan-cn.xiaomimimo.com/anthropic',
  };
}

async function compressImage(buffer: Buffer): Promise<Buffer> {
  const sharp = (await import('sharp')).default;
  const metadata = await sharp(buffer).metadata();
  const height = metadata.height || 1000;
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

// ─── Implementer: 有判断力的设计师 ───

async function generatePage(
  designMd: string,
  brief: string,
  llmConfig: LLMConfig,
  feedback?: string,
): Promise<string> {
  const hasFeedback = !!feedback;
  console.log(`    ${hasFeedback ? '🔄' : '🎨'} Implementer generating page${hasFeedback ? ' (with feedback)' : ''}...`);

  const provider = createLLMProvider(llmConfig);

  const systemPrompt = `你是一个有判断力的 UI 设计师。你会收到两份材料：
1. DESIGN.md — 一个网站的设计系统文档（包含设计感觉、token、CSS 代码、页面结构等）
2. 产品简报 — 你需要为这个产品设计一个 landing page

你的工作方式：
- 阅读 DESIGN.md，理解目标网站的设计风格和感觉
- 参考 DESIGN.md 中的 CSS 代码片段、token 值、页面结构
- 但你不是机械复制 —— 你要根据产品需求做适当调整
- 在合适的地方使用 CSS 代码片段，不合适的地方可以不用
- 最终目标：设计出既符合 DESIGN.md 风格、又适配产品需求的页面

技术要求：
- 使用内联 <style>，不用外部框架
- 页面内容用中文
- 只输出完整 HTML，不要解释`;

  const userContent = hasFeedback
    ? `## DESIGN.md

${designMd}

## 产品简报

${brief}

## 上一轮反馈（请据此改进）

${feedback}

请根据 DESIGN.md 的设计风格和上述反馈，改进页面设计。输出完整 HTML。`
    : `## DESIGN.md

${designMd}

## 产品简报

${brief}

请根据 DESIGN.md 的设计风格，为这个产品设计 landing page。输出完整 HTML。`;

  const response = await provider.chat([
    { role: 'system', content: systemPrompt },
    { role: 'user', content: userContent },
  ], { temperature: 0.3, maxTokens: 8192 });

  let html = response.content.trim();
  if (!html.startsWith('<!DOCTYPE') && !html.startsWith('<html')) {
    const match = html.match(/```(?:html)?\n?([\s\S]*?)```/);
    if (match) html = match[1];
  }
  return html;
}

// ─── 自动化检测 ───

interface AutoCheck {
  color_match: number;    // 0-100：生成页用了 DESIGN.md 中几个颜色？
  font_match: number;     // 0-100：字体是否匹配？
  spacing_match: number;  // 0-100：间距是否在范围内？
}

async function autoCheck(html: string, designMd: string): Promise<AutoCheck> {
  // 从 DESIGN.md 中提取颜色值
  const colorMatches = designMd.match(/#[0-9a-fA-F]{3,8}/g) || [];
  const uniqueColors = [...new Set(colorMatches.map(c => c.toLowerCase()))];

  // 从 DESIGN.md 中提取字体（保留供后续扩展）
  // const fontMatches = designMd.match(/(?:font-family|font_stack|heading|body).*?[:|]?\s*([A-Za-z][\w\s,-]+)/gi) || [];

  // 从 HTML 中检测
  const htmlLower = html.toLowerCase();
  const usedColors = uniqueColors.filter((c: string) => htmlLower.includes(c));
  const colorScore = uniqueColors.length > 0 ? Math.round(usedColors.length / uniqueColors.length * 100) : 50;

  // 字体匹配
  const htmlFonts = html.match(/font-family:\s*([^;]+)/gi) || [];
  const fontScore = htmlFonts.some((f: string) => f.toLowerCase().includes('inter') || f.toLowerCase().includes('system-ui'))
    ? 80 : 50; // 简化判断

  // 间距匹配
  const spacingValues = designMd.match(/\b(\d+)px\b/g) || [];
  const commonSpacings = [...new Set(spacingValues)].slice(0, 10);
  const usedSpacings = commonSpacings.filter(v => htmlLower.includes(v));
  const spacingScore = commonSpacings.length > 0 ? Math.round(usedSpacings.length / commonSpacings.length * 100) : 50;

  return {
    color_match: Math.min(100, colorScore),
    font_match: Math.min(100, fontScore),
    spacing_match: Math.min(100, spacingScore),
  };
}

// ─── Judge: 评分 ───

interface JudgeResult {
  scores: {
    visual_fidelity: number;
    design_quality: number;
    style_consistency: number;
  };
  total: number;
  strengths: string[];
  weaknesses: string[];
  feedback: string;
}

async function judgeDesign(
  screenshots: { original: string; generated: string },
  designMd: string,
  llmConfig: LLMConfig,
): Promise<JudgeResult> {
  console.log(`    🔍 Judge evaluating...`);
  const provider = createLLMProvider({
    ...llmConfig,
    model: llmConfig.visionModel || llmConfig.model,
  });

  const originalBuf = await compressImage(await readFile(screenshots.original));
  const generatedBuf = await compressImage(await readFile(screenshots.generated));

  for (let attempt = 1; attempt <= 3; attempt++) {
    try {
      const response = await provider.chat([
        { role: 'system', content: JUDGE_PROMPT },
        {
          role: 'user',
          content: [
            { type: 'text', text: 'DESIGN.md 摘要：\n' + designMd.slice(0, 1000) + '\n\n' },
            { type: 'text', text: '图1：参考网站' },
            { type: 'image_url', image_url: { url: `data:image/jpeg;base64,${originalBuf.toString('base64')}`, detail: 'high' } },
            { type: 'text', text: '图2：为新产品设计的页面' },
            { type: 'image_url', image_url: { url: `data:image/jpeg;base64,${generatedBuf.toString('base64')}`, detail: 'high' } },
            { type: 'text', text: '请从 3 个维度打分。输出 JSON。' },
          ],
        },
      ], { temperature: 0.1, maxTokens: 2048 });

      console.log(`    Raw response: ${response.content.slice(0, 150)}...`);

      let jsonStr = response.content.trim();
      jsonStr = jsonStr.replace(/^```(?:json)?\n?/, '').replace(/\n?```$/, '').trim();
      const jsonMatch = jsonStr.match(/\{[\s\S]*\}/);
      if (jsonMatch) jsonStr = jsonMatch[0];
      jsonStr = jsonStr.replace(/['']/g, '"').replace(/[""]/g, '"');
      if (!jsonStr.endsWith('}')) {
        const lastBrace = jsonStr.lastIndexOf('}');
        if (lastBrace > 0) jsonStr = jsonStr.substring(0, lastBrace + 1);
      }
      jsonStr = jsonStr.replace(/,\s*([}\]])/g, '$1');

      const parsed = JSON.parse(jsonStr);
      const scores = parsed.scores || { visual_fidelity: 0, design_quality: 0, style_consistency: 0 };
      const sum = (scores.visual_fidelity || 0) + (scores.design_quality || 0) + (scores.style_consistency || 0);
      const total = Math.round(sum / 3 * 10);

      return {
        scores,
        total,
        strengths: Array.isArray(parsed.strengths) ? parsed.strengths : [],
        weaknesses: Array.isArray(parsed.weaknesses) ? parsed.weaknesses : [],
        feedback: parsed.feedback || '',
      };
    } catch (err) {
      if (attempt < 3) {
        console.log(`    ⚠️ Attempt ${attempt} failed: ${err instanceof Error ? err.message.slice(0, 60) : err}`);
        continue;
      }
      return {
        scores: { visual_fidelity: 0, design_quality: 0, style_consistency: 0 },
        total: 0, strengths: [], weaknesses: ['评估失败'],
        feedback: '',
      };
    }
  }
  return {
    scores: { visual_fidelity: 0, design_quality: 0, style_consistency: 0 },
    total: 0, strengths: [], weaknesses: ['Unexpected error'],
    feedback: '',
  };
}

// ─── 截图 ───

async function captureScreenshots(
  originalUrl: string,
  generatedHtml: string,
  outputDir: string,
): Promise<{ original: string; generated: string }> {
  console.log(`    📸 Capturing screenshots...`);
  const browser = await chromium.launch({ headless: true, channel: 'msedge' });
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });

  try {
    // 原始网站
    const page1 = await context.newPage();
    await page1.goto(originalUrl, { waitUntil: 'domcontentloaded', timeout: 30000 });
    await page1.waitForTimeout(2000);
    await page1.evaluate(async () => {
      const height = document.documentElement.scrollHeight;
      for (let y = 0; y < height; y += 500) {
        window.scrollTo(0, y);
        await new Promise(r => setTimeout(r, 150));
      }
      window.scrollTo(0, 0);
      await new Promise(r => setTimeout(r, 500));
    });
    await page1.addStyleTag({
      content: `*, *::before, *::after {
        animation-delay: 0s !important; animation-duration: 0s !important;
        transition-delay: 0s !important; transition-duration: 0s !important;
      }
      [style*="opacity: 0"], [data-animate], [data-scroll], [data-aos],
      .fade-in, .fade-up, .reveal, .animate-in {
        opacity: 1 !important; transform: none !important; visibility: visible !important;
      }`,
    });
    await page1.waitForTimeout(500);
    const originalPath = join(outputDir, 'original.png');
    await page1.screenshot({ path: originalPath, fullPage: true });
    await page1.close();

    // 生成页面
    const page2 = await context.newPage();
    await page2.setContent(generatedHtml, { waitUntil: 'load' });
    await page2.waitForTimeout(500);
    const generatedPath = join(outputDir, 'generated.png');
    await page2.screenshot({ path: generatedPath, fullPage: true });
    await page2.close();

    return { original: originalPath, generated: generatedPath };
  } finally {
    await browser.close();
  }
}

// ─── 测试站点 ───

const TEST_SITES = [
  { name: 'apple', url: 'https://www.apple.com.cn', archetype: 'immersive-landing' },
  { name: 'bilibili', url: 'https://www.bilibili.com', archetype: 'consumer-app' },
  { name: 'mobbin', url: 'https://mobbin.com', archetype: 'showcase-gallery' },
  { name: 'volcengine', url: 'https://www.volcengine.com/activity/codingplan', archetype: 'enterprise' },
  { name: 'cssda', url: 'https://www.cssdesignawards.com', archetype: 'showcase-gallery' },
  { name: 'accio', url: 'https://www.accio-ai.com/work', archetype: 'minimal-portfolio' },
];

// ─── 单站评估 ───

interface SiteEvalResult {
  name: string;
  url: string;
  archetype: string;
  round1_score: number;
  round2_score: number;
  final_score: number;
  improvement: number;
  auto_check: AutoCheck;
  scores: Record<string, number>;
  strengths: string[];
  weaknesses: string[];
  feedback: string;
  error?: string;
}

async function evaluateSite(
  site: typeof TEST_SITES[0],
  llmConfig: LLMConfig,
  baseOutputDir: string,
): Promise<SiteEvalResult> {
  const siteDir = join(baseOutputDir, site.name);
  await mkdir(siteDir, { recursive: true });

  // 读取 DESIGN.md，不存在则自动提取
  const designMdPath = join(process.cwd(), 'test-results', 'round-1', 'sites', site.name, 'design.md');
  let designMd: string;
  try {
    designMd = await readFile(designMdPath, 'utf-8');
    console.log(`\n  🎨 ${site.name} (${site.archetype}) — using existing DESIGN.md`);
  } catch {
    // DESIGN.md 不存在，运行提取
    console.log(`\n  📦 ${site.name} — extracting DESIGN.md...`);
    try {
      const pipelineConfig: PipelineConfig = {
        llm: llmConfig,
        browser: { headless: true, channel: 'msedge' as const },
        output: { format: 'full', language: 'zh' },
      };
      const result = await extractFromURL(site.url, pipelineConfig);
      designMd = result.markdown;

      // 保存到 test-results/round-1/sites/<name>/
      const extractDir = join(process.cwd(), 'test-results', 'round-1', 'sites', site.name);
      await mkdir(extractDir, { recursive: true });
      await writeFile(join(extractDir, 'design.md'), result.markdown, 'utf-8');
      await writeFile(join(extractDir, 'doc.json'), JSON.stringify(result.doc, null, 2), 'utf-8');
      await writeFile(join(extractDir, 'raw.json'), JSON.stringify(result.raw, null, 2), 'utf-8');

      console.log(`    ✅ Extracted (confidence: ${(result.meta.confidence * 100).toFixed(0)}%)`);
    } catch (extractErr) {
      return {
        name: site.name, url: site.url, archetype: site.archetype,
        round1_score: 0, round2_score: 0, final_score: 0, improvement: 0,
        auto_check: { color_match: 0, font_match: 0, spacing_match: 0 },
        scores: {}, strengths: [], weaknesses: [], feedback: '',
        error: `Extraction failed: ${extractErr instanceof Error ? extractErr.message : String(extractErr)}`,
      };
    }
  }

  const brief = getBrief(site.archetype);

  console.log(`\n  🎨 ${site.name} (${site.archetype})`);

  try {
    // ── Round 1: 初始生成 ──
    console.log(`    Round 1: Generating...`);
    const html1 = await generatePage(designMd, brief, llmConfig);
    await writeFile(join(siteDir, 'round1.html'), html1, 'utf-8');

    const screenshots1 = await captureScreenshots(site.url, html1, siteDir);
    await writeFile(join(siteDir, 'round1-generated.png'), ''); // placeholder
    const judge1 = await judgeDesign(screenshots1, designMd, llmConfig);
    await writeFile(join(siteDir, 'round1-judge.json'), JSON.stringify(judge1, null, 2), 'utf-8');
    console.log(`    Round 1 Score: ${judge1.total}/100`);

    // 自动化检测
    const autoCheckResult = await autoCheck(html1, designMd);

    // ── Round 2: Feedback 改进 ──
    console.log(`    Round 2: Improving with feedback...`);
    const feedbackText = `上一轮评分：${judge1.total}/100
优点：${judge1.strengths.join('；')}
不足：${judge1.weaknesses.join('；')}
改进建议：${judge1.feedback}`;

    const html2 = await generatePage(designMd, brief, llmConfig, feedbackText);
    await writeFile(join(siteDir, 'round2.html'), html2, 'utf-8');

    const screenshots2 = await captureScreenshots(site.url, html2, siteDir);
    const judge2 = await judgeDesign(screenshots2, designMd, llmConfig);
    await writeFile(join(siteDir, 'round2-judge.json'), JSON.stringify(judge2, null, 2), 'utf-8');
    console.log(`    Round 2 Score: ${judge2.total}/100 (Δ${judge2.total >= judge1.total ? '+' : ''}${judge2.total - judge1.total})`);

    return {
      name: site.name,
      url: site.url,
      archetype: site.archetype,
      round1_score: judge1.total,
      round2_score: judge2.total,
      final_score: judge2.total,
      improvement: judge2.total - judge1.total,
      auto_check: autoCheckResult,
      scores: judge2.scores,
      strengths: judge2.strengths,
      weaknesses: judge2.weaknesses,
      feedback: judge2.feedback,
    };
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.log(`    ❌ Error: ${msg.slice(0, 80)}`);
    return {
      name: site.name, url: site.url, archetype: site.archetype,
      round1_score: 0, round2_score: 0, final_score: 0, improvement: 0,
      auto_check: { color_match: 0, font_match: 0, spacing_match: 0 },
      scores: {}, strengths: [], weaknesses: [], feedback: '',
      error: msg,
    };
  }
}

// ─── 汇总报告 ───

async function generateSummaryReport(results: SiteEvalResult[], outputDir: string) {
  const valid = results.filter(r => !r.error);
  const avg = (arr: number[]) => arr.length ? arr.reduce((a, b) => a + b, 0) / arr.length : 0;

  const avgFinal = avg(valid.map(r => r.final_score));
  const avgRound1 = avg(valid.map(r => r.round1_score));
  const avgImprovement = avg(valid.map(r => r.improvement));
  const avgColorMatch = avg(valid.map(r => r.auto_check.color_match));
  const avgFontMatch = avg(valid.map(r => r.auto_check.font_match));
  const avgSpacingMatch = avg(valid.map(r => r.auto_check.spacing_match));

  const report = `# Evaluation Summary v2

**Date**: ${new Date().toISOString()}
**Sites**: ${results.length} (${valid.length} successful)
**Average Final Score**: **${avgFinal.toFixed(1)}/100**
**Average Improvement**: **${avgImprovement >= 0 ? '+' : ''}${avgImprovement.toFixed(1)}** (Round 1 → Round 2)

## Per-Site Results

| Site | Archetype | R1 | R2 | Final | Δ | Color | Font | Spacing |
|------|-----------|----|----|-------|---|-------|------|---------|
${results.map(r => `| ${r.name} | ${r.archetype} | ${r.error ? '❌' : r.round1_score} | ${r.error ? '❌' : r.round2_score} | ${r.error ? '❌' : r.final_score} | ${r.error ? '-' : (r.improvement >= 0 ? '+' : '') + r.improvement} | ${r.error ? '-' : Math.round(r.auto_check.color_match)}% | ${r.error ? '-' : Math.round(r.auto_check.font_match)}% | ${r.error ? '-' : Math.round(r.auto_check.spacing_match)}% |`).join('\n')}
| **Avg** | | **${avgRound1.toFixed(0)}** | | **${avgFinal.toFixed(0)}** | **${avgImprovement >= 0 ? '+' : ''}${avgImprovement.toFixed(0)}** | **${avgColorMatch.toFixed(0)}%** | **${avgFontMatch.toFixed(0)}%** | **${avgSpacingMatch.toFixed(0)}%** |

## Score Dimensions (Round 2)

| Site | Visual Fidelity | Design Quality | Style Consistency |
|------|----------------|----------------|-------------------|
${results.map(r => `| ${r.name} | ${r.scores.visual_fidelity ?? '-'} | ${r.scores.design_quality ?? '-'} | ${r.scores.style_consistency ?? '-'} |`).join('\n')}

## Top Weaknesses

${(() => {
  const freq = new Map<string, number>();
  for (const w of valid.flatMap(r => r.weaknesses)) freq.set(w, (freq.get(w) || 0) + 1);
  return [...freq.entries()].sort((a, b) => b[1] - a[1]).slice(0, 10)
    .map(([w, c]) => `- (${c}x) ${w}`).join('\n') || '- None'
})()}

## Top Feedback

${valid.filter(r => r.feedback).map(r => `### ${r.name}\n${r.feedback}`).join('\n\n')}
`;

  await writeFile(join(outputDir, 'summary.md'), report, 'utf-8');
  await writeFile(join(outputDir, 'summary.json'), JSON.stringify({ avgFinal, avgRound1, avgImprovement, results }, null, 2), 'utf-8');

  return { avgFinal, avgRound1, avgImprovement };
}

// ─── 主流程 ───

async function main() {
  const args = process.argv.slice(2);
  let siteArg: string | null = null;

  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--site' && args[i + 1]) {
      siteArg = args[i + 1];
      i++;
    }
  }

  if (!siteArg) {
    console.error('Usage:');
    console.error('  npx tsx scripts/evaluate.ts --site <name>');
    console.error('  npx tsx scripts/evaluate.ts --site all');
    process.exit(1);
  }

  const llmConfig = getLLMConfig();
  const sites = siteArg === 'all' ? TEST_SITES : TEST_SITES.filter(s => s.name === siteArg);

  if (sites.length === 0) {
    console.error(`Unknown site: ${siteArg}. Available: ${TEST_SITES.map(s => s.name).join(', ')}`);
    process.exit(1);
  }

  const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
  const outputDir = join(process.cwd(), 'evaluation-results', `eval-${timestamp}`);
  await mkdir(outputDir, { recursive: true });

  console.log(`\n${'═'.repeat(60)}`);
  console.log(`  EVALUATION v2 — ${sites.length} site(s)`);
  console.log(`  Output: ${outputDir}`);
  console.log(`${'═'.repeat(60)}`);

  const results: SiteEvalResult[] = [];
  for (const site of sites) {
    results.push(await evaluateSite(site, llmConfig, outputDir));
  }

  const { avgFinal, avgImprovement } = await generateSummaryReport(results, outputDir);

  console.log(`\n${'═'.repeat(60)}`);
  console.log(`  EVALUATION COMPLETE`);
  console.log(`${'═'.repeat(60)}`);
  console.log(`\n  Average Final Score: ${avgFinal.toFixed(1)}/100`);
  console.log(`  Average Improvement: ${avgImprovement >= 0 ? '+' : ''}${avgImprovement.toFixed(1)}\n`);

  for (const r of results) {
    const status = r.error ? '❌' : r.final_score >= 70 ? '✅' : r.final_score >= 50 ? '⚠️' : '🔴';
    const delta = r.improvement >= 0 ? `+${r.improvement}` : `${r.improvement}`;
    console.log(`  ${status} ${r.name.padEnd(12)} ${r.error ? r.error.slice(0, 40) : `${r.round1_score} → ${r.final_score} (${delta})`}`);
  }
  console.log(`\n  Summary: ${join(outputDir, 'summary.md')}`);
  console.log('');
}

main().catch(err => {
  console.error('Fatal:', err);
  process.exit(1);
});
