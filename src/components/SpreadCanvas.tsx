import React from 'react';
import { MagazineSpread, PhotoElement, TextElement } from '../types';
import { PageRenderer } from './PageRenderer';
import { useRef, useState, useEffect } from 'react';

interface SpreadCanvasProps {
  spread: MagazineSpread;
  selectedElementId?: string | null;
  onSelectText?: (text: TextElement) => void;
  onSelectPhoto?: (photo: PhotoElement, slotIndex: number) => void;
  onUpdatePhotoByPage?: (pageId: string, slotIndex: number, updatedPhoto: PhotoElement) => void;
  onUpdateTextByPage?: (pageId: string, textId: string, updatedText: TextElement) => void;
  onDropPhotoSlot?: (pageId: string, slotIndex: number, photoUrl: string) => void;
  zoomLevel?: number;
  readOnly?: boolean; // 全屏预览模式 / Preview mode
  onElementContextMenu?: (e: React.MouseEvent, type: 'text' | 'photo', element: TextElement | PhotoElement) => void;
  onCanvasContextMenu?: (e: React.MouseEvent) => void;
}

export const SpreadCanvas: React.FC<SpreadCanvasProps> = ({
  spread,
  selectedElementId,
  onSelectText,
  onSelectPhoto,
  onUpdatePhotoByPage,
  onUpdateTextByPage,
  onDropPhotoSlot,
  zoomLevel = 1,
  readOnly = false,
  onElementContextMenu,
  onCanvasContextMenu,
}) => {
  const { leftPage, rightPage, isCover } = spread;
  const prevSpreadId = useRef<string>(spread.id);
  const [slideDir, setSlideDir] = useState<'left' | 'right' | null>(null);

  // 跨页切换滑动动画 / Spread switch slide animation
  useEffect(() => {
    if (spread.id !== prevSpreadId.current) {
      // 简单判断方向：新spread在后面则右滑
      setSlideDir('right');
      prevSpreadId.current = spread.id;
      const timer = setTimeout(() => setSlideDir(null), 350);
      return () => clearTimeout(timer);
    }
  }, [spread.id]);

  const showSpine =
    !isCover &&
    leftPage?.showSpineLine !== false &&
    (!rightPage || rightPage.showSpineLine !== false);

  return (
    <div className="w-full h-full flex items-center justify-center p-4 sm:p-8 overflow-auto relative select-none">
      {/* Outer Studio Desk Shadow */}
      <div
        style={{
          transform: `scale(${zoomLevel})`,
          transformOrigin: 'center center',
          transition: 'transform 0.2s ease-out',
        }}
        className={`relative flex items-center shadow-2xl border border-[#E0E0DB] dark:border-neutral-700 bg-white dark:bg-neutral-900 overflow-hidden ${
          isCover ? 'w-[440px] h-[620px]' : 'w-[880px] h-[620px]'
        } ${slideDir === 'right' ? 'animate-slide-right' : ''}`}
        key={spread.id}
      >
        {/* Left Page or Cover Page */}
        <div className={`${isCover ? 'w-full' : 'w-1/2'} h-full relative`}>
          <PageRenderer
            page={leftPage}
            isLeft={true}
            selectedElementId={selectedElementId}
            onSelectText={onSelectText}
            onSelectPhoto={onSelectPhoto}
            onUpdatePhotoByPage={onUpdatePhotoByPage}
            onUpdateTextByPage={onUpdateTextByPage}
            onDropPhotoSlot={onDropPhotoSlot}
            readOnly={readOnly}
            onElementContextMenu={onElementContextMenu}
            onCanvasContextMenu={onCanvasContextMenu}
          />
        </div>

        {/* Central Spine Fold Line (Book Seam) */}
        {showSpine && (
          <div className="absolute left-1/2 top-0 bottom-0 w-8 -ml-4 z-30 pointer-events-none flex">
            {/* Spine Shadow */}
            <div className="w-full h-full bg-gradient-to-r from-transparent via-black/10 to-transparent" />
          </div>
        )}

        {/* Right Page (If spread) */}
        {!isCover && rightPage && (
          <div className="w-1/2 h-full relative">
            <PageRenderer
              page={rightPage}
              isLeft={false}
              selectedElementId={selectedElementId}
              onSelectText={onSelectText}
              onSelectPhoto={onSelectPhoto}
              onUpdatePhotoByPage={onUpdatePhotoByPage}
              onUpdateTextByPage={onUpdateTextByPage}
              onDropPhotoSlot={onDropPhotoSlot}
              readOnly={readOnly}
              onElementContextMenu={onElementContextMenu}
              onCanvasContextMenu={onCanvasContextMenu}
            />
          </div>
        )}
      </div>
    </div>
  );
};
