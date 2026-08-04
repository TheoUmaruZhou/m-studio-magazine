import React from 'react';

/**
 * 骨架屏组件 / Skeleton Screen Components
 * 在初始加载、内容渲染期间替代白屏，提升感知性能
 * Replaces white screen during initial load / content render for better perceived performance
 */

// ============================================
// 基础原子组件 / Atomic primitives
// ============================================

interface SkeletonBlockProps {
  className?: string;
  width?: string | number;
  height?: string | number;
}

/** 矩形骨架块 / Rectangular skeleton block */
export const SkeletonBlock: React.FC<SkeletonBlockProps> = ({ className = '', width, height }) => {
  return (
    <div
      className={`skeleton-block ${className}`}
      style={{
        width: width !== undefined ? (typeof width === 'number' ? `${width}px` : width) : undefined,
        height: height !== undefined ? (typeof height === 'number' ? `${height}px` : height) : undefined,
      }}
    />
  );
};

interface SkeletonTextProps {
  className?: string;
  width?: string | number;
  lines?: number;
}

/** 文字行骨架 / Text line skeleton */
export const SkeletonText: React.FC<SkeletonTextProps> = ({ className = '', width = '100%', lines = 1 }) => {
  if (lines === 1) {
    return (
      <div
        className={`skeleton-text ${className}`}
        style={{
          width: typeof width === 'number' ? `${width}px` : width,
        }}
      />
    );
  }
  return (
    <div className={`flex flex-col gap-2 ${className}`}>
      {Array.from({ length: lines }).map((_, i) => (
        <div
          key={i}
          className="skeleton-text"
          style={{
            width: i === lines - 1 ? '60%' : '100%',
          }}
        />
      ))}
    </div>
  );
};

interface SkeletonCircleProps {
  className?: string;
  size?: number;
}

/** 圆形骨架 / Circle skeleton (avatars, icons) */
export const SkeletonCircle: React.FC<SkeletonCircleProps> = ({ className = '', size = 32 }) => {
  return (
    <div
      className={`skeleton-circle ${className}`}
      style={{ width: `${size}px`, height: `${size}px` }}
    />
  );
};

// ============================================
// 复合骨架组件 / Composite skeletons
// ============================================

/** 顶部导航栏骨架 / Navbar skeleton */
export const SkeletonNavbar: React.FC = () => {
  return (
    <div className="w-full h-14 flex items-center justify-between px-6 bg-panel border-b border-app skeleton-enter">
      <div className="flex items-center gap-3">
        <SkeletonBlock width={32} height={32} className="rounded-md" />
        <SkeletonText width={140} />
      </div>
      <div className="flex items-center gap-2">
        {Array.from({ length: 4 }).map((_, i) => (
          <SkeletonBlock key={i} width={64} height={28} className="rounded" />
        ))}
      </div>
      <div className="flex items-center gap-2">
        <SkeletonCircle size={28} />
        <SkeletonCircle size={28} />
      </div>
    </div>
  );
};

/** 左侧素材库侧栏骨架 / Photo library sidebar skeleton */
export const SkeletonPhotoSidebar: React.FC = () => {
  return (
    <div className="w-[300px] h-full bg-panel border-r border-app p-4 flex flex-col gap-4 skeleton-enter">
      {/* 顶部标题区 / Header */}
      <div className="flex items-center justify-between">
        <SkeletonText width={100} />
        <SkeletonBlock width={24} height={24} className="rounded" />
      </div>
      {/* 搜索框 / Search bar */}
      <SkeletonBlock width="100%" height={36} className="rounded" />
      {/* 分类按钮 / Category chips */}
      <div className="flex gap-2 flex-wrap">
        {Array.from({ length: 4 }).map((_, i) => (
          <SkeletonBlock key={i} width={56 + i * 8} height={24} className="rounded-full" />
        ))}
      </div>
      {/* 图片网格 / Photo grid */}
      <div className="grid grid-cols-2 gap-3 flex-1 overflow-hidden">
        {Array.from({ length: 8 }).map((_, i) => (
          <SkeletonBlock key={i} className="aspect-[3/4] w-full" />
        ))}
      </div>
    </div>
  );
};

