'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Bookmark } from 'lucide-react';
import { getBookmarks } from '@/lib/storage';
import { BookmarkItem } from '@/types';
import ComicCard from '@/components/ComicCard';

export default function FavoritPage() {
  const [bookmarks, setBookmarks] = useState<BookmarkItem[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setBookmarks(getBookmarks());

    const handleUpdate = () => {
      setBookmarks(getBookmarks());
    };
    window.addEventListener('bookmarks_updated', handleUpdate);
    return () => window.removeEventListener('bookmarks_updated', handleUpdate);
  }, []);

  return (
    <div className="space-y-5">
      {/* Compact Status Bar */}
      <div className="flex items-center justify-between p-3.5 sm:p-4 rounded-xl bg-dark-card border border-dark-border">
        <h1 className="text-sm sm:text-base font-bold text-white">
          Komik Favorit
        </h1>
        <span className="text-xs font-bold text-brand bg-dark-surface px-3 py-1 rounded-lg border border-brand/40">
          {mounted ? bookmarks.length : 0} Tersimpan
        </span>
      </div>

      {/* Bookmarks Grid */}
      {mounted && bookmarks.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4 lg:gap-5">
          {bookmarks.map((item) => (
            <div key={item.slug} className="relative group">
              <ComicCard
                slug={item.slug}
                title={item.title}
                cover={item.cover}
                type={item.type}
                latestChapter={item.latestChapter}
              />
            </div>
          ))}
        </div>
      ) : (
        <div className="py-16 text-center text-dark-muted bg-dark-card rounded-2xl border border-dark-border space-y-3">
          <div className="w-12 h-12 rounded-full bg-dark-surface border border-brand/40 flex items-center justify-center mx-auto text-brand">
            <Bookmark className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-gray-200">
            Belum ada komik di daftar favorit
          </h3>
          <p className="text-xs max-w-sm mx-auto text-dark-muted">
            Klik icon bookmark pada komik manapun untuk menambahkannya ke koleksi favoritmu.
          </p>
          <div className="pt-1">
            <Link
              href="/"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-brand text-black text-xs font-extrabold hover:bg-yellow-400 transition"
            >
              Cari Komik Menarik
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
