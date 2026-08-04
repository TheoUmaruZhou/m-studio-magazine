import React from 'react';
import { MagazinePage, PhotoElement, TextElement, FontFamily } from '../types';
import { MAGAZINE_TEMPLATES } from '../data/templates';
import { recommendTemplates } from '../utils/aiRecommender';
import { Layout, Type, Image as ImageIcon, Sliders, Palette, Check, Move, Maximize2, ChevronLeft, ChevronRight, Sparkles, Layers as LayersIcon, ChevronUp, ChevronDown, Trash2, Wand2, RefreshCw } from 'lucide-react';

interface InspectorPanelProps {
  activePage: MagazinePage;
  selectedText: TextElement | null;
  selectedPhoto: { element: PhotoElement; index: number } | null;
  onUpdateText: (updated: TextElement) => void;
  onUpdatePhoto: (updated: PhotoElement, index: number) => void;
  onUpdatePage: (updated: Partial<MagazinePage>) => void;
  onChangeTemplate: (templateId: string) => void;
  onSelectText?: (txt: TextElement) => void;
  onSelectPhoto?: (photo: PhotoElement, index: number) => void;
  isOpen?: boolean;
  onToggleOpen?: () => void;
  // AI 智能排版上下文 / AI layout recommendation context
  isCover?: boolean;
  spreadIndex?: number;
  totalSpreads?: number;
  pageSide?: 'left' | 'right';
}

const FONTS: { label: string; value: FontFamily }[] = [
  { label: 'Bodoni Moda (顶级时尚杂志衬线)', value: 'Bodoni Moda' },
  { label: 'Cormorant Garamond (宫廷优雅衬线)', value: 'Cormorant Garamond' },
  { label: 'Plus Jakarta Sans (极简现代黑体)', value: 'Plus Jakarta Sans' },
  { label: 'Noto Serif SC (思源宋体 - 典雅沉稳)', value: 'Noto Serif SC' },
  { label: 'Playfair Display (经典时尚排版)', value: 'Playfair Display' },
  { label: 'Montserrat (现代几何优雅)', value: 'Montserrat' },
  { label: 'Noto Sans SC (思源黑体 - 简约清晰)', value: 'Noto Sans SC' },
  { label: 'LXGW WenKai (霞鹜文楷 - 人文温润)', value: 'LXGW WenKai' },
  { label: 'Lora (美式人文衬线)', value: 'Lora' },
  { label: 'Cinzel (古典石刻铭文)', value: 'Cinzel' },
  { label: 'Syne (先锋设计黑体)', value: 'Syne' },
  { label: 'Courier Prime (复古打字机)', value: 'Courier Prime' },
  { label: 'Bebas Neue (极窄复古海报)', value: 'Bebas Neue' },
  { label: 'Oswald (纵向紧凑黑体)', value: 'Oswald' },
  { label: 'Great Vibes (英文手写花体)', value: 'Great Vibes' },
  { label: 'Zhi Mang Xing (织芒星草书)', value: 'Zhi Mang Xing' },
  { label: 'Ma Shan Zheng (马善政毛笔)', value: 'Ma Shan Zheng' },
  { label: 'Monospace (等宽黑体)', value: 'monospace' },
];

const BG_PRESETS = [
  { label: '纯白干净', value: '#ffffff' },
  { label: '象牙暖白', value: '#fcfbf7' },
  { label: '复古暖沙', value: '#eae8e4' },
  { label: '深沉极黑', value: '#111111' },
  { label: '暗绿石墨', value: '#1a221f' },
];

