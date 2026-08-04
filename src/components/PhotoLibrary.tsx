import React, { useRef, useState } from 'react';
import { PhotoAsset } from '../types';
import { Upload, Plus, Sparkles, Trash2, Image as ImageIcon, Check, Loader2 } from 'lucide-react';
import { compressImage } from '../utils/imageCompressor';

interface PhotoLibraryProps {
  photos: PhotoAsset[];
  onAddPhoto: (newPhoto: PhotoAsset) => void;
  onDeletePhoto: (id: string) => void;
  onAutoFillMagazine: (selectedPhotoUrls: string[]) => void;
}

export const PhotoLibrary: React.FC<PhotoLibraryProps> = ({
  photos,
  onAddPhoto,
  onDeletePhoto,
  onAutoFillMagazine,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedUrls, setSelectedUrls] = useState<string[]>(photos.map((p) => p.url));
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [isDragOver, setIsDragOver] = useState<boolean>(false);

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

  const toggleSelectPhoto = (url: string) => {
    setSelectedUrls((prev) =>
      prev.includes(url) ? prev.filter((u) => u !== url) : [...prev, url]
    );
  };

  return (
    <div className="w-full h-full bg-[#F7F7F5] text-[#1A1A1A] p-6 sm:p-10 flex flex-col justify-between overflow-y-auto">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-[#E0E0DB]">
        <div>
          <div className="flex items-center gap-2 text-[#666] font-mono text-xs tracking-widest uppercase">
            <ImageIcon className="w-4 h-4 text-black" />
            <span>PHOTOGRAPHY ASSETS LIBRARY</span>
          </div>
          <h2 className="text-2xl font-bold font-serif text-[#1A1A1A] mt-1">摄影图片管理与素材库</h2>
          <p className="text-[#666] text-xs mt-1">
            上传您的摄影作品集，支持直接拖拽至杂志页面槽位，或点击一键智能套用自动安排排版。
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileUpload}
            multiple
            accept="image/*"
            className="hidden"
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center gap-2 bg-white hover:bg-neutral-100 text-[#1A1A1A] px-4 py-2.5 border border-black text-xs font-mono uppercase tracking-widest transition-all"
          >
            <Upload className="w-4 h-4 text-black" />
            <span>上传摄影原图</span>
          </button>

          <button
            onClick={() => onAutoFillMagazine(selectedUrls)}
            disabled={selectedUrls.length === 0}
            className="flex items-center gap-2 bg-black hover:bg-neutral-800 disabled:opacity-40 text-white font-medium px-5 py-2.5 text-xs font-mono uppercase tracking-widest transition-all"
          >
            <Sparkles className="w-4 h-4" />
            <span>一键智能套用杂志 ({selectedUrls.length}张)</span>
          </button>
        </div>
      </div>

      {/* Upload Drag Drop Area */}
      <div
        onClick={() => fileInputRef.current?.click()}
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragOver(true);
        }}
        onDragLeave={() => setIsDragOver(false)}
        onDrop={handleDropAreaDrop}
        className={`my-6 p-8 border-2 border-dashed transition-all flex flex-col items-center justify-center cursor-pointer group ${
          isDragOver ? 'border-black bg-neutral-100 ring-2 ring-black' : 'border-[#E0E0DB] hover:border-black bg-white'
        }`}
      >
        <div className="w-12 h-12 bg-[#F0F0EE] flex items-center justify-center text-black group-hover:scale-110 transition-transform mb-3 border border-[#E0E0DB]">
          {isProcessing ? (
            <Loader2 className="w-6 h-6 animate-spin text-black" />
          ) : (
            <Plus className="w-6 h-6" />
          )}
        </div>
        <p className="text-sm font-semibold text-[#1A1A1A]">
          {isProcessing ? '正在对摄影作品进行智能 Canvas 2000px 高清压缩...' : '点击或将本地摄影原图拖拽至此处上传'}
        </p>
        <p className="text-xs text-[#888] mt-1 font-mono uppercase tracking-wider">
          {isProcessing ? '自动提升系统性能与内存稳定性' : '支持 JPG, PNG, WEBP, TIFF 高清原图（自动 Canvas 压缩）'}
        </p>
      </div>

      {/* Photo Grid Gallery */}
      <div className="flex-1">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xs font-mono tracking-widest text-[#666] uppercase">
            已就绪图片 ({photos.length} 张)
          </h3>
          <button
            onClick={() => {
              if (selectedUrls.length === photos.length) {
                setSelectedUrls([]);
              } else {
                setSelectedUrls(photos.map((p) => p.url));
              }
            }}
            className="text-xs font-mono text-black underline uppercase tracking-wider"
          >
            {selectedUrls.length === photos.length ? '取消全选' : '全选所有图片'}
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {photos.map((p) => {
            const isSelected = selectedUrls.includes(p.url);
            return (
              <div
                key={p.id}
                draggable
                onDragStart={(e) => {
                  e.dataTransfer.setData('text/plain', p.url);
                }}
                className={`relative group aspect-[4/3] overflow-hidden bg-[#F0F0EE] border transition-all cursor-grab active:cursor-grabbing ${
                  isSelected ? 'border-black ring-2 ring-black' : 'border-[#E0E0DB] hover:border-black'
                }`}
              >
                <img
                  src={p.url}
                  alt={p.title}
                  loading="lazy"
                  decoding="async"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />

                {/* Selection Checkbox */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleSelectPhoto(p.url);
                  }}
                  className={`absolute top-2 left-2 w-6 h-6 flex items-center justify-center transition-all ${
                    isSelected ? 'bg-black text-white' : 'bg-white/80 border border-[#E0E0DB] text-black opacity-0 group-hover:opacity-100'
                  }`}
                >
                  <Check className="w-3.5 h-3.5 stroke-[3]" />
                </button>

                {/* Delete button */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onDeletePhoto(p.id);
                  }}
                  className="absolute top-2 right-2 w-6 h-6 bg-white/80 text-[#666] hover:text-red-600 border border-[#E0E0DB] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all"
                  title="删除此图片"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>

                {/* Hover Drag Tip */}
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/90 to-transparent p-2 pt-6 text-[10px] font-mono text-white truncate opacity-0 group-hover:opacity-100 transition-opacity uppercase tracking-wider">
                  <span>{p.title}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
