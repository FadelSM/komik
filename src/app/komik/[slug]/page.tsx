import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { getComicDetail } from '@/lib/api';
import { getTypeBadgeStyle } from '@/lib/utils';
import ChapterList from '@/components/ChapterList';
import ComicDetailActions from '@/components/ComicDetailActions';
import RelatedComics from '@/components/RelatedComics';
import { BookOpen } from 'lucide-react';

interface ComicDetailPageProps {
  params: {
    slug: string;
  };
}

export async function generateMetadata({ params }: ComicDetailPageProps): Promise<Metadata> {
  const comic = await getComicDetail(params.slug);
  if (!comic) {
    return {
      title: 'Komik Tidak Ditemukan - Komik Verse',
    };
  }
  return {
    title: `${comic.title} Bahasa Indonesia - Komik Verse`,
    description: comic.synopsis ? comic.synopsis.slice(0, 160) : `Baca komik ${comic.title} online gratis di Komik Verse.`,
  };
}

export default async function ComicDetailPage({ params }: ComicDetailPageProps) {
  const comic = await getComicDetail(params.slug);

  if (!comic) {
    notFound();
  }

  const badge = getTypeBadgeStyle(comic.type);
  const chaptersList = comic.chapters?.list || [];

  return (
    <div className="space-y-5 sm:space-y-7">
      {/* Hero Header Banner (No Breadcrumbs) */}
      <div className="relative rounded-2xl sm:rounded-3xl overflow-hidden bg-dark-card border border-dark-border p-4 sm:p-7 md:p-8 shadow-2xl">
        {/* Background Backdrop Blur */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="w-full h-full opacity-20 blur-3xl scale-125">
            <img
              src={comic.cover || ''}
              alt=""
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-dark-card via-dark-card/90 to-transparent" />
        </div>

        <div className="relative z-10 flex flex-col sm:flex-row gap-5 sm:gap-7 items-center sm:items-start">
          {/* Cover Poster */}
          <div className="relative w-36 sm:w-48 md:w-56 aspect-[3/4] shrink-0 rounded-2xl overflow-hidden border-2 border-brand/70 shadow-glow-gold bg-dark-surface">
            {comic.cover ? (
              <img
                src={comic.cover}
                alt={comic.title}
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center p-4 text-dark-muted">
                <BookOpen className="w-10 h-10 mb-1 text-dark-muted/60" />
                <span className="text-[10px] font-semibold">Cover Komik</span>
              </div>
            )}
            <span className={`absolute top-2 left-2 text-[9px] font-bold px-1.5 py-0.5 rounded border backdrop-blur-md ${badge.bg} ${badge.text} ${badge.border}`}>
              {comic.type || 'Komik'}
            </span>
          </div>

          {/* Details & Info */}
          <div className="flex-1 space-y-3 sm:space-y-4 w-full text-center sm:text-left">
            <div>
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-1.5 mb-2">
                {comic.rating && (
                  <span className="px-2 py-0.5 rounded-md text-[11px] font-bold bg-dark-surface border border-brand/40 text-brand">
                    {comic.rating}
                  </span>
                )}
                {comic.readingDirection && (
                  <span className="px-2 py-0.5 rounded-md text-[11px] font-semibold bg-dark-surface border border-dark-border text-dark-muted">
                    {comic.readingDirection}
                  </span>
                )}
                {comic.theme && (
                  <span className="px-2 py-0.5 rounded-md text-[11px] font-semibold bg-dark-surface border border-dark-border text-gray-300">
                    {comic.theme}
                  </span>
                )}
              </div>

              <h1 className="text-xl sm:text-3xl md:text-4xl font-black text-white leading-tight">
                {comic.title}
              </h1>

              {comic.alternativeTitle && (
                <p className="text-xs text-dark-muted italic mt-1">
                  {comic.alternativeTitle}
                </p>
              )}
            </div>

            {/* Metadata Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 py-2.5 border-y border-dark-border text-xs">
              <div>
                <span className="text-dark-muted block text-[11px]">Penulis</span>
                <strong className="text-gray-200">{comic.author || 'Tidak Diketahui'}</strong>
              </div>
              <div>
                <span className="text-dark-muted block text-[11px]">Total Chapter</span>
                <strong className="text-brand font-bold">{comic.chapters?.count || chaptersList.length}</strong>
              </div>
              <div>
                <span className="text-dark-muted block text-[11px]">Tipe</span>
                <strong className="text-gray-200">{comic.type || 'Komik'}</strong>
              </div>
            </div>

            {/* Action Buttons: Row 1 Baca Sekarang, Row 2 Chapter Terbaru & Simpan Favorit, Row 3 Bagikan */}
            <ComicDetailActions
              slug={comic.slug}
              title={comic.title}
              cover={comic.cover || ''}
              type={comic.type || 'Komik'}
              firstChapterUrl={comic.chapters?.first?.url}
              latestChapterUrl={comic.chapters?.latest?.url}
              firstChapterTitle={comic.chapters?.first?.title}
              latestChapterTitle={comic.chapters?.latest?.title}
            />
          </div>
        </div>
      </div>

      {/* Genres & Synopsis Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 sm:gap-6">
        {/* Left 2 Cols: Synopsis & Chapters */}
        <div className="lg:col-span-2 space-y-5 sm:space-y-6">
          {/* Synopsis with Justify text */}
          <div className="bg-dark-card border border-dark-border rounded-2xl p-4 sm:p-6 space-y-3">
            <h3 className="text-sm font-black text-white uppercase tracking-wider">
              Sinopsis
            </h3>
            <p className="text-xs sm:text-sm text-gray-300 leading-relaxed whitespace-pre-line text-justify">
              {comic.synopsis || 'Belum ada ringkasan sinopsis untuk komik ini.'}
            </p>

            {/* Genre Tags */}
            {comic.genre && comic.genre.length > 0 && (
              <div className="pt-3 border-t border-dark-border/60">
                <span className="text-[11px] font-bold text-dark-muted uppercase tracking-wider block mb-2">
                  Genre
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {comic.genre.map((g) => (
                    <Link
                      key={g.slug}
                      href={`/genre/${g.slug}`}
                      className="px-2.5 py-1 rounded-lg bg-dark-surface border border-dark-border text-xs font-semibold text-gray-300 hover:text-brand hover:border-brand transition"
                    >
                      {g.name}
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Chapters List */}
          <ChapterList
            comicSlug={comic.slug}
            comicTitle={comic.title}
            chapters={chaptersList}
          />
        </div>

        {/* Right 1 Col: Rekomendasi Terkait with Covers */}
        <div className="space-y-4">
          <div className="bg-dark-card border border-dark-border rounded-2xl p-4 sm:p-5 space-y-3">
            <h3 className="text-sm font-black text-white uppercase tracking-wider pb-2 border-b border-dark-border">
              Rekomendasi Terkait
            </h3>

            <RelatedComics related={comic.related} />
          </div>
        </div>
      </div>
    </div>
  );
}
