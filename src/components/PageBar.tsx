import React, { useState } from 'react';
import { MagazineSpread } from '../types';
import { Plus, Copy, Trash2, ChevronLeft, ChevronRight, GripVertical } from 'lucide-react';

interface PageBarProps {
  spreads: MagazineSpread[];
  activeIndex: number;
  onSelectSpread: (index: number) => void;
  onAddSpread: () => void;
  onDuplicateSpread: (index: number) => void;
  onDeleteSpread: (index: number) => void;
  onMoveSpread: (fromIndex: number, toIndex: number) => void;
}

export const PageBar: React.FC<PageBarProps> = ({
  spreads,
  activeIndex,
  onSelectSpread,
  onAddSpread,
  onDuplicateSpread,
  onDeleteSpread,
  onMoveSpread,
}) => {
  // 拖拽排序状态 / Drag-to-reorder state
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);

  const handleDragStart = (e: React.DragEvent, idx: number) => {
    setDraggedIndex(idx);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', String(idx));
  };

  const handleDragOver = (e: React.DragEvent, idx: number) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    if (draggedIndex !== null && draggedIndex !== idx) {
      setDragOverIndex(idx);
    }
  };

  const handleDrop = (e: React.DragEvent, idx: number) => {
    e.preventDefault();
    e.stopPropagation();
    if (draggedIndex !== null && draggedIndex !== idx) {
      onMoveSpread(draggedIndex, idx);
    }
    setDraggedIndex(null);
    setDragOverIndex(null);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
    setDragOverIndex(null);
  };

  return (
    <div className="w-full bg-white dark:bg-neutral-900 border-t border-[#E0E0DB] dark:border-neutral-700 p-3 flex items-center justify-between gap-4 select-none shrink-0 overflow-x-auto transition-colors duration-300">
      {/* Left Action Buttons */}
      <div className="flex items-center gap-2 shrink-0">
        <button
          onClick={onAddSpread}
          className="flex items-center gap-1.5 bg-black hover:bg-neutral-800 text-white font-medium px-3.5 py-1.5 text-xs font-mono uppercase tracking-widest transition-all shadow-xs"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>新建跨页</span>
        </button>

        <button
          onClick={() => onDuplicateSpread(activeIndex)}
          className="flex items-center gap-1 px-3 py-1.5 border border-[#E0E0DB] dark:border-neutral-700 bg-white dark:bg-neutral-900 text-[#666] dark:text-neutral-400 hover:text-black dark:hover:text-white hover:border-black dark:hover:border-white text-xs font-mono uppercase tracking-wider transition-all"
          title="复制当前跨页"
        >
          <Copy className="w-3.5 h-3.5" />
          <span>复制</span>
        </button>

        <button
          onClick={() => onDeleteSpread(activeIndex)}
          disabled={spreads.length <= 1}
          className="flex items-center gap-1 px-3 py-1.5 border border-[#E0E0DB] dark:border-neutral-700 bg-white dark:bg-neutral-900 text-[#888] dark:text-neutral-500 hover:text-red-600 hover:border-red-600 disabled:opacity-30 text-xs font-mono uppercase tracking-wider transition-all"
          title="删除当前跨页"
        >
          <Trash2 className="w-3.5 h-3.5" />
          <span>删除</span>
        </button>
      </div>

      {/* Middle Thumbnail Strip */}
      <div className="flex items-center gap-3 overflow-x-auto py-1 px-2 no-scrollbar">
        {spreads.map((s, idx) => {
          const isActive = idx === activeIndex;
          const isDragging = draggedIndex === idx;
          const isDragOver = dragOverIndex === idx && draggedIndex !== idx;
          return (
            <div
              key={s.id}
              draggable
              onDragStart={(e) => handleDragStart(e, idx)}
              onDragOver={(e) => handleDragOver(e, idx)}
              onDrop={(e) => handleDrop(e, idx)}
              onDragEnd={handleDragEnd}
              onClick={() => onSelectSpread(idx)}
              className={`relative flex items-center gap-0.5 p-1.5 border transition-all cursor-pointer shrink-0 group ${
                isDragging ? 'opacity-40 ring-2 ring-amber-500' : ''
              } ${
                isDragOver ? 'border-amber-500 ring-2 ring-amber-400 scale-105' : ''
              } ${
                isActive && !isDragging && !isDragOver
                  ? 'bg-[#F0F0EE] dark:bg-neutral-800 border-black ring-1 ring-black'
                  : !isDragging && !isDragOver
                  ? 'bg-white dark:bg-neutral-900 border-[#E0E0DB] dark:border-neutral-700 hover:border-black dark:hover:border-white'
                  : ''
              }`}
              title="拖拽排序 / Drag to reorder"
            >
              {/* 拖拽手柄 / Drag handle indicator */}
              <div className="absolute -top-2 -left-1 w-4 h-4 bg-[#F0F0EE] dark:bg-neutral-800 border border-[#E0E0DB] dark:border-neutral-700 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <GripVertical className="w-2.5 h-2.5 text-[#888] dark:text-neutral-400" />
              </div>
              {/* Left Page Mini Thumbnail */}
              <div
                className="w-10 h-14 bg-white dark:bg-neutral-900 border border-[#E0E0DB] dark:border-neutral-700 flex items-center justify-center overflow-hidden p-0.5"
                style={{ backgroundColor: s.leftPage.bgColor || '#ffffff' }}
              >
                <div className="text-[7px] font-mono text-[#888] dark:text-neutral-500 text-center line-clamp-2">
                  {s.isCover ? 'COVER' : `P0${s.leftPage.pageNumber}`}
                </div>
              </div>

              {/* Right Page Mini Thumbnail */}
              {!s.isCover && s.rightPage && (
                <div
                  className="w-10 h-14 bg-white dark:bg-neutral-900 border border-[#E0E0DB] dark:border-neutral-700 flex items-center justify-center overflow-hidden p-0.5"
                  style={{ backgroundColor: s.rightPage.bgColor || '#ffffff' }}
                >
                  <div className="text-[7px] font-mono text-[#888] dark:text-neutral-500 text-center line-clamp-2">
                    {`P0${s.rightPage.pageNumber}`}
                  </div>
                </div>
              )}

              {/* Label */}
              <div className="absolute -top-2 left-1 bg-white dark:bg-neutral-900 px-1 text-[8px] font-mono text-[#666] dark:text-neutral-400 border border-[#E0E0DB] dark:border-neutral-700 uppercase">
                #{idx + 1}
              </div>

              {/* Move buttons on hover */}
              <div className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-between px-1 text-white">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    if (idx > 0) onMoveSpread(idx, idx - 1);
                  }}
                  disabled={idx === 0}
                  className="p-1 hover:text-amber-300 disabled:opacity-20"
                >
                  <ChevronLeft className="w-3 h-3" />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    if (idx < spreads.length - 1) onMoveSpread(idx, idx + 1);
                  }}
                  disabled={idx === spreads.length - 1}
                  className="p-1 hover:text-amber-300 disabled:opacity-20"
                >
                  <ChevronRight className="w-3 h-3" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Right Page Count Stats */}
      <div className="text-[#666] dark:text-neutral-400 text-xs font-mono shrink-0 uppercase tracking-widest">
        共 <span className="text-black dark:text-white font-bold">{spreads.length}</span> 组跨页
      </div>
    </div>
  );
};
