/**
 * CSS 采集脚本
 *
 * 重要：此函数通过 page.evaluate() 在浏览器中执行
 * 必须完全自包含，不能引用任何外部变量或模块
 * 不能使用 TypeScript 语法（会被 tsup 编译注入 __name 等 helper）
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

  try {
    for (var si = 0; si < document.styleSheets.length; si++) {
      try {
        var rules = document.styleSheets[si].cssRules || [];
        for (var ri = 0; ri < rules.length; ri++) {
          var rule = rules[ri];
          if (rule instanceof CSSStyleRule && rule.selectorText === ':root') {
            for (var pi = 0; pi < rule.style.length; pi++) {
              var prop = rule.style[pi];
              if (prop.indexOf('--') === 0) {
                cssVariables[prop] = rule.style.getPropertyValue(prop).trim();
              }
            }
          }
        }
      } catch(e) {}
    }
  } catch(e) {}

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
    rawCSSVariables: cssVariables
  };
}
`;
