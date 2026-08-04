import React, { useEffect, useRef } from 'react';

export interface ContextMenuItem {
  label: string;
  labelEn?: string;
  icon?: React.ReactNode;
  onClick: () => void;
  danger?: boolean; // 红色危险动作 / red destructive action
  divider?: boolean; // 后方分隔线 / divider after this item
  disabled?: boolean;
}

interface ContextMenuProps {
  x: number;
  y: number;
  items: ContextMenuItem[];
  onClose: () => void;
}

/**
 * 右键上下文菜单 / Right-click context menu
 * 在指定位置弹出菜单，点击外部或 Esc 关闭
 * Pops up at given position; closes on outside click or Esc
 */
export const ContextMenu: React.FC<ContextMenuProps> = ({ x, y, items, onClose }) => {
  const menuRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        onClose();
      }
    };
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    // 延迟绑定以避免触发菜单的同一次点击 / Delay binding to avoid the same click that opened the menu
    const timer = setTimeout(() => {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleEsc);
    }, 0);
    return () => {
      clearTimeout(timer);
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEsc);
    };
  }, [onClose]);

  // 边界检测 / Boundary detection - keep menu within viewport
  const adjustedX = Math.min(x, window.innerWidth - 220);
  const adjustedY = Math.min(y, window.innerHeight - (items.length * 36 + 16));

  return (
    <div
      ref={menuRef}
      className="fixed z-[100] min-w-[200px] bg-white dark:bg-neutral-800 border border-[#E0E0DB] dark:border-neutral-600 shadow-2xl py-1.5 animate-page-enter"
      style={{ left: `${adjustedX}px`, top: `${adjustedY}px` }}
    >
      {items.map((item, idx) => (
        <React.Fragment key={idx}>
          <button
            disabled={item.disabled}
            onClick={() => {
              if (!item.disabled) {
                item.onClick();
                onClose();
              }
            }}
            className={`w-full flex items-center gap-2.5 px-3 py-2 text-left text-xs transition-colors ${
              item.disabled
                ? 'opacity-40 cursor-not-allowed'
                : item.danger
                ? 'text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20'
                : 'text-[#1A1A1A] dark:text-neutral-200 hover:bg-[#F0F0EE] dark:hover:bg-neutral-700'
            }`}
          >
            {item.icon && <span className="w-4 h-4 flex items-center justify-center shrink-0">{item.icon}</span>}
            <span className="flex-1 flex items-center justify-between">
              <span>{item.label}</span>
              {item.labelEn && (
                <span className="text-[9px] font-mono opacity-50 uppercase tracking-wider">{item.labelEn}</span>
              )}
            </span>
          </button>
          {item.divider && <div className="my-1 border-t border-[#E0E0DB] dark:border-neutral-600" />}
        </React.Fragment>
      ))}
    </div>
  );
};
