/**
 * 闭环测试系统：单轮完整流程
 *
 * 流程：提取 10 个网站 → 生成 DESIGN.md → 反向验证 → 分析报告
 *
 * 用法: npx tsx scripts/run-round.ts [--round N]
 *
 * 输出目录结构:
 *   test-results/
 *     round-1/
 *       sites/
 *         linear/
 *           design.md          # 生成的 DESIGN.md
 *           doc.json           # 结构化数据
 *           raw.json           # 提取原始数据
 *           generated.html     # LLM 根据 DESIGN.md 生成的 HTML
 *           original.png       # 原始网站截图
 *           generated.png      # 生成页面截图
 *           validation.json    # 单站验证结果
 *         notion/
 *           ...
 *       summary.json           # 本轮汇总数据
 *       report.md              # 人类可读的分析报告
 *     round-2/
 *       ...
 *     comparison.md            # 跨轮次对比报告
 */

import { extractFromURL } from '../src/pipeline/orchestrator.js';
import { createLLMProvider } from '../src/llm/provider.js';
import type { PipelineConfig, LLMConfig } from '../src/types/input.js';
import { writeFile, mkdir, readFile, readdir } from 'node:fs/promises';
import { join } from 'node:path';
import { chromium } from 'playwright';

// ─── 测试网站 ───

const TEST_SITES = [
  { name: 'linear', url: 'https://linear.app', archetype: 'dark-tool' },
  { name: 'notion', url: 'https://notion.so', archetype: 'light-saas' },
  { name: 'vercel', url: 'https://vercel.com', archetype: 'developer-docs' },
  { name: 'stripe', url: 'https://stripe.com', archetype: 'playful-brand' },
  { name: 'github', url: 'https://github.com', archetype: 'developer-docs' },
  { name: 'spotify', url: 'https://open.spotify.com', archetype: 'consumer-app' },
  { name: 'medium', url: 'https://medium.com', archetype: 'news-editorial' },
  { name: 'figma', url: 'https://figma.com', archetype: 'light-saas' },
  { name: 'tailwind', url: 'https://tailwindcss.com', archetype: 'developer-docs' },
  { name: 'hn', url: 'https://news.ycombinator.com', archetype: 'news-editorial' },
];

const TARGET_SCORE = 80; // 目标基准线

// ─── 类型 ───

interface SiteResult {
  name: string;
  url: string;
  expectedArchetype: string;
  detectedArchetype: string;
  confidence: number;
  pipelineDuration: number;
  llmTokens: number;
  degraded: string[];
  similarityScore: number;
  feedback: string;
  strengths: string[];
  weaknesses: string[];
  error?: string;
}

interface RoundSummary {
  round: number;
  timestamp: string;
  avgScore: number;
  avgConfidence: number;
  passRate: number; // 达到 80% 的比例
  totalTokens: number;
  totalDuration: number;
  sites: SiteResult[];
}

// ─── 工具函数 ───

function getRoundDir(round: number): string {
  return join(process.cwd(), 'test-results', `round-${round}`);
}

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

// ─── 阶段 1：提取 ───

async function extractSite(
  site: typeof TEST_SITES[0],
  config: PipelineConfig,
  siteDir: string
): Promise<SiteResult> {
  console.log(`  📦 Extracting: ${site.name}`);
  const startTime = Date.now();

  try {
    const result = await extractFromURL(site.url, config);

    await mkdir(siteDir, { recursive: true });
    await writeFile(join(siteDir, 'design.md'), result.markdown, 'utf-8');
    await writeFile(join(siteDir, 'doc.json'), JSON.stringify(result.doc, null, 2), 'utf-8');
    await writeFile(join(siteDir, 'raw.json'), JSON.stringify(result.raw, null, 2), 'utf-8');

    return {
      name: site.name,
      url: site.url,
      expectedArchetype: site.archetype,
      detectedArchetype: result.doc.frontmatter.style_archetype,
      confidence: result.meta.confidence,
      pipelineDuration: result.meta.duration,
      llmTokens: result.meta.llmTokensUsed,
      degraded: result.meta.degraded,
      similarityScore: 0, // 后续填充
      feedback: '',
      strengths: [],
      weaknesses: [],
    };
  } catch (err) {
    return {
      name: site.name,
      url: site.url,
      expectedArchetype: site.archetype,
      detectedArchetype: 'unknown',
      confidence: 0,
      pipelineDuration: Date.now() - startTime,
      llmTokens: 0,
      degraded: ['all'],
      similarityScore: 0,
      feedback: '',
      strengths: [],
      weaknesses: [],
      error: err instanceof Error ? err.message : String(err),
    };
  }
}

