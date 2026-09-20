'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Bookmark, Share2, Play, BookOpen, Check } from 'lucide-react';
import { isBookmarked, toggleBookmark } from '@/lib/storage';
import { extractSlugFromUrl } from '@/lib/utils';

interface ComicDetailActionsProps {
  slug: string;
  title: string;
  cover: string;
  type: string;
  firstChapterUrl?: string;
  latestChapterUrl?: string;
  firstChapterTitle?: string;
  latestChapterTitle?: string;
}

export default function ComicDetailActions({
  slug,
  title,
  cover,
  type,
  firstChapterUrl,
  latestChapterUrl,
  firstChapterTitle,
  latestChapterTitle,
}: ComicDetailActionsProps) {
  const [bookmarked, setBookmarked] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    setBookmarked(isBookmarked(slug));
  }, [slug]);

  const handleToggle = () => {
    const added = toggleBookmark({
      slug,
      title,
      cover,
      type,
      latestChapter: latestChapterTitle,
    });
    setBookmarked(added);
  };

  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: `Baca ${title} di Komik Verse`,
          url: window.location.href,
        });
      } else {
        await navigator.clipboard.writeText(window.location.href);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }
    } catch (e) {
      // ignore
    }
  };

  const firstChSlug = firstChapterUrl ? extractSlugFromUrl(firstChapterUrl) : '';
  const latestChSlug = latestChapterUrl ? extractSlugFromUrl(latestChapterUrl) : '';

  return (
    <div className="space-y-2.5 pt-2 w-full">
      {/* Row 1: Full-width Baca Sekarang (or Chapter 1) */}
      {firstChSlug ? (
        <Link
          href={`/baca/${slug}/${firstChSlug}`}
          className="w-full py-3 px-4 rounded-xl bg-brand text-black font-black text-sm flex items-center justify-center gap-2 hover:bg-yellow-400 shadow-glow-gold transition active:scale-95 text-center"
        >
          <Play className="w-4 h-4 fill-black" />
          Baca Sekarang
        </Link>
      ) : (
        latestChSlug && (
          <Link
            href={`/baca/${slug}/${latestChSlug}`}
            className="w-full py-3 px-4 rounded-xl bg-brand text-black font-black text-sm flex items-center justify-center gap-2 hover:bg-yellow-400 shadow-glow-gold transition text-center"
          >
            <Play className="w-4 h-4 fill-black" />
            Baca Sekarang
          </Link>
        )
      )}

      {/* Row 2: 50% Chapter Terbaru | 50% Simpan Favorit */}
      <div className="grid grid-cols-2 gap-2.5 w-full">
        {latestChSlug ? (
          <Link
            href={`/baca/${slug}/${latestChSlug}`}
            className="py-2.5 px-3 rounded-xl bg-dark-surface border border-brand/40 text-brand font-bold text-xs flex items-center justify-center gap-1.5 hover:bg-brand/10 transition text-center truncate"
          >
            <BookOpen className="w-3.5 h-3.5 shrink-0" />
            <span className="truncate">{latestChapterTitle || 'Chapter Terbaru'}</span>
          </Link>
        ) : (
          <div className="py-2.5 px-3 rounded-xl bg-dark-surface border border-dark-border text-dark-muted text-xs text-center">
            -
          </div>
        )}

        <button
          type="button"
          onClick={handleToggle}
          className={`py-2.5 px-3 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 border transition ${
            bookmarked
              ? 'bg-brand/20 border-brand text-brand shadow-glow-gold'
              : 'bg-dark-surface border-dark-border text-gray-300 hover:text-white hover:border-brand/40'
          }`}
        >
          <Bookmark className={`w-3.5 h-3.5 shrink-0 ${bookmarked ? 'fill-brand text-brand' : ''}`} />
          <span className="truncate">{bookmarked ? 'Tersimpan' : 'Simpan Favorit'}</span>
        </button>
      </div>

      {/* Row 3: Bagikan Button */}
      <button
        type="button"
        onClick={handleShare}
        className="w-full py-2 px-3 rounded-xl bg-dark-surface border border-dark-border hover:border-brand/40 text-dark-muted hover:text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition"
      >
        {copied ? (
          <>
            <Check className="w-3.5 h-3.5 text-emerald-400" />
            <span className="text-emerald-400 font-bold">Link Berhasil Disalin!</span>
          </>
        ) : (
          <>
            <Share2 className="w-3.5 h-3.5" />
            <span>Bagikan Komik</span>
          </>
        )}
      </button>
    </div>
  );
}
