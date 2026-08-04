import React, { useState, useRef, useEffect } from 'react';
import { MagazinePage, PhotoElement, TextElement } from '../types';
import { getFilterCss } from '../utils/filterStyles';
import { Move } from 'lucide-react';

interface PageRendererProps {
  page: MagazinePage;
  isLeft: boolean;
  selectedElementId?: string | null;
  onSelectText?: (text: TextElement) => void;
  onSelectPhoto?: (photo: PhotoElement, index: number) => void;
  onUpdatePhotoByPage?: (pageId: string, slotIndex: number, updatedPhoto: PhotoElement) => void;
  onUpdateTextByPage?: (pageId: string, textId: string, updatedText: TextElement) => void;
  onDropPhotoSlot?: (pageId: string, slotIndex: number, photoUrl: string) => void;
  scaleRatio?: number;
  readOnly?: boolean;
  exportMode?: boolean; // 新增导出模式标志
  onElementContextMenu?: (e: React.MouseEvent, type: 'text' | 'photo', element: TextElement | PhotoElement) => void;
  onCanvasContextMenu?: (e: React.MouseEvent) => void;
}

export const PageRenderer: React.FC<PageRendererProps> = ({
  page,
  isLeft,
  selectedElementId,
  onSelectText,
  onSelectPhoto,
  onUpdatePhotoByPage,
  onUpdateTextByPage,
  onDropPhotoSlot,
  scaleRatio = 1,
  readOnly = false,
  exportMode = false,
  onElementContextMenu,
  onCanvasContextMenu,
}) => {
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);
  const [draggingPhotoIndex, setDraggingPhotoIndex] = useState<number | null>(null);
  const [liveOffset, setLiveOffset] = useState<{ x: number; y: number } | null>(null);
  const [draggingTextId, setDraggingTextId] = useState<string | null>(null);
  const [liveTextOffset, setLiveTextOffset] = useState<{ x: number; y: number } | null>(null);

  // 双击编辑文字状态 / Double-click inline text editing state
  const [editingTextId, setEditingTextId] = useState<string | null>(null);
  const editingRef = useRef<HTMLDivElement | null>(null);

  // 拖拽对齐辅助线 / Drag alignment guides
  // 显示 0/25/50/75/100% 位置的辅助线，并在接近时吸附 / Show guides at 0/25/50/75/100% and snap when near
  const [activeGuides, setActiveGuides] = useState<{ vertical: number[]; horizontal: number[] }>({ vertical: [], horizontal: [] });
  const GUIDE_POSITIONS = [0, 25, 50, 75, 100];
  const SNAP_THRESHOLD = 3; // 吸附阈值百分比 / Snap threshold in percent

  // 计算吸附 / Compute snap: if value is near a multiple of 25 or near 0, snap to it
  const snapOffset = (value: number): { snapped: number; guideHit: number | null } => {
    // 吸附到 0 / Snap to 0
    if (Math.abs(value) < SNAP_THRESHOLD) {
      return { snapped: 0, guideHit: 50 };
    }
    // 检测是否接近 25 的倍数（在偏移空间内）/ Check if near a multiple of 25 in offset space
    for (const guide of [-50, -25, 0, 25, 50]) {
      if (Math.abs(value - guide) < SNAP_THRESHOLD) {
        return { snapped: guide, guideHit: 50 + guide };
      }
    }
    return { snapped: value, guideHit: null };
  };

  // 进入编辑模式时自动聚焦并全选 / Auto-focus and select all on entering edit mode
  useEffect(() => {
    if (editingTextId && editingRef.current) {
      const el = editingRef.current;
      el.focus();
      // 全选文字 / Select all text content
      const range = document.createRange();
      range.selectNodeContents(el);
      const sel = window.getSelection();
      sel?.removeAllRanges();
      sel?.addRange(range);
    }
  }, [editingTextId]);

  // 退出编辑模式时提交内容 / Commit content on blur
  const commitTextEdit = (txt: TextElement) => {
    if (!editingRef.current) {
      setEditingTextId(null);
      return;
    }
    const newContent = editingRef.current.innerText || '';
    if (newContent !== txt.content && onUpdateTextByPage) {
      onUpdateTextByPage(page.id, txt.id, { ...txt, content: newContent });
    }
    setEditingTextId(null);
  };

  // 双击进入编辑模式 / Double-click to enter edit mode
  const handleTextDoubleClick = (e: React.MouseEvent, txt: TextElement) => {
    if (readOnly) return;
    e.stopPropagation();
    e.preventDefault();
    if (onSelectText) onSelectText(txt);
    setEditingTextId(txt.id);
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (!readOnly) {
      setDragOverIndex(index);
    }
  };

  const handleDragLeave = (e: React.DragEvent) => {
    // 仅当鼠标真正离开槽位时才清除高亮 / Only clear highlight when mouse truly leaves the slot
    // 检查 relatedTarget 是否仍在当前槽位内，避免进入子元素（img/overlay）时误触发 dragleave
    // Check if relatedTarget is still contained within the slot to prevent flicker when entering child elements
    const currentTarget = e.currentTarget as HTMLElement;
    const relatedTarget = e.relatedTarget as Node | null;
    if (!relatedTarget || !currentTarget.contains(relatedTarget)) {
      setDragOverIndex(null);
    }
  };

  const handleDrop = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    setDragOverIndex(null);
    if (readOnly) return;
    const photoUrl = e.dataTransfer.getData('text/plain');
    if (photoUrl && onDropPhotoSlot) {
      onDropPhotoSlot(page.id, index, photoUrl);
    }
  };

  const handleTextMouseDown = (e: React.MouseEvent, txt: TextElement) => {
    if (readOnly) return;
    if (e.button !== 0) return;

    const startX = e.clientX;
    const startY = e.clientY;
    const initX = txt.offsetX || 0;
    const initY = txt.offsetY || 0;

    const el = e.currentTarget as HTMLElement;
    const rect = el.getBoundingClientRect();
    const width = rect.width || 100;
    const height = rect.height || 50;

    let moved = false;

    if (onSelectText) {
      onSelectText(txt);
    }

    const handleWindowMouseMove = (moveEvent: MouseEvent) => {
      const dx = moveEvent.clientX - startX;
      const dy = moveEvent.clientY - startY;

      if (Math.abs(dx) > 2 || Math.abs(dy) > 2) {
        if (!moved) {
          moved = true;
          setDraggingTextId(txt.id);
        }

        const deltaXPercent = Math.round((dx / width) * 100);
        const deltaYPercent = Math.round((dy / height) * 100);

        let newX = Math.min(300, Math.max(-300, initX + deltaXPercent));
        let newY = Math.min(300, Math.max(-300, initY + deltaYPercent));

        // 对齐吸附 / Alignment snapping
        const snapX = snapOffset(newX);
        const snapY = snapOffset(newY);
        newX = snapX.snapped;
        newY = snapY.snapped;

        // 更新激活的辅助线 / Update active guides
        const vGuides: number[] = [];
        const hGuides: number[] = [];
        if (snapX.guideHit !== null) vGuides.push(snapX.guideHit);
        if (snapY.guideHit !== null) hGuides.push(snapY.guideHit);
        setActiveGuides({ vertical: vGuides, horizontal: hGuides });

        setLiveTextOffset({ x: newX, y: newY });

        if (onUpdateTextByPage) {
          onUpdateTextByPage(page.id, txt.id, {
            ...txt,
            offsetX: newX,
            offsetY: newY,
          });
        }
      }
    };

    const handleWindowMouseUp = () => {
      window.removeEventListener('mousemove', handleWindowMouseMove);
      window.removeEventListener('mouseup', handleWindowMouseUp);
      setDraggingTextId(null);
      setLiveTextOffset(null);
      setActiveGuides({ vertical: [], horizontal: [] });
    };

    window.addEventListener('mousemove', handleWindowMouseMove);
    window.addEventListener('mouseup', handleWindowMouseUp);
  };

  const renderText = (txt: TextElement) => {
    const isSelected = selectedElementId === txt.id;
    const isDraggingThisText = draggingTextId === txt.id;
    const isEditing = editingTextId === txt.id && !readOnly;

    const currentOffsetX = isDraggingThisText && liveTextOffset ? liveTextOffset.x : txt.offsetX || 0;
    const currentOffsetY = isDraggingThisText && liveTextOffset ? liveTextOffset.y : txt.offsetY || 0;

    const style: React.CSSProperties = {
      fontFamily: txt.style.fontFamily,
      fontSize: `${txt.style.fontSize * scaleRatio}px`,
      fontWeight: txt.style.fontWeight as any,
      color: txt.style.color,
      letterSpacing: `${txt.style.letterSpacing * scaleRatio}px`,
      lineHeight: txt.style.lineHeight,
      textAlign: txt.style.textAlign,
      textTransform: txt.style.textTransform || 'none',
      writingMode: txt.style.writingMode || 'horizontal-tb',
      fontStyle: txt.style.fontStyle || 'normal',
      whiteSpace: 'pre-line',
      transform: `translate(${currentOffsetX}%, ${currentOffsetY}%)`,
      transition: isDraggingThisText ? 'none' : 'transform 0.15s ease-out',
      // 高级文字效果 / Advanced text effects
      textShadow: txt.style.textShadow
        ? `${txt.style.textShadow.offsetX * scaleRatio}px ${txt.style.textShadow.offsetY * scaleRatio}px ${txt.style.textShadow.blur * scaleRatio}px ${txt.style.textShadow.color}`
        : undefined,
      WebkitTextStroke: txt.style.textStroke
        ? `${txt.style.textStroke.width * scaleRatio}px ${txt.style.textStroke.color}`
        : undefined,
    };

    // 编辑模式：可编辑 div / Editable div when in edit mode
    if (isEditing) {
      return (
        <div
          key={txt.id}
          ref={editingRef}
          contentEditable
          suppressContentEditableWarning
          onBlur={() => commitTextEdit(txt)}
          onKeyDown={(e) => {
            // Esc 退出不保存 / Esc to exit without saving
            if (e.key === 'Escape') {
              e.preventDefault();
              setEditingTextId(null);
            }
            // Ctrl/Cmd+Enter 提交 / Ctrl/Cmd+Enter to commit
            if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
              e.preventDefault();
              commitTextEdit(txt);
            }
            // 阻止拖拽快捷键 / Stop drag handler from triggering
            e.stopPropagation();
          }}
          onDoubleClick={(e) => e.stopPropagation()}
          onContextMenu={(e) => {
            if (onElementContextMenu && !readOnly) {
              onElementContextMenu(e, 'text', txt);
            }
          }}
          className={`relative rounded cursor-text select-text outline-none ring-2 ring-amber-500 bg-amber-500/10 p-1 -m-1 z-40 ${
            isDraggingThisText ? 'opacity-90' : ''
          }`}
          style={{
            ...style,
            transition: 'none',
            cursor: 'text',
            userSelect: 'text',
            WebkitUserSelect: 'text',
          }}
        >
          {txt.content}
        </div>
      );
    }

    return (
      <div
        key={txt.id}
        onClick={(e) => {
          e.stopPropagation();
          if (onSelectText && !readOnly) onSelectText(txt);
        }}
        onDoubleClick={(e) => handleTextDoubleClick(e, txt)}
        onMouseDown={(e) => handleTextMouseDown(e, txt)}
        onContextMenu={(e) => {
          if (onElementContextMenu && !readOnly) {
            onElementContextMenu(e, 'text', txt);
          }
        }}
        className={`relative rounded cursor-grab active:cursor-grabbing select-none ${
          isSelected && !readOnly
            ? 'ring-2 ring-amber-500 bg-amber-500/15 p-1 -m-1 z-30 animate-select-pulse'
            : 'hover:outline-dashed hover:outline-1 hover:outline-amber-400/80 z-20'
        } ${isDraggingThisText ? 'z-40 opacity-90' : ''}`}
        style={style}
        title={readOnly ? undefined : '双击编辑文字 / Double-click to edit'}
      >
        {txt.content}

        {/* Live Dragging Badge for Text */}
        {isDraggingThisText && (
          <div className="absolute -top-7 left-1/2 -translate-x-1/2 bg-black/90 text-white px-2 py-0.5 rounded text-[10px] font-mono flex items-center gap-1 border border-amber-400 shadow-lg pointer-events-none whitespace-nowrap z-50">
            <Move className="w-3 h-3 text-amber-400" />
            <span>X: {currentOffsetX}% | Y: {currentOffsetY}%</span>
          </div>
        )}
      </div>
    );
  };

  const renderPhotoSlot = (
    photo: PhotoElement | undefined,
    index: number,
    aspectClass: string,
    extraClass: string = '',
    panoramicSide: 'left' | 'right' | 'none' = 'none'
  ) => {
    const isSelected = photo && selectedElementId === photo.id;
    const isDragOver = dragOverIndex === index;
    const isDraggingThis = draggingPhotoIndex === index;

    const currentOffsetX = isDraggingThis && liveOffset ? liveOffset.x : photo?.offsetX || 0;
    const currentOffsetY = isDraggingThis && liveOffset ? liveOffset.y : photo?.offsetY || 0;

    const handleSlotClick = (e: React.MouseEvent) => {
      e.stopPropagation();
      if (onSelectPhoto && !readOnly) {
        const targetPhoto: PhotoElement = photo || {
          id: `slot-${index}`,
          url: '',
          fit: 'cover',
          scale: 1,
          offsetX: 0,
          offsetY: 0,
          filter: 'normal',
          border: false,
        };
        onSelectPhoto(targetPhoto, index);
      }
    };

    const handlePhotoMouseDown = (e: React.MouseEvent) => {
      if (readOnly || !photo || !photo.url) return;
      if (e.button !== 0) return; // Only left mouse button

      const startX = e.clientX;
      const startY = e.clientY;
      const initX = photo.offsetX || 0;
      const initY = photo.offsetY || 0;

      const containerEl = e.currentTarget as HTMLElement;
      const rect = containerEl.getBoundingClientRect();
      const width = rect.width || 300;
      const height = rect.height || 300;

      let moved = false;

      // Select photo immediately on mouse down
      if (onSelectPhoto) {
        onSelectPhoto(photo, index);
      }

      const handleWindowMouseMove = (moveEvent: MouseEvent) => {
        const dx = moveEvent.clientX - startX;
        const dy = moveEvent.clientY - startY;

        if (Math.abs(dx) > 2 || Math.abs(dy) > 2) {
          if (!moved) {
            moved = true;
            setDraggingPhotoIndex(index);
          }

          // Calculate offset percentages
          const deltaXPercent = Math.round((dx / width) * 100);
          const deltaYPercent = Math.round((dy / height) * 100);

          let newX = Math.min(200, Math.max(-200, initX + deltaXPercent));
          let newY = Math.min(200, Math.max(-200, initY + deltaYPercent));

          // 对齐吸附 / Alignment snapping
          const snapX = snapOffset(newX);
          const snapY = snapOffset(newY);
          newX = snapX.snapped;
          newY = snapY.snapped;

          // 更新激活的辅助线 / Update active guides
          const vGuides: number[] = [];
          const hGuides: number[] = [];
          if (snapX.guideHit !== null) vGuides.push(snapX.guideHit);
          if (snapY.guideHit !== null) hGuides.push(snapY.guideHit);
          setActiveGuides({ vertical: vGuides, horizontal: hGuides });

          setLiveOffset({ x: newX, y: newY });

          if (onUpdatePhotoByPage) {
            onUpdatePhotoByPage(page.id, index, {
              ...photo,
              offsetX: newX,
              offsetY: newY,
            });
          }
        }
      };

      const handleWindowMouseUp = () => {
        window.removeEventListener('mousemove', handleWindowMouseMove);
        window.removeEventListener('mouseup', handleWindowMouseUp);
        setDraggingPhotoIndex(null);
        setLiveOffset(null);
        setActiveGuides({ vertical: [], horizontal: [] });
      };

      window.addEventListener('mousemove', handleWindowMouseMove);
      window.addEventListener('mouseup', handleWindowMouseUp);
    };

    const hasMoved = currentOffsetX !== 0 || currentOffsetY !== 0 || isDraggingThis;

    const customAspectRatio = photo?.aspectRatio && photo.aspectRatio !== 'auto'
      ? photo.aspectRatio
      : undefined;

    const cropWidthStr = photo?.cropWidth ? `${photo.cropWidth}%` : '100%';
    const cropHeightStr = photo?.cropHeight ? `${photo.cropHeight}%` : '100%';

    const borderRadiusStr = photo?.borderRadius
      ? photo.borderRadius === 9999
        ? '9999px'
        : `${photo.borderRadius}px`
      : undefined;

    const rotation = photo?.rotation || 0;

    return (
      <div
        key={photo?.id || `empty-${index}`}
        onDragOver={(e) => handleDragOver(e, index)}
        onDragLeave={handleDragLeave}
        onDrop={(e) => handleDrop(e, index)}
        onClick={handleSlotClick}
        onMouseDown={handlePhotoMouseDown}
        onContextMenu={(e) => {
          if (onElementContextMenu && !readOnly && photo) {
            onElementContextMenu(e, 'photo', photo);
          }
        }}
        className={`relative select-none flex items-center justify-center overflow-hidden ${aspectClass} ${extraClass} ${
          isDraggingThis ? 'cursor-grabbing z-40' : 'cursor-pointer'
        } ${
          isDragOver ? 'ring-4 ring-amber-500 scale-[0.99] z-20' : ''
        } ${isSelected && !readOnly && !isDraggingThis ? 'ring-2 ring-amber-500 ring-offset-2 z-30 animate-select-pulse' : ''} ${
          hasMoved ? 'z-30' : 'z-10'
        }`}
      >
        {/* Drag Over Active Overlay — pointer-events-none 防止干扰拖拽事件 / prevent interfering with drag events */}
        {isDragOver && (
          <div className="absolute inset-0 bg-amber-500/80 backdrop-blur-[2px] z-30 flex flex-col items-center justify-center text-white text-xs font-mono font-bold uppercase tracking-wider gap-1 border-2 border-white animate-pulse pointer-events-none">
            <span>⚡ 松开鼠标替换图片</span>
            <span className="text-[10px] font-normal opacity-90">RELEASE TO APPLY</span>
          </div>
        )}

        {photo?.url ? (
          <div
            className={`relative flex items-center justify-center transition-all duration-75 ${
              isDraggingThis ? 'shadow-2xl opacity-95 ring-2 ring-black' : ''
            }`}
            style={{
              width: customAspectRatio ? '100%' : cropWidthStr,
              height: customAspectRatio ? 'auto' : cropHeightStr,
              maxWidth: cropWidthStr,
              maxHeight: cropHeightStr,
              aspectRatio: customAspectRatio,
              borderRadius: borderRadiusStr,
              overflow: 'hidden',
              transform: `translate(${currentOffsetX}%, ${currentOffsetY}%)`,
              margin: 'auto',
            }}
          >
            <img
              src={photo.url}
              alt="Magazine imagery"
              referrerPolicy="no-referrer"
              crossOrigin="anonymous"
              style={{
                objectFit: photo.fit || 'cover',
                transform: `scale(${photo.scale || 1}) rotate(${rotation}deg)`,
                filter: getFilterCss(photo.filter),
                borderRadius: borderRadiusStr,
              }}
              className={`w-full h-full ${photo.shadow ? 'shadow-md' : 'shadow-none'} ${
                isDraggingThis ? 'transition-none pointer-events-none' : 'transition-transform duration-200'
              } ${
                isDragOver ? 'pointer-events-none' : ''
              } ${
                panoramicSide === 'left'
                  ? 'w-[200%] max-w-none'
                  : panoramicSide === 'right'
                  ? 'w-[200%] max-w-none -ml-[100%]'
                  : 'w-full'
              } ${photo.border ? 'border border-zinc-900/40 p-2 bg-white shadow-md' : ''}`}
            />

            {/* Live Dragging HUD Badge */}
            {isDraggingThis && (
              <div className="absolute inset-0 bg-black/30 backdrop-blur-[1px] z-30 flex flex-col items-center justify-center text-white pointer-events-none rounded">
                <div className="bg-black/90 text-white px-3 py-1.5 rounded-full text-xs font-mono flex items-center gap-2 border border-white/30 shadow-xl animate-pulse">
                  <Move className="w-4 h-4 text-amber-400" />
                  <span>
                    整体平移 X: {currentOffsetX > 0 ? `+${currentOffsetX}` : currentOffsetX}% | Y:{' '}
                    {currentOffsetY > 0 ? `+${currentOffsetY}` : currentOffsetY}%
                  </span>
                </div>
              </div>
            )}

            {/* Hover Move Badge Indicator */}
            {!readOnly && !isDraggingThis && (
              <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity z-20 pointer-events-none">
                <div className="bg-black/80 text-white text-[10px] font-mono px-2 py-1 rounded shadow flex items-center gap-1.5 border border-white/20">
                  <Move className="w-3.5 h-3.5 text-amber-300" />
                  <span>按住拖拽整体平移</span>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="w-full h-full bg-zinc-200/60 border border-dashed border-zinc-400/80 flex flex-col items-center justify-center p-4 text-center text-zinc-500 text-xs">
            <span className="font-mono uppercase tracking-wider text-[10px] mb-1">图片槽位 #{index + 1}</span>
            <span className="text-[11px] font-sans">从左侧素材库拖拽图片至此处</span>
          </div>
        )}
      </div>
    );
  };

  // Layout templates rendering logic based on templateId
  const { templateId, photos, texts, bgColor, showPageNumbers, brandHeading, padding } = page;

  const currentPadding = padding !== undefined ? padding : 32;
  const paddingPx = currentPadding * scaleRatio;

  return (
    <div
      style={{
        backgroundColor: bgColor || '#ffffff',
        padding: `${paddingPx}px`,
      }}
      onContextMenu={(e) => {
        if (onCanvasContextMenu && !readOnly) {
          onCanvasContextMenu(e);
        }
      }}
      className="relative w-full h-full flex flex-col justify-between select-none overflow-hidden shadow-sm transition-all duration-300"
    >
      {/* Main Page Content Area */}
      <div className="w-full h-full flex flex-col justify-between relative overflow-hidden">
        {/* 拖拽对齐辅助线 / Drag alignment guides overlay */}
        {(draggingTextId !== null || draggingPhotoIndex !== null) && !readOnly && (
          <div className="absolute inset-0 z-50 pointer-events-none">
            {/* 垂直辅助线 / Vertical guides */}
            {GUIDE_POSITIONS.map((pos) => (
              <div
                key={`v-${pos}`}
                className={`absolute top-0 bottom-0 w-px transition-opacity duration-150 ${
                  activeGuides.vertical.includes(pos)
                    ? 'bg-amber-500 opacity-100 shadow-[0_0_4px_rgba(245,158,11,0.6)]'
                    : 'bg-blue-400/30 opacity-60'
                }`}
                style={{ left: `${pos}%` }}
              />
            ))}
            {/* 水平辅助线 / Horizontal guides */}
            {GUIDE_POSITIONS.map((pos) => (
              <div
                key={`h-${pos}`}
                className={`absolute left-0 right-0 h-px transition-opacity duration-150 ${
                  activeGuides.horizontal.includes(pos)
                    ? 'bg-amber-500 opacity-100 shadow-[0_0_4px_rgba(245,158,11,0.6)]'
                    : 'bg-blue-400/30 opacity-60'
                }`}
                style={{ top: `${pos}%` }}
              />
            ))}
          </div>
        )}
        {/* ================= 1. COVER TEMPLATES ================= */}
        {templateId === 'cover-classic-journal' && (
          <div className="relative w-full h-full flex flex-col justify-between">
            <div className="absolute inset-0 rounded overflow-hidden">
              {renderPhotoSlot(photos[0], 0, 'w-full h-full', '')}
            </div>
            <div className="relative z-10 bg-white/95 backdrop-blur-md p-6 max-w-[85%] border border-zinc-900/10 shadow-xl m-4 mt-6">
              {texts.slice(0, 4).map(renderText)}
            </div>
          </div>
        )}

        {templateId === 'cover-slice-sinai' && (
          <div className="relative w-full h-full flex items-center justify-between px-4">
            <div className="w-[45%] flex flex-col justify-center gap-4 z-10">
              {texts.map(renderText)}
            </div>
            <div className="w-[50%] h-[90%] shadow-2xl border border-zinc-900/20">
              {renderPhotoSlot(photos[0], 0, 'w-full h-full', '')}
            </div>
          </div>
        )}

        {templateId === 'cover-chilling-star' && (
          <div className="relative w-full h-full flex">
            <div className="w-1/2 h-full pr-2">
              {renderPhotoSlot(photos[0], 0, 'w-full h-full', '')}
            </div>
            <div className="w-1/2 h-full pl-2 flex flex-col justify-between bg-amber-50/50 p-4 border border-amber-900/10">
              <div className="space-y-3">{texts.map(renderText)}</div>
              <div className="h-32 mt-2">{renderPhotoSlot(photos[1], 1, 'w-full h-full', '')}</div>
            </div>
          </div>
        )}

        {templateId === 'cover-monograph-vogue' && (
          <div className="relative w-full h-full flex flex-col justify-between items-center text-center p-2">
            <div className="w-full space-y-1 mb-2">{texts.slice(0, 2).map(renderText)}</div>
            <div className="flex-1 w-full my-2 border border-white/20 p-2 bg-black/40">
              {renderPhotoSlot(photos[0], 0, 'w-full h-full', '')}
            </div>
            <div className="w-full pt-1">{texts.slice(2).map(renderText)}</div>
          </div>
        )}

        {templateId === 'cover-brutalist-grid' && (
          <div className="w-full h-full flex flex-col justify-between border-2 border-white/30 p-2 gap-2">
            <div className="flex justify-between items-start">
              <div className="space-y-1">{texts.slice(0, 1).map(renderText)}</div>
              {texts[1] && <div className="self-center">{renderText(texts[1])}</div>}
            </div>
            <div className="grid grid-cols-3 gap-1.5 flex-1 min-h-0">
              {renderPhotoSlot(photos[0], 0, 'w-full h-full', '')}
              {renderPhotoSlot(photos[1], 1, 'w-full h-full', '')}
              {renderPhotoSlot(photos[2], 2, 'w-full h-full', '')}
            </div>
          </div>
        )}

        {templateId === 'cover-french-elegance' && (
          <div className="w-full h-full flex flex-col justify-between items-center text-center p-4">
            <div className="space-y-2 max-w-md my-2">
              {texts.slice(0, 2).map(renderText)}
            </div>
            <div className="w-56 h-[58%] my-auto shadow-xl border border-zinc-900/20">
              {renderPhotoSlot(photos[0], 0, 'w-full h-full', '')}
            </div>
            <div className="max-w-md mt-2">
              {texts.slice(2).map(renderText)}
            </div>
          </div>
        )}

        {/* ================= 2. SINGLE_1 TEMPLATES ================= */}
        {templateId === 'single-1-about' && (
          <div className="w-full h-full flex flex-col justify-between gap-4">
            <div className="space-y-3">{texts.map(renderText)}</div>
            {photos[0] && (
              <div className="flex-1 w-full min-h-[220px]">
                {renderPhotoSlot(photos[0], 0, 'w-full h-full', '')}
              </div>
            )}
          </div>
        )}

        {templateId === 'single-1-mountain-breeze' && (
          <div className="w-full h-full flex flex-col justify-between p-2">
            <div className="space-y-4 max-w-sm">{texts.map(renderText)}</div>
            {photos[0] && (
              <div className="w-full h-[65%] mt-4 shadow-md">
                {renderPhotoSlot(photos[0], 0, 'w-full h-full', '')}
              </div>
            )}
          </div>
        )}

        {templateId === 'single-1-full-bleed' && (
          <div className="relative w-full h-full">
            <div className="absolute inset-0">
              {renderPhotoSlot(photos[0], 0, 'w-full h-full', '')}
            </div>
            <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-md p-4 max-w-[75%] border border-zinc-200 space-y-1">
              {texts.map(renderText)}
            </div>
          </div>
        )}

        {templateId === 'single-1-minimal-square' && (
          <div className="w-full h-full flex flex-col justify-between items-center text-center p-2">
            <div className="space-y-1 mb-2">{texts.slice(0, 2).map(renderText)}</div>
            <div className="w-64 h-64 my-auto shadow-md border border-zinc-300">
              {renderPhotoSlot(photos[0], 0, 'w-full h-full', '')}
            </div>
            <div className="max-w-xs mt-2">{texts.slice(2).map(renderText)}</div>
          </div>
        )}

        {templateId === 'single-1-editorial-portrait' && (
          <div className="w-full h-full flex gap-4">
            <div className="w-[45%] flex flex-col justify-center space-y-4 pr-2">
              {texts.map(renderText)}
            </div>
            <div className="w-[55%] h-full shadow-lg">
              {renderPhotoSlot(photos[0], 0, 'w-full h-full', '')}
            </div>
          </div>
        )}

        {templateId === 'single-1-zen-balance' && (
          <div className="w-full h-full flex flex-col justify-between p-2 relative">
            <div className="flex justify-between items-start h-full">
              <div className="flex flex-col justify-end h-full pb-4 pl-2 space-y-3">
                {texts.map(renderText)}
              </div>
              <div className="w-52 h-64 shadow-md border border-stone-200">
                {renderPhotoSlot(photos[0], 0, 'w-full h-full', '')}
              </div>
            </div>
          </div>
        )}

        {/* ================= 3. DOUBLE_2 TEMPLATES ================= */}
        {templateId === 'double-2-asymmetric' && (
          <div className="w-full h-full flex flex-col justify-between gap-3">
            <div className="flex gap-4 items-center">
              <div className="w-1/2">{renderPhotoSlot(photos[0], 0, 'w-full h-48', '')}</div>
              <div className="w-1/2 space-y-2">{texts.map(renderText)}</div>
            </div>
            <div className="w-full h-36">{renderPhotoSlot(photos[1], 1, 'w-full h-full', '')}</div>
          </div>
        )}

        {templateId === 'double-2-teixeira' && (
          <div className="w-full h-full flex flex-col justify-between p-2 gap-4">
            <div className="space-y-3">{texts.map(renderText)}</div>
            <div className="flex items-center gap-3 h-[60%]">
              <div className="w-full h-full">{renderPhotoSlot(photos[0], 0, 'w-full h-full', '')}</div>
              {photos[1] && <div className="w-24 h-24 shrink-0">{renderPhotoSlot(photos[1], 1, 'w-full h-full', '')}</div>}
            </div>
          </div>
        )}

        {templateId === 'double-2-diptych-classic' && (
          <div className="w-full h-full flex flex-col justify-between gap-3">
            <div className="space-y-1">{texts.slice(0, 1).map(renderText)}</div>
            <div className="grid grid-cols-2 gap-3 flex-1">
              {renderPhotoSlot(photos[0], 0, 'w-full h-full', '')}
              {renderPhotoSlot(photos[1], 1, 'w-full h-full', '')}
            </div>
            <div className="pt-1">{texts.slice(1).map(renderText)}</div>
          </div>
        )}

        {templateId === 'double-2-hero-inset' && (
          <div className="w-full h-full flex flex-col gap-3">
            <div className="w-full h-[60%] shadow-md">
              {renderPhotoSlot(photos[0], 0, 'w-full h-full', '')}
            </div>
            <div className="flex items-center justify-between gap-4 flex-1">
              <div className="space-y-2 flex-1">{texts.map(renderText)}</div>
              <div className="w-28 h-28 shrink-0 shadow-md">
                {renderPhotoSlot(photos[1], 1, 'w-full h-full', '')}
              </div>
            </div>
          </div>
        )}

        {templateId === 'double-2-landscape-stacked' && (
          <div className="w-full h-full flex flex-col justify-between gap-2">
            <div className="w-full h-[40%] shadow-sm">
              {renderPhotoSlot(photos[0], 0, 'w-full h-full', '')}
            </div>
            <div className="py-2 border-y border-zinc-200/80 space-y-1">{texts.map(renderText)}</div>
            <div className="w-full h-[40%] shadow-sm">
              {renderPhotoSlot(photos[1], 1, 'w-full h-full', '')}
            </div>
          </div>
        )}

        {templateId === 'double-2-polaroid-overlap' && (
          <div className="w-full h-full flex flex-col justify-between p-2">
            <div className="space-y-1 mb-2">{texts.slice(0, 1).map(renderText)}</div>
            <div className="relative flex-1 my-2 flex items-center justify-center">
              <div className="w-44 h-56 absolute left-6 top-2 shadow-xl -rotate-3 z-0 p-2 bg-white border border-stone-200">
                {renderPhotoSlot(photos[0], 0, 'w-full h-full', '')}
              </div>
              <div className="w-44 h-56 absolute right-6 bottom-2 shadow-2xl rotate-3 z-10 p-2 bg-white border border-stone-200">
                {renderPhotoSlot(photos[1], 1, 'w-full h-full', '')}
              </div>
            </div>
            <div className="pt-2 text-center">{texts.slice(1).map(renderText)}</div>
          </div>
        )}

        {templateId === 'cross-spread-panorama-left' && (
          <div className="relative w-full h-full overflow-hidden bg-black -m-6 sm:-m-8 p-6 sm:p-8">
            <div className="absolute inset-0">
              {renderPhotoSlot(photos[0], 0, 'w-full h-full', '', 'left')}
            </div>
            <div className="relative z-10 p-6 flex flex-col justify-between h-full bg-gradient-to-r from-black/70 via-black/30 to-transparent pointer-events-none">
              <div className="pointer-events-auto space-y-2 mt-auto">{texts.map(renderText)}</div>
            </div>
          </div>
        )}

        {templateId === 'cross-spread-panorama-right' && (
          <div className="relative w-full h-full overflow-hidden bg-black -m-6 sm:-m-8 p-6 sm:p-8">
            <div className="absolute inset-0">
              {renderPhotoSlot(photos[0], 0, 'w-full h-full', '', 'right')}
            </div>
            <div className="relative z-10 p-6 flex flex-col justify-end items-end h-full bg-gradient-to-l from-black/70 via-black/30 to-transparent pointer-events-none text-right">
              <div className="pointer-events-auto space-y-2 max-w-xs">{texts.map(renderText)}</div>
            </div>
          </div>
        )}

        {templateId === 'cross-spread-cinematic-left' && (
          <div className="relative w-full h-full bg-zinc-950 flex flex-col justify-between p-2">
            <div className="flex justify-between items-center text-[10px] font-mono tracking-widest text-zinc-500 uppercase pb-1 border-b border-zinc-800">
              <span>21:9 CINEMATIC SPREAD</span>
              <span>FRAME A</span>
            </div>
            <div className="relative w-full h-[72%] my-auto shadow-2xl border-y border-zinc-800">
              {renderPhotoSlot(photos[0], 0, 'w-full h-full', '', 'left')}
            </div>
            <div className="pt-2">{texts.map(renderText)}</div>
          </div>
        )}

        {templateId === 'cross-spread-cinematic-right' && (
          <div className="relative w-full h-full bg-zinc-950 flex flex-col justify-between p-2">
            <div className="flex justify-between items-center text-[10px] font-mono tracking-widest text-zinc-500 uppercase pb-1 border-b border-zinc-800">
              <span>21:9 CINEMATIC SPREAD</span>
              <span>FRAME B</span>
            </div>
            <div className="relative w-full h-[72%] my-auto shadow-2xl border-y border-zinc-800">
              {renderPhotoSlot(photos[0], 0, 'w-full h-full', '', 'right')}
            </div>
            <div className="pt-2 text-right">{texts.map(renderText)}</div>
          </div>
        )}

        {/* ================= 4. TRIPLE_3 TEMPLATES ================= */}
        {templateId === 'triple-3-film-strip' && (
          <div className="w-full h-full flex flex-col justify-between gap-3">
            <div className="space-y-2">{texts.map(renderText)}</div>
            <div className="grid grid-cols-3 gap-2 flex-1">
              {renderPhotoSlot(photos[0], 0, 'w-full h-full', '')}
              {renderPhotoSlot(photos[1], 1, 'w-full h-full', '')}
              {renderPhotoSlot(photos[2], 2, 'w-full h-full', '')}
            </div>
          </div>
        )}

        {templateId === 'triple-3-poetry-tall' && (
          <div className="w-full h-full flex flex-col justify-between">
            <div className="mb-3">{texts.map(renderText)}</div>
            <div className="grid grid-cols-3 gap-2 h-[75%]">
              {renderPhotoSlot(photos[0], 0, 'w-full h-full', '')}
              {renderPhotoSlot(photos[1], 1, 'w-full h-full', '')}
              {renderPhotoSlot(photos[2], 2, 'w-full h-full', '')}
            </div>
          </div>
        )}

        {templateId === 'triple-3-triptych-horizon' && (
          <div className="w-full h-full flex flex-col justify-between">
            <div className="space-y-1 mb-2">{texts.map(renderText)}</div>
            <div className="grid grid-cols-3 gap-1 flex-1">
              {renderPhotoSlot(photos[0], 0, 'w-full h-full', '')}
              {renderPhotoSlot(photos[1], 1, 'w-full h-full', '')}
              {renderPhotoSlot(photos[2], 2, 'w-full h-full', '')}
            </div>
          </div>
        )}

        {templateId === 'triple-3-featured-hero' && (
          <div className="w-full h-full flex flex-col gap-2">
            <div className="w-full h-[52%] shadow-sm">
              {renderPhotoSlot(photos[0], 0, 'w-full h-full', '')}
            </div>
            <div className="flex gap-2 h-[45%]">
              <div className="w-1/2 grid grid-cols-2 gap-2">
                {renderPhotoSlot(photos[1], 1, 'w-full h-full', '')}
                {renderPhotoSlot(photos[2], 2, 'w-full h-full', '')}
              </div>
              <div className="w-1/2 p-2 bg-stone-100/60 border border-zinc-200/80 flex flex-col justify-center gap-1">
                {texts.map(renderText)}
              </div>
            </div>
          </div>
        )}

        {templateId === 'triple-3-staggered-cascade' && (
          <div className="w-full h-full flex flex-col justify-between">
            <div className="space-y-1 mb-2">{texts.map(renderText)}</div>
            <div className="grid grid-cols-3 gap-2 flex-1 items-stretch">
              <div className="h-[80%] my-auto shadow-sm">{renderPhotoSlot(photos[0], 0, 'w-full h-full', '')}</div>
              <div className="h-[95%] my-auto shadow-sm">{renderPhotoSlot(photos[1], 1, 'w-full h-full', '')}</div>
              <div className="h-[75%] my-auto shadow-sm">{renderPhotoSlot(photos[2], 2, 'w-full h-full', '')}</div>
            </div>
          </div>
        )}

        {/* ================= 5. QUAD_4 TEMPLATES ================= */}
        {templateId === 'quad-4-guest-restaurant' && (
          <div className="w-full h-full flex flex-col justify-between gap-3">
            <div className="bg-zinc-100 p-3 border-l-2 border-zinc-800 space-y-2">{texts.map(renderText)}</div>
            <div className="grid grid-cols-2 gap-2 flex-1">
              {renderPhotoSlot(photos[0], 0, 'w-full h-full', '')}
              {renderPhotoSlot(photos[1], 1, 'w-full h-full', '')}
              {renderPhotoSlot(photos[2], 2, 'w-full h-full', '')}
              {renderPhotoSlot(photos[3], 3, 'w-full h-full', '')}
            </div>
          </div>
        )}

        {templateId === 'quad-4-clean-grid' && (
          <div className="w-full h-full flex flex-col justify-between gap-2">
            <div className="space-y-1 pb-1">{texts.map(renderText)}</div>
            <div className="grid grid-cols-2 gap-2 flex-1">
              {renderPhotoSlot(photos[0], 0, 'w-full h-full', '')}
              {renderPhotoSlot(photos[1], 1, 'w-full h-full', '')}
              {renderPhotoSlot(photos[2], 2, 'w-full h-full', '')}
              {renderPhotoSlot(photos[3], 3, 'w-full h-full', '')}
            </div>
          </div>
        )}

        {templateId === 'quad-4-magazine-mosaic' && (
          <div className="w-full h-full flex gap-2">
            <div className="w-1/2 h-full shadow-sm">
              {renderPhotoSlot(photos[0], 0, 'w-full h-full', '')}
            </div>
            <div className="w-1/2 h-full flex flex-col justify-between gap-1.5">
              <div className="space-y-1 p-2 bg-stone-100 border border-zinc-200">{texts.map(renderText)}</div>
              <div className="grid grid-cols-3 gap-1 flex-1">
                {renderPhotoSlot(photos[1], 1, 'w-full h-full', '')}
                {renderPhotoSlot(photos[2], 2, 'w-full h-full', '')}
                {renderPhotoSlot(photos[3], 3, 'w-full h-full', '')}
              </div>
            </div>
          </div>
        )}

        {templateId === 'quad-4-film-contact-strip' && (
          <div className="w-full h-full flex flex-col justify-between p-1 bg-zinc-900 border border-zinc-700">
            <div className="space-y-1 p-2 border-b border-zinc-800">{texts.map(renderText)}</div>
            <div className="grid grid-rows-4 gap-1 flex-1 py-1">
              {renderPhotoSlot(photos[0], 0, 'w-full h-full', '')}
              {renderPhotoSlot(photos[1], 1, 'w-full h-full', '')}
              {renderPhotoSlot(photos[2], 2, 'w-full h-full', '')}
              {renderPhotoSlot(photos[3], 3, 'w-full h-full', '')}
            </div>
          </div>
        )}

        {templateId === 'quad-4-museum-wall' && (
          <div className="w-full h-full flex flex-col justify-between gap-2">
            <div className="space-y-1 pb-1">{texts.map(renderText)}</div>
            <div className="grid grid-cols-12 grid-rows-2 gap-2 flex-1">
              <div className="col-span-7 row-span-2 shadow-md">{renderPhotoSlot(photos[0], 0, 'w-full h-full', '')}</div>
              <div className="col-span-5 row-span-1 shadow-sm">{renderPhotoSlot(photos[1], 1, 'w-full h-full', '')}</div>
              <div className="col-span-2 row-span-1 shadow-sm">{renderPhotoSlot(photos[2], 2, 'w-full h-full', '')}</div>
              <div className="col-span-3 row-span-1 shadow-sm">{renderPhotoSlot(photos[3], 3, 'w-full h-full', '')}</div>
            </div>
          </div>
        )}

        {/* ================= 6. MULTI_5PLUS TEMPLATES ================= */}
        {templateId === 'multi-6-film-strip' && (
          <div className="w-full h-full flex flex-col justify-between">
            <div className="grid grid-cols-3 gap-2 h-[80%]">
              {renderPhotoSlot(photos[0], 0, 'w-full h-full', '')}
              {renderPhotoSlot(photos[1], 1, 'w-full h-full', '')}
              {renderPhotoSlot(photos[2], 2, 'w-full h-full', '')}
              {renderPhotoSlot(photos[3], 3, 'w-full h-full', '')}
              {renderPhotoSlot(photos[4], 4, 'w-full h-full', '')}
              {renderPhotoSlot(photos[5], 5, 'w-full h-full', '')}
            </div>
            <div className="mt-2">{texts.map(renderText)}</div>
          </div>
        )}

        {templateId === 'multi-5-story-board' && (
          <div className="w-full h-full flex flex-col justify-between gap-2">
            <div className="space-y-1">{texts.map(renderText)}</div>
            <div className="flex gap-2 flex-1">
              <div className="w-[60%] h-full">
                {renderPhotoSlot(photos[0], 0, 'w-full h-full', '')}
              </div>
              <div className="w-[40%] grid grid-cols-2 gap-1.5 h-full">
                {renderPhotoSlot(photos[1], 1, 'w-full h-full', '')}
                {renderPhotoSlot(photos[2], 2, 'w-full h-full', '')}
                {renderPhotoSlot(photos[3], 3, 'w-full h-full', '')}
                {renderPhotoSlot(photos[4], 4, 'w-full h-full', '')}
              </div>
            </div>
          </div>
        )}

        {templateId === 'multi-5-fashion-runway' && (
          <div className="w-full h-full flex flex-col justify-between p-2">
            <div className="space-y-1 mb-2">{texts.map(renderText)}</div>
            <div className="grid grid-cols-5 gap-1 flex-1">
              {renderPhotoSlot(photos[0], 0, 'w-full h-full', '')}
              {renderPhotoSlot(photos[1], 1, 'w-full h-full', '')}
              {renderPhotoSlot(photos[2], 2, 'w-full h-full', '')}
              {renderPhotoSlot(photos[3], 3, 'w-full h-full', '')}
              {renderPhotoSlot(photos[4], 4, 'w-full h-full', '')}
            </div>
          </div>
        )}

        {templateId === 'multi-8-contact-sheet' && (
          <div className="w-full h-full flex flex-col justify-between p-2 bg-zinc-900 border border-zinc-800">
            <div className="space-y-1 mb-2">{texts.map(renderText)}</div>
            <div className="grid grid-cols-4 grid-rows-2 gap-1.5 flex-1">
              {photos.slice(0, 8).map((p, idx) => renderPhotoSlot(p, idx, 'w-full h-full', ''))}
            </div>
          </div>
        )}

        {templateId === 'multi-7-editorial-collage' && (
          <div className="w-full h-full flex flex-col justify-between gap-2">
            <div className="space-y-1 mb-1">{texts.map(renderText)}</div>
            <div className="flex gap-2 flex-1">
              <div className="w-1/2 h-full shadow-sm">
                {renderPhotoSlot(photos[0], 0, 'w-full h-full', '')}
              </div>
              <div className="w-1/2 grid grid-cols-2 grid-rows-3 gap-1.5 h-full">
                {photos.slice(1, 7).map((p, idx) => renderPhotoSlot(p, idx + 1, 'w-full h-full', ''))}
              </div>
            </div>
          </div>
        )}

        {/* ================= 7. TEXT_ONLY TEMPLATES ================= */}
        {templateId === 'text-only-manifesto' && (
          <div className="w-full h-full flex flex-col justify-center items-center text-center p-6 space-y-6 max-w-lg mx-auto">
            {texts.map(renderText)}
          </div>
        )}

        {templateId === 'text-only-manifesto-dark' && (
          <div className="w-full h-full flex flex-col justify-between items-center text-center p-8 space-y-6 bg-[#0d0d0d]">
            <div className="space-y-4 my-auto max-w-md">
              {texts.slice(0, 3).map(renderText)}
            </div>
            {texts[3] && <div className="mt-auto">{renderText(texts[3])}</div>}
          </div>
        )}

        {templateId === 'text-only-interview-qa' && (
          <div className="w-full h-full flex flex-col justify-between p-6 space-y-4">
            <div className="border-b border-black/20 pb-3">
              {texts[0] && renderText(texts[0])}
            </div>
            <div className="flex-1 space-y-3 overflow-hidden py-2">
              {texts.slice(1).map(renderText)}
            </div>
          </div>
        )}

        {templateId === 'text-only-quote-minimal' && (
          <div className="w-full h-full flex flex-col justify-center items-center text-center p-8 space-y-4 relative">
            {texts.map(renderText)}
          </div>
        )}

        {templateId === 'text-only-magazine-index' && (
          <div className="w-full h-full flex flex-col justify-between p-6 space-y-4">
            <div className="border-b border-black/30 pb-2 space-y-1">
              {texts.slice(0, 2).map(renderText)}
            </div>
            <div className="grid grid-cols-2 gap-4 flex-1">
              <div className="space-y-2">{texts[2] && renderText(texts[2])}</div>
              <div className="space-y-2">{texts[3] && renderText(texts[3])}</div>
            </div>
          </div>
        )}

        {templateId === 'text-only-index' && (
          <div className="w-full h-full flex flex-col justify-start p-4 space-y-6">
            {texts.map(renderText)}
          </div>
        )}

        {templateId === 'text-only-colophon' && (
          <div className="w-full h-full flex flex-col justify-between p-6 space-y-4">
            <div className="space-y-2 border-b border-zinc-300/80 pb-4">
              {texts.slice(0, 2).map(renderText)}
            </div>
            <div className="grid grid-cols-2 gap-4 flex-1 py-2">
              <div className="space-y-2">{texts[2] && renderText(texts[2])}</div>
              <div className="space-y-2 flex flex-col justify-end">{texts[3] && renderText(texts[3])}</div>
            </div>
          </div>
        )}

        {/* ================= 8. JAPANESE & NORDIC/BAUHAUS TEMPLATES ================= */}
        {templateId === 'cover-japanese-wabi' && (
          <div className="w-full h-full flex justify-between items-center p-2 relative">
            <div className="flex flex-col justify-between h-full py-4 pl-2 space-y-4">
              <div>{texts[1] && renderText(texts[1])}</div>
              <div className="my-auto">{texts[0] && renderText(texts[0])}</div>
              <div>{texts[2] && renderText(texts[2])}</div>
            </div>
            <div className="w-48 h-[80%] my-auto shadow-md border border-stone-300 p-2 bg-white/60">
              {renderPhotoSlot(photos[0], 0, 'w-full h-full', '')}
            </div>
          </div>
        )}

        {templateId === 'single-1-japanese-ma' && (
          <div className="w-full h-full flex flex-col justify-between p-4 items-center">
            <div className="w-36 h-36 my-auto shadow-sm border border-stone-200 p-1.5 bg-white">
              {renderPhotoSlot(photos[0], 0, 'w-full h-full', '')}
            </div>
            <div className="w-full flex justify-between items-end pt-4">
              <div>{texts[0] && renderText(texts[0])}</div>
              <div className="max-w-[180px] text-right">{texts[1] && renderText(texts[1])}</div>
            </div>
          </div>
        )}

        {templateId === 'double-2-japanese-grid' && (
          <div className="w-full h-full flex justify-between items-center p-2">
            <div className="w-40 h-52 shadow-sm border border-stone-200">
              {renderPhotoSlot(photos[0], 0, 'w-full h-full', '')}
            </div>
            <div className="flex flex-col items-center justify-center mx-2 space-y-2">
              {texts[0] && renderText(texts[0])}
              {texts[1] && renderText(texts[1])}
            </div>
            <div className="w-40 h-52 shadow-sm border border-stone-200 mt-12">
              {renderPhotoSlot(photos[1], 1, 'w-full h-full', '')}
            </div>
          </div>
        )}

        {templateId === 'triple-3-japanese-chashitsu' && (
          <div className="w-full h-full flex flex-col justify-between p-2">
            <div className="space-y-1 mb-2">{texts.map(renderText)}</div>
            <div className="grid grid-cols-3 gap-3 flex-1">
              <div className="h-full shadow-sm p-1 bg-white border border-stone-200">{renderPhotoSlot(photos[0], 0, 'w-full h-full', '')}</div>
              <div className="h-full shadow-sm p-1 bg-white border border-stone-200">{renderPhotoSlot(photos[1], 1, 'w-full h-full', '')}</div>
              <div className="h-full shadow-sm p-1 bg-white border border-stone-200">{renderPhotoSlot(photos[2], 2, 'w-full h-full', '')}</div>
            </div>
          </div>
        )}

        {templateId === 'text-only-haiku' && (
          <div className="w-full h-full flex flex-col justify-between p-8">
            <div className="flex justify-around items-start h-[75%] pt-4">
              {texts[0] && renderText(texts[0])}
              {texts[1] && renderText(texts[1])}
            </div>
            <div className="pt-4 border-t border-stone-300 flex justify-between items-center">
              <div>{texts[2] && renderText(texts[2])}</div>
              <div className="w-6 h-6 border-2 border-red-800 text-red-800 text-[10px] flex items-center justify-center font-bold rounded-sm">印</div>
            </div>
          </div>
        )}

        {templateId === 'single-1-nordic-hygge' && (
          <div className="w-full h-full flex flex-col justify-between p-2 relative">
            <div className="space-y-2 z-10 max-w-xs">{texts.map(renderText)}</div>
            <div className="w-64 h-80 absolute right-2 bottom-2 shadow-xl border border-slate-200">
              {renderPhotoSlot(photos[0], 0, 'w-full h-full', '')}
            </div>
          </div>
        )}

        {templateId === 'quad-4-bauhaus-grid' && (
          <div className="w-full h-full flex flex-col justify-between p-2 gap-2">
            <div className="space-y-1">{texts.map(renderText)}</div>
            <div className="grid grid-cols-2 grid-rows-2 gap-2 flex-1 border-2 border-black p-1 bg-black">
              <div className="bg-white p-1">{renderPhotoSlot(photos[0], 0, 'w-full h-full', '')}</div>
              <div className="bg-white p-1">{renderPhotoSlot(photos[1], 1, 'w-full h-full', '')}</div>
              <div className="bg-white p-1">{renderPhotoSlot(photos[2], 2, 'w-full h-full', '')}</div>
              <div className="bg-white p-1">{renderPhotoSlot(photos[3], 3, 'w-full h-full', '')}</div>
            </div>
          </div>
        )}

        {/* ================= FALLBACK GRID RENDERER ================= */}
        {!['cover-classic-journal', 'cover-slice-sinai', 'cover-chilling-star', 'cover-monograph-vogue', 'cover-brutalist-grid', 'cover-french-elegance', 'cover-japanese-wabi',
           'single-1-about', 'single-1-mountain-breeze', 'single-1-full-bleed', 'single-1-minimal-square', 'single-1-editorial-portrait', 'single-1-zen-balance', 'single-1-japanese-ma', 'single-1-nordic-hygge',
           'double-2-asymmetric', 'double-2-teixeira', 'double-2-diptych-classic', 'double-2-hero-inset', 'double-2-landscape-stacked', 'double-2-polaroid-overlap', 'double-2-japanese-grid',
           'cross-spread-panorama-left', 'cross-spread-panorama-right', 'cross-spread-cinematic-left', 'cross-spread-cinematic-right',
           'triple-3-film-strip', 'triple-3-poetry-tall', 'triple-3-triptych-horizon', 'triple-3-featured-hero', 'triple-3-staggered-cascade', 'triple-3-japanese-chashitsu',
           'quad-4-guest-restaurant', 'quad-4-clean-grid', 'quad-4-magazine-mosaic', 'quad-4-film-contact-strip', 'quad-4-museum-wall', 'quad-4-bauhaus-grid',
           'multi-6-film-strip', 'multi-5-story-board', 'multi-5-fashion-runway', 'multi-8-contact-sheet', 'multi-7-editorial-collage',
           'text-only-manifesto', 'text-only-index', 'text-only-colophon', 'text-only-haiku'].includes(templateId) && (
          <div className="w-full h-full flex flex-col justify-between">
            <div className="space-y-2 mb-4">{texts.map(renderText)}</div>
            {photos.length > 0 && (
              <div className={`grid gap-2 flex-1 ${
                photos.length >= 6 ? 'grid-cols-3' : photos.length >= 3 ? 'grid-cols-2' : 'grid-cols-1'
              }`}>
                {photos.map((p, idx) => renderPhotoSlot(p, idx, 'w-full h-full', ''))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