// ─── 阶段 2：反向验证 ───

async function validateSite(
  siteResult: SiteResult,
  llmConfig: LLMConfig,
  siteDir: string
): Promise<void> {
  if (siteResult.error) {
    siteResult.similarityScore = 0;
    siteResult.feedback = '提取失败，无法验证';
    return;
  }

  console.log(`  🔍 Validating: ${siteResult.name}`);

  try {
    // 读取 DESIGN.md
    const designMd = await readFile(join(siteDir, 'design.md'), 'utf-8');

    // LLM 生成 HTML
    const html = await generateHTML(designMd, llmConfig);
    await writeFile(join(siteDir, 'generated.html'), html, 'utf-8');

    // 截图对比
    const screenshots = await captureScreenshots(siteResult.url, html, siteDir);

    // 多模态 LLM 评估相似度
    const comparison = await compareSimilarity(
      screenshots.original,
      screenshots.generated,
      llmConfig
    );

    siteResult.similarityScore = comparison.score;
    siteResult.feedback = comparison.feedback;
    siteResult.strengths = comparison.strengths;
    siteResult.weaknesses = comparison.weaknesses;

    // 保存验证结果
    await writeFile(
      join(siteDir, 'validation.json'),
      JSON.stringify(comparison, null, 2),
      'utf-8'
    );

    const status = comparison.score >= TARGET_SCORE ? '✅' : '⚠️';
    console.log(`    ${status} Score: ${comparison.score}/100`);
  } catch (err) {
    siteResult.similarityScore = 0;
    siteResult.feedback = `验证失败: ${err instanceof Error ? err.message : err}`;
    console.log(`    ❌ Validation failed: ${err instanceof Error ? err.message : err}`);
  }
}

async function generateHTML(designMd: string, llmConfig: LLMConfig): Promise<string> {
  const provider = createLLMProvider(llmConfig);

  const response = await provider.chat([
    {
      role: 'system',
      content: `你是一个前端开发专家。根据 DESIGN.md 生成一个完整 HTML 页面。

要求：
1. 展示设计系统的核心视觉特征（色彩、排版、间距、组件风格）
2. 包含：导航栏、标题区域、卡片列表、按钮、输入框
3. 使用内联 <style>，不用外部框架
4. 严格遵循 DESIGN.md 中的 token 值
5. 只输出 HTML，不要解释
6. 视口 1440x900`,
    },
    { role: 'user', content: designMd },
  ], { temperature: 0.3, maxTokens: 8192 });

  let html = response.content.trim();
  if (!html.startsWith('<!DOCTYPE') && !html.startsWith('<html')) {
    const match = html.match(/```(?:html)?\n?([\s\S]*?)```/);
    if (match) html = match[1];
  }
  return html;
}

async function captureScreenshots(
  originalUrl: string,
  generatedHtml: string,
  siteDir: string
): Promise<{ original: string; generated: string }> {
  const browser = await chromium.launch({ headless: true, channel: 'chrome' });
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });

  try {
    // 原始网站截图（允许失败）
    const originalPath = join(siteDir, 'original.png');
    try {
      const page1 = await context.newPage();
      await page1.goto(originalUrl, { waitUntil: 'domcontentloaded', timeout: 30000 });
      await page1.waitForTimeout(2000);
      await page1.screenshot({ path: originalPath, fullPage: false });
      await page1.close();
    } catch (err) {
      console.log(`    ⚠️ Original screenshot failed: ${err instanceof Error ? err.message.slice(0, 60) : err}`);
      throw new Error(`Original screenshot failed: ${err instanceof Error ? err.message : err}`);
    }

    // 生成页面截图
    const generatedPath = join(siteDir, 'generated.png');
    const page2 = await context.newPage();
    await page2.setContent(generatedHtml, { waitUntil: 'load' });
    await page2.waitForTimeout(500);
    await page2.screenshot({ path: generatedPath, fullPage: false });
    await page2.close();

    return { original: originalPath, generated: generatedPath };
  } finally {
    await browser.close();
  }
}

