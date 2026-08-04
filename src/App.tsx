import React, { useState, useEffect, useCallback, useRef } from 'react';
import { MagazineProject, PhotoAsset, PhotoElement, TextElement } from './types';
import { INITIAL_MAGAZINE, SAMPLE_PHOTOS } from './data/defaultMagazine';
import { MAGAZINE_TEMPLATES } from './data/templates';
import { Navbar } from './components/Navbar';
import { SpreadCanvas } from './components/SpreadCanvas';
import { Flipbook3D } from './components/Flipbook3D';
import { PhotoLibrary } from './components/PhotoLibrary';
import { PhotoLibrarySidebar } from './components/PhotoLibrarySidebar';
import { InspectorPanel } from './components/InspectorPanel';
import { PageBar } from './components/PageBar';
import { ExportModal } from './components/ExportModal';
import { SkeletonEditor } from './components/Skeleton';
import { ContextMenu, ContextMenuItem } from './components/ContextMenu';
import { loadProjectFromStorage, saveProjectToStorage, clearProjectStorage } from './utils/storage';
import { Minimize2, Maximize2, Sun, Moon, ChevronLeft, ChevronRight, Pencil, Copy, Trash2, Plus, FilePlus2, Image as ImageIcon } from 'lucide-react';

export function App() {
  const [magazine, setMagazine] = useState<MagazineProject>(INITIAL_MAGAZINE);
  const [activeView, setActiveView] = useState<'flipbook' | 'editor' | 'library'>('editor');
  const [activeSpreadIndex, setActiveSpreadIndex] = useState<number>(0);
  const [activePageSide, setActivePageSide] = useState<'left' | 'right'>('left');

  // 初始加载状态 / Initial loading state (skeleton screen during IndexedDB restore)
  const [isInitialLoading, setIsInitialLoading] = useState<boolean>(true);
  
  // Photo Asset Sidebar toggle state
  const [isAssetSidebarOpen, setIsAssetSidebarOpen] = useState<boolean>(true);

  // Inspector Panel toggle state
  const [isInspectorOpen, setIsInspectorOpen] = useState<boolean>(true);

  // 全屏预览模式 / Full-screen preview mode (Space to toggle)
  const [isPreviewMode, setIsPreviewMode] = useState<boolean>(false);

  // 右键菜单状态 / Context menu state
  const [contextMenu, setContextMenu] = useState<{ x: number; y: number; items: ContextMenuItem[] } | null>(null);

  // 暗色模式 / Dark mode
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    const saved = localStorage.getItem('theme');
    if (saved) return saved === 'dark';
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  useEffect(() => {
    const root = document.documentElement;
    if (isDarkMode) {
      root.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      root.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDarkMode]);

  // History stack for Undo / Redo
  const [history, setHistory] = useState<MagazineProject[]>([INITIAL_MAGAZINE]);
  const [historyIndex, setHistoryIndex] = useState<number>(0);

  // Auto save status
  const [saveStatus, setSaveStatus] = useState<'saved' | 'saving' | 'restored'>('saved');
  const isInitialMount = useRef<boolean>(true);

  // Selection state
  const [selectedText, setSelectedText] = useState<TextElement | null>(null);
  const [selectedPhoto, setSelectedPhoto] = useState<{ element: PhotoElement; index: number } | null>(null);

  // Zoom & Modal
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [isExportOpen, setIsExportOpen] = useState<boolean>(false);

  // Photo Library assets
  const [photoAssets, setPhotoAssets] = useState<PhotoAsset[]>(SAMPLE_PHOTOS);

  // Helper to commit new magazine state into undo/redo history
  const updateMagazineState = useCallback((nextStateOrFn: MagazineProject | ((prev: MagazineProject) => MagazineProject)) => {
    setMagazine((prev) => {
      const nextState = typeof nextStateOrFn === 'function' ? nextStateOrFn(prev) : nextStateOrFn;
      if (nextState !== prev) {
        setHistory((oldHistory) => {
          const sliced = oldHistory.slice(0, historyIndex + 1);
          const updated = [...sliced, nextState];
          if (updated.length > 50) updated.shift();
          return updated;
        });
        setHistoryIndex((oldIdx) => Math.min(oldIdx + 1, 49));
      }
      return nextState;
    });
  }, [historyIndex]);

  // Undo / Redo logic
  const handleUndo = useCallback(() => {
    if (historyIndex > 0) {
      const prevIdx = historyIndex - 1;
      setHistoryIndex(prevIdx);
      setMagazine(history[prevIdx]);
    }
  }, [history, historyIndex]);

  const handleRedo = useCallback(() => {
    if (historyIndex < history.length - 1) {
      const nextIdx = historyIndex + 1;
      setHistoryIndex(nextIdx);
      setMagazine(history[nextIdx]);
    }
  }, [history, historyIndex]);

  // Global Keyboard Shortcuts 已移至下方统一处理 / Moved to unified handler below

  // Restore saved project state on mount
  useEffect(() => {
    let isMounted = true;
    loadProjectFromStorage().then((stored) => {
      if (!isMounted) return;
      if (stored && stored.magazine && stored.magazine.spreads?.length > 0) {
        setMagazine(stored.magazine);
        if (stored.photoAssets && stored.photoAssets.length > 0) {
          setPhotoAssets(stored.photoAssets);
        }
        setHistory([stored.magazine]);
        setHistoryIndex(0);
        setSaveStatus('restored');
        setTimeout(() => setSaveStatus('saved'), 2500);
      }
      isInitialMount.current = false;
      // 关闭骨架屏 / Dismiss skeleton screen
      setIsInitialLoading(false);
    }).catch(() => {
      if (isMounted) {
        isInitialMount.current = false;
        setIsInitialLoading(false);
      }
    });
    return () => {
      isMounted = false;
    };
  }, []);

  // Auto-save project whenever magazine or photoAssets change
  useEffect(() => {
    if (isInitialMount.current) return;
    setSaveStatus('saving');
    const timer = setTimeout(() => {
      saveProjectToStorage(magazine, photoAssets).then((success) => {
        if (success) setSaveStatus('saved');
      });
    }, 600);
    return () => clearTimeout(timer);
  }, [magazine, photoAssets]);

  const currentSpread = magazine.spreads[activeSpreadIndex] || magazine.spreads[0];
  const activePage = activePageSide === 'left' || currentSpread.isCover ? currentSpread.leftPage : (currentSpread.rightPage || currentSpread.leftPage);

  // Handlers
  const handleSelectText = (txt: TextElement) => {
    setSelectedText(txt);
    setSelectedPhoto(null);

    const s = magazine.spreads[activeSpreadIndex];
    if (s && !s.isCover) {
      if (s.leftPage?.texts.some((t) => t.id === txt.id)) {
        setActivePageSide('left');
      } else if (s.rightPage?.texts.some((t) => t.id === txt.id)) {
        setActivePageSide('right');
      }
    }
  };

  const handleSelectPhoto = (photo: PhotoElement, index: number) => {
    setSelectedPhoto({ element: photo, index });
    setSelectedText(null);

    const s = magazine.spreads[activeSpreadIndex];
    if (s && !s.isCover) {
      if (s.leftPage?.photos.some((p) => p.id === photo.id)) {
        setActivePageSide('left');
      } else if (s.rightPage?.photos.some((p) => p.id === photo.id)) {
        setActivePageSide('right');
      }
    }
  };

  const handleUpdateText = (updatedText: TextElement) => {
    updateMagazineState((prev) => {
      const newSpreads = prev.spreads.map((s, idx) => {
        if (idx !== activeSpreadIndex) return s;

        let updatedLeft = s.leftPage;
        let updatedRight = s.rightPage;

        if (s.leftPage?.texts.some((t) => t.id === updatedText.id)) {
          const newTexts = s.leftPage.texts.map((t) => (t.id === updatedText.id ? updatedText : t));
          updatedLeft = { ...s.leftPage, texts: newTexts };
        }
        if (s.rightPage?.texts.some((t) => t.id === updatedText.id)) {
          const newTexts = s.rightPage.texts.map((t) => (t.id === updatedText.id ? updatedText : t));
          updatedRight = { ...s.rightPage, texts: newTexts };
        }

        return {
          ...s,
          leftPage: updatedLeft,
          rightPage: updatedRight,
        };
      });
      return { ...prev, spreads: newSpreads };
    });
    setSelectedText(updatedText);
  };

  const handleUpdatePhoto = (updatedPhoto: PhotoElement, index: number) => {
    updateMagazineState((prev) => {
      const newSpreads = prev.spreads.map((s, idx) => {
        if (idx !== activeSpreadIndex) return s;

        let updatedLeft = s.leftPage;
        let updatedRight = s.rightPage;

        const isLeftMatch = s.leftPage?.photos.some((p) => p.id === updatedPhoto.id) || (activePageSide === 'left' && s.leftPage?.photos[index]);
        const isRightMatch = s.rightPage?.photos.some((p) => p.id === updatedPhoto.id) || (activePageSide === 'right' && s.rightPage?.photos[index]);

        if (isLeftMatch && s.leftPage) {
          const newPhotos = [...s.leftPage.photos];
          newPhotos[index] = updatedPhoto;
          updatedLeft = { ...s.leftPage, photos: newPhotos };
        } else if (isRightMatch && s.rightPage) {
          const newPhotos = [...s.rightPage.photos];
          newPhotos[index] = updatedPhoto;
          updatedRight = { ...s.rightPage, photos: newPhotos };
        }

        return {
          ...s,
          leftPage: updatedLeft,
          rightPage: updatedRight,
        };
      });
      return { ...prev, spreads: newSpreads };
    });
    setSelectedPhoto({ element: updatedPhoto, index });
  };

  const handleUpdatePhotoByPage = (pageId: string, slotIndex: number, updatedPhoto: PhotoElement) => {
    updateMagazineState((prev) => {
      const newSpreads = prev.spreads.map((s) => {
        let updatedLeft = s.leftPage;
        let updatedRight = s.rightPage;

        if (s.leftPage?.id === pageId) {
          const newPhotos = [...s.leftPage.photos];
          newPhotos[slotIndex] = updatedPhoto;
          updatedLeft = { ...s.leftPage, photos: newPhotos };
        }
        if (s.rightPage?.id === pageId) {
          const newPhotos = [...s.rightPage.photos];
          newPhotos[slotIndex] = updatedPhoto;
          updatedRight = { ...s.rightPage, photos: newPhotos };
        }

        return {
          ...s,
          leftPage: updatedLeft,
          rightPage: updatedRight,
        };
      });
      return { ...prev, spreads: newSpreads };
    });

    if (selectedPhoto?.element.id === updatedPhoto.id || selectedPhoto?.index === slotIndex) {
      setSelectedPhoto({ element: updatedPhoto, index: slotIndex });
    }
  };

  const handleUpdateTextByPage = (pageId: string, textId: string, updatedText: TextElement) => {
    updateMagazineState((prev) => {
      const newSpreads = prev.spreads.map((s) => {
        let updatedLeft = s.leftPage;
        let updatedRight = s.rightPage;

        if (s.leftPage?.id === pageId) {
          const newTexts = s.leftPage.texts.map((t) => (t.id === textId ? updatedText : t));
          updatedLeft = { ...s.leftPage, texts: newTexts };
        }
        if (s.rightPage?.id === pageId) {
          const newTexts = s.rightPage.texts.map((t) => (t.id === textId ? updatedText : t));
          updatedRight = { ...s.rightPage, texts: newTexts };
        }

        return {
          ...s,
          leftPage: updatedLeft,
          rightPage: updatedRight,
        };
      });
      return { ...prev, spreads: newSpreads };
    });

    if (selectedText?.id === textId) {
      setSelectedText(updatedText);
    }
  };

  const handleUpdatePage = (partialPage: Partial<typeof activePage>) => {
    updateMagazineState((prev) => {
      const newSpreads = prev.spreads.map((s, idx) => {
        if (idx !== activeSpreadIndex) return s;
        const pageToUpdate = activePageSide === 'left' || s.isCover ? s.leftPage : s.rightPage;
        if (!pageToUpdate) return s;

        const newPage = { ...pageToUpdate, ...partialPage };

        if ('showSpineLine' in partialPage && !s.isCover && s.rightPage) {
          return {
            ...s,
            leftPage: { ...s.leftPage, showSpineLine: partialPage.showSpineLine! },
            rightPage: { ...s.rightPage, showSpineLine: partialPage.showSpineLine! },
          };
        }

        return {
          ...s,
          leftPage: activePageSide === 'left' || s.isCover ? newPage : s.leftPage,
          rightPage: activePageSide === 'right' && !s.isCover ? newPage : s.rightPage,
        };
      });
      return { ...prev, spreads: newSpreads };
    });
  };

  const handleChangeTemplate = (templateId: string) => {
    const template = MAGAZINE_TEMPLATES.find((t) => t.id === templateId);
    if (!template) return;

    updateMagazineState((prev) => {
      const newSpreads = prev.spreads.map((s, idx) => {
        if (idx !== activeSpreadIndex) return s;
        const pageToUpdate = activePageSide === 'left' || s.isCover ? s.leftPage : s.rightPage;
        if (!pageToUpdate) return s;

        // Preserve existing photos if possible
        const newPhotos: PhotoElement[] = template.defaultPhotos.map((dp, i) => ({
          id: `ph-${Date.now()}-${i}`,
          url: pageToUpdate.photos[i]?.url || dp.url || sampleUnsplashPhoto(i),
          fit: 'cover',
          scale: 1,
          offsetX: 0,
          offsetY: 0,
          filter: dp.filter || 'normal',
          border: false,
        }));

        const newPage = {
          ...pageToUpdate,
          templateId: template.id,
          bgColor: template.bgColor || pageToUpdate.bgColor,
          photos: newPhotos,
          texts: template.defaultTexts,
        };

        return {
          ...s,
          leftPage: activePageSide === 'left' || s.isCover ? newPage : s.leftPage,
          rightPage: activePageSide === 'right' && !s.isCover ? newPage : s.rightPage,
        };
      });
      return { ...prev, spreads: newSpreads };
    });
  };

  const handleDropPhotoSlot = (pageId: string, slotIndex: number, photoUrl: string) => {
    updateMagazineState((prev) => {
      const newSpreads = prev.spreads.map((s) => {
        let left = s.leftPage;
        let right = s.rightPage;

        if (left.id === pageId) {
          const photos = [...left.photos];
          photos[slotIndex] = {
            id: `ph-${Date.now()}`,
            url: photoUrl,
            fit: 'cover',
            scale: 1,
            offsetX: 0,
            offsetY: 0,
            filter: 'normal',
            border: false,
          };
          left = { ...left, photos };
        } else if (right && right.id === pageId) {
          const photos = [...right.photos];
          photos[slotIndex] = {
            id: `ph-${Date.now()}`,
            url: photoUrl,
            fit: 'cover',
            scale: 1,
            offsetX: 0,
            offsetY: 0,
            filter: 'normal',
            border: false,
          };
          right = { ...right, photos };
        }

        return { ...s, leftPage: left, rightPage: right };
      });
      return { ...prev, spreads: newSpreads };
    });
  };

  // Add / Duplicate / Delete Spreads
  const handleAddSpread = () => {
    updateMagazineState((prev) => {
      const nextIndex = prev.spreads.length;
      const leftPageNum = (nextIndex - 1) * 2 + 2;
      const rightPageNum = leftPageNum + 1;

      const templateLeft = MAGAZINE_TEMPLATES[1]; // About template
      const templateRight = MAGAZINE_TEMPLATES[3]; // Breeze template

      const newSpread = {
        id: `spread-${Date.now()}`,
        spreadIndex: nextIndex,
        isCover: false,
        leftPage: {
          id: `p-${leftPageNum}`,
          pageNumber: leftPageNum,
          templateId: templateLeft.id,
          title: `页面 0${leftPageNum}`,
          bgColor: '#ffffff',
          photos: templateLeft.defaultPhotos as any,
          texts: templateLeft.defaultTexts,
          showSpineLine: true,
          showPageNumbers: true,
          brandHeading: '茉域影像 EDITORIAL',
        },
        rightPage: {
          id: `p-${rightPageNum}`,
          pageNumber: rightPageNum,
          templateId: templateRight.id,
          title: `页面 0${rightPageNum}`,
          bgColor: '#faf9f6',
          photos: templateRight.defaultPhotos as any,
          texts: templateRight.defaultTexts,
          showSpineLine: true,
          showPageNumbers: true,
          brandHeading: '茉域影像 EDITORIAL',
        },
      };

      return { ...prev, spreads: [...prev.spreads, newSpread] };
    });
    setActiveSpreadIndex(magazine.spreads.length);
  };

  const handleDuplicateSpread = (index: number) => {
    const target = magazine.spreads[index];
    if (!target) return;

    updateMagazineState((prev) => {
      const newSpread = JSON.parse(JSON.stringify(target));
      newSpread.id = `spread-${Date.now()}`;
      newSpread.leftPage.id = `p-${Date.now()}-l`;
      if (newSpread.rightPage) newSpread.rightPage.id = `p-${Date.now()}-r`;

      const spreads = [...prev.spreads];
      spreads.splice(index + 1, 0, newSpread);
      return { ...prev, spreads };
    });
    setActiveSpreadIndex(index + 1);
  };

  const handleDeleteSpread = (index: number) => {
    if (magazine.spreads.length <= 1) return;
    updateMagazineState((prev) => {
      const spreads = prev.spreads.filter((_, i) => i !== index);
      return { ...prev, spreads };
    });
    setActiveSpreadIndex(Math.max(0, index - 1));
  };

  const handleMoveSpread = (fromIndex: number, toIndex: number) => {
    updateMagazineState((prev) => {
      const spreads = [...prev.spreads];
      const [moved] = spreads.splice(fromIndex, 1);
      spreads.splice(toIndex, 0, moved);
      return { ...prev, spreads };
    });
    setActiveSpreadIndex(toIndex);
  };

  // Reset to default initial magazine
  const handleResetMagazine = () => {
    if (window.confirm('确定要重置排版并还原至示范初始版本吗？')) {
      setMagazine(INITIAL_MAGAZINE);
      setPhotoAssets(SAMPLE_PHOTOS);
      setHistory([INITIAL_MAGAZINE]);
      setHistoryIndex(0);
      clearProjectStorage();
    }
  };

  // Auto fill photos into magazine
  const handleAutoFillMagazine = (photoUrls: string[]) => {
    if (photoUrls.length === 0) return;

    let photoPtr = 0;
    updateMagazineState((prev) => {
      const newSpreads = prev.spreads.map((s) => {
        if (s.isCover) return s;

        const fillPage = (page: typeof s.leftPage) => {
          const photos = page.photos.map((ph) => {
            if (photoPtr < photoUrls.length) {
              const url = photoUrls[photoPtr++];
              return { ...ph, url };
            }
            return ph;
          });
          return { ...page, photos };
        };

        return {
          ...s,
          leftPage: fillPage(s.leftPage),
          rightPage: s.rightPage ? fillPage(s.rightPage) : undefined,
        };
      });
      return { ...prev, spreads: newSpreads };
    });

    setActiveView('editor');
  };

  // Directly apply a photo from the sidebar to currently selected photo slot or active page
  const handleApplyPhotoToSelectedSlot = (photoUrl: string) => {
    if (selectedPhoto) {
      handleUpdatePhoto({ ...selectedPhoto.element, url: photoUrl }, selectedPhoto.index);
    } else {
      const pageToUpdate = activePageSide === 'left' || currentSpread.isCover ? currentSpread.leftPage : currentSpread.rightPage;
      if (pageToUpdate && pageToUpdate.photos.length > 0) {
        handleUpdatePhoto({ ...pageToUpdate.photos[0], url: photoUrl }, 0);
      }
    }
  };

  // 手动保存 / Manual save (Ctrl+S)
  const handleManualSave = useCallback(() => {
    setSaveStatus('saving');
    saveProjectToStorage(magazine, photoAssets).then((success) => {
      if (success) {
        setSaveStatus('saved');
      }
    });
  }, [magazine, photoAssets]);

  // 删除当前选中元素 / Delete currently selected element (Delete / Backspace)
  const handleDeleteSelected = useCallback(() => {
    if (selectedText) {
      updateMagazineState((prev) => {
        const newSpreads = prev.spreads.map((s, idx) => {
          if (idx !== activeSpreadIndex) return s;
          let updatedLeft = s.leftPage;
          let updatedRight = s.rightPage;
          if (s.leftPage?.texts.some((t) => t.id === selectedText.id)) {
            updatedLeft = { ...s.leftPage, texts: s.leftPage.texts.filter((t) => t.id !== selectedText.id) };
          }
          if (s.rightPage?.texts.some((t) => t.id === selectedText.id)) {
            updatedRight = { ...s.rightPage, texts: s.rightPage.texts.filter((t) => t.id !== selectedText.id) };
          }
          return { ...s, leftPage: updatedLeft, rightPage: updatedRight };
        });
        return { ...prev, spreads: newSpreads };
      });
      setSelectedText(null);
    } else if (selectedPhoto) {
      const targetId = selectedPhoto.element.id;
      const targetIndex = selectedPhoto.index;
      updateMagazineState((prev) => {
        const newSpreads = prev.spreads.map((s, idx) => {
          if (idx !== activeSpreadIndex) return s;
          let updatedLeft = s.leftPage;
          let updatedRight = s.rightPage;
          if (s.leftPage?.photos.some((p) => p.id === targetId) || (activePageSide === 'left' && s.leftPage)) {
            const newPhotos = s.leftPage.photos.filter((p) => p.id !== targetId);
            updatedLeft = { ...s.leftPage, photos: newPhotos };
          } else if (s.rightPage?.photos.some((p) => p.id === targetId) || (activePageSide === 'right' && s.rightPage)) {
            const newPhotos = s.rightPage.photos.filter((p) => p.id !== targetId);
            updatedRight = { ...s.rightPage, photos: newPhotos };
          }
          return { ...s, leftPage: updatedLeft, rightPage: updatedRight };
        });
        return { ...prev, spreads: newSpreads };
      });
      setSelectedPhoto(null);
      // 防止未使用变量告警 / Avoid unused var warning
      void targetIndex;
    }
  }, [selectedText, selectedPhoto, activeSpreadIndex, activePageSide, updateMagazineState]);

  // 跨页导航 / Spread navigation (Left / Right arrows)
  const handleNavigateSpread = useCallback((direction: 'prev' | 'next') => {
    setActiveSpreadIndex((prev) => {
      if (direction === 'prev') return Math.max(0, prev - 1);
      return Math.min(magazine.spreads.length - 1, prev + 1);
    });
  }, [magazine.spreads.length]);

  // 复制当前跨页 / Duplicate current spread (Ctrl+D)
  const handleDuplicateCurrentSpread = useCallback(() => {
    handleDuplicateSpread(activeSpreadIndex);
  }, [activeSpreadIndex]);

  // 复制文字元素 / Duplicate a text element
  const handleDuplicateText = useCallback((txt: TextElement) => {
    const newText: TextElement = {
      ...JSON.parse(JSON.stringify(txt)),
      id: `txt-${Date.now()}`,
      offsetX: (txt.offsetX || 0) + 5,
      offsetY: (txt.offsetY || 0) + 5,
    };
    updateMagazineState((prev) => {
      const newSpreads = prev.spreads.map((s, idx) => {
        if (idx !== activeSpreadIndex) return s;
        let updatedLeft = s.leftPage;
        let updatedRight = s.rightPage;
        const pageToUpdate = activePageSide === 'left' || s.isCover ? s.leftPage : s.rightPage;
        if (pageToUpdate?.id === s.leftPage?.id && s.leftPage) {
          updatedLeft = { ...s.leftPage, texts: [...s.leftPage.texts, newText] };
        } else if (pageToUpdate?.id === s.rightPage?.id && s.rightPage) {
          updatedRight = { ...s.rightPage, texts: [...s.rightPage.texts, newText] };
        }
        return { ...s, leftPage: updatedLeft, rightPage: updatedRight };
      });
      return { ...prev, spreads: newSpreads };
    });
    setSelectedText(newText);
  }, [activeSpreadIndex, activePageSide, updateMagazineState]);

  // 添加新文字元素 / Add a new text element to active page
  const handleAddText = useCallback(() => {
    const newText: TextElement = {
      id: `txt-${Date.now()}`,
      type: 'paragraph',
      label: '新文本',
      content: '点击双击编辑文字 / Double-click to edit',
      style: {
        fontFamily: 'LXGW WenKai',
        fontSize: 16,
        fontWeight: '400',
        color: '#1A1A1A',
        letterSpacing: 0,
        lineHeight: 1.6,
        textAlign: 'left',
      },
      offsetX: 0,
      offsetY: 0,
    };
    updateMagazineState((prev) => {
      const newSpreads = prev.spreads.map((s, idx) => {
        if (idx !== activeSpreadIndex) return s;
        let updatedLeft = s.leftPage;
        let updatedRight = s.rightPage;
        const pageToUpdate = activePageSide === 'left' || s.isCover ? s.leftPage : s.rightPage;
        if (pageToUpdate?.id === s.leftPage?.id && s.leftPage) {
          updatedLeft = { ...s.leftPage, texts: [...s.leftPage.texts, newText] };
        } else if (pageToUpdate?.id === s.rightPage?.id && s.rightPage) {
          updatedRight = { ...s.rightPage, texts: [...s.rightPage.texts, newText] };
        }
        return { ...s, leftPage: updatedLeft, rightPage: updatedRight };
      });
      return { ...prev, spreads: newSpreads };
    });
    setSelectedText(newText);
  }, [activeSpreadIndex, activePageSide, updateMagazineState]);

  // 元素右键菜单 / Element context menu (text or photo)
  const handleElementContextMenu = useCallback((e: React.MouseEvent, type: 'text' | 'photo', element: TextElement | PhotoElement) => {
    e.preventDefault();
    e.stopPropagation();
    const items: ContextMenuItem[] = [];

    if (type === 'text') {
      const txt = element as TextElement;
      items.push(
        {
          label: '编辑文字',
          labelEn: 'Edit',
          icon: <Pencil className="w-3.5 h-3.5" />,
          onClick: () => {
            setSelectedText(txt);
            setSelectedPhoto(null);
          },
        },
        {
          label: '复制文本',
          labelEn: 'Duplicate',
          icon: <Copy className="w-3.5 h-3.5" />,
          onClick: () => handleDuplicateText(txt),
          divider: true,
        },
        {
          label: '删除文本',
          labelEn: 'Delete',
          icon: <Trash2 className="w-3.5 h-3.5" />,
          onClick: () => {
            setSelectedText(txt);
            setTimeout(() => handleDeleteSelected(), 0);
          },
          danger: true,
        }
      );
    } else {
      const photo = element as PhotoElement;
      items.push(
        {
          label: '选中图片',
          labelEn: 'Select',
          icon: <ImageIcon className="w-3.5 h-3.5" />,
          onClick: () => {
            // 选中后可从素材库替换 / Select then replace from library
            const pageToUpdate = activePageSide === 'left' || currentSpread.isCover ? currentSpread.leftPage : currentSpread.rightPage;
            const idx = pageToUpdate?.photos.findIndex((p) => p.id === photo.id) ?? -1;
            if (idx >= 0) {
              setSelectedPhoto({ element: photo, index: idx });
            }
          },
          divider: true,
        },
        {
          label: '删除图片',
          labelEn: 'Delete',
          icon: <Trash2 className="w-3.5 h-3.5" />,
          onClick: () => {
            const pageToUpdate = activePageSide === 'left' || currentSpread.isCover ? currentSpread.leftPage : currentSpread.rightPage;
            const idx = pageToUpdate?.photos.findIndex((p) => p.id === photo.id) ?? -1;
            if (idx >= 0) {
              setSelectedPhoto({ element: photo, index: idx });
              setTimeout(() => handleDeleteSelected(), 0);
            }
          },
          danger: true,
        }
      );
    }

    setContextMenu({ x: e.clientX, y: e.clientY, items });
  }, [handleDuplicateText, handleDeleteSelected, activePageSide, currentSpread]);

  // 画布右键菜单 / Canvas context menu (empty area)
  const handleCanvasContextMenu = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    const items: ContextMenuItem[] = [
      {
        label: '添加文本',
        labelEn: 'Add Text',
        icon: <Plus className="w-3.5 h-3.5" />,
        onClick: () => handleAddText(),
      },
      {
        label: '新增跨页',
        labelEn: 'New Spread',
        icon: <FilePlus2 className="w-3.5 h-3.5" />,
        onClick: () => handleAddSpread(),
        divider: true,
      },
      {
        label: '粘贴',
        labelEn: 'Paste',
        icon: <Copy className="w-3.5 h-3.5" />,
        onClick: () => {
          // 粘贴板中的图片 URL / Paste image URL from clipboard
          navigator.clipboard?.readText().then((text) => {
            if (text && (text.startsWith('http') || text.startsWith('data:image'))) {
              handleApplyPhotoToSelectedSlot(text);
            }
          }).catch(() => {});
        },
        disabled: !navigator.clipboard,
      },
    ];
    setContextMenu({ x: e.clientX, y: e.clientY, items });
  }, [handleAddText, handleAddSpread]);

  // 全局快捷键系统 / Global keyboard shortcuts
  // Ctrl+Z/Y 撤销重做, Ctrl+S 保存, Ctrl+E 导出, Ctrl+D 复制页,
  // Ctrl +/- 缩放, 方向键跨页, Delete 删除元素, Esc 取消选择/关闭弹窗
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // 在可编辑文本字段中跳过 / Skip if active element is editable
      const activeEl = document.activeElement;
      const isEditable =
        activeEl &&
        (activeEl.tagName === 'INPUT' ||
          activeEl.tagName === 'TEXTAREA' ||
          (activeEl instanceof HTMLElement && activeEl.isContentEditable));

      const isCtrlOrCmd = e.ctrlKey || e.metaKey;

      // Ctrl/Cmd 组合键 / Ctrl/Cmd combos
      if (isCtrlOrCmd) {
        switch (e.key) {
          case 'z':
          case 'Z':
            e.preventDefault();
            if (e.shiftKey) handleRedo();
            else handleUndo();
            return;
          case 'y':
          case 'Y':
            e.preventDefault();
            handleRedo();
            return;
          case 's':
          case 'S':
            e.preventDefault();
            handleManualSave();
            return;
          case 'e':
          case 'E':
            e.preventDefault();
            setIsExportOpen(true);
            return;
          case 'd':
          case 'D':
            e.preventDefault();
            handleDuplicateCurrentSpread();
            return;
          case '=':
          case '+':
            e.preventDefault();
            setZoomLevel((z) => Math.min(1.8, z + 0.1));
            return;
          case '-':
          case '_':
            e.preventDefault();
            setZoomLevel((z) => Math.max(0.6, z - 0.1));
            return;
          case '0':
            e.preventDefault();
            setZoomLevel(1);
            return;
          default:
            return;
        }
      }

      // 非组合键 - 可编辑字段中跳过 / Non-combo - skip in editable fields
      if (isEditable) return;

      switch (e.key) {
        case 'ArrowLeft':
          e.preventDefault();
          handleNavigateSpread('prev');
          break;
        case 'ArrowRight':
          e.preventDefault();
          handleNavigateSpread('next');
          break;
        case 'Delete':
        case 'Backspace':
          if (selectedText || selectedPhoto) {
            e.preventDefault();
            handleDeleteSelected();
          }
          break;
        case ' ':
          // 空格切换全屏预览 / Space toggles full-screen preview
          // 焦点在按钮上时让其默认激活 / Let Space activate focused buttons
          if (activeEl?.tagName !== 'BUTTON') {
            e.preventDefault();
            setIsPreviewMode((prev) => !prev);
          }
          break;
        case 'Escape':
          // 优先退出预览 / Exit preview first
          if (isPreviewMode) {
            setIsPreviewMode(false);
          } else if (isExportOpen) {
            setIsExportOpen(false);
          } else {
            setSelectedText(null);
            setSelectedPhoto(null);
          }
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [
    handleUndo,
    handleRedo,
    handleManualSave,
    handleDuplicateCurrentSpread,
    handleNavigateSpread,
    handleDeleteSelected,
    selectedText,
    selectedPhoto,
    isExportOpen,
    isPreviewMode,
  ]);

  // 初始加载阶段显示骨架屏 / Show skeleton screen during initial load
  if (isInitialLoading) {
    return <SkeletonEditor />;
  }

  // 全屏预览模式 / Full-screen preview mode
  if (isPreviewMode) {
    return (
      <div className="w-screen h-screen flex items-center justify-center bg-black animate-page-enter relative overflow-hidden">
        {/* 预览画布 / Preview canvas */}
        <div className="flex items-center justify-center w-full h-full p-4">
          <SpreadCanvas spread={currentSpread} zoomLevel={Math.max(1, zoomLevel)} readOnly />
        </div>

        {/* 左右导航箭头 / Navigation arrows */}
        {activeSpreadIndex > 0 && (
          <button
            onClick={() => handleNavigateSpread('prev')}
            className="absolute left-6 top-1/2 -translate-y-1/2 w-12 h-12 flex items-center justify-center bg-white/10 hover:bg-white/20 backdrop-blur-md text-white/80 hover:text-white rounded-full transition-all border border-white/20"
            title="上一页 (←)"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
        )}
        {activeSpreadIndex < magazine.spreads.length - 1 && (
          <button
            onClick={() => handleNavigateSpread('next')}
            className="absolute right-6 top-1/2 -translate-y-1/2 w-12 h-12 flex items-center justify-center bg-white/10 hover:bg-white/20 backdrop-blur-md text-white/80 hover:text-white rounded-full transition-all border border-white/20"
            title="下一页 (→)"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        )}

        {/* 底部状态栏 / Bottom status bar */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-4 bg-white/10 backdrop-blur-md text-white/90 px-5 py-2.5 rounded-full border border-white/20 text-xs font-mono">
          <span className="opacity-70">茉域影像 · 预览模式</span>
          <span className="w-px h-3 bg-white/30" />
          <span>{activeSpreadIndex + 1} / {magazine.spreads.length}</span>
          <span className="w-px h-3 bg-white/30" />
          <span className="opacity-60">Space / Esc 退出</span>
        </div>
      </div>
    );
  }

  return (
    <div className="w-screen h-screen flex flex-col bg-app text-app overflow-hidden font-sans">
      {/* Top Navigation */}
      <Navbar
        activeView={activeView}
        onChangeView={setActiveView}
        onOpenExport={() => setIsExportOpen(true)}
        onResetMagazine={handleResetMagazine}
        zoomLevel={zoomLevel}
        onZoomIn={() => setZoomLevel((z) => Math.min(1.8, z + 0.1))}
        onZoomOut={() => setZoomLevel((z) => Math.max(0.6, z - 0.1))}
        onResetZoom={() => setZoomLevel(1)}
        pageCount={magazine.spreads.length * 2 - 1}
        onUndo={handleUndo}
        onRedo={handleRedo}
        canUndo={historyIndex > 0}
        canRedo={historyIndex < history.length - 1}
        saveStatus={saveStatus}
        isAssetSidebarOpen={isAssetSidebarOpen}
        onToggleAssetSidebar={() => setIsAssetSidebarOpen((prev) => !prev)}
        isDarkMode={isDarkMode}
        onToggleDarkMode={() => setIsDarkMode((prev) => !prev)}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* VIEW 1: 3D FLIPBOOK */}
        {activeView === 'flipbook' && (
          <div key="flipbook-view" className="w-full h-full animate-page-enter">
            <Flipbook3D spreads={magazine.spreads} />
          </div>
        )}

        {/* VIEW 2: LAYOUT EDITOR */}
        {activeView === 'editor' && (
          <div key="editor-view" className="contents animate-page-enter">
            {/* Left Photo Assets Sidebar */}
            <PhotoLibrarySidebar
              photos={photoAssets}
              isOpen={isAssetSidebarOpen}
              onToggleOpen={() => setIsAssetSidebarOpen((v) => !v)}
              onAddPhoto={(p) => setPhotoAssets((prev) => [p, ...prev])}
              onDeletePhoto={(id) => setPhotoAssets((prev) => prev.filter((p) => p.id !== id))}
              onAutoFillMagazine={handleAutoFillMagazine}
              onApplyPhotoToSelectedSlot={handleApplyPhotoToSelectedSlot}
              selectedPhotoIndex={selectedPhoto?.index}
            />

            {/* Central Canvas Container */}
            <div className="flex-1 flex flex-col justify-between overflow-hidden relative bg-[#F0F0EE] dark:bg-neutral-950 transition-colors duration-300">
              {/* Left/Right Page Side Switcher for Inspector */}
              {!currentSpread.isCover && (
                <div className="absolute top-4 left-6 z-20 flex items-center bg-neutral-900/95 backdrop-blur-md p-1.5 border border-amber-500/40 text-xs font-mono shadow-xl rounded-md ring-1 ring-black/20">
                  <div className="w-2 h-2 rounded-full bg-amber-400 animate-pulse mx-1.5 shrink-0" title="当前排版页面" />
                  <button
                    onClick={() => setActivePageSide('left')}
                    className={`px-3.5 py-1 transition-all text-[11px] uppercase tracking-wider rounded-xs ${
                      activePageSide === 'left'
                        ? 'bg-amber-500 text-black font-bold shadow-md ring-1 ring-amber-300'
                        : 'text-amber-200/80 hover:text-white hover:bg-white/10 font-semibold'
                    }`}
                  >
                    左页 LEFT
                  </button>
                  <button
                    onClick={() => setActivePageSide('right')}
                    className={`px-3.5 py-1 transition-all text-[11px] uppercase tracking-wider rounded-xs ${
                      activePageSide === 'right'
                        ? 'bg-amber-500 text-black font-bold shadow-md ring-1 ring-amber-300'
                        : 'text-amber-200/80 hover:text-white hover:bg-white/10 font-semibold'
                    }`}
                  >
                    右页 RIGHT
                  </button>
                </div>
              )}

              {/* 专注模式按钮 - 一键收起两侧面板 / Focus mode toggle */}
              <button
                onClick={() => {
                  const bothOpen = isAssetSidebarOpen && isInspectorOpen;
                  setIsAssetSidebarOpen(!bothOpen);
                  setIsInspectorOpen(!bothOpen);
                }}
                className="absolute top-4 right-6 z-20 w-9 h-9 flex items-center justify-center bg-neutral-900/95 backdrop-blur-md border border-amber-500/40 text-amber-300 hover:text-amber-100 hover:bg-neutral-800 transition-all shadow-xl rounded-md ring-1 ring-black/20"
                title={isAssetSidebarOpen && isInspectorOpen ? '专注模式（收起两侧面板）' : '展开两侧面板'}
              >
                {isAssetSidebarOpen && isInspectorOpen ? (
                  <Minimize2 className="w-4 h-4" />
                ) : (
                  <Maximize2 className="w-4 h-4" />
                )}
              </button>

              {/* Central Canvas */}
              <div className="flex-1 flex items-center justify-center overflow-auto bg-[#F0F0EE] relative p-6 md:p-12">
                <SpreadCanvas
                  spread={currentSpread}
                  selectedElementId={selectedText?.id || selectedPhoto?.element.id}
                  onSelectText={handleSelectText}
                  onSelectPhoto={handleSelectPhoto}
                  onUpdatePhotoByPage={handleUpdatePhotoByPage}
                  onUpdateTextByPage={handleUpdateTextByPage}
                  onDropPhotoSlot={handleDropPhotoSlot}
                  zoomLevel={zoomLevel}
                  onElementContextMenu={handleElementContextMenu}
                  onCanvasContextMenu={handleCanvasContextMenu}
                />
              </div>

              {/* Bottom Spread Timeline Strip */}
              <PageBar
                spreads={magazine.spreads}
                activeIndex={activeSpreadIndex}
                onSelectSpread={setActiveSpreadIndex}
                onAddSpread={handleAddSpread}
                onDuplicateSpread={handleDuplicateSpread}
                onDeleteSpread={handleDeleteSpread}
                onMoveSpread={handleMoveSpread}
              />
            </div>
          </div>
        )}

        {/* VIEW 3: PHOTO ASSET LIBRARY */}
        {activeView === 'library' && (
          <div key="library-view" className="w-full h-full animate-page-enter">
            <PhotoLibrary
            photos={photoAssets}
            onAddPhoto={(p) => setPhotoAssets((prev) => [p, ...prev])}
            onDeletePhoto={(id) => setPhotoAssets((prev) => prev.filter((p) => p.id !== id))}
            onAutoFillMagazine={handleAutoFillMagazine}
          />
          </div>
        )}

        {/* Inspector Side Panel (Only in Layout Editor mode) */}
        {activeView === 'editor' && (
          <InspectorPanel
            activePage={activePage}
            selectedText={selectedText}
            selectedPhoto={selectedPhoto}
            onUpdateText={handleUpdateText}
            onUpdatePhoto={handleUpdatePhoto}
            onUpdatePage={handleUpdatePage}
            onChangeTemplate={handleChangeTemplate}
            onSelectText={handleSelectText}
            onSelectPhoto={handleSelectPhoto}
            isOpen={isInspectorOpen}
            onToggleOpen={() => setIsInspectorOpen((v) => !v)}
            isCover={currentSpread.isCover}
            spreadIndex={activeSpreadIndex}
            totalSpreads={magazine.spreads.length}
            pageSide={activePageSide}
          />
        )}
      </div>

      {/* HD Export Modal */}
      <ExportModal
        spreads={magazine.spreads}
        isOpen={isExportOpen}
        onClose={() => setIsExportOpen(false)}
      />

      {/* 右键上下文菜单 / Right-click context menu */}
      {contextMenu && (
        <ContextMenu
          x={contextMenu.x}
          y={contextMenu.y}
          items={contextMenu.items}
          onClose={() => setContextMenu(null)}
        />
      )}
    </div>
  );
}

function sampleUnsplashPhoto(i: number) {
  const sampleList = [
    'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1502680390469-be75c86b636f?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1511556532299-8f662fc26c06?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1200&q=80',
  ];
  return sampleList[i % sampleList.length];
}

export default App;
