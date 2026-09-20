'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Search, ChevronRight, Check } from 'lucide-react';
import { ChapterInfo } from '@/types';
import { extractSlugFromUrl } from '@/lib/utils';
import { getHistory } from '@/lib/storage';

interface ChapterListProps {
  comicSlug: string;
  comicTitle: string;
  chapters: ChapterInfo[];
}

export default function ChapterList({ comicSlug, comicTitle, chapters }: ChapterListProps) {
  const [search, setSearch] = useState('');
  const [isDesc, setIsDesc] = useState(true);
  const [readChapters, setReadChapters] = useState<string[]>([]);

  useEffect(() => {
    const updateReadStatus = () => {
      const history = getHistory();
      const currentComicHistory = history.filter((h) => h.slug === comicSlug);
      setReadChapters(currentComicHistory.map((h) => h.chapterSlug));
    };
    updateReadStatus();
    window.addEventListener('history_updated', updateReadStatus);
    return () => window.removeEventListener('history_updated', updateReadStatus);
  }, [comicSlug]);

  const filtered = chapters.filter((c) => {
    if (!search.trim()) return true;
    return c.title.toLowerCase().includes(search.toLowerCase());
  });

  const sorted = [...filtered].sort((a, b) => {
    if (isDesc) return 0;
    return chapters.indexOf(b) - chapters.indexOf(a);
  });

  return (
    <div className="bg-dark-card border border-dark-border rounded-2xl p-4 sm:p-6 space-y-4">
      {/* Chapter Controls Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-dark-border">
        <div>
          <h3 className="text-base font-black text-white flex items-center gap-2">
            Daftar Chapter
            <span className="text-[11px] px-2 py-0.5 rounded-full bg-dark-surface text-brand border border-brand/40">
              {chapters.length} Total
            </span>
          </h3>
        </div>

        <div className="flex items-center gap-2">
          {/* Search Box */}
          <div className="relative flex-1 sm:w-44">
            <Search className="w-3.5 h-3.5 text-dark-muted absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Cari chapter..."
              className="w-full bg-dark-surface border border-dark-border rounded-xl pl-8 pr-3 py-1.5 text-xs text-gray-100 placeholder-dark-muted focus:outline-none focus:border-brand transition"
            />
          </div>

          {/* Sort Order Toggle */}
          <button
            type="button"
            onClick={() => setIsDesc(!isDesc)}
            className="px-3 py-1.5 rounded-xl bg-dark-surface border border-dark-border text-xs font-bold text-gray-300 hover:text-brand transition shrink-0"
          >
            {isDesc ? 'Terbaru' : 'Terlama'}
          </button>
        </div>
      </div>

      {/* Chapters Grid / List */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 max-h-[520px] overflow-y-auto pr-0.5">
        {sorted.length > 0 ? (
          sorted.map((ch, idx) => {
            const chSlug = extractSlugFromUrl(ch.url);
            const isRead = readChapters.includes(chSlug);

            return (
              <Link
                key={`${ch.url}-${idx}`}
                href={`/baca/${comicSlug}/${chSlug}`}
                className={`group flex items-center justify-between p-2.5 rounded-xl border transition ${
                  isRead
                    ? 'bg-dark-surface/40 border-dark-border/40 text-dark-muted hover:border-brand/40 hover:text-white'
                    : 'bg-dark-surface border-dark-border hover:border-brand hover:bg-dark-card-hover text-gray-200'
                }`}
              >
                <div className="flex items-center gap-2 min-w-0">
                  {isRead ? (
                    <Check className="w-3.5 h-3.5 text-brand shrink-0" />
                  ) : (
                    <div className="w-1.5 h-1.5 rounded-full bg-brand shrink-0" />
                  )}
                  <span className={`text-xs font-bold truncate group-hover:text-brand transition ${isRead ? 'line-through text-gray-400' : ''}`}>
                    {ch.title}
                  </span>
                </div>

                <div className="flex items-center gap-1.5 shrink-0 text-[10px] text-dark-muted">
                  {ch.date && <span>{ch.date}</span>}
                  <ChevronRight className="w-3.5 h-3.5 text-dark-muted group-hover:text-brand transition" />
                </div>
              </Link>
            );
          })
        ) : (
          <div className="col-span-full py-8 text-center text-dark-muted text-xs">
            Tidak menemukan chapter &quot;{search}&quot;.
          </div>
        )}
      </div>
    </div>
  );
}