async function compareSimilarity(
  originalPath: string,
  generatedPath: string,
  llmConfig: LLMConfig
): Promise<{ score: number; feedback: string; strengths: string[]; weaknesses: string[] }> {
  const provider = createLLMProvider({
    ...llmConfig,
    model: llmConfig.visionModel || llmConfig.model,
  });

  const originalBuffer = await readFile(originalPath);
  const generatedBuffer = await readFile(generatedPath);

  // 重试最多 3 次
  for (let attempt = 1; attempt <= 3; attempt++) {
    try {
      const response = await provider.chat([
        {
          role: 'system',
          content: `你是 UI 设计评审专家。对比两张截图的视觉相似度。

评估维度：色彩方案、排版、间距布局、组件风格、整体氛围。

你必须且只能输出一个合法的 JSON 对象，不要输出任何其他文字，不要用 markdown 代码块包裹：
{"score":0到100的整数,"feedback":"50到100字的评价","strengths":["优点1","优点2"],"weaknesses":["缺点1","缺点2"]}`,
        },
        {
          role: 'user',
          content: [
            { type: 'text', text: '图1是原始网站，图2是根据设计文档生成的页面。请评估视觉相似度。' },
            { type: 'image_url', image_url: { url: `data:image/png;base64,${originalBuffer.toString('base64')}`, detail: 'high' } },
            { type: 'image_url', image_url: { url: `data:image/png;base64,${generatedBuffer.toString('base64')}`, detail: 'high' } },
          ],
        },
      ], { temperature: 0.1, maxTokens: 512 });

      let jsonStr = response.content.trim();

      // 去除 markdown 代码块包裹
      jsonStr = jsonStr.replace(/^```(?:json)?\n?/, '').replace(/\n?```$/, '').trim();

      // 尝试从响应中提取 JSON 对象
      const jsonMatch = jsonStr.match(/\{[\s\S]*\}/);
      if (jsonMatch) jsonStr = jsonMatch[0];

      // 修复常见问题：截断的 JSON
      if (!jsonStr.endsWith('}')) {
        // 尝试补全
        const lastBrace = jsonStr.lastIndexOf('}');
        if (lastBrace > 0) jsonStr = jsonStr.substring(0, lastBrace + 1);
        else {
          // 尝试补全缺失的括号
          const openBraces = (jsonStr.match(/{/g) || []).length - (jsonStr.match(/}/g) || []).length;
          const openBrackets = (jsonStr.match(/\[/g) || []).length - (jsonStr.match(/]/g) || []).length;
          for (let i = 0; i < openBrackets; i++) jsonStr += ']';
          for (let i = 0; i < openBraces; i++) jsonStr += '}';
        }
      }

      const result = JSON.parse(jsonStr);
      return {
        score: typeof result.score === 'number' ? result.score : 0,
        feedback: result.feedback || '',
        strengths: Array.isArray(result.strengths) ? result.strengths : [],
        weaknesses: Array.isArray(result.weaknesses) ? result.weaknesses : [],
      };
    } catch (err) {
      if (attempt < 3) {
        console.log(`    ⚠️ Attempt ${attempt} failed, retrying...`);
        continue;
      }
      return { score: 0, feedback: `LLM 输出解析失败 (${attempt} attempts)`, strengths: [], weaknesses: ['解析失败'] };
    }
  }
  return { score: 0, feedback: 'Unexpected error', strengths: [], weaknesses: [] };
}

// ─── 阶段 3：生成报告 ───