/** 中央画布区骨架 / Central canvas skeleton */
export const SkeletonCanvas: React.FC = () => {
  return (
    <div className="flex-1 h-full flex items-center justify-center bg-canvas p-12 skeleton-enter">
      {/* 跨页双页 / Spread (two pages) */}
      <div className="flex gap-1 shadow-2xl">
        {/* 左页 / Left page */}
        <div className="w-[440px] h-[620px] bg-panel p-8 flex flex-col gap-4">
          <SkeletonBlock className="w-full h-[280px]" />
          <SkeletonText width="40%" />
          <SkeletonText lines={3} />
        </div>
        {/* 右页 / Right page */}
        <div className="w-[440px] h-[620px] bg-panel p-8 flex flex-col gap-4">
          <SkeletonText width="60%" />
          <SkeletonBlock className="w-full h-[220px]" />
          <div className="grid grid-cols-2 gap-3">
            <SkeletonBlock className="aspect-square" />
            <SkeletonBlock className="aspect-square" />
          </div>
        </div>
      </div>
    </div>
  );
};

/** 右侧检查器面板骨架 / Inspector panel skeleton */
export const SkeletonInspector: React.FC = () => {
  return (
    <div className="w-[340px] h-full bg-panel border-l border-app p-4 flex flex-col gap-5 skeleton-enter">
      {/* 选项卡 / Tabs */}
      <div className="flex gap-2">
        {Array.from({ length: 3 }).map((_, i) => (
          <SkeletonBlock key={i} width={80} height={28} className="rounded" />
        ))}
      </div>
      {/* 属性区 / Property sections */}
      {Array.from({ length: 3 }).map((_, sectionIdx) => (
        <div key={sectionIdx} className="flex flex-col gap-3">
          <SkeletonText width={120} />
          <div className="flex flex-col gap-2.5">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="flex items-center justify-between">
                <SkeletonText width={60} />
                <SkeletonBlock width={120} height={26} className="rounded" />
              </div>
            ))}
          </div>
        </div>
      ))}
      {/* 模板预览 / Template previews */}
      <div className="flex flex-col gap-2">
        <SkeletonText width={100} />
        <div className="grid grid-cols-3 gap-2">
          {Array.from({ length: 6 }).map((_, i) => (
            <SkeletonBlock key={i} className="aspect-[3/4]" />
          ))}
        </div>
      </div>
    </div>
  );
};

/** 底部页面条骨架 / Page bar skeleton */
export const SkeletonPageBar: React.FC = () => {
  return (
    <div className="w-full h-20 flex items-center gap-3 px-6 bg-panel border-t border-app skeleton-enter">
      {Array.from({ length: 5 }).map((_, i) => (
        <SkeletonBlock key={i} width={64} height={56} className="rounded shrink-0" />
      ))}
      <div className="flex-1" />
      <SkeletonCircle size={36} />
    </div>
  );
};

/** 完整编辑器骨架 / Full editor skeleton */
export const SkeletonEditor: React.FC = () => {
  return (
    <div className="w-screen h-screen flex flex-col bg-app text-app overflow-hidden">
      <SkeletonNavbar />
      <div className="flex-1 flex overflow-hidden">
        <SkeletonPhotoSidebar />
        <div className="flex-1 flex flex-col">
          <SkeletonCanvas />
          <SkeletonPageBar />
        </div>
        <SkeletonInspector />
      </div>
    </div>
  );
};

interface SkeletonImageProps {
  className?: string;
}

/** 单张图片加载骨架 / Single image loading skeleton */
export const SkeletonImage: React.FC<SkeletonImageProps> = ({ className = '' }) => {
  return (
    <div className={`skeleton-block w-full h-full ${className}`} />
  );
};

interface SkeletonPhotoGridProps {
  count?: number;
}

/** 图片网格骨架 / Photo grid skeleton (用于 PhotoLibrary) */
export const SkeletonPhotoGrid: React.FC<SkeletonPhotoGridProps> = ({ count = 12 }) => {
  return (
    <div className="grid grid-cols-3 gap-8 skeleton-enter">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="aspect-[3/4] skeleton-block rounded" />
      ))}
    </div>
  );
};
