import React, { useState } from 'react';
import { MagazineSpread } from '../types';
import { PageRenderer } from './PageRenderer';
import { toPng, toJpeg } from 'html-to-image';
import jsPDF from 'jspdf';
import {
  Download,
  FileText,
  Image as ImageIcon,
  Check,
  X,
  Loader2,
  Sparkles,
  Layers,
  Split,
  ArrowLeft,
  ArrowRight,
  Maximize2,
  CheckSquare,
  Square,
} from 'lucide-react';

interface ExportModalProps {
  spreads: MagazineSpread[];
  isOpen: boolean;
  onClose: () => void;
}

export type ExportMode = 'full' | 'split' | 'left' | 'right';

export interface SpreadExportConfig {
  selected: boolean;
  mode: ExportMode;
}

export const ExportModal: React.FC<ExportModalProps> = ({ spreads, isOpen, onClose }) => {
  const [spreadConfigs, setSpreadConfigs] = useState<Record<string, SpreadExportConfig>>(() => {
    const initial: Record<string, SpreadExportConfig> = {};
    spreads.forEach((s) => {
      initial[s.id] = {
        selected: true,
        mode: 'full',
      };
    });
    return initial;
  });

  const [exportFormat, setExportFormat] = useState<'pdf' | 'jpeg' | 'png'>('jpeg'); // JPG default
  const [scaleFactor, setScaleFactor] = useState<number>(2); // 2x HD (440×620 × 2 = 880×1240)
  const [isExporting, setIsExporting] = useState<boolean>(false);
  const [exportProgress, setExportProgress] = useState<number>(0);
  const [progressStatus, setProgressStatus] = useState<string>('');

  if (!isOpen) return null;

  const updateConfig = (spreadId: string, partial: Partial<SpreadExportConfig>) => {
    setSpreadConfigs((prev) => ({
      ...prev,
      [spreadId]: {
        ...prev[spreadId],
        ...partial,
      },
    }));
  };

  const selectAll = () => {
    setSpreadConfigs((prev) => {
      const next = { ...prev };
      Object.keys(next).forEach((id) => {
        next[id].selected = true;
      });
      return next;
    });
  };

  const deselectAll = () => {
    setSpreadConfigs((prev) => {
      const next = { ...prev };
      Object.keys(next).forEach((id) => {
        next[id].selected = false;
      });
      return next;
    });
  };

  const setAllMode = (mode: ExportMode) => {
    setSpreadConfigs((prev) => {
      const next = { ...prev };
      spreads.forEach((s) => {
        if (!s.isCover) {
          next[s.id] = { ...next[s.id], mode, selected: true };
        }
      });
      return next;
    });
  };

  // Compute total output image / PDF page count
  const totalTaskCount = spreads.reduce((acc, s) => {
    const config = spreadConfigs[s.id];
    if (!config || !config.selected) return acc;
    if (s.isCover) return acc + 1;
    if (config.mode === 'split') return acc + 2;
    return acc + 1;
  }, 0);

  const handleStartExport = async () => {
    if (totalTaskCount === 0) return;

    setIsExporting(true);
    setExportProgress(0);
    setProgressStatus('正在准备高清晰度视觉渲染引擎...');

    try {
      let pdfDoc: jsPDF | null = null;

      // Construct tasks list
      const tasks: {
        domId: string;
        filename: string;
        isLandscape: boolean;
      }[] = [];

      spreads.forEach((s, idx) => {
        const config = spreadConfigs[s.id];
        if (!config || !config.selected) return;

        const spreadNumStr = (idx + 1).toString().padStart(2, '0');

        if (s.isCover) {
          tasks.push({
            domId: `export-node-${s.id}-cover`,
            filename: `MollyField-Mag-Cover`,
            isLandscape: false,
          });
        } else {
          if (config.mode === 'full') {
            tasks.push({
              domId: `export-node-${s.id}-full`,
              filename: `MollyField-Mag-Spread-${spreadNumStr}-Full`,
              isLandscape: true,
            });
          } else if (config.mode === 'split') {
            tasks.push({
              domId: `export-node-${s.id}-left`,
              filename: `MollyField-Mag-Spread-${spreadNumStr}-Page-Left`,
              isLandscape: false,
            });
            tasks.push({
              domId: `export-node-${s.id}-right`,
              filename: `MollyField-Mag-Spread-${spreadNumStr}-Page-Right`,
              isLandscape: false,
            });
          } else if (config.mode === 'left') {
            tasks.push({
              domId: `export-node-${s.id}-left`,
              filename: `MollyField-Mag-Spread-${spreadNumStr}-Page-Left`,
              isLandscape: false,
            });
          } else if (config.mode === 'right') {
            tasks.push({
              domId: `export-node-${s.id}-right`,
              filename: `MollyField-Mag-Spread-${spreadNumStr}-Page-Right`,
              isLandscape: false,
            });
          }
        }
      });

      // 预加载所有图片 / Preload all images before export
      setProgressStatus('正在预加载图片资源...');
      const allPhotoUrls = new Set<string>();
      spreads.forEach((s) => {
        const config = spreadConfigs[s.id];
        if (!config || !config.selected) return;
        [s.leftPage, s.rightPage].forEach((page) => {
          if (page) {
            page.photos.forEach((p) => {
              if (p.url) allPhotoUrls.add(p.url);
            });
          }
        });
      });

      // 并行预加载所有图片
      await Promise.all(
        Array.from(allPhotoUrls).map(
          (url) =>
            new Promise<void>((resolve) => {
              const img = new Image();
              img.crossOrigin = 'anonymous';
              img.onload = () => resolve();
              img.onerror = () => resolve(); // 即使失败也继续
              img.src = url;
            })
        )
      );

      // 等待DOM渲染完成
      await new Promise((resolve) => setTimeout(resolve, 100));

      for (let i = 0; i < tasks.length; i++) {
        const task = tasks[i];
        setProgressStatus(`正在导出第 ${i + 1} / ${tasks.length} 张 ${exportFormat.toUpperCase()} 图像...`);

        const elem = document.getElementById(task.domId);
        if (elem) {
          let dataUrl = '';

          // 优化导出参数：移除cacheBust利用缓存，适当降低quality
          const exportOptions = {
            pixelRatio: scaleFactor,
            quality: 0.92,
            cacheBust: false,
            backgroundColor: '#ffffff',
          };

          if (exportFormat === 'jpeg') {
            dataUrl = await toJpeg(elem, exportOptions);
          } else if (exportFormat === 'png') {
            dataUrl = await toPng(elem, exportOptions);
          } else if (exportFormat === 'pdf') {
            dataUrl = await toJpeg(elem, exportOptions);
          }

          if (exportFormat === 'pdf') {
            const pdfWidth = task.isLandscape ? 420 : 210; // mm
            const pdfHeight = 297; // mm
            const orientation = task.isLandscape ? 'landscape' : 'portrait';

            if (!pdfDoc) {
              pdfDoc = new jsPDF({
                orientation,
                unit: 'mm',
                format: task.isLandscape ? [420, 297] : 'a4',
              });
            } else {
              pdfDoc.addPage([pdfWidth, pdfHeight], orientation);
            }
            pdfDoc.addImage(dataUrl, 'JPEG', 0, 0, pdfWidth, pdfHeight);
          } else {
            // Trigger individual image download
            const ext = exportFormat === 'jpeg' ? 'jpg' : 'png';
            const link = document.createElement('a');
            link.download = `${task.filename}.${ext}`;
            link.href = dataUrl;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);

            if (i < tasks.length - 1) {
              await new Promise((resolve) => setTimeout(resolve, 50));
            }
          }
        }

        setExportProgress(Math.round(((i + 1) / tasks.length) * 100));
      }

      if (exportFormat === 'pdf' && pdfDoc) {
        setProgressStatus('正在生成并导出高画质 PDF 杂志电子书...');
        (pdfDoc as jsPDF).save('MollyField-Magazine-Collection.pdf');
      }

      setProgressStatus('导出成功！所有文件已为您保存至下载目录。');
      setTimeout(() => {
        setIsExporting(false);
        onClose();
      }, 1200);
    } catch (err) {
      console.error('Export failed:', err);
      setProgressStatus('导出过程出现异常，请重试。');
      setIsExporting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 animate-fade-in">
      <div className="bg-white dark:bg-neutral-900 border border-[#E0E0DB] dark:border-neutral-700 transition-colors duration-300 w-full max-w-4xl overflow-hidden shadow-2xl flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="p-5 sm:p-6 border-b border-[#E0E0DB] dark:border-neutral-700 flex justify-between items-center bg-[#F7F7F5] dark:bg-neutral-800">
          <div>
            <div className="flex items-center gap-2 text-[#666] dark:text-neutral-400 font-mono text-xs uppercase tracking-widest">
              <Sparkles className="w-4 h-4 text-black dark:text-white" />
              <span>VISUAL HIGH-RES EXPORT CENTER</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-bold font-serif text-[#1A1A1A] dark:text-neutral-100 mt-1">
              视觉化导出杂志图片
            </h3>
          </div>
          <button
            onClick={onClose}
            disabled={isExporting}
            className="p-2 text-[#666] dark:text-neutral-400 hover:text-black dark:hover:text-white hover:bg-[#F0F0EE] dark:hover:bg-neutral-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-6 flex-1 text-[#1A1A1A] dark:text-neutral-100">
          {/* Top Options Bar */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Format Selector (Now with JPG) */}
            <div className="space-y-2">
              <label className="text-xs font-mono text-[#666] dark:text-neutral-400 uppercase tracking-widest font-semibold flex items-center gap-1.5">
                <ImageIcon className="w-3.5 h-3.5" />
                导出文件格式 (Export Format)
              </label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setExportFormat('jpeg')}
                  className={`p-2 border flex flex-col items-center justify-center gap-0.5 text-xs tracking-wider transition-all rounded-sm ${
                    exportFormat === 'jpeg'
                      ? 'bg-black text-white border-black font-medium shadow-sm'
                      : 'bg-[#FAF9F6] dark:bg-neutral-900 text-[#444] border-[#E0E0DB] dark:border-neutral-700 hover:border-black dark:hover:border-white'
                  }`}
                >
                  <span className="text-xs font-semibold tracking-widest">JPG</span>
                  <span className="text-[10px] opacity-75 font-normal">高清图片</span>
                </button>

                <button
                  type="button"
                  onClick={() => setExportFormat('png')}
                  className={`p-2 border flex flex-col items-center justify-center gap-0.5 text-xs tracking-wider transition-all rounded-sm ${
                    exportFormat === 'png'
                      ? 'bg-black text-white border-black font-medium shadow-sm'
                      : 'bg-[#FAF9F6] dark:bg-neutral-900 text-[#444] border-[#E0E0DB] dark:border-neutral-700 hover:border-black dark:hover:border-white'
                  }`}
                >
                  <span className="text-xs font-semibold tracking-widest">PNG</span>
                  <span className="text-[10px] opacity-75 font-normal">无损图包</span>
                </button>

                <button
                  type="button"
                  onClick={() => setExportFormat('pdf')}
                  className={`p-2 border flex flex-col items-center justify-center gap-0.5 text-xs tracking-wider transition-all rounded-sm ${
                    exportFormat === 'pdf'
                      ? 'bg-black text-white border-black font-medium shadow-sm'
                      : 'bg-[#FAF9F6] dark:bg-neutral-900 text-[#444] border-[#E0E0DB] dark:border-neutral-700 hover:border-black dark:hover:border-white'
                  }`}
                >
                  <span className="text-xs font-semibold tracking-widest">PDF</span>
                  <span className="text-[10px] opacity-75 font-normal">电子书</span>
                </button>
              </div>
            </div>

            {/* Quality Factor */}
            <div className="space-y-2">
              <label className="text-xs font-mono text-[#666] dark:text-neutral-400 uppercase tracking-widest font-semibold flex items-center gap-1.5">
                <Maximize2 className="w-3.5 h-3.5" />
                输出清晰度分辨率 (Resolution)
              </label>
              <div className="grid grid-cols-4 gap-2">
                {[
                  { factor: 1, label: '1x 快速预览', sub: '440×620' },
                  { factor: 2, label: '2x 标准清', sub: '880×1240' },
                  { factor: 3, label: '3x 2K超清', sub: '1320×1860' },
                  { factor: 4, label: '4x 4K印刷', sub: '1760×2480' },
                ].map((item) => (
                  <button
                    key={item.factor}
                    type="button"
                    onClick={() => setScaleFactor(item.factor)}
                    className={`p-2 border flex flex-col items-center justify-center gap-0.5 text-xs tracking-wider transition-all rounded-sm ${
                      scaleFactor === item.factor
                        ? 'bg-black text-white border-black font-medium shadow-sm'
                        : 'bg-[#FAF9F6] dark:bg-neutral-900 text-[#555] border-[#E0E0DB] dark:border-neutral-700 hover:border-black dark:hover:border-white'
                    }`}
                  >
                    <span className="font-semibold tracking-widest">{item.label}</span>
                    <span className="text-[9px] opacity-70 font-mono font-normal">{item.sub}</span>
                  </button>
                ))}
              </div>
              {/* 输出尺寸参考 / Output dimension reference */}
              <div className="flex items-center gap-3 text-[10px] font-mono text-[#888] dark:text-neutral-500 mt-1.5 px-1">
                <span className="flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                  单页输出: {440 * scaleFactor}×{620 * scaleFactor}px
                </span>
                <span className="text-[#CCC] dark:text-neutral-700">|</span>
                <span>跨页输出: {880 * scaleFactor}×{620 * scaleFactor}px</span>
              </div>
            </div>
          </div>

          {/* Page Selection Controls */}
          <div className="space-y-3 pt-2">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-[#E0E0DB] dark:border-neutral-700">
              <span className="text-xs font-mono text-[#444] uppercase tracking-widest font-bold flex items-center gap-2">
                <Layers className="w-4 h-4 text-black dark:text-white" />
                选择导出具体页面图片 ({totalTaskCount} 张已选中)
              </span>

              <div className="flex flex-wrap items-center gap-2 text-[11px] font-mono">
                <button
                  type="button"
                  onClick={selectAll}
                  className="px-2 py-1 bg-[#F0F0EE] dark:bg-neutral-800 hover:bg-black hover:text-white transition-all border border-[#D0D0CB]"
                >
                  全选
                </button>
                <button
                  type="button"
                  onClick={deselectAll}
                  className="px-2 py-1 bg-[#F0F0EE] dark:bg-neutral-800 hover:bg-black hover:text-white transition-all border border-[#D0D0CB]"
                >
                  清空
                </button>
                <span className="text-[#CCC]">|</span>
                <button
                  type="button"
                  onClick={() => setAllMode('full')}
                  className="px-2 py-1 bg-[#F0F0EE] dark:bg-neutral-800 hover:bg-black hover:text-white transition-all border border-[#D0D0CB]"
                >
                  一键全部连图
                </button>
                <button
                  type="button"
                  onClick={() => setAllMode('split')}
                  className="px-2 py-1 bg-[#F0F0EE] dark:bg-neutral-800 hover:bg-black hover:text-white transition-all border border-[#D0D0CB]"
                >
                  一键全部拆分
                </button>
              </div>
            </div>

            {/* Visual Cards List */}
            <div className="space-y-4 max-h-[46vh] overflow-y-auto pr-1">
              {spreads.map((s, idx) => {
                const config = spreadConfigs[s.id] || { selected: true, mode: 'full' };

                return (
                  <div
                    key={s.id}
                    onClick={() => updateConfig(s.id, { selected: !config.selected })}
                    className={`p-4 border transition-all cursor-pointer hover:border-amber-500 ${
                      config.selected
                        ? 'bg-white dark:bg-neutral-900 border-black shadow-sm'
                        : 'bg-[#F9F9F7] border-[#E0E0DB] dark:border-neutral-700 opacity-60'
                    }`}
                  >
                    <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                      {/* Left: Checkbox & Meta */}
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-6 h-6 flex items-center justify-center border transition-all ${
                            config.selected
                              ? 'bg-black border-black text-white'
                              : 'border-[#CCC] dark:border-neutral-600 bg-white dark:bg-neutral-900'
                          }`}
                        >
                          {config.selected && <Check className="w-4 h-4 stroke-[3]" />}
                        </div>

                        <div>
                          <div className="text-sm font-bold font-serif flex items-center gap-2">
                            <span>{s.isCover ? '封面 (COVER)' : `跨页 0${idx}`}</span>
                            <span className="text-[10px] font-mono font-normal text-[#666] dark:text-neutral-400 bg-[#EFEFED] dark:bg-neutral-800 px-1.5 py-0.5 rounded">
                              {s.isCover ? '单页图包' : '左右连页'}
                            </span>
                          </div>
                          <div className="text-xs text-[#666] dark:text-neutral-400 font-mono mt-0.5 line-clamp-1">
                            {s.leftPage.title} {s.rightPage ? ` / ${s.rightPage.title}` : ''}
                          </div>
                        </div>
                      </div>

                      {/* Middle: Live Visual Image Preview */}
                      <div
                        className="flex items-center justify-center bg-[#ECECE8] dark:bg-neutral-800 p-2 border border-[#E0E0DB] dark:border-neutral-700 rounded shadow-inner overflow-hidden pointer-events-none"
                      >
                        {s.isCover ? (
                          /* Cover Thumbnail */
                          <div
                            className={`w-[110px] h-[155px] relative overflow-hidden transition-all border ${
                              config.selected ? 'border-amber-600 shadow-md ring-2 ring-amber-400' : 'grayscale opacity-50'
                            }`}
                          >
                            <div className="w-[440px] h-[620px] transform scale-[0.25] origin-top-left pointer-events-none select-none">
                              <PageRenderer page={s.leftPage} isLeft={true} readOnly={true} scaleRatio={1} />
                            </div>
                            <div className="absolute bottom-1 right-1 bg-black/80 text-white text-[8px] font-mono px-1 py-0.5 rounded">
                              440×620
                            </div>
                          </div>
                        ) : (
                          /* Interior Spread Thumbnail (Connected Left + Right) */
                          <div className="flex items-center gap-1">
                            {/* Combined or Left/Right Visual Box */}
                            <div
                              className={`w-[220px] h-[155px] relative flex overflow-hidden transition-all border ${
                                !config.selected
                                  ? 'grayscale opacity-40 border-[#CCC] dark:border-neutral-600'
                                  : config.mode === 'full'
                                  ? 'border-amber-600 shadow-md ring-2 ring-amber-400'
                                  : 'border-black'
                              }`}
                            >
                              {/* Left Half Thumbnail */}
                              <div
                                className={`w-1/2 h-full relative border-r border-black/20 overflow-hidden transition-all ${
                                  config.selected && (config.mode === 'right')
                                    ? 'opacity-30 grayscale'
                                    : 'opacity-100'
                                }`}
                              >
                                <div className="w-[440px] h-[620px] transform scale-[0.25] origin-top-left pointer-events-none select-none">
                                  <PageRenderer page={s.leftPage} isLeft={true} readOnly={true} scaleRatio={1} />
                                </div>
                                {config.mode === 'right' && (
                                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center text-white text-[9px] font-mono font-bold">
                                    跳过左页
                                  </div>
                                )}
                              </div>

                              {/* Right Half Thumbnail */}
                              <div
                                className={`w-1/2 h-full relative overflow-hidden transition-all ${
                                  config.selected && (config.mode === 'left')
                                    ? 'opacity-30 grayscale'
                                    : 'opacity-100'
                                }`}
                              >
                                {s.rightPage && (
                                  <div className="w-[440px] h-[620px] transform scale-[0.25] origin-top-left pointer-events-none select-none">
                                    <PageRenderer page={s.rightPage} isLeft={false} readOnly={true} scaleRatio={1} />
                                  </div>
                                )}
                                {config.mode === 'left' && (
                                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center text-white text-[9px] font-mono font-bold">
                                    跳过右页
                                  </div>
                                )}
                              </div>

                              {/* Split Indicator overlay */}
                              {config.selected && config.mode === 'split' && (
                                <div className="absolute inset-y-0 left-1/2 -ml-[1px] w-[2px] bg-amber-500 shadow-sm pointer-events-none" />
                              )}

                              {/* Badge tag */}
                              <div className="absolute bottom-1 right-1 bg-black/80 text-white text-[8px] font-mono px-1 py-0.5 rounded">
                                {config.mode === 'full' && '880×620 连图'}
                                {config.mode === 'split' && '拆分为 2 张 440×620'}
                                {config.mode === 'left' && '左页 440×620'}
                                {config.mode === 'right' && '右页 440×620'}
                              </div>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Right: Export Option Pills for Spreads */}
                      {!s.isCover && (
                        <div className="space-y-1.5 w-full md:w-auto" onClick={(e) => e.stopPropagation()}>
                          <label className="text-[10px] text-[#666] dark:text-neutral-400 font-medium tracking-wider uppercase">
                            导出形式 (Export Mode)
                          </label>
                          <div className="grid grid-cols-2 gap-1.5 text-xs">
                            <button
                              type="button"
                              onClick={() => updateConfig(s.id, { mode: 'full', selected: true })}
                              className={`px-2.5 py-1.5 border flex items-center gap-1.5 transition-all rounded-sm ${
                                config.selected && config.mode === 'full'
                                  ? 'bg-black text-white border-black font-medium'
                                  : 'bg-[#FAF9F6] dark:bg-neutral-900 text-[#555] border-[#E0E0DB] dark:border-neutral-700 hover:border-black dark:hover:border-white'
                              }`}
                            >
                              <Layers className="w-3.5 h-3.5 opacity-80" />
                              <span>跨页连图</span>
                            </button>

                            <button
                              type="button"
                              onClick={() => updateConfig(s.id, { mode: 'split', selected: true })}
                              className={`px-2.5 py-1.5 border flex items-center gap-1.5 transition-all rounded-sm ${
                                config.selected && config.mode === 'split'
                                  ? 'bg-black text-white border-black font-medium'
                                  : 'bg-[#FAF9F6] dark:bg-neutral-900 text-[#555] border-[#E0E0DB] dark:border-neutral-700 hover:border-black dark:hover:border-white'
                              }`}
                            >
                              <Split className="w-3.5 h-3.5 opacity-80" />
                              <span>拆分为两页</span>
                            </button>

                            <button
                              type="button"
                              onClick={() => updateConfig(s.id, { mode: 'left', selected: true })}
                              className={`px-2.5 py-1.5 border flex items-center gap-1.5 transition-all rounded-sm ${
                                config.selected && config.mode === 'left'
                                  ? 'bg-black text-white border-black font-medium'
                                  : 'bg-[#FAF9F6] dark:bg-neutral-900 text-[#555] border-[#E0E0DB] dark:border-neutral-700 hover:border-black dark:hover:border-white'
                              }`}
                            >
                              <ArrowLeft className="w-3.5 h-3.5 opacity-80" />
                              <span>仅左页</span>
                            </button>

                            <button
                              type="button"
                              onClick={() => updateConfig(s.id, { mode: 'right', selected: true })}
                              className={`px-2.5 py-1.5 border flex items-center gap-1.5 transition-all rounded-sm ${
                                config.selected && config.mode === 'right'
                                  ? 'bg-black text-white border-black font-medium'
                                  : 'bg-[#FAF9F6] dark:bg-neutral-900 text-[#555] border-[#E0E0DB] dark:border-neutral-700 hover:border-black dark:hover:border-white'
                              }`}
                            >
                              <ArrowRight className="w-3.5 h-3.5 opacity-80" />
                              <span>仅右页</span>
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Export Progress Bar */}
          {isExporting && (
            <div className="p-4 bg-[#F7F7F5] dark:bg-neutral-800 border border-black space-y-2 animate-pulse">
              <div className="flex justify-between text-xs font-mono text-black dark:text-white uppercase tracking-wider">
                <span className="flex items-center gap-2 font-bold">
                  <Loader2 className="w-4 h-4 animate-spin text-amber-600" />
                  {progressStatus}
                </span>
                <span className="font-bold">{exportProgress}%</span>
              </div>
              <div className="w-full h-2 bg-[#E0E0DB] overflow-hidden rounded-full">
                <div
                  className="h-full bg-black transition-all duration-300"
                  style={{ width: `${exportProgress}%` }}
                />
              </div>
            </div>
          )}
        </div>

        {/* Hidden Render Container for Capture Nodes - 按需渲染，只渲染选中页面 */}
        <div className="fixed left-[-9999px] top-[-9999px] pointer-events-none">
          {isExporting && spreads.map((s) => {
            const config = spreadConfigs[s.id];
            if (!config || !config.selected) return null;

            return (
              <React.Fragment key={`export-nodes-${s.id}`}>
                {/* Single Cover Node */}
                {s.isCover && (
                  <div
                    id={`export-node-${s.id}-cover`}
                    style={{ width: '440px', height: '620px' }}
                    className="bg-white dark:bg-neutral-900 shadow-none overflow-hidden"
                  >
                    <PageRenderer page={s.leftPage} isLeft={true} readOnly={true} scaleRatio={1} exportMode />
                  </div>
                )}

                {/* Spread Full Combined Node */}
                {!s.isCover && config.mode === 'full' && (
                  <div
                    id={`export-node-${s.id}-full`}
                    style={{ width: '880px', height: '620px' }}
                    className="flex bg-white dark:bg-neutral-900 shadow-none overflow-hidden"
                  >
                    <div className="w-1/2 h-full">
                      <PageRenderer page={s.leftPage} isLeft={true} readOnly={true} scaleRatio={1} exportMode />
                    </div>
                    {s.rightPage && (
                      <div className="w-1/2 h-full border-l border-[#E0E0DB] dark:border-neutral-700">
                        <PageRenderer page={s.rightPage} isLeft={false} readOnly={true} scaleRatio={1} exportMode />
                      </div>
                    )}
                  </div>
                )}

                {/* Spread Left Page Node */}
                {!s.isCover && (config.mode === 'split' || config.mode === 'left') && (
                  <div
                    id={`export-node-${s.id}-left`}
                    style={{ width: '440px', height: '620px' }}
                    className="bg-white dark:bg-neutral-900 shadow-none overflow-hidden"
                  >
                    <PageRenderer page={s.leftPage} isLeft={true} readOnly={true} scaleRatio={1} exportMode />
                  </div>
                )}

                {/* Spread Right Page Node */}
                {!s.isCover && s.rightPage && (config.mode === 'split' || config.mode === 'right') && (
                  <div
                    id={`export-node-${s.id}-right`}
                    style={{ width: '440px', height: '620px' }}
                    className="bg-white dark:bg-neutral-900 shadow-none overflow-hidden"
                  >
                    <PageRenderer page={s.rightPage} isLeft={false} readOnly={true} scaleRatio={1} exportMode />
                  </div>
                )}
              </React.Fragment>
            );
          })}
        </div>

        {/* Footer Actions */}
        <div className="p-5 sm:p-6 border-t border-[#E0E0DB] dark:border-neutral-700 bg-[#F7F7F5] dark:bg-neutral-800 flex justify-between items-center">
          <div className="text-xs font-mono text-[#666] dark:text-neutral-400">
            共选择 <span className="font-bold text-black dark:text-white">{totalTaskCount}</span> 张导出的{' '}
            <span className="uppercase font-bold text-black dark:text-white">{exportFormat}</span> 页面
          </div>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={isExporting}
              className="px-5 py-2.5 border border-[#E0E0DB] dark:border-neutral-700 bg-white dark:bg-neutral-900 text-[#666] dark:text-neutral-400 hover:text-black dark:hover:text-white hover:border-black dark:hover:border-white text-xs font-mono uppercase tracking-widest transition-colors"
            >
              取消
            </button>
            <button
              type="button"
              onClick={handleStartExport}
              disabled={isExporting || totalTaskCount === 0}
              className="flex items-center gap-2 px-6 py-2.5 bg-black hover:bg-neutral-800 border border-black disabled:opacity-40 text-white font-medium text-xs font-mono uppercase tracking-widest transition-all shadow-sm"
            >
              <Download className="w-4 h-4 text-amber-400" />
              <span>开始导出 ({totalTaskCount} 张 {exportFormat.toUpperCase()})</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