async function generateReport(summary: RoundSummary, roundDir: string): Promise<void> {
  const lines: string[] = [];

  lines.push(`# Round ${summary.round} Test Report\n`);
  lines.push(`**时间**: ${summary.timestamp}`);
  lines.push(`**目标基准线**: ${TARGET_SCORE}%\n`);

  // 汇总
  lines.push('## Summary\n');
  lines.push(`| Metric | Value |`);
  lines.push(`|--------|-------|`);
  lines.push(`| Average Score | **${summary.avgScore.toFixed(1)}%** ${summary.avgScore >= TARGET_SCORE ? '✅' : '❌'} |`);
  lines.push(`| Pass Rate (≥${TARGET_SCORE}%) | ${(summary.passRate * 100).toFixed(0)}% |`);
  lines.push(`| Average Confidence | ${(summary.avgConfidence * 100).toFixed(1)}% |`);
  lines.push(`| Total LLM Tokens | ${summary.totalTokens.toLocaleString()} |`);
  lines.push(`| Total Duration | ${(summary.totalDuration / 1000 / 60).toFixed(1)} min |`);
  lines.push('');

  // 各站点详情
  lines.push('## Site Results\n');
  lines.push('| Site | Archetype | Score | Confidence | Status |');
  lines.push('|------|-----------|-------|------------|--------|');

  for (const site of summary.sites) {
    const status = site.error ? '❌ Error' : site.similarityScore >= TARGET_SCORE ? '✅ Pass' : '⚠️ Below';
    const archetypeMatch = site.expectedArchetype === site.detectedArchetype ? '✅' : '≠';
    lines.push(`| ${site.name} | ${site.detectedArchetype} (${archetypeMatch}) | ${site.similarityScore}% | ${(site.confidence * 100).toFixed(0)}% | ${status} |`);
  }
  lines.push('');

  // 低分分析
  const failedSites = summary.sites.filter(s => s.similarityScore < TARGET_SCORE && !s.error);
  if (failedSites.length > 0) {
    lines.push('## Failure Analysis\n');
    lines.push('以下网站未达到 80% 基准线，需要重点优化：\n');

    for (const site of failedSites) {
      lines.push(`### ${site.name} (Score: ${site.similarityScore}%)\n`);
      lines.push(`**URL**: ${site.url}`);
      lines.push(`**Expected**: ${site.expectedArchetype} | **Detected**: ${site.detectedArchetype}\n`);

      if (site.weaknesses.length > 0) {
        lines.push('**Weaknesses:**');
        for (const w of site.weaknesses) lines.push(`- ${w}`);
        lines.push('');
      }
      if (site.strengths.length > 0) {
        lines.push('**Strengths:**');
        for (const s of site.strengths) lines.push(`- ${s}`);
        lines.push('');
      }
      if (site.feedback) {
        lines.push(`**Feedback**: ${site.feedback}\n`);
      }
    }

    // 共性问题分析
    lines.push('## Common Issues\n');
    const allWeaknesses = failedSites.flatMap(s => s.weaknesses);
    const issueFreq = new Map<string, number>();
    for (const w of allWeaknesses) {
      // 简单的关键词聚类
      const keywords = ['颜色', '色彩', '排版', '字体', '间距', '留白', '圆角', '阴影', '组件', '布局', '氛围', '风格'];
      for (const kw of keywords) {
        if (w.includes(kw)) {
          issueFreq.set(kw, (issueFreq.get(kw) || 0) + 1);
        }
      }
    }

    const sortedIssues = [...issueFreq.entries()].sort((a, b) => b[1] - a[1]);
    if (sortedIssues.length > 0) {
      lines.push('出现频率最高的问题维度：\n');
      lines.push('| Issue | Frequency |');
      lines.push('|-------|-----------|');
      for (const [issue, count] of sortedIssues) {
        lines.push(`| ${issue} | ${count}/${failedSites.length} sites |`);
      }
      lines.push('');
    }

    // 优化建议
    lines.push('## Optimization Suggestions\n');
    lines.push('基于以上分析，建议从以下方向优化：\n');

    if (sortedIssues.some(([k]) => ['颜色', '色彩'].includes(k))) {
      lines.push('### 1. 色彩提取与映射');
      lines.push('- 检查 CSS 颜色值是否正确标准化');
      lines.push('- 增强像素提取的色彩角色推断');
      lines.push('- 优化 Stage 2 prompt 中的色彩策略描述\n');
    }
    if (sortedIssues.some(([k]) => ['排版', '字体'].includes(k))) {
      lines.push('### 2. 排版系统');
      lines.push('- 确保字体栈正确提取');
      lines.push('- 增强 type scale 的语义化命名\n');
    }
    if (sortedIssues.some(([k]) => ['间距', '留白'].includes(k))) {
      lines.push('### 3. 间距与留白');
      lines.push('- 改进 base unit 检测算法');
      lines.push('- 在 prompt 中强调间距策略的描述\n');
    }
    if (sortedIssues.some(([k]) => ['组件', '布局'].includes(k))) {
      lines.push('### 4. 组件模式');
      lines.push('- 增加更多组件类型的提取');
      lines.push('- 完善组件状态描述（hover/focus/active）\n');
    }
    if (sortedIssues.some(([k]) => ['氛围', '风格'].includes(k))) {
      lines.push('### 5. 整体氛围');
      lines.push('- 强化视觉分析 prompt 中的氛围描述');
      lines.push('- 增加 style_archetype 的判断依据\n');
    }
  }

  // 成功站点的 strengths（可复用）
  const passedSites = summary.sites.filter(s => s.similarityScore >= TARGET_SCORE);
  if (passedSites.length > 0) {
    lines.push('## Success Patterns\n');
    lines.push('以下网站达到基准线，其成功经验可复用：\n');
    for (const site of passedSites) {
      lines.push(`### ${site.name} (${site.similarityScore}%)`);
      for (const s of site.strengths) lines.push(`- ${s}`);
      lines.push('');
    }
  }

  await writeFile(join(roundDir, 'report.md'), lines.join('\n'), 'utf-8');
}

