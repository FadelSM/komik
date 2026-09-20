'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Play, BookOpen } from 'lucide-react';
import { getHistory } from '@/lib/storage';
import { HistoryItem } from '@/types';

export default function ContinueReadingBanner() {
  const [lastRead, setLastRead] = useState<HistoryItem | null>(null);
  const [imgError, setImgError] = useState(false);

  useEffect(() => {
    const update = () => {
      const history = getHistory();
      if (history && history.length > 0) {
        setLastRead(history[0]);
        setImgError(false);
      } else {
        setLastRead(null);
      }
    };
    update();
    window.addEventListener('history_updated', update);
    return () => window.removeEventListener('history_updated', update);
  }, []);

  if (!lastRead) return null;

  return (
    <div className="p-3.5 sm:p-4 rounded-2xl bg-dark-card border border-brand/50 shadow-glow-gold relative overflow-hidden">
      <div className="flex items-center justify-between gap-3 relative z-10">
        <div className="flex items-center gap-3 min-w-0">
          <div className="relative w-11 h-14 sm:w-12 sm:h-16 shrink-0 rounded-lg overflow-hidden border border-dark-border bg-dark-surface">
            {!imgError && lastRead.cover ? (
              <img
                src={lastRead.cover}
                alt={lastRead.title}
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
                onError={() => setImgError(true)}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-dark-surface text-dark-muted">
                <BookOpen className="w-4 h-4 text-dark-muted/60" />
              </div>
            )}
          </div>
          <div className="min-w-0">
            <span className="text-[10px] font-bold text-brand uppercase tracking-wider block">
              Lanjutkan Membaca
            </span>
            <h3 className="text-xs sm:text-sm font-bold text-white truncate max-w-[200px] sm:max-w-md">
              {lastRead.title}
            </h3>
            <p className="text-[11px] text-dark-muted truncate">
              {lastRead.chapterTitle}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <Link
            href={`/baca/${lastRead.slug}/${lastRead.chapterSlug}`}
            className="px-3.5 sm:px-4 py-2 rounded-xl bg-brand text-black font-extrabold text-xs flex items-center gap-1.5 hover:bg-yellow-400 transition"
          >
            <Play className="w-3.5 h-3.5 fill-black" />
            <span>Lanjut</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
