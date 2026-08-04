import { MagazinePage, PageTemplate, PhotoElement } from '../types';
import { MAGAZINE_TEMPLATES } from '../data/templates';

// AI 智能排版推荐引擎 / AI-powered layout recommendation engine
// 基于当前页面上下文（照片数量、滤镜风格、页面位置等）智能推荐最合适的模板
// Recommends the most suitable templates based on current page context (photo count, filter style, page position, etc.)

export interface RecommendationContext {
  page: MagazinePage;
  isCover: boolean;
  spreadIndex: number;
  totalSpreads: number;
  pageSide: 'left' | 'right';
}

export interface TemplateRecommendation {
  template: PageTemplate;
  score: number;
  reasons: string[]; // 中文推荐理由 / Chinese recommendation reasons
}

// 风格关键词映射 / Style keyword mapping
// 根据模板 id 和 name 推断其视觉风格
// Infer visual style from template id and name
type StyleTag =
  | 'classic'      // 经典杂志
  | 'bold'         // 大胆粗犷
  | 'zen'          // 禅意东方
  | 'nordic'       // 北欧极简
  | 'retro'        // 复古胶片
  | 'poetic'       // 诗意人文
  | 'fashion'      // 高级时尚
  | 'hero'         // 大图壮丽
  | 'text-focused';// 文字为主

const STYLE_KEYWORDS: Record<StyleTag, string[]> = {
  classic: ['journal', 'editorial', 'about', 'teixeira', 'diptych-classic', 'restaurant', 'magazine-index'],
  bold: ['brutalist', 'bauhaus', 'noise', 'mosaic', 'runway'],
  zen: ['japanese', 'wabi', 'ma', 'zen', 'haiku', 'chashitsu', 'mountain-breeze', 'zen-balance'],
  nordic: ['nordic', 'hygge', 'minimal-square', 'clean-grid', 'museum-wall'],
  retro: ['film', 'polaroid', 'contact', 'strip', 'story-board', 'collage'],
  poetic: ['french', 'elegance', 'poetry', 'poem', 'breeze', 'chilling', 'manifesto', 'interview', 'quote'],
  fashion: ['vogue', 'monograph', 'french-elegance', 'editorial-portrait'],
  hero: ['panorama', 'cinematic', 'full-bleed', 'hero', 'featured', 'star'],
  'text-focused': ['text-only', 'manifesto', 'index', 'colophon', 'haiku', 'interview', 'quote'],
};

// 照片滤镜 → 偏好风格映射 / Photo filter → preferred style mapping
const FILTER_STYLE_AFFINITY: Record<PhotoElement['filter'], StyleTag[]> = {
  bw: ['fashion', 'bold', 'classic', 'hero'],
  vintage: ['retro', 'poetic', 'classic'],
  'soft-warm': ['poetic', 'zen', 'nordic'],
  'cold-film': ['nordic', 'zen', 'hero'],
  'high-contrast': ['bold', 'fashion', 'hero'],
  normal: ['classic', 'hero', 'fashion'],
};

// 推断模板风格标签 / Infer style tags for a template
function inferStyleTags(template: PageTemplate): StyleTag[] {
  const haystack = `${template.id} ${template.name} ${template.nameEn}`.toLowerCase();
  const tags: StyleTag[] = [];
  (Object.keys(STYLE_KEYWORDS) as StyleTag[]).forEach((tag) => {
    if (STYLE_KEYWORDS[tag].some((kw) => haystack.includes(kw))) {
      tags.push(tag);
    }
  });
  // 纯文字模板兜底 / Fallback for text-only templates
  if (tags.length === 0 && template.photoCount === 0) {
    tags.push('text-focused');
  }
  if (tags.length === 0) {
    tags.push('classic');
  }
  return tags;
}

// 检测页面主导滤镜风格 / Detect dominant photo filter on the page
function getDominantFilter(photos: PhotoElement[]): PhotoElement['filter'] | null {
  if (photos.length === 0) return null;
  const counts: Record<string, number> = {};
  photos.forEach((p) => {
    const f = p.filter || 'normal';
    counts[f] = (counts[f] || 0) + 1;
  });
  let dominant: PhotoElement['filter'] = 'normal';
  let max = 0;
  Object.entries(counts).forEach(([f, c]) => {
    if (c > max) {
      max = c;
      dominant = f as PhotoElement['filter'];
    }
  });
  return dominant;
}

// 推断照片主方向（横向/竖向）/ Infer dominant photo orientation
function getDominantOrientation(photos: PhotoElement[]): 'landscape' | 'portrait' | 'square' | 'unknown' {
  if (photos.length === 0) return 'unknown';
  let landscape = 0;
  let portrait = 0;
  let square = 0;
  photos.forEach((p) => {
    const ar = p.aspectRatio;
    if (!ar || ar === 'auto') {
      // 无明确比例时假设横向（多数摄影作品）/ Assume landscape when unspecified
      landscape++;
    } else if (ar.includes('/')) {
      const [w, h] = ar.split('/').map(Number);
      if (w > h) landscape++;
      else if (h > w) portrait++;
      else square++;
    } else {
      landscape++;
    }
  });
  if (landscape >= portrait && landscape >= square) return 'landscape';
  if (portrait >= landscape && portrait >= square) return 'portrait';
  return 'square';
}

// 风格中文名称 / Chinese display names for styles
const STYLE_LABELS: Record<StyleTag, string> = {
  classic: '经典杂志',
  bold: '大胆粗犷',
  zen: '禅意东方',
  nordic: '北欧极简',
  retro: '复古胶片',
  poetic: '诗意人文',
  fashion: '高级时尚',
  hero: '大图壮丽',
  'text-focused': '文字主导',
};

