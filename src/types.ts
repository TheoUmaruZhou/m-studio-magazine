export type TemplateCategory = 
  | 'COVER'       // 封面
  | 'SINGLE_1'    // 1图特写
  | 'DOUBLE_2'    // 2图对比/并排
  | 'TRIPLE_3'    // 3图电影感
  | 'QUAD_4'      // 4图网格
  | 'MULTI_5PLUS' // 5+图拼贴/胶卷
  | 'TEXT_ONLY';  // 纯文/序言

export type FontFamily = 
  | 'LXGW WenKai'
  | 'Zhi Mang Xing'
  | 'Lora'
  | 'Montserrat'
  | 'Playfair Display'
  | 'Cormorant Garamond'
  | 'Bodoni Moda'
  | 'Syne'
  | 'Bebas Neue'
  | 'Oswald'
  | 'Cinzel'
  | 'Great Vibes'
  | 'Ma Shan Zheng'
  | 'Noto Serif SC'
  | 'Noto Sans SC'
  | 'Plus Jakarta Sans'
  | 'Courier Prime'
  | 'monospace';

export interface TextStyle {
  fontFamily: FontFamily;
  fontSize: number; // in pt or rem base scale
  fontWeight: '300' | '400' | '500' | '600' | '700' | '800';
  color: string;
  letterSpacing: number; // in px or em
  lineHeight: number;
  textAlign: 'left' | 'center' | 'right' | 'justify';
  textTransform?: 'uppercase' | 'lowercase' | 'capitalize' | 'none';
  writingMode?: 'horizontal-tb' | 'vertical-rl';
  fontStyle?: 'normal' | 'italic';
  // 高级文字效果 / Advanced text effects
  textShadow?: {
    offsetX: number; // px
    offsetY: number; // px
    blur: number; // px
    color: string; // e.g. 'rgba(0,0,0,0.5)'
  };
  textStroke?: {
    width: number; // px
    color: string; // e.g. '#ffffff'
  };
}

export interface TextElement {
  id: string;
  type: 'title' | 'subtitle' | 'caption' | 'paragraph' | 'issueNo' | 'author' | 'brandTag' | 'poem';
  label: string;
  content: string;
  style: TextStyle;
  position?: {
    x?: number; // percentage
    y?: number;
    width?: number;
  };
  offsetX?: number;
  offsetY?: number;
}

export interface PhotoElement {
  id: string;
  url: string;
  caption?: string;
  aspectRatio?: string; // 'auto' | '1/1' | '4/3' ... 或自定义 'W/H' 格式 / or custom 'W/H' format
  fit: 'cover' | 'contain' | 'fill';
  scale: number; // 1 = 100%
  offsetX: number; // percentage offset
  offsetY: number;
  filter: 'normal' | 'bw' | 'vintage' | 'high-contrast' | 'soft-warm' | 'cold-film';
  border: boolean;
  shadow?: boolean;
  cropWidth?: number; // 50 - 100 percentage
  cropHeight?: number; // 50 - 100 percentage
  borderRadius?: number; // 0, 8, 16, 24, 9999
  rotation?: number; // 0, 90, 180, 270
}

export interface PageTemplate {
  id: string;
  name: string;
  nameEn: string;
  category: TemplateCategory;
  photoCount: number;
  description: string;
  previewClass: string;
  bgColor?: string;
  defaultPhotos: Partial<PhotoElement>[];
  defaultTexts: TextElement[];
  layoutType: string;
}

export interface MagazinePage {
  id: string;
  pageNumber: number; // 1, 2, 3...
  templateId: string;
  title: string;
  bgColor: string; // e.g. '#ffffff', '#fcfbf7', '#121212', '#1a221f'
  padding?: number; // custom inner padding in px
  photos: PhotoElement[];
  texts: TextElement[];
  showSpineLine: boolean;
  showPageNumbers: boolean;
  brandHeading?: string;
}

export interface MagazineSpread {
  id: string;
  spreadIndex: number;
  isCover?: boolean;
  leftPage: MagazinePage;
  rightPage?: MagazinePage; // Optional if cover or single page back cover
}

export interface MagazineProject {
  id: string;
  title: string;
  subtitle: string;
  photographer: string;
  issueNo: string;
  date: string;
  spreads: MagazineSpread[];
  themeColor: string;
}

export interface PhotoAsset {
  id: string;
  url: string;
  title: string;
  author?: string;
  tags?: string[];
}
