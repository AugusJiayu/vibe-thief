/**
 * Agent 自动优化脚本
 *
 * 读取上一轮的 report.md，让 LLM 分析失败原因并生成具体的优化方案
 * 输出 optimization-plan.md，包含需要修改的文件和具体改动
 *
 * 用法: npx tsx scripts/optimize.ts [--round N]
 */

import { readFile, readdir, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { createLLMProvider } from '../src/llm/provider.js';
import type { LLMConfig } from '../src/types/input.js';

interface OptimizationPlan {
  round: number;
  analysis: string;
  changes: Array<{
    file: string;
    reason: string;
    action: 'modify-prompt' | 'modify-structure' | 'modify-confidence' | 'modify-extraction';
    description: string;
  }>;
  priority: 'high' | 'medium' | 'low';
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

async function findLatestRound(): Promise<number> {
  const resultsDir = join(process.cwd(), 'test-results');
  try {
    const dirs = await readdir(resultsDir);
    return dirs
      .filter(d => d.startsWith('round-'))
      .map(d => parseInt(d.replace('round-', ''), 10))
      .reduce((max, n) => Math.max(max, n), 0);
  } catch {
    return 0;
  }
}

async function main() {
  // 解析轮次
  const roundArg = process.argv.find(a => a.startsWith('--round'));
  let round = 0;
  if (roundArg) {
    const next = process.argv[process.argv.indexOf(roundArg) + 1];
    if (next) round = parseInt(next, 10);
  }
  if (!round) round = await findLatestRound();
  if (!round) {
    console.error('No test results found. Run "npm run test:round" first.');
    process.exit(1);
  }

  const roundDir = join(process.cwd(), 'test-results', `round-${round}`);
  console.log(`📖 Reading Round ${round} results...\n`);

  // 读取报告和汇总
  const reportPath = join(roundDir, 'report.md');
  const summaryPath = join(roundDir, 'summary.json');

  let report: string;
  let summary: string;
  try {
    report = await readFile(reportPath, 'utf-8');
    summary = await readFile(summaryPath, 'utf-8');
  } catch {
    console.error(`Round ${round} results not found at ${roundDir}`);
    process.exit(1);
  }

  // 读取关键源文件（让 LLM 理解当前实现）
  const sourceFiles = [
    'src/llm/prompts/analysis.ts',
    'src/llm/prompts/generation.ts',
    'src/utils/confidence.ts',
    'src/pipeline/output.ts',
    'src/extractors/css-extractor.ts',
    'src/extractors/vision-analyzer.ts',
  ];

  const sourceContents: Record<string, string> = {};
  for (const file of sourceFiles) {
    try {
      sourceContents[file] = await readFile(join(process.cwd(), file), 'utf-8');
    } catch { /* file might not exist */ }
  }

  // 让 LLM 分析并生成优化方案
  console.log('🤖 Agent analyzing failures and generating optimization plan...\n');

  const llmConfig = getLLMConfig();
  const provider = createLLMProvider(llmConfig);

  const response = await provider.chat([
    {
      role: 'system',
      content: `你是一个 AI 工程师，负责优化一个从网站提取设计系统的工具。

你的任务是：
1. 分析测试报告中每个低分网站的失败原因
2. 找出共性问题
3. 针对每个问题，给出具体的代码修改方案

你只能修改以下文件：
- src/llm/prompts/analysis.ts — Stage 1 的 prompt
- src/llm/prompts/generation.ts — Stage 2 的 prompt
- src/utils/confidence.ts — 置信度计算
- src/pipeline/output.ts — Markdown 渲染
- src/extractors/css-extractor.ts — CSS 提取
- src/extractors/vision-analyzer.ts — 视觉分析

输出严格 JSON：
{
  "analysis": "对本轮结果的整体分析（100-200字）",
  "changes": [
    {
      "file": "要修改的文件路径",
      "reason": "为什么要改",
      "action": "modify-prompt | modify-structure | modify-confidence | modify-extraction",
      "description": "具体改什么（要足够具体，能直接执行）"
    }
  ],
  "priority": "high | medium | low"
}

规则：
- 每个 change 的 description 必须足够具体，包含要改的内容
- 优先修改影响面最大的问题（如 prompt 修改影响所有网站）
- 不要修改已经表现好的部分
- 最多提出 5 个 changes，聚焦最重要的`,
    },
    {
      role: 'user',
      content: `## 测试报告（Round ${round}）

${report}

## 汇总数据

\`\`\`json
${summary}
\`\`\`

## 当前源代码

${Object.entries(sourceContents).map(([file, content]) => `### ${file}\n\`\`\`typescript\n${content}\n\`\`\``).join('\n\n')}

请分析失败原因，生成优化方案 JSON。`,
    },
  ], { temperature: 0.3, maxTokens: 4096, jsonMode: true });

  // 解析优化方案
  let plan: OptimizationPlan;
  try {
    let jsonStr = response.content.trim();
    if (jsonStr.startsWith('```')) jsonStr = jsonStr.replace(/^```(?:json)?\n?/, '').replace(/\n?```$/, '');
    const parsed = JSON.parse(jsonStr);
    plan = { round, ...parsed };
  } catch (err) {
    console.error('Failed to parse optimization plan:', err);
    console.error('Raw response:', response.content);
    process.exit(1);
  }

  // 生成可读的优化计划
  const lines: string[] = [];
  lines.push(`# Optimization Plan (Based on Round ${round})\n`);
  lines.push(`**Generated**: ${new Date().toISOString()}`);
  lines.push(`**Priority**: ${plan.priority}\n`);

  lines.push('## Analysis\n');
  lines.push(plan.analysis + '\n');

  lines.push('## Proposed Changes\n');
  for (let i = 0; i < plan.changes.length; i++) {
    const change = plan.changes[i];
    lines.push(`### ${i + 1}. ${change.file}\n`);
    lines.push(`**Action**: ${change.action}`);
    lines.push(`**Reason**: ${change.reason}\n`);
    lines.push(`**Changes to make**:`);
    lines.push(change.description + '\n');
    lines.push('---\n');
  }

  lines.push('## Next Steps\n');
  lines.push('1. Apply the changes listed above');
  lines.push('2. Run `npm run test:round` to execute Round ' + (round + 1));
  lines.push('3. Compare Round ' + (round + 1) + ' vs Round ' + round + ' scores');

  const planPath = join(roundDir, 'optimization-plan.md');
  await writeFile(planPath, lines.join('\n'), 'utf-8');

  // 同时保存 JSON 格式（方便 agent 读取）
  await writeFile(join(roundDir, 'optimization-plan.json'), JSON.stringify(plan, null, 2), 'utf-8');

  console.log(`${'═'.repeat(60)}`);
  console.log(`  OPTIMIZATION PLAN (Round ${round})`);
  console.log(`${'═'.repeat(60)}\n`);
  console.log(`  Priority: ${plan.priority}`);
  console.log(`  Changes: ${plan.changes.length}\n`);

  for (let i = 0; i < plan.changes.length; i++) {
    const c = plan.changes[i];
    console.log(`  ${i + 1}. [${c.action}] ${c.file}`);
    console.log(`     ${c.reason}\n`);
  }

  console.log(`  Plan saved to: ${planPath}`);
  console.log('');
}

main().catch(err => {
  console.error('Fatal:', err);
  process.exit(1);
});
