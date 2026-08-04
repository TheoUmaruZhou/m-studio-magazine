import { PageTemplate, TextStyle } from '../types';

export const DEFAULT_TEXT_STYLES: Record<string, TextStyle> = {
  titleLarge: {
    fontFamily: 'Playfair Display',
    fontSize: 44,
    fontWeight: '700',
    color: '#111111',
    letterSpacing: 1,
    lineHeight: 1.15,
    textAlign: 'left',
    textTransform: 'uppercase',
  },
  titleBrutalist: {
    fontFamily: 'Syne',
    fontSize: 56,
    fontWeight: '800',
    color: '#000000',
    letterSpacing: -1,
    lineHeight: 0.95,
    textAlign: 'left',
    textTransform: 'uppercase',
  },
  titleSerif: {
    fontFamily: 'Cormorant Garamond',
    fontSize: 40,
    fontWeight: '600',
    color: '#1a1a1a',
    letterSpacing: 2,
    lineHeight: 1.2,
    textAlign: 'left',
    textTransform: 'uppercase',
  },
  subtitle: {
    fontFamily: 'Montserrat',
    fontSize: 16,
    fontWeight: '600',
    color: '#555555',
    letterSpacing: 3,
    lineHeight: 1.4,
    textAlign: 'left',
    textTransform: 'uppercase',
  },
  paragraph: {
    fontFamily: 'LXGW WenKai',
    fontSize: 14,
    fontWeight: '400',
    color: '#2a2a2a',
    letterSpacing: 0.5,
    lineHeight: 1.7,
    textAlign: 'left',
  },
  caption: {
    fontFamily: 'LXGW WenKai',
    fontSize: 12,
    fontWeight: '400',
    color: '#666666',
    letterSpacing: 1,
    lineHeight: 1.5,
    textAlign: 'left',
  },
  issueTag: {
    fontFamily: 'Montserrat',
    fontSize: 13,
    fontWeight: '700',
    color: '#000000',
    letterSpacing: 4,
    lineHeight: 1,
    textAlign: 'left',
    textTransform: 'uppercase',
  },
  poem: {
    fontFamily: 'LXGW WenKai',
    fontSize: 16,
    fontWeight: '400',
    color: '#1a1a1a',
    letterSpacing: 1.5,
    lineHeight: 1.85,
    textAlign: 'left',
  }
};

