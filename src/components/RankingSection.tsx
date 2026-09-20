'use client';

import React, { useState } from 'react';
import { ComicHomeRankingItem } from '@/types';
import ComicCard from './ComicCard';

interface RankingSectionProps {
  mingguan: ComicHomeRankingItem[];
  harian: ComicHomeRankingItem[];
}

export default function RankingSection({ mingguan, harian }: RankingSectionProps) {
  const [tab, setTab] = useState<'mingguan' | 'harian'>('mingguan');
  const items = tab === 'mingguan' ? mingguan : harian;

  return (
    <section className="space-y-3.5">
      {/* Header Stacked Vertically */}
      <div className="space-y-2">
        <div>
          <span className="text-[11px] font-bold text-brand uppercase tracking-wider block mb-0.5">
            Rankings
          </span>
          <h2 className="text-lg sm:text-2xl font-black text-white">
            Peringkat Terpopuler
          </h2>
        </div>

        {/* Tab Controls: 50% - 50% (Kiri - Kanan) */}
        <div className="grid grid-cols-2 w-full p-1 bg-dark-card border border-dark-border rounded-xl">
          <button
            type="button"
            onClick={() => setTab('mingguan')}
            className={`py-2 rounded-lg text-xs font-bold transition text-center ${
              tab === 'mingguan'
                ? 'bg-brand text-black shadow-glow-gold'
                : 'text-dark-muted hover:text-white'
            }`}
          >
            Mingguan
          </button>
          <button
            type="button"
            onClick={() => setTab('harian')}
            className={`py-2 rounded-lg text-xs font-bold transition text-center ${
              tab === 'harian'
                ? 'bg-brand text-black shadow-glow-gold'
                : 'text-dark-muted hover:text-white'
            }`}
          >
            Harian
          </button>
        </div>
      </div>

      {/* Grid of Top 10 */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4 lg:gap-5">
        {items && items.length > 0 ? (
          items.slice(0, 10).map((item, idx) => (
            <ComicCard
              key={`${tab}-${item.slug}-${idx}`}
              slug={item.slug}
              title={item.title}
              cover={item.cover}
              latestChapter={item.latestChapter}
              meta={item.meta}
              rank={item.rank || idx + 1}
            />
          ))
        ) : (
          <div className="col-span-full py-10 text-center text-dark-muted text-xs">
            Belum ada data peringkat saat ini.
          </div>
        )}
      </div>
    </section>
  );
}
