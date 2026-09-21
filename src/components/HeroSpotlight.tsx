'use client';

import React, { useState, useEffect, useRef, useMemo } from 'react';
import Link from 'next/link';
import { Play, Bookmark } from 'lucide-react';
import { ComicHomeRankingItem } from '@/types';
import { isBookmarked, toggleBookmark } from '@/lib/storage';

interface HeroSpotlightProps {
  items: ComicHomeRankingItem[];
}

export default function HeroSpotlight({ items }: HeroSpotlightProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [bookmarkedMap, setBookmarkedMap] = useState<Record<string, boolean>>({});
  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);

  // Take top 10 spotlight items with memoization
  const heroes = useMemo(() => (items || []).slice(0, 10), [items]);
  const totalSlides = heroes.length;

  // Auto slide every 5 seconds (5000ms) with reliable interval
  useEffect(() => {
    if (totalSlides <= 1) return;

    const timer = setInterval(() => {
      setActiveIndex((prevIndex) => (prevIndex + 1) % totalSlides);
    }, 5000);

    return () => clearInterval(timer);
  }, [totalSlides]);

  // Sync bookmarks state without infinite render loop
  const heroSlugs = useMemo(() => heroes.map((h) => h.slug).join(','), [heroes]);

  useEffect(() => {
    const updateBookmarks = () => {
      const map: Record<string, boolean> = {};
      heroes.forEach((h) => {
        map[h.slug] = isBookmarked(h.slug);
      });
      setBookmarkedMap(map);
    };

    updateBookmarks();

    window.addEventListener('bookmarks_updated', updateBookmarks);
    return () => window.removeEventListener('bookmarks_updated', updateBookmarks);
  }, [heroSlugs]);

  if (totalSlides === 0) return null;

  const current = heroes[activeIndex] || heroes[0];

  const handleToggleBookmark = (item: ComicHomeRankingItem, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const added = toggleBookmark({
      slug: item.slug,
      title: item.title,
      cover: item.cover,
      type: 'Populer',
      latestChapter: item.latestChapter,
    });
    setBookmarkedMap((prev) => ({ ...prev, [item.slug]: added }));
  };

  // Touch Swipe Handlers for Mobile
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.targetTouches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.targetTouches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (touchStartX.current === null || touchEndX.current === null) return;
    const distance = touchStartX.current - touchEndX.current;
    const minSwipeDistance = 45;

    if (distance > minSwipeDistance) {
      // Swiped Left -> Next Slide
      setActiveIndex((prev) => (prev + 1) % totalSlides);
    } else if (distance < -minSwipeDistance) {
      // Swiped Right -> Prev Slide
      setActiveIndex((prev) => (prev - 1 + totalSlides) % totalSlides);
    }

    touchStartX.current = null;
    touchEndX.current = null;
  };

  return (
    <div
      className="relative w-full rounded-2xl sm:rounded-3xl overflow-hidden bg-dark-card border border-dark-border mb-6 sm:mb-10 shadow-2xl select-none"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Background Poster Blur Backdrop */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="w-full h-full relative">
          <img
            src={current.cover}
            alt=""
            className="w-full h-full object-cover blur-3xl opacity-30 scale-125 transition-all duration-700"
            referrerPolicy="no-referrer"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-dark-card via-dark-card/90 to-dark-card/50" />
        <div className="absolute inset-0 bg-gradient-to-r from-dark-card via-dark-card/95 to-transparent" />
      </div>

      {/* Horizontal Sliding Carousel Track with Exact CSS Translation Math */}
      <div
        className="relative z-10 flex transition-transform duration-700 ease-out"
        style={{
          width: `${totalSlides * 100}%`,
          transform: `translateX(-${(activeIndex * 100) / totalSlides}%)`,
        }}
      >
        {heroes.map((item, idx) => {
          const isSaved = bookmarkedMap[item.slug] || false;

          return (
            <div
              key={`${item.slug}-${idx}`}
              className="p-4 sm:p-7 md:p-9 flex flex-col md:flex-row items-center justify-between gap-5 sm:gap-8 min-h-[340px] sm:min-h-[380px]"
              style={{ width: `${100 / totalSlides}%` }}
            >
              {/* Mobile Cover Image on top */}
              <div className="w-full flex items-center justify-center md:hidden pt-2">
                <Link
                  href={`/komik/${item.slug}`}
                  prefetch={true}
                  className="relative w-36 aspect-[3/4] rounded-xl overflow-hidden border-2 border-brand/70 shadow-glow-gold bg-dark-surface shrink-0 block"
                >
                  <img
                    src={item.cover}
                    alt={item.title}
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                    loading={idx === 0 ? 'eager' : 'lazy'}
                  />
                  <span className="absolute top-1.5 left-1.5 px-2 py-0.5 rounded-md text-[9px] font-black bg-brand text-black shadow-sm uppercase">
                    #{item.rank || idx + 1}
                  </span>
                </Link>
              </div>

              {/* Info Column */}
              <div className="flex-1 space-y-3 w-full text-center md:text-left">
                {/* Badge & Metadata */}
                <div className="flex flex-wrap items-center justify-center md:justify-start gap-2">
                  <span className="px-2.5 py-0.5 rounded-md text-[10px] sm:text-xs font-black bg-brand text-black shadow-glow-gold uppercase tracking-wider">
                    Spotlight #{item.rank || idx + 1}
                  </span>
                  {item.latestChapter && (
                    <span className="px-2.5 py-0.5 rounded-md text-[10px] sm:text-xs font-bold bg-dark-surface border border-brand/40 text-brand">
                      {item.latestChapter}
                    </span>
                  )}
                  {item.meta && (
                    <span className="text-[11px] text-dark-muted font-medium">
                      {item.meta}
                    </span>
                  )}
                </div>

                {/* Title */}
                <Link href={`/komik/${item.slug}`} prefetch={true} className="block group">
                  <h2 className="text-lg sm:text-3xl md:text-4xl font-black text-white group-hover:text-brand transition leading-tight line-clamp-2">
                    {item.title}
                  </h2>
                </Link>

                <p className="text-xs sm:text-sm text-gray-300/90 line-clamp-2 leading-relaxed max-w-xl mx-auto md:mx-0">
                  Komik terpopuler minggu ini di Ruang Komik. Nikmati update chapter terbaru dalam bahasa Indonesia dengan kualitas gambar jernih.
                </p>

                {/* CTA Action Buttons */}
                <div className="pt-2 flex items-center justify-center md:justify-start gap-3">
                  <Link
                    href={`/komik/${item.slug}`}
                    prefetch={true}
                    className="px-6 py-2.5 sm:py-3 rounded-xl bg-brand text-black font-black text-xs sm:text-sm flex items-center justify-center gap-2 hover:bg-yellow-400 shadow-glow-gold active:scale-95 transition"
                  >
                    <Play className="w-3.5 h-3.5 fill-black" />
                    <span>Baca Sekarang</span>
                  </Link>

                  <button
                    type="button"
                    onClick={(e) => handleToggleBookmark(item, e)}
                    className={`p-2.5 sm:p-3 rounded-xl font-bold text-xs flex items-center justify-center border transition ${
                      isSaved
                        ? 'bg-brand/20 border-brand text-brand shadow-glow-gold'
                        : 'bg-dark-surface border-dark-border text-gray-300 hover:text-white hover:border-brand/40'
                    }`}
                    title="Simpan ke Favorit"
                  >
                    <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-brand text-brand' : ''}`} />
                  </button>
                </div>
              </div>

              {/* Desktop Right Cover Preview */}
              <Link
                href={`/komik/${item.slug}`}
                prefetch={true}
                className="relative shrink-0 w-44 md:w-52 aspect-[3/4] rounded-2xl overflow-hidden shadow-2xl border-2 border-brand/60 bg-dark-surface hidden md:block group"
              >
                <img
                  src={item.cover}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                  referrerPolicy="no-referrer"
                  loading={idx === 0 ? 'eager' : 'lazy'}
                />
              </Link>
            </div>
          );
        })}
      </div>

      {/* Slide Navigation Dots (Up to 10 items) */}
      <div className="relative z-10 px-4 sm:px-6 py-2.5 bg-dark-bg/90 border-t border-dark-border flex items-center justify-center overflow-x-auto">
        <div className="flex items-center gap-1.5 sm:gap-2">
          {heroes.map((item, idx) => (
            <button
              key={`dot-${item.slug}-${idx}`}
              type="button"
              onClick={() => setActiveIndex(idx)}
              className={`h-2 rounded-full transition-all duration-300 ${
                idx === activeIndex
                  ? 'w-7 sm:w-8 bg-brand shadow-glow-gold'
                  : 'w-2 bg-dark-border hover:bg-gray-600'
              }`}
              aria-label={`Slide ${idx + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