// ─── 阶段 4：跨轮次对比 ───

async function generateComparison(currentRound: number): Promise<void> {
  const comparisonsDir = join(process.cwd(), 'test-results');
  const rounds: RoundSummary[] = [];

  for (let i = 1; i <= currentRound; i++) {
    try {
      const data = await readFile(join(comparisonsDir, `round-${i}`, 'summary.json'), 'utf-8');
      rounds.push(JSON.parse(data));
    } catch { /* round doesn't exist */ }
  }

  if (rounds.length < 2) return;

  const lines: string[] = [];
  lines.push('# Cross-Round Comparison\n');

  // 汇总对比表
  lines.push('## Score Progression\n');
  lines.push('| Site | ' + rounds.map(r => `Round ${r.round}`).join(' | ') + ' | Trend |');
  lines.push('|------|' + rounds.map(() => '---').join('|') + '|------|');

  const siteNames = [...new Set(rounds.flatMap(r => r.sites.map(s => s.name)))];
  for (const name of siteNames) {
    const scores = rounds.map(r => {
      const site = r.sites.find(s => s.name === name);
      return site?.similarityScore ?? 0;
    });
    const trend = scores[scores.length - 1] > scores[0] ? '📈' : scores[scores.length - 1] < scores[0] ? '📉' : '➡️';
    lines.push(`| ${name} | ${scores.map(s => `${s}%`).join(' | ')} | ${trend} |`);
  }

  // 平均分趋势
  lines.push('\n## Average Score Trend\n');
  lines.push('| Round | Avg Score | Pass Rate |');
  lines.push('|-------|-----------|-----------|');
  for (const r of rounds) {
    lines.push(`| Round ${r.round} | ${r.avgScore.toFixed(1)}% | ${(r.passRate * 100).toFixed(0)}% |`);
  }

  await writeFile(join(comparisonsDir, 'comparison.md'), lines.join('\n'), 'utf-8');
}

// ─── 主流程 ───

