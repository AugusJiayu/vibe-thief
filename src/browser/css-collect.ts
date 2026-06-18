/**
 * CSS 采集脚本
 *
 * 重要：此函数通过 page.evaluate() 在浏览器中执行
 * 必须完全自包含，不能引用任何外部变量或模块
 * 不能使用 TypeScript 语法（会被 tsup 编译注入 __name 等 helper）
 *
 * 提取内容：
 * 1. Token 数据：颜色、字号、间距、圆角、阴影等
 * 2. @keyframes 动画定义（完整 CSS 文本）
 * 3. 交互状态规则（:hover, :focus, :active）
 * 4. 布局模式（grid, flex 配置）
 * 5. 组件样式规则（按钮、卡片、输入框等）
 * 6. CSS 变量
 */

// 导出为字符串，避免 tsup 处理
export const COLLECT_CSS_SCRIPT = `
function() {
  function detectBaseUnit(values) {
    if (values.length < 3) return null;
    var topValues = values.sort(function(a, b) { return b.count - a.count; }).slice(0, 20).map(function(v) { return v.px; });
    function gcd(a, b) { return b === 0 ? a : gcd(b, a % b); }
    var result = topValues[0];
    for (var i = 0; i < topValues.length; i++) {
      result = gcd(result, topValues[i]);
      if (result <= 2) break;
    }
    return (result >= 2 && result <= 16) ? result + 'px' : null;
  }

  // ── Token 提取（原有逻辑）──

  var SELECTORS = ['h1','h2','h3','h4','h5','h6','p','span','a','li','label','td','th','button','input','textarea','select','header','nav','main','footer','section','article','aside','div','img','svg'];
  var colorFreq = new Map();
  var fontFamilyFreq = new Map();
  var fontSizeFreq = new Map();
  var fontWeightFreq = new Map();
  var lineHeightFreq = new Map();
  var spacingFreq = new Map();
  var borderRadiusFreq = new Map();
  var borderWidthFreq = new Map();
  var borderStyleFreq = new Map();
  var shadowFreq = new Map();
  var cssVariables = {};

  // ── CSS 代码提取（新增）──

  var keyframesDefs = [];       // @keyframes 完整定义
  var hoverRules = [];          // :hover 规则
  var focusRules = [];          // :focus 规则
  var activeRules = [];         // :active 规则
  var transitionRules = [];     // transition 规则
  var layoutPatterns = [];      // grid/flex 布局模式
  var componentStyles = [];     // 组件样式规则

  // 判断是否是"有用的"组件选择器（排除过于通用的）
  function isComponentSelector(sel) {
    if (!sel) return false;
    var s = sel.toLowerCase();
    // 排除通用标签选择器
    if (/^(html|body|head|\\*|:root|::?before|::?after)$/i.test(s.trim())) return false;
    // 保留有 class/id 的选择器
    if (s.indexOf('.') >= 0 || s.indexOf('#') >= 0 || s.indexOf('[') >= 0) return true;
    // 保留伪类选择器
    if (s.indexOf(':hover') >= 0 || s.indexOf(':focus') >= 0 || s.indexOf(':active') >= 0) return true;
    // 保留复合选择器（如 header nav, section h2）
    if (s.indexOf(' ') >= 0) return true;
    return false;
  }

  // 从样式规则中提取有用的 CSS 声明
  function extractUsefulDeclarations(style) {
    var props = [
      'display', 'flex-direction', 'justify-content', 'align-items', 'gap',
      'grid-template-columns', 'grid-template-rows', 'grid-gap',
      'padding', 'margin', 'max-width', 'width', 'height',
      'background', 'background-color', 'background-image',
      'border', 'border-radius', 'box-shadow',
      'font-size', 'font-weight', 'line-height', 'letter-spacing', 'text-align',
      'color', 'opacity', 'transform', 'filter',
      'transition', 'animation',
      'overflow', 'position', 'z-index'
    ];
    var result = {};
    for (var i = 0; i < props.length; i++) {
      var val = style.getPropertyValue(props[i]);
      if (val && val !== 'none' && val !== 'auto' && val !== 'normal' && val !== '0px' && val !== '') {
        result[props[i]] = val;
      }
    }
    return result;
  }

  // 遍历所有样式表
  try {
    for (var si = 0; si < document.styleSheets.length; si++) {
      try {
        var rules = document.styleSheets[si].cssRules || [];
        for (var ri = 0; ri < rules.length; ri++) {
          var rule = rules[ri];

          // 提取 :root CSS 变量
          if (rule instanceof CSSStyleRule && rule.selectorText === ':root') {
            for (var pi = 0; pi < rule.style.length; pi++) {
              var prop = rule.style[pi];
              if (prop.indexOf('--') === 0) {
                cssVariables[prop] = rule.style.getPropertyValue(prop).trim();
              }
            }
          }

          // 提取 @keyframes 完整定义
          if (rule instanceof CSSKeyframesRule) {
            try {
              keyframesDefs.push({
                name: rule.name,
                cssText: rule.cssText
              });
            } catch(e) {}
          }

          // 提取普通样式规则
          if (rule instanceof CSSStyleRule) {
            var sel = rule.selectorText || '';

            // :hover
            if (sel.indexOf(':hover') >= 0) {
              var decls = extractUsefulDeclarations(rule.style);
              if (Object.keys(decls).length > 0) {
                hoverRules.push({ selector: sel, declarations: decls });
              }
            }

            // :focus
            if (sel.indexOf(':focus') >= 0) {
              var decls2 = extractUsefulDeclarations(rule.style);
              if (Object.keys(decls2).length > 0) {
                focusRules.push({ selector: sel, declarations: decls2 });
              }
            }

            // :active
            if (sel.indexOf(':active') >= 0) {
              var decls3 = extractUsefulDeclarations(rule.style);
              if (Object.keys(decls3).length > 0) {
                activeRules.push({ selector: sel, declarations: decls3 });
              }
            }

            // transition（非 hover/focus 的独立 transition）
            var trans = rule.style.transition || rule.style.getPropertyValue('transition');
            if (trans && trans !== 'none' && trans !== 'all 0s ease 0s' && sel.indexOf(':hover') < 0 && sel.indexOf(':focus') < 0) {
              transitionRules.push({ selector: sel, value: trans });
            }

            // 布局模式（grid/flex）
            var display = rule.style.display;
            if (display === 'grid' || display === 'inline-grid') {
              var gridInfo = { selector: sel, display: display };
              var gtc = rule.style.gridTemplateColumns || rule.style.getPropertyValue('grid-template-columns');
              if (gtc) gridInfo.gridTemplateColumns = gtc;
              var gg = rule.style.gap || rule.style.getPropertyValue('gap') || rule.style.gridGap || rule.style.getPropertyValue('grid-gap');
              if (gg) gridInfo.gap = gg;
              layoutPatterns.push(gridInfo);
            }
            if (display === 'flex' || display === 'inline-flex') {
              var flexInfo = { selector: sel, display: display };
              var fd = rule.style.flexDirection;
              if (fd) flexInfo.flexDirection = fd;
              var jc = rule.style.justifyContent;
              if (jc) flexInfo.justifyContent = jc;
              var ai = rule.style.alignItems;
              if (ai) flexInfo.alignItems = ai;
              var fg = rule.style.gap || rule.style.getPropertyValue('gap');
              if (fg) flexInfo.gap = fg;
              layoutPatterns.push(flexInfo);
            }

            // 组件样式（有 class/id 的选择器）
            if (isComponentSelector(sel)) {
              var compDecls = extractUsefulDeclarations(rule.style);
              if (Object.keys(compDecls).length >= 2) {
                componentStyles.push({ selector: sel, declarations: compDecls });
              }
            }
          }

          // 提取 @media 中的规则
          if (rule instanceof CSSMediaRule) {
            try {
              var mediaRules = rule.cssRules || [];
              for (var mri = 0; mri < mediaRules.length; mri++) {
                var mr = mediaRules[mri];
                if (mr instanceof CSSStyleRule) {
                  var mSel = mr.selectorText || '';
                  if (isComponentSelector(mSel)) {
                    var mDecls = extractUsefulDeclarations(mr.style);
                    if (Object.keys(mDecls).length >= 2) {
                      componentStyles.push({ selector: '@media ' + rule.conditionText + ' ' + mSel, declarations: mDecls });
                    }
                  }
                }
              }
            } catch(e) {}
          }
        }
      } catch(e) {}
    }
  } catch(e) {}

  // 去重和限制数量
  var seenKeyframes = new Set();
  keyframesDefs = keyframesDefs.filter(function(k) {
    if (seenKeyframes.has(k.name)) return false;
    seenKeyframes.add(k.name);
    return true;
  }).slice(0, 15);

  hoverRules = hoverRules.slice(0, 20);
  focusRules = focusRules.slice(0, 10);
  activeRules = activeRules.slice(0, 10);
  transitionRules = transitionRules.slice(0, 15);
  layoutPatterns = layoutPatterns.slice(0, 20);

  // 组件样式去重并限制
  var seenComp = new Set();
  componentStyles = componentStyles.filter(function(c) {
    if (seenComp.has(c.selector)) return false;
    seenComp.add(c.selector);
    return true;
  }).slice(0, 30);

  // ── Token 提取（从 DOM 元素采样计算样式）──

  var sampledElements = [];
  for (var si2 = 0; si2 < SELECTORS.length; si2++) {
    var els = document.querySelectorAll(SELECTORS[si2]);
    var limit = Math.min(els.length, 10);
    for (var ei = 0; ei < limit; ei++) sampledElements.push(els[ei]);
  }

  for (var k = 0; k < sampledElements.length; k++) {
    var el = sampledElements[k];
    var cs = getComputedStyle(el);
    var tag = el.tagName.toLowerCase();

    var colorProps = ['color', 'background-color', 'border-color'];
    for (var ci = 0; ci < colorProps.length; ci++) {
      var cv = cs.getPropertyValue(colorProps[ci]);
      if (cv && cv !== 'rgba(0, 0, 0, 0)' && cv !== 'transparent' && cv !== 'inherit') {
        var ce = colorFreq.get(cv);
        if (ce) { ce.count++; ce.sources.add(colorProps[ci]); }
        else { colorFreq.set(cv, { count: 1, sources: new Set([colorProps[ci]]) }); }
      }
    }

    var ff = cs.fontFamily;
    if (ff) {
      var primary = ff.split(',')[0].trim().replace(/["']/g, '');
      fontFamilyFreq.set(primary, (fontFamilyFreq.get(primary) || 0) + 1);
    }

    var fs = cs.fontSize;
    if (fs) {
      var fse = fontSizeFreq.get(fs);
      if (fse) { fse.count++; fse.contexts.add(tag); }
      else { fontSizeFreq.set(fs, { count: 1, contexts: new Set([tag]) }); }
    }

    var fw = parseInt(cs.fontWeight, 10);
    if (!isNaN(fw)) fontWeightFreq.set(fw, (fontWeightFreq.get(fw) || 0) + 1);

    var lh = cs.lineHeight;
    if (lh && lh !== 'normal') lineHeightFreq.set(lh, (lineHeightFreq.get(lh) || 0) + 1);

    var spacingProps = ['padding-top','padding-right','padding-bottom','padding-left','margin-top','margin-right','margin-bottom','margin-left'];
    for (var spi = 0; spi < spacingProps.length; spi++) {
      var sv = cs.getPropertyValue(spacingProps[spi]);
      if (sv && sv !== '0px' && sv !== 'auto' && parseInt(sv) > 0) {
        spacingFreq.set(sv, (spacingFreq.get(sv) || 0) + 1);
      }
    }

    var br = cs.borderRadius;
    if (br && br !== '0px') borderRadiusFreq.set(br, (borderRadiusFreq.get(br) || 0) + 1);

    var bw = cs.borderWidth;
    if (bw && bw !== '0px') borderWidthFreq.set(bw, (borderWidthFreq.get(bw) || 0) + 1);

    var bs = cs.borderStyle;
    if (bs && bs !== 'none') borderStyleFreq.set(bs, (borderStyleFreq.get(bs) || 0) + 1);

    var shadow = cs.boxShadow;
    if (shadow && shadow !== 'none') shadowFreq.set(shadow, (shadowFreq.get(shadow) || 0) + 1);
  }

  var breakpoints = [];
  try {
    for (var bsi = 0; bsi < document.styleSheets.length; bsi++) {
      try {
        var bsrules = document.styleSheets[bsi].cssRules || [];
        for (var bri = 0; bri < bsrules.length; bri++) {
          if (bsrules[bri] instanceof CSSMediaRule) {
            var cond = bsrules[bri].conditionText || '';
            var m = cond.match(/min-width:\\\\s*(\\\\d+px)/);
            if (m && !breakpoints.find(function(b) { return b.minWidth === m[1]; })) {
              breakpoints.push({ minWidth: m[1], label: '' });
            }
          }
        }
      } catch(e) {}
    }
  } catch(e) {}
  breakpoints.sort(function(a, b) { return parseInt(a.minWidth) - parseInt(b.minWidth); });
  var bpLabels = ['sm','md','lg','xl','2xl'];
  for (var bli = 0; bli < breakpoints.length; bli++) breakpoints[bli].label = bpLabels[bli] || 'bp'+bli;

  var spacingValues = [];
  spacingFreq.forEach(function(count, val) {
    var px = parseInt(val);
    if (!isNaN(px) && px > 0) spacingValues.push({ px: px, count: count });
  });
  var detectedBaseUnit = detectBaseUnit(spacingValues);

  function mapToArr(map) {
    var arr = [];
    map.forEach(function(v, k) { arr.push([k, v]); });
    return arr;
  }

  // ── DOM 结构提取（用于页面结构分析）──

  var pageStructure = [];
  try {
    var mainSections = document.querySelectorAll('header, nav, main, footer, section, [role="banner"], [role="navigation"], [role="main"], [role="contentinfo"]');
    for (var psi = 0; psi < mainSections.length && psi < 20; psi++) {
      var sec = mainSections[psi];
      var tag = sec.tagName.toLowerCase();
      var role = sec.getAttribute('role') || '';
      var cls = sec.className && typeof sec.className === 'string' ? sec.className.split(' ').slice(0, 3).join(' ') : '';
      var id = sec.id || '';
      // 获取内部文本摘要
      var textContent = (sec.textContent || '').trim().replace(/\\s+/g, ' ').slice(0, 100);
      // 获取直接子元素标签
      var childTags = [];
      for (var csi = 0; csi < Math.min(sec.children.length, 8); csi++) {
        childTags.push(sec.children[csi].tagName.toLowerCase());
      }
      pageStructure.push({
        tag: tag,
        role: role,
        class: cls,
        id: id,
        textPreview: textContent,
        childTags: childTags
      });
    }
  } catch(e) {}

  return {
    colors: {
      raw: mapToArr(colorFreq).map(function(e) { return { value: e[0], frequency: e[1].count, sources: Array.from(e[1].sources) }; }),
      cssVariables: cssVariables
    },
    typography: {
      fontFamilies: mapToArr(fontFamilyFreq).map(function(e) { return { family: e[0], frequency: e[1] }; }),
      fontSizes: mapToArr(fontSizeFreq).map(function(e) { return { size: e[0], frequency: e[1].count, contexts: Array.from(e[1].contexts) }; }),
      fontWeights: mapToArr(fontWeightFreq).map(function(e) { return { weight: e[0], frequency: e[1] }; }),
      lineHeights: mapToArr(lineHeightFreq).map(function(e) { return { value: e[0], frequency: e[1] }; })
    },
    spacing: {
      values: mapToArr(spacingFreq).filter(function(e) { return parseInt(e[0]) > 0; }).map(function(e) { return { value: e[0], frequency: e[1] }; }),
      detectedBaseUnit: detectedBaseUnit
    },
    borders: {
      radii: mapToArr(borderRadiusFreq).map(function(e) { return { value: e[0], frequency: e[1] }; }),
      widths: mapToArr(borderWidthFreq).map(function(e) { return { value: e[0], frequency: e[1] }; }),
      styles: mapToArr(borderStyleFreq).map(function(e) { return { value: e[0], frequency: e[1] }; })
    },
    shadows: {
      values: mapToArr(shadowFreq).map(function(e) { return { value: e[0], frequency: e[1] }; })
    },
    breakpoints: breakpoints,
    rawCSSVariables: cssVariables,
    // 新增：CSS 代码级提取
    cssCode: {
      keyframes: keyframesDefs,
      hoverRules: hoverRules,
      focusRules: focusRules,
      activeRules: activeRules,
      transitionRules: transitionRules,
      layoutPatterns: layoutPatterns,
      componentStyles: componentStyles
    },
    // 新增：页面结构
    pageStructure: pageStructure
  };
}
`;
