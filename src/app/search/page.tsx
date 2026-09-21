import React from 'react';
import Link from 'next/link';
import { Metadata } from 'next';
import { searchComics } from '@/lib/api';
import ComicCard from '@/components/ComicCard';
import { Search, BookOpen } from 'lucide-react';

interface SearchPageProps {
  searchParams: {
    q?: string;
    page?: string;
  };
}

export async function generateMetadata({ searchParams }: SearchPageProps): Promise<Metadata> {
  const query = searchParams.q || '';
  return {
    title: query ? `Hasil Pencarian "${query}" - Ruang Komik` : 'Pencarian Komik - Ruang Komik',
    description: `Cari dan baca komik favoritmu dengan kata kunci ${query} di Ruang Komik.`,
  };
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const query = (searchParams.q || '').trim();
  const currentPage = Math.max(1, parseInt(searchParams.page || '1', 10));

  const data = query ? await searchComics(query, currentPage) : null;
  const results = data?.results || [];

  return (
    <div className="space-y-8">
      {/* Search Header Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-dark-card border-2 border-dark-border relative overflow-hidden shadow-xl">
        <div className="relative z-10 max-w-2xl space-y-4">
          <div className="flex items-center gap-2 text-xs font-bold text-brand uppercase tracking-wider">
            <Search className="w-4 h-4 text-brand" />
            Pencarian Komik
          </div>

          <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-white">
            {query ? (
              <>
                Hasil Pencarian: <span className="text-brand">&quot;{query}&quot;</span>
              </>
            ) : (
              'Cari Komik Favoritmu'
            )}
          </h1>

          {/* Search Form */}
          <form action="/search" method="GET" className="relative flex items-center">
            <input
              type="text"
              name="q"
              defaultValue={query}
              placeholder="Ketik judul manga, manhwa, manhua..."
              className="w-full bg-dark-surface border-2 border-dark-border rounded-2xl pl-4 pr-28 py-3.5 text-sm text-gray-100 placeholder-dark-muted focus:outline-none focus:border-brand shadow-inner transition"
            />
            <button
              type="submit"
              className="absolute right-2 px-5 py-2 rounded-xl bg-brand text-black font-extrabold text-xs hover:bg-yellow-400 transition"
            >
              Cari
            </button>
          </form>
        </div>
      </div>

      {/* Results Section */}
      {query ? (
        results.length > 0 ? (
          <div className="space-y-4">
            <div className="flex items-center justify-between text-xs text-dark-muted font-bold">
              <span>Ditemukan {results.length} komik untuk kata kunci &quot;{query}&quot;</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4 lg:gap-5">
              {results.map((item, idx) => (
                <ComicCard
                  key={`${item.slug}-${idx}`}
                  slug={item.slug}
                  title={item.title}
                  cover={item.cover}
                  type={item.type}
                  theme={item.theme}
                  latestChapter={item.chapters?.latest?.title}
                  synopsis={item.synopsis}
                />
              ))}
            </div>
          </div>
        ) : (
          <div className="py-16 text-center text-dark-muted bg-dark-card rounded-3xl border border-dark-border space-y-4">
            <BookOpen className="w-12 h-12 mx-auto text-dark-muted/60" />
            <h3 className="text-lg font-bold text-gray-200">
              Tidak ada komik yang cocok dengan &quot;{query}&quot;
            </h3>
            <p className="text-xs max-w-md mx-auto text-dark-muted">
              Pastikan ejaan judul sudah benar atau coba gunakan kata kunci yang lebih umum.
            </p>
            <div className="pt-2">
              <Link
                href="/pustaka"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-brand text-black text-xs font-bold hover:bg-yellow-400 transition"
              >
                Jelajahi Pustaka Komik
              </Link>
            </div>
          </div>
        )
      ) : (
        <div className="py-16 text-center text-dark-muted bg-dark-card rounded-3xl border border-dark-border space-y-3">
          <div className="w-12 h-12 rounded-full bg-dark-surface border border-brand/40 flex items-center justify-center mx-auto text-brand">
            <Search className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-gray-200">
            Ketik kata kunci di atas untuk mencari
          </h3>
          <p className="text-xs text-dark-muted">
            Cari berdasarkan judul komik, karakter, atau genre.
          </p>
        </div>
      )}
    </div>
  );
}
