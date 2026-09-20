import React from 'react';
import Link from 'next/link';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getGenreData } from '@/lib/api';
import ComicCard from '@/components/ComicCard';
import { ChevronLeft, ChevronRight, BookOpen } from 'lucide-react';

export const revalidate = 300;

interface GenreDetailPageProps {
  params: {
    genre: string;
  };
  searchParams: {
    page?: string;
  };
}

export async function generateMetadata({ params }: GenreDetailPageProps): Promise<Metadata> {
  const genreTitle = params.genre.charAt(0).toUpperCase() + params.genre.slice(1);
  return {
    title: `Komik Genre ${genreTitle} Bahasa Indonesia - Komik Verse`,
    description: `Daftar komik manga, manhwa, dan manhua dengan genre ${genreTitle} terpopuler dan terupdate di Komik Verse.`,
  };
}

export default async function GenreDetailPage({ params, searchParams }: GenreDetailPageProps) {
  const currentPage = Math.max(1, parseInt(searchParams.page || '1', 10));
  const data = await getGenreData(params.genre, currentPage);

  if (!data) {
    notFound();
  }

  const results = data.results || [];
  const genres = data.genres || [];
  const hasNext = data.hasNext ?? false;
  const currentGenreName = genres.find((g) => g.slug === params.genre)?.name || params.genre;

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Header Banner */}
      <div className="p-4 sm:p-6 rounded-2xl sm:rounded-3xl bg-dark-card border border-dark-border shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <span className="text-[11px] font-bold text-brand uppercase tracking-wider block mb-0.5">
              Genre Komik
            </span>
            <h1 className="text-xl sm:text-2xl font-black text-white">
              {currentGenreName}
            </h1>
            <p className="text-xs text-dark-muted mt-0.5">
              Menampilkan komik dengan tema {currentGenreName}.
            </p>
          </div>

          <Link
            href="/genre"
            className="px-3.5 py-1.5 rounded-xl bg-dark-surface border border-dark-border text-xs font-bold text-gray-300 hover:text-brand transition self-start sm:self-auto"
          >
            Semua Genre
          </Link>
        </div>
      </div>

      {/* Comics Grid */}
      {results.length > 0 ? (
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
      ) : (
        <div className="py-16 text-center text-dark-muted bg-dark-card rounded-2xl border border-dark-border space-y-2">
          <BookOpen className="w-10 h-10 mx-auto text-dark-muted/60" />
          <p className="text-sm font-bold text-gray-200">Belum ada komik untuk genre ini</p>
          <p className="text-xs">Silakan coba pilih genre lain atau kembali ke halaman utama.</p>
        </div>
      )}

      {/* Pagination Controls */}
      <div className="pt-4 sm:pt-6 border-t border-dark-border flex items-center justify-between">
        {currentPage > 1 ? (
          <Link
            href={`/genre/${params.genre}?page=${currentPage - 1}`}
            className="flex items-center gap-1 px-3.5 py-2 rounded-xl bg-dark-card border border-dark-border text-xs font-bold text-gray-200 hover:text-brand transition"
          >
            <ChevronLeft className="w-4 h-4" />
            Sebelumnya
          </Link>
        ) : (
          <div />
        )}

        <div className="px-3.5 py-1.5 rounded-xl bg-dark-surface border border-dark-border text-xs font-bold text-brand">
          Halaman {currentPage}
        </div>

        {hasNext ? (
          <Link
            href={`/genre/${params.genre}?page=${currentPage + 1}`}
            className="flex items-center gap-1 px-4 py-2 rounded-xl bg-brand text-black text-xs font-bold hover:bg-yellow-400 transition"
          >
            Selanjutnya
            <ChevronRight className="w-4 h-4" />
          </Link>
        ) : (
          <div />
        )}
      </div>
    </div>
  );
}
