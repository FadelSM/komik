import React from 'react';
import Link from 'next/link';
import { Metadata } from 'next';
import { getGenreData } from '@/lib/api';

export const revalidate = 3600; // 1 hour

export const metadata: Metadata = {
  title: 'Daftar Semua Genre Komik - Ruang Komik',
  description: 'Temukan komik berdasarkan genre favorit: Action, Isekai, Romance, Fantasy, Martial Arts, Comedy, Sci-Fi, dan lainnya di Ruang Komik.',
};

export default async function AllGenresPage() {
  const data = await getGenreData('action', 1);
  const genres = data?.genres || [];

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Header Banner */}
      <div className="p-4 sm:p-6 rounded-2xl sm:rounded-3xl bg-dark-card border border-dark-border shadow-xl">
        <span className="text-[11px] font-bold text-brand uppercase tracking-wider block mb-0.5">
          Kategori Lengkap
        </span>
        <h1 className="text-xl sm:text-2xl font-black text-white">
          Daftar Genre Komik
        </h1>
        <p className="text-xs text-dark-muted mt-0.5">
          Pilih dari ratusan genre mulai dari aksi, isekai, kultivasi, fantasi, hingga romansa.
        </p>
      </div>

      {/* Genres Grid without right arrows */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2 sm:gap-2.5">
        {genres.map((g) => (
          <Link
            key={g.slug}
            href={`/genre/${g.slug}`}
            className="p-3 sm:p-3.5 rounded-xl bg-dark-card border border-dark-border hover:border-brand hover:bg-dark-card-hover hover:shadow-glow-gold transition duration-150 flex items-center justify-center text-center group"
          >
            <h3 className="text-xs sm:text-sm font-bold text-gray-200 group-hover:text-brand transition truncate">
              {g.name}
            </h3>
          </Link>
        ))}
      </div>
    </div>
  );
}
