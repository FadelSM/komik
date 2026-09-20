'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Bookmark, BookOpen } from 'lucide-react';
import { getTypeBadgeStyle } from '@/lib/utils';
import { isBookmarked, toggleBookmark } from '@/lib/storage';

interface ComicCardProps {
  slug: string;
  title: string;
  cover: string;
  type?: string;
  latestChapter?: string;
  meta?: string;
  theme?: string;
  rank?: number | null;
  synopsis?: string;
  className?: string;
  variant?: 'portrait' | 'landscape' | 'rank';
}

export default function ComicCard({
  slug,
  title,
  cover,
  type,
  latestChapter,
  meta,
  theme,
  rank,
  synopsis,
  className = '',
  variant = 'portrait',
}: ComicCardProps) {
  const [bookmarked, setBookmarked] = useState(false);
  const [imgError, setImgError] = useState(false);

  useEffect(() => {
    setBookmarked(isBookmarked(slug));
    const handleUpdate = () => setBookmarked(isBookmarked(slug));
    window.addEventListener('bookmarks_updated', handleUpdate);
    return () => window.removeEventListener('bookmarks_updated', handleUpdate);
  }, [slug]);

  const handleBookmarkClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const added = toggleBookmark({
      slug,
      title,
      cover,
      type: type || 'Komik',
      latestChapter,
    });
    setBookmarked(added);
  };

  const badge = getTypeBadgeStyle(type || theme);

  if (variant === 'landscape') {
    return (
      <div className={`relative group block ${className}`}>
        {/* Full Card Clickable Overlay Link */}
        <Link
          href={`/komik/${slug}`}
          prefetch={true}
          className="absolute inset-0 z-0"
          aria-label={title}
        />

        <div className="relative flex gap-3 p-3 bg-dark-card border border-dark-border rounded-xl group-hover:border-brand/70 group-hover:bg-dark-card-hover transition duration-200 overflow-hidden shadow-sm pointer-events-none">
          {/* Thumbnail */}
          <div className="relative w-20 h-28 sm:w-24 sm:h-32 shrink-0 rounded-lg overflow-hidden bg-dark-surface border border-dark-border/60">
            {!imgError && cover ? (
              <img
                src={cover}
                alt={title}
                onError={() => setImgError(true)}
                className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                referrerPolicy="no-referrer"
                loading="lazy"
              />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center bg-dark-surface text-dark-muted p-2 text-center">
                <BookOpen className="w-5 h-5 text-dark-muted/60" />
              </div>
            )}
            {type && (
              <span className={`absolute top-1 left-1 text-[8px] font-bold px-1.5 py-0.5 rounded border backdrop-blur-md ${badge.bg} ${badge.text} ${badge.border}`}>
                {type}
              </span>
            )}
          </div>

          {/* Details */}
          <div className="flex-1 flex flex-col justify-between min-w-0 py-0.5">
            <div>
              <div className="flex items-center justify-between gap-1 mb-1">
                {theme && (
                  <span className="text-[10px] font-bold text-brand truncate">
                    {theme}
                  </span>
                )}
                <button
                  type="button"
                  onClick={handleBookmarkClick}
                  className={`pointer-events-auto relative z-10 p-1 rounded-md transition ${
                    bookmarked ? 'text-brand bg-brand/10' : 'text-dark-muted hover:text-white'
                  }`}
                  title={bookmarked ? 'Hapus dari favorit' : 'Simpan ke favorit'}
                >
                  <Bookmark className={`w-3.5 h-3.5 ${bookmarked ? 'fill-brand text-brand' : ''}`} />
                </button>
              </div>

              <h3 className="text-xs sm:text-sm font-bold text-gray-100 group-hover:text-brand transition line-clamp-2 leading-snug">
                {title}
              </h3>

              {synopsis && (
                <p className="text-[11px] text-dark-muted line-clamp-2 mt-1">
                  {synopsis}
                </p>
              )}
            </div>

            <div className="flex items-center justify-between gap-2 mt-2 pt-1.5 border-t border-dark-border/40 text-[11px]">
              {latestChapter && (
                <span className="font-bold text-brand">
                  {latestChapter}
                </span>
              )}
              {meta && (
                <span className="text-dark-muted text-[10px] truncate">{meta}</span>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`relative group block ${className}`}>
      {/* Full Card Clickable Overlay Link */}
      <Link
        href={`/komik/${slug}`}
        prefetch={true}
        className="absolute inset-0 z-0"
        aria-label={title}
      />

      <div className="relative bg-dark-card border border-dark-border rounded-xl overflow-hidden group-hover:border-brand/80 group-hover:shadow-glow-gold transition duration-200 flex flex-col h-full pointer-events-none">
        {/* Cover Image */}
        <div className="relative aspect-[3/4] w-full overflow-hidden bg-dark-surface">
          {!imgError && cover ? (
            <img
              src={cover}
              alt={title}
              onError={() => setImgError(true)}
              className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
              referrerPolicy="no-referrer"
              loading="lazy"
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center bg-dark-surface text-dark-muted p-4 text-center">
              <BookOpen className="w-8 h-8 mb-1 text-dark-muted/60" />
              <span className="text-[10px] font-medium">Cover tidak tersedia</span>
            </div>
          )}

          {/* Dark gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-dark-card via-transparent to-black/20 pointer-events-none" />

          {/* Type Badge Top Left */}
          {type && (
            <span className={`absolute top-2 left-2 text-[9px] font-bold px-1.5 py-0.5 rounded border backdrop-blur-md ${badge.bg} ${badge.text} ${badge.border}`}>
              {type}
            </span>
          )}

          {/* Rank Badge if applicable */}
          {rank != null && (
            <div className="absolute top-2 right-2 w-6 h-6 rounded-full bg-black/85 border border-brand text-brand font-black text-[10px] flex items-center justify-center shadow-lg">
              #{rank}
            </div>
          )}

          {/* Bookmark Button (Pointer Events enabled) */}
          <button
            type="button"
            onClick={handleBookmarkClick}
            className={`pointer-events-auto relative z-10 absolute bottom-2 right-2 p-1.5 rounded-lg backdrop-blur-md border transition ${
              bookmarked
                ? 'bg-brand text-black border-brand'
                : 'bg-black/60 text-white/80 border-white/20 hover:text-brand'
            }`}
            title={bookmarked ? 'Tersimpan di favorit' : 'Simpan ke favorit'}
          >
            <Bookmark className={`w-3.5 h-3.5 ${bookmarked ? 'fill-black' : ''}`} />
          </button>

          {/* Latest Chapter Pill Bottom Left */}
          {latestChapter && (
            <div className="absolute bottom-2 left-2 max-w-[70%]">
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-black/85 border border-brand/40 text-brand truncate block shadow-sm">
                {latestChapter}
              </span>
            </div>
          )}
        </div>

        {/* Info Section */}
        <div className="p-2.5 sm:p-3 flex-1 flex flex-col justify-between">
          <div>
            {meta && (
              <p className="text-[10px] font-semibold text-dark-muted mb-0.5 truncate">
                {meta}
              </p>
            )}
            <h3 className="text-xs sm:text-sm font-bold text-gray-100 group-hover:text-brand transition line-clamp-2 leading-snug">
              {title}
            </h3>
          </div>

          {theme && (
            <div className="mt-2 pt-1.5 border-t border-dark-border/40 flex items-center justify-between text-[10px] text-dark-muted">
              <span className="truncate">{theme}</span>
              <span className="text-brand font-bold">Detail</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
