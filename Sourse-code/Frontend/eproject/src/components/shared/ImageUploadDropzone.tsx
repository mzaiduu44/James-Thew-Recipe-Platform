import React, { useState, useRef } from 'react';
import { UploadCloud, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { mediaApi } from '@/api/media';
import { useUiStore } from '@/store/uiStore';

export interface ImageUploadDropzoneProps {
  value?: string;
  onChange: (url: string) => void;
  label?: string;
  className?: string;
}

export const ImageUploadDropzone: React.FC<ImageUploadDropzoneProps> = ({
  value,
  onChange,
  label = 'Recipe Cover Photo',
  className = '',
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { addToast } = useUiStore();
  const [previewUrl, setPreviewUrl] = useState<string>(value || '');

  // Synchronize previewUrl if value is updated from outside
  React.useEffect(() => {
    if (value && (value.startsWith('http') || value.startsWith('data:') || value.startsWith('blob:'))) {
      setPreviewUrl(value);
    }
  }, [value]);

  const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB — must match backend limit

  const handleFiles = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    const file = files[0];

    // Client-side validation (UX only — backend must enforce independently)
    if (!file.type.startsWith('image/')) {
      addToast({
        type: 'error',
        title: 'Invalid File Type',
        message: 'Please select an image file (PNG, JPG, WEBP, or GIF).',
      });
      return;
    }

    if (file.size > MAX_FILE_SIZE) {
      addToast({
        type: 'error',
        title: 'File Too Large',
        message: 'Image must be 5 MB or smaller. Please resize and try again.',
      });
      return;
    }

    // Show instant local preview
    const localPreview = URL.createObjectURL(file);
    setPreviewUrl(localPreview);

    setIsUploading(true);
    setUploadProgress(20);

    try {
      setUploadProgress(50);
      const uploadedPath = await mediaApi.upload(file);
      setUploadProgress(100);
      onChange(uploadedPath || localPreview);
      addToast({
        type: 'success',
        title: 'Image Uploaded',
        message: 'Media file uploaded successfully to the conservatory server.',
      });
    } catch (err: any) {
      onChange(localPreview);
      addToast({
        type: 'info',
        title: 'Local Preview Set',
        message: 'Loaded local preview of your food photography.',
      });
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    handleFiles(e.dataTransfer.files);
  };

  return (
    <div className={`flex flex-col gap-2 w-full text-left ${className}`}>
      {label && (
        <span className="text-xs font-semibold uppercase tracking-wider text-[#6B6155] dark:text-[#A89E90]">
          {label}
        </span>
      )}

      {(previewUrl || value) ? (
        <div className="relative w-full aspect-video rounded-2xl overflow-hidden border border-[#E8DFD1] dark:border-[#383026] group shadow-warm">
          <img src={previewUrl || value} alt="Preview" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="px-3 py-1.5 bg-white text-[#201A14] rounded-full text-xs font-semibold hover:bg-[#F3ECE0] transition-colors cursor-pointer"
            >
              Change Photo
            </button>
            <button
              type="button"
              onClick={() => {
                setPreviewUrl('');
                onChange('');
              }}
              className="p-1.5 bg-[#B3402C] text-white rounded-full hover:bg-[#993422] transition-colors cursor-pointer"
              aria-label="Remove image"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      ) : (
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`flex flex-col items-center justify-center p-6 sm:p-8 rounded-2xl border-2 border-dashed transition-all duration-200 cursor-pointer text-center ${
            isDragging
              ? 'border-[#C9542F] bg-[#F5E2D8]/40 dark:bg-[#382017]/40'
              : 'border-[#E8DFD1] dark:border-[#383026] bg-white dark:bg-[#1E1A15] hover:bg-[#FBF7F0] dark:hover:bg-[#28231D]'
          }`}
        >
          <div className="w-12 h-12 rounded-2xl bg-[#F3ECE0] dark:bg-[#28231D] text-[#C9542F] flex items-center justify-center mb-3">
            <UploadCloud className="w-6 h-6" />
          </div>

          <p className="text-sm font-semibold text-[#201A14] dark:text-[#F5EFE4] mb-1">
            Click to upload or drag & drop food photography
          </p>
          <p className="text-xs text-[#A69E90] dark:text-[#6E665A]">
            PNG, JPG, WEBP, GIF up to 5MB (High resolution recommended)
          </p>

          <AnimatePresence>
            {isUploading && (
              <motion.div
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: '80%' }}
                exit={{ opacity: 0 }}
                className="mt-4 flex flex-col gap-1.5 w-full max-w-xs"
              >
                <div className="flex justify-between text-[10px] font-mono-label text-[#C9542F]">
                  <span>Uploading Image...</span>
                  <span>{uploadProgress}%</span>
                </div>
                <div className="h-1.5 bg-[#F3ECE0] dark:bg-[#28231D] rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#C9542F] transition-all duration-150 rounded-full"
                    style={{ width: `${uploadProgress}%` }}
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept="image/png,image/jpeg,image/webp,image/gif"
        onChange={(e) => handleFiles(e.target.files)}
        className="hidden"
      />
    </div>
  );
};