export const MAGAZINE_TEMPLATES: PageTemplate[] = [
  // ================= 1. 封面模板 (COVER) =================
  {
    id: 'cover-classic-journal',
    name: '经典旅行杂志封面',
    nameEn: 'Travel Journal Cover',
    category: 'COVER',
    photoCount: 1,
    description: '具有极高辨识度的全幅海景底图与浮动白色标题卡片，适合主打故事感封面',
    previewClass: 'bg-stone-200 border-zinc-800',
    bgColor: '#f8f7f5',
    layoutType: 'cover-journal',
    defaultPhotos: [
      {
        url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80',
        scale: 1, offsetX: 0, offsetY: 0, filter: 'normal', fit: 'cover', border: false,
      },
    ],
    defaultTexts: [
      {
        id: 'c1-brand', type: 'brandTag', label: '摄影师署名', content: 'JOSH BENDALL (PHOTO)',
        style: { ...DEFAULT_TEXT_STYLES.subtitle, fontSize: 10 },
      },
      {
        id: 'c1-title', type: 'title', label: '主标题', content: 'TRAVEL JOURNAL',
        style: { ...DEFAULT_TEXT_STYLES.titleBrutalist, fontSize: 44 },
      },
      {
        id: 'c1-subtitle', type: 'subtitle', label: '拍摄地点', content: 'MILOS, GREECE',
        style: { ...DEFAULT_TEXT_STYLES.subtitle, fontSize: 12 },
      },
      {
        id: 'c1-issue', type: 'issueNo', label: '期号与年份', content: "'25 VOL.08 '26",
        style: { ...DEFAULT_TEXT_STYLES.issueTag, fontSize: 11 },
      },
    ],
  },
  {
    id: 'cover-slice-sinai',
    name: '山岳狭缝排版封面',
    nameEn: 'Mountain Slice Cover',
    category: 'COVER',
    photoCount: 1,
    description: '中央狭长裁剪视窗配以粗体撕裂感大标题与居右叙事段落',
    previewClass: 'bg-zinc-900 border-zinc-700',
    bgColor: '#eceae6',
    layoutType: 'cover-slice',
    defaultPhotos: [
      {
        url: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1200&q=80',
        scale: 1, offsetX: 0, offsetY: 0, filter: 'normal', fit: 'cover', border: false,
      },
    ],
    defaultTexts: [
      {
        id: 'c2-title', type: 'title', label: '主标题', content: 'MOUNT\nSI\nNA\nI.',
        style: { ...DEFAULT_TEXT_STYLES.titleBrutalist, fontSize: 48, color: '#ffffff' },
      },
      {
        id: 'c2-paragraph', type: 'paragraph', label: '序言描述',
        content: 'Mount Sinai is a sacred mountain in Sinai Peninsula, capturing the raw light and timeless silence.',
        style: { ...DEFAULT_TEXT_STYLES.paragraph, fontSize: 11, color: '#222222' },
      },
    ],
  },
  {
    id: 'cover-chilling-star',
    name: '海边日落纵向海报封面',
    nameEn: 'Chilling Sunset Cover',
    category: 'COVER',
    photoCount: 2,
    description: '右侧纵向象牙白底板块配以超长标题CHILLING与四角星标',
    previewClass: 'bg-amber-100 border-amber-800',
    bgColor: '#f3efe8',
    layoutType: 'cover-chilling',
    defaultPhotos: [
      {
        url: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80',
        scale: 1, offsetX: 0, offsetY: 0, filter: 'normal', fit: 'cover', border: false,
      },
      {
        url: 'https://images.unsplash.com/photo-1518837695005-2083093ee35b?auto=format&fit=crop&w=800&q=80',
        scale: 1, offsetX: 0, offsetY: 0, filter: 'high-contrast', fit: 'cover', border: false,
      },
    ],
    defaultTexts: [
      {
        id: 'c3-title', type: 'title', label: '主标题', content: 'CHILLING',
        style: { ...DEFAULT_TEXT_STYLES.titleBrutalist, fontSize: 52, letterSpacing: 2 },
      },
      {
        id: 'c3-sub', type: 'subtitle', label: '副标题', content: 'TIME SEEMS TO PAUSE IN THESE MOMENTS.',
        style: { ...DEFAULT_TEXT_STYLES.subtitle, fontSize: 10 },
      },
      {
        id: 'c3-paragraph', type: 'paragraph', label: '诗意文段',
        content: 'Sitting on the beach chair, toes nestled in soft sand, there is a sense of stillness.',
        style: { ...DEFAULT_TEXT_STYLES.paragraph, fontSize: 10 },
      },
    ],
  },
  {
    id: 'cover-monograph-vogue',
    name: '高定典藏时尚特刊封面',
    nameEn: 'VOGUE Monograph Cover',
    category: 'COVER',
    photoCount: 1,
    description: '极简全版肖像画框，顶部经典硕大VOGUE风格艺术字体与底部精装版标识',
    previewClass: 'bg-zinc-800 border-zinc-600',
    bgColor: '#111111',
    layoutType: 'cover-vogue',
    defaultPhotos: [
      {
        url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=1200&q=80',
        scale: 1, offsetX: 0, offsetY: 0, filter: 'bw', fit: 'cover', border: true,
      },
    ],
    defaultTexts: [
      {
        id: 'c4-brand', type: 'title', label: '杂志社名', content: 'ARCHIVE',
        style: { ...DEFAULT_TEXT_STYLES.titleSerif, fontSize: 56, color: '#ffffff', letterSpacing: 6, textAlign: 'center' },
      },
      {
        id: 'c4-sub', type: 'subtitle', label: '副标题', content: 'SPECIAL ISSUE // THE MONOGRAPH',
        style: { ...DEFAULT_TEXT_STYLES.subtitle, fontSize: 11, color: '#aaaaaa', textAlign: 'center' },
      },
      {
        id: 'c4-issue', type: 'issueNo', label: '期号与摄影师', content: 'ISSUE 012 — PHOTOGRAPHY BY M-STUDIO',
        style: { ...DEFAULT_TEXT_STYLES.caption, fontSize: 9, color: '#888888', textAlign: 'center' },
      },
    ],
  },
  {
    id: 'cover-brutalist-grid',
    name: '野兽派黑白拼贴海报封面',
    nameEn: 'Brutalist Collage Cover',
    category: 'COVER',
    photoCount: 3,
    description: '浓重粗边线分割，三组纵向高对比摄影帧配以竖向排列标题与复古代码',
    previewClass: 'bg-black border-white',
    bgColor: '#0d0d0d',
    layoutType: 'cover-brutalist',
    defaultPhotos: [
      {
        url: 'https://images.unsplash.com/photo-1511556532299-8f662fc26c06?auto=format&fit=crop&w=800&q=80',
        scale: 1, offsetX: 0, offsetY: 0, filter: 'bw', fit: 'cover', border: false,
      },
      {
        url: 'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&w=800&q=80',
        scale: 1, offsetX: 0, offsetY: 0, filter: 'high-contrast', fit: 'cover', border: false,
      },
      {
        url: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=800&q=80',
        scale: 1, offsetX: 0, offsetY: 0, filter: 'bw', fit: 'cover', border: false,
      },
    ],
    defaultTexts: [
      {
        id: 'c5-title', type: 'title', label: '主标题', content: 'NOISE &\nLIGHT',
        style: { ...DEFAULT_TEXT_STYLES.titleBrutalist, fontSize: 42, color: '#ffffff' },
      },
      {
        id: 'c5-tag', type: 'brandTag', label: '竖排标注', content: 'VOL.2026 // LIMITED EDITION',
        style: { ...DEFAULT_TEXT_STYLES.issueTag, fontSize: 9, color: '#dddddd', writingMode: 'vertical-rl' },
      },
    ],
  },
  {
    id: 'cover-french-elegance',
    name: '法式典雅特写封面',
    nameEn: 'French Elegance Cover',
    category: 'COVER',
    photoCount: 1,
    description: '极其典雅的居中衬线大标题，细框极简竖幅图片置于中央，底部法文手写体短句',
    previewClass: 'bg-stone-50 border-stone-300',
    bgColor: '#fdfbf7',
    layoutType: 'cover-french-elegance',
    defaultPhotos: [
      {
        url: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1000&q=80',
        scale: 1, offsetX: 0, offsetY: 0, filter: 'soft-warm', fit: 'cover', border: true,
      },
    ],
    defaultTexts: [
      {
        id: 'cfe-brand', type: 'brandTag', label: '品牌标', content: 'L’ÉLÉGANCE ET LA POÉSIE',
        style: { ...DEFAULT_TEXT_STYLES.subtitle, fontSize: 10, textAlign: 'center', letterSpacing: 4 },
      },
      {
        id: 'cfe-title', type: 'title', label: '主标题', content: "L'OMBRE ET LA LUMIÈRE",
        style: { ...DEFAULT_TEXT_STYLES.titleSerif, fontSize: 38, textAlign: 'center', letterSpacing: 3 },
      },
      {
        id: 'cfe-quote', type: 'poem', label: '底部格言', content: '« La beauté commence moment où vous décidez d’être vous-même. »',
        style: { ...DEFAULT_TEXT_STYLES.poem, fontSize: 11, textAlign: 'center', fontStyle: 'italic', color: '#555555' },
      },
    ],
  },

  // ================= 2. 1图特写模板 (SINGLE_1) =================
  {
    id: 'single-1-about',
    name: '品牌排版：ABOUT. 双跨页',
    nameEn: 'About Editorial Spread',
    category: 'SINGLE_1',
    photoCount: 1,
    description: '左页简约双列文字与大号标题，右页大画幅横版作品与底部中缝标注',
    previewClass: 'bg-white border-zinc-300',
    bgColor: '#ffffff',
    layoutType: 'single-about',
    defaultPhotos: [
      {
        url: 'https://images.unsplash.com/photo-1502680390469-be75c86b636f?auto=format&fit=crop&w=1200&q=80',
        scale: 1, offsetX: 0, offsetY: 0, filter: 'bw', fit: 'cover', border: false,
      },
    ],
    defaultTexts: [
      {
        id: 's1-brand', type: 'brandTag', label: '顶部品牌', content: 'BRAND / M-STUDIO',
        style: { ...DEFAULT_TEXT_STYLES.subtitle, fontSize: 10 },
      },
      {
        id: 's1-title', type: 'title', label: '主标题', content: 'ABOUT.',
        style: { ...DEFAULT_TEXT_STYLES.titleSerif, fontSize: 38 },
      },
      {
        id: 's1-body', type: 'paragraph', label: '正文简介',
        content: 'Inspired by relation between nature, mind, body and soul, we made sure to keep the brand’s inherent simplicity and timeless aesthetics.',
        style: { ...DEFAULT_TEXT_STYLES.paragraph, fontSize: 11 },
      },
    ],
  },
  {
    id: 'single-1-mountain-breeze',
    name: '松林清风诗意排版',
    nameEn: 'Mountain Breeze Spread',
    category: 'SINGLE_1',
    photoCount: 1,
    description: '右页竖版高耸松林大图，左页典雅手写感英文字体与诗句排版',
    previewClass: 'bg-stone-100 border-zinc-400',
    bgColor: '#faf9f6',
    layoutType: 'single-breeze',
    defaultPhotos: [
      {
        url: 'https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=1000&q=80',
        scale: 1, offsetX: 0, offsetY: 0, filter: 'soft-warm', fit: 'cover', border: false,
      },
    ],
    defaultTexts: [
      {
        id: 'mb-eyebrow', type: 'subtitle', label: '诗意小标', content: 'The pine branches swayed',
        style: { ...DEFAULT_TEXT_STYLES.poem, fontSize: 14, fontStyle: 'italic' },
      },
      {
        id: 'mb-title', type: 'title', label: '主标题', content: 'MOUNTAIN BREEZE',
        style: { ...DEFAULT_TEXT_STYLES.titleSerif, fontSize: 36, letterSpacing: 4 },
      },
      {
        id: 'mb-poem', type: 'poem', label: '诗歌文段',
        content: 'Mountain wind without restraint\nLift up the water patterns in the stream\nInfused with the fragrance of wild flowers\nRoar through the deserted forest.',
        style: { ...DEFAULT_TEXT_STYLES.poem, fontSize: 12 },
      },
    ],
  },
  {
    id: 'single-1-full-bleed',
    name: '100% 满幅无界壮丽大图',
    nameEn: 'Full Bleed Ocean Hero',
    category: 'SINGLE_1',
    photoCount: 1,
    description: '照片占据全幅页面，左下角悬浮半透明白卡标题与正文浮框',
    previewClass: 'bg-blue-100 border-blue-400',
    bgColor: '#ffffff',
    layoutType: 'single-full-bleed',
    defaultPhotos: [
      {
        url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1400&q=80',
        scale: 1, offsetX: 0, offsetY: 0, filter: 'normal', fit: 'cover', border: false,
      },
    ],
    defaultTexts: [
      {
        id: 's1fb-title', type: 'title', label: '悬浮标题', content: 'ATLANTIC SILENCE',
        style: { ...DEFAULT_TEXT_STYLES.titleSerif, fontSize: 32, color: '#111111' },
      },
      {
        id: 's1fb-para', type: 'paragraph', label: '悬浮叙事',
        content: 'The horizon expands endlessly where blue sky merges with ocean tide.',
        style: { ...DEFAULT_TEXT_STYLES.paragraph, fontSize: 10, color: '#444444' },
      },
    ],
  },
  {
    id: 'single-1-minimal-square',
    name: '画廊留白正方形展画',
    nameEn: 'Gallery Square Exhibition',
    category: 'SINGLE_1',
    photoCount: 1,
    description: '大面积高尚留白与居中1:1正方形细边框图像，底部精致双列展品解说',
    previewClass: 'bg-stone-50 border-stone-300',
    bgColor: '#fcfbf7',
    layoutType: 'single-square',
    defaultPhotos: [
      {
        url: 'https://images.unsplash.com/photo-1518837695005-2083093ee35b?auto=format&fit=crop&w=800&q=80',
        scale: 1, offsetX: 0, offsetY: 0, filter: 'bw', fit: 'cover', border: true,
      },
    ],
    defaultTexts: [
      {
        id: 's1sq-num', type: 'issueNo', label: '编号', content: 'CATALOGUE NO. 04',
        style: { ...DEFAULT_TEXT_STYLES.subtitle, fontSize: 10, letterSpacing: 3 },
      },
      {
        id: 's1sq-title', type: 'title', label: '作品名称', content: 'RIPPLES & LIGHT',
        style: { ...DEFAULT_TEXT_STYLES.titleSerif, fontSize: 28 },
      },
      {
        id: 's1sq-body', type: 'paragraph', label: '作品说明',
        content: 'Silver halide print on archival paper, captured during early morning fog in Hokkaido.',
        style: { ...DEFAULT_TEXT_STYLES.paragraph, fontSize: 10 },
      },
    ],
  },
  {
    id: 'single-1-editorial-portrait',
    name: '首字下沉黑白人物专访',
    nameEn: 'Serif Drop-Cap Editorial',
    category: 'SINGLE_1',
    photoCount: 1,
    description: '右侧60%竖幅高质感人物，左侧优雅衬线大字与经典首字下沉长文故事',
    previewClass: 'bg-zinc-100 border-zinc-400',
    bgColor: '#ffffff',
    layoutType: 'single-portrait-story',
    defaultPhotos: [
      {
        url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=1000&q=80',
        scale: 1, offsetX: 0, offsetY: 0, filter: 'bw', fit: 'cover', border: false,
      },
    ],
    defaultTexts: [
      {
        id: 's1ep-title', type: 'title', label: '故事标题', content: 'THE PORTRAIT OF A CREATOR',
        style: { ...DEFAULT_TEXT_STYLES.titleSerif, fontSize: 30, lineHeight: 1.1 },
      },
      {
        id: 's1ep-body', type: 'paragraph', label: '正文文章',
        content: 'Photographers see what others merely look at. Every shadow tells a story that words often fail to express in full precision.',
        style: { ...DEFAULT_TEXT_STYLES.paragraph, fontSize: 11, lineHeight: 1.7 },
      },
    ],
  },
  {
    id: 'single-1-zen-balance',
    name: '日式禅意留白特写',
    nameEn: 'Zen Balance Solo',
    category: 'SINGLE_1',
    photoCount: 1,
    description: '80% 极高留白与右上方悬浮小图，左下方竖排古典中文诗文',
    previewClass: 'bg-stone-100 border-stone-300',
    bgColor: '#faf9f5',
    layoutType: 'single-zen',
    defaultPhotos: [
      {
        url: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=800&q=80',
        scale: 1, offsetX: 0, offsetY: 0, filter: 'soft-warm', fit: 'cover', border: false,
      },
    ],
    defaultTexts: [
      {
        id: 'sz-poem', type: 'poem', label: '竖排诗文',
        content: '空山新雨后\n天气晚来秋\n明月松间照\n清泉石上流',
        style: { ...DEFAULT_TEXT_STYLES.poem, fontSize: 14, writingMode: 'vertical-rl', lineHeight: 2.2, color: '#2c2c2c' },
      },
      {
        id: 'sz-sub', type: 'subtitle', label: '英译旁注', content: 'SILENCE IN THE MOUNTAINS',
        style: { ...DEFAULT_TEXT_STYLES.subtitle, fontSize: 9, letterSpacing: 4 },
      },
    ],
  },

  // ================= 3. 2图对比/并排模板 (DOUBLE_2) =================
  {
    id: 'double-2-asymmetric',
    name: '艺术指导与产品双图',
    nameEn: 'Art Direction Spread',
    category: 'DOUBLE_2',
    photoCount: 2,
    description: '左页中型作品+ART DIRECTION标识，右页上下组合图',
    previewClass: 'bg-zinc-100 border-zinc-300',
    bgColor: '#ffffff',
    layoutType: 'double-art',
    defaultPhotos: [
      {
        url: 'https://images.unsplash.com/photo-1511556532299-8f662fc26c06?auto=format&fit=crop&w=1000&q=80',
        scale: 1, offsetX: 0, offsetY: 0, filter: 'bw', fit: 'cover', border: false,
      },
      {
        url: 'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&w=800&q=80',
        scale: 1, offsetX: 0, offsetY: 0, filter: 'high-contrast', fit: 'cover', border: false,
      },
    ],
    defaultTexts: [
      {
        id: 'd1-title', type: 'title', label: '左页标题', content: 'ART\nDIRECTION',
        style: { ...DEFAULT_TEXT_STYLES.titleSerif, fontSize: 28 },
      },
      {
        id: 'd1-tag', type: 'brandTag', label: '竖版边栏', content: 'PRODUCT STYLE / 2026',
        style: { ...DEFAULT_TEXT_STYLES.subtitle, fontSize: 9, writingMode: 'vertical-rl' },
      },
    ],
  },
  {
    id: 'double-2-teixeira',
    name: 'TEIXEIRA 极简黑白暗色拼贴',
    nameEn: 'Teixeira Inset Spread',
    category: 'DOUBLE_2',
    photoCount: 2,
    description: '左页全幅满格浪花暗色画面，右页大文字搭配精致小插图',
    previewClass: 'bg-zinc-900 border-zinc-600',
    bgColor: '#ffffff',
    layoutType: 'double-teixeira',
    defaultPhotos: [
      {
        url: 'https://images.unsplash.com/photo-1505118380757-91f5f5632de0?auto=format&fit=crop&w=1200&q=80',
        scale: 1, offsetX: 0, offsetY: 0, filter: 'bw', fit: 'cover', border: false,
      },
      {
        url: 'https://images.unsplash.com/photo-1518837695005-2083093ee35b?auto=format&fit=crop&w=600&q=80',
        scale: 1, offsetX: 0, offsetY: 0, filter: 'high-contrast', fit: 'cover', border: false,
      },
    ],
    defaultTexts: [
      {
        id: 'd2-title', type: 'title', label: '右页标题', content: 'TEIXEIRA.',
        style: { ...DEFAULT_TEXT_STYLES.titleSerif, fontSize: 42, letterSpacing: 2 },
      },
      {
        id: 'd2-desc', type: 'paragraph', label: '正文',
        content: 'Inspired by relation between nature and soul, capturing the raw emotional connection to visuals.',
        style: { ...DEFAULT_TEXT_STYLES.paragraph, fontSize: 10 },
      },
    ],
  },
  {
    id: 'double-2-diptych-classic',
    name: '经典双生画图并排 Diptych',
    nameEn: 'Classic Diptych Pair',
    category: 'DOUBLE_2',
    photoCount: 2,
    description: '两幅极具呼应感的双生竖版影像平铺，极简顶边标题与底部连号注释',
    previewClass: 'bg-amber-50 border-amber-300',
    bgColor: '#faf8f5',
    layoutType: 'double-diptych',
    defaultPhotos: [
      {
        url: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=800&q=80',
        scale: 1, offsetX: 0, offsetY: 0, filter: 'normal', fit: 'cover', border: false,
      },
      {
        url: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=800&q=80',
        scale: 1, offsetX: 0, offsetY: 0, filter: 'normal', fit: 'cover', border: false,
      },
    ],
    defaultTexts: [
      {
        id: 'd3-title', type: 'title', label: '顶部标题', content: 'PARALLEL PERSPECTIVE',
        style: { ...DEFAULT_TEXT_STYLES.titleSerif, fontSize: 26, letterSpacing: 3 },
      },
      {
        id: 'd3-sub', type: 'caption', label: '底部注释', content: 'FIG 01. MORNING MIST // FIG 02. EVENING LIGHT',
        style: { ...DEFAULT_TEXT_STYLES.caption, fontSize: 9 },
      },
    ],
  },
  {
    id: 'double-2-hero-inset',
    name: '主照片与浮动子图重叠排版',
    nameEn: 'Hero & Inset Contrast',
    category: 'DOUBLE_2',
    photoCount: 2,
    description: '上方70%宽度主图，下方右侧叠放精致对比子图与左侧精炼短文',
    previewClass: 'bg-stone-200 border-zinc-400',
    bgColor: '#f4f3ef',
    layoutType: 'double-hero-inset',
    defaultPhotos: [
      {
        url: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=1200&q=80',
        scale: 1, offsetX: 0, offsetY: 0, filter: 'normal', fit: 'cover', border: false,
      },
      {
        url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80',
        scale: 1, offsetX: 0, offsetY: 0, filter: 'bw', fit: 'cover', border: true,
      },
    ],
    defaultTexts: [
      {
        id: 'd4-title', type: 'title', label: '章节标题', content: 'THE WILD LANDSCAPE',
        style: { ...DEFAULT_TEXT_STYLES.titleSerif, fontSize: 28 },
      },
      {
        id: 'd4-body', type: 'paragraph', label: '侧边文段',
        content: 'A close look into texture and tone, where raw stone meets subtle breeze.',
        style: { ...DEFAULT_TEXT_STYLES.paragraph, fontSize: 10 },
      },
    ],
  },
  {
    id: 'double-2-landscape-stacked',
    name: '上下双横幅宽银幕电影切片',
    nameEn: 'Dual Horizontal Landscape',
    category: 'DOUBLE_2',
    photoCount: 2,
    description: '上下两组16:9宽银幕电影级图像，中间穿插一细黑线与精美书卷引言',
    previewClass: 'bg-zinc-200 border-zinc-500',
    bgColor: '#eae8e4',
    layoutType: 'double-landscape',
    defaultPhotos: [
      {
        url: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80',
        scale: 1, offsetX: 0, offsetY: 0, filter: 'normal', fit: 'cover', border: false,
      },
      {
        url: 'https://images.unsplash.com/photo-1511556532299-8f662fc26c06?auto=format&fit=crop&w=1200&q=80',
        scale: 1, offsetX: 0, offsetY: 0, filter: 'high-contrast', fit: 'cover', border: false,
      },
    ],
    defaultTexts: [
      {
        id: 'd5-title', type: 'title', label: '引言', content: 'HORIZON & DEPTH',
        style: { ...DEFAULT_TEXT_STYLES.titleSerif, fontSize: 24, letterSpacing: 2 },
      },
      {
        id: 'd5-para', type: 'paragraph', label: '正文', content: 'Cinematic perspectives captured on 35mm film.',
        style: { ...DEFAULT_TEXT_STYLES.paragraph, fontSize: 10 },
      },
    ],
  },
  {
    id: 'cross-spread-panorama-left',
    name: '跨页全景大图 (左页 Left Bleed)',
    nameEn: 'Spread Panoramic Bleed (Left)',
    category: 'DOUBLE_2',
    photoCount: 1,
    description: '跨双页无缝大图的左半部分，配有左侧悬浮精美大标题，与右页无缝接合',
    previewClass: 'bg-zinc-800 border-zinc-600',
    bgColor: '#111111',
    layoutType: 'cross-spread-left',
    defaultPhotos: [
      {
        url: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=1600&q=80',
        scale: 1, offsetX: 0, offsetY: 0, filter: 'normal', fit: 'cover', border: false,
      },
    ],
    defaultTexts: [
      {
        id: 'cspl-title', type: 'title', label: '全景标题', content: 'ACROSS THE HORIZON',
        style: { ...DEFAULT_TEXT_STYLES.titleSerif, fontSize: 36, letterSpacing: 4, color: '#ffffff' },
      },
      {
        id: 'cspl-sub', type: 'subtitle', label: '章节标注', content: 'CROSS-PAGE PANORAMIC SPREAD // PART I',
        style: { ...DEFAULT_TEXT_STYLES.subtitle, fontSize: 9, color: '#cccccc', letterSpacing: 3 },
      },
    ],
  },
  {
    id: 'cross-spread-panorama-right',
    name: '跨页全景大图 (右页 Right Bleed)',
    nameEn: 'Spread Panoramic Bleed (Right)',
    category: 'DOUBLE_2',
    photoCount: 1,
    description: '跨双页无缝大图的右半部分，右下角配有细腻解说词，与左页无缝接合',
    previewClass: 'bg-zinc-800 border-zinc-600',
    bgColor: '#111111',
    layoutType: 'cross-spread-right',
    defaultPhotos: [
      {
        url: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=1600&q=80',
        scale: 1, offsetX: 0, offsetY: 0, filter: 'normal', fit: 'cover', border: false,
      },
    ],
    defaultTexts: [
      {
        id: 'cspr-quote', type: 'poem', label: '右侧格言', content: '« Nature does not hurry, yet everything is accomplished. »',
        style: { ...DEFAULT_TEXT_STYLES.poem, fontSize: 12, color: '#ffffff', fontStyle: 'italic', textAlign: 'right' },
      },
      {
        id: 'cspr-sub', type: 'caption', label: '版面连结', content: 'CONTINUATION FROM LEFT PAGE // SPREAD NO. 04',
        style: { ...DEFAULT_TEXT_STYLES.caption, fontSize: 9, color: '#aaaaaa', textAlign: 'right' },
      },
    ],
  },
  {
    id: 'cross-spread-cinematic-left',
    name: '电影宽银幕 21:9 跨页 (左页)',
    nameEn: 'Cinematic Letterbox Spread (Left)',
    category: 'DOUBLE_2',
    photoCount: 1,
    description: '21:9 宽银幕电影胶片跨页左侧，上下带有深色黑边与剧照编码',
    previewClass: 'bg-zinc-950 border-zinc-700',
    bgColor: '#0a0a0a',
    layoutType: 'cross-cinematic-left',
    defaultPhotos: [
      {
        url: 'https://images.unsplash.com/photo-1505118380757-91f5f5632de0?auto=format&fit=crop&w=1600&q=80',
        scale: 1, offsetX: 0, offsetY: 0, filter: 'bw', fit: 'cover', border: false,
      },
    ],
    defaultTexts: [
      {
        id: 'cscl-title', type: 'title', label: '场记标题', content: 'SCENE 04 — MOUNTAIN PASS',
        style: { ...DEFAULT_TEXT_STYLES.titleBrutalist, fontSize: 24, letterSpacing: 3, color: '#ffffff' },
      },
      {
        id: 'cscl-sub', type: 'subtitle', label: '胶片参数', content: 'PANAVISION 70MM // FRAME A',
        style: { ...DEFAULT_TEXT_STYLES.subtitle, fontSize: 9, color: '#888888' },
      },
    ],
  },
  {
    id: 'cross-spread-cinematic-right',
    name: '电影宽银幕 21:9 跨页 (右页)',
    nameEn: 'Cinematic Letterbox Spread (Right)',
    category: 'DOUBLE_2',
    photoCount: 1,
    description: '21:9 宽银幕电影胶片跨页右侧，右下角带有导演解说旁白',
    previewClass: 'bg-zinc-950 border-zinc-700',
    bgColor: '#0a0a0a',
    layoutType: 'cross-cinematic-right',
    defaultPhotos: [
      {
        url: 'https://images.unsplash.com/photo-1505118380757-91f5f5632de0?auto=format&fit=crop&w=1600&q=80',
        scale: 1, offsetX: 0, offsetY: 0, filter: 'bw', fit: 'cover', border: false,
      },
    ],
    defaultTexts: [
      {
        id: 'cscr-body', type: 'paragraph', label: '导演旁白', content: 'DIRECTOR\'S NOTE — "The quietude of evening before darkness settles over the peak."',
        style: { ...DEFAULT_TEXT_STYLES.paragraph, fontSize: 10, color: '#dddddd', textAlign: 'right' },
      },
      {
        id: 'cscr-sub', type: 'caption', label: '胶片参数', content: 'FRAME B // CONTINUOUS SHOT',
        style: { ...DEFAULT_TEXT_STYLES.caption, fontSize: 9, color: '#888888', textAlign: 'right' },
      },
    ],
  },
  {
    id: 'double-2-polaroid-overlap',
    name: '复古拍立得叠放排版',
    nameEn: 'Archival Layered Pair',
    category: 'DOUBLE_2',
    photoCount: 2,
    description: '两张带有极浅白色相框纸质感衬底的斜切/叠放照片，搭配底部精致博物馆解说词',
    previewClass: 'bg-amber-100/60 border-amber-300',
    bgColor: '#f7f5f0',
    layoutType: 'double-polaroid',
    defaultPhotos: [
      {
        url: 'https://images.unsplash.com/photo-1511556532299-8f662fc26c06?auto=format&fit=crop&w=800&q=80',
        scale: 1, offsetX: 0, offsetY: 0, filter: 'vintage', fit: 'cover', border: true,
      },
      {
        url: 'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&w=800&q=80',
        scale: 1, offsetX: 0, offsetY: 0, filter: 'vintage', fit: 'cover', border: true,
      },
    ],
    defaultTexts: [
      {
        id: 'dpo-title', type: 'title', label: '大标题', content: 'ARCHIVAL PRINTS',
        style: { ...DEFAULT_TEXT_STYLES.titleSerif, fontSize: 28, letterSpacing: 2 },
      },
      {
        id: 'dpo-sub', type: 'caption', label: '拍立得落款', content: "MEMORIES FROM SUMMER OF '25 — POLAROID SX-70",
        style: { ...DEFAULT_TEXT_STYLES.poem, fontSize: 10, fontStyle: 'italic', color: '#666666' },
      },
    ],
  },

  // ================= 4. 3图电影感模板 (TRIPLE_3) =================
  {
    id: 'triple-3-film-strip',
    name: '团队/人物三图列画廊',
    nameEn: 'Experts 3-Column Spread',
    category: 'TRIPLE_3',
    photoCount: 3,
    description: '左页FOUNDER主视像，右页三列雅致灰背景人物卡片',
    previewClass: 'bg-stone-50 border-stone-300',
    bgColor: '#fdfdfd',
    layoutType: 'triple-experts',
    defaultPhotos: [
      {
        url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80',
        scale: 1, offsetX: 0, offsetY: 0, filter: 'bw', fit: 'cover', border: false,
      },
      {
        url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80',
        scale: 1, offsetX: 0, offsetY: 0, filter: 'bw', fit: 'cover', border: false,
      },
      {
        url: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=600&q=80',
        scale: 1, offsetX: 0, offsetY: 0, filter: 'bw', fit: 'cover', border: false,
      },
    ],
    defaultTexts: [
      {
        id: 't1-title', type: 'title', label: '左页标题', content: 'FOUNDER',
        style: { ...DEFAULT_TEXT_STYLES.titleSerif, fontSize: 26 },
      },
      {
        id: 't1-sub', type: 'subtitle', label: '右页标题', content: 'EXPERTS & ARTISTS',
        style: { ...DEFAULT_TEXT_STYLES.subtitle, fontSize: 14 },
      },
    ],
  },
  {
    id: 'triple-3-poetry-tall',
    name: '三列高耸黑白诗意图',
    nameEn: '3-Tall Vertical Poem Spread',
    category: 'TRIPLE_3',
    photoCount: 3,
    description: '左侧优雅中文诗段，三框高比例竖切图穿插于跨页分割线两侧',
    previewClass: 'bg-zinc-200 border-zinc-400',
    bgColor: '#f4f3ef',
    layoutType: 'triple-tall-poem',
    defaultPhotos: [
      {
        url: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=800&q=80',
        scale: 1, offsetX: 0, offsetY: 0, filter: 'bw', fit: 'cover', border: false,
      },
      {
        url: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=800&q=80',
        scale: 1, offsetX: 0, offsetY: 0, filter: 'bw', fit: 'cover', border: false,
      },
      {
        url: 'https://images.unsplash.com/photo-1426604966848-d7adac402bff?auto=format&fit=crop&w=800&q=80',
        scale: 1, offsetX: 0, offsetY: 0, filter: 'high-contrast', fit: 'cover', border: false,
      },
    ],
    defaultTexts: [
      {
        id: 't2-poem', type: 'poem', label: '诗词文字',
        content: '差不多冬至\n一早一晚 还是有雨\n当初的坚持\n早已让你很怀疑\n很怀疑\n你最尾等到 只有这枯枝',
        style: { ...DEFAULT_TEXT_STYLES.paragraph, fontSize: 11, lineHeight: 1.8 },
      },
    ],
  },
  {
    id: 'triple-3-triptych-horizon',
    name: '三相全景连拍三联画 Triptych',
    nameEn: 'Panoramic Triptych Trio',
    category: 'TRIPLE_3',
    photoCount: 3,
    description: '三幅极窄间距连贯图像横向并置，呈现三联画般气势与时间连贯感',
    previewClass: 'bg-stone-300 border-stone-500',
    bgColor: '#ffffff',
    layoutType: 'triple-triptych',
    defaultPhotos: [
      {
        url: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=600&q=80',
        scale: 1, offsetX: 0, offsetY: 0, filter: 'normal', fit: 'cover', border: false,
      },
      {
        url: 'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&w=600&q=80',
        scale: 1, offsetX: 0, offsetY: 0, filter: 'normal', fit: 'cover', border: false,
      },
      {
        url: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=600&q=80',
        scale: 1, offsetX: 0, offsetY: 0, filter: 'normal', fit: 'cover', border: false,
      },
    ],
    defaultTexts: [
      {
        id: 't3-title', type: 'title', label: '全景标题', content: 'URBAN MONOLITH TRIO',
        style: { ...DEFAULT_TEXT_STYLES.titleSerif, fontSize: 28 },
      },
      {
        id: 't3-sub', type: 'subtitle', label: '副标题', content: 'ARCHITECTURAL SEQUENCE // TOKYO',
        style: { ...DEFAULT_TEXT_STYLES.subtitle, fontSize: 10 },
      },
    ],
  },
  {
    id: 'triple-3-featured-hero',
    name: '主海报横图+双分镜头网格',
    nameEn: 'Top Hero & Twin Sub-Photos',
    category: 'TRIPLE_3',
    photoCount: 3,
    description: '顶部占据半页的宽画幅横图，底部并排两张精致分镜头与右侧专栏文字',
    previewClass: 'bg-zinc-100 border-zinc-400',
    bgColor: '#fcfbf7',
    layoutType: 'triple-hero-twin',
    defaultPhotos: [
      {
        url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80',
        scale: 1, offsetX: 0, offsetY: 0, filter: 'normal', fit: 'cover', border: false,
      },
      {
        url: 'https://images.unsplash.com/photo-1518837695005-2083093ee35b?auto=format&fit=crop&w=600&q=80',
        scale: 1, offsetX: 0, offsetY: 0, filter: 'normal', fit: 'cover', border: false,
      },
      {
        url: 'https://images.unsplash.com/photo-1505118380757-91f5f5632de0?auto=format&fit=crop&w=600&q=80',
        scale: 1, offsetX: 0, offsetY: 0, filter: 'bw', fit: 'cover', border: false,
      },
    ],
    defaultTexts: [
      {
        id: 't4-title', type: 'title', label: '栏目名', content: 'COASTAL ECHOES',
        style: { ...DEFAULT_TEXT_STYLES.titleSerif, fontSize: 26 },
      },
      {
        id: 't4-para', type: 'paragraph', label: '叙述',
        content: 'Waves wash away footprint memories, leaving quiet reflections.',
        style: { ...DEFAULT_TEXT_STYLES.paragraph, fontSize: 10 },
      },
    ],
  },
  {
    id: 'triple-3-staggered-cascade',
    name: '高低错落级联三图',
    nameEn: 'Staggered Cascade Trio',
    category: 'TRIPLE_3',
    photoCount: 3,
    description: '三张高低不同、宽窄有致的连贯画框，营造轻盈高雅的律动感',
    previewClass: 'bg-stone-200 border-stone-400',
    bgColor: '#f9f8f6',
    layoutType: 'triple-staggered',
    defaultPhotos: [
      {
        url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80',
        scale: 1, offsetX: 0, offsetY: 0, filter: 'normal', fit: 'cover', border: false,
      },
      {
        url: 'https://images.unsplash.com/photo-1518837695005-2083093ee35b?auto=format&fit=crop&w=800&q=80',
        scale: 1, offsetX: 0, offsetY: 0, filter: 'normal', fit: 'cover', border: false,
      },
      {
        url: 'https://images.unsplash.com/photo-1505118380757-91f5f5632de0?auto=format&fit=crop&w=800&q=80',
        scale: 1, offsetX: 0, offsetY: 0, filter: 'normal', fit: 'cover', border: false,
      },
    ],
    defaultTexts: [
      {
        id: 'tsc-title', type: 'title', label: '律动标题', content: 'RHYTHM OF SHADOWS',
        style: { ...DEFAULT_TEXT_STYLES.titleSerif, fontSize: 26, letterSpacing: 3 },
      },
      {
        id: 'tsc-sub', type: 'subtitle', label: '旁注', content: 'THREE MOMENTS // ONE CONTINUOUS FLOW',
        style: { ...DEFAULT_TEXT_STYLES.subtitle, fontSize: 9 },
      },
    ],
  },

  // ================= 5. 4图网格模板 (QUAD_4) =================
  {
    id: 'quad-4-guest-restaurant',
    name: '特邀餐厅/四图展架',
    nameEn: 'Guest Restaurant Quad',
    category: 'QUAD_4',
    photoCount: 4,
    description: '左页灰调底框与GUEST RESTAURANT主标题，右页4框电影切片组',
    previewClass: 'bg-zinc-300 border-zinc-500',
    bgColor: '#eeeeeb',
    layoutType: 'quad-guest',
    defaultPhotos: [
      {
        url: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=800&q=80',
        scale: 1, offsetX: 0, offsetY: 0, filter: 'bw', fit: 'cover', border: false,
      },
      {
        url: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=80',
        scale: 1, offsetX: 0, offsetY: 0, filter: 'bw', fit: 'cover', border: false,
      },
      {
        url: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=800&q=80',
        scale: 1, offsetX: 0, offsetY: 0, filter: 'bw', fit: 'cover', border: false,
      },
      {
        url: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=800&q=80',
        scale: 1, offsetX: 0, offsetY: 0, filter: 'normal', fit: 'cover', border: false,
      },
    ],
    defaultTexts: [
      {
        id: 'q1-title', type: 'title', label: '板块标题', content: 'GUEST\nRESTAURANT',
        style: { ...DEFAULT_TEXT_STYLES.titleSerif, fontSize: 28 },
      },
      {
        id: 'q1-body', type: 'paragraph', label: '说明文字',
        content: '他们说的话，我连标点符号都不信。\n关于光影与场景的记录，呈现独特的影像叙事。',
        style: { ...DEFAULT_TEXT_STYLES.paragraph, fontSize: 10 },
      },
    ],
  },
  {
    id: 'quad-4-clean-grid',
    name: '2x2 典雅九宫标准画廊格',
    nameEn: '2x2 Exhibition Quad',
    category: 'QUAD_4',
    photoCount: 4,
    description: '标准的四分方格组合，每幅图配有小巧序号标记(#01-#04)与底部清爽页眉',
    previewClass: 'bg-white border-zinc-300',
    bgColor: '#ffffff',
    layoutType: 'quad-clean-grid',
    defaultPhotos: [
      {
        url: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=600&q=80',
        scale: 1, offsetX: 0, offsetY: 0, filter: 'normal', fit: 'cover', border: false,
      },
      {
        url: 'https://images.unsplash.com/photo-1511556532299-8f662fc26c06?auto=format&fit=crop&w=600&q=80',
        scale: 1, offsetX: 0, offsetY: 0, filter: 'normal', fit: 'cover', border: false,
      },
      {
        url: 'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&w=600&q=80',
        scale: 1, offsetX: 0, offsetY: 0, filter: 'normal', fit: 'cover', border: false,
      },
      {
        url: 'https://images.unsplash.com/photo-1518837695005-2083093ee35b?auto=format&fit=crop&w=600&q=80',
        scale: 1, offsetX: 0, offsetY: 0, filter: 'normal', fit: 'cover', border: false,
      },
    ],
    defaultTexts: [
      {
        id: 'q2-title', type: 'title', label: '画廊标题', content: 'EXHIBITION GRID',
        style: { ...DEFAULT_TEXT_STYLES.titleSerif, fontSize: 24, letterSpacing: 2 },
      },
      {
        id: 'q2-sub', type: 'subtitle', label: '副标题', content: 'SERIES 04 — SELECTED SHOTS',
        style: { ...DEFAULT_TEXT_STYLES.subtitle, fontSize: 10 },
      },
    ],
  },
  {
    id: 'quad-4-magazine-mosaic',
    name: '主从错落杂志不规则四图拼贴',
    nameEn: 'Asymmetric Mosaic Quad',
    category: 'QUAD_4',
    photoCount: 4,
    description: '左侧跨双行超高主图，右侧三幅细长子图与灵动旁白框',
    previewClass: 'bg-stone-100 border-zinc-400',
    bgColor: '#faf9f6',
    layoutType: 'quad-mosaic',
    defaultPhotos: [
      {
        url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80',
        scale: 1, offsetX: 0, offsetY: 0, filter: 'bw', fit: 'cover', border: false,
      },
      {
        url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80',
        scale: 1, offsetX: 0, offsetY: 0, filter: 'bw', fit: 'cover', border: false,
      },
      {
        url: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=600&q=80',
        scale: 1, offsetX: 0, offsetY: 0, filter: 'bw', fit: 'cover', border: false,
      },
      {
        url: 'https://images.unsplash.com/photo-1502680390469-be75c86b636f?auto=format&fit=crop&w=600&q=80',
        scale: 1, offsetX: 0, offsetY: 0, filter: 'bw', fit: 'cover', border: false,
      },
    ],
    defaultTexts: [
      {
        id: 'q3-title', type: 'title', label: '拼贴标题', content: 'FASHION MOSAIC',
        style: { ...DEFAULT_TEXT_STYLES.titleSerif, fontSize: 26 },
      },
      {
        id: 'q3-desc', type: 'paragraph', label: '注释',
        content: 'Different angles, one artistic direction.',
        style: { ...DEFAULT_TEXT_STYLES.paragraph, fontSize: 10 },
      },
    ],
  },
  {
    id: 'quad-4-film-contact-strip',
    name: '四格连发胶卷底片故事',
    nameEn: '4-Frame Film Contact Strip',
    category: 'QUAD_4',
    photoCount: 4,
    description: '四幅纵向排布的胶片特写，边缘印有胶卷齿孔与曝光参数代码',
    previewClass: 'bg-zinc-900 border-zinc-700',
    bgColor: '#141414',
    layoutType: 'quad-film-strip',
    defaultPhotos: [
      {
        url: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=800&q=80',
        scale: 1, offsetX: 0, offsetY: 0, filter: 'bw', fit: 'cover', border: false,
      },
      {
        url: 'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&w=800&q=80',
        scale: 1, offsetX: 0, offsetY: 0, filter: 'high-contrast', fit: 'cover', border: false,
      },
      {
        url: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=800&q=80',
        scale: 1, offsetX: 0, offsetY: 0, filter: 'bw', fit: 'cover', border: false,
      },
      {
        url: 'https://images.unsplash.com/photo-1505118380757-91f5f5632de0?auto=format&fit=crop&w=800&q=80',
        scale: 1, offsetX: 0, offsetY: 0, filter: 'bw', fit: 'cover', border: false,
      },
    ],
    defaultTexts: [
      {
        id: 'q4-title', type: 'title', label: '底片标题', content: 'KODAK TRI-X 400',
        style: { ...DEFAULT_TEXT_STYLES.titleBrutalist, fontSize: 24, color: '#ffffff', letterSpacing: 2 },
      },
      {
        id: 'q4-tag', type: 'caption', label: '侧栏参数', content: 'EXP 36 // ISO 400 // SHUTTER 1/250',
        style: { ...DEFAULT_TEXT_STYLES.caption, fontSize: 9, color: '#888888' },
      },
    ],
  },
  {
    id: 'quad-4-museum-wall',
    name: '现代艺术馆展墙四图',
    nameEn: 'Museum Wall Gallery Quad',
    category: 'QUAD_4',
    photoCount: 4,
    description: '模拟美术馆策展墙的不对称错落网格，每幅画下方附带精美微型作品编号',
    previewClass: 'bg-zinc-100 border-zinc-300',
    bgColor: '#ffffff',
    layoutType: 'quad-museum-wall',
    defaultPhotos: [
      {
        url: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=800&q=80',
        scale: 1, offsetX: 0, offsetY: 0, filter: 'bw', fit: 'cover', border: true,
      },
      {
        url: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=80',
        scale: 1, offsetX: 0, offsetY: 0, filter: 'normal', fit: 'cover', border: true,
      },
      {
        url: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=800&q=80',
        scale: 1, offsetX: 0, offsetY: 0, filter: 'bw', fit: 'cover', border: true,
      },
      {
        url: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=800&q=80',
        scale: 1, offsetX: 0, offsetY: 0, filter: 'normal', fit: 'cover', border: true,
      },
    ],
    defaultTexts: [
      {
        id: 'qmw-title', type: 'title', label: '展墙大标题', content: 'GALLERY ROOM 03',
        style: { ...DEFAULT_TEXT_STYLES.titleSerif, fontSize: 26, letterSpacing: 4 },
      },
      {
        id: 'qmw-sub', type: 'caption', label: '策展说明', content: 'CURATED SELECTION OF CONTEMPORARY PORTRAITURE & LANDSCAPES',
        style: { ...DEFAULT_TEXT_STYLES.caption, fontSize: 9 },
      },
    ],
  },

  // ================= 6. 5+图拼贴/胶卷模板 (MULTI_5PLUS) =================
  {
    id: 'multi-6-film-strip',
    name: '6图横向连续胶卷画廊',
    nameEn: '6-Strip Horizon Spread',
    category: 'MULTI_5PLUS',
    photoCount: 6,
    description: '跨越中缝分割线的6画幅高低错落摄影连帧，富有强烈的视觉律动',
    previewClass: 'bg-stone-200 border-zinc-400',
    bgColor: '#eae8e4',
    layoutType: 'multi-6-film',
    defaultPhotos: [
      { url: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=600&q=80', scale: 1, offsetX: 0, offsetY: 0, filter: 'normal', fit: 'cover', border: false },
      { url: 'https://images.unsplash.com/photo-1518837695005-2083093ee35b?auto=format&fit=crop&w=600&q=80', scale: 1, offsetX: 0, offsetY: 0, filter: 'normal', fit: 'cover', border: true },
      { url: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=600&q=80', scale: 1, offsetX: 0, offsetY: 0, filter: 'normal', fit: 'cover', border: false },
      { url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=600&q=80', scale: 1, offsetX: 0, offsetY: 0, filter: 'normal', fit: 'cover', border: false },
      { url: 'https://images.unsplash.com/photo-1511556532299-8f662fc26c06?auto=format&fit=crop&w=600&q=80', scale: 1, offsetX: 0, offsetY: 0, filter: 'high-contrast', fit: 'cover', border: false },
      { url: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=600&q=80', scale: 1, offsetX: 0, offsetY: 0, filter: 'normal', fit: 'cover', border: false },
    ],
    defaultTexts: [
      {
        id: 'm1-tag', type: 'brandTag', label: '底部页脚', content: 'M-STUDIO // EXPOSURE INDEX 06',
        style: { ...DEFAULT_TEXT_STYLES.subtitle, fontSize: 10 },
      },
    ],
  },
  {
    id: 'multi-5-story-board',
    name: '5图故事板主从辐射网格',
    nameEn: '5-Photo Story Board',
    category: 'MULTI_5PLUS',
    photoCount: 5,
    description: '中央大画幅核心图，四周环绕四张微型细节裁切图，极富叙事深度',
    previewClass: 'bg-zinc-100 border-zinc-400',
    bgColor: '#ffffff',
    layoutType: 'multi-5-storyboard',
    defaultPhotos: [
      { url: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80', scale: 1, offsetX: 0, offsetY: 0, filter: 'normal', fit: 'cover', border: false },
      { url: 'https://images.unsplash.com/photo-1518837695005-2083093ee35b?auto=format&fit=crop&w=400&q=80', scale: 1, offsetX: 0, offsetY: 0, filter: 'normal', fit: 'cover', border: false },
      { url: 'https://images.unsplash.com/photo-1505118380757-91f5f5632de0?auto=format&fit=crop&w=400&q=80', scale: 1, offsetX: 0, offsetY: 0, filter: 'normal', fit: 'cover', border: false },
      { url: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=400&q=80', scale: 1, offsetX: 0, offsetY: 0, filter: 'bw', fit: 'cover', border: false },
      { url: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=400&q=80', scale: 1, offsetX: 0, offsetY: 0, filter: 'normal', fit: 'cover', border: false },
    ],
    defaultTexts: [
      {
        id: 'm2-title', type: 'title', label: '故事板块', content: 'STORYBOARD 05',
        style: { ...DEFAULT_TEXT_STYLES.titleSerif, fontSize: 26 },
      },
      {
        id: 'm2-body', type: 'paragraph', label: '细节描述', content: 'Focusing on details that reveal the quiet passage of time.',
        style: { ...DEFAULT_TEXT_STYLES.paragraph, fontSize: 10 },
      },
    ],
  },
  {
    id: 'multi-5-fashion-runway',
    name: '5列时装T台走秀连续画廊',
    nameEn: '5-Strip Runway Sequence',
    category: 'MULTI_5PLUS',
    photoCount: 5,
    description: '五列极其紧凑的纵向全身肖像画廊，呈现高密度视觉张力',
    previewClass: 'bg-zinc-800 border-zinc-600',
    bgColor: '#1a1a1a',
    layoutType: 'multi-5-runway',
    defaultPhotos: [
      { url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80', scale: 1, offsetX: 0, offsetY: 0, filter: 'bw', fit: 'cover', border: false },
      { url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80', scale: 1, offsetX: 0, offsetY: 0, filter: 'bw', fit: 'cover', border: false },
      { url: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=600&q=80', scale: 1, offsetX: 0, offsetY: 0, filter: 'bw', fit: 'cover', border: false },
      { url: 'https://images.unsplash.com/photo-1502680390469-be75c86b636f?auto=format&fit=crop&w=600&q=80', scale: 1, offsetX: 0, offsetY: 0, filter: 'bw', fit: 'cover', border: false },
      { url: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=600&q=80', scale: 1, offsetX: 0, offsetY: 0, filter: 'bw', fit: 'cover', border: false },
    ],
    defaultTexts: [
      {
        id: 'm3-title', type: 'title', label: '秀场标题', content: 'PARIS RUNWAY // 2026',
        style: { ...DEFAULT_TEXT_STYLES.titleBrutalist, fontSize: 24, color: '#ffffff' },
      },
    ],
  },
  {
    id: 'multi-8-contact-sheet',
    name: '8格中画幅胶卷印相印张 Contact Sheet',
    nameEn: '8-Frame Medium Format Sheet',
    category: 'MULTI_5PLUS',
    photoCount: 8,
    description: '4x2 经典中画幅黑白底片网格，带印相编号与暗房冲洗标记',
    previewClass: 'bg-zinc-950 border-zinc-700',
    bgColor: '#0f0f0f',
    layoutType: 'multi-8-contact',
    defaultPhotos: [
      { url: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=400&q=80', scale: 1, offsetX: 0, offsetY: 0, filter: 'bw', fit: 'cover', border: true },
      { url: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=400&q=80', scale: 1, offsetX: 0, offsetY: 0, filter: 'bw', fit: 'cover', border: true },
      { url: 'https://images.unsplash.com/photo-1426604966848-d7adac402bff?auto=format&fit=crop&w=400&q=80', scale: 1, offsetX: 0, offsetY: 0, filter: 'bw', fit: 'cover', border: true },
      { url: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=400&q=80', scale: 1, offsetX: 0, offsetY: 0, filter: 'bw', fit: 'cover', border: true },
      { url: 'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&w=400&q=80', scale: 1, offsetX: 0, offsetY: 0, filter: 'bw', fit: 'cover', border: true },
      { url: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=400&q=80', scale: 1, offsetX: 0, offsetY: 0, filter: 'bw', fit: 'cover', border: true },
      { url: 'https://images.unsplash.com/photo-1511556532299-8f662fc26c06?auto=format&fit=crop&w=400&q=80', scale: 1, offsetX: 0, offsetY: 0, filter: 'bw', fit: 'cover', border: true },
      { url: 'https://images.unsplash.com/photo-1518837695005-2083093ee35b?auto=format&fit=crop&w=400&q=80', scale: 1, offsetX: 0, offsetY: 0, filter: 'bw', fit: 'cover', border: true },
    ],
    defaultTexts: [
      {
        id: 'm4-title', type: 'title', label: '底片抬头', content: 'HASSELBLAD 500C // PROOF SHEET',
        style: { ...DEFAULT_TEXT_STYLES.titleBrutalist, fontSize: 20, color: '#e5e5e5' },
      },
      {
        id: 'm4-sub', type: 'caption', label: '摄影师标记', content: 'DATE: 2026.04.12 — FRAME 01 TO 08 — APPROVED',
        style: { ...DEFAULT_TEXT_STYLES.caption, fontSize: 9, color: '#888888' },
      },
    ],
  },
  {
    id: 'multi-7-editorial-collage',
    name: '7图高级时装特刊拼贴',
    nameEn: 'Haute Fashion 7-Grid',
    category: 'MULTI_5PLUS',
    photoCount: 7,
    description: '左侧主视角高清封面图，右侧6图网格搭配顶部时尚大标',
    previewClass: 'bg-zinc-200 border-zinc-400',
    bgColor: '#f8f8f8',
    layoutType: 'multi-7-editorial',
    defaultPhotos: [
      { url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80', scale: 1, offsetX: 0, offsetY: 0, filter: 'normal', fit: 'cover', border: false },
      { url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80', scale: 1, offsetX: 0, offsetY: 0, filter: 'bw', fit: 'cover', border: false },
      { url: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=400&q=80', scale: 1, offsetX: 0, offsetY: 0, filter: 'normal', fit: 'cover', border: false },
      { url: 'https://images.unsplash.com/photo-1502680390469-be75c86b636f?auto=format&fit=crop&w=400&q=80', scale: 1, offsetX: 0, offsetY: 0, filter: 'normal', fit: 'cover', border: false },
      { url: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80', scale: 1, offsetX: 0, offsetY: 0, filter: 'bw', fit: 'cover', border: false },
      { url: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=400&q=80', scale: 1, offsetX: 0, offsetY: 0, filter: 'normal', fit: 'cover', border: false },
      { url: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=400&q=80', scale: 1, offsetX: 0, offsetY: 0, filter: 'normal', fit: 'cover', border: false },
    ],
    defaultTexts: [
      {
        id: 'm7-title', type: 'title', label: '特刊标题', content: "LOOKBOOK '26",
        style: { ...DEFAULT_TEXT_STYLES.titleBrutalist, fontSize: 32, letterSpacing: 2 },
      },
      {
        id: 'm7-sub', type: 'subtitle', label: '栏目注脚', content: 'SEVEN FACETS OF ELEGANCE',
        style: { ...DEFAULT_TEXT_STYLES.subtitle, fontSize: 10 },
      },
    ],
  },

  // ================= 7. 纯文/序言模板 (TEXT_ONLY) =================
  {
    id: 'text-only-manifesto',
    name: '经典杂志卷首语/摄影宣言',
    nameEn: 'Editorial Manifesto Spread',
    category: 'TEXT_ONLY',
    photoCount: 0,
    description: '无图巨幅衬线文字排版，包含大号引用标语、多段落长文与优雅作者签名',
    previewClass: 'bg-stone-50 border-stone-300',
    bgColor: '#fcfbf7',
    layoutType: 'text-manifesto',
    defaultPhotos: [],
    defaultTexts: [
      {
        id: 'to1-head', type: 'subtitle', label: '卷首标语', content: 'THE PHOTOGRAPHER’S STATEMENT',
        style: { ...DEFAULT_TEXT_STYLES.subtitle, fontSize: 11, letterSpacing: 4 },
      },
      {
        id: 'to1-title', type: 'title', label: '主宣言', content: 'LIGHT IS THE ONLY TRUTH WE SEEK.',
        style: { ...DEFAULT_TEXT_STYLES.titleSerif, fontSize: 36, lineHeight: 1.15 },
      },
      {
        id: 'to1-body', type: 'paragraph', label: '序言正文',
        content: 'Photography is not about capturing reality; it is about preserving the fleeting emotion of a single micro-second. In this issue, we present a collection of moments where shadow and silence collide.',
        style: { ...DEFAULT_TEXT_STYLES.paragraph, fontSize: 12, lineHeight: 1.8 },
      },
      {
        id: 'to1-sign', type: 'author', label: '作者署名', content: '— EDITOR IN CHIEF, M-STUDIO',
        style: { ...DEFAULT_TEXT_STYLES.poem, fontSize: 11, fontStyle: 'italic' },
      },
    ],
  },
  {
    id: 'text-only-index',
    name: '精装杂志目录与专栏索引 Page Index',
    nameEn: 'Magazine Table of Contents',
    category: 'TEXT_ONLY',
    photoCount: 0,
    description: '排版齐整的CONTENTS大标题与清晰的项目章节页码列表',
    previewClass: 'bg-zinc-100 border-zinc-400',
    bgColor: '#ffffff',
    layoutType: 'text-index',
    defaultPhotos: [],
    defaultTexts: [
      {
        id: 'to2-title', type: 'title', label: '目录大标题', content: 'CONTENTS',
        style: { ...DEFAULT_TEXT_STYLES.titleSerif, fontSize: 40, letterSpacing: 4 },
      },
      {
        id: 'to2-sub', type: 'subtitle', label: '期号说明', content: 'M-STUDIO // ISSUE 08 CONTENTS',
        style: { ...DEFAULT_TEXT_STYLES.subtitle, fontSize: 10 },
      },
      {
        id: 'to2-list', type: 'paragraph', label: '目录列表',
        content: '01. TRAVEL JOURNAL ........................................... P.02\n02. MOUNTAIN SI NAI ......................................... P.06\n03. COASTAL SILENCE ....................................... P.12\n04. EXPERTS & ARTISTS ...................................... P.18\n05. URBAN MONOLITH ........................................ P.24',
        style: { ...DEFAULT_TEXT_STYLES.paragraph, fontSize: 11, lineHeight: 2.2 },
      },
    ],
  },
  {
    id: 'text-only-colophon',
    name: '典藏版版权与致谢文字',
    nameEn: 'Editorial Colophon & Credits',
    category: 'TEXT_ONLY',
    photoCount: 0,
    description: '优雅的左右双列致谢与制作人员名单排版，带有首字放大与细线分割',
    previewClass: 'bg-stone-100 border-stone-300',
    bgColor: '#faf9f5',
    layoutType: 'text-colophon',
    defaultPhotos: [],
    defaultTexts: [
      {
        id: 'toc-title', type: 'title', label: '大标题', content: 'COLOPHON',
        style: { ...DEFAULT_TEXT_STYLES.titleSerif, fontSize: 36, letterSpacing: 4 },
      },
      {
        id: 'toc-sub', type: 'subtitle', label: '制作团队', content: 'EDITORIAL CREDITS & ACKNOWLEDGMENTS',
        style: { ...DEFAULT_TEXT_STYLES.subtitle, fontSize: 10, letterSpacing: 3 },
      },
      {
        id: 'toc-credits', type: 'paragraph', label: '人员名单',
        content: 'CREATIVE DIRECTOR — ELENA VANCE\nART DIRECTOR — MARCUS CHEN\nCHIEF PHOTOGRAPHER — JOSH BENDALL\nSENIOR EDITOR — CLARA MOREAU\nPUBLISHED BY — M-STUDIO PRESS, TOKYO / PARIS',
        style: { ...DEFAULT_TEXT_STYLES.paragraph, fontSize: 10, lineHeight: 2.0 },
      },
      {
        id: 'toc-note', type: 'poem', label: '出版结语',
        content: 'Printed on 150gsm FSC-certified archival stock in Tokyo. All rights reserved. No part of this publication may be reproduced without written permission.',
        style: { ...DEFAULT_TEXT_STYLES.poem, fontSize: 9, fontStyle: 'italic', color: '#666666' },
      },
    ],
  },

  // ================= 8. 日式极简与风貌专区 (JAPANESE & ARTISAN) =================
  {
    id: 'cover-japanese-wabi',
    name: '日式侘寂美学封面',
    nameEn: 'Wabi-Sabi Cover',
    category: 'COVER',
    photoCount: 1,
    description: '日式和风质感暖米白背景，极狭长图像卡片与左侧优雅竖排诗文，充满沉静禅意',
    previewClass: 'bg-[#f4f1ea] border-stone-300',
    bgColor: '#f4f1ea',
    layoutType: 'cover-japanese-wabi',
    defaultPhotos: [
      {
        url: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=800&q=80',
        scale: 1, offsetX: 0, offsetY: 0, filter: 'soft-warm', fit: 'cover', border: true,
      },
    ],
    defaultTexts: [
      {
        id: 'cjw-vertical', type: 'poem', label: '竖排大标题', content: '侘寂・万物皆有裂痕',
        style: { ...DEFAULT_TEXT_STYLES.poem, fontSize: 24, writingMode: 'vertical-rl', lineHeight: 2.2, color: '#1a1a1a' },
      },
      {
        id: 'cjw-brand', type: 'brandTag', label: '日文印章', content: '東京 // 創刊号',
        style: { ...DEFAULT_TEXT_STYLES.subtitle, fontSize: 10, letterSpacing: 4 },
      },
      {
        id: 'cjw-sub', type: 'caption', label: '底部注释', content: 'FINDING BEAUTY IN IMPERFECTION AND IMPERMANENCE',
        style: { ...DEFAULT_TEXT_STYLES.caption, fontSize: 9, color: '#555555' },
      },
    ],
  },
  {
    id: 'single-1-japanese-ma',
    name: '日式「间」极度留白单图',
    nameEn: 'Minimal Ma Spacing Solo',
    category: 'SINGLE_1',
    photoCount: 1,
    description: '85% 极致留白与居中微型相框，下方配以极清雅的竖排与横排说明',
    previewClass: 'bg-[#f8f7f3] border-stone-300',
    bgColor: '#f8f7f3',
    layoutType: 'single-japanese-ma',
    defaultPhotos: [
      {
        url: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=800&q=80',
        scale: 1, offsetX: 0, offsetY: 0, filter: 'normal', fit: 'cover', border: true,
      },
    ],
    defaultTexts: [
      {
        id: 'sjm-vertical', type: 'poem', label: '竖排心境', content: '一期一会\n日日是好日',
        style: { ...DEFAULT_TEXT_STYLES.poem, fontSize: 15, writingMode: 'vertical-rl', lineHeight: 2.4, color: '#2c2c2c' },
      },
      {
        id: 'sjm-caption', type: 'caption', label: '英文小字', content: 'TREASURE EVERY ENCOUNTER, FOR IT CAN NEVER BE REPEATED.',
        style: { ...DEFAULT_TEXT_STYLES.caption, fontSize: 8, letterSpacing: 2, color: '#777777' },
      },
    ],
  },
  {
    id: 'double-2-japanese-grid',
    name: '日式和风双图布局',
    nameEn: 'Washitsu Duo Layout',
    category: 'DOUBLE_2',
    photoCount: 2,
    description: '左右非对称低饱和和风小图，中间以古典竖排引言连接，自然宁静',
    previewClass: 'bg-[#f0ede6] border-stone-300',
    bgColor: '#f0ede6',
    layoutType: 'double-japanese-grid',
    defaultPhotos: [
      {
        url: 'https://images.unsplash.com/photo-1528164344705-475426879e0d?auto=format&fit=crop&w=800&q=80',
        scale: 1, offsetX: 0, offsetY: 0, filter: 'soft-warm', fit: 'cover', border: false,
      },
      {
        url: 'https://images.unsplash.com/photo-1492571350019-22de08371fd3?auto=format&fit=crop&w=800&q=80',
        scale: 1, offsetX: 0, offsetY: 0, filter: 'soft-warm', fit: 'cover', border: false,
      },
    ],
    defaultTexts: [
      {
        id: 'djg-poem', type: 'poem', label: '中央竖排引言', content: '风吹竹叶\n雨打芭蕉',
        style: { ...DEFAULT_TEXT_STYLES.poem, fontSize: 13, writingMode: 'vertical-rl', lineHeight: 2.0, color: '#333333' },
      },
      {
        id: 'djg-title', type: 'title', label: '底栏标题', content: 'KYOTO ESSENCE',
        style: { ...DEFAULT_TEXT_STYLES.titleSerif, fontSize: 20, letterSpacing: 3 },
      },
    ],
  },
  {
    id: 'triple-3-japanese-chashitsu',
    name: '日式茶室三图序列',
    nameEn: 'Japanese Teahouse Trio',
    category: 'TRIPLE_3',
    photoCount: 3,
    description: '三幅纵向高狭画框犹如日式障子门窗，展现连贯的空间光影变化',
    previewClass: 'bg-[#f6f5f0] border-stone-300',
    bgColor: '#f6f5f0',
    layoutType: 'triple-japanese-chashitsu',
    defaultPhotos: [
      {
        url: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=600&q=80',
        scale: 1, offsetX: 0, offsetY: 0, filter: 'normal', fit: 'cover', border: false,
      },
      {
        url: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=600&q=80',
        scale: 1, offsetX: 0, offsetY: 0, filter: 'normal', fit: 'cover', border: false,
      },
      {
        url: 'https://images.unsplash.com/photo-1528164344705-475426879e0d?auto=format&fit=crop&w=600&q=80',
        scale: 1, offsetX: 0, offsetY: 0, filter: 'normal', fit: 'cover', border: false,
      },
    ],
    defaultTexts: [
      {
        id: 'tjc-title', type: 'title', label: '茶室大标题', content: 'LIGHT & SHOJI',
        style: { ...DEFAULT_TEXT_STYLES.titleSerif, fontSize: 24, letterSpacing: 3 },
      },
      {
        id: 'tjc-sub', type: 'subtitle', label: '茶道小注', content: 'THREE FRAMES OF TRADITIONAL ARCHITECTURE',
        style: { ...DEFAULT_TEXT_STYLES.subtitle, fontSize: 9 },
      },
    ],
  },
  {
    id: 'text-only-haiku',
    name: '日式和歌俳句竖排专版',
    nameEn: 'Haiku & Waka Vertical Poetry',
    category: 'TEXT_ONLY',
    photoCount: 0,
    description: '三列古典竖排诗歌，配以质感朱印章落款，展现纯粹的汉字与日文字体美学',
    previewClass: 'bg-[#f7f5ef] border-stone-300',
    bgColor: '#f7f5ef',
    layoutType: 'text-haiku',
    defaultPhotos: [],
    defaultTexts: [
      {
        id: 'toh-1', type: 'poem', label: '首列诗句', content: '古池や\n蛙飛び込む\n水の音',
        style: { ...DEFAULT_TEXT_STYLES.poem, fontSize: 18, writingMode: 'vertical-rl', lineHeight: 2.5, color: '#111111' },
      },
      {
        id: 'toh-2', type: 'poem', label: '次列诗句', content: '幽幽古池畔\n青蛙跃入水声清\n涟漪动沉寂',
        style: { ...DEFAULT_TEXT_STYLES.poem, fontSize: 16, writingMode: 'vertical-rl', lineHeight: 2.3, color: '#333333' },
      },
      {
        id: 'toh-3', type: 'caption', label: '印章与落款', content: '松尾芭蕉 句 // MATSUO BASHO (1686)',
        style: { ...DEFAULT_TEXT_STYLES.caption, fontSize: 9, letterSpacing: 3, color: '#888888' },
      },
    ],
  },
  {
    id: 'single-1-nordic-hygge',
    name: '北欧冰川极简单图',
    nameEn: 'Nordic Glacial Minimal',
    category: 'SINGLE_1',
    photoCount: 1,
    description: '冷灰白高雅气场，巨幅极简单图靠右下，左上角硕大居左数字与标题',
    previewClass: 'bg-slate-100 border-slate-300',
    bgColor: '#f1f3f5',
    layoutType: 'single-nordic-hygge',
    defaultPhotos: [
      {
        url: 'https://images.unsplash.com/photo-1517411032315-54ef2cb783bb?auto=format&fit=crop&w=1000&q=80',
        scale: 1, offsetX: 0, offsetY: 0, filter: 'cold-film', fit: 'cover', border: false,
      },
    ],
    defaultTexts: [
      {
        id: 'snh-no', type: 'issueNo', label: '巨幅章节号', content: '08',
        style: { ...DEFAULT_TEXT_STYLES.titleBrutalist, fontSize: 72, color: '#102a43' },
      },
      {
        id: 'snh-title', type: 'title', label: '标题', content: 'NORDIC SILENCE',
        style: { ...DEFAULT_TEXT_STYLES.titleLarge, fontSize: 28, color: '#243b53', letterSpacing: 3 },
      },
      {
        id: 'snh-sub', type: 'subtitle', label: '注脚', content: 'HELSINKI ARCHITECTURAL SERIES',
        style: { ...DEFAULT_TEXT_STYLES.subtitle, fontSize: 9, color: '#627d98' },
      },
    ],
  },
  {
    id: 'quad-4-bauhaus-grid',
    name: '包豪斯现代几何四图',
    nameEn: 'Bauhaus Geometric Quad',
    category: 'QUAD_4',
    photoCount: 4,
    description: '高对比度红黄蓝/黑白极具构成感的包豪斯网格分割，前卫时尚',
    previewClass: 'bg-zinc-200 border-zinc-400',
    bgColor: '#e8e8e6',
    layoutType: 'quad-bauhaus-grid',
    defaultPhotos: [
      { url: 'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&w=800&q=80', scale: 1, offsetX: 0, offsetY: 0, filter: 'bw', fit: 'cover', border: false },
      { url: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=800&q=80', scale: 1, offsetX: 0, offsetY: 0, filter: 'normal', fit: 'cover', border: false },
      { url: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=800&q=80', scale: 1, offsetX: 0, offsetY: 0, filter: 'bw', fit: 'cover', border: false },
      { url: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=80', scale: 1, offsetX: 0, offsetY: 0, filter: 'normal', fit: 'cover', border: false },
    ],
    defaultTexts: [
      {
        id: 'qbg-title', type: 'title', label: '包豪斯标题', content: 'BAUHAUS 100',
        style: { ...DEFAULT_TEXT_STYLES.titleBrutalist, fontSize: 32, letterSpacing: -1 },
      },
      {
        id: 'qbg-sub', type: 'subtitle', label: '设计标语', content: 'FORM FOLLOWS FUNCTION // DESSAU',
        style: { ...DEFAULT_TEXT_STYLES.subtitle, fontSize: 9 },
      },
    ],
  },

  // ================= 9. 更多精美文字模板 (MORE TEXT TEMPLATES) =================
  {
    id: 'text-only-manifesto-dark',
    name: '暗夜沉浸独立宣言专页',
    nameEn: 'Midnight Editorial Manifesto',
    category: 'TEXT_ONLY',
    photoCount: 0,
    description: '纯黑背景，配以大号 Bodoni 衬线大标题与极其精细的冷光居中文本',
    previewClass: 'bg-zinc-950 border-zinc-700',
    bgColor: '#0d0d0d',
    layoutType: 'text-manifesto-dark',
    defaultPhotos: [],
    defaultTexts: [
      {
        id: 'tmd-title', type: 'title', label: '暗夜标题', content: 'THE SILENT REBELLION',
        style: { ...DEFAULT_TEXT_STYLES.titleSerif, fontFamily: 'Bodoni Moda', fontSize: 36, color: '#ffffff', letterSpacing: 4 },
      },
      {
        id: 'tmd-sub', type: 'subtitle', label: '宣言副标', content: 'AN ESSAY ON LIGHT, SHADOW AND THE PASSAGE OF TIME',
        style: { ...DEFAULT_TEXT_STYLES.subtitle, fontSize: 10, color: '#aaaaaa', letterSpacing: 3 },
      },
      {
        id: 'tmd-body', type: 'paragraph', label: '正文独白', content: 'We don\'t capture images to remember how things looked, but to recall how it felt when the world stood still for a singular frame.',
        style: { ...DEFAULT_TEXT_STYLES.paragraph, fontSize: 13, color: '#dddddd', textAlign: 'center', lineHeight: 2.0 },
      },
      {
        id: 'tmd-tag', type: 'brandTag', label: '印记落款', content: 'M-STUDIO EDITORIAL // ISSUE 2026',
        style: { ...DEFAULT_TEXT_STYLES.caption, fontSize: 8, color: '#666666', letterSpacing: 3 },
      },
    ],
  },
  {
    id: 'text-only-interview-qa',
    name: '人物深度访谈 Q&A 专版',
    nameEn: 'In-Depth Dialogue & Q&A Layout',
    category: 'TEXT_ONLY',
    photoCount: 0,
    description: '典雅提问与回答对齐设计，适合人物采访、艺术问答与观点对撞',
    previewClass: 'bg-[#faf9f6] border-stone-300',
    bgColor: '#faf9f6',
    layoutType: 'text-interview-qa',
    defaultPhotos: [],
    defaultTexts: [
      {
        id: 'tiq-title', type: 'title', label: '访谈标题', content: 'DIALOGUE: ART & MEMORY',
        style: { ...DEFAULT_TEXT_STYLES.titleLarge, fontFamily: 'Plus Jakarta Sans', fontSize: 24, letterSpacing: 2 },
      },
      {
        id: 'tiq-q1', type: 'subtitle', label: '提问一', content: 'Q: 为什么选择胶片而非数码？',
        style: { ...DEFAULT_TEXT_STYLES.titleSerif, fontSize: 14, fontWeight: '600', color: '#111111' },
      },
      {
        id: 'tiq-a1', type: 'paragraph', label: '回答一', content: 'A: 胶片的物理化学沉淀带来不可预知的小瑕疵，那才是温度的凝结。',
        style: { ...DEFAULT_TEXT_STYLES.paragraph, fontSize: 12, color: '#444444', lineHeight: 1.8 },
      },
      {
        id: 'tiq-q2', type: 'subtitle', label: '提问二', content: 'Q: 最打动你的一瞬间是什么？',
        style: { ...DEFAULT_TEXT_STYLES.titleSerif, fontSize: 14, fontWeight: '600', color: '#111111' },
      },
      {
        id: 'tiq-a2', type: 'paragraph', label: '回答二', content: 'A: 夕阳从老建筑缝隙倾泻而下的三秒钟，光线像是液态的金子。',
        style: { ...DEFAULT_TEXT_STYLES.paragraph, fontSize: 12, color: '#444444', lineHeight: 1.8 },
      },
    ],
  },
  {
    id: 'text-only-quote-minimal',
    name: '巨幅高尚金句卡片',
    nameEn: 'Minimalist High-Fashion Quote',
    category: 'TEXT_ONLY',
    photoCount: 0,
    description: '巨大的法式手写与大号英文引号，展现名言与设计哲学的空灵美感',
    previewClass: 'bg-[#f5f3ef] border-stone-300',
    bgColor: '#f5f3ef',
    layoutType: 'text-quote-minimal',
    defaultPhotos: [],
    defaultTexts: [
      {
        id: 'tqm-mark', type: 'issueNo', label: '引言符号', content: '“',
        style: { ...DEFAULT_TEXT_STYLES.titleSerif, fontFamily: 'Playfair Display', fontSize: 72, color: '#cccccc' },
      },
      {
        id: 'tqm-quote', type: 'poem', label: '金句文本', content: 'Simplicity is about subtracting the obvious and adding the meaningful.',
        style: { ...DEFAULT_TEXT_STYLES.poem, fontFamily: 'Cormorant Garamond', fontSize: 22, fontStyle: 'italic', textAlign: 'center', color: '#1a1a1a' },
      },
      {
        id: 'tqm-author', type: 'author', label: '名言作者', content: '— JOHN MAEDA, THE LAWS OF SIMPLICITY',
        style: { ...DEFAULT_TEXT_STYLES.subtitle, fontSize: 9, letterSpacing: 3, color: '#777777', textAlign: 'center' },
      },
    ],
  },
  {
    id: 'text-only-magazine-index',
    name: '杂志双栏目录与卷首语',
    nameEn: 'Editorial Table of Contents',
    category: 'TEXT_ONLY',
    photoCount: 0,
    description: '经典的杂志双栏导读排版，包含清晰的页码索引与卷首主编致辞',
    previewClass: 'bg-white border-zinc-300',
    bgColor: '#ffffff',
    layoutType: 'text-magazine-index',
    defaultPhotos: [],
    defaultTexts: [
      {
        id: 'tmi-header', type: 'brandTag', label: '顶栏标注', content: 'VOL. 26 // CONTENTS & EDITORIAL',
        style: { ...DEFAULT_TEXT_STYLES.subtitle, fontSize: 9, letterSpacing: 3 },
      },
      {
        id: 'tmi-title', type: 'title', label: '目录大标题', content: 'CONTENTS',
        style: { ...DEFAULT_TEXT_STYLES.titleBrutalist, fontFamily: 'Bebas Neue', fontSize: 44, letterSpacing: 4 },
      },
      {
        id: 'tmi-col1', type: 'paragraph', label: '左栏索引', content: '04. THE HORIZON BEYOND\n08. KYOTO SILENCE\n14. MONOCHROME STREETS\n22. URBAN CHRONICLES',
        style: { ...DEFAULT_TEXT_STYLES.paragraph, fontFamily: 'Courier Prime', fontSize: 11, lineHeight: 2.2, color: '#222222' },
      },
      {
        id: 'tmi-col2', type: 'paragraph', label: '右栏卷首语', content: 'WELCOME TO THIS ISSUE.\nEach story in this edition represents an exploration into form, contrast, and raw emotion.',
        style: { ...DEFAULT_TEXT_STYLES.paragraph, fontSize: 11, lineHeight: 1.8, color: '#555555' },
      },
    ],
  },
];


