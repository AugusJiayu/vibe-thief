/**
 * 注入到页面中执行的 CSS 采集脚本
 * 在 Playwright page.evaluate() 中运行
 * 注意：此文件在浏览器环境中执行，不是 Node.js
 */
// @ts-nocheck — 此文件在 page.evaluate() 中运行，需要 DOM 类型

export function collectCSSFromPage() {
  // 检测 spacing base unit（GCD 方法）— 必须定义在函数内部
  function detectBaseUnit(values) {
    if (values.length < 3) return null;
    const topValues = values
      .sort((a, b) => b.count - a.count)
      .slice(0, 20)
      .map(v => v.px);

    const gcd = (a, b) => (b === 0 ? a : gcd(b, a % b));
    let result = topValues[0];
    for (const val of topValues) {
      result = gcd(result, val);
      if (result <= 2) break;
    }

    if (result >= 2 && result <= 16) {
      return `${result}px`;
    }
    return null;
  }

  // 采样目标
  const SELECTORS = [
    'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
    'p', 'span', 'a', 'li', 'label', 'td', 'th',
    'button', 'input', 'textarea', 'select',
    'header', 'nav', 'main', 'footer', 'section', 'article', 'aside',
    'div', 'img', 'svg',
  ];

  const colorFreq = new Map();
  const fontFamilyFreq = new Map();
  const fontSizeFreq = new Map();
  const fontWeightFreq = new Map();
  const lineHeightFreq = new Map();
  const spacingFreq = new Map();
  const borderRadiusFreq = new Map();
  const borderWidthFreq = new Map();
  const borderStyleFreq = new Map();
  const shadowFreq = new Map();

  // 收集 CSS Variables
  const cssVariables = {};
  try {
    for (const sheet of Array.from(document.styleSheets)) {
      try {
        for (const rule of Array.from(sheet.cssRules || [])) {
          if (rule instanceof CSSStyleRule && rule.selectorText === ':root') {
            for (const prop of Array.from(rule.style)) {
              if (prop.startsWith('--')) {
                cssVariables[prop] = rule.style.getPropertyValue(prop).trim();
              }
            }
          }
        }
      } catch {
        // 跨域 stylesheet 无法访问
      }
    }
  } catch { /* ignore */ }

  // 采样元素
  const sampledElements = [];
  for (const sel of SELECTORS) {
    const els = document.querySelectorAll(sel);
    const limit = Math.min(els.length, 10);
    for (let i = 0; i < limit; i++) {
      sampledElements.push(els[i]);
    }
  }

  // 遍历采样元素，提取 computed styles
  for (const el of sampledElements) {
    const cs = getComputedStyle(el);
    const tag = el.tagName.toLowerCase();

    // 颜色
    const colorProps = ['color', 'background-color', 'border-color'];
    for (const prop of colorProps) {
      const val = cs.getPropertyValue(prop);
      if (val && val !== 'rgba(0, 0, 0, 0)' && val !== 'transparent' && val !== 'inherit') {
        const existing = colorFreq.get(val);
        if (existing) {
          existing.count++;
          existing.sources.add(prop);
        } else {
          colorFreq.set(val, { count: 1, sources: new Set([prop]) });
        }
      }
    }

    // 字体
    const ff = cs.fontFamily;
    if (ff) {
      const primary = ff.split(',')[0].trim().replace(/["']/g, '');
      fontFamilyFreq.set(primary, (fontFamilyFreq.get(primary) || 0) + 1);
    }

    // 字号
    const fs = cs.fontSize;
    if (fs) {
      const existing = fontSizeFreq.get(fs);
      if (existing) {
        existing.count++;
        existing.contexts.add(tag);
      } else {
        fontSizeFreq.set(fs, { count: 1, contexts: new Set([tag]) });
      }
    }

    // 字重
    const fw = parseInt(cs.fontWeight, 10);
    if (!isNaN(fw)) {
      fontWeightFreq.set(fw, (fontWeightFreq.get(fw) || 0) + 1);
    }

    // 行高
    const lh = cs.lineHeight;
    if (lh && lh !== 'normal') {
      lineHeightFreq.set(lh, (lineHeightFreq.get(lh) || 0) + 1);
    }

    // 间距
    for (const prop of ['padding-top', 'padding-right', 'padding-bottom', 'padding-left',
      'margin-top', 'margin-right', 'margin-bottom', 'margin-left']) {
      const val = cs.getPropertyValue(prop);
      if (val && val !== '0px' && val !== 'auto') {
        spacingFreq.set(val, (spacingFreq.get(val) || 0) + 1);
      }
    }

    // 圆角
    const br = cs.borderRadius;
    if (br && br !== '0px') {
      borderRadiusFreq.set(br, (borderRadiusFreq.get(br) || 0) + 1);
    }

    // 边框宽度
    const bw = cs.borderWidth;
    if (bw && bw !== '0px') {
      borderWidthFreq.set(bw, (borderWidthFreq.get(bw) || 0) + 1);
    }

    // 边框样式
    const bs = cs.borderStyle;
    if (bs && bs !== 'none') {
      borderStyleFreq.set(bs, (borderStyleFreq.get(bs) || 0) + 1);
    }

    // 阴影
    const shadow = cs.boxShadow;
    if (shadow && shadow !== 'none') {
      shadowFreq.set(shadow, (shadowFreq.get(shadow) || 0) + 1);
    }
  }

  // 检测断点（通过 CSS media rules）
  const breakpoints = [];
  try {
    for (const sheet of Array.from(document.styleSheets)) {
      try {
        for (const rule of Array.from(sheet.cssRules || [])) {
          if (rule instanceof CSSMediaRule) {
            const condition = rule.conditionText || '';
            const match = condition.match(/min-width:\s*(\d+px)/);
            if (match) {
              const existing = breakpoints.find(b => b.minWidth === match[1]);
              if (!existing) {
                breakpoints.push({ minWidth: match[1], label: '' });
              }
            }
          }
        }
      } catch { /* cross-origin */ }
    }
  } catch { /* ignore */ }

  // 排序断点
  breakpoints.sort((a, b) => parseInt(a.minWidth) - parseInt(b.minWidth));
  const labels = ['sm', 'md', 'lg', 'xl', '2xl'];
  breakpoints.forEach((bp, i) => { bp.label = labels[i] || `bp${i}`; });

  // 检测 spacing base unit（过滤负值和 0）
  const spacingValues = [...spacingFreq.entries()]
    .map(([val, count]) => ({ px: parseInt(val), count }))
    .filter(v => !isNaN(v.px) && v.px > 0);
  const detectedBaseUnit = detectBaseUnit(spacingValues);

  // 转换为输出格式
  return {
    colors: {
      raw: [...colorFreq.entries()].map(([value, { count, sources }]) => ({
        value,
        frequency: count,
        sources: [...sources],
      })),
      cssVariables,
    },
    typography: {
      fontFamilies: [...fontFamilyFreq.entries()].map(([family, frequency]) => ({ family, frequency })),
      fontSizes: [...fontSizeFreq.entries()].map(([size, { count, contexts }]) => ({
        size,
        frequency: count,
        contexts: [...contexts],
      })),
      fontWeights: [...fontWeightFreq.entries()].map(([weight, frequency]) => ({ weight, frequency })),
      lineHeights: [...lineHeightFreq.entries()].map(([value, frequency]) => ({ value, frequency })),
    },
    spacing: {
      values: [...spacingFreq.entries()]
        .filter(([value]) => parseInt(value) > 0)
        .map(([value, frequency]) => ({ value, frequency })),
      detectedBaseUnit,
    },
    borders: {
      radii: [...borderRadiusFreq.entries()].map(([value, frequency]) => ({ value, frequency })),
      widths: [...borderWidthFreq.entries()].map(([value, frequency]) => ({ value, frequency })),
      styles: [...borderStyleFreq.entries()].map(([value, frequency]) => ({ value, frequency })),
    },
    shadows: {
      values: [...shadowFreq.entries()].map(([value, frequency]) => ({ value, frequency })),
    },
    breakpoints,
    rawCSSVariables: cssVariables,
  };
}
