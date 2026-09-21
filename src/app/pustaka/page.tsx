import React from 'react';
import Link from 'next/link';
import { Metadata } from 'next';
import { getPustaka } from '@/lib/api';
import ComicCard from '@/components/ComicCard';
import { ChevronLeft, ChevronRight, BookOpen } from 'lucide-react';

export const revalidate = 300;

interface PustakaPageProps {
  searchParams: {
    tipe?: string;
    page?: string;
  };
}

export const metadata: Metadata = {
  title: 'Pustaka Komik - Manhwa, Manga, Manhua Bahasa Indonesia - Ruang Komik',
  description: 'Jelajahi ribuan koleksi manhwa, manga, dan manhua terupdate lengkap dengan terjemahan bahasa Indonesia di Ruang Komik.',
};

export default async function PustakaPage({ searchParams }: PustakaPageProps) {
  const currentTipe = searchParams.tipe || 'manhwa';
  const currentPage = Math.max(1, parseInt(searchParams.page || '1', 10));

  const data = await getPustaka(currentTipe, currentPage);
  const results = data?.results || [];
  const hasNext = data?.hasNext ?? false;

  const typeTabs = [
    { id: 'manhwa', label: 'Manhwa', origin: 'Korea', desc: 'Format scroll vertikal berwarna' },
    { id: 'manga', label: 'Manga', origin: 'Jepang', desc: 'Komik hitam putih klasik' },
    { id: 'manhua', label: 'Manhua', origin: 'China', desc: 'Kultivasi & aksi reinkarnasi' },
  ];

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* 3 Format Category Boxes - Identical to Beranda Style */}
      <section className="grid grid-cols-3 gap-2.5 sm:gap-4">
        {typeTabs.map((tab) => {
          const isActive = currentTipe === tab.id;
          return (
            <Link
              key={tab.id}
              href={`/pustaka?tipe=${tab.id}&page=1`}
              className={`p-3 sm:p-5 rounded-xl sm:rounded-2xl border transition text-center sm:text-left group ${
                isActive
                  ? 'bg-dark-card border-brand shadow-glow-gold'
                  : 'bg-dark-card/60 border-dark-border hover:border-brand/60'
              }`}
            >
              <span className={`text-[9px] sm:text-[11px] font-bold block uppercase tracking-wider ${isActive ? 'text-brand' : 'text-dark-muted'}`}>
                {tab.origin}
              </span>
              <h3 className={`text-sm sm:text-lg font-black transition mt-0.5 ${isActive ? 'text-brand' : 'text-white group-hover:text-brand'}`}>
                {tab.label}
              </h3>
              <p className="text-[11px] text-dark-muted mt-0.5 hidden sm:block">
                {tab.desc}
              </p>
            </Link>
          );
        })}
      </section>

      {/* Comics Grid */}
      {results.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4 lg:gap-5">
          {results.map((item, idx) => (
            <ComicCard
              key={`${item.slug}-${idx}`}
              slug={item.slug}
              title={item.title}
              cover={item.cover}
              type={item.type || currentTipe}
              theme={item.theme}
              latestChapter={item.chapters?.latest?.title}
              synopsis={item.synopsis}
            />
          ))}
        </div>
      ) : (
        <div className="py-16 text-center text-dark-muted bg-dark-card rounded-2xl border border-dark-border space-y-2">
          <BookOpen className="w-10 h-10 mx-auto text-dark-muted/60" />
          <p className="text-sm font-bold text-gray-200">Tidak ada komik ditemukan</p>
          <p className="text-xs">Coba pilih kategori pustaka yang lain atau kembali ke halaman 1.</p>
        </div>
      )}

      {/* Pagination Controls */}
      <div className="pt-4 sm:pt-6 border-t border-dark-border flex items-center justify-between">
        {currentPage > 1 ? (
          <Link
            href={`/pustaka?tipe=${currentTipe}&page=${currentPage - 1}`}
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
            href={`/pustaka?tipe=${currentTipe}&page=${currentPage + 1}`}
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
