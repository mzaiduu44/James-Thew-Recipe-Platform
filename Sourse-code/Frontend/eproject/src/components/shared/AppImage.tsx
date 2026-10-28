import React, { useState } from 'react';
import { ChefHat } from 'lucide-react';
import { API_BASE_URL } from '@/api/client';

export interface AppImageProps extends Omit<React.ImgHTMLAttributes<HTMLImageElement>, 'src'> {
  src?: string | null;
  alt: string;
  aspectRatio?: 'square' | 'video' | 'portrait' | 'wide' | 'auto';
  className?: string;
  fallbackSrc?: string;
}

const aspectClasses = {
  square: 'aspect-square',
  video: 'aspect-video',
  portrait: 'aspect-[3/4]',
  wide: 'aspect-[16/9]',
  auto: '',
};

export function normalizeImageUrl(src?: string | null): string {
  if (!src) return '';
  const trimmed = src.trim();
  if (
    trimmed.startsWith('http://') ||
    trimmed.startsWith('https://') ||
    trimmed.startsWith('data:') ||
    trimmed.startsWith('blob:')
  ) {
    return trimmed;
  }
  const cleanBase = API_BASE_URL.replace(/\/+$/, '');
  let cleanPath = trimmed.replace(/^\/+/, '');

  if (cleanPath.startsWith('uploads/')) {
    cleanPath = 'upload/' + cleanPath.slice('uploads/'.length);
  }

  if (cleanPath.startsWith('upload/')) {
    return `${cleanBase}/${cleanPath}`;
  }

  return `${cleanBase}/upload/${cleanPath}`;
}


export const AppImage: React.FC<AppImageProps> = ({
  src,
  alt,
  aspectRatio = 'auto',
  className = '',
  fallbackSrc,
  ...props
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  const resolvedSrc = normalizeImageUrl(src);

  return (
    <div
      className={`relative overflow-hidden w-full bg-[#F3ECE0] dark:bg-[#28231D] ${
        aspectRatio !== 'auto' ? aspectClasses[aspectRatio] : ''
      } ${className}`}
    >
      {!isLoaded && !hasError && resolvedSrc && (
        <div className="absolute inset-0 animate-shimmer bg-[#E8DFD1]/60 dark:bg-[#383026]/60 z-0" />
      )}

      {hasError || !resolvedSrc ? (
        fallbackSrc ? (
          <img
            src={fallbackSrc}
            alt={alt}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center p-4 bg-[#F3ECE0] dark:bg-[#28231D] text-[#A69E90] dark:text-[#6E665A]">
            <ChefHat className="w-10 h-10 mb-2 opacity-50 text-[#C9542F]" />
            <span className="text-xs font-mono-label text-center">James Thew Culinary</span>
          </div>
        )
      ) : (
        <img
          src={resolvedSrc}
          alt={alt}
          loading="lazy"
          onLoad={() => setIsLoaded(true)}
          onError={() => setHasError(true)}
          className={`w-full h-full object-cover transition-all duration-700 ease-out ${
            isLoaded ? 'opacity-100 scale-100 filter-none' : 'opacity-0 scale-105 blur-sm'
          }`}
          {...props}
        />
      )}
    </div>
  );
};

export default AppImage;
