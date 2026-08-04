import React, { useState, useEffect } from 'react';
import { MagazineSpread } from '../types';
import { PageRenderer } from './PageRenderer';
import { ChevronLeft, ChevronRight, Maximize2, Volume2, VolumeX, BookOpen, RotateCcw, Gauge } from 'lucide-react';

interface Flipbook3DProps {
  spreads: MagazineSpread[];
}

export const Flipbook3D: React.FC<Flipbook3DProps> = ({ spreads }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipping, setIsFlipping] = useState(false);
  const [flipDirection, setFlipDirection] = useState<'next' | 'prev'>('next');
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [flipSpeed, setFlipSpeed] = useState<'slow' | 'medium' | 'fast'>('medium');

  const flipDuration = flipSpeed === 'slow' ? 800 : flipSpeed === 'fast' ? 300 : 500;

  // Play realistic paper flip sound using Web Audio API
  const playPageTurnSound = () => {
    if (!soundEnabled) return;
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      const bufferSize = audioCtx.sampleRate * 0.15; // 150ms noise
      const buffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
      const data = buffer.getChannelData(0);

      for (let i = 0; i < bufferSize; i++) {
        data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * 0.3));
      }

      const noise = audioCtx.createBufferSource();
      noise.buffer = buffer;

      const filter = audioCtx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(800, audioCtx.currentTime);
      filter.frequency.exponentialRampToValueAtTime(150, audioCtx.currentTime + 0.12);

      gain.gain.setValueAtTime(0.3, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.14);

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(audioCtx.destination);

      noise.start();
    } catch (e) {
      // Ignore audio context errors
    }
  };

  const handleNext = () => {
    if (currentIndex < spreads.length - 1 && !isFlipping) {
      setFlipDirection('next');
      setIsFlipping(true);
      playPageTurnSound();
      setTimeout(() => {
        setCurrentIndex((prev) => prev + 1);
        setIsFlipping(false);
      }, flipDuration);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0 && !isFlipping) {
      setFlipDirection('prev');
      setIsFlipping(true);
      playPageTurnSound();
      setTimeout(() => {
        setCurrentIndex((prev) => prev - 1);
        setIsFlipping(false);
      }, flipDuration);
    }
  };

  // Keyboard Navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === 'Space') {
        handleNext();
      } else if (e.key === 'ArrowLeft') {
        handlePrev();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentIndex, isFlipping, spreads.length]);

  const currentSpread = spreads[currentIndex];
  if (!currentSpread) return null;

  const showSpine =
    !currentSpread.isCover &&
    currentSpread.leftPage?.showSpineLine !== false &&
    (!currentSpread.rightPage || currentSpread.rightPage.showSpineLine !== false);

  const totalPages = spreads.reduce((acc, s) => acc + (s.isCover ? 1 : 2), 0);

  return (
    <div className={`w-full h-full flex flex-col justify-between items-center bg-zinc-950 p-4 sm:p-8 select-none relative overflow-hidden ${isFullscreen ? 'fixed inset-0 z-50 p-12' : ''}`}>
      {/* Studio Background Ambient Glow */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-zinc-900/60 via-zinc-950 to-black pointer-events-none" />

      {/* Top Controls Bar */}
      <div className="relative z-20 w-full max-w-5xl flex justify-between items-center bg-zinc-900/80 backdrop-blur-md px-6 py-3 rounded-full border border-zinc-800 text-zinc-300 text-xs font-mono shadow-xl">
        <div className="flex items-center gap-3">
          <BookOpen className="w-4 h-4 text-amber-500" />
          <span className="font-semibold text-white tracking-wider">3D 沉浸式实体翻页模式</span>
          <span className="bg-zinc-800 px-2 py-0.5 rounded text-[10px] text-zinc-400">REALISTIC FLIPBOOK</span>
        </div>

        <div className="flex items-center gap-4">
          {/* 翻页速度调节 / Flip speed control */}
          <div className="flex items-center gap-1.5">
            <Gauge className="w-4 h-4 text-zinc-500" />
            <div className="flex items-center bg-zinc-800 rounded p-0.5 gap-0.5">
              {(['slow', 'medium', 'fast'] as const).map((speed) => (
                <button
                  key={speed}
                  onClick={() => setFlipSpeed(speed)}
                  className={`px-2 py-0.5 rounded text-[10px] font-mono transition-all ${
                    flipSpeed === speed
                      ? 'bg-amber-500 text-black font-bold'
                      : 'text-zinc-400 hover:text-white'
                  }`}
                  title={`翻页速度: ${speed === 'slow' ? '慢' : speed === 'fast' ? '快' : '中'}`}
                >
                  {speed === 'slow' ? '慢' : speed === 'fast' ? '快' : '中'}
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            className="flex items-center gap-1.5 hover:text-amber-400 transition-colors py-1 px-2 rounded hover:bg-zinc-800"
            title="翻页音效开关"
          >
            {soundEnabled ? <Volume2 className="w-4 h-4 text-amber-400" /> : <VolumeX className="w-4 h-4 text-zinc-500" />}
            <span>{soundEnabled ? '音效开启' : '静音'}</span>
          </button>

          <button
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="flex items-center gap-1.5 hover:text-amber-400 transition-colors py-1 px-2 rounded hover:bg-zinc-800"
          >
            <Maximize2 className="w-4 h-4" />
            <span>{isFullscreen ? '退出全屏' : '全屏翻阅'}</span>
          </button>
        </div>
      </div>

      {/* Main 3D Book Stage */}
      <div className="relative z-10 my-auto flex items-center justify-center perspective-[2200px]">
        <div className="relative flex items-center shadow-[0_30px_90px_-10px_rgba(0,0,0,0.95)] rounded-sm overflow-visible bg-zinc-900 transition-all duration-300">
          {/* Active Spread Container */}
          <div
            className={`relative flex items-center transition-all duration-500 ${
              currentSpread.isCover ? 'w-[420px] h-[590px]' : 'w-[840px] h-[590px]'
            }`}
          >
            {/* Left Page */}
            <div className={`${currentSpread.isCover ? 'w-full' : 'w-1/2'} h-full relative overflow-hidden rounded-l-sm bg-white shadow-inner`}>
              <PageRenderer
                page={currentSpread.leftPage}
                isLeft={true}
                readOnly={true}
              />
            </div>

            {/* Spine Fold / Shadow */}
            {showSpine && (
              <div className="absolute left-1/2 top-0 bottom-0 w-[16px] -ml-[8px] z-30 pointer-events-none flex">
                <div className="w-1/2 h-full bg-gradient-to-r from-transparent via-black/20 to-black/40" />
                <div className="w-[1px] h-full bg-zinc-400/50 shadow-[0_0_10px_rgba(0,0,0,0.8)]" />
                <div className="w-1/2 h-full bg-gradient-to-l from-transparent via-black/20 to-black/40" />
              </div>
            )}

            {/* Right Page */}
            {!currentSpread.isCover && currentSpread.rightPage && (
              <div className="w-1/2 h-full relative overflow-hidden rounded-r-sm bg-white shadow-inner">
                <PageRenderer
                  page={currentSpread.rightPage}
                  isLeft={false}
                  readOnly={true}
                />
              </div>
            )}

            {/* 3D Page Turn Animating Sheet Overlay with page bend shadow */}
            {isFlipping && (
              <div
                className={`absolute top-0 bottom-0 w-1/2 z-40 bg-white shadow-2xl origin-left border-l border-zinc-300 ${
                  flipDirection === 'next'
                    ? 'right-0'
                    : 'left-1/2'
                }`}
                style={{
                  transformStyle: 'preserve-3d',
                  backfaceVisibility: 'hidden',
                  animation: `${flipDirection === 'next' ? 'flipNext' : 'flipPrev'} ${flipDuration}ms cubic-bezier(0.4, 0, 0.2, 1) forwards`,
                }}
              >
                {/* 页面弯曲光影 / Page bend shadow gradient */}
                <div className="absolute inset-0 bg-gradient-to-r from-black/30 via-transparent to-black/10 pointer-events-none" />
                <div className="absolute inset-y-0 left-0 w-8 bg-gradient-to-r from-black/20 to-transparent pointer-events-none" />
                <div className="absolute inset-y-0 right-0 w-4 bg-gradient-to-l from-black/15 to-transparent pointer-events-none" />
                <div className="w-full h-full bg-zinc-100 p-6 flex items-center justify-center text-zinc-400 font-mono text-xs">
                  <div className="animate-pulse">翻阅中...</div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Navigation Controls Bar */}
      <div className="relative z-20 w-full max-w-xl flex flex-col items-center gap-3 bg-zinc-900/90 backdrop-blur-md px-8 py-4 rounded-2xl border border-zinc-800 shadow-2xl">
        <div className="flex items-center justify-between w-full">
          <button
            onClick={handlePrev}
            disabled={currentIndex === 0 || isFlipping}
            className="btn-press flex items-center gap-2 px-4 py-2 rounded-lg bg-zinc-800 hover:bg-amber-500 hover:text-black text-zinc-200 disabled:opacity-30 disabled:hover:bg-zinc-800 disabled:hover:text-zinc-200 transition-colors font-mono text-xs"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>上一页</span>
          </button>

          <div className="text-center">
            <div className="text-amber-400 font-mono font-bold text-sm">
              {currentSpread.isCover ? '封面 COVER' : `跨页 SPREAD 0${currentIndex}`}
            </div>
            <div className="text-zinc-500 text-[11px] font-mono mt-0.5">
              第 {currentIndex + 1} / {spreads.length} 组跨页
            </div>
          </div>

          <button
            onClick={handleNext}
            disabled={currentIndex === spreads.length - 1 || isFlipping}
            className="btn-press flex items-center gap-2 px-4 py-2 rounded-lg bg-zinc-800 hover:bg-amber-500 hover:text-black text-zinc-200 disabled:opacity-30 disabled:hover:bg-zinc-800 disabled:hover:text-zinc-200 transition-colors font-mono text-xs"
          >
            <span>下一页</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Page Slider */}
        <div className="w-full flex items-center gap-3">
          <input
            type="range"
            min={0}
            max={spreads.length - 1}
            value={currentIndex}
            onChange={(e) => {
              setCurrentIndex(Number(e.target.value));
              playPageTurnSound();
            }}
            className="w-full accent-amber-500 h-1.5 bg-zinc-800 rounded-lg cursor-pointer"
          />
          <button
            onClick={() => {
              setCurrentIndex(0);
              playPageTurnSound();
            }}
            className="text-zinc-500 hover:text-white p-1 rounded hover:bg-zinc-800"
            title="返回封面"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