// 主推荐函数 / Main recommendation function
export function recommendTemplates(
  ctx: RecommendationContext,
  limit = 4
): TemplateRecommendation[] {
  const { page, isCover, spreadIndex, totalSpreads, pageSide } = ctx;

  const currentPhotoCount = page.photos.filter((p) => p.url).length;
  const dominantFilter = getDominantFilter(page.photos);
  const orientation = getDominantOrientation(page.photos);
  const preferredStyles: StyleTag[] = dominantFilter
    ? FILTER_STYLE_AFFINITY[dominantFilter]
    : ['classic', 'hero'];

  // 页面在杂志中的相对位置 / Relative position of the page in the magazine
  const positionRatio = totalSpreads > 1 ? spreadIndex / (totalSpreads - 1) : 0;
  const isEarly = positionRatio < 0.25;
  const isLate = positionRatio > 0.75;

  const scored = MAGAZINE_TEMPLATES.map((template) => {
    let score = 0;
    const reasons: string[] = [];

    // —— 排除当前模板 / Exclude current template ——
    if (template.id === page.templateId) {
      return { template, score: -1, reasons: [] };
    }

    // —— 封面与内页互斥 / Cover vs. inner page mutual exclusion ——
    if (isCover) {
      if (template.category === 'COVER') {
        score += 40;
        reasons.push('适合封面排版');
      } else {
        score -= 100; // 封面不使用内页模板 / Covers shouldn't use inner-page templates
      }
    } else {
      if (template.category === 'COVER') {
        score -= 100; // 内页不使用封面模板 / Inner pages shouldn't use cover templates
      }
    }

    if (score < 0) return { template, score, reasons };

    // —— 照片数量匹配 / Photo count match (核心权重 / core weight) ——
    const diff = Math.abs(template.photoCount - currentPhotoCount);
    if (currentPhotoCount === 0) {
      // 无照片时倾向文字模板 / Lean toward text templates when no photos
      if (template.photoCount === 0) {
        score += 35;
        reasons.push('当前无图片，适合文字排版');
      } else {
        score += 10;
      }
    } else if (diff === 0) {
      score += 35;
      reasons.push(`图片数量完美匹配（${template.photoCount} 图）`);
    } else if (diff === 1) {
      score += 18;
      reasons.push(`图片数量接近（${template.photoCount} 图）`);
    } else if (diff === 2) {
      score += 8;
    } else {
      score -= 5;
    }

    // —— 风格匹配 / Style matching ——
    const templateStyles = inferStyleTags(template);
    const matchedStyles = templateStyles.filter((s) => preferredStyles.includes(s));
    if (matchedStyles.length > 0 && dominantFilter) {
      score += 12 + matchedStyles.length * 4;
      const styleLabel = STYLE_LABELS[matchedStyles[0]];
      reasons.push(`滤镜「${filterLabel(dominantFilter)}」契合${styleLabel}风格`);
    }

    // —— 照片方向匹配 / Orientation matching ——
    if (currentPhotoCount > 0 && orientation !== 'unknown') {
      const isHeroTemplate = templateStyles.includes('hero');
      const isPanorama = template.id.includes('panorama') || template.id.includes('cinematic');
      const isPortraitTemplate = template.id.includes('editorial-portrait') || template.id.includes('zen') || template.id.includes('poetry-tall');
      if (orientation === 'landscape' && (isHeroTemplate || isPanorama)) {
        score += 10;
        reasons.push('适合横向构图照片');
      } else if (orientation === 'portrait' && isPortraitTemplate) {
        score += 10;
        reasons.push('适合竖向构图照片');
      } else if (orientation === 'square' && template.id.includes('minimal-square')) {
        score += 8;
      }
    }

    // —— 页面位置语境 / Page position context ——
    if (!isCover) {
      if (isEarly && (template.id.includes('about') || template.id.includes('manifesto') || template.photoCount <= 1)) {
        score += 6;
        reasons.push('适合杂志开篇章节');
      } else if (isLate && (template.id.includes('index') || template.id.includes('colophon') || template.id.includes('text-only'))) {
        score += 8;
        reasons.push('适合杂志结尾页');
      } else if (!isEarly && !isLate && template.photoCount >= 2) {
        score += 4;
        reasons.push('适合正文叙事跨页');
      }
    }

    // —— 跨页协调 / Cross-spread coordination ——
    if (!isCover && pageSide === 'right') {
      // 右页倾向选择有右页焦点设计的模板 / Right pages prefer right-focused layouts
      if (template.id.includes('panorama-right') || template.id.includes('cinematic-right') || template.id.includes('teixeira')) {
        score += 5;
      }
    } else if (!isCover && pageSide === 'left') {
      if (template.id.includes('panorama-left') || template.id.includes('cinematic-left') || template.id.includes('about')) {
        score += 5;
      }
    }

    // —— 轻微随机扰动，避免推荐永远雷同 / Slight randomization to avoid identical results ——
    score += Math.random() * 3;

    return { template, score, reasons: reasons.slice(0, 2) }; // 最多展示2条理由 / Show at most 2 reasons
  });

  return scored
    .filter((r) => r.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);
}

// 滤镜中文名 / Chinese label for filters
function filterLabel(filter: PhotoElement['filter']): string {
  const labels: Record<PhotoElement['filter'], string> = {
    normal: '原色',
    bw: '黑白',
    vintage: '复古',
    'high-contrast': '高对比',
    'soft-warm': '暖调',
    'cold-film': '冷调',
  };
  return labels[filter] || filter;
}