async function main() {
  // 解析轮次号
  const roundArg = process.argv.find(a => a.startsWith('--round'));
  let round = 1;
  if (roundArg) {
    const next = process.argv[process.argv.indexOf(roundArg) + 1];
    if (next) round = parseInt(next, 10);
  }

  // 检查上一轮是否存在，自动递增
  const resultsDir = join(process.cwd(), 'test-results');
  try {
    const existing = await readdir(resultsDir);
    const maxRound = existing
      .filter(d => d.startsWith('round-'))
      .map(d => parseInt(d.replace('round-', ''), 10))
      .reduce((max, n) => Math.max(max, n), 0);
    if (!roundArg && maxRound > 0) round = maxRound + 1;
  } catch { /* no results dir yet */ }

  const roundDir = getRoundDir(round);
  const sitesDir = join(roundDir, 'sites');
  await mkdir(sitesDir, { recursive: true });

  const llmConfig = getLLMConfig();
  const pipelineConfig: PipelineConfig = {
    llm: llmConfig,
    browser: { headless: true, channel: 'chrome' as const },
    output: { format: 'full', language: 'zh' },
  };

  console.log(`\n${'═'.repeat(60)}`);
  console.log(`  ROUND ${round} — Target: ${TARGET_SCORE}%`);
  console.log(`${'═'.repeat(60)}\n`);

  // ── 阶段 1：提取 ──
  console.log('📦 Phase 1: Extracting design systems...\n');
  const results: SiteResult[] = [];

  for (const site of TEST_SITES) {
    const siteDir = join(sitesDir, site.name);
    const result = await extractSite(site, pipelineConfig, siteDir);
    results.push(result);

    // 保存中间结果
    await writeFile(join(roundDir, 'summary.json'), JSON.stringify({ round, sites: results }, null, 2), 'utf-8');
  }

  // ── 阶段 2：验证 ──
  console.log('\n🔍 Phase 2: Validating with reverse generation...\n');

  for (const result of results) {
    const siteDir = join(sitesDir, result.name);
    await validateSite(result, llmConfig, siteDir);

    // 保存中间结果
    await writeFile(join(roundDir, 'summary.json'), JSON.stringify({
      round,
      timestamp: new Date().toISOString(),
      sites: results,
    }, null, 2), 'utf-8');
  }

  // ── 阶段 3：汇总 ──
  console.log('\n📊 Phase 3: Generating report...\n');

  const successSites = results.filter(r => !r.error);
  const avgScore = successSites.reduce((sum, r) => sum + r.similarityScore, 0) / (successSites.length || 1);
  const passRate = successSites.filter(r => r.similarityScore >= TARGET_SCORE).length / (successSites.length || 1);
  const avgConfidence = successSites.reduce((sum, r) => sum + r.confidence, 0) / (successSites.length || 1);

  const summary: RoundSummary = {
    round,
    timestamp: new Date().toISOString(),
    avgScore: Math.round(avgScore * 10) / 10,
    avgConfidence: Math.round(avgConfidence * 100) / 100,
    passRate: Math.round(passRate * 100) / 100,
    totalTokens: results.reduce((sum, r) => sum + r.llmTokens, 0),
    totalDuration: results.reduce((sum, r) => sum + r.pipelineDuration, 0),
    sites: results,
  };

  await writeFile(join(roundDir, 'summary.json'), JSON.stringify(summary, null, 2), 'utf-8');
  await generateReport(summary, roundDir);
  await generateComparison(round);

  // ── 输出结果 ──
  console.log(`${'═'.repeat(60)}`);
  console.log(`  ROUND ${round} COMPLETE`);
  console.log(`${'═'.repeat(60)}`);
  console.log(`\n  Average Score:  ${summary.avgScore.toFixed(1)}% ${summary.avgScore >= TARGET_SCORE ? '✅' : '❌'}`);
  console.log(`  Pass Rate:      ${(summary.passRate * 100).toFixed(0)}% (≥${TARGET_SCORE}%)`);
  console.log(`  Total Tokens:   ${summary.totalTokens.toLocaleString()}`);
  console.log(`\n  Report: ${join(roundDir, 'report.md')}`);
  console.log(`  Data:   ${join(roundDir, 'summary.json')}`);
  console.log('');

  // 逐站结果
  for (const site of results) {
    const status = site.error ? '❌' : site.similarityScore >= TARGET_SCORE ? '✅' : '⚠️';
    console.log(`  ${status} ${site.name.padEnd(12)} ${site.similarityScore.toString().padStart(3)}%  (confidence: ${(site.confidence * 100).toFixed(0)}%)`);
  }
  console.log('');
}

main().catch(err => {
  console.error('Fatal:', err);
  process.exit(1);
});
