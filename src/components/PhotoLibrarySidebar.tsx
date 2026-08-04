import React, { useRef, useState } from 'react';
import { PhotoAsset } from '../types';
import {
  Upload,
  Plus,
  Sparkles,
  Trash2,
  Image as ImageIcon,
  Check,
  Loader2,
  ChevronLeft,
  ChevronRight,
  Move,
  MousePointerClick,
  CheckCircle2,
  LayoutGrid,
  Grid3X3,
  Search,
  CheckSquare,
  Square,
} from 'lucide-react';
import { compressImage } from '../utils/imageCompressor';

interface PhotoLibrarySidebarProps {
  photos: PhotoAsset[];
  isOpen: boolean;
  onToggleOpen: () => void;
  onAddPhoto: (newPhoto: PhotoAsset) => void;
  onDeletePhoto: (id: string) => void;
  onAutoFillMagazine: (selectedPhotoUrls: string[]) => void;
  onApplyPhotoToSelectedSlot?: (photoUrl: string) => void;
  selectedPhotoIndex?: number | null;
}

export const PhotoLibrarySidebar: React.FC<PhotoLibrarySidebarProps> = ({
  photos,
  isOpen,
  onToggleOpen,
  onAddPhoto,
  onDeletePhoto,
  onAutoFillMagazine,
  onApplyPhotoToSelectedSlot,
  selectedPhotoIndex,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedUrls, setSelectedUrls] = useState<string[]>(photos.map((p) => p.url));
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [isDragOver, setIsDragOver] = useState<boolean>(false);
  const [justAppliedUrl, setJustAppliedUrl] = useState<string | null>(null);
  const [gridColumns, setGridColumns] = useState<2 | 3>(2);
  const [searchQuery, setSearchQuery] = useState<string>('');

  const processFiles = async (files: FileList | File[]) => {
    if (!files || files.length === 0) return;
    setIsProcessing(true);
    try {
      const fileArray = Array.from(files);
      for (const file of fileArray) {
        if (!file.type.startsWith('image/')) continue;
        const compressedUrl = await compressImage(file, 2000, 0.85);
        const newPhoto: PhotoAsset = {
          id: `usr-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
          url: compressedUrl,
          title: file.name.replace(/\.[^/.]+$/, ''),
          author: '摄影师作品',
          tags: ['智能压缩上传'],
        };
        onAddPhoto(newPhoto);
        setSelectedUrls((prev) => [...prev, newPhoto.url]);
      }
    } catch (err) {
      console.error('Error processing upload files:', err);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      processFiles(e.target.files);
    }
  };

  const handleDropAreaDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processFiles(e.dataTransfer.files);
    }
  };

  const handlePhotoClick = (photoUrl: string) => {
    if (onApplyPhotoToSelectedSlot) {
      onApplyPhotoToSelectedSlot(photoUrl);
      setJustAppliedUrl(photoUrl);
      setTimeout(() => setJustAppliedUrl(null), 1500);
    }
  };

  const handleToggleSelectAll = () => {
    if (selectedUrls.length === photos.length) {
      setSelectedUrls([]);
    } else {
      setSelectedUrls(photos.map((p) => p.url));
    }
  };

  const filteredPhotos = photos.filter((p) =>
    searchQuery
      ? p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()))
      : true
  );

  return (
    <aside className={`h-full bg-white dark:bg-neutral-900 border-r border-[#E0E0DB] dark:border-neutral-700 z-20 shrink-0 select-none overflow-hidden shadow-md relative panel-transition ${isOpen ? 'w-88 md:w-96' : 'w-11'}`}>
      {/* 折叠态指示器 / Collapsed indicator */}
      {!isOpen && (
        <div
          onClick={onToggleOpen}
          className="absolute inset-0 z-30 flex flex-col items-center justify-between py-6 text-xs font-mono uppercase tracking-widest text-[#555] dark:text-neutral-400 hover:text-black dark:hover:text-white hover:bg-[#F9F9F8] dark:hover:bg-neutral-800 cursor-pointer panel-content-fade opacity-100"
          title="展开素材库侧边栏"
        >
          <div className="flex flex-col items-center gap-3">
            <ImageIcon className="w-4 h-4 text-black dark:text-white" />
            <span className="[writing-mode:vertical-rl] text-[11px] font-bold tracking-widest mt-2 text-[#1A1A1A] dark:text-neutral-100">
              素材 ASSETS ({photos.length})
            </span>
          </div>
          <ChevronRight className="w-4 h-4" />
        </div>
      )}

      {/* 展开态内容 / Expanded content */}
      <div className={`h-full flex flex-col panel-content-fade ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
      {/* 1. Sidebar Header */}
      <div className="px-4 py-3.5 border-b border-[#E0E0DB] dark:border-neutral-700 flex items-center justify-between bg-[#FAF9F6] dark:bg-neutral-900">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 bg-black text-white flex items-center justify-center font-mono text-xs font-bold">
            AS
          </div>
          <div>
            <h3 className="text-xs font-bold font-mono tracking-wider text-[#1A1A1A] dark:text-neutral-100 uppercase">
              媒体素材库 / ASSETS
            </h3>
            <p className="text-[10px] text-[#777] dark:text-neutral-500 font-mono">共 {photos.length} 张高质量摄影作品</p>
          </div>
        </div>

        <div className="flex items-center gap-1">
          {/* Grid column toggle */}
          <button
            onClick={() => setGridColumns((c) => (c === 2 ? 3 : 2))}
            className="p-1.5 text-[#666] dark:text-neutral-400 hover:text-black dark:hover:text-white hover:bg-neutral-200/60 dark:hover:bg-neutral-700/60 rounded transition-colors"
            title={gridColumns === 2 ? '切换为 3 列网格' : '切换为 2 列大图'}
          >
            {gridColumns === 2 ? <Grid3X3 className="w-4 h-4" /> : <LayoutGrid className="w-4 h-4" />}
          </button>

          {/* Close button */}
          <button
            onClick={onToggleOpen}
            className="w-7 h-7 bg-neutral-900 text-amber-300 border border-amber-500/50 rounded-full flex items-center justify-center hover:bg-neutral-800 hover:scale-110 hover:shadow-md active:scale-95 transition-all shrink-0"
            title="收起侧边栏"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* 2. Selected Slot Active Notification */}
      {selectedPhotoIndex !== undefined && selectedPhotoIndex !== null && (
        <div className="bg-amber-500/10 border-b border-amber-500/25 px-4 py-2.5 text-xs text-amber-950 flex items-center gap-2.5">
          <MousePointerClick className="w-4 h-4 text-amber-600 shrink-0 animate-bounce" />
          <span className="leading-tight">
            当前处于<strong>图片框 #{selectedPhotoIndex + 1}</strong> 编辑状态，点击任意素材直接替换！
          </span>
        </div>
      )}

      {/* 3. Primary Action Bar (Upload & Quick Fill) */}
      <div className="p-4 border-b border-[#E0E0DB] dark:border-neutral-700 bg-[#FDFDFD] space-y-3">
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileUpload}
          multiple
          accept="image/*"
          className="hidden"
        />

        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={isProcessing}
            className="flex items-center justify-center gap-2 bg-amber-500 hover:bg-amber-600 text-black dark:text-white font-bold py-2.5 px-3 text-xs font-mono uppercase tracking-wider transition-all shadow-md hover:shadow-lg border border-amber-400 active:scale-95 disabled:opacity-50"
          >
            {isProcessing ? (
              <Loader2 className="w-4 h-4 animate-spin text-black dark:text-white" />
            ) : (
              <Upload className="w-4 h-4 text-black dark:text-white stroke-[2.5]" />
            )}
            <span className="truncate">{isProcessing ? '压缩中...' : '上传本地原图'}</span>
          </button>

          <button
            onClick={() => onAutoFillMagazine(selectedUrls)}
            disabled={selectedUrls.length === 0}
            className="flex items-center justify-center gap-1.5 bg-neutral-100 hover:bg-neutral-200 border border-[#E0E0DB] dark:border-neutral-700 text-[#1A1A1A] dark:text-neutral-100 py-2.5 px-3 text-xs font-mono uppercase tracking-wider transition-all disabled:opacity-40"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-600 shrink-0" />
            <span className="truncate">一键套用 ({selectedUrls.length})</span>
          </button>
        </div>

        {/* Drag & Drop Upload Zone */}
        <div
          onClick={() => fileInputRef.current?.click()}
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragOver(true);
          }}
          onDragLeave={() => setIsDragOver(false)}
          onDrop={handleDropAreaDrop}
          className={`p-3 border-2 border-dashed transition-all cursor-pointer text-center group rounded-sm ${
            isDragOver
              ? 'border-black bg-neutral-100 ring-2 ring-black'
              : 'border-[#E0E0DB] dark:border-neutral-700 hover:border-black bg-[#FAF9F6] dark:bg-neutral-900'
          }`}
        >
          <div className="flex items-center justify-center gap-2 text-xs font-medium text-[#333] dark:text-neutral-300">
            <Plus className="w-4 h-4 text-black dark:text-white group-hover:scale-110 transition-transform" />
            <span>拖拽图片到此处，或点击浏览上传</span>
          </div>
          <p className="text-[10px] text-[#888] dark:text-neutral-500 font-mono mt-1">
            自动 Canvas 2000px 高清压缩，避免内存卡顿
          </p>
        </div>
      </div>

      {/* 4. Search & Selection Control Bar */}
      <div className="px-4 py-2 bg-[#F7F7F5] dark:bg-neutral-800 border-b border-[#E0E0DB] dark:border-neutral-700 flex items-center justify-between gap-2">
        {/* Search input */}
        <div className="relative flex-1">
          <Search className="w-3.5 h-3.5 text-[#888] dark:text-neutral-500 absolute left-2.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="搜索素材标题或标签..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-8 pr-2 py-1 text-xs bg-white dark:bg-neutral-900 border border-[#E0E0DB] dark:border-neutral-700 focus:outline-none focus:border-black font-sans"
          />
        </div>

        {/* Select All Toggle */}
        <button
          onClick={handleToggleSelectAll}
          className="flex items-center gap-1 text-[11px] font-mono text-[#555] hover:text-black dark:hover:text-white shrink-0 px-2 py-1 bg-white dark:bg-neutral-900 border border-[#E0E0DB] dark:border-neutral-700 transition-colors"
          title={selectedUrls.length === photos.length ? '取消全选' : '全选所有图片'}
        >
          {selectedUrls.length === photos.length ? (
            <CheckSquare className="w-3.5 h-3.5 text-black dark:text-white" />
          ) : (
            <Square className="w-3.5 h-3.5 text-[#888] dark:text-neutral-500" />
          )}
          <span>{selectedUrls.length === photos.length ? '取消全选' : '全选'}</span>
        </button>
      </div>

      {/* 5. Quick Usage Tip Bar */}
      <div className="px-4 py-2 bg-[#F0F0EE] dark:bg-neutral-800 text-[11px] text-[#555] font-mono flex items-center justify-between border-b border-[#E0E0DB] dark:border-neutral-700">
        <span className="flex items-center gap-1.5">
          <Move className="w-3.5 h-3.5 text-black dark:text-white" />
          <span>按住拖至页面槽位</span>
        </span>
        <span className="flex items-center gap-1.5">
          <MousePointerClick className="w-3.5 h-3.5 text-black dark:text-white" />
          <span>点击直接套用</span>
        </span>
      </div>

      {/* 6. Photo Grid Gallery */}
      <div className="flex-1 overflow-y-auto p-4">
        {filteredPhotos.length === 0 ? (
          <div className="py-12 text-center text-xs text-[#888] dark:text-neutral-500 font-mono space-y-2">
            <ImageIcon className="w-8 h-8 mx-auto text-stone-300" />
            <p>未找到符合条件的素材</p>
          </div>
        ) : (
          <div
            className={`grid gap-3 ${
              gridColumns === 2 ? 'grid-cols-2' : 'grid-cols-3'
            }`}
          >
            {filteredPhotos.map((p) => {
              const isSelected = selectedUrls.includes(p.url);
              const isJustApplied = justAppliedUrl === p.url;

              return (
                <div
                  key={p.id}
                  draggable
                  onDragStart={(e) => {
                    e.dataTransfer.setData('text/plain', p.url);
                    e.dataTransfer.setData('text/uri-list', p.url);
                  }}
                  onClick={() => handlePhotoClick(p.url)}
                  className={`relative group aspect-[4/3] overflow-hidden bg-[#F0F0EE] dark:bg-neutral-800 border transition-all cursor-grab active:cursor-grabbing shadow-2xs ${
                    isJustApplied
                      ? 'border-emerald-600 ring-2 ring-emerald-500 animate-spring'
                      : isSelected
                      ? 'border-black ring-1 ring-black animate-spring'
                      : 'border-[#E0E0DB] dark:border-neutral-700 hover:border-black hover:scale-[1.02]'
                  }`}
                >
                  <img
                    src={p.url}
                    alt={p.title}
                    loading="lazy"
                    decoding="async"
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 pointer-events-none"
                  />

                  {/* Just Applied Visual Feedback */}
                  {isJustApplied && (
                    <div className="absolute inset-0 bg-emerald-900/70 backdrop-blur-[1px] flex flex-col items-center justify-center text-white text-[11px] font-mono font-bold uppercase gap-1 animate-pulse z-20">
                      <CheckCircle2 className="w-6 h-6 text-emerald-400" />
                      <span>已替换至页面</span>
                    </div>
                  )}

                  {/* Selection Checkbox */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedUrls((prev) =>
                        prev.includes(p.url) ? prev.filter((u) => u !== p.url) : [...prev, p.url]
                      );
                    }}
                    className={`absolute top-2 left-2 w-5 h-5 flex items-center justify-center transition-all z-10 ${
                      isSelected
                        ? 'bg-black text-white shadow-sm'
                        : 'bg-white/90 dark:bg-neutral-900/90 border border-[#E0E0DB] dark:border-neutral-700 text-black dark:text-white opacity-0 group-hover:opacity-100'
                    }`}
                    title="选中以供批量套用"
                  >
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                  </button>

                  {/* Delete button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeletePhoto(p.id);
                    }}
                    className="absolute top-2 right-2 w-5 h-5 bg-white/90 dark:bg-neutral-900/90 text-[#666] dark:text-neutral-400 hover:text-red-600 border border-[#E0E0DB] dark:border-neutral-700 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all z-10"
                    title="删除此图片"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>

                  {/* Hover Drag/Click Overlay */}
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/95 via-black/60 to-transparent p-2 pt-5 text-[10px] font-mono text-white truncate opacity-0 group-hover:opacity-100 transition-opacity flex flex-col gap-0.5 pointer-events-none z-10">
                    <span className="font-semibold truncate leading-tight">{p.title}</span>
                    <span className="text-amber-300 text-[9px] font-sans">⚡ 拖拽放入 / 点击替换</span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
      </div>
    </aside>
  );
};

