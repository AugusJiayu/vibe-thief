# Round 1 Test Report

**时间**: 2026-06-17T15:48:30.998Z
**目标基准线**: 80%

## Summary

| Metric | Value |
|--------|-------|
| Average Score | **0.0%** ❌ |
| Pass Rate (≥80%) | 0% |
| Average Confidence | 78.0% |
| Total LLM Tokens | 97,099 |
| Total Duration | 27.3 min |

## Site Results

| Site | Archetype | Score | Confidence | Status |
|------|-----------|-------|------------|--------|
| apple | immersive-landing (✅) | 0% | 97% | ⚠️ Below |
| bilibili | custom (≠) | 0% | 54% | ⚠️ Below |
| mobbin | minimal-tool (≠) | 0% | 73% | ⚠️ Below |
| volcengine | light-saas (≠) | 0% | 96% | ⚠️ Below |
| cssda | minimal-portfolio (≠) | 0% | 64% | ⚠️ Below |
| accio | light-saas (≠) | 0% | 86% | ⚠️ Below |

## Failure Analysis

以下网站未达到 80% 基准线，需要重点优化：

### apple (Score: 0%)

**URL**: https://www.apple.com.cn
**Expected**: immersive-landing | **Detected**: immersive-landing

**Weaknesses:**
- 解析失败

**Feedback**: LLM 输出解析失败 (3 attempts)

### bilibili (Score: 0%)

**URL**: https://www.bilibili.com
**Expected**: consumer-app | **Detected**: custom

**Weaknesses:**
- 解析失败

**Feedback**: LLM 输出解析失败 (3 attempts)

### mobbin (Score: 0%)

**URL**: https://mobbin.com
**Expected**: showcase-gallery | **Detected**: minimal-tool

**Weaknesses:**
- 解析失败

**Feedback**: LLM 输出解析失败 (3 attempts)

### volcengine (Score: 0%)

**URL**: https://www.volcengine.com/activity/codingplan
**Expected**: enterprise | **Detected**: light-saas

**Weaknesses:**
- 解析失败

**Feedback**: LLM 输出解析失败 (3 attempts)

### cssda (Score: 0%)

**URL**: https://www.cssdesignawards.com
**Expected**: showcase-gallery | **Detected**: minimal-portfolio

**Weaknesses:**
- 解析失败

**Feedback**: LLM 输出解析失败 (3 attempts)

### accio (Score: 0%)

**URL**: https://www.accio-ai.com/work
**Expected**: minimal-portfolio | **Detected**: light-saas

**Weaknesses:**
- 解析失败

**Feedback**: LLM 输出解析失败 (3 attempts)

## Common Issues

## Optimization Suggestions

基于以上分析，建议从以下方向优化：
