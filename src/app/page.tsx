import React from 'react';
import Link from 'next/link';
import { getHomeData } from '@/lib/api';
import HeroSpotlight from '@/components/HeroSpotlight';
import RankingSection from '@/components/RankingSection';
import ContinueReadingBanner from '@/components/ContinueReadingBanner';
import ComicCard from '@/components/ComicCard';
import { Search } from 'lucide-react';

export const revalidate = 300; // 5 minutes

export default async function HomePage() {
  const homeData = await getHomeData();

  const mingguan = homeData?.ranking?.mingguan || [];
  const harian = homeData?.ranking?.harian || [];
  const terbaru = homeData?.terbaru || [];
  const baruDitambahkan = homeData?.baruDitambahkan || [];

  const popularGenres = [
    { name: 'Action', slug: 'action' },
    { name: 'Isekai', slug: 'isekai' },
    { name: 'Romance', slug: 'romance' },
    { name: 'Fantasy', slug: 'fantasy' },
    { name: 'Adventure', slug: 'adventure' },
    { name: 'Martial Arts', slug: 'martial-arts' },
    { name: 'Comedy', slug: 'comedy' },
    { name: 'Drama', slug: 'drama' },
    { name: 'Shounen', slug: 'shounen' },
    { name: 'Supernatural', slug: 'supernatural' },
  ];

  return (
    <div className="space-y-6 sm:space-y-10">
      {/* Hero Spotlight / Promotional Showcase */}
      {mingguan.length > 0 && <HeroSpotlight items={mingguan} />}

      {/* Format Category Selector - 3 Clean Cards */}
      <section className="grid grid-cols-3 gap-2.5 sm:gap-4">
        <Link
          href="/pustaka?tipe=manhwa"
          className="p-3 sm:p-5 rounded-xl sm:rounded-2xl bg-dark-card border border-dark-border hover:border-brand hover:shadow-glow-gold transition text-center sm:text-left group"
        >
          <span className="text-[9px] sm:text-[11px] font-bold text-dark-muted block uppercase tracking-wider">
            Korea
          </span>
          <h3 className="text-sm sm:text-lg font-black text-brand group-hover:text-yellow-400 transition mt-0.5">
            Manhwa
          </h3>
          <p className="text-[11px] text-dark-muted mt-0.5 hidden sm:block">
            Format scroll vertikal berwarna
          </p>
        </Link>

        <Link
          href="/pustaka?tipe=manga"
          className="p-3 sm:p-5 rounded-xl sm:rounded-2xl bg-dark-card border border-dark-border hover:border-brand hover:shadow-glow-gold transition text-center sm:text-left group"
        >
          <span className="text-[9px] sm:text-[11px] font-bold text-dark-muted block uppercase tracking-wider">
            Jepang
          </span>
          <h3 className="text-sm sm:text-lg font-black text-brand group-hover:text-yellow-400 transition mt-0.5">
            Manga
          </h3>
          <p className="text-[11px] text-dark-muted mt-0.5 hidden sm:block">
            Komik hitam putih klasik
          </p>
        </Link>

        <Link
          href="/pustaka?tipe=manhua"
          className="p-3 sm:p-5 rounded-xl sm:rounded-2xl bg-dark-card border border-dark-border hover:border-brand hover:shadow-glow-gold transition text-center sm:text-left group"
        >
          <span className="text-[9px] sm:text-[11px] font-bold text-dark-muted block uppercase tracking-wider">
            China
          </span>
          <h3 className="text-sm sm:text-lg font-black text-brand group-hover:text-yellow-400 transition mt-0.5">
            Manhua
          </h3>
          <p className="text-[11px] text-dark-muted mt-0.5 hidden sm:block">
            Kultivasi & aksi reinkarnasi
          </p>
        </Link>
      </section>

      {/* Search Input Box Area - Right Below the 3 Format Category Cards */}
      <section className="relative">
        <form action="/search" method="GET" className="relative flex items-center">
          <Search className="w-4 h-4 text-brand absolute left-4 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            name="q"
            placeholder="Cari judul komik, manga, manhwa, manhua..."
            className="w-full bg-dark-card border border-dark-border hover:border-brand/60 focus:border-brand rounded-2xl pl-11 pr-24 py-3 sm:py-3.5 text-xs sm:text-sm text-gray-100 placeholder-dark-muted focus:outline-none shadow-sm transition"
          />
          <button
            type="submit"
            className="absolute right-2 px-4 sm:px-5 py-2 rounded-xl bg-brand text-black font-extrabold text-xs hover:bg-yellow-400 transition shadow-sm"
          >
            Cari
          </button>
        </form>
      </section>

      {/* User's Continue Reading Resume Bar - Placed Right Below Search */}
      <ContinueReadingBanner />

      {/* Hall of Fame / Rankings Section */}
      <RankingSection mingguan={mingguan} harian={harian} />

      {/* Quick Genre Pills */}
      <section className="space-y-2.5">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-brand uppercase tracking-wider">
            Genre Populer
          </span>
          <Link
            href="/genre"
            className="text-xs font-semibold text-dark-muted hover:text-brand transition"
          >
            Lihat Semua
          </Link>
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          {popularGenres.map((g) => (
            <Link
              key={g.slug}
              href={`/genre/${g.slug}`}
              className="px-3.5 py-1.5 rounded-xl bg-dark-card border border-dark-border text-xs font-bold text-gray-300 hover:text-brand hover:border-brand transition shrink-0"
            >
              #{g.name}
            </Link>
          ))}
        </div>
      </section>

      {/* Update Komik Terbaru */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold text-brand uppercase tracking-wider block mb-0.5">
              Rilis Terkini
            </span>
            <h2 className="text-lg sm:text-2xl font-black text-white">
              Update Komik Terbaru
            </h2>
          </div>
          <Link
            href="/pustaka"
            className="text-xs font-bold text-brand hover:underline"
          >
            Buka Pustaka
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4 lg:gap-5">
          {terbaru.slice(0, 20).map((item, idx) => (
            <ComicCard
              key={`terbaru-${item.slug}-${idx}`}
              slug={item.slug}
              title={item.title}
              cover={item.cover}
              latestChapter={item.latestChapter}
              meta={item.meta}
            />
          ))}
        </div>
      </section>

      {/* Baru Ditambahkan */}
      {baruDitambahkan.length > 0 && (
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-[11px] font-bold text-brand uppercase tracking-wider block mb-0.5">
                Koleksi Baru
              </span>
              <h2 className="text-lg sm:text-2xl font-black text-white">
                Baru Ditambahkan
              </h2>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
            {baruDitambahkan.slice(0, 9).map((item, idx) => (
              <ComicCard
                key={`baru-${item.slug}-${idx}`}
                slug={item.slug}
                title={item.title}
                cover={item.cover}
                latestChapter={item.latestChapter}
                meta={item.meta}
                variant="landscape"
              />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
