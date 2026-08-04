import React from 'react';
import { BookOpen, Edit3, Image as ImageIcon, Download, RotateCcw, ZoomIn, ZoomOut, Undo2, Redo2, Save, Sun, Moon } from 'lucide-react';

interface NavbarProps {
  activeView: 'flipbook' | 'editor' | 'library';
  onChangeView: (view: 'flipbook' | 'editor' | 'library') => void;
  onOpenExport: () => void;
  onResetMagazine: () => void;
  zoomLevel: number;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onResetZoom: () => void;
  pageCount: number;
  onUndo: () => void;
  onRedo: () => void;
  canUndo: boolean;
  canRedo: boolean;
  saveStatus: 'saved' | 'saving' | 'restored';
  isAssetSidebarOpen: boolean;
  onToggleAssetSidebar: () => void;
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeView,
  onChangeView,
  onOpenExport,
  onResetMagazine,
  zoomLevel,
  onZoomIn,
  onZoomOut,
  onResetZoom,
  pageCount,
  onUndo,
  onRedo,
  canUndo,
  canRedo,
  saveStatus,
  isAssetSidebarOpen,
  onToggleAssetSidebar,
  isDarkMode,
  onToggleDarkMode,
}) => {
  return (
    <header className="w-full bg-white dark:bg-neutral-900 border-b border-[#E0E0DB] dark:border-neutral-700 px-4 sm:px-8 py-3 flex items-center justify-between select-none z-30 shrink-0 transition-colors duration-300">
      {/* Brand & Logo */}
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 bg-black dark:bg-white text-white dark:text-black flex items-center justify-center font-serif font-black text-base tracking-tighter transition-colors duration-300">
          M
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-bold text-sm sm:text-base text-[#1A1A1A] dark:text-neutral-100 tracking-tight font-serif transition-colors duration-300">
              茉域影像<span className="font-light italic text-[#666] dark:text-neutral-400 ml-1.5">Molly Field Studio</span>
            </h1>
            <span className="bg-[#F0F0EE] dark:bg-neutral-800 text-[#666] dark:text-neutral-400 border border-[#E0E0DB] dark:border-neutral-700 text-[9px] font-mono px-1.5 py-0.5 tracking-widest uppercase transition-colors duration-300">
              HD PRINT
            </span>
          </div>
          <p className="text-[10px] text-[#888] dark:text-neutral-500 font-mono tracking-widest uppercase hidden sm:block transition-colors duration-300">
            茉域影像 · 独立摄影杂志排版工坊
          </p>
        </div>
      </div>

      {/* Main View Switcher Tabs & History Undo/Redo */}
      <div className="flex items-center gap-3">
        {/* View mode switcher */}
        <div className="flex items-center bg-[#F7F7F5] dark:bg-neutral-800 border border-[#E0E0DB] dark:border-neutral-700 p-1 text-xs transition-colors duration-300">
          <button
            onClick={() => onChangeView('editor')}
            className={`flex items-center gap-2 px-3.5 py-1.5 transition-all text-xs uppercase tracking-wider ${
              activeView === 'editor'
                ? 'bg-black dark:bg-white text-white dark:text-black font-medium shadow-sm'
                : 'text-[#666] dark:text-neutral-400 hover:text-black dark:hover:text-white'
            }`}
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span>布局编辑器</span>
          </button>

          <button
            onClick={() => onChangeView('flipbook')}
            className={`flex items-center gap-2 px-3.5 py-1.5 transition-all text-xs uppercase tracking-wider ${
              activeView === 'flipbook'
                ? 'bg-black dark:bg-white text-white dark:text-black font-medium shadow-sm'
                : 'text-[#666] dark:text-neutral-400 hover:text-black dark:hover:text-white'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>3D立体预览</span>
          </button>

          <button
            onClick={() => {
              if (activeView !== 'editor') {
                onChangeView('editor');
              }
              onToggleAssetSidebar();
            }}
            className={`flex items-center gap-2 px-3.5 py-1.5 transition-all text-xs uppercase tracking-wider rounded-xs ${
              activeView === 'editor' && isAssetSidebarOpen
                ? 'bg-amber-500 text-black font-bold shadow-md ring-1 ring-amber-400'
                : 'bg-amber-500/10 text-amber-900 dark:text-amber-300 border border-amber-400/80 hover:bg-amber-500 hover:text-black font-bold'
            }`}
          >
            <ImageIcon className="w-3.5 h-3.5 text-amber-950 dark:text-amber-200" />
            <span>素材库侧边栏</span>
          </button>
        </div>

        {/* Shortcut Undo / Redo Controls */}
        <div className="hidden lg:flex items-center bg-[#F7F7F5] dark:bg-neutral-800 border border-[#E0E0DB] dark:border-neutral-700 p-1 gap-1 transition-colors duration-300">
          <button
            onClick={onUndo}
            disabled={!canUndo}
            className="p-1.5 text-[#333] dark:text-neutral-300 hover:text-black dark:hover:text-white disabled:opacity-30 disabled:hover:text-[#333] dark:disabled:hover:text-neutral-300 transition-colors"
            title="撤销 (Ctrl+Z / Cmd+Z)"
          >
            <Undo2 className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={onRedo}
            disabled={!canRedo}
            className="p-1.5 text-[#333] dark:text-neutral-300 hover:text-black dark:hover:text-white disabled:opacity-30 disabled:hover:text-[#333] dark:disabled:hover:text-neutral-300 transition-colors"
            title="重做 (Ctrl+Y / Cmd+Shift+Z)"
          >
            <Redo2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-3">
        {/* Auto Save Status Indicator */}
        <div className="hidden xl:flex items-center gap-1.5 text-[11px] font-mono text-[#666] dark:text-neutral-400 bg-[#F7F7F5] dark:bg-neutral-800 border border-[#E0E0DB] dark:border-neutral-700 px-2.5 py-1 transition-colors duration-300">
          <Save className={`w-3 h-3 ${saveStatus === 'saving' ? 'animate-spin text-amber-600' : 'text-emerald-600'}`} />
          <span>
            {saveStatus === 'saving' && '正在保存...'}
            {saveStatus === 'saved' && '已自动保存'}
            {saveStatus === 'restored' && '已恢复上次进度'}
          </span>
        </div>

        {/* Editor Zoom Bar */}
        {activeView === 'editor' && (
          <div className="hidden md:flex items-center bg-[#F7F7F5] dark:bg-neutral-800 border border-[#E0E0DB] dark:border-neutral-700 px-2 py-1 gap-1 text-xs font-mono text-[#333] dark:text-neutral-300 transition-colors duration-300">
            <button onClick={onZoomOut} className="p-1 hover:text-black dark:hover:text-white" title="缩小">
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <button onClick={onResetZoom} className="px-1 text-[11px] hover:text-black dark:hover:text-white font-semibold">
              {Math.round(zoomLevel * 100)}%
            </button>
            <button onClick={onZoomIn} className="p-1 hover:text-black dark:hover:text-white" title="放大">
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* Dark Mode Toggle / 暗色模式切换 */}
        <button
          onClick={onToggleDarkMode}
          className="btn-press p-2 border border-[#E0E0DB] dark:border-neutral-700 bg-white dark:bg-neutral-800 text-[#666] dark:text-amber-300 hover:text-black dark:hover:text-amber-200 hover:border-black dark:hover:border-amber-500/50 transition-colors hidden sm:block"
          title={isDarkMode ? '切换到亮色模式' : '切换到暗色模式'}
        >
          {isDarkMode ? <Sun className="w-3.5 h-3.5" /> : <Moon className="w-3.5 h-3.5" />}
        </button>

        {/* Reset Demo Magazine */}
        <button
          onClick={onResetMagazine}
          className="p-2 border border-[#E0E0DB] dark:border-neutral-700 bg-white dark:bg-neutral-800 text-[#666] dark:text-neutral-300 hover:text-black dark:hover:text-white hover:border-black dark:hover:border-white transition-colors hidden sm:block"
          title="重置为示范排版杂志"
        >
          <RotateCcw className="w-3.5 h-3.5" />
        </button>

        {/* High Res Export Button */}
        <button
          onClick={onOpenExport}
          className="btn-press flex items-center gap-2 bg-black dark:bg-white text-white dark:text-black hover:bg-neutral-800 dark:hover:bg-neutral-200 border border-black dark:border-white px-4 py-1.5 text-xs font-mono uppercase tracking-widest shadow-sm"
        >
          <Download className="w-3.5 h-3.5" />
          <span>高清导出 (HD)</span>
        </button>
      </div>
    </header>
  );
};