export const InspectorPanel: React.FC<InspectorPanelProps> = ({
  activePage,
  selectedText,
  selectedPhoto,
  onUpdateText,
  onUpdatePhoto,
  onUpdatePage,
  onChangeTemplate,
  onSelectText,
  onSelectPhoto,
  isOpen = true,
  onToggleOpen,
  isCover = false,
  spreadIndex = 0,
  totalSpreads = 1,
  pageSide = 'left',
}) => {
  const [activeTab, setActiveTab] = React.useState<'template' | 'text' | 'photo' | 'page' | 'layers'>('template');
  const [templateFilter, setTemplateFilter] = React.useState<string>('ALL');

  // AI 智能推荐刷新种子 / AI recommendation refresh seed
  // 通过改变 seed 触发重新计算，实现"换一批"功能
  // Changing the seed triggers recalculation for "refresh" functionality
  const [aiSeed, setAiSeed] = React.useState<number>(0);
  const aiRecommendations = React.useMemo(() => {
    // 依赖 aiSeed 仅用于触发重算 / aiSeed dependency only triggers recalculation
    void aiSeed;
    return recommendTemplates(
      { page: activePage, isCover, spreadIndex, totalSpreads, pageSide: pageSide as 'left' | 'right' },
      4
    );
  }, [activePage, activePage.templateId, activePage.photos, isCover, spreadIndex, totalSpreads, pageSide, aiSeed]);

  React.useEffect(() => {
    if (selectedText) {
      setActiveTab('text');
    }
  }, [selectedText?.id]);

  React.useEffect(() => {
    if (selectedPhoto) {
      setActiveTab('photo');
    }
  }, [selectedPhoto?.element.id, selectedPhoto?.index]);

  // 折叠状态渲染 - 必须在所有Hooks之后 / Collapsed render - must be after all hooks
  const filteredTemplates = MAGAZINE_TEMPLATES.filter((t) => {
    if (templateFilter === 'ALL') return true;
    if (templateFilter === 'COVER') return t.category === 'COVER';
    if (templateFilter === 'SPREAD') return t.id.startsWith('cross-spread');
    if (templateFilter === '1') return t.photoCount === 1 && t.category !== 'COVER' && !t.id.startsWith('cross-spread');
    if (templateFilter === '2') return t.photoCount === 2 && t.category !== 'COVER' && !t.id.startsWith('cross-spread');
    if (templateFilter === '3') return t.photoCount === 3 && t.category !== 'COVER';
    if (templateFilter === '4') return t.photoCount === 4 && t.category !== 'COVER';
    if (templateFilter === '5+') return t.photoCount >= 5 && t.category !== 'COVER';
    if (templateFilter === 'TEXT') return t.category === 'TEXT_ONLY' || t.photoCount === 0;
    return true;
  });

  return (
    <div className={`h-full bg-white dark:bg-neutral-900 border-l border-[#E0E0DB] dark:border-neutral-700 select-none overflow-hidden shrink-0 relative panel-transition ${isOpen ? 'w-88 md:w-96' : 'w-11'}`}>
      {/* 折叠态指示器 / Collapsed indicator */}
      <div
        onClick={onToggleOpen}
        className={`absolute inset-0 z-30 flex flex-col items-center justify-between py-6 text-xs font-mono uppercase tracking-widest text-[#555] dark:text-neutral-400 hover:text-black dark:hover:text-white hover:bg-[#F9F9F8] dark:hover:bg-neutral-800 cursor-pointer panel-content-fade ${isOpen ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}
        title="展开属性面板"
      >
        <div className="flex flex-col items-center gap-3">
          {activeTab === 'template' && <Layout className="w-4 h-4 text-black dark:text-white" />}
          {activeTab === 'text' && <Type className="w-4 h-4 text-black dark:text-white" />}
          {activeTab === 'photo' && <ImageIcon className="w-4 h-4 text-black dark:text-white" />}
          {activeTab === 'page' && <Sliders className="w-4 h-4 text-black dark:text-white" />}
          <span className="[writing-mode:vertical-rl] text-[11px] font-bold tracking-widest mt-2 text-[#1A1A1A] dark:text-neutral-100">
            属性 INSPECTOR
          </span>
        </div>
        <ChevronLeft className="w-4 h-4" />
      </div>

      {/* 展开态内容 / Expanded content */}
      <div className={`h-full flex flex-col justify-between text-[#1A1A1A] dark:text-neutral-100 panel-content-fade ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
      {/* Top Header Tabs */}
      <div className="flex border-b border-[#E0E0DB] dark:border-neutral-700 bg-[#F7F7F5] dark:bg-neutral-800 p-1 items-stretch transition-colors duration-300">
        {/* 收起按钮 - 版式模板左侧 / Collapse button - left of template tab */}
        {onToggleOpen && (
          <button
            onClick={onToggleOpen}
            className="mr-0.5 my-auto w-7 h-7 bg-neutral-900 text-amber-300 border border-amber-500/50 rounded-full flex items-center justify-center hover:bg-neutral-800 hover:scale-110 hover:shadow-md active:scale-95 transition-all shrink-0"
            title="收起属性面板"
          >
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        )}

        <button
          onClick={() => setActiveTab('template')}
          className={`flex-1 py-2 flex flex-col items-center gap-1 text-[10px] font-mono tracking-widest uppercase transition-all ${
            activeTab === 'template' ? 'bg-white dark:bg-neutral-900 text-black dark:text-white border border-[#E0E0DB] dark:border-neutral-700 font-bold shadow-2xs' : 'text-[#666] dark:text-neutral-400 hover:text-black dark:hover:text-white'
          }`}
        >
          <Layout className="w-3.5 h-3.5" />
          <span>版式模板</span>
        </button>

        <button
          onClick={() => setActiveTab('text')}
          className={`flex-1 py-2 flex flex-col items-center gap-1 text-[10px] font-mono tracking-widest uppercase transition-all ${
            activeTab === 'text' ? 'bg-white dark:bg-neutral-900 text-black dark:text-white border border-[#E0E0DB] dark:border-neutral-700 font-bold shadow-2xs' : 'text-[#666] dark:text-neutral-400 hover:text-black dark:hover:text-white'
          }`}
        >
          <Type className="w-3.5 h-3.5" />
          <span>文字属性</span>
        </button>

        <button
          onClick={() => setActiveTab('photo')}
          className={`flex-1 py-2 flex flex-col items-center gap-1 text-[10px] font-mono tracking-widest uppercase transition-all ${
            activeTab === 'photo' ? 'bg-white dark:bg-neutral-900 text-black dark:text-white border border-[#E0E0DB] dark:border-neutral-700 font-bold shadow-2xs' : 'text-[#666] dark:text-neutral-400 hover:text-black dark:hover:text-white'
          }`}
        >
          <ImageIcon className="w-3.5 h-3.5" />
          <span>暗房滤镜</span>
        </button>

        <button
          onClick={() => setActiveTab('page')}
          className={`flex-1 py-2 flex flex-col items-center gap-1 text-[10px] font-mono tracking-widest uppercase transition-all ${
            activeTab === 'page' ? 'bg-white dark:bg-neutral-900 text-black dark:text-white border border-[#E0E0DB] dark:border-neutral-700 font-bold shadow-2xs' : 'text-[#666] dark:text-neutral-400 hover:text-black dark:hover:text-white'
          }`}
        >
          <Palette className="w-3.5 h-3.5" />
          <span>页面属性</span>
        </button>

        <button
          onClick={() => setActiveTab('layers')}
          className={`flex-1 py-2 flex flex-col items-center gap-1 text-[10px] font-mono tracking-widest uppercase transition-all ${
            activeTab === 'layers' ? 'bg-white dark:bg-neutral-900 text-black dark:text-white border border-[#E0E0DB] dark:border-neutral-700 font-bold shadow-2xs' : 'text-[#666] dark:text-neutral-400 hover:text-black dark:hover:text-white'
          }`}
        >
          <LayersIcon className="w-3.5 h-3.5" />
          <span>图层</span>
        </button>
      </div>

      {/* Tab Body */}
      <div className="flex-1 overflow-y-auto p-5 space-y-5">
        {/* TAB 1: TEMPLATES */}
        {activeTab === 'template' && (
          <div className="space-y-4">
            {/* AI 智能排版推荐 / AI Smart Layout Recommendations */}
            {aiRecommendations.length > 0 && (
              <div className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1.5 text-[10px] font-mono uppercase tracking-widest text-amber-700 dark:text-amber-400">
                    <Wand2 className="w-3.5 h-3.5" />
                    AI 智能推荐
                  </span>
                  <button
                    onClick={() => setAiSeed((s) => s + 1)}
                    className="flex items-center gap-1 text-[9px] font-mono uppercase tracking-wider text-[#888] dark:text-neutral-500 hover:text-black dark:hover:text-white transition-colors"
                    title="换一批推荐 / Refresh recommendations"
                  >
                    <RefreshCw className="w-3 h-3" />
                    换一批
                  </button>
                </div>

                <div className="space-y-2">
                  {aiRecommendations.map((rec) => {
                    const isSelected = activePage.templateId === rec.template.id;
                    return (
                      <div
                        key={rec.template.id}
                        onClick={() => onChangeTemplate(rec.template.id)}
                        className={`btn-press relative p-3 border cursor-pointer group overflow-hidden transition-all ${
                          isSelected
                            ? 'bg-amber-50 dark:bg-amber-900/20 border-amber-500 ring-1 ring-amber-400'
                            : 'bg-gradient-to-br from-amber-50/60 to-white dark:from-amber-900/10 dark:to-neutral-900 border-amber-200/60 dark:border-amber-700/40 hover:border-amber-400 dark:hover:border-amber-500 hover:shadow-md'
                        }`}
                      >
                        {/* AI 角标 / AI badge */}
                        <div className="absolute top-0 right-0 bg-amber-400 text-white text-[8px] font-mono font-bold uppercase tracking-wider px-1.5 py-0.5 leading-none">
                          AI
                        </div>
                        <div className="flex justify-between items-start mb-1 pr-6">
                          <span className="font-semibold text-xs text-[#1A1A1A] dark:text-neutral-100 group-hover:text-black dark:group-hover:text-white transition-colors font-serif">
                            {rec.template.name}
                          </span>
                          <span className="text-[9px] font-mono px-1.5 py-0.5 border border-amber-300/60 dark:border-amber-600/40 bg-white/60 dark:bg-neutral-800/60 text-amber-700 dark:text-amber-400 uppercase shrink-0">
                            {rec.template.photoCount} 图
                          </span>
                        </div>
                        <p className="text-[11px] text-[#666] dark:text-neutral-400 leading-relaxed mb-1.5">{rec.template.description}</p>
                        {/* 推荐理由 / Recommendation reasons */}
                        {rec.reasons.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-1.5">
                            {rec.reasons.map((reason, i) => (
                              <span
                                key={i}
                                className="inline-flex items-center text-[9px] font-mono px-1.5 py-0.5 bg-amber-100/70 dark:bg-amber-900/30 text-amber-800 dark:text-amber-300 border border-amber-200/50 dark:border-amber-700/30"
                              >
                                {reason}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* 分隔线 / Divider */}
            <div className="border-t border-[#E0E0DB] dark:border-neutral-700 pt-4 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono text-[#888] dark:text-neutral-500 uppercase tracking-widest">页面模板库</span>
              </div>

              {/* Template Category Filters */}
              <div className="flex flex-wrap gap-1.5">
                {['ALL', 'COVER', 'SPREAD', '1', '2', '3', '4', '5+', 'TEXT'].map((f) => (
                  <button
                    key={f}
                    onClick={() => setTemplateFilter(f)}
                    className={`px-2 py-1 text-[10px] font-mono transition-all border uppercase tracking-wider ${
                      templateFilter === f ? 'bg-black text-white border-black font-bold' : 'bg-[#F7F7F5] dark:bg-neutral-800 border-[#E0E0DB] dark:border-neutral-700 text-[#666] dark:text-neutral-400 hover:text-black dark:hover:text-white hover:border-black dark:hover:border-white'
                    }`}
                  >
                    {f === 'ALL' ? '全部' : f === 'COVER' ? '封面' : f === 'SPREAD' ? '跨页' : f === 'TEXT' ? '纯文' : `${f}图`}
                  </button>
                ))}
              </div>

              {/* Template Grid */}
              <div className="space-y-2.5 pt-1">
                {filteredTemplates.map((t) => {
                  const isSelected = activePage.templateId === t.id;
                  return (
                    <div
                    key={t.id}
                    onClick={() => onChangeTemplate(t.id)}
                    className={`btn-press p-3 border cursor-pointer group ${
                      isSelected ? 'bg-[#F0F0EE] dark:bg-neutral-800 border-black ring-1 ring-black animate-spring' : 'bg-white dark:bg-neutral-900 border-[#E0E0DB] dark:border-neutral-700 hover:border-black dark:hover:border-white hover:shadow-md'
                    }`}
                  >
                    <div className="flex justify-between items-start mb-1">
                      <span className="font-semibold text-xs text-[#1A1A1A] dark:text-neutral-100 group-hover:text-black dark:group-hover:text-white transition-colors font-serif">
                        {t.name}
                      </span>
                      <span className="text-[9px] font-mono px-1.5 py-0.5 border border-[#E0E0DB] dark:border-neutral-700 bg-[#F7F7F5] dark:bg-neutral-800 text-[#666] dark:text-neutral-400 uppercase">
                        {t.photoCount} 图
                      </span>
                    </div>
                    <p className="text-[11px] text-[#666] dark:text-neutral-400 leading-relaxed">{t.description}</p>
                  </div>
                );
              })}
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: TEXT & TYPOGRAPHY */}
        {activeTab === 'text' && (
          <div className="space-y-4">
            {!selectedText ? (
              <div className="p-4 bg-[#F7F7F5] dark:bg-neutral-800 border border-[#E0E0DB] dark:border-neutral-700 text-center text-xs text-[#666] dark:text-neutral-400 space-y-2">
                <Type className="w-6 h-6 text-[#999] mx-auto" />
                <p>请点击页面上的任意文字元素以启用详细文字属性编辑</p>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-mono text-[#666] dark:text-neutral-400 uppercase tracking-widest">文本内容 ({selectedText.label})</label>
                  <textarea
                    rows={3}
                    value={selectedText.content}
                    onChange={(e) =>
                      onUpdateText({
                        ...selectedText,
                        content: e.target.value,
                      })
                    }
                    className="w-full bg-white dark:bg-neutral-900 border border-[#E0E0DB] dark:border-neutral-700 p-2 text-xs text-[#1A1A1A] dark:text-neutral-100 focus:outline-none focus:border-black font-sans"
                  />
                </div>

                {/* Font Family Selector */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-mono text-[#666] dark:text-neutral-400 uppercase tracking-widest">字体样式</label>
                  <select
                    value={selectedText.style.fontFamily}
                    onChange={(e) =>
                      onUpdateText({
                        ...selectedText,
                        style: {
                          ...selectedText.style,
                          fontFamily: e.target.value as FontFamily,
                        },
                      })
                    }
                    className="w-full bg-white dark:bg-neutral-900 border border-[#E0E0DB] dark:border-neutral-700 p-2 text-xs text-[#1A1A1A] dark:text-neutral-100 focus:outline-none focus:border-black appearance-none"
                  >
                    {FONTS.map((f) => (
                      <option key={f.value} value={f.value}>
                        {f.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Font Size & Weight */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-[10px] font-mono text-[#666] dark:text-neutral-400">大小 ({selectedText.style.fontSize}px)</label>
                    <input
                      type="range"
                      min={8}
                      max={72}
                      value={selectedText.style.fontSize}
                      onChange={(e) =>
                        onUpdateText({
                          ...selectedText,
                          style: { ...selectedText.style, fontSize: Number(e.target.value) },
                        })
                      }
                      className="w-full accent-black"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-mono text-[#666] dark:text-neutral-400">字重 (Weight)</label>
                    <select
                      value={selectedText.style.fontWeight}
                      onChange={(e) =>
                        onUpdateText({
                          ...selectedText,
                          style: { ...selectedText.style, fontWeight: e.target.value as any },
                        })
                      }
                      className="w-full bg-white dark:bg-neutral-900 border border-[#E0E0DB] dark:border-neutral-700 p-1.5 text-xs text-[#1A1A1A] dark:text-neutral-100"
                    >
                      <option value="300">Light 300</option>
                      <option value="400">Regular 400</option>
                      <option value="600">Semi-Bold 600</option>
                      <option value="800">Bold 800</option>
                    </select>
                  </div>
                </div>

                {/* Letter Spacing & Line Height */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-[10px] font-mono text-[#666] dark:text-neutral-400">字间距</label>
                    <input
                      type="range"
                      min={-2}
                      max={10}
                      step={0.5}
                      value={selectedText.style.letterSpacing}
                      onChange={(e) =>
                        onUpdateText({
                          ...selectedText,
                          style: { ...selectedText.style, letterSpacing: Number(e.target.value) },
                        })
                      }
                      className="w-full accent-black"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-mono text-[#666] dark:text-neutral-400">行高 ({selectedText.style.lineHeight})</label>
                    <input
                      type="range"
                      min={0.8}
                      max={2.5}
                      step={0.1}
                      value={selectedText.style.lineHeight}
                      onChange={(e) =>
                        onUpdateText({
                          ...selectedText,
                          style: { ...selectedText.style, lineHeight: Number(e.target.value) },
                        })
                      }
                      className="w-full accent-black"
                    />
                  </div>
                </div>

                {/* Color Selector */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-mono text-[#666] dark:text-neutral-400 uppercase tracking-widest">文字颜色</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={selectedText.style.color}
                      onChange={(e) =>
                        onUpdateText({
                          ...selectedText,
                          style: { ...selectedText.style, color: e.target.value },
                        })
                      }
                      className="w-8 h-8 border border-[#E0E0DB] dark:border-neutral-700 bg-transparent cursor-pointer"
                    />
                    <input
                      type="text"
                      value={selectedText.style.color}
                      onChange={(e) =>
                        onUpdateText({
                          ...selectedText,
                          style: { ...selectedText.style, color: e.target.value },
                        })
                      }
                      className="flex-1 bg-white dark:bg-neutral-900 border border-[#E0E0DB] dark:border-neutral-700 p-1.5 text-xs font-mono text-[#1A1A1A] dark:text-neutral-100"
                    />
                  </div>
                </div>

                {/* 高级文字效果：阴影与描边 / Advanced Text Effects: Shadow & Stroke */}
                <div className="space-y-3 bg-[#FAF9F6] dark:bg-neutral-900 p-3 border border-[#E0E0DB] dark:border-neutral-700 rounded">
                  <label className="text-[10px] font-mono text-[#444] dark:text-neutral-300 font-bold uppercase tracking-widest flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                    高级文字效果 (Effects)
                  </label>

                  {/* 阴影控制 / Shadow controls */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono text-[#666] dark:text-neutral-400">文字阴影 (Shadow)</span>
                      <button
                        type="button"
                        onClick={() =>
                          onUpdateText({
                            ...selectedText,
                            style: {
                              ...selectedText.style,
                              textShadow: selectedText.style.textShadow
                                ? undefined
                                : { offsetX: 2, offsetY: 2, blur: 4, color: 'rgba(0,0,0,0.5)' },
                            },
                          })
                        }
                        className={`px-2 py-0.5 text-[9px] font-mono uppercase tracking-wider border transition-all ${
                          selectedText.style.textShadow
                            ? 'bg-black text-white border-black'
                            : 'border-[#D0D0CB] dark:border-neutral-600 text-[#666] dark:text-neutral-400 hover:border-black dark:hover:border-white'
                        }`}
                      >
                        {selectedText.style.textShadow ? '开启' : '关闭'}
                      </button>
                    </div>
                    {selectedText.style.textShadow && (
                      <div className="space-y-2 pl-2 border-l-2 border-amber-400/40">
                        <div className="grid grid-cols-3 gap-2">
                          <div className="space-y-0.5">
                            <label className="text-[9px] font-mono text-[#888] dark:text-neutral-500">X 偏移</label>
                            <input
                              type="range"
                              min={-20}
                              max={20}
                              step={1}
                              value={selectedText.style.textShadow.offsetX}
                              onChange={(e) =>
                                onUpdateText({
                                  ...selectedText,
                                  style: {
                                    ...selectedText.style,
                                    textShadow: { ...selectedText.style.textShadow!, offsetX: Number(e.target.value) },
                                  },
                                })
                              }
                              className="w-full accent-black"
                            />
                          </div>
                          <div className="space-y-0.5">
                            <label className="text-[9px] font-mono text-[#888] dark:text-neutral-500">Y 偏移</label>
                            <input
                              type="range"
                              min={-20}
                              max={20}
                              step={1}
                              value={selectedText.style.textShadow.offsetY}
                              onChange={(e) =>
                                onUpdateText({
                                  ...selectedText,
                                  style: {
                                    ...selectedText.style,
                                    textShadow: { ...selectedText.style.textShadow!, offsetY: Number(e.target.value) },
                                  },
                                })
                              }
                              className="w-full accent-black"
                            />
                          </div>
                          <div className="space-y-0.5">
                            <label className="text-[9px] font-mono text-[#888] dark:text-neutral-500">模糊</label>
                            <input
                              type="range"
                              min={0}
                              max={30}
                              step={1}
                              value={selectedText.style.textShadow.blur}
                              onChange={(e) =>
                                onUpdateText({
                                  ...selectedText,
                                  style: {
                                    ...selectedText.style,
                                    textShadow: { ...selectedText.style.textShadow!, blur: Number(e.target.value) },
                                  },
                                })
                              }
                              className="w-full accent-black"
                            />
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <input
                            type="color"
                            value={selectedText.style.textShadow.color.startsWith('rgba') ? '#000000' : selectedText.style.textShadow.color}
                            onChange={(e) =>
                              onUpdateText({
                                ...selectedText,
                                style: {
                                  ...selectedText.style,
                                  textShadow: { ...selectedText.style.textShadow!, color: e.target.value },
                                },
                              })
                            }
                            className="w-7 h-7 border border-[#E0E0DB] dark:border-neutral-700 bg-transparent cursor-pointer"
                          />
                          <input
                            type="text"
                            value={selectedText.style.textShadow.color}
                            onChange={(e) =>
                              onUpdateText({
                                ...selectedText,
                                style: {
                                  ...selectedText.style,
                                  textShadow: { ...selectedText.style.textShadow!, color: e.target.value },
                                },
                              })
                            }
                            className="flex-1 bg-white dark:bg-neutral-900 border border-[#E0E0DB] dark:border-neutral-700 p-1 text-[10px] font-mono text-[#1A1A1A] dark:text-neutral-100"
                          />
                        </div>
                      </div>
                    )}
                  </div>

                  {/* 描边控制 / Stroke controls */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono text-[#666] dark:text-neutral-400">文字描边 (Stroke)</span>
                      <button
                        type="button"
                        onClick={() =>
                          onUpdateText({
                            ...selectedText,
                            style: {
                              ...selectedText.style,
                              textStroke: selectedText.style.textStroke
                                ? undefined
                                : { width: 1, color: '#ffffff' },
                            },
                          })
                        }
                        className={`px-2 py-0.5 text-[9px] font-mono uppercase tracking-wider border transition-all ${
                          selectedText.style.textStroke
                            ? 'bg-black text-white border-black'
                            : 'border-[#D0D0CB] dark:border-neutral-600 text-[#666] dark:text-neutral-400 hover:border-black dark:hover:border-white'
                        }`}
                      >
                        {selectedText.style.textStroke ? '开启' : '关闭'}
                      </button>
                    </div>
                    {selectedText.style.textStroke && (
                      <div className="space-y-2 pl-2 border-l-2 border-amber-400/40">
                        <div className="space-y-0.5">
                          <div className="flex justify-between text-[9px] font-mono text-[#888] dark:text-neutral-500">
                            <span>描边宽度</span>
                            <span className="font-bold text-black dark:text-white">{selectedText.style.textStroke.width}px</span>
                          </div>
                          <input
                            type="range"
                            min={0.5}
                            max={6}
                            step={0.5}
                            value={selectedText.style.textStroke.width}
                            onChange={(e) =>
                              onUpdateText({
                                ...selectedText,
                                style: {
                                  ...selectedText.style,
                                  textStroke: { ...selectedText.style.textStroke!, width: Number(e.target.value) },
                                },
                              })
                            }
                            className="w-full accent-black"
                          />
                        </div>
                        <div className="flex items-center gap-2">
                          <input
                            type="color"
                            value={selectedText.style.textStroke.color}
                            onChange={(e) =>
                              onUpdateText({
                                ...selectedText,
                                style: {
                                  ...selectedText.style,
                                  textStroke: { ...selectedText.style.textStroke!, color: e.target.value },
                                },
                              })
                            }
                            className="w-7 h-7 border border-[#E0E0DB] dark:border-neutral-700 bg-transparent cursor-pointer"
                          />
                          <input
                            type="text"
                            value={selectedText.style.textStroke.color}
                            onChange={(e) =>
                              onUpdateText({
                                ...selectedText,
                                style: {
                                  ...selectedText.style,
                                  textStroke: { ...selectedText.style.textStroke!, color: e.target.value },
                                },
                              })
                            }
                            className="flex-1 bg-white dark:bg-neutral-900 border border-[#E0E0DB] dark:border-neutral-700 p-1 text-[10px] font-mono text-[#1A1A1A] dark:text-neutral-100"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Text Alignments & Writing Mode */}
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() =>
                      onUpdateText({
                        ...selectedText,
                        style: {
                          ...selectedText.style,
                          textTransform: selectedText.style.textTransform === 'uppercase' ? 'none' : 'uppercase',
                        },
                      })
                    }
                    className={`flex-1 py-1.5 border text-xs font-mono uppercase tracking-wider ${
                      selectedText.style.textTransform === 'uppercase' ? 'bg-black text-white border-black font-medium' : 'border-[#E0E0DB] dark:border-neutral-700 text-[#666] dark:text-neutral-400 hover:border-black dark:hover:border-white'
                    }`}
                  >
                    AA 全大写
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      onUpdateText({
                        ...selectedText,
                        style: {
                          ...selectedText.style,
                          writingMode: selectedText.style.writingMode === 'vertical-rl' ? 'horizontal-tb' : 'vertical-rl',
                        },
                      })
                    }
                    className={`flex-1 py-1.5 border text-xs font-mono uppercase tracking-wider ${
                      selectedText.style.writingMode === 'vertical-rl' ? 'bg-black text-white border-black font-medium' : 'border-[#E0E0DB] dark:border-neutral-700 text-[#666] dark:text-neutral-400 hover:border-black dark:hover:border-white'
                    }`}
                  >
                    竖向文本 RL
                  </button>
                </div>

                {/* Horizontal & Vertical Position Offset */}
                <div className="space-y-3 bg-[#FAF9F6] dark:bg-neutral-900 p-3 border border-[#E0E0DB] dark:border-neutral-700 rounded">
                  <div className="flex items-center justify-between">
                    <label className="text-[10px] font-mono text-[#444] dark:text-neutral-300 font-bold uppercase tracking-widest flex items-center gap-1.5">
                      <Move className="w-3.5 h-3.5 text-amber-600" />
                      文本位置平移 (Text Offset)
                    </label>
                    <button
                      type="button"
                      onClick={() =>
                        onUpdateText({
                          ...selectedText,
                          offsetX: 0,
                          offsetY: 0,
                        })
                      }
                      className="text-[9px] font-mono text-amber-700 hover:underline font-semibold"
                    >
                      重置归零
                    </button>
                  </div>

                  <div className="space-y-2.5">
                    {/* Horizontal Offset X */}
                    <div className="space-y-1">
                      <div className="flex justify-between text-[10px] font-mono text-[#666] dark:text-neutral-400">
                        <span>水平移动 (X Offset)</span>
                        <span className="font-bold text-black dark:text-white">
                          {(selectedText.offsetX || 0) > 0 ? `+${selectedText.offsetX}` : selectedText.offsetX || 0}%
                        </span>
                      </div>
                      <input
                        type="range"
                        min={-200}
                        max={200}
                        step={1}
                        value={selectedText.offsetX || 0}
                        onChange={(e) =>
                          onUpdateText({
                            ...selectedText,
                            offsetX: Number(e.target.value),
                          })
                        }
                        className="w-full accent-black"
                      />
                    </div>

                    {/* Vertical Offset Y */}
                    <div className="space-y-1">
                      <div className="flex justify-between text-[10px] font-mono text-[#666] dark:text-neutral-400">
                        <span>垂直移动 (Y Offset)</span>
                        <span className="font-bold text-black dark:text-white">
                          {(selectedText.offsetY || 0) > 0 ? `+${selectedText.offsetY}` : selectedText.offsetY || 0}%
                        </span>
                      </div>
                      <input
                        type="range"
                        min={-200}
                        max={200}
                        step={1}
                        value={selectedText.offsetY || 0}
                        onChange={(e) =>
                          onUpdateText({
                            ...selectedText,
                            offsetY: Number(e.target.value),
                          })
                        }
                        className="w-full accent-black"
                      />
                    </div>
                  </div>

                  {/* Preset Quick Movement Buttons */}
                  <div className="grid grid-cols-4 gap-1 text-[9px] font-mono pt-1">
                    <button
                      type="button"
                      onClick={() =>
                        onUpdateText({
                          ...selectedText,
                          offsetX: (selectedText.offsetX || 0) - 10,
                        })
                      }
                      className="p-1 border border-[#E0E0DB] dark:border-neutral-700 bg-white dark:bg-neutral-900 text-[#555] dark:text-neutral-400 hover:border-black dark:hover:border-white text-center"
                    >
                      ← 左移10
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        onUpdateText({
                          ...selectedText,
                          offsetX: (selectedText.offsetX || 0) + 10,
                        })
                      }
                      className="p-1 border border-[#E0E0DB] dark:border-neutral-700 bg-white dark:bg-neutral-900 text-[#555] dark:text-neutral-400 hover:border-black dark:hover:border-white text-center"
                    >
                      右移10 →
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        onUpdateText({
                          ...selectedText,
                          offsetY: (selectedText.offsetY || 0) - 10,
                        })
                      }
                      className="p-1 border border-[#E0E0DB] dark:border-neutral-700 bg-white dark:bg-neutral-900 text-[#555] dark:text-neutral-400 hover:border-black dark:hover:border-white text-center"
                    >
                      ↑ 上移10
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        onUpdateText({
                          ...selectedText,
                          offsetY: (selectedText.offsetY || 0) + 10,
                        })
                      }
                      className="p-1 border border-[#E0E0DB] dark:border-neutral-700 bg-white dark:bg-neutral-900 text-[#555] dark:text-neutral-400 hover:border-black dark:hover:border-white text-center"
                    >
                      下移10 ↓
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 3: PHOTO & DARKROOM FILTERS */}
        {activeTab === 'photo' && (
          <div className="space-y-4">
            {!selectedPhoto ? (
              <div className="p-4 bg-[#F7F7F5] dark:bg-neutral-800 border border-[#E0E0DB] dark:border-neutral-700 text-center text-xs text-[#666] dark:text-neutral-400 space-y-2">
                <ImageIcon className="w-6 h-6 text-[#999] mx-auto" />
                <p>请点击页面上的任意图片槽位以调整比例、裁切、缩放与暗房调色</p>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center justify-between pb-2 border-b border-[#E0E0DB] dark:border-neutral-700 transition-colors duration-300">
                  <span className="text-xs font-mono text-black dark:text-white font-semibold">已选中图片槽位 #{selectedPhoto.index + 1}</span>
                </div>

                {/* Aspect Ratio Presets */}
                <div className="space-y-2">
                  <label className="text-[10px] font-mono text-[#666] dark:text-neutral-400 uppercase tracking-widest">画幅比例 (Aspect Ratio)</label>
                  <div className="grid grid-cols-4 gap-1.5 text-[10px] font-mono">
                    {[
                      { id: 'auto', label: '默认原样' },
                      { id: '1/1', label: '1:1 方形' },
                      { id: '4/3', label: '4:3 横图' },
                      { id: '3/4', label: '3:4 竖图' },
                      { id: '3/2', label: '3:2 相机' },
                      { id: '2/3', label: '2:3 竖画' },
                      { id: '16/9', label: '16:9 宽屏' },
                      { id: '9/16', label: '9:16 满屏' },
                    ].map((ar) => (
                      <button
                        key={ar.id}
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onUpdatePhoto(
                            { ...selectedPhoto.element, aspectRatio: ar.id as any },
                            selectedPhoto.index
                          );
                        }}
                        className={`p-1.5 border text-center transition-all ${
                          (selectedPhoto.element.aspectRatio || 'auto') === ar.id
                            ? 'bg-amber-500 text-black dark:text-white border-amber-600 font-bold shadow-sm ring-1 ring-amber-400'
                            : 'bg-white dark:bg-neutral-900 text-[#555] dark:text-neutral-400 border-[#E0E0DB] dark:border-neutral-700 hover:border-black dark:hover:border-white'
                        }`}
                      >
                        {ar.label}
                      </button>
                    ))}
                  </div>

                  {/* 自定义宽高比输入 / Custom aspect ratio input */}
                  <div className="flex items-center gap-1.5 pt-1.5 bg-[#FAF9F6] dark:bg-neutral-900 p-2 border border-[#E0E0DB] dark:border-neutral-700 rounded">
                    <span className="text-[9px] font-mono text-[#888] dark:text-neutral-500 uppercase tracking-wider whitespace-nowrap">自定义</span>
                    <input
                      type="number"
                      min={1}
                      max={99}
                      value={(() => {
                        const ar = selectedPhoto.element.aspectRatio || 'auto';
                        if (ar === 'auto' || !ar.includes('/')) return '';
                        return ar.split('/')[0];
                      })()}
                      onChange={(e) => {
                        e.stopPropagation();
                        const w = Math.max(1, Math.min(99, Number(e.target.value) || 1));
                        const current = selectedPhoto.element.aspectRatio || 'auto';
                        const h = current.includes('/') ? current.split('/')[1] : '1';
                        onUpdatePhoto(
                          { ...selectedPhoto.element, aspectRatio: `${w}/${h}` },
                          selectedPhoto.index
                        );
                      }}
                      onClick={(e) => e.stopPropagation()}
                      className="w-12 px-1.5 py-1 text-[11px] font-mono text-center border border-[#E0E0DB] dark:border-neutral-700 bg-white dark:bg-neutral-900 rounded focus:outline-none focus:border-amber-500"
                      placeholder="W"
                    />
                    <span className="text-[11px] font-mono text-[#888] dark:text-neutral-500 font-bold">:</span>
                    <input
                      type="number"
                      min={1}
                      max={99}
                      value={(() => {
                        const ar = selectedPhoto.element.aspectRatio || 'auto';
                        if (ar === 'auto' || !ar.includes('/')) return '';
                        return ar.split('/')[1];
                      })()}
                      onChange={(e) => {
                        e.stopPropagation();
                        const h = Math.max(1, Math.min(99, Number(e.target.value) || 1));
                        const current = selectedPhoto.element.aspectRatio || 'auto';
                        const w = current.includes('/') ? current.split('/')[0] : '1';
                        onUpdatePhoto(
                          { ...selectedPhoto.element, aspectRatio: `${w}/${h}` },
                          selectedPhoto.index
                        );
                      }}
                      onClick={(e) => e.stopPropagation()}
                      className="w-12 px-1.5 py-1 text-[11px] font-mono text-center border border-[#E0E0DB] dark:border-neutral-700 bg-white dark:bg-neutral-900 rounded focus:outline-none focus:border-amber-500"
                      placeholder="H"
                    />
                    <span className="text-[9px] font-mono text-[#aaa] ml-auto">
                      {(() => {
                        const ar = selectedPhoto.element.aspectRatio || 'auto';
                        if (ar === 'auto') return '原样';
                        if (ar.includes('/')) {
                          const [w, h] = ar.split('/').map(Number);
                          return `≈ ${(w / h).toFixed(2)}`;
                        }
                        return ar;
                      })()}
                    </span>
                  </div>
                </div>

                {/* Image Shadow Toggle Button */}
                <div className="space-y-1.5 bg-[#FAF9F6] dark:bg-neutral-900 p-2.5 border border-[#E0E0DB] dark:border-neutral-700 rounded">
                  <div className="flex items-center justify-between">
                    <label className="text-[10px] font-mono text-[#444] dark:text-neutral-300 font-bold uppercase tracking-widest flex items-center gap-1">
                      <span>图片底部/四周阴影 (Image Shadow)</span>
                    </label>
                    <span
                      className={`text-[9px] font-mono font-bold px-1.5 py-0.5 rounded ${
                        selectedPhoto.element.shadow ? 'bg-amber-500 text-black dark:text-white' : 'bg-[#E0E0DB] text-[#666] dark:text-neutral-400'
                      }`}
                    >
                      {selectedPhoto.element.shadow ? '已开启 ON' : '已关闭 OFF'}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onUpdatePhoto(
                        { ...selectedPhoto.element, shadow: !selectedPhoto.element.shadow },
                        selectedPhoto.index
                      );
                    }}
                    className={`w-full py-2 px-3 border text-xs font-mono transition-all flex items-center justify-between ${
                      selectedPhoto.element.shadow
                        ? 'bg-amber-500 text-black dark:text-white border-amber-600 font-bold shadow-sm ring-1 ring-amber-400'
                        : 'bg-white dark:bg-neutral-900 text-[#555] dark:text-neutral-400 border-[#E0E0DB] dark:border-neutral-700 hover:border-black dark:hover:border-white'
                    }`}
                  >
                    <span>{selectedPhoto.element.shadow ? '立体阴影：已开启' : '立体阴影：已关闭'}</span>
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded font-bold uppercase ${
                        selectedPhoto.element.shadow ? 'bg-black text-white' : 'bg-[#E0E0DB] text-[#444] dark:text-neutral-300'
                      }`}
                    >
                      {selectedPhoto.element.shadow ? '点击关闭阴影' : '点击开启阴影'}
                    </span>
                  </button>
                </div>

                {/* Fit Mode */}
                <div className="space-y-2">
                  <label className="text-[10px] font-mono text-[#666] dark:text-neutral-400 uppercase tracking-widest">裁切适配模式 (Fit Mode)</label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { id: 'cover', name: '充满裁切 Cover' },
                      { id: 'contain', name: '完整留白 Contain' },
                      { id: 'fill', name: '拉伸填满 Fill' },
                    ].map((mode) => (
                      <button
                        key={mode.id}
                        onClick={() =>
                          onUpdatePhoto(
                            { ...selectedPhoto.element, fit: mode.id as any },
                            selectedPhoto.index
                          )
                        }
                        className={`p-2 text-[10px] font-mono border text-center transition-all ${
                          (selectedPhoto.element.fit || 'cover') === mode.id
                            ? 'bg-black text-white border-black font-medium'
                            : 'bg-white dark:bg-neutral-900 text-[#666] dark:text-neutral-400 border-[#E0E0DB] dark:border-neutral-700 hover:border-black dark:hover:border-white'
                        }`}
                      >
                        {mode.name}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Crop Box Size (Width % & Height %) */}
                <div className="space-y-2 bg-[#FAF9F6] dark:bg-neutral-900 p-3 border border-[#E0E0DB] dark:border-neutral-700 rounded">
                  <div className="flex items-center justify-between">
                    <label className="text-[10px] font-mono text-[#444] dark:text-neutral-300 font-bold uppercase tracking-widest">
                      裁切框尺寸 (Crop Frame Box)
                    </label>
                    <button
                      onClick={() =>
                        onUpdatePhoto(
                          { ...selectedPhoto.element, cropWidth: 100, cropHeight: 100 },
                          selectedPhoto.index
                        )
                      }
                      className="text-[9px] font-mono text-amber-700 hover:underline"
                    >
                      重置100%
                    </button>
                  </div>

                  <div className="grid grid-cols-2 gap-3 pt-1">
                    <div className="space-y-1">
                      <div className="flex justify-between text-[10px] font-mono text-[#666] dark:text-neutral-400">
                        <span>裁切宽 Width</span>
                        <span className="font-bold text-black dark:text-white">{selectedPhoto.element.cropWidth || 100}%</span>
                      </div>
                      <input
                        type="range"
                        min={30}
                        max={100}
                        step={1}
                        value={selectedPhoto.element.cropWidth || 100}
                        onChange={(e) =>
                          onUpdatePhoto(
                            { ...selectedPhoto.element, cropWidth: Number(e.target.value) },
                            selectedPhoto.index
                          )
                        }
                        className="w-full accent-black"
                      />
                    </div>

                    <div className="space-y-1">
                      <div className="flex justify-between text-[10px] font-mono text-[#666] dark:text-neutral-400">
                        <span>裁切高 Height</span>
                        <span className="font-bold text-black dark:text-white">{selectedPhoto.element.cropHeight || 100}%</span>
                      </div>
                      <input
                        type="range"
                        min={30}
                        max={100}
                        step={1}
                        value={selectedPhoto.element.cropHeight || 100}
                        onChange={(e) =>
                          onUpdatePhoto(
                            { ...selectedPhoto.element, cropHeight: Number(e.target.value) },
                            selectedPhoto.index
                          )
                        }
                        className="w-full accent-black"
                      />
                    </div>
                  </div>
                </div>

                {/* Border Radius & Rotation */}
                <div className="space-y-3">
                  {/* Border Radius */}
                  <div className="space-y-1">
                    <label className="text-[10px] font-mono text-[#666] dark:text-neutral-400 uppercase tracking-widest">
                      裁切边角圆角 (Corner Radius)
                    </label>
                    <div className="grid grid-cols-5 gap-1 text-[10px] font-mono">
                      {[
                        { r: 0, name: '直角 0' },
                        { r: 8, name: '圆角 8' },
                        { r: 16, name: '柔和 16' },
                        { r: 24, name: '大弧 24' },
                        { r: 9999, name: '椭圆/圆形' },
                      ].map((item) => (
                        <button
                          key={item.r}
                          onClick={() =>
                            onUpdatePhoto(
                              { ...selectedPhoto.element, borderRadius: item.r },
                              selectedPhoto.index
                            )
                          }
                          className={`p-1.5 border text-center transition-all ${
                            (selectedPhoto.element.borderRadius || 0) === item.r
                              ? 'bg-black text-white border-black font-bold'
                              : 'bg-white dark:bg-neutral-900 text-[#555] dark:text-neutral-400 border-[#E0E0DB] dark:border-neutral-700 hover:border-black dark:hover:border-white'
                          }`}
                        >
                          {item.name}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Rotation */}
                  <div className="space-y-1">
                    <label className="text-[10px] font-mono text-[#666] dark:text-neutral-400 uppercase tracking-widest">
                      画面旋转 (Rotation)
                    </label>
                    <div className="grid grid-cols-4 gap-1 text-[10px] font-mono">
                      {[0, 90, 180, 270].map((deg) => (
                        <button
                          key={deg}
                          onClick={() =>
                            onUpdatePhoto(
                              { ...selectedPhoto.element, rotation: deg },
                              selectedPhoto.index
                            )
                          }
                          className={`p-1.5 border text-center transition-all ${
                            (selectedPhoto.element.rotation || 0) === deg
                              ? 'bg-black text-white border-black font-bold'
                              : 'bg-white dark:bg-neutral-900 text-[#555] dark:text-neutral-400 border-[#E0E0DB] dark:border-neutral-700 hover:border-black dark:hover:border-white'
                          }`}
                        >
                          {deg}°
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Darkroom Filter Options */}
                <div className="space-y-2">
                  <label className="text-[10px] font-mono text-[#666] dark:text-neutral-400 uppercase tracking-widest">暗房黑白与调色滤镜</label>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { id: 'normal', name: '原图彩色 Normal' },
                      { id: 'bw', name: '黑白高阶 B&W' },
                      { id: 'high-contrast', name: '电影对比 Contrast' },
                      { id: 'vintage', name: '复古胶片 Vintage' },
                      { id: 'soft-warm', name: '柔和暖调 Warm' },
                      { id: 'cold-film', name: '冷绿调性 Cold' },
                    ].map((f) => (
                      <button
                        key={f.id}
                        onClick={() =>
                          onUpdatePhoto(
                            { ...selectedPhoto.element, filter: f.id as any },
                            selectedPhoto.index
                          )
                        }
                        className={`p-2 text-[10px] font-mono border text-left transition-all ${
                          selectedPhoto.element.filter === f.id
                            ? 'bg-black text-white border-black font-medium'
                            : 'bg-white dark:bg-neutral-900 text-[#666] dark:text-neutral-400 border-[#E0E0DB] dark:border-neutral-700 hover:border-black dark:hover:border-white'
                        }`}
                      >
                        {f.name}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Canvas Drag Tip */}
                <div className="p-3 bg-[#FAF9F6] dark:bg-neutral-900 border border-[#E0E0DB] dark:border-neutral-700 text-[11px] text-[#444] dark:text-neutral-300 font-mono rounded flex items-start gap-2">
                  <Move className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-[#1A1A1A] dark:text-neutral-100">画布自由拖拽:</span>
                    <p className="text-[10px] text-[#666] dark:text-neutral-400 leading-tight mt-0.5">
                      在中间杂志画布上直接按住鼠标左键拖动，即可自由平移图片。
                    </p>
                  </div>
                </div>

                {/* Zoom Scale */}
                <div className="space-y-1">
                  <div className="flex justify-between text-[10px] font-mono text-[#666] dark:text-neutral-400">
                    <span>图片缩放 Scale</span>
                    <span className="font-bold text-black dark:text-white">{Math.round((selectedPhoto.element.scale || 1) * 100)}%</span>
                  </div>
                  <input
                    type="range"
                    min={0.5}
                    max={3.0}
                    step={0.05}
                    value={selectedPhoto.element.scale || 1}
                    onChange={(e) =>
                      onUpdatePhoto(
                        { ...selectedPhoto.element, scale: Number(e.target.value) },
                        selectedPhoto.index
                      )
                    }
                    className="w-full accent-black"
                  />
                </div>

                {/* Offset Pan X & Y */}
                <div className="space-y-2">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-[10px] font-mono text-[#666] dark:text-neutral-400">
                        水平 X ({selectedPhoto.element.offsetX || 0}%)
                      </label>
                      <input
                        type="range"
                        min={-200}
                        max={200}
                        value={selectedPhoto.element.offsetX || 0}
                        onChange={(e) =>
                          onUpdatePhoto(
                            { ...selectedPhoto.element, offsetX: Number(e.target.value) },
                            selectedPhoto.index
                          )
                        }
                        className="w-full accent-black"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] font-mono text-[#666] dark:text-neutral-400">
                        垂直 Y ({selectedPhoto.element.offsetY || 0}%)
                      </label>
                      <input
                        type="range"
                        min={-200}
                        max={200}
                        value={selectedPhoto.element.offsetY || 0}
                        onChange={(e) =>
                          onUpdatePhoto(
                            { ...selectedPhoto.element, offsetY: Number(e.target.value) },
                            selectedPhoto.index
                          )
                        }
                        className="w-full accent-black"
                      />
                    </div>
                  </div>

                  {/* Position Quick Presets */}
                  <div className="space-y-1 pt-1">
                    <label className="text-[10px] font-mono text-[#666] dark:text-neutral-400 uppercase">一键快移预设 / Position Presets</label>
                    <div className="grid grid-cols-5 gap-1 text-[10px] font-mono">
                      <button
                        onClick={() =>
                          onUpdatePhoto(
                            { ...selectedPhoto.element, offsetX: 0, offsetY: 0 },
                            selectedPhoto.index
                          )
                        }
                        className="p-1.5 border border-[#E0E0DB] dark:border-neutral-700 bg-white dark:bg-neutral-900 hover:bg-black hover:text-white transition-colors text-center"
                        title="居中重置"
                      >
                        居中
                      </button>
                      <button
                        onClick={() =>
                          onUpdatePhoto(
                            { ...selectedPhoto.element, offsetX: -30 },
                            selectedPhoto.index
                          )
                        }
                        className="p-1.5 border border-[#E0E0DB] dark:border-neutral-700 bg-white dark:bg-neutral-900 hover:bg-black hover:text-white transition-colors text-center"
                        title="左移30%"
                      >
                        ←左
                      </button>
                      <button
                        onClick={() =>
                          onUpdatePhoto(
                            { ...selectedPhoto.element, offsetX: 30 },
                            selectedPhoto.index
                          )
                        }
                        className="p-1.5 border border-[#E0E0DB] dark:border-neutral-700 bg-white dark:bg-neutral-900 hover:bg-black hover:text-white transition-colors text-center"
                        title="右移30%"
                      >
                        右→
                      </button>
                      <button
                        onClick={() =>
                          onUpdatePhoto(
                            { ...selectedPhoto.element, offsetY: -30 },
                            selectedPhoto.index
                          )
                        }
                        className="p-1.5 border border-[#E0E0DB] dark:border-neutral-700 bg-white dark:bg-neutral-900 hover:bg-black hover:text-white transition-colors text-center"
                        title="上移30%"
                      >
                        ↑上
                      </button>
                      <button
                        onClick={() =>
                          onUpdatePhoto(
                            { ...selectedPhoto.element, offsetY: 30 },
                            selectedPhoto.index
                          )
                        }
                        className="p-1.5 border border-[#E0E0DB] dark:border-neutral-700 bg-white dark:bg-neutral-900 hover:bg-black hover:text-white transition-colors text-center"
                        title="下移30%"
                      >
                        ↓下
                      </button>
                    </div>
                  </div>
                </div>

                {/* Border Mat */}
                <button
                  onClick={() =>
                    onUpdatePhoto(
                      { ...selectedPhoto.element, border: !selectedPhoto.element.border },
                      selectedPhoto.index
                    )
                  }
                  className={`w-full py-2 border text-xs font-mono transition-all uppercase tracking-wider ${
                    selectedPhoto.element.border
                      ? 'bg-black text-white border-black font-medium'
                      : 'bg-white dark:bg-neutral-900 text-[#666] dark:text-neutral-400 border-[#E0E0DB] dark:border-neutral-700 hover:border-black dark:hover:border-white'
                  }`}
                >
                  {selectedPhoto.element.border ? '已添加白卡边框 Mat Border' : '添加细白卡边框 Mat Border'}
                </button>
              </div>
            )}
          </div>
        )}

        {/* TAB 4: PAGE STYLE */}
        {activeTab === 'page' && (
          <div className="space-y-4">
            {/* Background Color Presets */}
            <div className="space-y-2">
              <label className="text-[10px] font-mono text-[#666] dark:text-neutral-400 uppercase tracking-widest">页面底色背景</label>
              <div className="grid grid-cols-1 gap-2">
                {BG_PRESETS.map((bg) => (
                  <button
                    key={bg.value}
                    onClick={() => onUpdatePage({ bgColor: bg.value })}
                    className={`flex items-center justify-between p-2.5 border text-xs font-mono transition-all ${
                      activePage.bgColor === bg.value
                        ? 'border-black bg-[#F0F0EE] dark:bg-neutral-800 text-black dark:text-white font-semibold'
                        : 'border-[#E0E0DB] dark:border-neutral-700 bg-white dark:bg-neutral-900 text-[#666] dark:text-neutral-400 hover:text-black dark:hover:text-white hover:border-black dark:hover:border-white'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border border-[#CCCCCC] dark:border-neutral-600" style={{ backgroundColor: bg.value }} />
                      <span>{bg.label}</span>
                    </div>
                    {activePage.bgColor === bg.value && <Check className="w-4 h-4 text-black dark:text-white" />}
                  </button>
                ))}
              </div>
            </div>

            {/* Page Inner Padding Slider */}
            <div className="space-y-3 bg-[#FAF9F6] dark:bg-neutral-900 p-3 border border-[#E0E0DB] dark:border-neutral-700 rounded">
              <div className="flex items-center justify-between">
                <label className="text-[10px] font-mono text-[#444] dark:text-neutral-300 font-bold uppercase tracking-widest flex items-center gap-1.5">
                  <Maximize2 className="w-3.5 h-3.5 text-amber-600" />
                  页面留白内边距 (Page Padding)
                </label>
                <button
                  type="button"
                  onClick={() => onUpdatePage({ padding: 32 })}
                  className="text-[9px] font-mono text-amber-700 hover:underline font-semibold"
                >
                  重置默认 (32px)
                </button>
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between text-[10px] font-mono text-[#666] dark:text-neutral-400">
                  <span>边距尺寸 Padding</span>
                  <span className="font-bold text-black dark:text-white">{activePage.padding !== undefined ? activePage.padding : 32}px</span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={80}
                  step={2}
                  value={activePage.padding !== undefined ? activePage.padding : 32}
                  onChange={(e) => onUpdatePage({ padding: Number(e.target.value) })}
                  className="w-full accent-black cursor-pointer"
                />
              </div>

              {/* Padding Presets */}
              <div className="grid grid-cols-5 gap-1 text-[9px] font-mono pt-1">
                {[
                  { p: 0, label: '无边 0' },
                  { p: 12, label: '紧凑 12' },
                  { p: 24, label: '标准 24' },
                  { p: 36, label: '优雅 36' },
                  { p: 56, label: '留白 56' },
                ].map((item) => (
                  <button
                    key={item.p}
                    type="button"
                    onClick={() => onUpdatePage({ padding: item.p })}
                    className={`p-1.5 border text-center transition-all ${
                      (activePage.padding !== undefined ? activePage.padding : 32) === item.p
                        ? 'bg-amber-500 text-black dark:text-white border-amber-600 font-bold shadow-sm'
                        : 'bg-white dark:bg-neutral-900 text-[#555] dark:text-neutral-400 border-[#E0E0DB] dark:border-neutral-700 hover:border-black dark:hover:border-white'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Page Footer & Header Controls */}
            <div className="pt-3 border-t border-[#E0E0DB] dark:border-neutral-700 space-y-3 transition-colors duration-300">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono text-[#333] dark:text-neutral-300">显示中缝压痕 Fold Seam</span>
                <input
                  type="checkbox"
                  checked={activePage.showSpineLine !== false}
                  onChange={(e) => onUpdatePage({ showSpineLine: e.target.checked })}
                  className="accent-black w-4 h-4"
                />
              </div>

              <div className="space-y-1 pt-2">
                <label className="text-[10px] font-mono text-[#666] dark:text-neutral-400 uppercase tracking-widest">页顶品牌标题标识</label>
                <input
                  type="text"
                  value={activePage.brandHeading || ''}
                  onChange={(e) => onUpdatePage({ brandHeading: e.target.value })}
                  placeholder="茉域影像 EDITORIAL"
                  className="w-full bg-white dark:bg-neutral-900 border border-[#E0E0DB] dark:border-neutral-700 p-2 text-xs text-[#1A1A1A] dark:text-neutral-100 focus:border-black outline-none font-mono"
                />
              </div>
            </div>
          </div>
        )}

        {/* TAB 5: 图层管理 / LAYERS */}
        {activeTab === 'layers' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono text-[#888] dark:text-neutral-500 uppercase tracking-widest flex items-center gap-1.5">
                <LayersIcon className="w-3.5 h-3.5" />
                图层管理 ({activePage.texts.length + activePage.photos.length} 个元素)
              </span>
            </div>

            <div className="space-y-3">
              {/* 文字图层 / Text layers */}
              {activePage.texts.length > 0 && (
                <div className="space-y-1.5">
                  <div className="text-[9px] font-mono text-[#999] dark:text-neutral-500 uppercase tracking-widest pl-1">文字层 (Text)</div>
                  {[...activePage.texts].reverse().map((txt, revIdx) => {
                    const idx = activePage.texts.length - 1 - revIdx;
                    const isSelected = selectedText?.id === txt.id;
                    return (
                      <div
                        key={txt.id}
                        onClick={() => onSelectText?.(txt)}
                        className={`group flex items-center gap-2 p-2 border cursor-pointer transition-all ${
                          isSelected
                            ? 'bg-amber-50 dark:bg-amber-900/20 border-amber-500 ring-1 ring-amber-400'
                            : 'bg-white dark:bg-neutral-900 border-[#E0E0DB] dark:border-neutral-700 hover:border-amber-400'
                        }`}
                      >
                        <Type className="w-3.5 h-3.5 text-[#888] dark:text-neutral-400 shrink-0" />
                        <div className="flex-1 min-w-0">
                          <div className="text-xs font-medium truncate text-[#1A1A1A] dark:text-neutral-100">
                            {txt.content.slice(0, 30) || '(空文本)'}
                          </div>
                          <div className="text-[9px] font-mono text-[#999] dark:text-neutral-500 uppercase">{txt.label} · {txt.style.fontFamily}</div>
                        </div>
                        {/* 上移/下移/删除 / Move up/down/delete */}
                        <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              const newTexts = [...activePage.texts];
                              if (idx < newTexts.length - 1) {
                                [newTexts[idx], newTexts[idx + 1]] = [newTexts[idx + 1], newTexts[idx]];
                                onUpdatePage({ texts: newTexts });
                              }
                            }}
                            disabled={idx >= activePage.texts.length - 1}
                            className="p-1 text-[#888] hover:text-black dark:hover:text-white disabled:opacity-30 disabled:cursor-not-allowed"
                            title="上移 (置于顶层)"
                          >
                            <ChevronUp className="w-3 h-3" />
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              const newTexts = [...activePage.texts];
                              if (idx > 0) {
                                [newTexts[idx], newTexts[idx - 1]] = [newTexts[idx - 1], newTexts[idx]];
                                onUpdatePage({ texts: newTexts });
                              }
                            }}
                            disabled={idx <= 0}
                            className="p-1 text-[#888] hover:text-black dark:hover:text-white disabled:opacity-30 disabled:cursor-not-allowed"
                            title="下移 (置于底层)"
                          >
                            <ChevronDown className="w-3 h-3" />
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              const newTexts = activePage.texts.filter((t) => t.id !== txt.id);
                              onUpdatePage({ texts: newTexts });
                            }}
                            className="p-1 text-red-500 hover:text-red-700"
                            title="删除"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* 图片图层 / Photo layers */}
              {activePage.photos.length > 0 && (
                <div className="space-y-1.5">
                  <div className="text-[9px] font-mono text-[#999] dark:text-neutral-500 uppercase tracking-widest pl-1">图片层 (Photo)</div>
                  {[...activePage.photos].reverse().map((photo, revIdx) => {
                    const idx = activePage.photos.length - 1 - revIdx;
                    const isSelected = selectedPhoto?.element.id === photo.id;
                    return (
                      <div
                        key={photo.id}
                        onClick={() => onSelectPhoto?.(photo, idx)}
                        className={`group flex items-center gap-2 p-2 border cursor-pointer transition-all ${
                          isSelected
                            ? 'bg-amber-50 dark:bg-amber-900/20 border-amber-500 ring-1 ring-amber-400'
                            : 'bg-white dark:bg-neutral-900 border-[#E0E0DB] dark:border-neutral-700 hover:border-amber-400'
                        }`}
                      >
                        <div className="w-8 h-8 shrink-0 overflow-hidden border border-[#E0E0DB] dark:border-neutral-700">
                          {photo.url ? (
                            <img src={photo.url} alt="" className="w-full h-full object-cover" loading="lazy" />
                          ) : (
                            <div className="w-full h-full bg-[#F0F0EE] dark:bg-neutral-800" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-xs font-medium truncate text-[#1A1A1A] dark:text-neutral-100">
                            图片 #{idx + 1}
                          </div>
                          <div className="text-[9px] font-mono text-[#999] dark:text-neutral-500 uppercase">
                            {photo.fit} · {photo.filter}
                          </div>
                        </div>
                        <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              const newPhotos = [...activePage.photos];
                              if (idx < newPhotos.length - 1) {
                                [newPhotos[idx], newPhotos[idx + 1]] = [newPhotos[idx + 1], newPhotos[idx]];
                                onUpdatePage({ photos: newPhotos });
                              }
                            }}
                            disabled={idx >= activePage.photos.length - 1}
                            className="p-1 text-[#888] hover:text-black dark:hover:text-white disabled:opacity-30 disabled:cursor-not-allowed"
                            title="上移"
                          >
                            <ChevronUp className="w-3 h-3" />
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              const newPhotos = [...activePage.photos];
                              if (idx > 0) {
                                [newPhotos[idx], newPhotos[idx - 1]] = [newPhotos[idx - 1], newPhotos[idx]];
                                onUpdatePage({ photos: newPhotos });
                              }
                            }}
                            disabled={idx <= 0}
                            className="p-1 text-[#888] hover:text-black dark:hover:text-white disabled:opacity-30 disabled:cursor-not-allowed"
                            title="下移"
                          >
                            <ChevronDown className="w-3 h-3" />
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              const newPhotos = activePage.photos.filter((p) => p.id !== photo.id);
                              onUpdatePage({ photos: newPhotos });
                            }}
                            className="p-1 text-red-500 hover:text-red-700"
                            title="删除"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* 空状态 / Empty state */}
              {activePage.texts.length === 0 && activePage.photos.length === 0 && (
                <div className="text-center py-8 text-[#999] dark:text-neutral-500 text-xs font-mono">
                  当前页面暂无图层元素
                </div>
              )}
            </div>
          </div>
        )}
      </div>
      </div>
    </div>
  );
};
